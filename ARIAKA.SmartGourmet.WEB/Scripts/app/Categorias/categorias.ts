/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/devextreme/devextreme.d.ts" />

namespace Categorias {
    'use strict'; //vamos a utilizar de manera estricta typescript
    export class CategoriasIndexViewModel {

        public categorias: KnockoutObservableArray<any> = ko.observableArray<any>();  
        public enable: KnockoutObservable<boolean> = ko.observable(true);
        public idRow: KnockoutObservable<number> = ko.observable(0);
        public idRowIndex: KnockoutObservable<number> = ko.observable(-1);
        public nombre: KnockoutObservable<String> = ko.observable("");
        public fecha: KnockoutObservable<any> = ko.observable<any>(null);	

        public limpiar() {
            let formData: any = $('#text-nombre').dxTextBox('option').value;
            formData = "";
         };

          
        getCategoria(): void {
            this.categorias([]);
            $.ajax({
                type: 'GET',
                url: 'api/categorias',
                success: (data: any): void => {
                    for (var i: number = 0; i < data.length; i++) {
                        this.categorias.push({
                            ID: data[i].id,
                            Nombre: data[i].nombre,
                            FechaCreacion: data[i].fechaCreacion
                        });
                    }
                }
            });
        }

        addCategoria(): void {
            let formData: any = $('#text-nombre').dxTextBox('option').value;

            if (formData == "" || formData == null || formData == undefined) {
                DevExpress.ui.notify("No se puede crear categoría, falta nombre", "error", 3000);
                return;
            }
            $.ajax({
                type: 'POST',
                url: 'api/categorias',
                data: {
                    ID: this.idRow,
                    Nombre: formData,
                    FechaCreacion: this.fecha
                 },
                success: (data: any): void => {
                    DevExpress.ui.notify("Datos Guardados Satisfactoriamente", "success", 2000);
                    $('#text-nombre').dxTextBox('instance').repaint();
                }
            }).done((result) => {
                this.getCategoria();
                let grid = $('#grid-cate').dxDataGrid('instance');
                this.limpiar();
                grid.refresh();
                grid.repaint();
                this.idRow(0);
                this.nombre("");
                this.fecha()
            });
        }

        deleteCategoria(id: number): void {
            $.ajax({
                type: 'DELETE',
                url: 'api/categorias/' + id
            }).done((data: any): void => {
                DevExpress.ui.notify("Datos se Eliminaron Satisfactoriamente", "success", 2000);
                $('#text-nombre').dxTextBox('instance').reset();
                let grid = $('#grid-cate').dxDataGrid('instance');
                this.limpiar();
                this.idRow(0);
                this.enable(true);
                grid.refresh();
                grid.repaint();
                }).fail((data: any): void => {
                    DevExpress.ui.notify("No se pueden eliminar los datos", "error", 2000);
                });


        }

        constructor() {
            this.getCategoria();
        }

        textBoxOptions: any = {
            label: "Nombre",
            showClearButton: true,
            value: this.nombre
        }

        dataGridOptions: any = {
            dataSource: this.categorias,
            loadPanel: {
                enabled: true,
                text: 'Cargando datos...'
            },
            selection: {
                mode: "single"
            },
            columns: [{ dataField: 'ID', visible: false }, 'Nombre',
                {
                    dataField: 'FechaCreacion',
                    dataType: 'date',
                    format: 'dd/MM/YY HH:mm'
                }],
            editing: {
                texts: {
                    confirmDeleteMessage: '¿Esta seguro en eliminar registro?'
                }
             },
            onRowRemoved: () => {
                    let index = this.idRow();
                    this.deleteCategoria(index);
             },
            filterRow: {
                visible: true,
                showOperationChooser: true,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Buscar..."
            },
            onRowClick: (e) => {
                this.enable(false);
                let cateData: any = {
                    ID: e.data.ID,
                    Nombre: e.data.Nombre,
                    FechaCreacion: e.data.FechaCreacion
                }
                this.idRow(cateData.ID);
                this.idRowIndex(e.rowIndex);
                this.nombre(cateData.Nombre);
                this.fecha(cateData.FechaCreacion)
            }
        }

        buttonOptionsAdd: any = {
            text: "Guardar",
            icon: "save",
            type: 'success',
            onClick: () => {
                this.addCategoria();
            }
        }

        buttonOptionsDelete: any = {
            text: "Borrar",
            icon: "trash",
            type: 'danger',
            disabled: this.enable,
            onClick: () => {
                let grid = $('#grid-cate').dxDataGrid('instance');
                grid.deleteRow(this.idRowIndex());
                grid.repaint();
             }
        }
    }
}
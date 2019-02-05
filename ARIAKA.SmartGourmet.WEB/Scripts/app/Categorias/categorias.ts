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
       
        getCategoria(): void {
            this.categorias([]);
            //this.fecha();
            $.ajax({
                type: 'GET',
                url: 'api/categorias',
                success: (data: any): void => {
                    for (var i: number = 0; i < data.length; i++) {
                        this.categorias.push({
                            ID: data[i].id,
                            Nombre: data[i].nombre,
                            FechaCreacion: data[i].fecha
                        });
                    }
                }
            });
        }

        addCategoria(): void {
            let formData: any = $('#text-nombre').dxTextBox('option').value;
            $.ajax({
                type: 'POST',
                url: 'api/categorias',
                data: {
                    ID: this.idRow,
                    Nombre: formData,
                    FechaCracion: this.fecha
                    //FechaCracion: moment().format("YYYY-MM-DD HH:mm:ss"),
                },
                success: (data: any): void => {
                    DevExpress.ui.notify("Datos Guardados Satisfactoriamente", "success", 2000);
                    $('#text-nombre').dxTextBox('instance').repaint();
                }
            }).done((result) => {
                this.getCategoria();
                let grid = $('#grid-cate').dxDataGrid('instance');
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
                url: 'api/categorias/' + id,
                success: (data: any): void => {
                    $('#text-nombre').dxTextBox('instance').reset();
                    let grid = $('#grid-cate').dxDataGrid('instance');
                    grid.refresh();
                    grid.repaint();
                }
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
            columns: [{ dataField: 'ID', visible: false }, 'Nombre', { dataField: 'FechaCracion', visible: false },
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
            onRowClick: (e) => {
                this.enable(false);
                let cateData: any = {
                    ID: e.data.ID,
                    Nombre: e.data.Nombre,
                    FechaCracion: e.data.Fecha
                }
                this.idRow(cateData.ID);
                this.idRowIndex(e.rowIndex);
                this.nombre(cateData.Nombre);
                this.fecha(cateData.FechaCracion)
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
                let index = this.idRow();
                grid.deleteRow(this.idRowIndex());
                grid.repaint();
                this.deleteCategoria(index);
            }
        }
    }
}
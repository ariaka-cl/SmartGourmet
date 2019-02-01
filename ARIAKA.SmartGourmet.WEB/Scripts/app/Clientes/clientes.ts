/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Clientes {
    'use strict'
    export class ClientesIndexViewModel {
        public clientes: KnockoutObservableArray<any> = ko.observableArray<any>();
        public enable: KnockoutObservable<boolean> = ko.observable(true);
        public idRow: KnockoutObservable<number> = ko.observable(0);
        public idRowIndex: KnockoutObservable<number> = ko.observable(-1);

        buttonOptions: DevExpress.ui.dxButtonOptions = {
            text: "Soy un botón",
            icon: "plus",
            onClick: () => {
                this.getClientes();
            }
        }

        //getClientes(): void {
        //    $.ajax({
        //        type: 'GET',
        //        url: 'api/clientes'
        //    }).done((data: any) => {
        //        DevExpress.ui.notify("Llamada exitosa", "success", 3000);
        //        }).fail((data: any) => {
        //            DevExpress.ui.notify("Error al invocar función", "error", 3000);
        //        })
        //}

        public limpiarForm() {
            let formData: any = $('#form-clientes').dxForm('option').formData;
            formData.ID = 0;
            formData.Nombre = "";
            formData.Apellido = "";
            formData.Telefono = "";
            formData.Direccion = "";
        };

        getClientes(): void {
            this.clientes([]);
            let url = 'api/clientes';
            $.ajax({
                type: 'GET',
                url: url,
            }).done((data: any) => {
                for (var i: number = 0; i < data.length; i++) {
                    this.clientes.push({
                        ID: data[i].id,
                        Nombre: data[i].nombre,
                        Apellido: data[i].apellido,
                        Direccion: data[i].direccion,
                        Telefono: data[i].telefono
                    });
                }
                }).fail((data: any) => {
                    DevExpress.ui.notify(data.responseJSON, "error", 3000);
                });
        }

        addClientes(): void {

            let formData: any = $('#form-clientes').dxForm('option').formData;

            if (formData.Nombre === "") {
                DevExpress.ui.notify("No se puede crear cliente, falta nombre.", "error", 3000);
                return;
            }
            if (formData.Apellido === "") {
                DevExpress.ui.notify("No se puede crear cliente, falta apellido.", "error", 3000);
                return;
            }
            if (formData.Telefono === "") {
                DevExpress.ui.notify("No se puede crear cliente, falta teléfono.", "error", 3000);
                return;
            }

            let url = 'api/clientes';
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    ID: formData.ID,
                    Nombre: formData.Nombre,
                    Apellido: formData.Apellido,
                    Direccion: formData.Direccion,
                    Telefono: formData.Telefono
                }
            }).done((data: any) => {
                DevExpress.ui.notify("Datos guardados correctamente.", "success", 2000);
                $('#form-clientes').dxForm('instance').resetValues();
                this.getClientes();
                let grid = $('#grid-clientes').dxDataGrid('instance');
                this.limpiarForm();
                grid.refresh();
                grid.repaint();
                }).fail((data: any) => {
                    DevExpress.ui.notify(data.responseJSON, "error", 3000);
                });
        }

        deleteCliente(id: number): void {
            let url = 'api/clientes/' + id;
            $.ajax({
                type: 'DELETE',
                url: url
            }).done((data: any) => {
                $('#form-clientes').dxForm('instance').resetValues();
                this.limpiarForm();
                }).fail((data: any) => {
                    DevExpress.ui.notify(data.responseJSON, "error", 3000);
                });
        };

        constructor() {
            this.getClientes();
        }

        formOptions: any = {
            formData: this.clientes,
            labelLocation: "top",
            items: [{
                itemType: "group",
                colCount: 3,
                items: [{
                    dataField: "Nombre",
                    editorType: "dxTextBox",
                    editorOptions: {
                        label: "Nombre",
                        showClearButton: true
                    }
                }, {
                    dataField: "Apellido",
                    editorType: "dxTextBox",
                    editorOptions: {
                        label: "Apellido",
                        showClearButton: true
                    }
                }, {
                    dataField: "Direccion",
                    editorType: "dxTextBox",
                    editorOptions: {
                        label: "Dirección",
                        showClearButton: true
                    }
                }, {
                    dataField: "Telefono",
                    editorType: "dxNumberBox",
                    editorOptions: {
                        label: "Teléfono",
                        showClearButton: true
                    }
                }]
            }]
        };

        buttonOptionsClear: any = {
            text: "Limpiar",
            icon: "refresh",
            type: "default",
            disabled: this.enable,
            onClick: () => {
                $('#form-clientes').dxForm('instance').resetValues();
                this.limpiarForm();
                this.idRow(0);
            }
        }

        buttonOptionsDelete: any = {
            text: "Borrar",
            icon: "remove",
            type: 'danger',
            disabled: this.enable,
            onClick: () => {
                let grid = $('#grid-clientes').dxDataGrid('instance');
                let index = this.idRow();
                grid.deleteRow(this.idRowIndex());
                grid.repaint();
                this.deleteCliente(index);
            }
        }

        buttonOptionsAdd: any = {
            text: "Agregar",
            icon: "plus",
            type: 'success',
            onClick: () => {
                this.addClientes();
            }
        }

        dataGridOptions: any = {
            dataSource: this.clientes,
            loadPanel: {
                enabled: true,
                text: 'Cargando datos...'
            },
            selection: {
                mode: "single"
            },
            columns: [{ dataField: 'ID', visible: false }, 'Nombre', 'Apellido', 'Telefono', 'Direccion'],
            editing: {
                texts: {
                    confirmDeleteMessage: '¿Esta seguro en eliminar registro?'
                }
            }, grouping: {
                allowCollapsing: true
            }, groupPanel: {
                allowColumnDragging: true,
                visible: true,
                emptyPanelText: 'Arrastre algunas columnas para agrupar'
            }, export: {
                allowExportSelectedData: true,
                enabled: true,
                fileName: 'clientes'
            }, columnChooser: {
                allowSearch: true
            },
            showBorders: true
            , rowAlternationEnabled: true
            , showRowLines: true
            , showColumnLines: false
            , filterRow: {
                visible: true,
                showOperationChooser: false
            }, onRowClick: (e) => {
                this.enable(false);
                let formData: any = $('#form-clientes').dxForm('option');
                let clienteData: any = {
                    ID: e.data.ID,
                    Nombre: e.data.Nombre,
                    Apellido: e.data.Apellido,
                    Telefono: e.data.Telefono,
                    Direccion: e.data.Direccion
                }
                this.idRow(clienteData.ID);
                this.idRowIndex(e.rowIndex);
                formData.formData = clienteData;
                let form = $('#form-clientes').dxForm('instance');
                form.repaint();
            }
        }
    }
}
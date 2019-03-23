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
                //this.idRow(0);
                this.enable(true);
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
                this.enable(true);
                DevExpress.ui.notify("Cliente eliminado satisfactoriamente", "success", 3000);
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
                colCount: 1,
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
                        showClearButton: true,
                        mode: "tel"
                    }
                }]
            }]
        };

        buttonOptionsDelete: any = {
            text: "Borrar",
            icon: "remove",
            type: 'danger',
            disabled: this.enable,
            onClick: () => {
                let grid = $('#grid-clientes').dxDataGrid('instance');
                grid.deleteRow(this.idRowIndex());
                grid.repaint();
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
            columns: [{ dataField: 'ID', visible: false }, 'Nombre', 'Apellido', 'Direccion', {dataField: 'Telefono', width: "12%"}],
            editing: {
                texts: {
                    confirmDeleteMessage: '¿Esta seguro de eliminar registro de cliente?'
                }
            },
            onRowRemoved: () => {
                let index = this.idRow();
                this.deleteCliente(index);
            },
            grouping: {
                allowCollapsing: true
            },
            export: {
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
        };

        formPopup: any = {
            visible: false,
            width: 500,
            height: 430,
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            dragEnabled: true,
            closeOnOutsideClick: true,
            contentTemplate: (e) => {
                return $('#form-clientes')
            },
            toolbarItems: [{
                toolbar: 'top',
                text: "Añadir cliente",
                location: "center"
            }, {
                widget: "dxButton",
                toolbar: 'bottom',
                location: "after",
                options: {
                    text: "Añadir",
                    icon: "plus",
                    type: 'success',
                    onClick: () => {
                        this.addClientes();
                        let popForm = $('#form-popup').dxPopup('instance');
                        popForm.hide();
                    }
                }
            }]
        };

        addPopup: any = {
            text: "Agregar",
            icon: "plus",
            type: 'success',
            onClick: (e) => {
                $('#form-clientes').dxForm('instance').resetValues();
                this.limpiarForm();
                this.idRow(0);
                this.enable(true);
                let popForm = $('#form-popup').dxPopup('instance');
                popForm.show();
            }
        }

        modifPopup: any = {
            text: "Modificar",
            icon: "edit",
            type: 'default',
            disabled: this.enable,
            onClick: (e) => {
                let popForm = $('#form-popup').dxPopup('instance');
                popForm.show();
            }
        }

    }
}
/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Usuarios {
    'use strict'
    export class UsuariosIndexViewModel {
        public usuarios: KnockoutObservableArray<any> = ko.observableArray<any>();
        public enable: KnockoutObservable<boolean> = ko.observable(true);
        public idRow: KnockoutObservable<number> = ko.observable(0);
        public idRowIndex: KnockoutObservable<number> = ko.observable(-1);
        public tipoRoles: KnockoutObservableArray<any> = ko.observableArray<any>();

        public limpiarForm() {
            let formData: any = $('#form-usuarios').dxForm('option').formData;
            formData.ID = 0;
            formData.Nombre = "";
            formData.Apellido = "";
            formData.Run = "";
            formData.Password = "";
            formData.Rol = "";
        };

        getUsuarios(): void {
            this.usuarios([]);
            let url = 'api/usuarios';
            $.ajax({
                type: 'GET',
                url: url,
            }).done((data: any) => {
                for (var i: number = 0; i < data.length; i++) {
                    this.usuarios.push({
                        ID: data[i].id,
                        Run: data[i].run,
                        Nombre: data[i].nombre,
                        Apellido: data[i].apellido,
                        Password: data[i].password,
                        Rol: data[i].rol
                    });
                }
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        addUsuarios(): void {

            let formData: any = $('#form-usuarios').dxForm('option').formData;

            if (formData.Run === "") {
                DevExpress.ui.notify("No se puede crear usuario, falta RUT.", "error", 3000);
                return;
            }
            if (formData.Nombre === "") {
                DevExpress.ui.notify("No se puede crear usuario, falta nombre.", "error", 3000);
                return;
            }
            if (formData.Apellido === "") {
                DevExpress.ui.notify("No se puede crear usuario, falta apellido.", "error", 3000);
                return;
            }
            if (formData.Password === "") {
                DevExpress.ui.notify("No se puede crear usuario, falta contraseña.", "error", 3000);
                return;
            }
            if (formData.Rol === "") {
                DevExpress.ui.notify("No se puede crear usuario, falta el Rol.", "error", 3000);
                return;
            }
            
            let url = 'api/usuarios';
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    ID: formData.ID,
                    Run: formData.Run,
                    Nombre: formData.Nombre,
                    Apellido: formData.Apellido,
                    Password: formData.Password,
                    Rol: formData.Rol
                }
            }).done((data: any) => {
                DevExpress.ui.notify("Datos guardados correctamente.", "success", 2000);
                $('#form-usuarios').dxForm('instance').resetValues();
                this.getUsuarios();
                let grid = $('#grid-usuarios').dxDataGrid('instance');
                this.limpiarForm();
                //this.idRow(0);
                this.enable(true);
                grid.refresh();
                grid.repaint();
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        deleteUsuario(id: number): void {
            let url = 'api/usuarios/' + id;
            $.ajax({
                type: 'DELETE',
                url: url
            }).done((data: any) => {
                $('#form-usuarios').dxForm('instance').resetValues();
                this.limpiarForm();
                this.enable(true);
                DevExpress.ui.notify("Usuario eliminado satisfactoriamente", "success", 3000);
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        };

        constructor() {
            this.getUsuarios();

            //$.ajax({
            //    type: 'GET',
            //    url: 'api/usuarios/roles'
            //}).done((data: any) => {
            //    for (var i: number = 0; i < data.tipoRol.length; i++) {
            //        this.tipoRoles.push({
            //            Nombre: data.tipoRol[i].nombre,
            //            Clave: data.tipoRol[i].clave,
            //        });
            //    }
            //})
        
            this.tipoRoles([]);
            $.getJSON('api/usuarios/roles').then((result: any): void => {
                for (var i: number = 0; i < result.tipoRol.length; i++) {
                    this.tipoRoles.push({
                        Nombre: result.tipoRol[i].nombre,
                        Clave: result.tipoRol[i].clave,
                    });
                }
                //this.nombreRol(this.tipoRoles.Nombre);
                //this.claveRol(this.tipoRoles.Clave);
                //this.tipoRoles.push(['as', 'qweq']);
                //this.usuarios.rol = this.tipoRoles[0];
                //$("#rolTipo").dxSelectBox({ items: result.tipoRol, displayExpr: 'display', valueExpr: 'value', value: result.tipoRol[0].value });
            });
        }

        formOptions: any = {
            formData: this.usuarios,
            labelLocation: "top",
            items: [{
                itemType: "group",
                colCount: 1,
                items: [{
                    dataField: "Run",
                    editorType: "dxTextBox",
                    maxlength: 10,
                    editorOptions: {
                        label: "RUT",
                        showClearButton: true
                    }
                }, {
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
                    dataField: "Password",
                    editorType: "dxTextBox",
                    editorOptions: {
                        mode: 'password',
                        label: "Contraseña",
                        showClearButton: true
                    }
                }, {
                    dataField: "Rol",
                    editorType: "dxSelectBox",
                    editorOptions: {
                        label: "Rol",
                        showClearButton: true,
                        dataSource: this.tipoRoles,
                        displayExpr: 'Nombre',
                        valueExpr: 'Clave'
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
                let grid = $('#grid-usuarios').dxDataGrid('instance');
                grid.deleteRow(this.idRowIndex());
                grid.repaint();
            }
        }

        dataGridOptions: any = {
            dataSource: this.usuarios,
            loadPanel: {
                enabled: true,
                text: 'Cargando datos...'
            },
            selection: {
                mode: "single"
            },
            columns: [{ dataField: 'ID', visible: false }, 'Run', 'Nombre', 'Apellido', 'Password', { dataField: 'Rol', width: "12%" }],
            editing: {
                texts: {
                    confirmDeleteMessage: '¿Esta seguro de eliminar registro de usuario?'
                }
            },
            onRowRemoved: () => {
                let index = this.idRow();
                this.deleteUsuario(index);
            },
            grouping: {
                allowCollapsing: true
            },
            export: {
                allowExportSelectedData: true,
                enabled: true,
                fileName: 'usuarios'
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
                let formData: any = $('#form-usuarios').dxForm('option');
                let usuarioData: any = {
                    ID: e.data.ID,
                    Run: e.data.Run,
                    Nombre: e.data.Nombre,
                    Apellido: e.data.Apellido,
                    Password: e.data.Password,
                    Rol: e.data.Rol
                }
                this.idRow(usuarioData.ID);
                this.idRowIndex(e.rowIndex);
                formData.formData = usuarioData;
                let form = $('#form-usuarios').dxForm('instance');
                form.repaint();
            }
        };

        formPopup: any = {
            visible: false,
            width: 500,
            height: 510,
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            dragEnabled: true,
            closeOnOutsideClick: true,
            contentTemplate: (e) => {
                return $('#form-usuarios')
            },
            toolbarItems: [{
                toolbar: 'top',
                text: "Añadir usuario",
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
                        this.addUsuarios();
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
                $('#form-usuarios').dxForm('instance').resetValues();
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
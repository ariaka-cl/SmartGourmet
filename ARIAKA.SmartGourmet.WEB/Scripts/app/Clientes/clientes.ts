/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Clientes {
    'use strict'
    export class ClientesIndexViewModel {
        public clientes: KnockoutObservableArray<any> = ko.observableArray<any>();

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
            let url = 'api/clientes' + id;
            $.ajax({
                type: 'DELETE',
                url: url
            }).done((data: any) => {
                $('#form-clientes').dxForm('instance').resetValues();
                this.limpiarForm();
            });
        }

        // Constructor???


    }
}
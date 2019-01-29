/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Clientes {
    'use strict'
    export class ClientesIndexViewModel {
        buttonOptions: DevExpress.ui.dxButtonOptions = {
            text: "Soy un botón",
            icon: "plus",
            onClick: () => {
                this.getClientes();
            }
        }

        getClientes(): void {
            $.ajax({
                type: 'GET',
                url: 'api/clientes'
            }).done((data: any) => {
                DevExpress.ui.notify("Llamada exitosa", "success", 3000);
                }).fail((data: any) => {
                    DevExpress.ui.notify("Error al invocar función", "error", 3000);
                })
        }

    }

}
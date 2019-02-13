/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Mesas {
    'use strict'
    export class MesasIndexViewModel {
        public mesas: KnockoutObservableArray<any> = ko.observableArray<any>();
        public enable: KnockoutObservable<boolean> = ko.observable(true);
        public tipoEstados: KnockoutObservableArray<any> = ko.observableArray<any>();
        public idRowIndex: KnockoutObservable<number> = ko.observable(-1);
        public idRow: KnockoutObservable<number> = ko.observable(0);


        public limpiar() {
            let formData: any = $('#form-mesas').dxForm('option').formData;
            formData.ID = 0;
            formData.NumMesa = "";
            formData.Capacidad = "";
            formData.Estado = "";
        };

        getMesas(): void {
            this.mesas([]);
            let url = 'api/mesas';
            $.ajax({
                type: 'GET',
                url: url,
            }).done((data: any) => {
                for (var i: number = 0; i < data.length; i++) {
                    this.mesas.push({
                        ID: data[i].id,
                        NumMesas: data[i].nummesas,
                        Capacidad: data[i].capacidad,
                        Estado: data[i].estado
                    });
                }
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        addMesas(): void {

            let formData: any = $('#form-usuarios').dxForm('option').formData;

            if (formData.NumMesa == "" || formData.NumMesa == null || formData.NumMesa == undefined) {
                DevExpress.ui.notify("No se puede crear número de mesa, falta número", "error", 3000);
                return;
            }

            if (formData.Capacidad == "" || formData.Capacidad == null || formData.Capacidad == undefined) {
                DevExpress.ui.notify("No se puede crear capacidad, falta capacidad", "error", 3000);
                return;
            }

            if (formData.Estado == "" || formData.Estado == null || formData.Estado == undefined) {
                DevExpress.ui.notify("No se puede crear estado, falta estado", "error", 3000);
                return;
            }

            let url = 'api/mesas';
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    ID: formData.ID,
                    NumMesa: formData.NumMesa,
                    Capacidad: formData.Capacidad,
                    Estado: formData.Estado,
                 }
            }).done((data: any) => {
                DevExpress.ui.notify("Datos guardados correctamente.", "success", 2000);
                $('#form-mesas').dxForm('instance').resetValues();
                this.getMesas();
                //let grid = $('#grid-mesas').dxDataGrid('instance');
                this.limpiar();
                this.enable(true);
                //grid.refresh();
                //grid.repaint();
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        deleteMesas(id: number): void {
            let url = 'api/mesas/' + id;
            $.ajax({
                type: 'DELETE',
                url: url
            }).done((data: any) => {
                $('#form-mesas').dxForm('instance').resetValues();
                this.limpiar();
                this.enable(true);
                DevExpress.ui.notify("Mesa eliminada satisfactoriamente", "success", 3000);
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        };

        constructor() {
            this.getMesas();
            this.tipoEstados([]);
            $.getJSON('api/mesas/estados').then((result: any): void => {
                for (var i: number = 0; i < result.tipoEstados.length; i++) {
                    this.tipoEstados.push({
                        Nombre: result.tipoEstados[i].nombre,
                        Clave: result.tipoEstados[i].clave,
                    });
                }
            });
        }

        formOptions: any = {
            formData: this.mesas,
            labelLocation: "top",
            items: [{
                itemType: "group",
                colCount: 3,
                items: [{
                    dataField: "NumMesa",
                    editorType: "dxTextBox",
                    editorOptions: {
                        showClearButton: true
                    }
                }, {
                    dataField: "Capacidad",
                    editorType: "dxTextBox",
                    editorOptions: {
                        showClearButton: true
                    }
                }, {
                    dataField: "Estado",
                    editorType: "dxTextBox",
                    editorOptions: {
                        showClearButton: true
                    }
                }]
            }]
        };

        tileview: any = {
            dataSource: this.mesas,
            items: null,
            height: 390,
            baseItemHeight: 120,
            baseItemWidth: 185,
            itemMargin: 10,
            //itemTemplate: function (itemData, itemIndex, itemElement) {
                    //itemElement.append("<div class=\"price\">" + Globalize.formatCurrency(itemData.Price, "USD", { maximumFractionDigits: 0 }) +
                        //"</div><div class=\"image\" style=\"background-image: url('" + itemData.ImageSrc + "')\"></div>");
             //}
        };

        buttonOptionsDelete: any = {
            text: "Borrar",
            icon: "remove",
            type: 'trash',
            disabled: this.enable,
            onClick: () => {
                //let grid = $('#tileview-mesas').dxDataGrid('instance');
                //grid.deleteRow(this.idRowIndex());
                //grid.repaint();
            }
        }

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
                return $('#form-mesas')
            },
            toolbarItems: [{
                toolbar: 'top',
                text: "Añadir mesas",
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
                        this.addMesas();
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
                $('#form-mesas').dxForm('instance').resetValues();
                this.limpiar();
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
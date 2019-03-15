/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Mesas {
    'use strict'
    export class MesasIndexViewModel {
        public mesas: KnockoutObservableArray<any> = ko.observableArray<any>();
        public tipoForm: KnockoutObservable<any> = ko.observable<any>();
        public mesaSeleccionada: KnockoutObservable<any> = ko.observable<any>();
        public pedidoMesa: KnockoutObservable<any> = ko.observable<any>();
        public idMesa: KnockoutObservable<any> = ko.observable<any>();
        public enable: KnockoutObservable<boolean> = ko.observable(true);
        public disableMod: KnockoutObservable<boolean> = ko.observable(true);
        public disableCreate: KnockoutObservable<boolean> = ko.observable(true);
        public tipoEstados: KnockoutObservableArray<any> = ko.observableArray<any>();
        public idRowIndex: KnockoutObservable<number> = ko.observable(-1);
        public idRow: KnockoutObservable<number> = ko.observable(0);


        public limpiar() {
            let formData: any = $('#form-mesas').dxForm('option').formData;
            formData.ID = 0;
            formData.NumMesa = "";
            formData.Capacidad = "";
            formData.Estado = "";
            let formModifData: any = $('#form-modif-mesas').dxForm('option').formData;
            formModifData.ID = 0;
            formModifData.NumMesa = "";
            formModifData.Capacidad = "";
            formModifData.Estado = "";
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
                        NumMesa: data[i].numMesa,
                        Capacidad: data[i].capacidad,
                        Estado: data[i].estado,
                        EstadoStr: data[i].estadoStr
                    });
                }
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        addMesas(): void {

            if (this.tipoForm() == "add") {
                var formData: any = $('#form-mesas').dxForm('option').formData;
            }

            if (this.tipoForm() == "modif") {
                var formData: any = $('#form-modif-mesas').dxForm('option').formData;
            }

            if (formData.NumMesa == "" || formData.NumMesa == null || formData.NumMesa == undefined) {
                DevExpress.ui.notify("No se puede crear número de mesa, falta número", "error", 3000);
                return;
            }

            if (formData.Capacidad == "" || formData.Capacidad == null || formData.Capacidad == undefined) {
                DevExpress.ui.notify("No se puede crear capacidad, falta capacidad", "error", 3000);
                return;
            }

            if (formData.Estado === "" || formData.Capacidad === null || formData.Capacidad === undefined) {
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
                $('#form-modif-mesas').dxForm('instance').resetValues();
                this.tipoForm([])
                this.getMesas();
                this.limpiar();
                $('#form-modif-mesas').dxForm('instance').repaint();
                $('#form-delete-mesas').dxForm('instance').repaint();
                this.enable(true);           
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
                this.getMesas();
                $('#form-modif-mesas').dxForm('instance').repaint();
                $('#form-delete-mesas').dxForm('instance').repaint();
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
                for (var i: number = 0; i < result.tipoEstado.length; i++) {
                    this.tipoEstados.push({
                        Nombre: result.tipoEstado[i].nombre,
                        Clave: result.tipoEstado[i].clave,
                    });
                }
            });
            window.localStorage.removeItem('idmesa');
            window.localStorage.removeItem('idpedido');
        }

        formOptions: any = {
            formData: this.mesas,
            labelLocation: "top",
            items: [{
                itemType: "group",
                colCount: 1,
                items: [{
                    dataField: "NumMesa",
                    editorType: "dxTextBox",
                    editorOptions: {
                        showClearButton: true
                    }
                }, {
                    itemType: "group",
                    colCount: 3,
                    items: [{
                        dataField: "Capacidad",
                        editorType: "dxNumberBox",
                        colSpan: 1,
                        editorOptions: {
                            showSpinButtons: true,
                            min: 0
                        }
                    }, {
                        dataField: "Estado",
                        editorType: "dxSelectBox",
                        colSpan: 2,
                        editorOptions: {
                            dataSource: this.tipoEstados,
                            placeholder: "Seleccionar...",
                            displayExpr: 'Nombre',
                            valueExpr: 'Clave'
                        }
                    }]
                }]
            }]
        };

        formModifOptions: any = {
            formData: this.mesas,
            labelLocation: "top",
            items: [{
                itemType: "group",
                colCount: 1,
                items: [{
                    editorType: "dxSelectBox",
                    label: { text: 'Seleccionar mesa' },
                    editorOptions: {
                        dataSource: this.mesas,
                        placeholder: "Seleccionar...",
                        displayExpr: 'NumMesa',
                        onItemClick: (e) => {
                            let mesaData: any = {
                                ID: e.itemData.ID,
                                NumMesa: e.itemData.NumMesa,
                                Capacidad: e.itemData.Capacidad,
                                Estado: e.itemData.Estado
                            }
                            let formData: any = $('#form-modif-mesas').dxForm('option');
                            formData.formData = mesaData;
                            let form = $('#form-modif-mesas').dxForm('instance');
                            form.repaint();
                            this.enable(false);
                        }
                    }
                }, {
                    dataField: "NumMesa",
                    editorType: "dxTextBox",
                    label: { text: 'Nombre Mesa' },
                    editorOptions: {
                        showClearButton: true
                    }
                }, {
                    itemType: "group",
                    colCount: 3,
                    items: [{
                        dataField: "Capacidad",
                        editorType: "dxNumberBox",
                        colSpan: 1,
                        editorOptions: {
                            showSpinButtons: true,
                            min: 0
                        }
                    }, {
                        dataField: "Estado",
                        editorType: "dxSelectBox",
                        colSpan: 2,
                        editorOptions: {
                            dataSource: this.tipoEstados,
                            placeholder: "Seleccionar...",
                            displayExpr: 'Nombre',
                            valueExpr: 'Clave'
                        }
                    }]
                }]
            }]
        };

        formDeleteOptions: any = {
            formData: this.mesas,
            labelLocation: "top",
            itemType: "group",
            colCount: 1,
            items: [{
                dataField: "ID",
                editorType: "dxSelectBox",
                label: { text: 'Seleccionar mesa a eliminar' },
                editorOptions: {
                    dataSource: this.mesas,
                    placeholder: "Seleccionar...",
                    displayExpr: 'NumMesa',
                    valueExpr: 'ID',
                    onItemClick: (e) => {
                        this.enable(false);
                    }
                }
            }]
        };

        tileview: any =
         {
            dataSource: this.mesas,
            noDataText: 'No hay datos disponibles por el momento ...',
            showScrollbar: true,
            height: 400,
            baseItemHeight: 120,
            baseItemWidth: 185,
            itemMargin: 10,
            hoverStateEnabled: true,
            hint: "Mesa",
            item: this.mesas,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                let url = "Content\/img\/b.png";
                itemElement.append(
                     " <b>Mesa:</b>" + itemData.NumMesa + "<br>"
                    + "<b>Capacidad:</b>" + itemData.Capacidad + "<br>"
                    + "<img src='" + encodeURI(url) + "' width='183' height='80' class='img- thumbnail'/>");
             },
            onItemClick: (e) => {
                //this.enable(false);
                //$.getJSON('api/pedidos/' + e.itemData.ID).then((result: any): void => {
                //    for (var i: number = 0; i < result.length; i++) {
                //        this.pedidoMesa.push({
                //            Comprador: result[i].comprador,
                //            EsDomicilio: result[i].esDomicilio,
                //            EstadoPedido: result[i].estadoPedido,
                //            Fecha: result[i].fecha,
                //            ID: result[i].id,
                //            Mesa: result[i].mesa,
                //            NombreComprador: result[i].nombreComprador,
                //            NroPersonas: result[i].nroPersonas,
                //            Observaciones: result[i].observaciones,
                //            Vendedor: result[i].vendedor,
                //        });
                //    }

                //});
                this.disableMod(true);
                this.disableCreate(true);
                this.pedidoMesa([]);
                let url = 'api/pedidos/' + e.itemData.ID;
                $.ajax({
                    type: 'GET',
                    url: url,
                }).done((data: any) => {
                    //this.pedidoMesa({
                    //    EsDomicilio: data[0].esDomicilio,
                    //    EstadoPedido: data[0].estadoPedido,
                    //    Fecha: data[0].fecha,
                    //    ID: data[0].id,
                    //    Mesa: data[0].mesa,
                    //    NombreComprador: data[0].nombreComprador,
                    //    NroPersonas: data[0].nroPersonas,
                    //    Observaciones: data[0].observaciones,
                    //    Vendedor: data[0].vendedor,
                    //});

                    if (data[0] !== undefined) {
                        this.disableMod(false);
                    } else {
                        this.disableCreate(false);
                    }

                    let mesaData: any = {
                        ID: e.itemData.ID,
                        NumMesa: e.itemData.NumMesa,
                        Capacidad: e.itemData.Capacidad,
                        Estado: e.itemData.Estado,
                        EstadoStr: e.itemData.EstadoStr
                    }
                    this.mesaSeleccionada(mesaData);
                    //Estado Mesa debe concordar con pedidos
                    //Eliminar del form de creación de mesa la opción de seleccionar estado (todo estado mesa debe comenzar en disponible)
                    //Arreglar que las mesas no se puedan crear con un nombre ya existente.
                    var mesa = {},
                        popup = null,
                        popupOptions = {
                            visible: false,
                            width: "400",
                            height: "auto",
                            position: {
                                my: 'center',
                                at: 'center',
                                of: window
                            },
                            dragEnabled: true,
                            closeOnOutsideClick: true,
                            showTitle: true,
                            contentTemplate: function () {
                                if (data[0] !== undefined) {
                                    return $("<div />").css("padding", "20px").append(
                                        $("<p><b>Nombre Mesa:</b> <span>" + mesaData.NumMesa + "</span></p>"),
                                        $("<p><b>Capacidad:</b> <span>" + mesaData.Capacidad + "</span></p>"),
                                        $("<p><b>Estado Mesa:</b> <span>" + mesaData.EstadoStr + "</span></p>"),
                                        $("<hr>").css("border-top", "1px dotted #8c8b8b"),
                                        $("<div />").css("background-color", "rgba(191, 191, 191, 0.15)").css("padding","20px").append(
                                            $("<p><b>Nombre Cliente:</b> <span>" + data[0].nombreComprador + "</span></p>"),
                                            $("<p><b>Nombre Vendedor:</b> <span>" + data[0].vendedor.nombre + " " + data[0].vendedor.apellido + "</span></p>"),
                                            $("<p><b>Fecha:</b> <span>" + new Date(data[0].fecha).toLocaleString() + "</span></p>"),
                                            $("<p><b>Estado Pedido:</b> <span>" + data[0].estadoPedidoStr + "</span></p>"),
                                            $("<p><b>N° Personas:</b> <span>" + data[0].nroPersonas + "</span></p>"),
                                            $("<p><b>Observaciones:</b> <span>" + data[0].observaciones + "</span></p>"),
                                       )
                                    );
                                } else {
                                    return $("<div />").append(
                                        $("<p><b>Nombre Mesa:</b> <span>" + mesaData.NumMesa + "</span></p>"),
                                        $("<p><b>Capacidad:</b> <span>" + mesaData.Capacidad + "</span></p>"),
                                        $("<p><b>Estado:</b> <span>" + mesaData.EstadoStr + "</span></p>"),
                                        $("<hr>").css("border-top", "1px dotted #8c8b8b"),
                                        $("<h4>No existe pedido</h4>").css("text-align","center").css("margin-top","10px")
                                    );
                                }
                            },
                            toolbarItems: [{
                                toolbar: 'top',
                                text: "Información de mesa",
                                location: "center"
                            }, {    
                                widget: "dxButton",
                                toolbar: 'bottom',
                                location: "after",
                                options: {
                                    text: "Añadir Pedido",
                                    icon: "plus",
                                    disabled: this.disableCreate,
                                    type: 'success',
                                    onClick: () => {
                                        window.localStorage.setItem('idmesa', e.itemData.ID);
                                        window.location.replace(window.location.origin + '/Pedidos');
                                    }
                                }
                            }, {
                                widget: "dxButton",
                                toolbar: 'bottom',
                                location: "before",
                                options: {
                                    text: "Modificar Pedido",
                                    icon: "edit",
                                    disabled: this.disableMod,
                                    type: 'default',
                                    onClick: () => {
                                        window.localStorage.setItem('idmesa', e.itemData.ID);
                                        window.localStorage.setItem('idpedido', data[0].id);
                                        window.location.replace(window.location.origin + '/Pedidos');
                                    }
                                }
                            }]
                        };

                    if (popup) {
                        $(".form-info-popup").remove();
                    }
                    var $popupContainer = $("<div />")
                        .addClass("form-info-popup")
                        .appendTo($("#form-info-popup"));
                    popup = $popupContainer.dxPopup(popupOptions).dxPopup("instance");
                    popup.show();
                //let formData: any = $('#form-mesas').dxForm('option');
                //formData.formData = mesaData;
                //this.idRow(mesaData.ID);
                //this.idRowIndex(e.rowIndex);
                //let form = $('#form-mesas').dxForm('instance');
                //form.repaint();

                }).fail((data: any) => {
                    DevExpress.ui.notify(data.responseJSON, "error", 3000);
                });

                
            },
            onItemRendered: (e) => {
                let mesaData: any = {
                    ID: e.itemData.ID,
                    NumMesa: e.itemData.NumMesa,
                    Capacidad: e.itemData.Capacidad,
                    Estado: e.itemData.Estado
                }
                if (mesaData.Estado === 0) {
                    e.itemElement.css("background-color", "OrangeRed");
                }
                if (mesaData.Estado === 1) {
                    e.itemElement.css("background-color", "MediumSeaGreen");
                }
                if (mesaData.Estado === 2) {
                    e.itemElement.css("background-color", "yellow");
                }
            }
                     
         };

        formPopup: any = {
            visible: false,
            width: "300",
            height: "auto",
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
                text: "Añadir mesa",
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
                        this.tipoForm("add");
                        this.addMesas();
                        let popForm = $('#form-popup').dxPopup('instance');
                        popForm.hide();
                    }
                }
            }]
        };

        formModifPopup: any = {
            visible: false,
            width: "300",
            height: "auto",
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            dragEnabled: true,
            closeOnOutsideClick: true,
            contentTemplate: (e) => {
                return $('#form-modif-mesas')
            },
            toolbarItems: [{
                toolbar: 'top',
                text: "Modificar mesa",
                location: "center"
            }, {
                widget: "dxButton",
                toolbar: 'bottom',
                location: "after",
                options: {
                    text: "Modificar",
                    icon: "edit",
                    type: 'default',
                    disabled: this.enable,
                    onClick: () => {
                        this.tipoForm("modif");
                        this.addMesas();
                        let popForm = $('#form-modif-popup').dxPopup('instance');
                        popForm.hide();
                    }
                }
            }]
        };

        formDeletePopup: any = {
            visible: false,
            width: "300",
            height: "auto",
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            dragEnabled: true,
            closeOnOutsideClick: true,
            contentTemplate: (e) => {
                return $('#form-delete-mesas')
            },
            toolbarItems: [{
                toolbar: 'top',
                text: "Eliminar mesa",
                location: "center"
            }, {
                widget: "dxButton",
                toolbar: 'bottom',
                location: "after",
                options: {
                    text: "Eliminar",
                    icon: "trash",
                    type: 'danger',
                    disabled: this.enable,
                    onClick: () => {
                        let formData: any = $('#form-delete-mesas').dxForm('option').formData;
                        this.deleteMesas(formData.ID);
                        let popForm = $('#form-delete-popup').dxPopup('instance');
                        popForm.hide();
                    }
                }
            }]
        };

        addPopup: any = {
            text: "Agregar Mesa",
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

        deletePopup: any = {
            text: "Eliminar Mesa",
            icon: "trash",
            type: 'danger',
            onClick: () => {
                $('#form-delete-mesas').dxForm('instance').resetValues();
                this.enable(true);
                let popForm = $('#form-delete-popup').dxPopup('instance');
                popForm.show();
            }
        }

        modifPopup: any = {
            text: "Modificar Mesa",
            icon: "edit",
            type: 'default',
            onClick: (e) => {
                $('#form-modif-mesas').dxForm('instance').resetValues();
                this.limpiar();
                this.enable(true);
                let popForm = $('#form-modif-popup').dxPopup('instance');
                popForm.show();
            }
        }
       
    }
}
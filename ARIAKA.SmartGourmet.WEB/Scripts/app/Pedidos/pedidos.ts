/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Pedidos {
    'use strict'
    export class PedidosIndexViewModel {
        public productos: KnockoutObservableArray<any> = ko.observableArray<any>();
        public clientes: KnockoutObservableArray<any> = ko.observableArray<any>();
        public datosFormCliente: KnockoutObservable<any> = ko.observable<any>();
        public idCliente: KnockoutObservable<number> = ko.observable(0);
        public clienteExiste: KnockoutObservable<boolean> = ko.observable(false);
        public clienteModificado: KnockoutObservable<boolean> = ko.observable(false);
        public disableForm: KnockoutObservable<boolean> = ko.observable(true);
        public nombreNull: KnockoutObservable<boolean> = ko.observable(true);
        public telefNull: KnockoutObservable<boolean> = ko.observable(true);
        public direcNull: KnockoutObservable<boolean> = ko.observable(true);
        public switchForm: KnockoutObservable<boolean> = ko.observable(false);
        public vendedor: KnockoutObservableArray<any> = ko.observableArray<any>();
        public pedidos: KnockoutObservableArray<any> = ko.observableArray<any>();
        public estPedido: KnockoutObservableArray<any> = ko.observableArray<any>();
        public nombreEstPedido: KnockoutObservable<any> = ko.observable<any>();
        public esDomicilio: KnockoutObservable<boolean> = ko.observable<boolean>();
        public categorias: KnockoutObservableArray<any> = ko.observableArray<any>();
        public categoriasFilter: KnockoutObservableArray<any> = ko.observableArray<any>();
        public enable: KnockoutObservable<boolean> = ko.observable(true);
        public idRow: KnockoutObservable<number> = ko.observable(0);
        public idRowIndex: KnockoutObservable<number> = ko.observable(-1);
        public prodByCat: KnockoutObservable<number> = ko.observable(-1);
        public imagen: KnockoutObservable<any> = ko.observable<any>();

        public limpiarForm() {
            let formData: any = $('#form-pedidos').dxForm('option').formData;
            formData.ID = 0;
            formData.Nombre = "";
            formData.NroPersonas = "";
            formData.Vendedor = "";
            formData.Fecha = Date();
            formData.EsDomicilio = false;
            formData.Telefono = "";
            formData.Direccion = "";
            formData.Observaciones = "";
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
                        Telefono: data[i].telefono,
                        NombreCompleto: data[i].nombreCompleto
                    });
                }
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        addClientes(): void {

            let formData: any = $('#form-pedidos').dxForm('option').formData;
            if (formData.Nombre === "") {
                DevExpress.ui.notify("No se puede guardar datos cliente, falta nombre.", "error", 3000);
                return;
            }
            if (formData.Telefono === "" || formData.Telefono === null) {
                DevExpress.ui.notify("No se puede guardar datos cliente, falta teléfono.", "error", 3000);
                return;
            }
            if (!(/^\d+$/.test(formData.Telefono))) {
                DevExpress.ui.notify("No se puede guardar datos cliente, teléfono solo debe contener números.", "error", 3000);
                return;
            }
            if (formData.Direccion === "" || formData.Telefono === null) {
                DevExpress.ui.notify("No se puede guardar datos cliente, falta dirección.", "error", 3000);
                return;
            }

            let nombreCompleto: any = formData.Nombre.split(" ");
            if (nombreCompleto[1] === "" || nombreCompleto[1] === undefined || nombreCompleto[1] === null ) {
                DevExpress.ui.notify("No se puede guardar datos cliente, falta apellido.", "error", 3000);
                return;
            }

            let url = 'api/clientes';
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    ID: this.idCliente,
                    Nombre: nombreCompleto[0],
                    Apellido: nombreCompleto[1],
                    Direccion: formData.Direccion,
                    Telefono: formData.Telefono
                }
            }).done((data: any) => {
                DevExpress.ui.notify("Cliente guardado satisfactoriamente.", "success", 2000);
                this.getClientes();
                this.idCliente(data.id);
                this.enable(true);
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        getProductos(id: number): void {
            this.productos([]);
            let url = 'api/productos/' + id;
            $.ajax({
                type: 'GET',
                url: url,
            }).done((data: any) => {
                for (var i: number = 0; i < data.length; i++) {
                    this.productos.push({
                        ID: data[i].id,
                        Nombre: data[i].nombre,
                        Precio: data[i].precio,
                        Descuento: data[i].descuento,
                        StockActual: data[i].stockActual,
                        FechaCreacion: data[i].fechaCreacion,
                        Tipo: data[i].tipo
                    });
                }
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        getCategorias(): void {
            this.categorias([]);
            let url = 'api/categorias';
            $.ajax({
                type: 'GET',
                url: url
            }).done((data: any) => {
                for (var i: number = 0; i < data.length; i++) {
                    let cate = {
                        id: data[i].id,
                        nombre: data[i].nombre
                    }
                    this.categorias.push(cate);
                    this.categoriasFilter.push(cate);
                }
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        getVendedores(): void {
            this.vendedor([]);
            let url = 'api/usuarios';
            $.ajax({
                type: 'GET',
                url: url
            }).done((data: any) => {
                for (var i: number = 0; i < data.length; i++) {
                    let user = {
                        id: data[i].id,
                        nombre: data[i].nombre.concat(" ", data[i].apellido)
                    }
                    this.vendedor.push(user);
                }
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        addPedidos(): void {

            let formData: any = $('#form-pedidos').dxForm('option').formData;

            if (formData.Nombre === "") {
                DevExpress.ui.notify("No se puede crear pedido, falta nombre.", "error", 3000);
                return;
            }
            if (formData.NroPersonas === "") {
                DevExpress.ui.notify("No se puede crear pedido, falta número de personas.", "error", 3000);
                return;
            }
            if (formData.Fecha === "") {
                DevExpress.ui.notify("No se puede crear pedido, falta fecha.", "error", 3000);
                return;
            }
            if (formData.Vendedor === "") {
                DevExpress.ui.notify("No se puede crear pedido, falta vendedor.", "error", 3000);
                return;
            }
            if (formData.EstadoPedido === "") {
                DevExpress.ui.notify("No se puede crear pedido, falta el estado del pedido.", "error", 3000);
                return;
            }

            if (this.switchForm() == true) {
                let nombreCompleto: any = formData.Nombre.split(" ");
                if (nombreCompleto[1] === "" || nombreCompleto[1] === undefined || nombreCompleto[1] === null) {
                    DevExpress.ui.notify("No se puede crear pedido, falta apellido.", "error", 3000);
                    return;
                }
                if (formData.Telefono === "" || formData.Telefono === null || formData.Telefono === undefined) {
                    DevExpress.ui.notify("No se puede crear pedido, falta teléfono.", "error", 3000);
                    return;
                }
                if (formData.Direccion === "" || formData.Telefono === null || formData.Telefono === undefined) {
                    DevExpress.ui.notify("No se puede crear pedido, falta dirección.", "error", 3000);
                    return;
                }
            }

            if (this.switchForm() == false) {
                var compradorNull = { 'id': -1 }
                this.datosFormCliente(compradorNull);
            }

            let url = 'api/pedidos';
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    ID: formData.ID,
                    Fecha: formData.Fecha,
                    NombreComprador: formData.Nombre,
                    Comprador: this.datosFormCliente(),
                    VendedorID: formData.Vendedor,
                    Mesa: formData.Mesa,
                    NroPersonas: formData.NroPersonas,
                    EstadoPedido: formData.EstadoPedido,
                    Observaciones: formData.Observaciones,
                    EsDomicilio: formData.EsDomicilio
                }
            }).done((data: any) => {
                DevExpress.ui.notify("Pedido creado satisfactoriamente.", "success", 2000);
                $('#form-pedidos').dxForm('instance').resetValues();
                this.datosFormCliente([]);
                this.clienteExiste(false);
                this.clienteModificado(false);
                this.switchForm(false);
                this.getProductos(this.prodByCat());
                let grid = $('#grid-productos').dxDataGrid('instance');
                this.limpiarForm();
                this.enable(true);
                grid.refresh();
                grid.repaint();
                window.location.replace("http://localhost:61242/Mesas");
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        constructor() {
            //this.getProductos(this.prodByCat());
            this.getClientes();
            this.getVendedores();
            this.estPedido([]);
            $.getJSON('api/pedidos/estados').then((result: any): void => {
                for (var i: number = 0; i < result.tipoEstadoPedido.length; i++) {
                    this.estPedido.push({
                        Nombre: result.tipoEstadoPedido[i].nombre,
                        Clave: result.tipoEstadoPedido[i].clave,
                    });
                }
            });
        }

        formOptions: any = {
            formData: this.pedidos,
            labelLocation: "left",
            items: [{
                itemType: "group",
                colCount: 2,
                items: [{
                    itemType: "group",
                    colCount: 1,
                    name: "formDomicilio",
                    caption: "Información de Cliente",
                    items: [{
                        dataField: "Nombre",
                        editorType: "dxAutocomplete",
                        label: { text: 'Nombre Cliente' },
                        editorOptions: {
                            dataSource: this.clientes,
                            validationError: { message: "Falta agregar el apellido." },
                            valueExpr: 'NombreCompleto',
                            displayValue: 'NombreCompleto',
                            placeholder: 'Nombre y apellido',
                            showClearButton: true,
                            onItemClick: (e: any) => {
                                var id = e.itemData["ID"];
                                this.idCliente(id);
                                var nombre = e.itemData["Nombre"];
                                var apellido = e.itemData["Apellido"];
                                var telefono = e.itemData["Telefono"];
                                var direccion = e.itemData["Direccion"];
                                var cliente = {
                                    'id': id,
                                    'nombre': nombre + " " + apellido,
                                    'apellido': apellido,
                                    'telefono': telefono,
                                    'direccion': direccion
                                };
                                let formData: any = $('#form-pedidos').dxForm('option').formData;
                                formData.Nombre = nombre + " " + apellido;
                                formData.Direccion = direccion;
                                formData.Telefono = telefono;
                                this.datosFormCliente(cliente);
                                this.clienteExiste(true);
                                this.disableForm(false);
                                let form = $('#form-pedidos').dxForm('instance');
                                form.repaint();
                            },
                            onFocusOut: (e: any) => {
                                if (this.clienteExiste() == true && this.clienteModificado() == true && this.switchForm() == true) {
                                    this.addClientes();
                                    this.clienteModificado(false);
                                }
                                if (this.clienteExiste() == false && this.clienteModificado() == false && this.switchForm() == true) {
                                    if (this.nombreNull() == false && this.telefNull() == false && this.direcNull() == false) {
                                        this.addClientes();
                                        this.clienteExiste(true);
                                    }
                                }
                            },
                            onValueChanged: (e: any) => {
                                if (this.clienteExiste() == true) {
                                    this.clienteModificado(true);
                                }
                                if (e.value !== null && this.switchForm() == true) {
                                    let nombreCompleto: any = e.value.split(" ");
                                    if (nombreCompleto[1] === "" || nombreCompleto[1] === undefined || nombreCompleto[1] === null) {
                                        this.disableForm(true);
                                        e.component.option('isValid', false);
                                        let form: any = $('#form-pedidos').dxForm('instance');
                                        let direcc: any = form.getEditor('Direccion');
                                        direcc.repaint();
                                    }
                                    else {
                                        this.nombreNull(false);
                                        e.component.option('isValid', true);
                                        this.disableForm(false);
                                        let form: any = $('#form-pedidos').dxForm('instance');
                                        let direcc: any = form.getEditor('Direccion');
                                        direcc.repaint();
                                    }
                                } else if (this.switchForm() == true){
                                    this.nombreNull(true);
                                    this.disableForm(true);
                                    let form: any = $('#form-pedidos').dxForm('instance');
                                    let direcc: any = form.getEditor('Direccion');
                                    direcc.repaint();
                                }
                            }
                        }
                    }, {
                        dataField: "NroPersonas",
                        editorType: "dxNumberBox",
                        label: { text: 'N° de personas' },
                        editorOptions: {
                            showClearButton: true,
                            showSpinButtons: true,
                            min: 0
                        }
                    }]
                }, {
                    itemType: "group",
                    colCount: 1,
                    caption: "Información de Pedido",
                    items: [/*{
                        dataField: "EstadoPedido",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: this.estPedido,
                            placeholder: "Seleccione estado pedido...",
                            displayExpr: 'Nombre',
                            valueExpr: 'Clave',
                            value: this.nombreEstPedido
                        }
                    }, */{
                        dataField: "Vendedor",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: this.vendedor,
                            placeholder: "Seleccione vendedor...",
                            displayExpr: 'nombre',
                            valueExpr: 'id'
                        }
                    }, {
                        dataField: "Fecha",
                        editorType: "dxDateBox",
                        label: { text: 'Fecha' },
                        editorOptions: {
                            showClearButton: true,
                            type: 'datetime',
                            value: Date(),
                            min: Date(),
                            dateOutOfRangeMessage: 'Fecha fuera de rango',
                            displayFormat: 'dd/MM/YY HH:mm',
                            cancelButtonText: 'Cancelar',
                            applyButtonText: 'Escoger',
                            placeholder: 'Seleccione fecha entrega',
                            width: "100%",
                            onOpened: (e) => {
                                e.component._strategy._timeView._hourBox.option('min', 8);
                                e.component._strategy._timeView._hourBox.option('max', 20);
                            }
                        }
                    }, {
                        dataField: "EsDomicilio",
                        editorType: "dxSwitch",
                        editorOptions: {
                            switchedOnText: 'SI',
                            switchedOffText: 'NO',
                            value: this.switchForm,
                            onValueChanged: (e: any) => {
                                if (e.value == true) {
                                    var form = $('#form-pedidos').dxForm('instance')
                                    var items = form.itemOption("formDomicilio").items;
                                    items.push({
                                        dataField: "Telefono",
                                        editorType: "dxAutocomplete",
                                        label: { text: 'Teléfono' },
                                        editorOptions: {
                                            dataSource: this.clientes,
                                            valueExpr: 'Telefono',
                                            displayValue: 'Telefono',
                                            showClearButton: true,
                                            onItemClick: (e: any) => {
                                                var id = e.itemData["ID"];
                                                this.idCliente(id);
                                                var nombre = e.itemData["Nombre"];
                                                var apellido = e.itemData["Apellido"];
                                                var telefono = e.itemData["Telefono"];
                                                var direccion = e.itemData["Direccion"];
                                                var cliente = {
                                                    'id': id,
                                                    'nombre': nombre + " " + apellido,
                                                    'apellido': apellido,
                                                    'telefono': telefono,
                                                    'direccion': direccion
                                                };
                                                let formData: any = $('#form-pedidos').dxForm('option').formData;
                                                formData.Nombre = nombre + " " + apellido;
                                                formData.Direccion = direccion;
                                                formData.Telefono = telefono;
                                                this.datosFormCliente(cliente);
                                                this.clienteExiste(true);
                                                this.disableForm(false);
                                                let form = $('#form-pedidos').dxForm('instance');
                                                form.repaint();
                                            },
                                            onFocusOut: (e: any) => {
                                                if (this.clienteExiste() == true && this.clienteModificado() == true && this.switchForm() == true) {
                                                    this.addClientes();
                                                    this.clienteModificado(false);
                                                }
                                                if (this.clienteExiste() == false && this.clienteModificado() == false && this.switchForm() == true) {
                                                    if (this.nombreNull() == false && this.telefNull() == false && this.direcNull() == false) {
                                                        this.addClientes();
                                                        this.clienteExiste(true);
                                                    }
                                                }
                                            },
                                            onValueChanged: (e: any) => {
                                                if (this.clienteExiste() == true) {
                                                    this.clienteModificado(true);
                                                }
                                                if (e.value == null || e.value == "" || e.value == undefined) {
                                                    this.telefNull(true);
                                                } else {
                                                    this.telefNull(false);
                                                }
                                            }
                                        }
                                    });
                                    items.push({
                                        dataField: "Direccion",
                                        editorType: "dxTextBox",
                                        label: { text: 'Direccion' },
                                        editorOptions: {
                                            showClearButton: true,
                                            disabled: this.disableForm,
                                            onFocusOut: (e: any) => {
                                                if (this.clienteExiste() == true && this.clienteModificado() == true && this.switchForm() == true) {
                                                    this.addClientes();
                                                    this.clienteModificado(false);
                                                }
                                                if (this.clienteExiste() == false && this.clienteModificado() == false && this.switchForm() == true) {
                                                    if (this.nombreNull() == false && this.telefNull() == false && this.direcNull() == false) {
                                                        this.addClientes();
                                                        this.clienteExiste(true);
                                                    }
                                                }
                                            },
                                            onValueChanged: (e: any) => {
                                                if (this.clienteExiste() == true) {
                                                    this.clienteModificado(true);
                                                }
                                                if (e.value == null || e.value == "" || e.value == undefined) {
                                                    this.direcNull(true);
                                                } else {
                                                    this.direcNull(false);
                                                }
                                            }
                                        }
                                    });
                                    form.repaint();
                                }
                                if (e.value == false) {
                                    var form = $('#form-pedidos').dxForm('instance')
                                    var items = form.itemOption("formDomicilio").items;
                                    this.clienteExiste(false);
                                    this.clienteModificado(false);
                                    this.datosFormCliente([]);
                                    this.idCliente(0);
                                    this.telefNull(true);
                                    this.direcNull(true);
                                    let formData: any = $('#form-pedidos').dxForm('option').formData;
                                    formData.Direccion = "";
                                    formData.Telefono = "";
                                    this.disableForm(true);
                                    items.pop();
                                    items.pop();
                                    form.repaint();
                                }
                            }
                        }
                    }]
                }]
            }, {
                itemType: "group",
                colCount: 1,
                items: [{
                    itemType: "group",
                    colCount: 1,
                    caption: "Datos del Pedido",
                    items: [/*{

                    }, */{
                            colSpan: 2,
                            template: function (data, container) {
                                $("<div>").attr("id", "grid-productos").dxDataGrid({
                                    dataSource: this.productos,
                                    columns: [{ dataField: 'ID', visible: false },
                                    { dataField: 'Nombre', width: "35%" },
                                    { dataField: 'Tipo.nombre', caption: 'Categoría' },
                                    { dataField: 'StockActual', caption: 'Stock Actual', width: "9%" },
                                    { dataField: 'Precio', width: "8%" },
                                    { dataField: 'Descuento', width: "9%" }],
                                    editing: {
                                        allowUpdating: true,
                                        allowAdding: true,
                                        allowDeleting: true
                                    },
                                }).appendTo(container);
                            }
                        }]
                }, {
                    itemType: "group",
                    colCount: 1,
                    caption: "Notas adicionales",
                    items: [{
                        dataField: "Observaciones",
                        label: { location: "top", text: 'Observaciones' },
                        editorType: "dxTextArea",
                        editorOptions: {
                            height: 100
                        }
                    }]
                }]} 
        ]};

        cleanButton: any = {
            text: "Limpiar",
            icon: "update",
            type: 'default',
            disabled: this.enable,
            onClick: () => {
                let grid = $('#grid-productos').dxDataGrid('instance');
                grid.deleteRow(this.idRowIndex());
                grid.repaint();
            }
        }

        backButton: any = {
            text: "Volver",
            icon: "back",
            type: 'danger',
            disabled: this.enable,
            onClick: () => {
                let grid = $('#grid-productos').dxDataGrid('instance');
                grid.deleteRow(this.idRowIndex());
                grid.repaint();
            }
        }

        createButton: any = {
            text: "Agregar",
            icon: "plus",
            type: 'success',
            onClick: (e) => {
                this.addPedidos();
                this.enable(true);
            }
        }
    }
}
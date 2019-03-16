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
        public idPedido: KnockoutObservable<number> = ko.observable(0);
        public clienteExiste: KnockoutObservable<boolean> = ko.observable(false);
        public clienteModificado: KnockoutObservable<boolean> = ko.observable(false);
        public disableForm: KnockoutObservable<boolean> = ko.observable(true);
        public nombreNull: KnockoutObservable<boolean> = ko.observable(true);
        public telefNull: KnockoutObservable<boolean> = ko.observable(true);
        public direcNull: KnockoutObservable<boolean> = ko.observable(true);
        public switchForm: KnockoutObservable<boolean> = ko.observable(false);
        public vendedor: KnockoutObservableArray<any> = ko.observableArray<any>();
        public pedidoExiste: KnockoutObservableArray<any> = ko.observableArray<any>();
        public prodSelec: KnockoutObservable<any> = ko.observable<any>();
        public listProd: KnockoutObservableArray<any> = ko.observableArray<any>();
        public fechaPedido: KnockoutObservable<any> = ko.observable<any>(Date());
        public nombreVendedor: KnockoutObservable<any> = ko.observable<any>();
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
                let cliente = {
                    'id': data.id,
                    'nombre': data.nombre + " " + data.apellido,
                    'apellido': data.apellido,
                    'telefono': data.telefono,
                    'direccion': data.direccion
                };
                this.datosFormCliente(cliente);
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

        getPedidoByID(id: any): void {
            this.pedidoExiste([]);
            let url = 'api/pedidos/modificar/' + id;
            $.ajax({
                type: 'GET',
                url: url,
            }).done((data: any) => {
                let formData: any = $('#form-pedidos').dxForm('option');
                if (data[0].comprador == null) {
                    data[0].comprador = { 'id': 0 }
                }

                let pedidoData: any = {
                    ID: data[0].id,
                    Fecha: data[0].fecha,
                    EsDomicilio: data[0].esDomicilio,
                    NroPersonas: data[0].nroPersonas,
                    EstadoPedido: data[0].estadoPedido,
                    EstadoPedidoStr: data[0].estadoPedidoStr,
                    Mesa: data[0].mesa,
                    CompradorID: data[0].comprador.id,
                    Telefono: data[0].comprador.telefono,
                    Direccion: data[0].comprador.direccion,
                    Vendedor: data[0].vendedor.id,
                    Nombre: data[0].nombreComprador,
                    Observaciones: data[0].observaciones
                }
                this.nombreVendedor(data[0].vendedor.id);
                this.switchForm(pedidoData.EsDomicilio);
                this.clienteExiste(pedidoData.EsDomicilio);
                this.disableForm(!pedidoData.EsDomicilio);
                this.idCliente(pedidoData.CompradorID);
                this.fechaPedido(data[0].fecha);
                formData.formData = pedidoData;
                let form = $('#form-pedidos').dxForm('instance');
                form.repaint();
                var inst = $('#tabpanel-container').dxTabPanel('instance');
                inst.option("items", this.categorias);
                inst.repaint();
            })
        }

        getDetallePedido(id: any): void {
            this.listProd([]);
            let url = 'api/pedidos/detalle/' + id;
            $.ajax({
                type: 'GET',
                url: url,
            }).done((data: any) => {
                for (var i: number = 0; i < data.length; i++) {
                    this.listProd.push({
                        ID: data[i].id,
                        ProductoID: data[i].productoID,
                        Nombre: data[i].nombre,
                        Precio: data[i].precio,
                        Cantidad: data[i].cantidad,
                        PrecioT: data[i].precio * data[i].cantidad
                    });
                }
                var list = $("#grid-prod-select").dxDataGrid("instance");
                list.refresh();
            })
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
                        nombre: data[i].nombre,
                        title: data[i].nombre
                    }
                    this.categorias.push(cate);
                    this.categoriasFilter.push(cate);
                }
                var inst = $('#tabpanel-container').dxTabPanel('instance');
                var items = inst.option("items", this.categorias);
                inst.repaint();
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

            if (this.listProd().length == 0) {
                DevExpress.ui.notify("No se puede crear pedido, falta agregar productos.", "error", 3000);
                return;
            }

            if (formData.Fecha instanceof Function) {
                formData.Fecha = formData.Fecha();
            }

            if (formData.Nombre === "" || formData.Nombre === null || formData.Nombre === undefined) {
                DevExpress.ui.notify("No se puede crear pedido, falta nombre.", "error", 3000);
                return;
            }
            if (formData.NroPersonas === "" || formData.NroPersonas === null || formData.NroPersonas === undefined) {
                DevExpress.ui.notify("No se puede crear pedido, falta número de personas.", "error", 3000);
                return;
            }
            if (formData.Fecha === "" || formData.Fecha === null || formData.Fecha === undefined) {
                DevExpress.ui.notify("No se puede crear pedido, falta fecha.", "error", 3000);
                return;
            }
            if (formData.Vendedor === "" || formData.Vendedor === null || formData.Vendedor == undefined) {
                DevExpress.ui.notify("No se puede crear pedido, falta vendedor.", "error", 3000);
                return;
            }

            formData.Fecha = new Date(formData.Fecha).toISOString();

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
                if (formData.Direccion === "" || formData.Direccion === null || formData.Direccion === undefined) {
                    DevExpress.ui.notify("No se puede crear pedido, falta dirección.", "error", 3000);
                    return;
                }
            }

            if (this.switchForm() == false) {
                var compradorNull = { 'id': -1 }
                this.datosFormCliente(compradorNull);
            }
            let idmesa = { 'id': window.localStorage.getItem('idmesa') };

            let url = 'api/pedidos';
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    ID: window.localStorage.getItem('idpedido'),
                    Fecha: formData.Fecha,
                    NombreComprador: formData.Nombre,
                    Comprador: this.datosFormCliente(),
                    VendedorID: formData.Vendedor,
                    Mesa: idmesa,
                    NroPersonas: formData.NroPersonas,
                    EstadoPedido: formData.EstadoPedido,
                    Observaciones: formData.Observaciones,
                    EsDomicilio: formData.EsDomicilio
                }
            }).done((data: any) => {
                this.idPedido(data.id);
                this.addDetallePedido();
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        addDetallePedido(): void {
            var info = JSON.stringify(this.listProd());
            let url = 'api/pedidos/detalleModificar';
            $.ajax({
                type: 'POST',
                url: url,
                data: { listDetallePedidoDTO: this.listProd(), id: this.idPedido() }
            }).done((data: any) => {
                DevExpress.ui.notify("Pedido guardado satisfactoriamente.", "success", 2000);
                $('#form-pedidos').dxForm('instance').resetValues();
                window.localStorage.removeItem('idmesa');
                window.localStorage.removeItem('idpedido');
                window.localStorage.removeItem('nummesa');
                this.datosFormCliente([]);
                this.listProd([]);
                this.clienteExiste(false);
                this.clienteModificado(false);
                this.switchForm(false);
                this.limpiarForm();
                this.enable(true);
                setTimeout(function () { window.location.replace(window.location.origin + '/Mesas') }, 1000);
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        constructor() {
            this.getClientes();
            this.getVendedores();
            this.getCategorias();
            this.estPedido([]);
            $.getJSON('api/pedidos/estados').then((result: any): void => {
                for (var i: number = 0; i < result.tipoEstadoPedido.length; i++) {
                    this.estPedido.push({
                        Nombre: result.tipoEstadoPedido[i].nombre,
                        Clave: result.tipoEstadoPedido[i].clave,
                    });
                }
            });
            if (window.localStorage.getItem("idpedido") !== null) {
                this.getPedidoByID(window.localStorage.getItem("idpedido"));
                this.getDetallePedido(window.localStorage.getItem("idpedido"));
            }
        }

        formOptions: any = {
            formData: this.pedidoExiste,
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
                    items: [{
                        dataField: "Vendedor",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: this.vendedor,
                            placeholder: "Seleccione vendedor...",
                            displayExpr: 'nombre',
                            valueExpr: 'id',
                            value: this.nombreVendedor()
                        }
                    }, {
                        dataField: "Fecha",
                        editorType: "dxDateBox",
                        label: { text: 'Fecha' },
                        editorOptions: {
                            showClearButton: true,
                            type: 'datetime',
                            value: this.fechaPedido,
                            min: Date(),
                            dateOutOfRangeMessage: 'Fecha fuera de rango',
                            displayFormat: 'dd/MM/YY HH:mm',
                            dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssZ",
                            cancelButtonText: 'Cancelar',
                            applyButtonText: 'Escoger',
                            placeholder: "Seleccione fecha pedido..",
                            width: "100%",
                            onOpened: (e) => {
                                e.component._strategy._timeView._hourBox.option('min', 8);
                                e.component._strategy._timeView._hourBox.option('max', 23);
                            }
                        }
                    }, {
                        dataField: "EsDomicilio",
                        editorType: "dxSwitch",
                        editorOptions: {
                            switchedOnText: 'SI',
                            switchedOffText: 'NO',
                            name: "switch",
                            disabled: true,
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
                    colCount: 5,
                    caption: "Datos del Pedido",
                    items: [{
                            colSpan: 2,
                            template: (data, container) => {
                                $("<div>").attr("id", "grid-prod-select").dxDataGrid({
                                    dataSource: this.listProd,
                                    loadPanel: {
                                        enabled: true,
                                        text: 'Cargando datos...'
                                    },
                                    selection: {
                                        mode: "single"
                                    },
                                    editing: {
                                        allowDeleting: true,
                                        allowUpdating: true,
                                        texts: {
                                            deleteRow: "Borrar",
                                            editRow: "Editar"
                                        },
                                        mode: 'cell'
                                    },
                                    columnAutoWidth: true, 
                                    columns: [{ dataField: 'ID', visible: false },
                                    { dataField: 'Nombre', allowEditing: false, caption: 'Producto' },
                                    { dataField: 'Cantidad', width: "70px" },
                                    { dataField: 'Precio', allowEditing: false, width: "70px", caption: 'Precio U.', format: "currency" },
                                    { dataField: 'PrecioT', allowEditing: false, caption: 'Precio T.', format: "currency" }],
                                    grouping: {
                                        allowCollapsing: true
                                    },
                                    onRowUpdated: (e) => {
                                        e.key.PrecioT = e.key.Precio * e.key.Cantidad;
                                        var list = $("#grid-prod-select").dxDataGrid("instance");
                                        list.refresh();
                                    },
                                    summary: {
                                        totalItems: [{
                                            column: "Nombre",
                                            summaryType: "count"
                                        }, {
                                            column: "Precio T.",
                                            summaryType: "sum",
                                            valueFormat: "currency"
                                            }],
                                        texts: {
                                            count: "Productos: {0}",
                                            sum: "Total: {0}",
                                        }
                                    },
                                    showBorders: false
                                    , rowAlternationEnabled: false
                                    , showRowLines: false
                                    , showColumnLines: false
                                }).appendTo(container);
                            }
                        }, {
                            colSpan: 3,
                            template: (data, container) => {
                                $("<div>").attr("id", "tabpanel-container").dxTabPanel({
                                    height: "auto",
                                    selectedIndex: 0,
                                    loop: false,
                                    deferRendering: true,
                                    animationEnabled: true,
                                    swipeEnabled: true,
                                    onItemRendered: (e) => {
                                        this.productos([]);
                                        let url = 'api/productos/' + e.itemData.id;
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
                                            $("<div>").attr("id", "grid-productos").css("margin-bottom", "-40px").dxDataGrid({
                                                dataSource: this.productos,
                                                loadPanel: {
                                                    enabled: true,
                                                    text: 'Cargando datos...'
                                                },
                                                selection: {
                                                    mode: "single"
                                                },
                                                columnAutoWidth: true,
                                                columns: [{ dataField: 'ID', visible: false },
                                                { dataField: 'Nombre'},
                                                { dataField: 'Tipo.nombre', caption: 'Categoría'},
                                                { dataField: 'StockActual', width: '91px', caption: 'Stock Actual' },
                                                { dataField: 'Precio', width: '65px', format: "currency"},
                                                { dataField: 'Descuento', caption: 'Desc.', width: '50px'}],
                                                grouping: {
                                                    allowCollapsing: true
                                                },
                                                onInitialized: (e) => {
                                                    if (window.localStorage.getItem("nummesa") == "Domicilio" && this.switchForm() == false) {
                                                        let form = $('#form-pedidos').dxForm('instance');
                                                        let sw: any = form.getEditor('EsDomicilio');
                                                        sw.option('value', true);
                                                        var inst = $('#tabpanel-container').dxTabPanel('instance');
                                                        var items = inst.option("items", this.categorias);
                                                        inst.repaint();
                                                    }
                                                },
                                                showBorders: true
                                                , rowAlternationEnabled: true
                                                , showRowLines: false
                                                , showColumnLines: true,
                                                searchPanel: {
                                                    visible: true,
                                                    width: 240,
                                                    placeholder: "Buscar..."
                                                },
                                                
                                                onRowClick: (e) => {
                                                    this.prodSelec(e.data);
                                                    let popAddProd = $('#add-popup').dxPopup('instance');
                                                    popAddProd.show();
                                                }
                                            }).prependTo(e.itemElement);
                                            var tab = $("#tabpanel-container").dxTabPanel("instance");
                                            this.productos([]);
                                        }).fail((data: any) => {
                                            DevExpress.ui.notify(data.responseJSON, "error", 3000);
                                        });
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
            ]
        };

        addProdPopup: any = {
            visible: false,
            width: "auto",
            height: "auto",
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            dragEnabled: true,
            closeOnOutsideClick: true,
            contentTemplate: (contentElement) => {
                return $("<div>").css('display', 'inline-flex').attr("id", "boton-menos").dxButton({
                    text: "–",
                    type: 'default',
                    onClick: () => {
                        let minus = $('#text-cantidad').dxNumberBox('instance');
                        if (minus.option('value') > 0) {
                            let value = minus.option('value') - 1;
                            minus.option('value', value);
                        }
                    }
                }).appendTo(contentElement),
                $("<div>").css('display', 'inline-flex').attr("id", "text-cantidad").dxNumberBox({
                    min: 0,
                    width: 150,
                    onValueChanged: (e) => {
                        if (e.value == 0) {
                            this.enable(true);
                        } else {
                            this.enable(false);
                        }
                    }
                }).appendTo(contentElement),
                $("<div>").css('display', 'inline-flex').attr("id", "boton-mas").dxButton({
                    icon: "plus",
                    type: 'default',
                    onClick: () => {
                        let add = $('#text-cantidad').dxNumberBox('instance');
                        let value = add.option('value') + 1;
                        add.option('value', value);
                    }
                }).appendTo(contentElement)
            },
            onShowing: (e) => {
                let add = $('#text-cantidad').dxNumberBox('instance');
                add.option('value', 0);
            },
            toolbarItems: [{
                toolbar: 'top',
                text: "Seleccione cantidad",
                location: "center"
            }, {
                widget: "dxButton",
                toolbar: 'bottom',
                location: "after",
                options: {
                    text: "Añadir",
                    icon: "plus",
                    type: 'success',
                    disabled: this.enable,
                    onClick: () => {
                        let add = $('#text-cantidad').dxNumberBox('instance');
                        let value = add.option('value');
                        let prodData: any = {
                            ID: 0,
                            ProductoID: this.prodSelec().ID,
                            Nombre: this.prodSelec().Nombre,
                            Precio: this.prodSelec().Precio,
                            Cantidad: value,
                            PrecioT: this.prodSelec().Precio * value
                        }
                        this.listProd.push(prodData);
                        this.prodSelec([]);
                        var list = $("#grid-prod-select").dxDataGrid("instance");
                        list.refresh();
                        let popAddProd = $('#add-popup').dxPopup('instance');
                        popAddProd.hide();
                    }
                }
            }]
        }

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
/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Pedidos {
    'use strict'
    export class PedidosIndexViewModel {
        public productos: KnockoutObservableArray<any> = ko.observableArray<any>();
        public categorias: KnockoutObservableArray<any> = ko.observableArray<any>();
        public categoriasFilter: KnockoutObservableArray<any> = ko.observableArray<any>();
        public enable: KnockoutObservable<boolean> = ko.observable(true);
        public idRow: KnockoutObservable<number> = ko.observable(0);
        public idRowIndex: KnockoutObservable<number> = ko.observable(-1);
        public prodByCat: KnockoutObservable<number> = ko.observable(-1);
        public imagen: KnockoutObservable<any> = ko.observable<any>();

        public limpiarForm() {
            let formData: any = $('#form-productos').dxForm('option').formData;
            formData.ID = 0;
            formData.Nombre = "";
            formData.Precio = "";
            formData.Descuento = "";
            formData.StockActual = "";
            formData.Foto = "";
            formData.Tipo = "";
        };

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

        addProductos(): void {

            let formData: any = $('#form-productos').dxForm('option').formData;

            if (formData.Nombre === "") {
                DevExpress.ui.notify("No se puede crear producto, falta nombre.", "error", 3000);
                return;
            }
            if (formData.Precio === "") {
                DevExpress.ui.notify("No se puede crear producto, falta precio.", "error", 3000);
                return;
            }
            if (formData.StockActual === "") {
                DevExpress.ui.notify("No se puede crear producto, falta stock.", "error", 3000);
                return;
            }
            if (formData.Tipo === "") {
                DevExpress.ui.notify("No se puede crear producto, falta la categoría.", "error", 3000);
                return;
            }

            let url = 'api/productos';
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    ID: formData.ID,
                    Nombre: formData.Nombre,
                    Precio: formData.Precio,
                    Descuento: formData.Descuento,
                    StockActual: formData.StockActual,
                    Foto: formData.Foto,
                    TipoID: formData.Tipo
                }
            }).done((data: any) => {
                DevExpress.ui.notify("Datos guardados correctamente.", "success", 2000);
                $('#form-productos').dxForm('instance').resetValues();
                this.getProductos(this.prodByCat());
                let grid = $('#grid-productos').dxDataGrid('instance');
                this.limpiarForm();
                this.enable(true);
                grid.refresh();
                grid.repaint();
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        }

        constructor() {
            this.getProductos(this.prodByCat());
            this.getCategorias();
            this.imagen([]);
        }

        formOptions: any = {
            formData: this.productos,
            labelLocation: "top",
            items: [{
                itemType: "group",
                colCount: 1,
                items: [{
                    dataField: "Nombre",
                    editorType: "dxTextBox",
                    label: { text: 'Nombre' },
                    editorOptions: {
                        showClearButton: true
                    }
                }, {
                    dataField: "Precio",
                    editorType: "dxNumberBox",
                    editorOptions: {
                        showClearButton: true
                    }
                }, {
                    dataField: "Descuento",
                    editorType: "dxNumberBox",
                    editorOptions: {
                        showClearButton: true
                    }
                }, {
                    dataField: "StockActual",
                    editorType: "dxNumberBox",
                    label: { text: 'Stock' },
                    editorOptions: {
                        showClearButton: true
                    }
                }, {
                    dataField: "Foto",
                    template: (data, itemElement) => {
                        itemElement.append($("<div>").attr("id", "dxfoto").dxFileUploader({
                            selectButtonText: "Seleccionar imagen",
                            labelText: "o arrastra archivo aquí",
                            uploadMethod: 'POST',
                            uploadMode: "useForm",
                            accept: 'image/*',
                            name: 'Foto',
                            onValueChanged: (e) => {
                                let formImg: any = $('#form-productos').dxForm('option', 'formData');
                                if (e.value !== null) {
                                    var fotoblob = new Blob(e.value, { type: 'image/png' });
                                    var reader = new FileReader();

                                    reader.onload = function () {
                                        formImg.Foto = reader.result;
                                    };
                                    reader.readAsDataURL(fotoblob);
                                }
                                else {
                                    formImg.Foto = null;
                                }
                            }
                        }));
                    }
                }, {
                    dataField: "Tipo",
                    editorType: "dxSelectBox",
                    editorOptions: {
                        dataSource: this.categorias,
                        placeholder: "Seleccione una categoría...",
                        displayExpr: 'nombre',
                        valueExpr: 'id'
                    }
                }]
            }]
        };

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
                $('#form-productos').dxForm('instance').resetValues();
                this.limpiarForm();
                this.idRow(0);
                this.enable(true);
                let grid = $('#grid-productos').dxDataGrid('instance');
                grid.deselectAll();
                let popForm = $('#form-popup').dxPopup('instance');
                popForm.show();
            }
        }
    }
}
/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Productos {
    'use strict'
    export class ProductosIndexViewModel {
        public productos: KnockoutObservableArray<any> = ko.observableArray<any>();
        public categorias: KnockoutObservableArray<any> = ko.observableArray<any>();
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
                        Foto: data[i].foto,
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
            //if (formData.Descuento === "") {
            //    DevExpress.ui.notify("No se puede crear producto, falta descuento.", "error", 3000);
            //    return;
            //}
            if (formData.StockActual === "") {
                DevExpress.ui.notify("No se puede crear producto, falta stock.", "error", 3000);
                return;
            }
            //if (formData.Foto === "") {
            //    DevExpress.ui.notify("No se puede crear producto, falta la imagen.", "error", 3000);
            //    return;
            //}
            if (formData.Tipo === "") {
                DevExpress.ui.notify("No se puede crear producto, falta la categoría.", "error", 3000);
                return;
            }

            let file: DevExpress.ui.dxFileUploader = $('#dxfoto').dxFileUploader('instance');
            file.option("value");

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

        deleteProducto(id: number): void {
            let url = 'api/productos/' + id;
            $.ajax({
                type: 'DELETE',
                url: url
            }).done((data: any) => {
                $('#form-productos').dxForm('instance').resetValues();
                this.limpiarForm();
                this.enable(true);
                DevExpress.ui.notify("Producto eliminado satisfactoriamente", "success", 3000);
            }).fail((data: any) => {
                DevExpress.ui.notify(data.responseJSON, "error", 3000);
            });
        };

        constructor() {
            this.getProductos(this.prodByCat());
            this.getCategorias();
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
                    template: function (data, itemElement) {
                        itemElement.append($("<div>").attr("id", "dxfoto").dxFileUploader());
                    },
                    editorOptions: {
                        uploadMethod: 'POST',
                        uploadMode: "instantly"
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

        buttonOptionsDelete: any = {
            text: "Borrar",
            icon: "remove",
            type: 'danger',
            disabled: this.enable,
            onClick: () => {
                let grid = $('#grid-productos').dxDataGrid('instance');
                grid.deleteRow(this.idRowIndex());
                grid.repaint();
            }
        }

        dataGridOptions: any = {
            dataSource: this.productos,
            loadPanel: {
                enabled: true,
                text: 'Cargando datos...'
            },
            selection: {
                mode: "single"
            },
            columns: [{ dataField: 'ID', visible: false },
                { dataField: 'Nombre', width: "35%" },
                { dataField: 'Tipo.nombre', caption: 'Categoría' },
                { dataField: 'StockActual', caption: 'Stock Actual', width: "9%" },
                { dataField: 'Precio', width: "8%" },
                { dataField: 'Descuento', width: "9%" },
                'Foto'],
            editing: {
                texts: {
                    confirmDeleteMessage: '¿Esta seguro de eliminar registro de producto?'
                }
            },
            onRowRemoved: () => {
                let index = this.idRow();
                this.deleteProducto(index);
            },
            grouping: {
                allowCollapsing: true
            },
            export: {
                allowExportSelectedData: true,
                enabled: true,
                fileName: 'productos'
            }, columnChooser: {
                allowSearch: true
            },
            showBorders: true
            , rowAlternationEnabled: true
            , showRowLines: true
            , showColumnLines: true
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
                let formData: any = $('#form-productos').dxForm('option');
                let productoData: any = {
                    ID: e.data.ID,
                    Nombre: e.data.Nombre,
                    Precio: e.data.Precio,
                    Descuento: e.data.Descuento,
                    StockActual: e.data.StockActual,
                    Tipo: e.data.Tipo.id,
                    Foto: e.data.Foto
                }
                this.idRow(productoData.ID);
                this.idRowIndex(e.rowIndex);
                formData.formData = productoData;
                let form = $('#form-productos').dxForm('instance');
                form.repaint();
            }
        };

        formPopup: any = {
            visible: false,
            width: 500,
            height: 590,
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            dragEnabled: true,
            closeOnOutsideClick: true,
            contentTemplate: (e) => {
                return $('#form-productos')
            },
            toolbarItems: [{
                toolbar: 'top',
                text: "Añadir producto",
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
                        this.addProductos();
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
                $('#form-productos').dxForm('instance').resetValues();
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
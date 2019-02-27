/// <reference path="../../typings/devextreme/devextreme.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Productos {
    'use strict'
    export class ProductosIndexViewModel {
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
                            onInitialized: (e) => {

                            },
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

        gllryOptions: any = {
            dataSource: [this.imagen],
            height: 400,
            showIndicator: false,
            stretchImages: true
        }

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
                {
                    dataField: 'Foto',
                    cellTemplate: function (element, info) {
                        element.append("<div>" + info.text + "</div>").css("color", "blue").css("text-decoration", "underline");
                    }, customizeText: function (cellInfo) {
                        switch (cellInfo.value) {
                            default:
                                return 'Ver foto...'
                        }
                    }
                }],
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
            scrolling: {
                mode: "virtual"
            },
            onCellClick: (e) => {
                if (e.column.dataField == 'Foto') {
                    this.imagen([]);
                    $.getJSON('api/productos/fotos/' + e.data.ID).then((result: any): void => {
                        var contentType = 'image/png';
                        var blob = this.b64toBlob(result, contentType, 512);
                        var blobUrl = URL.createObjectURL(blob);
                        this.imagen(blobUrl);
                    });
                    let popGllry = $('#gllry-popup').dxPopup('instance');
                    popGllry.show();
                }
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
                    Tipo: e.data.Tipo.id
                }
                this.idRow(productoData.ID);
                this.idRowIndex(e.rowIndex);
                formData.formData = productoData;
                let form = $('#form-productos').dxForm('instance');
                form.repaint();
            }
        };

        gllryPopup: any = {
            visible: false,
            width: 500,
            height: 500,
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            dragEnabled: true,
            closeOnOutsideClick: true,
            contentTemplate: (e) => {
                return $('#gllry-productos')
            }
        }

        formPopup: any = {
            visible: false,
            width: 500,
            height: "auto",
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
                let grid = $('#grid-productos').dxDataGrid('instance');
                grid.deselectAll();
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

        cateFilter: any = {
            dataSource: this.categoriasFilter,
            placeholder: "Filtrar por categoría...",
            displayExpr: 'nombre',
            valueExpr: 'id',
            onInitialized: (e) => {
                var newItem = {
                    id: -1,
                    nombre: "Todo"
                };
                var dataSource = e.component.getDataSource();
                e.customItem = newItem;
                dataSource.store().insert(newItem);
                dataSource.reload();
            },  
            onItemClick: (e) => {
                this.prodByCat(e.itemData.id);
                this.getProductos(this.prodByCat());
            }
        }

        public b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var arr = b64Data.split(',');
            b64Data = arr[arr.length - 1];

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }
    }
}
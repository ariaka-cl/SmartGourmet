@Code
    ViewData("Title") = "Index"
End Code

<link rel="dx-theme" data-theme="generic.greenmist" href="https://cdn3.devexpress.com/jslib/18.2.5/css/dx.greenmist.css" />
<div id="titulo" class="long-title" style="text-align:center;"><h3 style="text-shadow: 3px 3px 19px #a7a7a7; letter-spacing:2px;margin-top:30px;">SMARTGOURMET</h3></div>
<div id="titulo" class="long-title" style="text-align:center;"><h4 style="text-shadow: 3px 3px 19px #a7a7a7; letter-spacing:2px;">Gestionar Productos</h4></div>

<div id="cuerpo" style="margin-bottom:70px" class="dx-fieldset">

    <div class="dx-field" style="display: none;">
        <div id="form-productos" data-bind="dxForm: formOptions"></div>
    </div>

    <div class="dx-field">
        <div id="botonesDetalle" class="btn-group" role="group" style="float:right;">
            <div id="botonOpt" data-bind="dxButton: modifPopup"></div>
            <div id="botonOpt" data-bind="dxButton: buttonOptionsDelete"></div>
        </div>
        <div id="botonesDetalle" class="btn-group" role="group">
            <div id="botonCrear" data-bind="dxButton: addPopup"></div>
        </div>
    </div>

    <div class="dx-field">
        <div id="grid-productos" data-bind="dxDataGrid: dataGridOptions"></div>
    </div>

    <div class="dx-field">
        <div id="form-popup" data-bind="dxPopup: formPopup"></div>
    </div>

</div>

@section scripts
    <script type="text/javascript" src="~/Scripts/app/Productos/productos.js"></script>
    <script>
        ko.applyBindings(new Productos.ProductosIndexViewModel());
    </script>
End Section
@Code
    ViewData("Title") = "Index"
End Code

<link rel="dx-theme" data-theme="generic.greenmist" href="https://cdn3.devexpress.com/jslib/18.2.5/css/dx.greenmist.css" />
<div id="titulo" class="long-title" style="text-align:center;"><h3 style="text-shadow: 3px 3px 19px #a7a7a7; letter-spacing:2px;margin-top:30px;">SMARTGOURMET</h3></div>
<div id="titulo" class="long-title" style="text-align:center;"><h4 style="text-shadow: 3px 3px 19px #a7a7a7; letter-spacing:2px;">Registrar Pedido</h4></div>

<div id="cuerpo" style="margin-bottom:70px" class="dx-fieldset">

    <div class="dx-field">
        <div id="boton" class="btn-group" role="group" style="float:left;">
            <div id="botonBack" data-bind="dxButton: backButton"></div>
        </div>
        <div id="boton" class="btn-group" role="group" style="float:right;">
            <div id="botonClean" data-bind="dxButton: cleanButton"></div>
        </div>
    </div>

    <div class="dx-field">
        <div id="form-pedidos" data-bind="dxForm: formOptions"></div>
    </div>

    <div class="dx-field">
        <div id="boton" class="btn-group" role="group" style="display:table; margin: auto;">
            <div id="botonCreate" data-bind="dxButton: createButton"></div>
        </div>
    </div>

</div>

@section scripts
    <script type="text/javascript" src="~/Scripts/app/Pedidos/pedidos.js"></script>
    <script>
        ko.applyBindings(new Pedidos.PedidosIndexViewModel());
    </script>
End Section
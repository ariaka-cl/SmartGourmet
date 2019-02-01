@Code
    ViewData("Title") = "Index"
End Code

<div id="titulo" class="long-title"><h3>Creación Clientes</h3></div>

<div id="cuerpo" style="margin-bottom:70px" class="dx-fieldset">
    <div class="dx-field">
        <div id="form-clientes" data-bind="dxForm: formOptions"></div> <!--??-->
    </div>

    <div class="dx-field">
        <div id="botonesDetalle" class="btn-group" role="group">
            <div id="botonCrear" data-bind="dxButton: buttonOptionsClear"></div>
            <div id="botonCrear" data-bind="dxButton: buttonOptionsDelete"></div>
            <div id="botonCrear" data-bind="dxButton: buttonOptionsAdd"></div>
        </div>
    </div>

    <div class="dx-field">
        <div id="grid-clientes" data-bind="dxDataGrid: dataGridOptions"></div>
    </div>
</div>


@section scripts
    <script type="text/javascript" src="~/Scripts/app/Clientes/clientes.js"></script>
    <script>
        ko.applyBindings(new Clientes.ClientesIndexViewModel());
    </script>
End Section


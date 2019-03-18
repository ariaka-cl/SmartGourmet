@Code
    ViewData("Title") = "Admin Caja"
End Code

<link rel="dx-theme" data-theme="generic.greenmist" href="https://cdn3.devexpress.com/jslib/18.2.5/css/dx.greenmist.css" />

<div id="titulo" class="long-title" style="text-align:center;"><h3>Administración Caja</h3></div>
<div id="cuerpo" style="margin-bottom:70px" class="dx-fieldset">

    <div id="botonesDetalle" class="btn-group" role="group" style="float:right;">
        <div class="dx-field">
            <div id="estiloBoton" data-bind="dxButton: botonAbrirTurno"></div>
            @*<div id="estiloBoton" data-bind="dxButton: botonCerrarTarde"></div>
                <div id="estiloBoton" data-bind="dxButton: botonCerrarNoche"></div>*@
        </div>
    </div>

    <br>

    <div id="titulo" class="long-title">
        <h3>
            <span class="dx-icon-chart icon"></span>
            Folio Caja: <span data-bind="text: idRow"> </span>
            <span class="glyphicon glyphicon-calendar"> </span>
            <span data-bind="text: fecha"></span>
            <span class="glyphicon glyphicon-play"> </span>
            <span data-bind="text: turno"></span>
            <span class="glyphicon glyphicon-usd" ></span>
            <samp data-bind="text: saldo"></samp>
        </h3>
    </div>

    <div class="dx-field">
        <div id="grid-caja" data-bind="dxDataGrid: dataGridOptions"></div>
    </div>

    <div id="titulo" class="long-title">
        <h3>
            <span class="dx-icon-doc icon"></span>
            Historial Pagos
        </h3>
    </div>
    <div class="dx-field" style="margin-bottom: 30px">
        <div id="historialPagos" data-bind="dxDataGrid: historialPagos"></div>
    </div>


</div>

@section scripts
    <script type="text/javascript" src="~/Scripts/app/AdminCaja/admincaja.js"></script>
    <script>
         ko.applyBindings(new AdminCaja.AdminCajaIndexViewModel());
    </script>
End Section

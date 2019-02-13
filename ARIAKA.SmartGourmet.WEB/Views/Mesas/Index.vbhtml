@Code
    ViewData("Title") = "Mesas"
End Code

<link rel="dx-theme" data-theme="generic.greenmist" href="https://cdn3.devexpress.com/jslib/18.2.5/css/dx.greenmist.css" />

<style>
    .centrar {
        position: absolute;
        /*nos posicionamos en el centro del navegador*/
        left: 35%;
    }
</style>

<div class='centrar'>
    <div class="row">
        <div class="col-sm-12 col-md-6">
            <div id="titulo" class="long-title"><h3>Gestión de Mesas</h3></div>
            <div id="cuerpo" style="margin-bottom:70px" class="dx-fieldset">
                <div class="dx-field" style="display: none;">
                    <div id="form-mesas" data-bind="dxForm: formOptions"></div>
                </div>

                <div class="dx-field">
                    <div id="botonesDetalle" class="btn-group" role="group" style="float:left;">
                        <div id="botonOpt" data-bind="dxButton: modifPopup"></div>
                        <div id="botonOpt" data-bind="dxButton: buttonOptionsDelete"></div>
                        <div id="botonCrear" data-bind="dxButton: addPopup"></div>
                    </div>
                </div>

                <br>

                <div class="dx-viewport demo-container">
                    <div id="tileview" class="dx-tileview"></div>
                </div>

                <div class="dx-field">
                    <div id="form-popup" data-bind="dxPopup: formPopup"></div>
                </div>
            </div>
        </div>
    </div>
</div>


@section scripts
    <script type="text/javascript" src="~/Scripts/app/Mesas/mesas.js"></script>
    <script>
        ko.applyBindings(new Mesas.MesasIndexViewModel());
    </script>
End Section


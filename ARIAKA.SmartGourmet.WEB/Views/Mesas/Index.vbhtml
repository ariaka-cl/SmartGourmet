@Code
    ViewData("Title") = "Mesas"
End Code

<link rel="dx-theme" data-theme="generic.greenmist" href="https://cdn3.devexpress.com/jslib/18.2.5/css/dx.greenmist.css" />
<div id="titulo" class="long-title" style="text-align:center;"><h3 style="text-shadow: 3px 3px 19px #a7a7a7; letter-spacing:2px;margin-top:30px;">SMARTGOURMET</h3></div>
<div id="titulo" class="long-title" style="text-align:center;"><h4 style="text-shadow: 3px 3px 19px #a7a7a7; letter-spacing:2px;">Gestión de Mesas</h4></div>

<div id="cuerpo" style="margin-bottom:70px" class="dx-fieldset">

    <div class="dx-field" style="display: none;">
        <div id="form-mesas" data-bind="dxForm: formOptions"></div>
    </div>
    <div class="dx-field" style="display: none;">
        <div id="form-modif-mesas" data-bind="dxForm: formModifOptions"></div>
    </div>
    <div class="dx-field" style="display: none;">
        <div id="form-delete-mesas" data-bind="dxForm: formDeleteOptions"></div>
    </div>

    <div class="dx-field">
        <div id="botonesDetalle" class="btn-group" role="group" style="float:right;">
            <div id="botonOpt" data-bind="dxButton: modifPopup"></div>
            <div id="botonOpt" data-bind="dxButton: deletePopup"></div>
            <div id="botonCrear" data-bind="dxButton: addPopup"></div>
        </div>
    </div>

    <br>

    <div class="dx-viewport demo-container">
        <div id="tileview" data-bind="dxTileView:tileview"></div>
    </div>

    <div class="dx-field">
        <div id="form-popup" data-bind="dxPopup: formPopup"></div>
    </div>    
    <div class="dx-field">
        <div id="form-modif-popup" data-bind="dxPopup: formModifPopup"></div>
    </div>    
    <div class="dx-field">
        <div id="form-delete-popup" data-bind="dxPopup: formDeletePopup"></div>
    </div>
</div>

@section scripts
    <script type="text/javascript" src="~/Scripts/app/Mesas/mesas.js"></script>
    <script>
        ko.applyBindings(new Mesas.MesasIndexViewModel());
    </script>
End Section


@Code
    ViewData("Title") = "Index"
End Code

<h2>Cliente</h2>
<div id="botonCrear" data-bind="dxButton: buttonOptions"></div>

@section scripts
    <script type="text/javascript" src="~/Scripts/app/Clientes/clientes.js"></script>
    <script>
        ko.applyBindings(new Clientes.ClientesIndexViewModel());
    </script>
End Section


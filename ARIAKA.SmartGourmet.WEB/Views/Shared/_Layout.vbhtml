﻿<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@ViewBag.Title - Mi aplicación ASP.NET</title>
    @Styles.Render("~/Content/css")
    @Scripts.Render("~/bundles/modernizr")
</head>
<body style="background: #eee url(https://subtlepatterns.com/patterns/extra_clean_paper.png);">
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                @Html.ActionLink("Smart Gourmet", "Index", "Home", New With {.area = ""}, New With {.class = "navbar-brand"})
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <!--<li>@Html.ActionLink("Inicio", "Index", "Home")</li>
                    <li>@Html.ActionLink("Acerca de", "About", "Home")</li>
                    <li>@Html.ActionLink("Contacto", "Contact", "Home")</li>-->
                    <li>@Html.ActionLink("Gestionar Clientes", "Index", "Clientes")</li>
                    <li>@Html.ActionLink("Gestionar Usuarios", "Index", "Usuarios")</li>
                    <li>@Html.ActionLink("Gestionar Productos", "Index", "Productos")</li>
                    <li>@Html.ActionLink("Gestionar Categorías", "Index", "Categorias")</li>
                    <li>@Html.ActionLink("Gestionar Mesas", "Index", "Mesas")</li>
                    <li>@Html.ActionLink("Gestionar Pedidos", "Index", "Pedidos")</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="container body-content">
        @RenderBody()
        <hr />
        <footer>
            <p>&copy; @DateTime.Now.Year - Ariaka</p>
        </footer>
    </div>

    @Scripts.Render("~/bundles/jquery")
    @Scripts.Render("~/bundles/bootstrap")
    @Scripts.Render("~/bundles/knockout")
    @Scripts.Render("~/bundles/devextreme")
    @Scripts.Render("~/bundles/app")
    @RenderSection("scripts", required:=False)
</body>
</html>

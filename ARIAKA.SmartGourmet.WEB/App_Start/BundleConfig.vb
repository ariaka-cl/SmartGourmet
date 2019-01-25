Imports System.Web.Optimization

Public Module BundleConfig
    ' Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
    Public Sub RegisterBundles(ByVal bundles As BundleCollection)

        bundles.Add(New ScriptBundle("~/bundles/jquery").Include(
                    "~/Scripts/jquery-3.{version}.js"))

        bundles.Add(New ScriptBundle("~/bundles/jquery1").Include(
                    "~/Scripts/jquery-1.{version}.js"))

        bundles.Add(New ScriptBundle("~/bundles/jqueryval").Include(
                    "~/Scripts/jquery.validate*"))

        ' Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información. De este modo, estará
        ' preparado para la producción y podrá utilizar la herramienta de compilación disponible en http://modernizr.com para seleccionar solo las pruebas que necesite.
        bundles.Add(New ScriptBundle("~/bundles/modernizr").Include(
                    "~/Scripts/modernizr-*"))

        bundles.Add(New ScriptBundle("~/bundles/bootstrap").Include(
                  "~/Scripts/bootstrap.js",
                  "~/Scripts/respond.js"))

        bundles.Add(DevExtremeBundle())

        bundles.Add(New ScriptBundle("~/bundles/knockout").Include(
                  "~/Scripts/knockout-{version}.js"))

        bundles.Add(New StyleBundle("~/Content/css").Include(
                  "~/Content/bootstrap.css",
                  "~/Content/dx.common.css",
                  "~/Content/Site.css",
                  "~/Content/dx.light.css"))

        bundles.Add(New StyleBundle("~/Content/custom/css").Include(
                  "~/Content/bootstrap.css",
                  "~/Content/dx.common.css",
                  "~/Content/dx.light.css",
                  "~/Content/Site.css",
                  "~/Content/style.css"))
        bundles.Add(New ScriptBundle("~/bundles/app").Include(
                 "~/Scripts/app/app.js",
                 "~/Scripts/app/Utils.js"))

        '' JsPdf for client side export
        'bundles.Add(New ScriptBundle("~/bundles/jspdf").Include(
        '         "~/Scripts/jspdf.js"))

        '' Moment for client side export
        'bundles.Add(New ScriptBundle("~/bundles/moment").Include(
        '         "~/Scripts/moment.js"))

    End Sub

    Private Function DevExtremeBundle() As ScriptBundle
        Dim bundle As New ScriptBundle("~/bundles/devextreme")

        ' CLDR scripts
        bundle _
            .Include("~/Scripts/cldr.js") _
            .Include("~/Scripts/cldr/event.js") _
            .Include("~/Scripts/cldr/supplemental.js") _
            .Include("~/Scripts/cldr/unresolved.js")

        ' Globalize 1.x
        bundle _
            .Include("~/Scripts/globalize.js") _
            .Include("~/Scripts/globalize/number.js") _
            .Include("~/Scripts/globalize/currency.js") _
            .Include("~/Scripts/globalize/date.js") _
            .Include("~/Scripts/globalize/message.js")

        ' JSZip for client side export
        bundle.Include("~/Scripts/jszip.js")

        ' DevExtreme
        bundle.Include("~/Scripts/dx.web.js")

        Return bundle
    End Function
End Module
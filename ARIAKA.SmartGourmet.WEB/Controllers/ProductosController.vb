Imports System.Web.Mvc

Namespace Controllers
    <RoutePrefix("productos")>
    Public Class ProductosController
        Inherits Controller

        <Route("")>
        Function Index() As ActionResult
            Return View()
        End Function
    End Class
End Namespace
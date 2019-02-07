Imports System.Web.Mvc

Namespace Controllers
    <RoutePrefix("clientes")>
    Public Class ClientesController
        Inherits Controller

        <Route("")>
        Function Index() As ActionResult
            Return View()
        End Function
    End Class
End Namespace
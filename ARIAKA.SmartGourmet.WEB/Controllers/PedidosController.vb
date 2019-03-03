Imports System.Web.Mvc

Namespace Controllers
    <RoutePrefix("pedidos")>
    Public Class PedidosController
        Inherits Controller

        <Route("")>
        Function Index() As ActionResult
            Return View()
        End Function
    End Class
End Namespace
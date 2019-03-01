Imports System.Web.Mvc

Namespace Controllers
    <RoutePrefix("mesas")>
    Public Class MesasController
        Inherits Controller

        <Route("")>
        Function Index() As ActionResult

            Return View()
        End Function
    End Class
End Namespace
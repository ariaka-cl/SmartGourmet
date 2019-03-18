Imports System.Web.Mvc

Namespace Controllers
    <RoutePrefix("admincaja")>
    Public Class AdminCajaController
        Inherits Controller

        <Route("")>
        Function Index() As ActionResult
            Return View()
        End Function
    End Class
End Namespace
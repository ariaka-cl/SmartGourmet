Imports System.Web.Mvc

Namespace Controllers
    <RoutePrefix("usuarios")>
    Public Class UsuariosController
        Inherits Controller

        <Route("")>
        Function Index() As ActionResult
            Return View()
        End Function
    End Class
End Namespace
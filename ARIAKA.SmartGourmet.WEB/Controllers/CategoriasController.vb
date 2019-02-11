Imports System.Web.Mvc

Namespace Controllers
    <RoutePrefix("categorias")>
    Public Class CategoriasController
        Inherits Controller

        <Route("")> 'es en blano porque es el index y es por defecto
        Function Index() As ActionResult

            Return View()
        End Function
    End Class
End Namespace
Imports System.Net
Imports System.Web.Http
Imports ARIAKA.SmartGourmet.DATA.Model

Namespace Controllers.API
    <RoutePrefix("api/clientes")>
    Public Class ClientesApiController
        Inherits ApiController

        <HttpGet>
        <Route("", Name:="GetClientes")>
        Public Function GetCliente() As IHttpActionResult

            Dim db As New SGContext
            Try
                Dim listClientes As List(Of Cliente) = db.Clientes.ToList()
                If listClientes Is Nothing OrElse listClientes.Count = 0 Then Return Me.Ok(New List())
            Catch ex As Exception

            End Try

            Return Me.Content(HttpStatusCode.OK, "HolaMundo")

        End Function

    End Class
End Namespace
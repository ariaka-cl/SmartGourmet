Imports System.Net
Imports System.Web.Http
Imports ARIAKA.SmartGourmet.DATA.Model

Namespace Controllers.API
    <RoutePrefix("api/clientes")>
    Public Class ClientesApiController
        Inherits ApiController

        <HttpGet>
        <Route("", Name:="GetClientes")>
        Public Function GetClientes() As IHttpActionResult

            Dim db As New SGContext
            Try
                Dim listClientes As List(Of Cliente) = db.Clientes.ToList()
                If listClientes Is Nothing OrElse listClientes.Count = 0 Then Return Me.Ok(New List(Of Models.ClienteDTO))
                Dim listClienteDto As New List(Of Models.ClienteDTO)

                For Each cliente As Cliente In listClientes
                    listClienteDto.Add(New Models.ClienteDTO With {.ID = cliente.ID,
                                                                .Nombre = cliente.Nombre,
                                                                .Apellido = cliente.Apellido,
                                                                .Direccion = cliente.Direccion,
                                                                .Telefono = cliente.Telefono,
                                                                .NombreCompleto = cliente.Nombre + " " + cliente.Apellido})
                Next
                Return Me.Ok(listClienteDto)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpPost>
        <Route("", Name:="PostClientes")>
        Public Function PostClientes(<FromBody> model As Models.ClienteDTO) As IHttpActionResult

            If model Is Nothing Then Return Me.Content(HttpStatusCode.BadRequest, "Error al obtener información.")

            Dim db As New SGContext
            Try
                If model.ID <> 0 Then 'Actualiza
                    Dim clientExist As Cliente = db.Clientes.Where(Function(t) t.ID = model.ID).SingleOrDefault()
                    With clientExist
                        .Nombre = model.Nombre
                        .Apellido = model.Apellido
                        .Telefono = model.Telefono
                        .Direccion = model.Direccion
                    End With
                    db.SaveChanges()
                    Return Me.Ok(model)
                End If

                If db.Clientes.Where(Function(t) t.Telefono = model.Telefono).Any Then
                    Return Me.Content(HttpStatusCode.BadRequest, "Ya existe este número telefónico almacenado.")
                End If

                If model.Nombre.Contains(" ") Then
                    Dim nombreCompleto As String() = model.Nombre.Split(" ")
                    model.Nombre = nombreCompleto(0)
                    model.Apellido = nombreCompleto(1)
                End If

                Dim cliente As New Cliente With {.Nombre = model.Nombre,
                                                .Apellido = model.Apellido,
                                                .Telefono = model.Telefono,
                                                .Direccion = model.Direccion
                }
                db.Clientes.Add(cliente)
                db.SaveChanges()
                model.ID = cliente.ID
                Return Me.Ok(model)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try

        End Function

        <HttpDelete>
        <Route("{id}", Name:="DeleteCliente")>
        Public Function DeleteCliente(id As Integer) As IHttpActionResult

            If id = 0 Then
                Return Me.Content(HttpStatusCode.NotFound, "No se puede eliminar el cliente debido a posibles dependencias asociadas.")
            End If

            Dim db As New SGContext
            Try
                Dim cliente As Cliente = db.Clientes.Where(Function(u) u.ID = id).SingleOrDefault

                If db.Pedidos.Where(Function(p) p.Comprador.ID = cliente.ID).Any() Then
                    Return Me.Content(HttpStatusCode.BadRequest, String.Format("El cliente {0} {1} no puede eliminarse debido a que tiene pedidos asociados.", cliente.Nombre, cliente.Apellido))
                End If

                db.Clientes.Remove(cliente)
                db.SaveChanges()
                Return Me.Content(HttpStatusCode.OK, String.Format("El cliente {0} {1} fue eliminado.", cliente.Nombre, cliente.Apellido))

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try

        End Function
    End Class
End Namespace
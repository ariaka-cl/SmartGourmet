Imports System.Net
Imports System.Web.Http
Imports ARIAKA.SmartGourmet.DATA.Model

Namespace Controllers.API
    <RoutePrefix("api/usuarios")>
    Public Class UsuariosAPIController
        Inherits ApiController

        <HttpGet>
        <Route("", Name:="GetUsuarios")>
        Public Function GetUsuarios() As IHttpActionResult

            Dim db As New SGContext
            Try
                Dim listUsuarios As List(Of Usuario) = db.Usuarios.ToList()
                If listUsuarios Is Nothing OrElse listUsuarios.Count = 0 Then Return Me.Ok(New List(Of Models.UsuarioDTO))
                Dim listUsuarioDto As New List(Of Models.UsuarioDTO)

                For Each usuario As Usuario In listUsuarios
                    listUsuarioDto.Add(New Models.UsuarioDTO With {.ID = usuario.ID,
                                                                .Nombre = usuario.Nombre,
                                                                .Apellido = usuario.Apellido,
                                                                .Run = usuario.Run,
                                                                .Password = usuario.Password,
                                                                .Rol = usuario.Rol})
                Next
                Return Me.Ok(listUsuarioDto)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpPost>
        <Route("", Name:="PostUsuarios")>
        Public Function PostUsuarios(<FromBody> model As Models.UsuarioDTO) As IHttpActionResult

            If model Is Nothing Then Return Me.Content(HttpStatusCode.BadRequest, "Error al obtener información.")

            Dim db As New SGContext
            Try
                If model.ID <> 0 Then 'Actualiza
                    Dim userExist As Usuario = db.Usuarios.Where(Function(t) t.ID = model.ID).SingleOrDefault()
                    With userExist
                        .Nombre = model.Nombre
                        .Apellido = model.Apellido
                        .Run = model.Run
                        .Password = model.Password
                        .Rol = model.Rol
                    End With
                    db.SaveChanges()
                    Return Me.Ok(model)
                End If

                If db.Usuarios.Where(Function(t) t.Run = model.Run).Any Then
                    Return Me.Content(HttpStatusCode.BadRequest, "Este usuario ya existe.")
                End If

                'If model.Nombre.Contains(" ") Then
                '    Dim nombreCompleto As String() = model.Nombre.Split(" ")
                '    model.Nombre = nombreCompleto(0)
                '    model.Apellido = nombreCompleto(1)
                'End If

                Dim usuario As New Usuario With {.Nombre = model.Nombre,
                                                .Apellido = model.Apellido,
                                                .Run = model.Run,
                                                .Password = model.Password,
                                                .Rol = model.Rol
                }
                db.Usuarios.Add(usuario)
                db.SaveChanges()
                model.ID = usuario.ID
                Return Me.Ok(model)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try

        End Function

        <HttpDelete>
        <Route("{id}", Name:="DeleteUsuario")>
        Public Function DeleteUsuario(id As Integer) As IHttpActionResult

            If id = 0 Then
                Return Me.Content(HttpStatusCode.NotFound, "No se puede eliminar el usuario debido a posibles dependencias asociadas.")
            End If

            Dim db As New SGContext
            Try
                Dim usuario As Usuario = db.Usuarios.Where(Function(u) u.ID = id).SingleOrDefault

                If db.Ventas.Where(Function(p) p.Vendedor.ID = usuario.ID).Any() Then
                    Return Me.Content(HttpStatusCode.BadRequest, String.Format("El usuario {0} {1} no puede eliminarse debido a que tiene ventas asociadas.", usuario.Nombre, usuario.Apellido))
                End If

                db.Usuarios.Remove(usuario)
                db.SaveChanges()
                Return Me.Content(HttpStatusCode.OK, String.Format("El usuario {0} {1} fue eliminado.", usuario.Nombre, usuario.Apellido))

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try

        End Function
    End Class
End Namespace
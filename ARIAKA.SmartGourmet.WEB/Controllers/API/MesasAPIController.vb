Imports System.Net
Imports System.Web.Http
Imports ARIAKA.SmartGourmet.DATA.Model

Namespace Controllers.API
    <RoutePrefix("api/mesas")>
    Public Class MesasAPIController
        Inherits ApiController

        <HttpGet>
        <Route("", Name:="GetMesas")>
        Public Function GetMesas() As IHttpActionResult

            Dim db As New SGContext
            Try
                Dim listMesas As List(Of Mesa) = db.Mesas.ToList()
                If listMesas Is Nothing OrElse listMesas.Count = 0 Then Return Me.Ok(New List(Of Models.MesaDTO))

                Dim listMesaDto As New List(Of Models.MesaDTO)
                For Each mesa As Mesa In listMesas
                    listMesaDto.Add(New Models.MesaDTO With {
                                    .ID = mesa.ID,
                                    .NumMesa = mesa.NumMesa,
                                    .Capacidad = mesa.Capacidad,
                                    .Estado = mesa.Estado
                     })
                Next
                Return Me.Ok(listMesaDto)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpPost>
        <Route("", Name:="SaveMesas")>
        Public Function SaveMesas(<FromBody> model As Models.MesaDTO) As IHttpActionResult
            If model Is Nothing Then
                Return Me.Content(HttpStatusCode.BadRequest, "Sin Datos en el formulario")
            End If

            Dim db As New SGContext
            Try
                If model.ID <> 0 Then
                    Dim mesaExist As Mesa = db.Mesas.Where(Function(u) u.ID = model.ID).SingleOrDefault()
                    With mesaExist
                        .NumMesa = model.NumMesa
                        .Capacidad = model.Capacidad
                        .Estado = model.Estado
                    End With
                    db.SaveChanges()
                    Return Me.Ok(model)
                End If

                Dim mesa As New Mesa With {.NumMesa = model.NumMesa, .Capacidad = model.Capacidad, .Estado = model.Estado}
                db.Mesas.Add(mesa)
                db.SaveChanges()
                model.ID = mesa.ID
                Return Me.Ok(model)
            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpDelete>
        <Route("{id}", Name:="DeleteMesas")>
        Public Function DeleteMesas(id As Integer) As IHttpActionResult
            If id = 0 Then
                Return Me.Content(HttpStatusCode.NotFound, "Mesa No Encontrada")
            End If

            Dim db As New SGContext
            Try
                Dim mesa As Mesa = db.Mesas.Where(Function(u) u.ID = id).SingleOrDefault()
                db.Mesas.Remove(mesa)
                db.SaveChanges()
                Return Me.Content(HttpStatusCode.OK, String.Format("Mesa Eliminada {0}", id))
            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <Route("estados", Name:="getEstados")>
        <HttpGet>
        Public Function GetEstados() As IHttpActionResult
            Dim tipoEstado As New List(Of Models.EstadoDTO)

            tipoEstado = (From v As Integer In TryCast(System.Enum.GetValues(GetType(EstadoPedido)), Integer()) Select New Models.EstadoDTO With {.Clave = v, .Nombre = System.Enum.GetName(GetType(EstadoPedido), v)}).ToList()

            Return Me.Ok(New With {.tipoEstado = tipoEstado})
        End Function

    End Class
End Namespace
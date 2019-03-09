Imports System.Net
Imports System.Web.Http
Imports ARIAKA.SmartGourmet.DATA.Model

Namespace Controllers.API
    <RoutePrefix("api/pedidos")>
    Public Class PedidosAPIController
        Inherits ApiController

        <HttpPost>
        <Route("", Name:="PostPedidos")>
        Public Function PostPedidos(<FromBody> model As Models.PedidoDTO) As IHttpActionResult

            If model Is Nothing Then Return Me.Content(HttpStatusCode.BadRequest, "Error al obtener información.")

            Dim db As New SGContext
            Try
                If model.ID <> 0 Then
                    Dim pedidoExist As Pedido = db.Pedidos.Where(Function(p) p.ID = model.ID).SingleOrDefault()
                    With pedidoExist
                        .Vendedor = db.Usuarios.Where(Function(u) u.ID = model.VendedorID).SingleOrDefault()
                        .Comprador = db.Clientes.Where(Function(c) c.ID = model.Comprador.ID).SingleOrDefault()
                        .NombreComprador = model.NombreComprador
                        .Mesa = db.Mesas.Where(Function(m) m.ID = model.Mesa.ID).SingleOrDefault()
                        .NroPersonas = model.NroPersonas
                        .EstadoPedido = model.EstadoPedido
                        .Observaciones = model.Observaciones
                        .EsDomicilio = model.EsDomicilio
                    End With
                    db.SaveChanges()
                    model.Vendedor = New Models.UsuarioDTO With {.ID = pedidoExist.Vendedor.ID, .Nombre = pedidoExist.Vendedor.Nombre, .Apellido = pedidoExist.Vendedor.Apellido}
                    model.Comprador = New Models.ClienteDTO With {.ID = pedidoExist.Comprador.ID, .Nombre = pedidoExist.Comprador.Nombre, .Apellido = pedidoExist.Comprador.Apellido}
                    model.Mesa = New Models.MesaDTO With {.ID = pedidoExist.Mesa.ID, .NumMesa = pedidoExist.Mesa.NumMesa, .EstadoStr = pedidoExist.Mesa.Estado.ToString}
                    Return Me.Ok(model)
                End If

                'If db.Pedidos.Where(Function(p) p.Nombre = model.Nombre).Any Then
                '    Return Me.Content(HttpStatusCode.BadRequest, "Este pedido ya existe.")
                'End If

                Dim pedido As New Pedido With {.Fecha = DateTime.Parse(model.Fecha),
                                                .Vendedor = db.Usuarios.Where(Function(u) u.ID = model.VendedorID).SingleOrDefault(),
                                                .Comprador = db.Clientes.Where(Function(c) c.ID = model.Comprador.ID).SingleOrDefault(),
                                                .NombreComprador = model.NombreComprador,
                                                .Mesa = db.Mesas.Where(Function(m) m.ID = 13).SingleOrDefault(),
                                                .NroPersonas = model.NroPersonas,
                                                .EstadoPedido = model.EstadoPedido,
                                                .Observaciones = model.Observaciones,
                                                .EsDomicilio = model.EsDomicilio
                }
                db.Pedidos.Add(pedido)
                db.SaveChanges()
                model.ID = pedido.ID
                model.Vendedor = New Models.UsuarioDTO With {.ID = pedido.Vendedor.ID, .Nombre = pedido.Vendedor.Nombre, .Apellido = pedido.Vendedor.Apellido}
                model.Mesa = New Models.MesaDTO With {.ID = pedido.Mesa.ID, .NumMesa = pedido.Mesa.NumMesa, .EstadoStr = pedido.Mesa.Estado.ToString}
                If model.Comprador.ID <> -1 Then
                    model.Comprador = New Models.ClienteDTO With {.ID = pedido.Comprador.ID, .Nombre = pedido.Comprador.Nombre, .Apellido = pedido.Comprador.Apellido}
                End If
                Return Me.Ok(model)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try

        End Function

        <Route("estados", Name:="getEstadoPedido")>
        <HttpGet>
        Public Function GetEstadoPedido() As IHttpActionResult
            Dim tipoEstadoPedido As New List(Of Models.EstadoPedidoDTO)

            tipoEstadoPedido = (From e As Integer In TryCast(System.Enum.GetValues(GetType(EstadoPedido)), Integer()) Select New Models.EstadoPedidoDTO With {.Clave = e, .Nombre = System.Enum.GetName(GetType(EstadoPedido), e)}).ToList()

            Return Me.Ok(New With {.tipoEstadoPedido = tipoEstadoPedido})
        End Function

    End Class
End Namespace
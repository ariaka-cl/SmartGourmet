Imports System.Net
Imports System.Web.Http
Imports ARIAKA.SmartGourmet.DATA.Model

Namespace Controllers.API
    <RoutePrefix("api/pedidos")>
    Public Class PedidosAPIController
        Inherits ApiController

        <HttpGet>
        <Route("{id}", Name:="GetPedidoByIDMesa")>
        Public Function GetPedidoByIDMesa(id As Integer) As IHttpActionResult

            Dim db As New SGContext
            Try
                Dim listPedido As List(Of Pedido) = Nothing
                Dim listPedidoDto As New List(Of Models.PedidoDTO)

                listPedido = db.Pedidos.Where(Function(p) p.Mesa.ID = id And (p.EstadoPedido = 0 Or p.EstadoPedido = 1)).ToList()

                If listPedido Is Nothing OrElse listPedido.Count = 0 Then Return Me.Ok(New List(Of Models.PedidoDTO))

                'Dim listUsuarios As List(Of Usuario) = db.Usuarios.ToList()
                'Dim listClientes As List(Of Cliente) = db.Clientes.ToList()
                'Dim listMesas As List(Of Mesa) = db.Mesas.ToList()

                For Each pedido As Pedido In listPedido
                    'Dim user As Usuario = listUsuarios.Where(Function(u) u.ID = Producto.Tipo_ID).SingleOrDefault
                    'Dim client As Cliente = listClientes.Where(Function(c) c.ID = Producto.Tipo_ID).SingleOrDefault
                    'Dim mesa As Mesa = listMesas.Where(Function(m) m.ID = Producto.Tipo_ID).SingleOrDefault
                    listPedidoDto.Add(New Models.PedidoDTO With {.ID = pedido.ID,
                                                                .Fecha = pedido.Fecha,
                                                                .NroPersonas = pedido.NroPersonas,
                                                                .EstadoPedido = pedido.EstadoPedido,
                                                                .EstadoPedidoStr = pedido.EstadoPedido.ToString,
                                                                .EsDomicilio = pedido.EsDomicilio,
                                                                .Mesa = New Models.MesaDTO With {.ID = pedido.Mesa.ID,
                                                                                                 .Capacidad = pedido.Mesa.Capacidad,
                                                                                                 .Estado = pedido.Mesa.Estado,
                                                                                                 .EstadoStr = pedido.Mesa.Estado.ToString,
                                                                                                 .NumMesa = pedido.Mesa.NumMesa},
                                                                .Vendedor = New Models.UsuarioDTO With {.ID = pedido.Vendedor.ID,
                                                                                                        .Run = pedido.Vendedor.Run,
                                                                                                        .Rol = pedido.Vendedor.Rol,
                                                                                                        .RolStr = pedido.Vendedor.Rol.ToString,
                                                                                                        .Nombre = pedido.Vendedor.Nombre,
                                                                                                        .Apellido = pedido.Vendedor.Apellido,
                                                                                                        .Password = pedido.Vendedor.Password},
                                                                .NombreComprador = pedido.NombreComprador,
                                                                .Observaciones = pedido.Observaciones
                                      })
                Next
                Return Me.Ok(listPedidoDto)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpGet>
        <Route("modificar/{id}", Name:="GetPedidoByID")>
        Public Function GetPedidoByID(id As Integer) As IHttpActionResult

            Dim db As New SGContext
            Try
                Dim listPedido As List(Of Pedido) = Nothing
                Dim listPedidoDto As New List(Of Models.PedidoDTO)

                listPedido = db.Pedidos.Where(Function(p) p.ID = id).ToList()

                If listPedido Is Nothing OrElse listPedido.Count = 0 Then Return Me.Ok(New List(Of Models.PedidoDTO))

                For Each pedido As Pedido In listPedido
                    listPedidoDto.Add(New Models.PedidoDTO With {.ID = pedido.ID,
                                                                .Fecha = pedido.Fecha,
                                                                .NroPersonas = pedido.NroPersonas,
                                                                .EstadoPedido = pedido.EstadoPedido,
                                                                .EstadoPedidoStr = pedido.EstadoPedido.ToString,
                                                                .EsDomicilio = pedido.EsDomicilio,
                                                                .Mesa = New Models.MesaDTO With {.ID = pedido.Mesa.ID,
                                                                                                 .Capacidad = pedido.Mesa.Capacidad,
                                                                                                 .Estado = pedido.Mesa.Estado,
                                                                                                 .EstadoStr = pedido.Mesa.Estado.ToString,
                                                                                                 .NumMesa = pedido.Mesa.NumMesa},
                                                                .Vendedor = New Models.UsuarioDTO With {.ID = pedido.Vendedor.ID,
                                                                                                        .Run = pedido.Vendedor.Run,
                                                                                                        .Rol = pedido.Vendedor.Rol,
                                                                                                        .RolStr = pedido.Vendedor.Rol.ToString,
                                                                                                        .Nombre = pedido.Vendedor.Nombre,
                                                                                                        .Apellido = pedido.Vendedor.Apellido,
                                                                                                        .Password = pedido.Vendedor.Password},
                                                                .NombreComprador = pedido.NombreComprador,
                                                                .Observaciones = pedido.Observaciones
                                      })
                Next
                Return Me.Ok(listPedidoDto)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpPost>
        <Route("", Name:="PostPedidos")>
        Public Function PostPedidos(<FromBody> model As Models.PedidoDTO) As IHttpActionResult

            If model Is Nothing Then Return Me.Content(HttpStatusCode.BadRequest, "Error al obtener información.")

            If model.Mesa.ID = 0 Then Return Me.Content(HttpStatusCode.BadRequest, "Mesa no válida.")

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
                    model.Mesa = New Models.MesaDTO With {.ID = pedidoExist.Mesa.ID, .NumMesa = pedidoExist.Mesa.NumMesa, .EstadoStr = pedidoExist.Mesa.Estado.ToString}
                    If model.Comprador.ID <> -1 Then
                        model.Comprador = New Models.ClienteDTO With {.ID = pedidoExist.Comprador.ID, .Nombre = pedidoExist.Comprador.Nombre, .Apellido = pedidoExist.Comprador.Apellido}
                    End If
                    Return Me.Ok(model)
                End If

                'If db.Pedidos.Where(Function(p) p.Nombre = model.Nombre).Any Then
                '    Return Me.Content(HttpStatusCode.BadRequest, "Este pedido ya existe.")
                'End If

                Dim pedido As New Pedido With {.Fecha = DateTime.Parse(model.Fecha),
                                                .Vendedor = db.Usuarios.Where(Function(u) u.ID = model.VendedorID).SingleOrDefault(),
                                                .Comprador = db.Clientes.Where(Function(c) c.ID = model.Comprador.ID).SingleOrDefault(),
                                                .NombreComprador = model.NombreComprador,
                                                .Mesa = db.Mesas.Where(Function(m) m.ID = model.Mesa.ID).SingleOrDefault(),
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
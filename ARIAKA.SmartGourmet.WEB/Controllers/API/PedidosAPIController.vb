﻿Imports System.Net
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

                listPedido = db.Pedidos.Where(Function(p) p.Mesa.ID = id And (p.EstadoPedido = EstadoPedido.Preparacion Or p.EstadoPedido = EstadoPedido.Listo)).ToList()

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
                    If pedido.Comprador Is Nothing Then
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
                    Else
                        listPedidoDto.Add(New Models.PedidoDTO With {.ID = pedido.ID,
                                                                .Fecha = pedido.Fecha,
                                                                .NroPersonas = pedido.NroPersonas,
                                                                .EstadoPedido = pedido.EstadoPedido,
                                                                .EstadoPedidoStr = pedido.EstadoPedido.ToString,
                                                                .EsDomicilio = pedido.EsDomicilio,
                                                                .Comprador = New Models.ClienteDTO With {.ID = pedido.Comprador.ID,
                                                                                                 .Apellido = pedido.Comprador.Apellido,
                                                                                                 .Direccion = pedido.Comprador.Direccion,
                                                                                                 .Nombre = pedido.Comprador.Nombre,
                                                                                                 .Telefono = pedido.Comprador.Telefono},
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
                    End If
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

                Dim mesaExist As Mesa = db.Mesas.Where(Function(m) m.ID = model.Mesa.ID).SingleOrDefault()
                If mesaExist.NumMesa <> "Domicilio" Then
                    With mesaExist
                        .Estado = 0
                    End With
                End If
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

        <Route("estados", Name:="GetEstadoPedido")>
        <HttpGet>
        Public Function GetEstadoPedido() As IHttpActionResult
            Dim tipoEstadoPedido As New List(Of Models.EstadoPedidoDTO)

            tipoEstadoPedido = (From e As Integer In TryCast(System.Enum.GetValues(GetType(EstadoPedido)), Integer()) Select New Models.EstadoPedidoDTO With {.Clave = e, .Nombre = System.Enum.GetName(GetType(EstadoPedido), e)}).ToList()

            Return Me.Ok(New With {.tipoEstadoPedido = tipoEstadoPedido})
        End Function

        <HttpGet>
        <Route("detalle/{id}", Name:="GetDetallePedido")>
        Public Function GetDetallePedido(id As Integer) As IHttpActionResult

            Dim db As New SGContext
            Try
                Dim listDetallePedido As List(Of DetallePedido) = Nothing
                Dim listDetallePedidoDto As New List(Of Models.DetallePedidoDTO)

                listDetallePedido = db.DetallePedidos.Where(Function(p) p.Pedido.ID = id).ToList()

                If listDetallePedido Is Nothing OrElse listDetallePedido.Count = 0 Then Return Me.Ok(New List(Of Models.DetallePedidoDTO))

                For Each detallepedido As DetallePedido In listDetallePedido

                    listDetallePedidoDto.Add(New Models.DetallePedidoDTO With {.ID = detallepedido.ID,
                                                                .Cantidad = detallepedido.Cantidad,
                                                                .ProductoID = detallepedido.Producto.ID,
                                                                .Nombre = detallepedido.Producto.Nombre,
                                                                .Precio = detallepedido.Producto.Precio
                                      })
                Next
                Return Me.Ok(listDetallePedidoDto)
            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpPost>
        <Route("detalleModificar", Name:="PostDetallePedido")>
        Public Function PostDetallePedido(<FromBody> model As Models.ListDetallePedido) As IHttpActionResult

            Dim detalle As DetallePedido = Nothing
            If model Is Nothing Then Return Me.Content(HttpStatusCode.BadRequest, "Error al obtener información.")

            Dim db As New SGContext
            Try

                For Each detallePedido As Models.DetallePedidoDTO In model.ListDetallePedidoDTO
                    If detallePedido.ID <> 0 Then
                        Dim detallePedidoExist As DetallePedido = db.DetallePedidos.Where(Function(p) p.ID = detallePedido.ID).SingleOrDefault()
                        With detallePedidoExist
                            .Cantidad = detallePedido.Cantidad
                        End With
                        db.SaveChanges()
                    End If

                    If detallePedido.ID = 0 Then
                        detalle = db.DetallePedidos.Create()
                        With detalle
                            .Cantidad = detallePedido.Cantidad
                            .Producto = db.Productos.Where(Function(p) p.ID = detallePedido.ProductoID).SingleOrDefault()
                            .Pedido = db.Pedidos.Where(Function(p) p.ID = model.ID).SingleOrDefault()
                        End With
                        db.DetallePedidos.Add(detalle)
                        db.SaveChanges()
                        detallePedido.Pedido = New Models.PedidoDTO With {.ID = detalle.Pedido.ID}
                        detallePedido.Producto = New Models.ProductoDTO With {.ID = detalle.Producto.ID, .Nombre = detalle.Producto.Nombre, .Precio = detalle.Producto.Precio}
                    End If
                Next
                Return Me.Ok(model)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try

        End Function

    End Class
End Namespace
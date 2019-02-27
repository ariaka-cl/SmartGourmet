Imports System.Net
Imports System.Web.Http
Imports ARIAKA.SmartGourmet.DATA.Model

Namespace Controllers.API
    <RoutePrefix("api/productos")>
    Public Class ProductosAPIController
        Inherits ApiController

        <HttpGet>
        <Route("{id}", Name:="GetProductos")>
        Public Function GetProductos(id As Integer) As IHttpActionResult

            Dim db As New SGContext
            Try
                Dim listProductos As List(Of ProductoResultSet) = Nothing
                Dim listProductoDto As New List(Of Models.ProductoDTO)

                If id < 0 Then
                    listProductos = db.GetProdSinFoto()
                Else
                    listProductos = db.GetProdSinFoto.Where(Function(p) p.Tipo_ID = id).ToList()
                End If

                If listProductos Is Nothing OrElse listProductos.Count = 0 Then Return Me.Ok(New List(Of Models.ProductoDTO))

                Dim listCategorias As List(Of Categoria) = db.Categorias.ToList()

                For Each producto As ProductoResultSet In listProductos
                    Dim cate As Categoria = listCategorias.Where(Function(c) c.ID = producto.Tipo_ID).SingleOrDefault
                    listProductoDto.Add(New Models.ProductoDTO With {.ID = producto.ID,
                                                                .Nombre = producto.Nombre,
                                                                .Precio = producto.Precio,
                                                                .Descuento = producto.Descuento,
                                                                .StockActual = producto.StockActual,
                                                                .FechaCreacion = producto.FechaCreacion,
                                                                .Tipo = New Models.CategoriasDTO With {.ID = cate.ID,
                                                                                                    .Nombre = cate.NombreCategoria
                                        }})
                Next
                Return Me.Ok(listProductoDto)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpPost>
        <Route("", Name:="PostProductos")>
        Public Function PostProductos(<FromBody> model As Models.ProductoDTO) As IHttpActionResult

            If model Is Nothing Then Return Me.Content(HttpStatusCode.BadRequest, "Error al obtener información.")

            Dim db As New SGContext
            Try
                If model.ID <> 0 Then
                    Dim productExist As Producto = db.Productos.Where(Function(t) t.ID = model.ID).SingleOrDefault()
                    With productExist
                        .Nombre = model.Nombre
                        .Tipo = db.Categorias.Where(Function(c) c.ID = model.TipoID).SingleOrDefault()
                        .Precio = model.Precio
                        .Descuento = model.Descuento
                        .StockActual = model.StockActual
                        If model.Foto IsNot Nothing Then
                            .Foto = model.Foto
                        End If
                        'System.Text.Encoding.UTF8.GetBytes(model.Nombre)
                    End With
                    db.SaveChanges()
                    model.Tipo = New Models.CategoriasDTO With {.ID = productExist.Tipo.ID, .Nombre = productExist.Tipo.NombreCategoria}
                    Return Me.Ok(model)
                End If

                If db.Productos.Where(Function(t) t.Nombre = model.Nombre).Any Then
                    Return Me.Content(HttpStatusCode.BadRequest, "Este producto ya existe.")
                End If

                Dim producto As New Producto With {.Nombre = model.Nombre,
                                                .Tipo = db.Categorias.Where(Function(c) c.ID = model.TipoID).SingleOrDefault(),
                                                .Precio = model.Precio,
                                                .Descuento = model.Descuento,
                                                .StockActual = model.StockActual,
                                                .FechaCreacion = Date.Now,
                                                .Foto = model.Foto
                }
                db.Productos.Add(producto)
                db.SaveChanges()
                model.ID = producto.ID
                model.Tipo = New Models.CategoriasDTO With {.ID = producto.Tipo.ID, .Nombre = producto.Tipo.NombreCategoria}
                Return Me.Ok(model)

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try

        End Function

        <HttpDelete>
        <Route("{id}", Name:="DeleteProducto")>
        Public Function DeleteProducto(id As Integer) As IHttpActionResult

            If id = 0 Then
                Return Me.Content(HttpStatusCode.NotFound, "No se puede eliminar el producto debido a posibles dependencias asociadas.")
            End If

            Dim db As New SGContext
            Try
                Dim producto As Producto = db.Productos.Where(Function(p) p.ID = id).SingleOrDefault

                If db.DetallePedidos.Where(Function(d) d.Pedido.ID = producto.ID).Any() Then
                    Return Me.Content(HttpStatusCode.BadRequest, String.Format("El producto {0} no puede eliminarse debido a que tiene pedidos asociados.", producto.Nombre))
                End If

                db.Productos.Remove(producto)
                db.SaveChanges()
                Return Me.Content(HttpStatusCode.OK, String.Format("El producto {0} fue eliminado.", producto.Nombre))

            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try

        End Function

        <HttpGet>
        <Route("fotos/{id}", Name:="GetFoto")>
        Public Function GetFoto(id As Integer) As IHttpActionResult

            Dim db As New SGContext
            Try
                Dim fotob64 As String
                fotob64 = db.Productos.Where(Function(c) c.ID = id).Select(Function(f) f.Foto).SingleOrDefault()
                Return Me.Ok(fotob64)
            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function
    End Class
End Namespace
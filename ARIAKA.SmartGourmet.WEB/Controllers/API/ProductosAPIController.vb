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
                Dim listProductos As List(Of Producto) = New List(Of Producto)
                Dim listProductoDto As New List(Of Models.ProductoDTO)
                'Dim cate As Categoria = New Categoria

                If id < 0 Then
                    listProductos = db.Productos.ToList()
                Else
                    'cate = db.Categorias.Where(Function(c) c.ID = id).SingleOrDefault
                    listProductos = db.Productos.Where(Function(p) p.Tipo.ID = id).ToList()
                End If

                If listProductos Is Nothing OrElse listProductos.Count = 0 Then Return Me.Ok(New List(Of Models.ProductoDTO))

                For Each producto As Producto In listProductos
                    listProductoDto.Add(New Models.ProductoDTO With {.ID = producto.ID,
                                                                .Nombre = producto.Nombre,
                                                                .Precio = producto.Precio,
                                                                .Descuento = producto.Descuento,
                                                                .StockActual = producto.StockActual,
                                                                .FechaCreacion = producto.FechaCreacion,
                                                                .Foto = producto.Foto,
                                                                .Tipo = New Models.CategoriasDTO With {.ID = producto.Tipo.ID,
                                                                                                    .Nombre = producto.Tipo.NombreCategoria
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
                        .Foto = model.Foto
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
    End Class
End Namespace
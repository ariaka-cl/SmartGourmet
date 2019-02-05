Imports System.Net
Imports System.Web.Http
Imports ARIAKA.SmartGourmet.DATA
Imports ARIAKA.SmartGourmet.DATA.Model

Namespace Controllers.API
    <RoutePrefix("api/categorias")>     'se asigna la ruta al controlador
    Public Class CategoriasAPIController
        Inherits ApiController

        <HttpGet>
        <Route("", Name:="GetCategorias")>      'json invoca el get para entrar a la funcion GetCategorias
        Public Function GetCategorias() As IHttpActionResult
            Dim db As New SGContext
            Try
                'Busca la información
                Dim listCategoria As List(Of Categoria) = db.Categorias.ToList()
                If listCategoria Is Nothing OrElse listCategoria.Count = 0 Then Return Me.Ok(New List(Of Models.CategoriasDTO))

                Dim listCateDto As New List(Of Models.CategoriasDTO)
                For Each cate As Categoria In listCategoria
                    listCateDto.Add(New Models.CategoriasDTO With {
                                    .ID = cate.ID,
                                    .Nombre = cate.NombreCategoria,
                                    .FechaCreacion = cate.FechaCreacion
                    })
                Next
                Return Me.Ok(listCateDto)
            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpPost>
        <Route("", Name:="SaveCategorias")>
        Public Function SaveCategorias(<FromBody> model As Models.CategoriasDTO) As IHttpActionResult
            If model Is Nothing Then
                Return Me.Content(HttpStatusCode.BadRequest, "Sin Datos en el formulario")
            End If

            Dim db As New SGContext
            Try
                If model.ID <> 0 Then   'si ese id es distinto de 0 existe en la bd esa categoria
                    Dim cateExist As Categoria = db.Categorias.Where(Function(u) u.ID = model.ID).SingleOrDefault()
                    With cateExist
                        .NombreCategoria = model.Nombre
                        .FechaCreacion = model.FechaCreacion
                    End With
                    db.SaveChanges()    'guarda lo que se ha modifiado
                    Return Me.Ok(model) ' se retorna lo que se ha ingresado en public function
                End If

                Dim cate As New Categoria With {.NombreCategoria = model.Nombre, .FechaCreacion = Date.Now.Date}
                db.Categorias.Add(cate) 'se agrega 
                db.SaveChanges()        'se guarda
                model.ID = cate.ID
                Return Me.Ok(model)
            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function

        <HttpDelete>
        <Route("{id}", Name:="DeleteCategorias")>
        Public Function DeleteCategorias(id As Integer) As IHttpActionResult
            If id = 0 Then  'si no encuentra algun id
                Return Me.Content(HttpStatusCode.NotFound, "Categoria No Encontrada")
            End If

            Dim db As New SGContext
            Try
                Dim cate As Categoria = db.Categorias.Where(Function(u) u.ID = id).SingleOrDefault()
                db.Categorias.Remove(cate)
                db.SaveChanges()
                Return Me.Content(HttpStatusCode.OK, String.Format("Categoria Eliminada {0}", id))
            Catch ex As Exception
                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
            Finally
                db.Dispose()
            End Try
        End Function


    End Class
End Namespace
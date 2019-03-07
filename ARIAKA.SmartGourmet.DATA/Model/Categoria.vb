Namespace Model
    Public Class Categoria
        Public Property ID As Integer
        Public Property NombreCategoria As String
        Public Property FechaCreacion As Date

        Public Overridable Property Productos As IList(Of Producto)
    End Class
End Namespace

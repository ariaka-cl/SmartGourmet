Namespace Model
    Public Class Producto
        Public Property ID As Integer
        Public Property Nombre As String
        Public Overridable Property Tipo As Categoria
        Public Property Precio As Integer
        Public Property Descuento As Integer
        Public Property StockActual As Integer
        Public Property FechaCreacion As Date
        Public Property Foto As Byte()
    End Class
End Namespace

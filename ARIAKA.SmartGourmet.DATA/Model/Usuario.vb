Namespace Model
    Public Class Usuario
        Public Property ID As Integer
        Public Property Run As String
        Public Property Nombre As String
        Public Property Apellido As String
        Public Property Password As String
        Public Property Rol As Rol

        Public Overridable Property Ventas As IList(Of Venta)
    End Class
End Namespace

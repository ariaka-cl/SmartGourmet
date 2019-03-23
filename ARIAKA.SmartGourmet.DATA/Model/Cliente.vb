Namespace Model
    Public Class Cliente
        Public Property ID As Integer
        Public Property Nombre As String
        Public Property Apellido As String
        Public Property Direccion As String
        Public Property Telefono As Integer

        Public Overridable Property Pedidos As IList(Of Pedido)
    End Class
End Namespace


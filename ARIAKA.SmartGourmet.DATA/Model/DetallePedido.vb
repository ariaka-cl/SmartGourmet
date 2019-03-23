Namespace Model
    Public Class DetallePedido
        Public Property ID As Integer
        Public Property Cantidad As Integer
        Public Overridable Property Pedido As Pedido
        Public Overridable Property Producto As Producto
    End Class
End Namespace



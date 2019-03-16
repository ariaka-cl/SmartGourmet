Namespace Models
    Public Class DetallePedidoDTO
        Public Property ID As Integer
        Public Property Cantidad As Integer
        Public Overridable Property Pedido As PedidoDTO
        Public Overridable Property PedidoID As Integer
        Public Overridable Property Producto As ProductoDTO
        Public Overridable Property ProductoID As Integer
        Public Overridable Property Nombre As String
        Public Overridable Property Precio As Integer
    End Class

    Public Class ListDetallePedido
        Public Property ID As Integer
        Public Property ListDetallePedidoDTO As List(Of DetallePedidoDTO)
    End Class

End Namespace

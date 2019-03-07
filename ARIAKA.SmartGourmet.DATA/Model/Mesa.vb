Namespace Model
    Public Class Mesa
        Public Property ID As Integer
        Public Property NumMesa As String
        Public Property Capacidad As Integer
        Public Property Estado As TipoEstado

        Public Overridable Property Pedidos As IList(Of Pedido)
    End Class
End Namespace

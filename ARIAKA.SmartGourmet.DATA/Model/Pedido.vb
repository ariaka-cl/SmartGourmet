Namespace Model
    Public Class Pedido
        Public Property ID As Integer
        Public Property Fecha As Date
        Public Overridable Property Vendedor As Usuario
        Public Overridable Property Comprador As Cliente
        Public Property NombreComprador As String
        Public Overridable Property Mesa As Mesa
        Public Property NroPersonas As Integer
        Public Property EstadoPedido As EstadoPedido
        Public Property Observaciones As String
        Public Property EsDomicilio As Boolean

        Public Overridable Property DetallePedidos As IList(Of DetallePedido)
    End Class
End Namespace


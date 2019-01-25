Namespace Model
    Public Class Pedido
        Public Property ID As Integer
        Public Property Fecha As Date
        Public Property Vendedor As Usuario
        Public Property Comprador As Cliente
        Public Property Mesa As Mesa
        Public Property NroPersonas As Integer
        Public Property EstadoPedido As EstadoPedido
        Public Property Observaciones As String
        Public Property EsDomicilio As Boolean
    End Class
End Namespace


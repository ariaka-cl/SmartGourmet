Namespace Model
    Public Class Venta
        Public Property ID As Integer
        Public Property Vendedor As Usuario
        Public Property Pedido As Pedido
        Public Property TipoPago As TipoPago
        Public Property Total As Integer
        Public Property Propina As Integer
        Public Property TotalDescuento As Integer
        Public Property Observaciones As String
        Public Property Fecha As Date
        Public Property Caja As Caja
    End Class
End Namespace

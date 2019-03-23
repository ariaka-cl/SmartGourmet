Namespace Model
    Public Class Venta
        Public Property ID As Integer
        Public Overridable Property Vendedor As Usuario
        Public Overridable Property Pedido As Pedido
        Public Property TipoPago As TipoPago
        Public Property Total As Integer
        Public Property Propina As Integer
        Public Property TotalDescuento As Integer
        Public Property Observaciones As String
        Public Property Fecha As Date
        Public Overridable Property Caja As Caja
    End Class
End Namespace

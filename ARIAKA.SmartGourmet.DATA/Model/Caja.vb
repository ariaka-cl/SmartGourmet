Namespace Model
    Public Class Caja
        Public Property ID As Integer
        Public Property SaldoInicial As Integer
        Public Property FechaInicio As Date
        Public Property FechaCierre As Date
        Public Property EstadoCaja As Boolean
        Public Property Turno As Turno

        Public Overridable Property Ventas As IList(Of Venta)
    End Class
End Namespace

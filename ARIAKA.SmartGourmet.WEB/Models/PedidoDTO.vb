﻿Namespace Models
    Public Class PedidoDTO
        Public Property ID As Integer
        Public Property Fecha As Date
        Public Property Vendedor As UsuarioDTO
        Public Property VendedorID As Integer
        Public Property Comprador As ClienteDTO
        Public Property NombreComprador As String
        Public Property Mesa As MesaDTO
        Public Property NroPersonas As Integer
        Public Property EstadoPedido As Integer
        Public Property EstadoPedidoStr As String
        Public Property Observaciones As String
        Public Property EsDomicilio As Boolean
    End Class
End Namespace

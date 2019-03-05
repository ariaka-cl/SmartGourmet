Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class FuncionProd
        Inherits DbMigration
    
        Public Overrides Sub Up()
            AddColumn("dbo.Pedido", "NombreComprador", Function(c) c.String())
            AddColumn("dbo.Producto", "Funcion", Function(c) c.Int(nullable := False))
            DropColumn("dbo.DetallePedido", "Funcion")
        End Sub
        
        Public Overrides Sub Down()
            AddColumn("dbo.DetallePedido", "Funcion", Function(c) c.Int(nullable := False))
            DropColumn("dbo.Producto", "Funcion")
            DropColumn("dbo.Pedido", "NombreComprador")
        End Sub
    End Class
End Namespace

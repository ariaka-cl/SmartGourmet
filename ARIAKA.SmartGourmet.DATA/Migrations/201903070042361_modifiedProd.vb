Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class modifiedProd
        Inherits DbMigration
    
        Public Overrides Sub Up()
            AddColumn("dbo.Pedido", "NombreComprador", Function(c) c.String())
            AddColumn("dbo.Producto", "Funcion", Function(c) c.Int(nullable := False))
            AddColumn("dbo.Producto", "StockActual", Function(c) c.Int(nullable := False))
            AlterColumn("dbo.Producto", "Foto", Function(c) c.String())
            DropColumn("dbo.DetallePedido", "Funcion")
            DropColumn("dbo.Producto", "StockAcutal")
        End Sub
        
        Public Overrides Sub Down()
            AddColumn("dbo.Producto", "StockAcutal", Function(c) c.Int(nullable := False))
            AddColumn("dbo.DetallePedido", "Funcion", Function(c) c.Int(nullable := False))
            AlterColumn("dbo.Producto", "Foto", Function(c) c.Binary())
            DropColumn("dbo.Producto", "StockActual")
            DropColumn("dbo.Producto", "Funcion")
            DropColumn("dbo.Pedido", "NombreComprador")
        End Sub
    End Class
End Namespace

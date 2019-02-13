Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class modified_producto
        Inherits DbMigration
    
        Public Overrides Sub Up()
            AddColumn("dbo.Producto", "StockActual", Function(c) c.Int(nullable := False))
            DropColumn("dbo.Producto", "StockAcutal")
        End Sub
        
        Public Overrides Sub Down()
            AddColumn("dbo.Producto", "StockAcutal", Function(c) c.Int(nullable := False))
            DropColumn("dbo.Producto", "StockActual")
        End Sub
    End Class
End Namespace

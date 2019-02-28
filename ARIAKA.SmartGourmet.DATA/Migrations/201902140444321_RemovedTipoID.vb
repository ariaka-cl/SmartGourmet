Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class RemovedTipoID
        Inherits DbMigration
    
        Public Overrides Sub Up()
            DropIndex("dbo.Producto", New String() { "TipoID" })
            RenameColumn(table := "dbo.Producto", name := "TipoID", newName := "Tipo_ID")
            AlterColumn("dbo.Producto", "Tipo_ID", Function(c) c.Int())
            CreateIndex("dbo.Producto", "Tipo_ID")
        End Sub
        
        Public Overrides Sub Down()
            DropIndex("dbo.Producto", New String() { "Tipo_ID" })
            AlterColumn("dbo.Producto", "Tipo_ID", Function(c) c.Int(nullable := False))
            RenameColumn(table := "dbo.Producto", name := "Tipo_ID", newName := "TipoID")
            CreateIndex("dbo.Producto", "TipoID")
        End Sub
    End Class
End Namespace

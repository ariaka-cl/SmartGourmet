Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class nombre_migracion
        Inherits DbMigration
    
        Public Overrides Sub Up()
            DropIndex("dbo.Producto", New String() { "Tipo_ID" })
            RenameColumn(table := "dbo.Producto", name := "Tipo_ID", newName := "TipoID")
            AlterColumn("dbo.Producto", "TipoID", Function(c) c.Int(nullable := False))
            CreateIndex("dbo.Producto", "TipoID")
        End Sub
        
        Public Overrides Sub Down()
            DropIndex("dbo.Producto", New String() { "TipoID" })
            AlterColumn("dbo.Producto", "TipoID", Function(c) c.Int())
            RenameColumn(table := "dbo.Producto", name := "TipoID", newName := "Tipo_ID")
            CreateIndex("dbo.Producto", "Tipo_ID")
        End Sub
    End Class
End Namespace

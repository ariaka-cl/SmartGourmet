Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class ProdFotoByteToString
        Inherits DbMigration
    
        Public Overrides Sub Up()
            AlterColumn("dbo.Producto", "Foto", Function(c) c.String())
        End Sub
        
        Public Overrides Sub Down()
            AlterColumn("dbo.Producto", "Foto", Function(c) c.Binary())
        End Sub
    End Class
End Namespace

Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class add_clases
        Inherits DbMigration
    
        Public Overrides Sub Up()
            CreateTable(
                "dbo.Categoria",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .NombreCategoria = c.String(),
                        .FechaCreacion = c.DateTime(nullable := False)
                    }) _
                .PrimaryKey(Function(t) t.ID)
            
            CreateTable(
                "dbo.DetallePedido",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .Cantidad = c.Int(nullable := False),
                        .Funcion = c.Int(nullable := False),
                        .Pedido_ID = c.Int(),
                        .Producto_ID = c.Int()
                    }) _
                .PrimaryKey(Function(t) t.ID) _
                .ForeignKey("dbo.Pedido", Function(t) t.Pedido_ID) _
                .ForeignKey("dbo.Producto", Function(t) t.Producto_ID) _
                .Index(Function(t) t.Pedido_ID) _
                .Index(Function(t) t.Producto_ID)
            
            CreateTable(
                "dbo.Producto",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .Nombre = c.String(),
                        .Precio = c.Int(nullable := False),
                        .Descuento = c.Int(nullable := False),
                        .StockAcutal = c.Int(nullable := False),
                        .FechaCreacion = c.DateTime(nullable := False),
                        .Foto = c.Binary(),
                        .Tipo_ID = c.Int()
                    }) _
                .PrimaryKey(Function(t) t.ID) _
                .ForeignKey("dbo.Categoria", Function(t) t.Tipo_ID) _
                .Index(Function(t) t.Tipo_ID)
            
        End Sub
        
        Public Overrides Sub Down()
            DropForeignKey("dbo.DetallePedido", "Producto_ID", "dbo.Producto")
            DropForeignKey("dbo.Producto", "Tipo_ID", "dbo.Categoria")
            DropForeignKey("dbo.DetallePedido", "Pedido_ID", "dbo.Pedido")
            DropIndex("dbo.Producto", New String() { "Tipo_ID" })
            DropIndex("dbo.DetallePedido", New String() { "Producto_ID" })
            DropIndex("dbo.DetallePedido", New String() { "Pedido_ID" })
            DropTable("dbo.Producto")
            DropTable("dbo.DetallePedido")
            DropTable("dbo.Categoria")
        End Sub
    End Class
End Namespace

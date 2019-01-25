Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class add_clases_2
        Inherits DbMigration
    
        Public Overrides Sub Up()
            CreateTable(
                "dbo.Caja",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .SaldoInicial = c.Int(nullable := False),
                        .FechaInicio = c.DateTime(nullable := False),
                        .FechaCierre = c.DateTime(nullable := False),
                        .EstadoCaja = c.Boolean(nullable := False),
                        .Turno = c.Int(nullable := False)
                    }) _
                .PrimaryKey(Function(t) t.ID)
            
            CreateTable(
                "dbo.Perdidas",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .Cantidad = c.Int(nullable := False),
                        .Detalle = c.String(),
                        .Observacion = c.Int(nullable := False),
                        .Producto_ID = c.Int()
                    }) _
                .PrimaryKey(Function(t) t.ID) _
                .ForeignKey("dbo.Producto", Function(t) t.Producto_ID) _
                .Index(Function(t) t.Producto_ID)
            
            CreateTable(
                "dbo.StockInicial",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .Stock = c.Int(nullable := False),
                        .FechaActualizacion = c.DateTime(nullable := False),
                        .Producto_ID = c.Int()
                    }) _
                .PrimaryKey(Function(t) t.ID) _
                .ForeignKey("dbo.Producto", Function(t) t.Producto_ID) _
                .Index(Function(t) t.Producto_ID)
            
            CreateTable(
                "dbo.Venta",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .TipoPago = c.Int(nullable := False),
                        .Total = c.Int(nullable := False),
                        .Propina = c.Int(nullable := False),
                        .TotalDescuento = c.Int(nullable := False),
                        .Observaciones = c.String(),
                        .Fecha = c.DateTime(nullable := False),
                        .Caja_ID = c.Int(),
                        .Pedido_ID = c.Int(),
                        .Vendedor_ID = c.Int()
                    }) _
                .PrimaryKey(Function(t) t.ID) _
                .ForeignKey("dbo.Caja", Function(t) t.Caja_ID) _
                .ForeignKey("dbo.Pedido", Function(t) t.Pedido_ID) _
                .ForeignKey("dbo.Usuario", Function(t) t.Vendedor_ID) _
                .Index(Function(t) t.Caja_ID) _
                .Index(Function(t) t.Pedido_ID) _
                .Index(Function(t) t.Vendedor_ID)
            
        End Sub
        
        Public Overrides Sub Down()
            DropForeignKey("dbo.Venta", "Vendedor_ID", "dbo.Usuario")
            DropForeignKey("dbo.Venta", "Pedido_ID", "dbo.Pedido")
            DropForeignKey("dbo.Venta", "Caja_ID", "dbo.Caja")
            DropForeignKey("dbo.StockInicial", "Producto_ID", "dbo.Producto")
            DropForeignKey("dbo.Perdidas", "Producto_ID", "dbo.Producto")
            DropIndex("dbo.Venta", New String() { "Vendedor_ID" })
            DropIndex("dbo.Venta", New String() { "Pedido_ID" })
            DropIndex("dbo.Venta", New String() { "Caja_ID" })
            DropIndex("dbo.StockInicial", New String() { "Producto_ID" })
            DropIndex("dbo.Perdidas", New String() { "Producto_ID" })
            DropTable("dbo.Venta")
            DropTable("dbo.StockInicial")
            DropTable("dbo.Perdidas")
            DropTable("dbo.Caja")
        End Sub
    End Class
End Namespace

Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class InitialCreate
        Inherits DbMigration
    
        Public Overrides Sub Up()
            CreateTable(
                "dbo.Cliente",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .Nombre = c.String(),
                        .Apellido = c.String(),
                        .Direccion = c.String(),
                        .Telefono = c.Int(nullable := False)
                    }) _
                .PrimaryKey(Function(t) t.ID)
            
            CreateTable(
                "dbo.Mesa",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .NumMesa = c.String(),
                        .Capacidad = c.Int(nullable := False),
                        .Estado = c.Int(nullable := False)
                    }) _
                .PrimaryKey(Function(t) t.ID)
            
            CreateTable(
                "dbo.Pedido",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .Fecha = c.DateTime(nullable := False),
                        .NroPersonas = c.Int(nullable := False),
                        .EstadoPedido = c.Int(nullable := False),
                        .Observaciones = c.String(),
                        .EsDomicilio = c.Boolean(nullable := False),
                        .Comprador_ID = c.Int(),
                        .Mesa_ID = c.Int(),
                        .Vendedor_ID = c.Int()
                    }) _
                .PrimaryKey(Function(t) t.ID) _
                .ForeignKey("dbo.Cliente", Function(t) t.Comprador_ID) _
                .ForeignKey("dbo.Mesa", Function(t) t.Mesa_ID) _
                .ForeignKey("dbo.Usuario", Function(t) t.Vendedor_ID) _
                .Index(Function(t) t.Comprador_ID) _
                .Index(Function(t) t.Mesa_ID) _
                .Index(Function(t) t.Vendedor_ID)
            
            CreateTable(
                "dbo.Usuario",
                Function(c) New With
                    {
                        .ID = c.Int(nullable := False, identity := True),
                        .Run = c.String(),
                        .Nombre = c.String(),
                        .Apellido = c.String(),
                        .Password = c.String(),
                        .Rol = c.Int(nullable := False)
                    }) _
                .PrimaryKey(Function(t) t.ID)
            
        End Sub
        
        Public Overrides Sub Down()
            DropForeignKey("dbo.Pedido", "Vendedor_ID", "dbo.Usuario")
            DropForeignKey("dbo.Pedido", "Mesa_ID", "dbo.Mesa")
            DropForeignKey("dbo.Pedido", "Comprador_ID", "dbo.Cliente")
            DropIndex("dbo.Pedido", New String() { "Vendedor_ID" })
            DropIndex("dbo.Pedido", New String() { "Mesa_ID" })
            DropIndex("dbo.Pedido", New String() { "Comprador_ID" })
            DropTable("dbo.Usuario")
            DropTable("dbo.Pedido")
            DropTable("dbo.Mesa")
            DropTable("dbo.Cliente")
        End Sub
    End Class
End Namespace

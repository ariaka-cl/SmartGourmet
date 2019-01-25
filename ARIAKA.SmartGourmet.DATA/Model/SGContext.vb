Imports System
Imports System.Data.Entity
Imports System.Data.Entity.ModelConfiguration.Conventions
Imports System.Linq
Imports ARIAKA.SmartGourmet.DATA.Model

Public Class SGContext
    Inherits DbContext


    Public Sub New()
        MyBase.New("name=SGContext")
    End Sub

    Public Overridable Property Clientes As DbSet(Of Cliente)
    Public Overridable Property Mesas As DbSet(Of Mesa)
    Public Overridable Property Pedidos As DbSet(Of Pedido)
    Public Overridable Property Usuarios As DbSet(Of Usuario)
    Public Overridable Property DetallePedidos As DbSet(Of DetallePedido)
    Public Overridable Property Categorias As DbSet(Of Categoria)
    Public Overridable Property Productos As DbSet(Of Producto)
    Public Overridable Property Cajas As DbSet(Of Caja)
    Public Overridable Property Ventas As DbSet(Of Venta)
    Public Overridable Property Perdidas As DbSet(Of Perdidas)
    Public Overridable Property StockInicial As DbSet(Of StockInicial)

    Protected Overrides Sub OnModelCreating(modelBuilder As DbModelBuilder)
        MyBase.OnModelCreating(modelBuilder)
        modelBuilder.Conventions.Remove(Of PluralizingTableNameConvention)()
        modelBuilder.Conventions.Remove(Of OneToManyCascadeDeleteConvention)()
        modelBuilder.Conventions.Remove(Of ManyToManyCascadeDeleteConvention)()
    End Sub

End Class

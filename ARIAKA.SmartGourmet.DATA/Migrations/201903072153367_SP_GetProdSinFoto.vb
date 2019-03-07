Imports System
Imports System.Data.Entity.Migrations
Imports Microsoft.VisualBasic

Namespace Migrations
    Public Partial Class SP_GetProdSinFoto
        Inherits DbMigration

        Public Overrides Sub Up()
            Dim sp As String =
            "Create PROCEDURE [spGetProdSinFoto]
            AS
            BEGIN
	            select ID, Nombre, Precio, Descuento, StockActual, FechaCreacion, Tipo_ID
	            from dbo.Producto   
            End"
            Me.Sql(sp)
        End Sub

        Public Overrides Sub Down()
            DropStoredProcedure("spGetProdSinFoto")
        End Sub
    End Class
End Namespace

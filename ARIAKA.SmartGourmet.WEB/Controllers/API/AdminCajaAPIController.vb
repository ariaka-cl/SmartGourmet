Imports System.Data.Entity
Imports System.Net
Imports System.Threading.Tasks
Imports System.Web.Http
Imports ARIAKA.SmartGourmet.DATA.Model

Namespace Controllers.API
    <RoutePrefix("api/admincaja")>
    Public Class AdminCajaAPIController
        Inherits ApiController

#Region "Abrir Caja"
        <HttpGet>
        <Route("abrir-caja", Name:="AbrirCaja")>
        Public Async Function AbrirCaja() As Threading.Tasks.Task(Of IHttpActionResult)
            Dim db As New SGContext
            Try
                Dim caja As Caja = Nothing

                Dim cajas As List(Of Caja) = Await db.Cajas.OrderByDescending(Function(c) c.ID).ToListAsync
                If cajas Is Nothing OrElse cajas.Count = 0 Then
                    Dim turno As Integer = 0
                    If Date.Now.Hour > 6 AndAlso Date.Now.Hour < 15 Then
                        turno = 1
                    Else
                        turno = 2
                    End If
                    caja = New Caja With {.EstadoCaja = True,
                                              .FechaInicio = Date.Now.Date,
                                              .SaldoInicial = 0,
                                              .Turno = turno
                                             }
                    db.Cajas.Add(caja)

                    Await db.SaveChangesAsync()
                ElseIf Not db.Cajas.OrderByDescending(Function(c) c.ID).Any(Function(c) c.FechaCierre = Nothing) Then
                    Dim turno As Integer = 0
                        If Date.Now.Hour > 6 AndAlso Date.Now.Hour < 15 Then
                            turno = 1
                        Else
                            turno = 2
                        End If

                    caja = New Caja With {.EstadoCaja = True,
                                              .FechaInicio = Date.Now.Date,
                                              .SaldoInicial = 0,
                                              .Turno = turno
                                             }
                    db.Cajas.Add(caja)
                        Await db.SaveChangesAsync()
                    Else
                        Return Me.Content(HttpStatusCode.BadRequest, "Existe una caja abierta")
                End If
                Return Me.Ok(New With {.ID = caja.ID, .FechaInicio = caja.FechaInicio, .Turno = If(caja.Turno = 1, "Mañana", "Tarde")})
            Catch ex As Exception
                Return Content(HttpStatusCode.BadRequest, String.Format("Problemas para abrir caja. Error: {0}", ex.Message))
            Finally
                db.Dispose()
            End Try
        End Function
#End Region

        '#Region "Cerrar Caja"
        '        <HttpGet>
        '        <Route("cerrar-caja/{id}", Name:="CerrarCaja")>
        '        Public Async Function CerrarCaja(id As Integer) As Task(Of IHttpActionResult)
        '            Dim db As New SGContext
        '            Try
        '                Dim caja As Caja = Nothing
        '                If id = 1 Then
        '                    caja = db.Cajas.Where(Function(c) DbFunctions.TruncateTime(c.FechaInicio) = DbFunctions.TruncateTime(Date.Now) AndAlso c.Turno = 1).FirstOrDefault()
        '                    If caja IsNot Nothing AndAlso caja.FechaCierre = Nothing Then
        '                        caja.FechaCierre = Date.Now
        '                    End If
        '                ElseIf id = 2 Then
        '                    caja = db.Cajas.Where(Function(c) DbFunctions.TruncateTime(c.FechaInicio) = DbFunctions.TruncateTime(Date.Now) AndAlso c.Turno = 2).FirstOrDefault()
        '                    If caja IsNot Nothing AndAlso caja.FechaCierre = Nothing Then
        '                        caja.FechaCierre = Date.Now
        '                    End If
        '                End If
        '                Await db.SaveChangesAsync()
        '                If caja Is Nothing Then
        '                    Return Content(HttpStatusCode.BadRequest, String.Format("Problemas para cerrar caja. Error: No Existe Caja Abierta para Turno a Cerrar"))
        '                End If
        '                Dim cajaDto As New Models.AdminCajaDTO With {.EstadoCaja = caja.EstadoCaja,
        '                                                             .FechaInicio = caja.FechaInicio,
        '                                                             .FechaCierre = caja.FechaCierre,
        '                                                             .ID = caja.ID,
        '                                                             .Turno = caja.Turno,
        '                                                             .SaldoInicial = caja.SaldoInicial}
        '                Return Me.Ok(cajaDto)
        '            Catch ex As Exception
        '                Return Content(HttpStatusCode.BadRequest, String.Format("Problemas para cerrar caja. Error: {0}", ex.Message))
        '            Finally
        '                db.Dispose()
        '            End Try
        '        End Function
        '#End Region

#Region "get cajas"
        <HttpGet>
        <Route("", Name:="GetCajas")>
        Public Async Function GetCajas() As Task(Of IHttpActionResult)
            Dim db As New SGContext
            Try
                Dim cajas As List(Of Caja) = Await db.Cajas.OrderByDescending(Function(c) c.ID).ToListAsync
                If cajas Is Nothing OrElse cajas.Count = 0 Then Return Me.Ok(New List(Of Models.AdminCajaDTO))

                Dim listAdminCajaDto As New List(Of Models.AdminCajaDTO)
                For Each caja As Caja In cajas
                    listAdminCajaDto.Add(New Models.AdminCajaDTO With {
                                    .ID = caja.ID,
                                    .FechaInicio = caja.FechaInicio,
                                    .Turno = caja.Turno,
                                    .SaldoInicial = caja.SaldoInicial
                     })
                Next
                Return Me.Ok(listAdminCajaDto)
            Catch ex As Exception
                Return Content(HttpStatusCode.BadRequest, String.Format("problemas para obtener caja. error: {0}", ex.Message))
            Finally
                db.Dispose()
            End Try
        End Function
#End Region

        '#Region "Abrir Caja"
        '        <HttpGet>
        '        <Route("abrir-caja", Name:="AbrirCaja")>
        '        Public Async Function AbrirCaja() As Task(Of IHttpActionResult)
        '            Dim db As New SGContext
        '            Try
        '                Dim caja As Caja = Nothing

        '                If Not db.Cajas.OrderByDescending(Function(c) c.ID).Any(Function(c) c.FechaCierre = Nothing) Then
        '                    Dim turno As Integer = 0
        '                    If Date.Now.Hour > 6 AndAlso Date.Now.Hour < 15 Then
        '                        turno = 1
        '                    Else
        '                        turno = 2
        '                    End If

        '                    caja = New Caja With {.EstadoCaja = True,
        '                                              .FechaInicio = Date.Now,
        '                                              .SaldoInicial = 0,
        '                                              .Turno = turno
        '                                             }
        '                    db.Cajas.Add(caja)
        '                    Await db.SaveChangesAsync()
        '                Else
        '                    Return Me.Content(HttpStatusCode.BadRequest, "Existe una caja abierta")
        '                End If
        '                Return Me.Ok(New With {.ID = caja.ID, .Fecha = caja.FechaInicio, .Turno = If(caja.Turno = 1, "Mañana", "Tarde")})
        '            Catch ex As Exception
        '                Return Content(HttpStatusCode.BadRequest, String.Format("Problemas para abrir caja. Error: {0}", ex.Message))
        '            Finally
        '                db.Dispose()
        '            End Try
        '        End Function
        '#End Region

        '<HttpPost>
        '<Route("", Name:="AddCajas")>
        'Public Function AddCajas(<FromBody> model As Models.AdminCajaDTO) As IHttpActionResult
        '    If model Is Nothing Then
        '        Return Me.Content(HttpStatusCode.BadRequest, "Sin Datos")
        '    End If

        '    Dim turno As Integer = 0
        '    If Date.Now.Hour > 6 AndAlso Date.Now.Hour < 15 Then
        '        turno = 1
        '    Else
        '        turno = 2
        '    End If

        '    Dim db As New SGContext
        '    Try
        '        If model.ID <> 0 Then
        '            Dim cajasExist As Caja = db.Cajas.Where(Function(u) u.ID = model.ID).SingleOrDefault()
        '            With cajasExist
        '                .EstadoCaja = True
        '                .FechaInicio = Date.Now
        '                .Turno = turno
        '                .SaldoInicial = 0
        '            End With
        '            db.SaveChanges()
        '            Return Me.Ok(model)
        '        End If

        '        Dim cajas As New Caja With {.ID = model.ID, .EstadoCaja = model.EstadoCaja, .FechaInicio = model.FechaInicio, .Turno = If(model.Turno = 1, "Mañana", "Tarde"), .SaldoInicial = model.SaldoInicial}
        '        db.Cajas.Add(cajas)
        '        db.SaveChanges()
        '        model.ID = cajas.ID
        '        Return Me.Ok(model)
        '    Catch ex As Exception
        '        Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
        '    Finally
        '        db.Dispose()
        '    End Try
        'End Function


        '#Region "Resumen Caja"
        '        <HttpGet>
        '        <Route("resumen-caja", Name:="GetResumenCaja")>
        '        Public Function GetResumenCaja() As IHttpActionResult
        '            Dim db As New SGContext
        '            Try
        '                Dim caja As Caja = db.Cajas.Where(Function(c) c.EstadoCaja = True).OrderByDescending(Function(c) c.FechaInicio).FirstOrDefault()
        '                If caja Is Nothing Then
        '                    Return Me.Content(HttpStatusCode.BadRequest, String.Format("Problemas para registrar esta operación. Error: La caja no se ha abierto o no se ha seleccionado"))
        '                End If
        '                Dim listVentas As List(Of Venta) = db.Ventas.Where(Function(v) v.Caja = caja.ID).ToList()
        '                Dim pagados As Integer = listVentas.Where(Function(v) v.DetallePedido.Estado = EstadoPedido.Retirado).ToList().Count
        '                Dim nulasTurno As Integer = listVentas.Where(Function(v) v.DetallePedido.Estado = EstadoPedido.Anulado).Count()
        '                Return Me.Ok(New With {.Pagados = pagados, .NulasTurno = nulasTurno})
        '            Catch ex As Exception
        '                Return Me.Content(HttpStatusCode.BadRequest, ex.Message)
        '            Finally
        '                db.Dispose()
        '            End Try
        '        End Function
        '#End Region

    End Class
End Namespace
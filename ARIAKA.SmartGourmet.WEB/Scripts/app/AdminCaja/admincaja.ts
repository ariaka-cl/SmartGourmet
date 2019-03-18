/// <reference path="../../typings/devextreme/devextreme.d.ts"/>
/// <reference path="../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../typings/knockout/knockout.d.ts"/>

namespace AdminCaja {
    'use strict'
    export class AdminCajaIndexViewModel {

        public admincaja: KnockoutObservableArray<any> = ko.observableArray<any>();  
        public idRow: KnockoutObservable<number> = ko.observable(0);
        public fecha: KnockoutObservable<any> = ko.observable<any>(null);
        public turno: KnockoutObservable<any> = ko.observable<any>(null);
        public enable: KnockoutObservable<boolean> = ko.observable(true);
        public idRowIndex: KnockoutObservable<number> = ko.observable(-1);
        public HistorialPagos: KnockoutObservableArray<any> = ko.observableArray<any>();
        public folioCaja: KnockoutObservable<string> = ko.observable<string>();
        public saldo: KnockoutObservable<any> = ko.observable<any>(null);

        public limpiar(): void {
            var historialPagos = $('#historialPagos').dxDataGrid('instance');
            historialPagos.option('dataSource', []);
         }

        /*
        getHistorialPagos(id: number): JQueryPromise<any> {
            this.HistorialPagos([]);
            return $.ajax({
                type: 'GET',
                url: App.apiRoot + '/historial-pagos/' + id,
                success: (data: any): void => {
                    for (var i: number = 0; i < data.length; i++) {
                        let row = {
                            Responsable: data[i].responsable,
                            Monto: data[i].monto,
                            FechaRegistro: moment.utc(data[i].fechaRegistro).format("YYYY-MM-DD HH:mm:ss"),
                            TipoPago: data[i].tipoPagoStr
                        }
                        this.HistorialPagos.push(row);
                    }
                }
            });

        */
        getCaja(): void {
            this.admincaja([]);
            $.ajax({
                type: 'GET',
                url:'api/admincaja',
                success: (data: any): void => {
                    for (var i: number = 0; i < data.length; i++) {
                        this.admincaja.push({
                            ID: data[i].ID,
                            Turno: data[i].Turno,
                            FechaInicio: data[i].FechaInicio,
                            SaldoInicial: data[i].SaldoInicial
                        });
                    }
                }
            });
        }

        addCaja(): void {
           // let formData: any = $('#text-nombre').dxTextBox('option').value;

            $.ajax({
                type: 'POST',
                url: 'api/admincaja',
                data: {
                    ID: this.idRow,
                    Turno: this.turno,
                    FechaInicio: this.fecha,
                    SaldoInicial: this.saldo
                },
                success: (data: any): void => {
                    DevExpress.ui.notify("Datos Guardados Satisfactoriamente", "success", 2000);
                    //$('#text-nombre').dxTextBox('instance').repaint();
                }
            })
            //    .done((result) => {
            //    this.getCaja();
            //    let grid = $('#grid-caja').dxDataGrid('instance');
            //    grid.refresh();
            //    grid.repaint();
            //    //this.idRow(0);
            //    //this.turno("");
            //    //this.fecha()
            //});
        }

        constructor() {
            this.getCaja();
        }

        dataGridOptions: any = {
            dataSource: this.admincaja,
            loadPanel: {
                enabled: true,
                text: 'Cargando datos...'
            },
            selection: {
                mode: "single"
            },
            columns: [{ dataField: 'ID', visible: true }, { dataField: 'Turno', visible: true }, { dataField: 'SaldoInicial', visible: true },
            {
                dataField: 'FechaInicio',
                dataType: 'date',
                format: 'dd/MM/YY HH:mm'
            }],
            onRowClick: (e) => {
                this.enable(false);
                let cajaData: any = {
                    ID: e.data.ID,
                    Turno: e.data.Turno,
                    FechaInicio: e.data.FechaInicio,
                    SaldoInicial: e.data.SandoInicial
                }
                this.idRow(cajaData.ID);
                this.idRowIndex(e.rowIndex);
                this.turno(cajaData.Turno);
                this.fecha(cajaData.FechaInicio)
            }
        }

        public historialPagos: DevExpress.ui.dxDataGridOptions = {
            dataSource: this.HistorialPagos,
            paging: {
                pageSize: 20
            },
            selection: {
                mode: "single"
            },
            noDataText: 'No pagos o abonos',
            columns: [{ dataField: 'Responsable' },
            <DevExpress.ui.dxDateBoxOptions>{
                dataField: 'FechaRegistro',
                dataType: 'date',
                format: 'dd/MM/YY HH:mm'
            },
            { dataField: 'Monto' },
            {
                dataField: 'TipoPago',
                caption: 'Tipo Pago'
            }]
        }

        botonAbrirTurno: any = {
            text: "Iniciar Turno",
            icon: "glyphicon glyphicon-play-circle",
            type: 'success',
            onClick: () => {
                this.addCaja();
            }
        }

        /*
        public AbrirCaja(): void {
            $.getJSON(App.apiRoot + '/caja/abrir-caja/', (result) => { }).done((data: any) => {
                let idCaja: string = this.formatFolio(data.id.toString());
                let fechaInicioCaja: any = moment.utc(data.fecha).format("MMM-DD HH:mm");
                this.folioCaja(idCaja);
                this.fechaInicio(fechaInicio);
                this.turno(data.turno);
                this.loading(false);
            });
        }
        */
        /*
        public getCaja(): void {
            $.getJSON(App.apiRoot + '/caja', (result) => { }).done((data: any) => {
                let idCaja: string = this.formatFolio(data.id.toString());
                let fechaInicioCaja: any = moment.utc(data.fecha).format("MMM-DD HH:mm");
                this.folioCaja(idCaja);
                this.fechaInicio(fechaInicio);
                this.turno(data.turno);
                this.loading(false);
            });
        }
        */
    }
}
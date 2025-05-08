export class KardexModel {
    id: string = '';
    fecha: Date = new Date();
    tipoPago: string='';
    factura: string='';
    estado: boolean = false;
    tipoMov: string = '';
    persona: string = '';
    personaDet: string = '';
    archivesId: string = '';
    details: {
      id: number;
      producto: string;
      prodId: number;
      cantidad: number;
      precioVenta: number;
      saldo: number;
      total: number;
    }[] = [
      {
        id: 0,
        prodId: 0,
        producto: '',
        cantidad: 0,
        precioVenta: 0.0,
        saldo:0,
        total: 0.0
      }
    ];
  }
  
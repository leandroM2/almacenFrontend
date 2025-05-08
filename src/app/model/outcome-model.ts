export class outcomeModel {
    id: number=0;
    fecha: Date = new Date();
    tipoPago: string='';
    factura: string='';
    estado: boolean=false;

    clientDetailid: number=0;
    cliDetId: number=0;
    cliDetFactory: string='';
    cliDetAddress: string='';
    cliDetNumber: string='';

    clientId: number=0;
    clientRazonSocial: string='';
    clientRuc: number=0;
    clientCorreo: string='';
    clientContacto: number=0;
    clientDireccion: string='';
    userId: number=0;
    userNombre: string='';
    userAuthId: number=0;
	userAuthNombre: string='';
    userConfirmId: number=0;
    userConfirmName: string='';
}

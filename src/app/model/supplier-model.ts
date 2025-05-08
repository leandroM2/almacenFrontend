export class SupplierBModel{
    id: number=0;
    razSocial: string='';
    ruc: number=0;
    contactNumber: number=0;
    details:{
        id: number;
        supDetId: number;
        supDetFactory: string;
        supDetAddress: string;
        supDetNumber: string;
        supDetState: number;
        supplierId: number;
    }[] = [
        {
           id: 0,
           supDetId: 0,
           supDetFactory: '',
           supDetAddress: '',
           supDetNumber: '',
           supDetState: 0.0,
           supplierId: 0
        }
    ];
    expanded: boolean = false; // Default value
}
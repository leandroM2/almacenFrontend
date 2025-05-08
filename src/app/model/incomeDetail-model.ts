export class incomeDetailModel {

    id: number=0;
    cantidad: number=0;
    precioVentaUnit: number=0.0;
    oldPrecioVenta: number=0.0;
    saldo: number=0;
    incomeId: number=0;
    incomeFecha: Date = new Date();
    incomeEstado: boolean=false;
    incomeUserId: number=0;
    incomeUserNombre: string='';
    incomeUserAuthId: number=0;
    incomeUserAuthNombre: string='';
    productId: number=0;
    productNombre: string='';
    productColor: string='';
    productPrecio: number=0.0;
    productStock: number=0;
    productEstado: boolean=false;
    productCategoryId: number=0;
    productCategoryNombre: string='';
    productSupplierId: number=0;
    productSupplierRazonSocial: string='';
    productSupplierRuc: number=0;
    productSupplierContacto: number=0;
}


import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../model/productos_model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductosService } from 'src/app/services/productos.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CategoryModel } from 'src/app/model/category-model';
import { CategoryService } from 'src/app/services/category.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { SupplierModel } from 'src/app/model/proveedores_model';

import { TypeModel } from 'src/app/model/type-model';
import { TypeService } from 'src/app/services/type.service';
import { LocationModel } from 'src/app/model/location-model';
import { LocationService } from 'src/app/services/location.service';


import { GlobalConstants } from 'src/app/shared/global-constants';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.sass']
})
export class ProductosComponent implements OnInit {
   //instanciamos el modelo
   listproducts: ProductModel [] = [];
   //declarmos otra lista para filtrar
   filteredCategories: any[] = [];
   filterTerm: string = '';
   listcategorias: CategoryModel[] = [];
   listProveedores: SupplierModel[] = [];

   listtypes: TypeModel[] = [];
   listlocations: LocationModel[] = [];

   responseMessage: any;
   //creamos un formGroup
   formProduct: FormGroup = new FormGroup({});
   //instanciamos el servicio
   constructor(private productService: ProductosService,
    private categoriasService: CategoryService,
    private proveedoresService: ProveedoresService,

    private TypeService: TypeService,
    private LocationService: LocationService,

    private mensajesService: MensajesService,
    ) {
   }
   
 
   isUpdate: boolean = false;
 
   ngOnInit(): void {
     this.list(); 
     this.listacategorias();
     this.listaproveedores();
     
     this.listatypes();
     this.listalocations();

     //definir las propiedades del formgroup
     this.formProduct = new FormGroup({
      prodId: new FormControl(''),
       prodDesc: new FormControl(''),
       prodCode: new FormControl(''),
       prodPrice: new FormControl(''),
       prodStock: new FormControl(''),
       prodState: new FormControl(''),
       catId: new FormControl(''),
       catName: new FormControl(''),

       supplierDetailId: new FormControl(''),
       supDetId: new FormControl(''),
       supDetFactory: new FormControl(''),
       supDetAddress: new FormControl(''),
       supDetNumber: new FormControl(''),

       supplierId: new FormControl(''),
       supplierRazonSocial: new FormControl(''),
       supplierRuc: new FormControl(''),
       supplierContacto: new FormControl(''),
       typeId: new FormControl(''),
       typeName: new FormControl(''),
       locationId: new FormControl(''),
       locationFloor: new FormControl(''),
     })
   }
 
   //funcion para listar
   list(){
     this.productService.getProducts().subscribe(resp=>{
       if(resp){
         this.listproducts = resp;
       }
     });
     const filterInput = document.getElementById('filter') as HTMLInputElement;
       if (filterInput) {
      filterInput.value = '';
    }
   }

   filterCategories(): void {
    const term = this.filterTerm.toLowerCase();
    this.listproducts = this.listproducts.filter(product => 
      product.prodDesc.toLowerCase().includes(term)
    );
  }

   save(){
     this.productService.saveProduct(this.formProduct.value).subscribe((resp:any)=>{
       if(resp){
         this.responseMessage = resp.mensaje;
         this.mensajesService.AbrirMensaje(this.responseMessage,"check");
         this.list();
         this.formProduct.reset();
         this.prodStockcero();
       }
      },
      (error:any) => {
        this.responseMessage = error.error.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "error");
     });
   }
 
   update(){
     this.productService.updateProduct(this.formProduct.value).subscribe((resp:any)=>{
       if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check"); 
         this.list();
         this.newProduct();
       }
     },
     (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
    });
  }
 
   delete(id: any){
    const eliminar = confirm("¿Desea actualizar el estado de este producto?");
    if (eliminar){
     this.productService.deleteProduct(id).subscribe((resp:any)=>{
       if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.list();
       }
     },
     (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
    });
  }
  }
 
 
   newProduct(){
     this.isUpdate = false;
     this.formProduct.reset();
     const cat = document.getElementById("cat") as HTMLSelectElement
     const prov = document.getElementById("prov") as HTMLSelectElement

     const type = document.getElementById("type") as HTMLSelectElement
     const location = document.getElementById("location") as HTMLSelectElement



     cat.selectedIndex = 0;
     prov.selectedIndex = 0;

     type.selectedIndex=0;
     location.selectedIndex=0;
   }
   
   selectItem(item: any) {
     this.isUpdate = true;
     this.formProduct.controls['prodId'].setValue(item.prodId);
     this.formProduct.controls['prodDesc'].setValue(item.prodDesc);
     this.formProduct.controls['prodCode'].setValue(item.prodCode);
     this.formProduct.controls['prodPrice'].setValue(item.prodPrice);
     this.formProduct.controls['prodStock'].setValue(item.prodStock);
     this.formProduct.controls['prodState'].setValue(item.prodState);
     this.formProduct.controls['catId'].setValue(item.catId);
     this.formProduct.controls['catName'].setValue(item.catName);

     this.formProduct.controls['supplierDetailId'].setValue(item.supplierDetailId);
     this.formProduct.controls['supDetId'].setValue(item.supDetId);
     this.formProduct.controls['supDetFactory'].setValue(item.supDetFactory);
     this.formProduct.controls['supDetAddress'].setValue(item.supDetAddress);
     this.formProduct.controls['supDetNumber'].setValue(item.supDetNumber);

     this.formProduct.controls['supplierId'].setValue(item.supplierId);
     this.formProduct.controls['supplierRazonSocial'].setValue(item.supplierRazonSocial);
     this.formProduct.controls['supplierRuc'].setValue(item.supplierRuc);
     this.formProduct.controls['supplierContacto'].setValue(item.supplierContacto);
     this.formProduct.controls['typeId'].setValue(item.typeId);
     this.formProduct.controls['typeName'].setValue(item.typeName);
     this.formProduct.controls['locationId'].setValue(item.locationId);
     this.formProduct.controls['locationFloor'].setValue(item.locationFloor);
     console.log('Product catId:', item.catId);
     console.log('Product supplierId:', item.supplierId);
     console.log('Listcategorias:', this.listcategorias);
     var final = document.getElementById('final') as HTMLInputElement;
     //var mas = document.getElementById('mas') as HTMLInputElement;

     final.value = item.prodStock;
     //mas.focus;
   }

   prodStockcero(){
    this.formProduct.controls['prodStock'].setValue(0);
   }

   suma(){

    
    var mas = document.getElementById('mas') as HTMLInputElement;

    var final = document.getElementById('final') as HTMLInputElement;

    //var prodStockfinal = document.getElementById('prodStockfinal') as HTMLInputElement;
    
    var masValue: number = parseInt(mas.value);

    var finalValue: number = parseInt(final.value);

    var prodStockfinal = finalValue+masValue;

    this.formProduct.controls['prodStock'].setValue(prodStockfinal);

   }

   generatePDF() {
    const DATA = document.getElementById('tableToPDF') as HTMLDivElement;
    const doc = new jsPDF('landscape', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    const filtro1 = document.getElementById('start') as HTMLInputElement;
    const filtro2 = document.getElementById('end') as HTMLInputElement;
    html2canvas(DATA, options).then((canvas: HTMLCanvasElement) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 50;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      doc.setFontSize(16);
      doc.text('Productos de SPA.', 20, 30);
      return doc;

    }).then((docResult: jsPDF) => {
      docResult.save(`${new Date().toISOString()}_DetallesSalida.pdf`);
    });
  }

  listacategorias(){
    this.categoriasService.getCategory().subscribe(resp=>{
      if(resp){
        this.listcategorias = resp;
      }
    });
  }

  listaproveedores(){
    this.proveedoresService.getSuppliers().subscribe(resp=>{
      if(resp){
        this.listProveedores = resp;
      }
    });
  } 

  listatypes(){
    this.TypeService.getType().subscribe(resp=>{
      if(resp){
        this.listtypes = resp;
      }
    });
  } 

  listalocations(){
    this.LocationService.getLocation().subscribe(resp=>{
      if(resp){
        this.listlocations = resp;
      }
    });
  } 
  
 }

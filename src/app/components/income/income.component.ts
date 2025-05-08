import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { incomeModel } from 'src/app/model/income-model';
import { incomeDetailModel } from 'src/app/model/incomeDetail-model';
import { ProductModel } from 'src/app/model/productos_model';
import { SupplierModel } from 'src/app/model/proveedores_model';
import { UserModel } from 'src/app/model/user-model';
import { IncomeDetailService } from 'src/app/services/income-detail.service';
import { IncomeService } from 'src/app/services/income.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ProductosService } from 'src/app/services/productos.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

  //instanciamos el modelo
  listIncome: incomeModel [] = [];
  listIncomeDetail: incomeDetailModel [] = [];
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  filterTerm: string = '';
  startDate: string=''; // Puedes definir startDate y endDate como string o Date según prefieras
  endDate: string='';
  fechaInicio: string=''; // Tipo adecuado según tus necesidades (puede ser string o Date)
  fechaFin: string='';
  fechaActual: string='';
  responseMessage: any;
  listProveedores: SupplierModel[] = [];
  listusuarios: UserModel[] = [];
  listproducts: ProductModel [] = [];
  listentrada: incomeModel [] = [];
  selectedProductId: any;
  //creamos un formGroup
  formIncome: FormGroup = new FormGroup({});
  formIncomeDetail: FormGroup = new FormGroup({});
  //instanciamos el servicio
  constructor(private incomeService: IncomeService,
    private usuariosService: UserService,
    private mensajesService: MensajesService,
    private incomeDetailService: IncomeDetailService,
    private productService: ProductosService,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder ) {
      this.formIncome = this.fb.group({
        fecha: ['']
      });
    }

  isUpdate: boolean = false;

  ngOnInit(): void {
    this.list();
    this.listausuarios();
    this.setFechasMaximas();
    this.establecerFechaActual();
    this.listaproductos();
    this.listaentrada();
    //definir las propiedades del formgroup
    this.formIncome = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl(''),
      tipoPago: new FormControl(''),
      userId: new FormControl(''),
      userAuthId: new FormControl(''),
    })
    this.formIncomeDetail = new FormGroup({
      id: new FormControl(''),
      precioVentaUnit: new FormControl(''),
      cantidad: new FormControl(''),
      incomeId: new FormControl(''),
      productId: new FormControl(''),
    })
  }

  //funcion para listar
  list(){
    this.incomeService.getIncome().subscribe(resp=>{
      if(resp){
        this.listIncome = resp;
      }
    });
    const start = document.getElementById('start') as HTMLInputElement;
    const end = document.getElementById('end') as HTMLInputElement;
    end.value='';
    start.value='';
  }
  setFechasMaximas(): void {
    const fechaInicioInput = document.getElementById('start') as HTMLInputElement;
    const fechaFinInput = document.getElementById('end') as HTMLInputElement;

    // Obtener la fecha actual
    const hoy = new Date();
    hoy.setHours(hoy.getHours() -5); 
    const hoyISO = hoy.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

    // Establecer la fecha máxima permitida en el input de tipo date para fechaInicio
    fechaInicioInput.max = hoyISO;

    // Establecer la fecha máxima permitida en el input de tipo date para fechaFin
    fechaFinInput.max = hoyISO;
  }

  establecerFechaActual(): void {
    let hoy = new Date();
    hoy.setHours(hoy.getHours() -5);
    this.formIncome.controls['fecha'].setValue(hoy.toISOString().split('T')[0]);
  }
  // let hora = hoy.toISOString().split('T')[1].split('.')[0];
    // let fecha = hoy.toISOString().split('T')[0]
    // this.formIncome.controls['fecha'].setValue(fecha+" "+hora);
    // console.log(fecha+" "+hora)

  filterCategories(): void {
    // Convertir las fechas de inicio y fin a objetos Date si están definidas
    let startTerm: Date;
    let endTerm: Date;
  
    if (this.startDate) {
        startTerm = new Date(this.startDate);
    }
    if (this.endDate) {
        endTerm = new Date(this.endDate);
        // Asegurarse de que endTerm sea a las 23:59:59 del día seleccionado
        endTerm.setHours(23, 59, 59, 999);
    }
  
    this.listIncome = this.listIncome.filter(income => {
        const incomeDate = new Date(income.fecha);
  
        // Verificar si el outcomeDate está dentro del rango especificado (inclusive)
        if (startTerm && endTerm) {
            // Comparar solo año, mes y día
            return (
                incomeDate >= startTerm &&
                incomeDate <= endTerm
            );
        } else if (startTerm) {
            // Comparar solo a partir de la fecha de inicio
            return (
                incomeDate >= startTerm
            );
        } else if (endTerm) {
            // Comparar solo hasta la fecha de fin
            return (
                incomeDate <= endTerm
            );
        }
        return true; // Si no se especificó rango, incluir todos los elementos
    });
    this.setFechasMaximas();
  }
  


  
  save() {
    this.incomeService.saveIncome(this.formIncome.value).subscribe((resp: any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "check");
        this.listaproductos();
        this.listaentrada();
        this.formIncome.reset();
      }
    },
      (error: any) => {
        this.responseMessage = error.error.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "error");
      }
    );
  }

  save2(){
    const cantidad = document.getElementById("cantidad") as HTMLInputElement;
      var cant = parseInt(cantidad.value);
      if(cant >= 200){
     this.incomeDetailService.saveIncomeDetail(this.formIncomeDetail.value).subscribe(resp=>{
       if(resp){
         this.list();
         this.formIncomeDetail.reset();
        //  this.getProductDetails2(this.selectedProductId);
         const stockact = document.getElementById("stockact") as HTMLInputElement
           stockact.value = "";
       }
     });
    }
    else {
      alert("La cantidad debe ser igual o mayor a 200")
    }
   }
  

  update(){
    this.incomeService.updateIncome(this.formIncome.value).subscribe((resp:any)=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.list();
        this.newIncome();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }

  delete(id: any){
    const eliminar = confirm("¿Estas seguro de eliminar esta entrada?");
    if (eliminar){
    this.incomeService.deleteIncome(id).subscribe((resp:any)=>{
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



  getSelectedValue() {
    const selectElement = document.getElementById('incomeSelect') as HTMLSelectElement;
    const selectedValue = selectElement.value;
    console.log(selectedValue);
    this.delete(selectedValue);
  }

  auth(id: any){
    const autorizar = confirm("¿Estas seguro de autorizar esta entrada?");
    if (autorizar){
    this.incomeService.AuthIncome(id).subscribe((resp:any)=>{
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


  newIncome(){
    this.isUpdate = false;
    this.formIncome.reset();
  }

  newOutcome(){
    this.isUpdate = false;
    this.formIncomeDetail.reset();
  }

  selectItem(item: any) {
    this.isUpdate = true;
    this.formIncome.controls['id'].setValue(item.id);
    this.formIncome.controls['fecha'].setValue(item.fecha);
    this.formIncome.controls['tipopPago'].setValue(item.tipoPago);
    this.formIncome.controls['userId'].setValue(item.userId);
    this.formIncome.controls['userAuthId'].setValue(item.userAuthId);
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
      if(filtro1.value == '' && filtro2.value== ''){
        doc.text('Gestión de Detalle de Salidas Total', 20, 30);
      }
      else {
      doc.text('Gestión de Detalle de Salidas de '+filtro1.value+' a '+filtro2.value, 20, 30);
      console.log(filtro1.value)
      console.log(filtro2.value)
      }
      return doc;

    }).then((docResult: jsPDF) => {
      docResult.save(`${new Date().toISOString()}_GestiondeEntradas.pdf`);
    });
  }

  // listaproveedores(){
  //   this.proveedoresService.getSuppliers().subscribe(resp=>{
  //     if(resp){
  //       this.listProveedores = resp;
  //     }
  //   });
  // }

  listausuarios(){
    this.usuariosService.getUser().subscribe(resp=>{
      if(resp){
        this.listusuarios = resp;
      }
    });
  }

  listaproductos(){
    this.productService.getProducts().subscribe(resp=>{
      if(resp){
        this.listproducts = resp;
      }
    });
  }
  listaentrada() {
    this.incomeService.getIncome().subscribe(resp => {
      if (resp) {
        this.listentrada = [resp
          .filter(item => item.estado === false)  // Filtrar solo los elementos con estado true
          .sort((a, b) => b.id - a.id)[0]];          // Ordenar por id de mayor a menor
      }
    });
  }

  getProductDetails(id: any){
    this.productService.getByid(id).subscribe((response:any)=>{
      this.selectedProductId = id;
      //this.products = response[0]
      //this.price = response[0].stock;
      //this.formOutcomeDetail.controls['cantidad'].setValue(response[0].stock);
      const stockact = document.getElementById("stockact") as HTMLInputElement
      stockact.value = response[0].stock
  
    }
  )
  }

  addDataBsTarget(): void {
    // const button = this.el.nativeElement.querySelector('#modal2');
    // if (button) {
    //   this.renderer.setAttribute(button, 'data-bs-target', '#exampleModal2');
    // }
    const button = document.getElementById("modal2");
    button?.setAttribute('data-bs-target','#exampleModal2');
  }
  
  

}

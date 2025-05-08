import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { incomeModel } from 'src/app/model/income-model';
import { incomeDetailModel } from 'src/app/model/incomeDetail-model';
import { ProductModel } from 'src/app/model/productos_model';
import { IncomeDetailService } from 'src/app/services/income-detail.service';
import { IncomeService } from 'src/app/services/income.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.scss']
})
export class IncomeDetailComponent implements OnInit {

  //instanciamos el modelo
  listIncomeDetail: incomeDetailModel[] = [];
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  filterTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  fechaActual: string = '';
  listproducts: ProductModel[] = [];
  selectedProductId: any;
  responseMessage: any;
  listentrada: incomeModel[] = [];
  //creamos un formGroup
  formIncomeDetail: FormGroup = new FormGroup({});
  //instanciamos el servicio
  constructor(private incomeDetailService: IncomeDetailService,
    private productService: ProductosService,
    private incomeService: IncomeService,
    private mensajesService: MensajesService,
    private fb: FormBuilder) {
    this.formIncomeDetail = this.fb.group({
      fecha: ['', Validators.required],
      id: ['', Validators.required],
      precioVentaUnit: ['', Validators.required],
      cantidad: ['', Validators.required],
      incomeId: ['', Validators.required],
      prodId: ['', Validators.required]
    });
  }

  isUpdate: boolean = false;

  ngOnInit(): void {
    this.setFechasMaximas();
    this.establecerFechaActual();
    this.list();
    this.listaproductos();
    this.listaentrada();
    //definir las propiedades del formgroup
    this.formIncomeDetail = new FormGroup({
      id: new FormControl(''),
      precioVentaUnit: new FormControl(''),
      cantidad: new FormControl(''),
      incomeId: new FormControl(''),
      prodId: new FormControl('')
      
      /*
      this.formIncomeDetail = new FormGroup({
        id: new FormControl(''),
        precioVentaUnit: new FormControl(''),
        cantidad: new FormControl(''),
        incomeId: new FormControl(''),
        prodId: new FormControl(''),
      */

      
    })
  }

  //funcion para listar
  list() {
    this.incomeDetailService.getIncomeDetail().subscribe(resp => {
      if (resp) {
        this.listIncomeDetail = resp.sort((a,b)=>b.id-a.id);
      }
    });
    const start = document.getElementById('start') as HTMLInputElement;
    const end = document.getElementById('end') as HTMLInputElement;
    end.value = '';
    start.value = '';

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
    this.formIncomeDetail.controls['fecha'].setValue(hoy.toISOString().split('T')[0]);
  }

  validarFechaActual(): void {
    const inputFecha = new Date(this.fechaActual);
    const hoy = new Date();

    if (inputFecha.getTime() !== hoy.getTime()) {
      // Si la fecha ingresada no es igual a la fecha actual, reseteamos el campo
      this.establecerFechaActual();
    }
  }

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

    this.listIncomeDetail = this.listIncomeDetail.filter(incomeDetail => {
      const incomeDate = new Date(incomeDetail.incomeFecha);

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
    const cantidad = document.getElementById("cantidad") as HTMLInputElement
    const prevent = document.getElementById("prevent") as HTMLInputElement
    if(parseInt(cantidad.value) > 0 && parseFloat(prevent.value) > 0){
    this.incomeDetailService.saveIncomeDetail(this.formIncomeDetail.value).subscribe((resp: any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "check");
        this.listaproductos();
        this.listaentrada();
        this.formIncomeDetail.reset();
        //  this.getProductDetails2(this.selectedProductId);
        const stockact = document.getElementById("stockact") as HTMLInputElement
        const preact = document.getElementById("preact") as HTMLInputElement
        const prevent = document.getElementById("prevent") as HTMLInputElement
        const preprom = document.getElementById("preprom") as HTMLInputElement
        stockact.value = "";
        preact.value = "";
        prevent.value = "";
        preprom.value = "";
      }
    },
    (error: any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
    }
  );
}
else {
  alert("Error en la cantidad o precio, deben ser mayores a 0")
}

}

  update() {
    this.incomeDetailService.updateIncomeDetail(this.formIncomeDetail.value).subscribe((resp: any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "check");
        this.list();
        this.newIncomeDetail();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }


  delete(id: any) {
    const eliminar = confirm("¿Estas seguro de eliminar este detalle?");
    if (eliminar){
    this.incomeDetailService.deleteIncomeDetail(id).subscribe((resp:any) => {
      if (resp) {
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


 newIncomeDetail() {
  this.isUpdate = false;
  this.formIncomeDetail.reset();
}

  selectItem(item: any) {
    this.isUpdate = true;
    this.formIncomeDetail.controls['id'].setValue(item.id);
    console.log('PRUEBA:', item);
    this.formIncomeDetail.controls['cantidad'].setValue(item.cantidad);
    this.formIncomeDetail.controls['oldPrecioVenta'].setValue(item.oldPrecioVenta);
    this.formIncomeDetail.controls['precioVentaUnit'].setValue(item.precioVentaUnit);
    this.formIncomeDetail.controls['incomeId'].setValue(item.incomeId);
    this.formIncomeDetail.controls['prodId'].setValue(item.productId);

    this.formIncomeDetail.setValue({
      id: item.id
    });

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
      if (filtro1.value == '' && filtro2.value == '') {
        doc.text('Gestión de Detalle de Salidas Total', 20, 30);
      }
      else {
        doc.text('Gestión de Detalle de Salidas de ' + filtro1.value + ' a ' + filtro2.value, 20, 30);
        console.log(filtro1.value)
        console.log(filtro2.value)
      }
      return doc;

    }).then((docResult: jsPDF) => {
      docResult.save(`${new Date().toISOString()}_DetallesEntrada.pdf`);
    });
  }

  listaproductos() {
    this.productService.getProducts().subscribe(resp => {
      if (resp) {
        this.listproducts = resp;
      }
    });
  }
  listaentrada() {
    this.incomeService.getIncome().subscribe(resp => {
      if (resp) {
        this.listentrada = resp;
      }
    });
  }

  establecerCantidad() {

    const cantidad = document.getElementById("cantidad") as HTMLInputElement;

    this.formIncomeDetail.controls['cantidad'].setValue("200");

  }

  getProductDetails(id: any) {
    this.productService.getByid(id).subscribe((response: any) => {
      this.selectedProductId = id;
      //this.products = response[0]
      //this.price = response[0].stock;
      //this.formOutcomeDetail.controls['cantidad'].setValue(response[0].stock);
      const stockact = document.getElementById("stockact") as HTMLInputElement
      const cantidad = document.getElementById("cantidad") as HTMLInputElement
      const preact = document.getElementById("preact") as HTMLInputElement
      const preprom = document.getElementById("preprom") as HTMLInputElement
      const prevent = document.getElementById("prevent") as HTMLInputElement
      stockact.value = response[0].stock
      preact.value = response[0].precio
      preprom.value = response[0].precio
      prevent.value = ""
      cantidad.value = ""

    }
    )
  }

  onPrecioChange(event: Event): void {
    // const input = event.target as HTMLInputElement;
    // const precio = parseFloat(input.value);
    // console.log('Nuevo precio:', precio);
    const preact = document.getElementById("preact") as HTMLInputElement
    const prevent = document.getElementById("prevent") as HTMLInputElement
    const preprom = document.getElementById("preprom") as HTMLInputElement

    preprom.value = (((parseFloat(preact.value) + parseFloat(prevent.value)) / 2).toFixed(2)).toString();

  }

  // getProductDetails2(id: any){
  //   this.productService.getByid(id).subscribe((response:any)=>{
  //     console.log("EL STOCK ACTUAL DE "+response[0].nombre+" ES: "+response[0].stock)
  //     alert("EL STOCK ACTUAL DE "+response[0].nombre+" ES: "+response[0].stock)
  //   }
  // )
  // }

}
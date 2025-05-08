import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { incomeModel } from 'src/app/model/income-model';
import { incomeDetail2Model } from 'src/app/model/incomeDetail2-model';
import { ProductModel } from 'src/app/model/productos_model';
import { IncomeDetail2Service } from 'src/app/services/income-detail2.service';
import { IncomeService } from 'src/app/services/income.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
    selector: 'app-income-detail2',
    templateUrl: './income-detail2.component.html',
    styleUrls: ['./income-detail2.component.scss']
})
export class IncomeDetail2Component implements OnInit{

      listIncomeDetail2: incomeDetail2Model[] = [];
      product: any;
      filteredCategories: any[] = [];
      filterTerm: string = '';
      startDate: string = '';
      endDate: string = '';
      fechaInicio: string = '';
      fechaFin: string = '';
      fechaActual: string = '';

      listproducts: ProductModel[] = [];
      responseMessage: any;
      listentrada: incomeModel[] = [];

      formIncomeDetail2: FormGroup = new FormGroup({});


      selectedProductId: any;

        constructor(private incomeDetail2Service: IncomeDetail2Service,
          private productService: ProductosService,
          private mensajeService: MensajesService,
          private incomeService: IncomeService,
          private fb: FormBuilder) {
          this.formIncomeDetail2 = this.fb.group({
            fecha: ['']
          });
        }

  isUpdate: boolean = false;

  ngOnInit(): void {
    this.setFechasMaximas();
    this.establecerFechaActual();
    this.list();
    this.listaproductos();
    this.listaentrada();
    this.formIncomeDetail2 = new FormGroup({
        id: new FormControl(''),
        cantidad: new FormControl(''),
        saldo: new FormControl(''),
        precioVentaUnit: new FormControl(''),
        precioVenta: new FormControl(''),
        oldPrecioVenta: new FormControl(''),
        incomeId: new FormControl(''),
        prodId: new FormControl(''),
      })

  }

  list() {
    this.incomeDetail2Service.getIncomeDetail().subscribe(resp => {
      if (resp) {
        this.listIncomeDetail2 = resp.sort((a,b)=>b.id-a.id);
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
    this.formIncomeDetail2.controls['fecha'].setValue(hoy.toISOString().split('T')[0]);
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
  
    this.listIncomeDetail2 = this.listIncomeDetail2.filter(incomeDetail2 => {
        const outcomeDate = new Date(incomeDetail2.incomeFecha);
  
        // Verificar si el outcomeDate está dentro del rango especificado (inclusive)
        if (startTerm && endTerm) {
            // Comparar solo año, mes y día
            return (
                outcomeDate >= startTerm &&
                outcomeDate <= endTerm
            );
        } else if (startTerm) {
            // Comparar solo a partir de la fecha de inicio
            return (
                outcomeDate >= startTerm
            );
        } else if (endTerm) {
            // Comparar solo hasta la fecha de fin
            return (
                outcomeDate <= endTerm
            );
        }
        return true; // Si no se especificó rango, incluir todos los elementos
    });
    this.setFechasMaximas();
  }

  save() {
    const cantidad = document.getElementById("cantidad") as HTMLInputElement
    const precioVenta = document.getElementById("precioVenta") as HTMLInputElement
    if(parseInt(cantidad.value) >0 && parseFloat(precioVenta.value)> 0){
    this.incomeDetail2Service.saveIncomeDetail(this.formIncomeDetail2.value).subscribe((resp: any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajeService.AbrirMensaje(this.responseMessage, "check");
        this.listaentrada();
        this.listaproductos();
        this.formIncomeDetail2.reset();
        const saldo = document.getElementById("saldo") as HTMLInputElement
        const oldPrecioVenta = document.getElementById("oldPrecioVenta") as HTMLInputElement
        const precioVenta = document.getElementById("precioVenta") as HTMLInputElement
        const precioVentaUnit = document.getElementById("precioVentaUnit") as HTMLInputElement
        saldo.value = "";
        oldPrecioVenta.value = "";
        precioVenta.value = "";
        precioVentaUnit.value = "";
      }
    },
    (error: any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajeService.AbrirMensaje(this.responseMessage, "error");

    }
  );
  }
  else {
  alert("Error en la cantidad, debe ser mayor a 0")
  }
  }

  update() {
    console.log("REVISION:", this.formIncomeDetail2.value)
    this.incomeDetail2Service.updateIncomeDetail(this.formIncomeDetail2.value).subscribe((resp: any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajeService.AbrirMensaje(this.responseMessage, "check");
        this.list();
        this.newIncomeDetail2();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajeService.AbrirMensaje(this.responseMessage, "error");
   });
 }

 delete(id: any){
  const eliminar = confirm("¿Estas seguro de eliminar este detalle?");
if(eliminar){
    this.incomeDetail2Service.deleteIncomeDetail(id).subscribe((resp:any)=>{
        if(resp){
            this.responseMessage=resp.mensaje;
            this.responseMessage=resp.mensaje;
            this.mensajeService.AbrirMensaje(this.responseMessage,"check");
            this.list();
        }
    },
(error:any)=>{
    this.responseMessage=error.error.mensaje;
    this.mensajeService.AbrirMensaje(this.responseMessage, "error");
});
}
}

 newIncomeDetail2(){
  this.isUpdate = false;
  this.formIncomeDetail2.reset();
}

selectItem(item: any){
  this.isUpdate=true;
  this.formIncomeDetail2.controls['id'].setValue(item.id);
  this.formIncomeDetail2.controls['precioVentaUnit'].setValue(item.precioVentaUnit);
  this.formIncomeDetail2.controls['prodId'].setValue(item.prodId);
  this.formIncomeDetail2.controls['saldo'].setValue(item.saldo);
  this.formIncomeDetail2.controls['incomeId'].setValue(item.incomeId);
  this.formIncomeDetail2.controls['cantidad'].setValue(item.cantidad);

  const calculatedPrecioVenta = (parseFloat(item.precioVentaUnit) * 2) - parseFloat(item.oldPrecioVenta);
  this.formIncomeDetail2.controls['precioVenta'].setValue(calculatedPrecioVenta.toFixed(2));
}

ProductDetails(id: any) {
  this.productService.getByid(id).subscribe((response: any) => {
      if (response && response.length > 0) {
          console.log("SOLO ID",response[0])

          this.formIncomeDetail2.patchValue({
              saldo: response[0].prodStock,
              oldPrecioVenta: response[0].prodPrice,
            });

      }
  }
  )
}

onPrecioChange(): void {
  const oldPrecioVenta = this.formIncomeDetail2.controls['oldPrecioVenta'].value;
  const precioVenta = this.formIncomeDetail2.controls['precioVenta'].value;

  if (oldPrecioVenta !== null && precioVenta !== null) {
    const newPrecioVenta = ((parseFloat(oldPrecioVenta) + parseFloat(precioVenta)) / 2).toFixed(2);
    
    this.formIncomeDetail2.patchValue({
      precioVentaUnit: newPrecioVenta
    });
  }
}


listaproductos(){
  this.productService.getProducts().subscribe(resp=>{
      if(resp){
          this.listproducts=resp;
      }
  });
}

listaentrada(){
  this.incomeService.getIncome().subscribe(resp=>{
    if(resp){
      this.listentrada = resp;
    }
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
    docResult.save(`${new Date().toISOString()}_DetallesSalida.pdf`);
  });
}

}
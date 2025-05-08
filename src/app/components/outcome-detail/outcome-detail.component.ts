import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { outcomeDetailModel } from 'src/app/model/outcomeDetail-model';
import { OutcomeDetailService } from 'src/app/services/outcome-detail.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ProductosService } from 'src/app/services/productos.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ProductModel } from 'src/app/model/productos_model';
import { clientModel } from 'src/app/model/client-model';
import { outcomeModel } from 'src/app/model/outcome-model';
import { OutcomeService } from 'src/app/services/outcome.service';

@Component({
  selector: 'app-outcome-detail',
  templateUrl: './outcome-detail.component.html',
  styleUrls: ['./outcome-detail.component.scss']
})
export class OutcomeDetailComponent implements OnInit {

  //instanciamos el modelo
  listOutcomeDetail: outcomeDetailModel [] = [];
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  selectedProductId: any;
  selectedProductId2: any;
  filterTerm: string='';
  startDate: string=''; // Puedes definir startDate y endDate como string o Date según prefieras
  endDate: string='';
  fechaInicio: string=''; // Tipo adecuado según tus necesidades (puede ser string o Date)
  fechaFin: string='';
  fechaActual: string='';
  price: any;
  responseMessage:any;
  listproducts: ProductModel [] = [];
  listsalida: outcomeModel [] = [];
  //creamos un formGroup
  formOutcomeDetail: FormGroup = new FormGroup({});
  //instanciamos el servicio
  constructor(private outcomeDetailService: OutcomeDetailService,
    private productService: ProductosService,
    private mensajesService: MensajesService,
    private outcomeService: OutcomeService,
    private fb: FormBuilder ) {
      this.formOutcomeDetail = this.fb.group({
        fecha: ['']
      });
    }

  isUpdate: boolean = false;

  ngOnInit(): void {
    this.setFechasMaximas();
    this.establecerFechaActual();
    this.list();
    this.listaproductos();
    this.listasalida();
    //definir las propiedades del formgroup
    this.formOutcomeDetail = new FormGroup({
      id: new FormControl(''),
      cantidad: new FormControl(''),
      outcomeId: new FormControl(''),
      prodId: new FormControl(''),
    })
  }

  //funcion para listar
  list(){
    this.outcomeDetailService.getOutcomeDetail().subscribe(resp=>{
      if(resp){
        this.listOutcomeDetail = resp;
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
    this.formOutcomeDetail.controls['fecha'].setValue(hoy.toISOString().split('T')[0]);
  }

  validarFechaActual(): void {
    const inputFecha = new Date(this.fechaActual);
    const hoy = new Date();

    if (inputFecha.getTime() !== hoy.getTime()) {
      // Si la fecha ingresada no es igual a la fecha actual, reseteamos el campo
      this.establecerFechaActual();
    }
  }


//   filterCategories(): void {

//     const term = new Date(this.filterTerm); // Convertir el filtro a objeto Date

//     this.listOutcome = this.listOutcome.filter(outcome => {
//         // Convertir outcome.fecha a objeto Date si es necesario
//         const outcomeDate = new Date(outcome.fecha);

//         // Comparar año, mes y día de outcomeDate con term
//         return (
//             outcomeDate.getFullYear() === term.getFullYear() &&
//             outcomeDate.getMonth() === term.getMonth() &&
//             outcomeDate.getDate() === term.getDate()
//         );
//     });
// }



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

  this.listOutcomeDetail = this.listOutcomeDetail.filter(outcomeDetail => {
      const outcomeDate = new Date(outcomeDetail.outcomeFecha);

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
  const cantidad = document.getElementById("cantidad2") as HTMLInputElement
  if(parseInt(cantidad.value) > 0){
  this.outcomeDetailService.saveOutcomeDetail(this.formOutcomeDetail.value).subscribe(resp => {
    if (resp) {
      this.responseMessage = resp.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "check");
      this.listasalida();
      this.listaproductos();
      this.formOutcomeDetail.reset();
      // this.getProductDetails2(this.selectedProductId);
      const stockact = document.getElementById("stockact") as HTMLInputElement
      stockact.value = "";
    }
  },
  (error: any) => {
    this.responseMessage = error.error.mensaje;
    this.mensajesService.AbrirMensaje(this.responseMessage, "error");
  }
);
}
else {
alert("Error en la cantidad, debe ser mayor a 0")
}
}

  update() {
    this.outcomeDetailService.updateOutcomeDetail(this.formOutcomeDetail.value).subscribe((resp: any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "check");
        this.list();
        this.newOutcomeDetail();
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
  this.outcomeDetailService.deleteOutcomeDetail(id).subscribe((resp:any) => {
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


  newOutcomeDetail(){
    this.isUpdate = false;
    this.formOutcomeDetail.reset();
  }

  selectItem(item: any) {
    //console.log('PRUEBA:', item);
    this.isUpdate = true;
    this.formOutcomeDetail.controls['id'].setValue(item.id);
    this.formOutcomeDetail.controls['cantidad'].setValue(item.cantidad);
    this.formOutcomeDetail.controls['outcomeId'].setValue(item.outcomeId);
    this.formOutcomeDetail.controls['prodId'].setValue(item.productId);
    console.log('intento', item);
  }

  // generatePDF() {
  //   const data = document.getElementById('tableToPDF') as HTMLDivElement;
  //   const filtro1 = document.getElementById('start') as HTMLInputElement;
  //   const filtro2 = document.getElementById('end') as HTMLInputElement;
  //   html2canvas(data).then(canvas => {
  //     const imgWidth = 295;
  //     const pageHeight = 208;
  //     const imgHeight = canvas.height * imgWidth / canvas.width;
  //     const heightLeft = imgHeight;

  //     const contentDataURL = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF('landscape', 'mm', 'a4'); // mode, unit, format
  //     const position = 15;
  //     pdf.setFontSize(16);
  //     if(filtro1.value == '' && filtro2.value== ''){
  //       pdf.text('Gestión de Detalle de Salidas Total', 10, 10);
  //     }
  //     else {
  //     pdf.text('Gestión de Detalle de Salidas de '+filtro1.value+' a '+filtro2.value, 10, 10);
  //     console.log(filtro1.value)
  //     console.log(filtro2.value)
  //     }

  //     pdf.addImage(contentDataURL, 'PNG', 1, position, imgWidth, imgHeight);
  //     console.log(contentDataURL)
  //     //pdf.addImage('src/assets/img/food1.jpg', 'JPG', 1, 40, imgWidth, imgHeight);

  //     pdf.save(`${new Date().toISOString()}_DetallesdeSalida.pdf`);
  //     pdf.table
  //   });
  // }

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
  
  ProductDetails(id: any) {
    this.productService.getByid(id).subscribe((response: any) => {
      this.selectedProductId2 = id;
      //this.products = response[0]
      //this.price = response[0].stock;
      //this.formOutcomeDetail.controls['cantidad'].setValue(response[0].stock);
      const stockact = document.getElementById("stockact2") as HTMLInputElement
      const preact = document.getElementById("preact2") as HTMLInputElement
      const cantidad = document.getElementById("cantidad2") as HTMLInputElement
      stockact.value = response[0].stock
      preact.value = response[0].precio
      cantidad.value = ""
    }
    )
  }
// getProductDetails2(id: any){
//   this.productService.getByid(id).subscribe((response:any)=>{
//     console.log("EL STOCK ACTUAL DE "+response[0].nombre+" ES: "+response[0].stock)
//     alert("EL STOCK ACTUAL DE "+response[0].nombre+" ES: "+response[0].stock)
//   }
// )
// }

// selectedValue() {
//   // Get the select element by its id
//   const selectElement = document.getElementById('productSelect') as HTMLSelectElement;
  
//   // Check if the select element is found and then get the selected value
//   if (selectElement) {
//       const selectedValue = selectElement.value;
//       console.log('Selected value:', selectedValue);
//       // You can use the selectedValue for further processing
//   } else {
//       console.error('Select element not found');
//   }
// }
// Example usage: Call the function to get the selected value
    // ,(error:any)=>{
    //   console.log(error);
    //   if(error.error?.message){
    //     this.responseMessage = error.error?.message
    //   }else{
    //     this.responseMessage = GlobalConstants.genericError;
    //   }
    //   this.snackBarService.AbrirMensaje(this.responseMessage, GlobalConstants.error)
    // }


  
  listaproductos(){
    this.productService.getProducts().subscribe(resp=>{
      if(resp){
        this.listproducts = resp;
      }
    });
  }

  listasalida(){
    this.outcomeService.getOutcome().subscribe(resp=>{
      if(resp){
        this.listsalida = resp;
      }
    });
  }

  
  //Responde a Boton bien sin la lista del select

  // getProductDetails(id: any){
  //   this.productService.getByid(id).subscribe((response:any)=>{
  //     this.price = response[0].stock;
  //     this.formOutcomeDetail.controls['cantidad'].setValue(response[0].stock);
  //     const dale = document.getElementById("dale") as HTMLInputElement;
  //     dale.value = response[0].stock;
  //     console.log(response[0].stock);
  //   },(error:any)=>{
  //     console.log(error);
  //     if(error.error?.message){
  //       this.responseMessage = error.error?.message
  //     }else{
  //       this.responseMessage = GlobalConstants.genericError;
  //     }
  //     this.snackBarService.AbrirMensaje(this.responseMessage, GlobalConstants.error)
  //   }
  // )

  // }


}

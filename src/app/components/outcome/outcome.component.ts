import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { clientModel } from 'src/app/model/client-model';
import { outcomeModel } from 'src/app/model/outcome-model';
import { UserModel } from 'src/app/model/user-model';
import { ClientesService } from 'src/app/services/clientes.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { OutcomeService } from 'src/app/services/outcome.service';
import { ProductosService } from 'src/app/services/productos.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-outcome',
  templateUrl: './outcome.component.html',
  styleUrls: ['./outcome.component.scss']
})
export class OutcomeComponent implements OnInit {

  //instanciamos el modelo
  listOutcome: outcomeModel [] = [];
  listclients: clientModel[] = [];
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  filterTerm: string='';
  startDate: string=''; // Puedes definir startDate y endDate como string o Date según prefieras
  endDate: string='';
  fechaInicio: string=''; // Tipo adecuado según tus necesidades (puede ser string o Date)
  fechaFin: string='';
  fechaActual: string='';
  responseMessage: any;
  listclientes: clientModel [] = [];
  listusuarios: UserModel [] = [];
  listAuthusuarios: UserModel [] = [];
  //creamos un formGroup
  formOutcome: FormGroup = new FormGroup({});
  //instanciamos el servicio
  constructor(private outcomeService: OutcomeService,
    private clientesService: ClientesService,
    private usuariosService: UserService,
    private mensajesService: MensajesService,
    private productService: ProductosService,
    private fb: FormBuilder ) {
      this.formOutcome = this.fb.group({
        fecha: ['']
      });
    }

  isUpdate: boolean = false;

  ngOnInit(): void {
    this.setFechasMaximas();
    this.establecerFechaActual();
    this.list();
    this.listausuarios();
    this.listaAuthusuarios();
    this.listaclientes();
    //definir las propiedades del formgroup
    this.formOutcome = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl(''),
      tipoPago: new FormControl(''),
      clientId: new FormControl(''),
      userId: new FormControl(''),
      userAuthId: new FormControl(''),
    })
  }

  //funcion para listar
  list(){
    this.outcomeService.getOutcome().subscribe(resp=>{
      if(resp){
        this.listOutcome = resp;
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
    this.formOutcome.controls['fecha'].setValue(hoy.toISOString().split('T')[0]);
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

  this.listOutcome = this.listOutcome.filter(outcome => {
      const outcomeDate = new Date(outcome.fecha);

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
  this.outcomeService.saveOutcome(this.formOutcome.value).subscribe((resp: any) => {
    if (resp) {
      this.responseMessage = resp.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "check");
      // this.listaproductos();
      // this.listasalida();
      this.formOutcome.reset();

    }
  },
  (error: any) => {
    this.responseMessage = error.error.mensaje;
    this.mensajesService.AbrirMensaje(this.responseMessage, "error");
  }
);
}


  update(){
    this.outcomeService.updateOutcome(this.formOutcome.value).subscribe((resp:any)=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.list();
        this.newOutcome();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }

 delete(id: any){
  const eliminar = confirm("¿Estas seguro de eliminar esta salida?");
  if (eliminar){
  this.outcomeService.deleteOutcome(id).subscribe((resp:any)=>{
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

auth(id: any){
  const autorizar = confirm("¿Estas seguro de autorizar esta salida?");
  if (autorizar){
  this.outcomeService.AuthOutcome(id).subscribe((resp:any)=>{
    if(resp){
      this.responseMessage = resp.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage,"check");
      this.list();
    }
  },
  (error:any) => {
    
    if(error.status===406){
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "no-auth");
    }else{
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
    }
 });
}
}

  newOutcome(){
    this.isUpdate = false;
    this.formOutcome.reset();
  }

  selectItem(item: any) {
    this.isUpdate = true;
    this.formOutcome.controls['id'].setValue(item.id);
    this.formOutcome.controls['fecha'].setValue(item.fecha);
    this.formOutcome.controls['clientId'].setValue(item.clientId);
    this.formOutcome.controls['tipoPago'].setValue(item.tipoPago);
    this.formOutcome.controls['userId'].setValue(item.userId);
    this.formOutcome.controls['userAuthId'].setValue(item.userAuthId);
  }

  listaclientes() {
    this.clientesService.getClients().subscribe(resp => {
      if (resp) {
        this.listclients = resp;
      }
    });
  }

  listausuarios(){
    this.usuariosService.getUser().subscribe(resp=>{
      if(resp){
        this.listusuarios = resp;
      }
    });
  }

  listaAuthusuarios(){
    this.usuariosService.getUser().subscribe(resp=>{
      if(resp){
        this.listAuthusuarios = resp;
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
      docResult.save(`${new Date().toISOString()}_GestiondeSalidas.pdf`);
    });
  }

  getProductDetails2(id: any){
    this.productService.getByid(id).subscribe((response:any)=>{
      console.log("EL STOCK ACTUAL DE "+response[0].nombre+" ES: "+response[0].stock)
      alert("EL STOCK ACTUAL DE "+response[0].nombre+" ES: "+response[0].stock)
    }
  )
  }


}

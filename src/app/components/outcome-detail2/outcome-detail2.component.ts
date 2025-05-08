import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { outcomeDetail2Model } from 'src/app/model/outcomeDetail2-model';
import { OutcomeDetail2Service } from 'src/app/services/outcome-detail2.service';
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
  selector: 'app-outcome-detail2',
  templateUrl: './outcome-detail2.component.html',
  styleUrls: ['./outcome-detail2.component.scss']
})
export class OutcomeDetail2Component implements OnInit {

    listOutcomeDetail2: outcomeDetail2Model []=[];
    product: any;
    filteredCategories: any[] = [];
    startDate: string=''; // Puedes definir startDate y endDate como string o Date según prefieras
    endDate: string='';
    fechaInicio: string=''; // Tipo adecuado según tus necesidades (puede ser string o Date)
    fechaFin: string='';
    fechaActual: string='';
    
    price: any;
    responseMessage:any;
    listproducts: ProductModel [] = [];
    listsalida: outcomeModel [] = [];
    
    formOutcomeDetail2: FormGroup = new FormGroup({});

    constructor(private outcomeDetail2Service: OutcomeDetail2Service,
        private productService: ProductosService,
        private mensajeService: MensajesService,
        private outcomeService: OutcomeService,
        private fb: FormBuilder){
            this.formOutcomeDetail2=this.fb.group({
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
        this.formOutcomeDetail2=new FormGroup({
            id: new FormControl(''),
            saldo: new FormControl(''),
            outcomeId: new FormControl(''),
            prodId: new FormControl(''),
            precioDeVenta: new FormControl(''),
            cantidad: new FormControl(''),
        })

    }

    list(){
        this.outcomeDetail2Service.getAllOutcomeDetails().subscribe(resp=>{
            if(resp){
                this.listOutcomeDetail2=resp;
            }})
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
        this.formOutcomeDetail2.controls['fecha'].setValue(hoy.toISOString().split('T')[0]);
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
      
        this.listOutcomeDetail2 = this.listOutcomeDetail2.filter(outcomeDetail2 => {
            const outcomeDate = new Date(outcomeDetail2.outcomeFecha);
      
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
        if(parseInt(cantidad.value) > 0){
        this.outcomeDetail2Service.saveOutcomeDetail(this.formOutcomeDetail2.value).subscribe((resp: any) => {
          if (resp) {
            this.responseMessage = resp.mensaje;
            this.mensajeService.AbrirMensaje(this.responseMessage, "check");
            this.listasalida();
            this.listaproductos();
            this.formOutcomeDetail2.reset();
            const saldo = document.getElementById("saldo") as HTMLInputElement
            saldo.value = "";
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
        this.outcomeDetail2Service.updateOutcomeDetail(this.formOutcomeDetail2.value).subscribe((resp: any) => {
          if (resp) {
            this.responseMessage = resp.mensaje;
            this.mensajeService.AbrirMensaje(this.responseMessage, "check");
            this.list();
            this.newOutcomeDetail2();
          }
        },
        (error:any) => {
          this.responseMessage = error.error.mensaje;
          this.mensajeService.AbrirMensaje(this.responseMessage, "error");
       });
     }

      newOutcomeDetail2(){
        this.isUpdate = false;
        this.formOutcomeDetail2.reset();
      }

      selectItem(item: any){
        this.isUpdate=true;
        this.formOutcomeDetail2.controls['id'].setValue(item.id);
        this.formOutcomeDetail2.controls['prodId'].setValue(item.prodId);
        this.formOutcomeDetail2.controls['saldo'].setValue(item.saldo);
        this.formOutcomeDetail2.controls['outcomeId'].setValue(item.outcomeId);
        this.formOutcomeDetail2.controls['cantidad'].setValue(item.cantidad);
      }

      ProductDetails(id: any) {
        this.productService.getByid(id).subscribe((response: any) => {
            if (response && response.length > 0) {
                console.log("SOLO ID",response[0])

                this.formOutcomeDetail2.patchValue({
                    saldo: response[0].prodStock,
                    precioDeVenta: response[0].prodPrice
                  });
                  console.log("Nuevo saldo:", this.formOutcomeDetail2.controls['saldo'].value);
                  console.log("Nuevo precioDeVenta:", this.formOutcomeDetail2.controls['precioDeVenta'].value);

            }
        }
        )
      }

      delete(id: any){
          const eliminar = confirm("¿Estas seguro de eliminar este detalle?");
        if(eliminar){
            this.outcomeDetail2Service.deleteOutcomeDetail(id).subscribe((resp:any)=>{
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

      listaproductos(){
        this.productService.getProducts().subscribe(resp=>{
            if(resp){
                this.listproducts=resp;
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

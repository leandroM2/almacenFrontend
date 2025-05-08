import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { id } from '@swimlane/ngx-charts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { clientModel } from 'src/app/model/client-model';
import { incomeModel } from 'src/app/model/income-model';
import { KardexModel } from 'src/app/model/kardex-model';
import { outcomeModel } from 'src/app/model/outcome-model';
import { ProductModel } from 'src/app/model/productos_model';
import { ClientesService } from 'src/app/services/clientes.service';
import { KardexService } from 'src/app/services/kardex.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { OutcomeService } from 'src/app/services/outcome.service';
import { ProductosService } from 'src/app/services/productos.service';
import { IncomeService } from 'src/app/services/income.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProveedoresService } from 'src/app/services/proveedores.service';

/*
import { IncomeDetailService } from 'src/app/services/income-detail.service';
import { OutcomeDetailService } from 'src/app/services/outcome-detail.service';
*/
import { IncomeDetail2Service } from 'src/app/services/income-detail2.service';
import { OutcomeDetail2Service } from 'src/app/services/outcome-detail2.service';
import { SupplierModel } from 'src/app/model/proveedores_model';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {


  //instanciamos el modelo
  listKardex: KardexModel[] = [];
  listkardexDetails: KardexModel[] = [];
  listclients: clientModel[] = [];
  selectedProductId2: any;
  responseMessage: any;
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  filterTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  fechaActual: string = '';
  selectedProductId: string='';
  selectproduct: string='';
  contador: number= 0;
  listproducts: ProductModel[] = [];
  listsuppliers: SupplierModel[] = [];
  filteredProducts: ProductModel[] = [];
  listentrada: incomeModel[] = [];
  listsalida: outcomeModel[] = [];
  //creamos un formGroup
  formKardex: FormGroup = new FormGroup({});
  formIncome: FormGroup = new FormGroup({});
  formIncomeDetail: FormGroup = new FormGroup({});
  formOutcome: FormGroup = new FormGroup({});
  formOutcomeDetail: FormGroup = new FormGroup({});
  //instanciamos el servicio
  constructor(private kardexService: KardexService,
    private clientsService: ClientesService,
    private incomeService: IncomeService,
    /*private incomeDetailService: IncomeDetailService,
    private outcomeDetailService: OutcomeDetailService,*/

    private incomeDetail2Service: IncomeDetail2Service,
    private outcomeDetail2Service: OutcomeDetail2Service,

    private outcomeService: OutcomeService,
    private productService: ProductosService,
    private supplierService: ProveedoresService,
    private mensajesService: MensajesService,

    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder) {
    this.formIncome = this.fb.group({
      fecha: ['']
    });
  }

  isUpdate: boolean = false;

  ngOnInit(): void {
    this.setFechasMaximas();
    this.list();
    this.listaproductos();
    this.listasuppliers();
    this.listaentrada();
    this.listasalida();
    this.listaclientes();
    //formulario de income
    this.formIncome = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl(''),
      tipoPago: new FormControl(''),
      supinc: new FormControl(''),
      userId: new FormControl(''),
      userAuthId: new FormControl(''),
      supId: new FormControl(''),
    })
    //formulario de incomeDetail
    this.formIncomeDetail = new FormGroup({
      id: new FormControl(''),
      cantidad: new FormControl(''),
      saldo: new FormControl(''), //1
      precioVentaUnit: new FormControl(''),
      precioVenta: new FormControl(''), //2
      oldPrecioVenta: new FormControl(''), //3
      incomeId: new FormControl(''),
      prodId: new FormControl(''),
    })
    //formulario de outcome
    this.formOutcome = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl(''),
      tipoPago: new FormControl(''),
      clientId: new FormControl(''),
      userId: new FormControl(''),
      userAuthId: new FormControl(''),
    })
    //formulario de OutcomeDetail
    this.formOutcomeDetail = new FormGroup({
      id: new FormControl(''),
      saldo: new FormControl(''), //1
      precioDeVenta: new FormControl(''), //2
      cantidad: new FormControl(''),
      outcomeId: new FormControl(''),
      prodId: new FormControl(''),
    })
    //definir las propiedades del formgroup
    //  this.formIncomeDetail = new FormGroup({
    //    id: new FormControl(''),
    //    precioVentaUnit: new FormControl(''),
    //    cantidad: new FormControl(''),
    //    incomeId: new FormControl(''),
    //    prodId: new FormControl(''),
    //  })
  }

  //funcion para listar
  list() {
    this.kardexService.getKardex().subscribe(resp => {
      if (resp) {
        this.listKardex = resp.filter(item => item.estado === true)
        .sort((a, b) => {
          const numA = parseInt(a.id.substring(1), 10);
          const numB = parseInt(b.id.substring(1), 10);
          return numB - numA;
        }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      }
    });
    const start = document.getElementById('start') as HTMLInputElement;
    const end = document.getElementById('end') as HTMLInputElement;
    end.value = '';
    start.value = '';

  }

  listautorizar() {
    this.kardexService.getKardex().subscribe(resp => {
      if (resp) {
        this.listKardex = resp.filter(item => item.estado === false)
        .sort((a, b) => {
          console.log("hola", this.listKardex)
          const numA = parseInt(a.id.substring(1), 10);
          const numB = parseInt(b.id.substring(1), 10);
          return numB - numA;
        }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      }
    });
    const start = document.getElementById('start') as HTMLInputElement;
    const end = document.getElementById('end') as HTMLInputElement;
    end.value = '';
    start.value = '';

  }

  
    listEntradas() {
    this.kardexService.getInKardex().subscribe(resp => {
      if (resp) {
        this.listKardex = resp.filter(item => item.estado === true)
        .sort((a, b) => {
          const numA = parseInt(a.id.substring(1), 10);
          const numB = parseInt(b.id.substring(1), 10);
          return numB - numA;
        }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      }
    });
    const start = document.getElementById('start') as HTMLInputElement;
    const end = document.getElementById('end') as HTMLInputElement;
    end.value = '';
    start.value = '';

  }
  

  listSalidas() {
    this.kardexService.getOutKardex().subscribe(resp => {
      if (resp) {
        this.listKardex = resp.filter(item => item.estado === true)
        .sort((a, b) => {
          const numA = parseInt(a.id.substring(1), 10);
          const numB = parseInt(b.id.substring(1), 10);
          return numB - numA;
        }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
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
    this.formIncome.controls['fecha'].setValue(hoy.toISOString().split('T')[0]);
  }

  establecerFechaActual2(): void {
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

    this.listKardex = this.listKardex.filter(kardex => {
      const kardexDate = new Date(kardex.fecha);

      // Verificar si el outcomeDate está dentro del rango especificado (inclusive)
      if (startTerm && endTerm) {
        // Comparar solo año, mes y día
        return (
          kardexDate >= startTerm &&
          kardexDate <= endTerm
        );
      } else if (startTerm) {
        // Comparar solo a partir de la fecha de inicio
        return (
          kardexDate >= startTerm
        );
      } else if (endTerm) {
        // Comparar solo hasta la fecha de fin
        return (
          kardexDate <= endTerm
        );
      }
      return true; // Si no se especificó rango, incluir todos los elementos
    });
    this.setFechasMaximas();
  }

  filterProducts(): void {
    this.listKardex = this.listKardex.filter(item => 
      item.estado === true && 
      item.details.some(item2 => item2.producto === this.selectproduct)
    );
  }
  


  save() {
    this.incomeService.saveIncome(this.formIncome.value).subscribe((resp: any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "check");
        this.listautorizar();
        this.listaproductos();
        this.listasuppliers();
        this.listaentrada();
        this.newIncome();
      }
    },
      (error: any) => {
        this.responseMessage = error.error.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "error");
      }
    );
  }

  save2() {
    console.log("pruebas incomedetail: ",this.formIncomeDetail.value)
    const cantidad = document.getElementById("cantidad") as HTMLInputElement
    const precioVenta = document.getElementById("precioVenta") as HTMLInputElement
    console.log("CANTIDAD: ", cantidad)
    console.log("PRECIO DE VENTA: ", precioVenta)
    if(parseInt(cantidad.value) > 0 && parseFloat(precioVenta.value) > 0){
    this.incomeDetail2Service.saveIncomeDetail(this.formIncomeDetail.value).subscribe((resp: any) => {
    //this.incomeDetailService.saveIncomeDetail(this.formIncomeDetail.value).subscribe((resp: any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "check");
        this.listautorizar();
        this.listaproductos();
        this.listasuppliers();
        this.listaentrada();
        this.newIncomeDetail();
        // this.formIncomeDetail.reset();
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
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
    }
  );
}
else {
  alert("Error en la cantidad o precio, deben ser mayores a 0")
}

}

  save3() {
    this.outcomeService.saveOutcome(this.formOutcome.value).subscribe((resp: any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "check");
        this.listautorizar();
        this.listaproductos();
        this.listasuppliers();
        this.listasalida();
        this.formOutcome.reset();

      }
    },
    (error: any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
    }
  );
}

  save4() {
    const cantidad = document.getElementById("cantidad2") as HTMLInputElement
    if(parseInt(cantidad.value) > 0){
    this.outcomeDetail2Service.saveOutcomeDetail(this.formOutcomeDetail.value).subscribe(resp => {
    //this.outcomeDetailService.saveOutcomeDetail(this.formOutcomeDetail.value).subscribe(resp => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "check");
        this.listautorizar();
        this.listasalida();
        //this.listaproductos();
        // this.formOutcomeDetail.reset();
        // this.getProductDetails2(this.selectedProductId);
        const stockact2 = document.getElementById("stockact2") as HTMLInputElement
        const preact2 = document.getElementById("preact2") as HTMLInputElement
        stockact2.value = "";
        preact2.value = "";
        this.newOutcomeDetail();
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


  newIncome() {
    this.isUpdate = false;
    const tipopago = document.getElementById("tipopago") as HTMLSelectElement
    tipopago.selectedIndex = 0;
    const supId = document.getElementById("supId") as HTMLSelectElement
    supId.selectedIndex = 0;
    const supinc = document.getElementById("supinc") as HTMLSelectElement
    supinc.selectedIndex = 0;
    this.formIncome.reset();

    this.listsuppliers = []; 

    // Recarga los proveedores si es necesario
    this.listasuppliers();
  }

  newIncomeDetail() {
    this.isUpdate = false;
    this.formIncomeDetail.reset();
    const prodinc = document.getElementById("prodinc") as HTMLSelectElement
    prodinc.selectedIndex = 0;

  }

  newOutcome() {
    this.isUpdate = false;
    this.formOutcome.reset();
    const tipopago2 = document.getElementById("tipopago2") as HTMLSelectElement
    const clien = document.getElementById("clien") as HTMLSelectElement
    tipopago2.selectedIndex = 0;
    clien.selectedIndex = 0;
  }

  newOutcomeDetail() {
    this.isUpdate = false;
    this.formOutcomeDetail.reset();
    const prod = document.getElementById("prod") as HTMLSelectElement
    prod.selectedIndex = 0;
  }

  auth(id: any) {
    const confirmar = confirm("¿Estas seguro de autorizar este movimiento?")
    if (confirmar) {
      this.kardexService.AuthKardex(id).subscribe((resp: any) => {
        if (resp) {
          this.responseMessage = resp.mensaje;
          this.mensajesService.AbrirMensaje(this.responseMessage, "check");
          this.archives(id);
          this.list();
          this.kardexService.GetByIdKardex(id).subscribe(resp=>{
            let textcontent="";
            for( let detalles of resp[0].detalles){
               textcontent += "El stock actual de "+ detalles.producto+" es : "+detalles.saldo+"\n"
            }
            alert(textcontent);
          })
        }
      },
        (error: any) => {
          this.responseMessage = error.error.mensaje;
          this.mensajesService.AbrirMensaje(this.responseMessage, "error");
        }
      );
    }
  }

  archives(id: any) {
    this.kardexService.ArchivesKardex(id).subscribe((resp:any) => {
      if (resp) {
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "check");
      }
    },
    (error: any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
    });
  }

  download(id:any){
    this.kardexService.getDownloadArchives(id).subscribe((blob:any) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      this.responseMessage = "PDF descargado correctamente";
      this.mensajesService.AbrirMensaje(this.responseMessage, "check");
    },
    (error: any) => {
      this.responseMessage = "Error al descargar el PDF"
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
    });
  }
  

  //  selectItem(item: any) {
  //    this.isUpdate = true;
  //    this.formIncomeDetail.controls['id'].setValue(item.id);
  //    this.formIncomeDetail.controls['cantidad'].setValue(item.cantidad);
  //    this.formIncomeDetail.controls['precioVentaUnit'].setValue(item.precioVentaUnit);
  //    this.formIncomeDetail.controls['incomeId'].setValue(item.incomeId);
  //    this.formIncomeDetail.controls['prodId'].setValue(item.prodId);
  //  }

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

  isSalidaSelected: boolean = false;

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.isSalidaSelected = selectElement.value === '1';
  }

  listaclientes() {
    this.clientsService.getClients().subscribe(resp => {
      if (resp) {
        this.listclients = resp;
      }
    });
  }



  // addDataBsTarget(): void {
  //   // const button = this.el.nativeElement.querySelector('#modal2');
  //   // if (button) {
  //   //   this.renderer.setAttribute(button, 'data-bs-target', '#exampleModal2');
  //   // }
  //   const button = document.getElementById("modal2");
  //   button?.setAttribute('data-bs-target','#exampleModal2');
  // }

  listaproductos() {
    this.productService.getProducts().subscribe(resp=>{
      if(resp){
          this.listproducts=resp;
      }
  });
  }

  listasuppliers() {
    this.supplierService.getSuppliers().subscribe(resp=>{
      if(resp){
          this.listsuppliers=resp;
      }
  });
  }


  // listaentrada() {
  //   this.incomeService.getIncome().subscribe(resp => {
  //     if (resp) {
  //       this.listentrada = resp
  //         .filter(item => item.estado === false)  // Filtrar solo los elementos con estado true
  //         .sort((a, b) => b.id - a.id);          // Ordenar por id de mayor a menor
  //     }
  //   });
  // }

  listaentrada() {
    this.incomeService.getIncome().subscribe(resp => {
      if (resp) {
        const identrada = resp
          .filter(item => item.estado === false)  // Filtrar solo los elementos con estado true
          .sort((a, b) => b.id - a.id);
        this.formIncomeDetail.controls['incomeId'].setValue(identrada[0].id);
      }
    });
  }

  /*
    listaentrada() {
    this.incomeService.getIncome().subscribe(resp => {
      if (resp) {
        const identrada = resp
          .filter(item => item.estado === false)  // Filtrar solo los elementos con estado true
          .sort((a, b) => b.id - a.id);
        this.formIncomeDetail.controls['incomeId'].setValue(identrada[0].id);
      }
    });
  }
  */ 

  listasalida() {
    this.outcomeService.getOutcome().subscribe(resp => {
      if (resp) {
        const idsalida = resp
          .filter(item => item.estado === false)  // Filtrar solo los elementos con estado true
          .sort((a, b) => b.id - a.id);
        this.formOutcomeDetail.controls['outcomeId'].setValue(idsalida[0].id);
      }
    });
  }


  getProductDetails(id: any) {
    this.productService.getByid(id).subscribe((response: any) => {
      if (response && response.length > 0) {

          this.formIncomeDetail.patchValue({
              saldo: response[0].prodStock,
              oldPrecioVenta: response[0].prodPrice,
            });

      }
  }
  )
  }

  onSupplierChange(supplierId: number) {
    if (supplierId) {
        this.productService.getBySupplierId(supplierId).subscribe(
            (resp: any[]) => {
                this.filteredProducts = resp; // Asigna a filteredProducts
                // Verificar si el control existe
                const prodIdControl = this.formIncomeDetail.get('prodId');
                if (prodIdControl) {
                  prodIdControl.setValue(''); 
                  prodIdControl.markAsPristine();
                }
                this.cdRef.detectChanges();
            }
        );
    } else {
        this.filteredProducts = []; // Limpia la lista si no hay proveedor seleccionado
    }
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
      stockact.value = response[0].prodStock
      preact.value = response[0].prodPrice
      cantidad.value = ""
    }
    )
  }

  onPrecioChange(): void {
    const oldPrecioVenta = this.formIncomeDetail.controls['oldPrecioVenta'].value;
    const precioVenta = this.formIncomeDetail.controls['precioVenta'].value;
  
    if (oldPrecioVenta !== null && precioVenta !== null) {
      const newPrecioVenta = ((parseFloat(oldPrecioVenta) + parseFloat(precioVenta)) / 2).toFixed(2);
      
      this.formIncomeDetail.patchValue({
        precioVentaUnit: newPrecioVenta
      });
    }
  }

  delete(id: any) {
    this.incomeService.deleteIncome(id).subscribe(resp => {
      if (resp) {
        this.list();
      }
    });
  }

  getSelectedValue() {
    const selectElement = document.getElementById('incomeSelect') as HTMLSelectElement;
    const selectedValue = selectElement.value;
    console.log(selectedValue);
    this.delete(selectedValue);
  }

} 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { clientModel } from 'src/app/model/client-model';
import { ClientesService } from 'src/app/services/clientes.service';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  //instanciamos el modelo
  listClient: clientModel [] = [];
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  filterTerm: string = '';
  responseMessage: any;
  //creamos un formGroup
  formClient: FormGroup = new FormGroup({});
  //instanciamos el servicio
  constructor(private clientService: ClientesService,
    private mensajesService: MensajesService,
    private fb: FormBuilder
  ) {
    this.formClient = this.fb.group({
      razonSocial: ['']
    });
  }


  isUpdate: boolean = false;

  ngOnInit(): void {
    this.list();
    //this.resetFilter();
    //definir las propiedades del formgroup
    this.formClient = new FormGroup({
      id: new FormControl(''),
      razonSocial: new FormControl(''),
      ruc: new FormControl(''),
      correo: new FormControl(''),
      contacto: new FormControl(''),
      direccion: new FormControl(''),
    })

    //this.filteredCategories = this.listcategory;
  }
  

  //funcion para listar
  list(){
    this.clientService.getClients().subscribe(resp=>{
      if(resp){
        this.listClient = resp;  
      }
    });
    const filterInput = document.getElementById('filter') as HTMLInputElement;
    if (filterInput) {
      filterInput.value = '';
    }
  }

  filterCategories(): void {
    const term = this.filterTerm.toLowerCase();
    this.listClient = this.listClient.filter(client => 
      client.razonSocial.toLowerCase().includes(term)
    );
  }
  

  //resetFilter(): void {
    //this.filterTerm = '';
    //this.filteredCategories = this.listcategory;
  //}
  
  save(){
    this.clientService.saveClient(this.formClient.value).subscribe((resp:any)=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.list();
        this.formClient.reset();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }

  update(){
    this.clientService.updateClient(this.formClient.value).subscribe((resp:any)=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.list();
        this.newClient();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }

  delete(id: any){
    const eliminar = confirm("¿Estas seguro de eliminar este cliente?");
    if (eliminar){
    this.clientService.deleteClient(id).subscribe(resp=>{
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


  newClient(){
    this.isUpdate = false;
    this.formClient.reset();
  }

  selectItem(item: any) {
    this.isUpdate = true;
    this.formClient.controls['id'].setValue(item.id);
    this.formClient.controls['razonSocial'].setValue(item.razonSocial);
    this.formClient.controls['ruc'].setValue(item.ruc);
    this.formClient.controls['correo'].setValue(item.correo);
    this.formClient.controls['contacto'].setValue(item.contacto);
    this.formClient.controls['direccion'].setValue(item.direccion);
  }
}

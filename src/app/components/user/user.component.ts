import { Component } from '@angular/core';
import { UserModel } from '../../model/user-model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Token } from '@angular/compiler';
import { MensajesService } from 'src/app/services/mensajes.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent {
  //instanciamos el modelo
  listusers: UserModel [] = [];
  responseMessage: any;
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  filterTerm: string = '';
  fileToUpload: File | null = null;
  uploadProgress: number = 0;
  uploadResponse: string = '';
  //creamos un formGroup
  formUser: FormGroup = new FormGroup({});

  //instanciamos el servicio
  constructor(private userService: UserService,
    private mensajesService: MensajesService,
    private fb: FormBuilder) {
      this.formUser = this.fb.group({
        nombre: ['']
      });
    }

  isUpdate: boolean = false;

  ngOnInit(): void {
    this.list(); 
    //definir las propiedades del formgroup
    this.formUser = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl(''),
      email: new FormControl(''),
      contrasena: new FormControl(''),
      estado: new FormControl(''),
      rol: new FormControl(''),
    })
  }

  //funcion para listar
  list(){
    this.userService.getUser().subscribe(resp=>{
      if(resp){
        this.listusers = resp;
      }
    });
    const filterInput = document.getElementById('filter') as HTMLInputElement;
    if (filterInput) {
      filterInput.value = '';
    }
  }
  filterCategories(): void {
    const term = this.filterTerm.toLowerCase();
    this.listusers = this.listusers.filter(user => 
      user.nombre.toLowerCase().includes(term)
    );
  }
  save(){
    this.userService.saveUser(this.formUser.value).subscribe((resp:any)=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.list();
        this.formUser.reset();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }

  update(){
    this.userService.updateUser(this.formUser.value).subscribe((resp:any)=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.list();
        this.newUser();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }

  delete(id: any){
    const eliminar = confirm("¿Estas seguro de deshabilitar este usuario?");
    if (eliminar){
    this.userService.deleteUser(id).subscribe(resp=>{
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
  const autorizar = confirm("¿Estas seguro de autorizar este usuario?");
  if (autorizar){
  this.userService.authUser(id).subscribe(resp=>{
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

deletefirm(id: any){
  const eliminarf = confirm("¿Estas seguro de eliminar la firma de "+id);
  if (eliminarf){
  this.userService.deletefirma(id).subscribe((resp:any)=>{
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

  newUser(){
    this.isUpdate = false;
    this.formUser.reset();
    const user = document.getElementById("user") as HTMLSelectElement
    user.selectedIndex = 0;
  }

  selectItem(item: any) {
    this.isUpdate = true;
    this.formUser.controls['id'].setValue(item.id);
    this.formUser.controls['nombre'].setValue(item.nombre);
    this.formUser.controls['email'].setValue(item.email);
    this.formUser.controls['contrasena'].setValue(item.contrasena);
    this.formUser.controls['estado'].setValue(item.estado);
    this.formUser.controls['rol'].setValue(item.rol);
    
  }

  //conseguirToken(){
    //this.userService.token(this.formToken.value).subscribe(resp=>{
      //if(resp){
        //return resp.token;//hacer esto con el token
      //}
    //});
  //}

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  uploadFile() {
    if (this.fileToUpload) {
      this.userService.uploadFile(this.fileToUpload).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total!);
          } else if (event instanceof HttpResponse) {
            this.responseMessage = "Imagen subida correctamente";
            this.mensajesService.AbrirMensaje(this.responseMessage,"check");
          }
        },
        (error) => {
          this.responseMessage = "Error al subir la imagen";
          this.mensajesService.AbrirMensaje(this.responseMessage, "error");
        }
      );
    }
  }

}



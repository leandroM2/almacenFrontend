import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/services/mensajes.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.scss']
})
export class IniciarSesionComponent implements OnInit {

  contra = true;
  confirmarContra = true;
  iniciarSesionForm:any = FormGroup;
  responseMessage:any;
  
  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService: UserService,
    private mensajeService: MensajesService,
    public dialogRef:MatDialogRef<IniciarSesionComponent>
  ) { }

  ngOnInit(): void {
    this.iniciarSesionForm = this.formBuilder.group({
      nombre:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contrasena:[null,[Validators.required]],
      confirmarContrasena:[null,[Validators.required]]
    })
  }

  validarEnvio(){
    if(this.iniciarSesionForm.controls['contrasena'].value != this.iniciarSesionForm.controls['confirmarContrasena'].value){
      return true;
    }
    else {
      return false;
    }
  }

  accionEnvio(){
    var formData = this.iniciarSesionForm.value;
    var data = {
      nombre: formData.nombre,
      email: formData.email,
      contrasena: formData.contrasena
    }

    this.userService.registrarse(data).subscribe(response=>{
      this.dialogRef.close();
      this.router.navigate(['/']);
   });
 }





}

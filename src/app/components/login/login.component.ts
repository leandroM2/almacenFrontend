// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  contra = true;
  loginForm: any = FormGroup;
  responseMessage: any;
  formToken: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private mensajeService: MensajesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contrasena: [null, [Validators.required]],
    });
    this.formToken = new FormGroup({
      token: new FormControl(''),
    });
  }

  accionEnvio() {
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      contrasena: formData.contrasena
    };
    this.userService.iniciarSesion(data).subscribe((response: any) => {
      this.dialogRef.close();
      localStorage.setItem('token', response.token);
      //this.router.navigate(['dashboard/usuarios']);
      this.router.navigate(['dashboard/kardex']);
      console.log(response.token);
      this.authService.setToken(response.token); // Guardar el token en AuthService
      this.mensajeService.AbrirMensaje(this.responseMessage,"login");
    },
    (error:any) => {
     this.responseMessage = error.error.mensaje;
     this.mensajeService.AbrirMensaje(this.responseMessage, "error");
   });
 }
 
}

  //conseguirToken(){
   // this.userService.iniciarSesion(this.formToken.value).subscribe(resp=>{
      //if(resp){
        //console.log(resp);//hacer esto con el token
      //}
    //});
  //}


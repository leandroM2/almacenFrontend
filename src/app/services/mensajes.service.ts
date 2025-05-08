import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private mensajes:MatSnackBar) { }

  AbrirMensaje(mensaje: string, action: string){
    if (action === 'error'){
      this.mensajes.open(mensaje, '',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['red-snackbar']
      });
    }
    else if (action === 'check') {
      this.mensajes.open(mensaje, '',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['green-snackbar']
      });
    }
    else if (action === 'no-auth') {
      this.mensajes.open(mensaje, '',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['dark-green-snackbar']
      });
    }
    else if (action === 'login') {
      this.mensajes.open(mensaje, 'HA INICIADO SESION CORRECTAMENTE',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['green-snackbar']
      });
    }
    else if (action === 'update') {
      this.mensajes.open(mensaje, 'SE HA EDITADO CORRECTAMENTE',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['green-snackbar']
      });
    }
    else if (action === 'delete') {
      this.mensajes.open(mensaje, 'SE HA ELIMINADO CORRECTAMENTE',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['green-snackbar']
      });
    }
    else if (action === 'auth') {
      this.mensajes.open(mensaje, 'AUTORIZADO CORRECTAMENTE',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['green-snackbar']
      });
    }
    else if (action === 'no-auth') {
      this.mensajes.open(mensaje, 'NO ESTAS AUTORIZADO',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['red-snackbar']
      });
    }
    else{
      this.mensajes.open(mensaje, 'REGISTRADO CORRECTAMENTE',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['green-snackbar']
      });
    }
}
}

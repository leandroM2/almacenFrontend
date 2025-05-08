import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SupplierModel } from 'src/app/model/proveedores_model';
import { SupplierBModel } from 'src/app/model/supplier-model';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],

  animations: [
    trigger('accordionAnimation', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class ProveedoresComponent implements OnInit {
  //instanciamos el modelo
  listSuppliers: SupplierModel [] = [];
  listSuppliersB: SupplierBModel [] = [];
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  filterTerm: string = '';
  //creamos un formGroup
  formSupplier: FormGroup = new FormGroup({});
  responseMessage: any;
  //instanciamos el servicio
  constructor(private proveedoresService: ProveedoresService,
    private mensajesService: MensajesService,
    private fb: FormBuilder ) {
      this.formSupplier = this.fb.group({
        razonSocial: ['']
      });
    }

  isUpdate: boolean = false;

  ngOnInit(): void {
    this.listB();
    //definir las propiedades del formgroup
    this.formSupplier = new FormGroup({
      id: new FormControl(''),
      razonSocial: new FormControl(''),
      ruc: new FormControl(''),
      contacto: new FormControl(''),
    })
  }

  toggleAccordion(item: SupplierBModel): void {
    item.expanded = !item.expanded;
  }
  //funcion para listar

  listB(){
    this.proveedoresService.getSuppAcc().subscribe(resp=>{
      if(resp){
        this.listSuppliersB = resp;
      }
    });
    const filterInput = document.getElementById('filter') as HTMLInputElement;
    if (filterInput) {
      filterInput.value = '';
    }
  }

  filterCategories(): void {
    const term = this.filterTerm.toLowerCase();
    this.listSuppliers = this.listSuppliers.filter(supplier => 
      supplier.razonSocial.toLowerCase().includes(term)
    );
  }
  save(){
    this.proveedoresService.saveSuppliers(this.formSupplier.value).subscribe((resp:any)=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.listB();
        this.formSupplier.reset();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }
  update(){
    this.proveedoresService.updateSuppliers(this.formSupplier.value).subscribe((resp:any)=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.listB();
        this.newSupplier();
      }
    },
    (error:any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }

  delete(id: any){
    const eliminar = confirm("¿Estas seguro de eliminar este producto?");
    if (eliminar){
    this.proveedoresService.deleteSuppliers(id).subscribe((resp:any)=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.listB();
      }
    },
    (error:any) => {
     this.responseMessage = error.error.mensaje;
     this.mensajesService.AbrirMensaje(this.responseMessage, "error");
   });
 }
 }


  newSupplier(){
    this.isUpdate = false;
    this.formSupplier.reset();
  }

  selectItem(item: any) {
    this.isUpdate = true;
    this.formSupplier.controls['id'].setValue(item.id);
    this.formSupplier.controls['razonSocial'].setValue(item.razSocial);
    this.formSupplier.controls['ruc'].setValue(item.ruc);
    this.formSupplier.controls['contacto'].setValue(item.contactNumber);
  }
}

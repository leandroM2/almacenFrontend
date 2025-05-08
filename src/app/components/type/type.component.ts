import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TypeModel } from 'src/app/model/type-model';
import { TypeService } from 'src/app/services/type.service';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.sass']
})

export class TypeComponent implements OnInit {

  //instanciamos el modelo
  listtype: TypeModel [] = [];
  responseMessage: any;
  //declarmos otra lista para filtrar
  filteredTypes: any[] = [];
  filterTerm: string = '';
  //creamos un formGroup
  formType: FormGroup = new FormGroup({});
  //instanciamos el servicio
  constructor(private typeService: TypeService,
    private mensajesService: MensajesService,
    private fb: FormBuilder
  ) {
    this.formType = this.fb.group({
      typeName: ['']
    });
  }


  isUpdate: boolean = false;

  ngOnInit(): void {
    this.list();
    //this.resetFilter();
    //definir las propiedades del formgroup
    this.formType = new FormGroup({
      typeId: new FormControl(''),
      typeName: new FormControl(''),
    })

    //this.filteredCategories = this.listtype;
  }
  

  //funcion para listar
  list(){
    this.typeService.getType().subscribe(resp=>{
      if(resp){
        this.listtype = resp;  
      }
    });
    const filterInput = document.getElementById('filter') as HTMLInputElement;
    if (filterInput) {
      filterInput.value = '';
    }
  }

  filterTypes(): void {
    const term = this.filterTerm.toLowerCase();
    this.listtype = this.listtype.filter(type => 
      type.typeName.toLowerCase().includes(term)
    );
  }
  

  //resetFilter(): void {
    //this.filterTerm = '';
    //this.filteredCategories = this.listtype;
  //}
  
  // save(){
  //   this.typeService.saveType(this.formType.value).subscribe((resp:any)=>{
  //     if(resp){
  //       this.list();
  //       this.formType.reset();
  //     }
  //   });
    
  // }

  save() {
    this.typeService.saveType(this.formType.value).subscribe(
      (resp: any) => {
        if (resp) {
          this.responseMessage = resp.mensaje;
          this.mensajesService.AbrirMensaje(this.responseMessage,"check");
          this.list();
          this.formType.reset();
        }
      },
      (error: any) => {
        this.responseMessage = error.error.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage, "error");
        //alert(error.error.mensaje); // Muestra el mensaje de error específico al usuario
      }
    );
  }

  update(){
    this.typeService.updateType(this.formType.value).subscribe((resp:any)=>{
      this.responseMessage = resp.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage,"check");
      console.log(resp.mensaje)
      if(resp){
        this.list();
        this.newType();
      }
    },
    (error: any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
      //alert(error.error.mensaje); // Muestra el mensaje de error específico al usuario
    }
  );
}

  delete(id: any){
    const eliminar = confirm("¿Estas seguro de eliminar esta categoria?");
    if(eliminar){
    this.typeService.deleteType(id).subscribe(resp=>{
      if(resp){
        this.responseMessage = resp.mensaje;
        this.mensajesService.AbrirMensaje(this.responseMessage,"check");
        this.list();
      }
    },
    (error: any) => {
      this.responseMessage = error.error.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage, "error");
      //alert(error.error.mensaje); // Muestra el mensaje de error específico al usuario
    }
  );
}
}
  newType(){
    this.isUpdate = false;
    this.formType.reset();
  }

  selectItem(item: any) {
    this.isUpdate = true;
    this.formType.controls['typeId'].setValue(item.typeId);
    this.formType.controls['typeName'].setValue(item.typeName);
  }
}



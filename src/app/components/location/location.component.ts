import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LocationModel } from 'src/app/model/location-model';
import { LocationService } from 'src/app/services/location.service';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.sass']
})

export class LocationComponent implements OnInit {

  //instanciamos el modelo
  listlocation: LocationModel [] = [];
  responseMessage: any;
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  filterTerm: string = '';
  //creamos un formGroup
  formLocation: FormGroup = new FormGroup({});
  //instanciamos el servicio
  constructor(private locationService: LocationService,
    private mensajesService: MensajesService,
    private fb: FormBuilder
  ) {
    this.formLocation = this.fb.group({
      locationFloor: ['']
    });
  }


  isUpdate: boolean = false;

  ngOnInit(): void {
    this.list();
    //this.resetFilter();
    //definir las propiedades del formgroup
    this.formLocation = new FormGroup({
      locationId: new FormControl(''),
      locationFloor: new FormControl(''),
    })

    //this.filteredCategories = this.listlocation;
  }
  

  //funcion para listar
  list(){
    this.locationService.getLocation().subscribe(resp=>{
      if(resp){
        this.listlocation = resp;  
      }
    });
    const filterInput = document.getElementById('filter') as HTMLInputElement;
    if (filterInput) {
      filterInput.value = '';
    }
  }

  filterCategories(): void {
    const term = this.filterTerm.toLowerCase();
    this.listlocation = this.listlocation.filter(location => 
      location.locationFloor.toLowerCase().includes(term)
    );
  }
  

  //resetFilter(): void {
    //this.filterTerm = '';
    //this.filteredCategories = this.listlocation;
  //}
  
  // save(){
  //   this.locationService.saveLocation(this.formLocation.value).subscribe((resp:any)=>{
  //     if(resp){
  //       this.list();
  //       this.formLocation.reset();
  //     }
  //   });
    
  // }

  save() {
    this.locationService.saveLocation(this.formLocation.value).subscribe(
      (resp: any) => {
        if (resp) {
          this.responseMessage = resp.mensaje;
          this.mensajesService.AbrirMensaje(this.responseMessage,"check");
          this.list();
          this.formLocation.reset();
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
    this.locationService.updateLocation(this.formLocation.value).subscribe((resp:any)=>{
      this.responseMessage = resp.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage,"check");
      console.log(resp.mensaje)
      if(resp){
        this.list();
        this.newLocation();
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
    const eliminar = confirm("¿Desea desactivar esta ubicación?");
    if(eliminar){
    this.locationService.deleteLocation(id).subscribe(resp=>{
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

  newLocation(){
    this.isUpdate = false;
    this.formLocation.reset();
  }

  selectItem(item: any) {
    this.isUpdate = true;
    this.formLocation.controls['locationId'].setValue(item.locationId);
    this.formLocation.controls['locationFloor'].setValue(item.locationFloor);
  }
}



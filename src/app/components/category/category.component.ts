import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CategoryModel } from 'src/app/model/category-model';
import { CategoryService } from 'src/app/services/category.service';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})

export class CategoryComponent implements OnInit {

  //instanciamos el modelo
  listcategory: CategoryModel [] = [];
  responseMessage: any;
  //declarmos otra lista para filtrar
  filteredCategories: any[] = [];
  filterTerm: string = '';
  //creamos un formGroup
  formCategory: FormGroup = new FormGroup({});
  //instanciamos el servicio
  constructor(private categoryService: CategoryService,
    private mensajesService: MensajesService,
    private fb: FormBuilder
  ) {
    this.formCategory = this.fb.group({
      catName: ['']
    });
  }


  isUpdate: boolean = false;

  ngOnInit(): void {
    this.list();
    //this.resetFilter();
    //definir las propiedades del formgroup
    this.formCategory = new FormGroup({
      catId: new FormControl(''),
      catName: new FormControl(''),
    })

    //this.filteredCategories = this.listcategory;
  }
  

  //funcion para listar
  list(){
    this.categoryService.getCategory().subscribe(resp=>{
      if(resp){
        this.listcategory = resp;  
      }
    });
    const filterInput = document.getElementById('filter') as HTMLInputElement;
    if (filterInput) {
      filterInput.value = '';
    }
  }

  filterCategories(): void {
    const term = this.filterTerm.toLowerCase();
    this.listcategory = this.listcategory.filter(category => 
      category.catName.toLowerCase().includes(term)
    );
  }
  

  //resetFilter(): void {
    //this.filterTerm = '';
    //this.filteredCategories = this.listcategory;
  //}
  
  // save(){
  //   this.categoryService.saveCategory(this.formCategory.value).subscribe((resp:any)=>{
  //     if(resp){
  //       this.list();
  //       this.formCategory.reset();
  //     }
  //   });
    
  // }

  save() {
    this.categoryService.saveCategory(this.formCategory.value).subscribe(
      (resp: any) => {
        if (resp) {
          this.responseMessage = resp.mensaje;
          this.mensajesService.AbrirMensaje(this.responseMessage,"check");
          this.list();
          this.formCategory.reset();
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
    this.categoryService.updateCategory(this.formCategory.value).subscribe((resp:any)=>{
      this.responseMessage = resp.mensaje;
      this.mensajesService.AbrirMensaje(this.responseMessage,"check");
      console.log(resp.mensaje)
      if(resp){
        this.list();
        this.newCategory();
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
    this.categoryService.deleteCategory(id).subscribe(resp=>{
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

  newCategory(){
    this.isUpdate = false;
    this.formCategory.reset();
  }

  selectItem(item: any) {
    this.isUpdate = true;
    this.formCategory.controls['catId'].setValue(item.catId);
    this.formCategory.controls['catName'].setValue(item.catName);
  }
}



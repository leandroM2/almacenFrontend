import { Component, OnInit, Renderer2 } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import { ProductModel } from '../model/productos_model';
import { OutcomeDetailService } from '../services/outcome-detail.service';
import { IncomeDetailService } from '../services/income-detail.service';
import { forkJoin } from 'rxjs';
import { KardexService } from '../services/kardex.service';

@Component({
  selector: 'app-grafic',
  templateUrl: './grafic.component.html',
  styleUrls: ['./grafic.component.scss']
})
export class GraficComponent implements OnInit {
  array: { name: string, value: number }[] = [];
  array2: { name: string, value: number }[] = [];
  array3 = this.array.concat(this.array2);
  listproducts: ProductModel[] = [];
  selectproduct= "";

  view: [number, number] = [900, 400];
  view2: [number, number] = [900, 500];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  animations: boolean = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad';
  yAxisLabel2 = 'Precio';
  legendPosition: string = 'below';
  timeline: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  legend: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  colorScheme6 = {
    domain: ['#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  colorScheme2 = "cool";
  colorScheme3 = "vivid";


  single: { name: string, value: number }[] = [];
  single2: { name: string, value: number }[] = [];
  single3: { name: string, value: number }[] = [];
  single4: { name: string, value: number }[] = [];
  single5: { name: string, value: number }[] = [];
  multi: { name: string, series: { name: Date, value: number }[]}[] = [];

  filteredsiuu: any[] = [];

  listaproductosMayor() {
    this.productService.getProducts().subscribe(resp => {
      if (resp) {
        this.single = resp.map(item => ({ name: item.prodDesc, value: item.prodStock })).sort((a, b) => b.value - a.value);;
      }
    });
  }
  listaproductosMenor() {
    this.productService.getProducts().subscribe(resp => {
      if (resp) {
        this.single = resp.map(item => ({ name: item.prodDesc, value: item.prodStock })).sort((a, b) => a.value - b.value);;
      }
    });
  }

  productosStockOrden(event: any) {
    const selectedValue = event.target.value;

    if (selectedValue === 'mayor') {
      this.listaproductosMayor();
    } else if (selectedValue === 'menor') {
      this.listaproductosMenor();
    }
  }

  listaVendidosMayor() {
    this.OutcomeDetailService.getOutcomeDetail().subscribe(resp => {
      if (resp) {
        // Objeto para acumular las cantidades por nombre de producto
        const totalCantidadPorProducto = resp.reduce((acc, item) => {
          if (item.outcomeEstado) {
            // Si ya existe el nombre del producto en el acumulador, sumamos la cantidad
            if (acc[item.productNombre]) {
              acc[item.productNombre] += item.cantidad;
            } else {
              // Si no existe, inicializamos con la cantidad actual
              acc[item.productNombre] = item.cantidad;
            }
          }
          return acc;
        }, {} as { [key: string]: number }); // Inicializamos acc como un objeto vacío con tipos definidos

        // Convertimos el objeto en un arreglo de objetos para el gráfico
        this.single2 = Object.keys(totalCantidadPorProducto).map(nombre => ({
          name: nombre,
          value: totalCantidadPorProducto[nombre]
        })).sort((a, b) => b.value - a.value);

        // Aquí puedes hacer lo que necesites con this.single2, por ejemplo, mostrarlo en la interfaz de usuario
        console.log(this.single2);
      }
    });
  }

  listaVendidosMenor() {
    this.OutcomeDetailService.getOutcomeDetail().subscribe(resp => {
      if (resp) {

        // Objeto para acumular las cantidades por nombre de producto
        const totalCantidadPorProducto = resp.reduce((acc, item) => {
          if (item.outcomeEstado) {
            // Si ya existe el nombre del producto en el acumulador, sumamos la cantidad
            if (acc[item.productNombre]) {
              acc[item.productNombre] += item.cantidad;
            } else {
              // Si no existe, inicializamos con la cantidad actual
              acc[item.productNombre] = item.cantidad;
            }
          }
          return acc;
        }, {} as { [key: string]: number }); // Inicializamos acc como un objeto vacío con tipos definidos

        // Convertimos el objeto en un arreglo de objetos para el gráfico
        this.single2 = Object.keys(totalCantidadPorProducto).map(nombre => ({
          name: nombre,
          value: totalCantidadPorProducto[nombre]
        })).sort((a, b) => a.value - b.value);

        // Aquí puedes hacer lo que necesites con this.single2, por ejemplo, mostrarlo en la interfaz de usuario
        console.log(this.single2);
      }
    });
  }

  listaEntradasMayor() {
    this.IncomeDetailService.getIncomeDetail().subscribe(resp => {
      if (resp) {
        // Objeto para acumular las cantidades por nombre de producto
        const totalCantidadPorProducto = resp.reduce((acc, item) => {
          // Solo sumamos si item.incomeEstado es true
          if (item.incomeEstado) {
            // Si ya existe el nombre del producto en el acumulador, sumamos la cantidad
            if (acc[item.productNombre]) {
              acc[item.productNombre] += item.cantidad;
            } else {
              // Si no existe, inicializamos con la cantidad actual
              acc[item.productNombre] = item.cantidad;
            }
          }
          return acc;
        }, {} as { [key: string]: number }); // Inicializamos acc como un objeto vacío con tipos definidos

        // Convertimos el objeto en un arreglo de objetos para el gráfico
        this.single3 = Object.keys(totalCantidadPorProducto).map(nombre => ({
          name: nombre,
          value: totalCantidadPorProducto[nombre]
        })).sort((a, b) => b.value - a.value);
      }
    });
  }



  listaEntradasMenor() {
    this.IncomeDetailService.getIncomeDetail().subscribe(resp => {
      if (resp) {
        // Objeto para acumular las cantidades por nombre de producto
        const totalCantidadPorProducto = resp.reduce((acc, item) => {
          // Solo sumamos si item.incomeEstado es true
          if (item.incomeEstado) {
            // Si ya existe el nombre del producto en el acumulador, sumamos la cantidad
            if (acc[item.productNombre]) {
              acc[item.productNombre] += item.cantidad;
            } else {
              // Si no existe, inicializamos con la cantidad actual
              acc[item.productNombre] = item.cantidad;
            }
          }
          return acc;
        }, {} as { [key: string]: number }); // Inicializamos acc como un objeto vacío con tipos definidos

        // Convertimos el objeto en un arreglo de objetos para el gráfico
        this.single3 = Object.keys(totalCantidadPorProducto).map(nombre => ({
          name: nombre,
          value: totalCantidadPorProducto[nombre]
        })).sort((a, b) => a.value - b.value);
      }
    });
  }

  productosVentasOrden(event: any) {
    const selectedValue = event.target.value;

    if (selectedValue === 'mayor') {
      this.listaVendidosMayor();
    } else if (selectedValue === 'menor') {
      this.listaVendidosMenor();
    }
  }

  productosEntradasOrden(event: any) {
    const selectedValue = event.target.value;

    if (selectedValue === 'mayor') {
      this.listaEntradasMayor();
    } else if (selectedValue === 'menor') {
      this.listaEntradasMenor();
    }
  }


  sumasa() {
    this.productService.getProducts().subscribe(resp => {
      if (resp) {
        const suma = resp.map(item => item.prodStock);
        const total = suma.reduce((acc, currentValue) => acc + currentValue, 0);
        const stockTotal = document.getElementById("stockTotal") as HTMLSpanElement
        stockTotal.textContent = "" + total
      }
    });
  }


  constructor(private renderer: Renderer2,
    private productService: ProductosService,
    private OutcomeDetailService: OutcomeDetailService,
    private IncomeDetailService: IncomeDetailService,
    private kardexService: KardexService,
  ) {
    this.listaproductosMayor();
    this.listaVendidosMayor();
    this.listaEntradasMayor();
    this.listaproductosCategoria();
    this.listaKardex();
    this.listaproductos();
    this.sumasa();
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
    const element = this.renderer.selectRootElement('.mat-typography', true);
    this.renderer.removeClass(element, 'mat-typography');
    this.listaproductosMayor();
    this.listaVendidosMayor();
    this.listaEntradasMayor();
    this.listaproductosCategoria();
    this.listaproductos();
    this.listaKardex();
    this.sumasa();

  }
  labelFormatting(c: any) {
    return `${(c.label)} `;
  }



  entradasFecha(mes: number, anio: number) {
    this.IncomeDetailService.getIncomeDetail().subscribe(resp => {
      if (resp) {

        const data = resp.map(item => ({
          name: item.productNombre,
          estado: item.incomeEstado,
          value: item.cantidad,
          fecha: new Date(item.incomeFecha)  // Convertir la fecha a objeto Date
        }));

        // Filtrar los datos según el mes y el año seleccionados
        const datosFiltrados = data.filter(item =>
          item.fecha.getMonth() + 1 === mes && item.fecha.getFullYear() === anio
        );

        // Agrupar por nombre de producto y sumar los valores
        const agrupados = datosFiltrados.reduce((acc: any, item) => {
          if (item.estado) {
            if (!acc[item.name]) {
              acc[item.name] = 0;
            }
            acc[item.name] += item.value;
          }
          return acc;
        }, {});

        // Convertir el objeto agrupado a un array de objetos
        const resultado = Object.keys(agrupados).map(key => ({
          name: key,
          value: agrupados[key]
        })).sort((a, b) => b.value - a.value);

        this.single3 = resultado;
      }
    });
  }

  entradasFechaAnio(anio: number) {
    this.IncomeDetailService.getIncomeDetail().subscribe(resp => {
      if (resp) {
        const data = resp.map(item => ({
          name: item.productNombre,
          estado: item.incomeEstado,
          value: item.cantidad,
          fecha: new Date(item.incomeFecha)  // Convertir la fecha a objeto Date
        }));

        // Filtrar los datos según el mes y el año seleccionados
        const datosFiltrados = data.filter(item =>
          item.fecha.getFullYear() === anio
        );

        // Agrupar por nombre de producto y sumar los valores
        const agrupados = datosFiltrados.reduce((acc: any, item) => {
          if (item.estado) {
            if (!acc[item.name]) {
              acc[item.name] = 0;
            }
            acc[item.name] += item.value;
          }
          return acc;
        }, {});

        // Convertir el objeto agrupado a un array de objetos
        const resultado = Object.keys(agrupados).map(key => ({
          name: key,
          value: agrupados[key]
        })).sort((a, b) => b.value - a.value);

        this.single3 = resultado;
      }
    });
  }


  salidasFecha(mes: number, anio: number) {
    this.OutcomeDetailService.getOutcomeDetail().subscribe(resp => {
      if (resp) {
        const data = resp.map(item => ({
          name: item.productNombre,
          estado: item.outcomeEstado,
          value: item.cantidad,
          fecha: new Date(item.outcomeFecha)  // Convertir la fecha a objeto Date
        }));

        // Filtrar los datos según el mes y el año seleccionados
        const datosFiltrados = data.filter(item =>
          item.fecha.getMonth() + 1 === mes && item.fecha.getFullYear() === anio
        );

        // Agrupar por nombre de producto y sumar los valores
        const agrupados = datosFiltrados.reduce((acc: any, item) => {
          if (item.estado) {
            if (!acc[item.name]) {
              acc[item.name] = 0;
            }
            acc[item.name] += item.value;
          }
          return acc;
        }, {});

        // Convertir el objeto agrupado a un array de objetos
        const resultado = Object.keys(agrupados).map(key => ({
          name: key,
          value: agrupados[key]
        })).sort((a, b) => b.value - a.value);

        this.single2 = resultado;
      }
    });
  }

  salidasFechaAnio(anio: number) {
    this.OutcomeDetailService.getOutcomeDetail().subscribe(resp => {
      if (resp) {
        const data = resp.map(item => ({
          name: item.productNombre,
          estado: item.outcomeEstado,
          value: item.cantidad,
          fecha: new Date(item.outcomeFecha)  // Convertir la fecha a objeto Date
        }));

        // Filtrar los datos según el mes y el año seleccionados
        const datosFiltrados = data.filter(item =>
          item.fecha.getFullYear() === anio
        );

        // Agrupar por nombre de producto y sumar los valores
        const agrupados = datosFiltrados.reduce((acc: any, item) => {
          if (item.estado) {
            if (!acc[item.name]) {
              acc[item.name] = 0;
            }
            acc[item.name] += item.value;
          }
          return acc;
        }, {});

        // Convertir el objeto agrupado a un array de objetos
        const resultado = Object.keys(agrupados).map(key => ({
          name: key,
          value: agrupados[key]
        })).sort((a, b) => b.value - a.value);

        this.single2 = resultado;
      }
    });
  }


  filtrarPorFechaEntrada(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const mes = +(form.mes as HTMLSelectElement).value;
    const anio = +(form.anio as HTMLSelectElement).value;
    this.entradasFecha(mes, anio);
  }

  filtrarPorFechaEntradaAnio(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const anio = +(form.anio as HTMLSelectElement).value;
    this.entradasFechaAnio(anio);
  }

  filtrarPorFechaSalida(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const mes = +(form.mes as HTMLSelectElement).value;
    const anio = +(form.anio as HTMLSelectElement).value;
    this.salidasFecha(mes, anio);
  }

  filtrarPorFechaSalidaAnio(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const anio = +(form.anio as HTMLSelectElement).value;
    this.salidasFechaAnio(anio);
  }

  filtrarPorFechaKardex(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const mes = +(form.mes as HTMLSelectElement).value;
    const anio = +(form.anio as HTMLSelectElement).value;
    this.kardexFecha(mes, anio);
  }

  filtrarPorFechaKardexAnio(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const anio = +(form.anio as HTMLSelectElement).value;
    this.kardexFechaAnio(anio);
  }

  prueba() {
    //ejemplo (esperar al kardex)
    forkJoin([
      this.productService.getProducts(),
      this.OutcomeDetailService.getOutcomeDetail()
    ]).subscribe(([productsResp, outcomeDetailResp]) => {
      if (productsResp && outcomeDetailResp) {
        // Procesa el primer arreglo
        const array1 = productsResp.map(item => ({ name: item.prodDesc, value: item.prodStock }))
          .sort((a, b) => b.value - a.value);

        // Procesa el segundo arreglo
        const array2 = outcomeDetailResp.map(item => ({ name: item.productNombre, value: item.cantidad }))
          .sort((a, b) => b.value - a.value);

        // Combina ambos arreglos
        const combinedArray = [...array1, ...array2];

        // Asigna el arreglo combinado a la propiedad de la clase
        this.array = combinedArray;

        console.log(this.array);
      }
    });
  }

  listaproductosCategoria() {
    this.productService.getProducts().subscribe(resp => {
      if (resp) {
        // Objeto para acumular las cantidades por nombre de producto
        const totalCantidadPorCategoria = resp.reduce((acc, item) => {
          // Si ya existe el nombre del producto en el acumulador, sumamos la cantidad
          if (acc[item.catName]) {
            acc[item.catName] += item.prodStock;
          } else {
            // Si no existe, inicializamos con la cantidad actual
            acc[item.catName] = item.prodStock;
          }
          return acc;
        }, {} as { [key: string]: number }); // Inicializamos acc como un objeto vacío con tipos definidos

        // Convertimos el objeto en un arreglo de objetos para el gráfico
        this.single4 = Object.keys(totalCantidadPorCategoria).map(nombre => ({
          name: nombre,
          value: totalCantidadPorCategoria[nombre]
        })).sort((a, b) => b.value - a.value);
      }
    });
  }

  listaKardex() {
    this.kardexService.getKardex().subscribe(resp => {
      if (resp) {
        // Objeto para acumular las cantidades por nombre de producto
        const totalCantidad = resp.reduce((acc, item) => {
          // Solo sumamos si item.estado es true
          if (item.estado) {
            // Inicializamos el tipo de movimiento si no existe en el acumulador
            if (!acc[item.tipoMov]) {
              acc[item.tipoMov] = 0;
            }

            // Iteramos sobre cada detalle en item.detalles
            item.details.forEach(detalle => {
              acc[item.tipoMov] += detalle.cantidad;
            });
          }
          return acc;
        }, {} as { [key: string]: number });

        // Convertimos el objeto en un arreglo de objetos para el gráfico
        this.single5 = Object.keys(totalCantidad).map(nombre => ({
          name: nombre,
          value: totalCantidad[nombre]
        })).sort((a, b) => b.value - a.value);
      }
    });
  }

  kardexFecha(mes: number, anio: number) {
    this.kardexService.getKardex().subscribe(resp => {
      if (resp) {
        const data = resp.map(item => ({
          name: item.tipoMov,
          estado: item.estado,
          value: item.details.reduce((acumulador, detalle) => acumulador + detalle.cantidad, 0),
          fecha: new Date(item.fecha)  // Convertir la fecha a objeto Date
        }));

        // Filtrar los datos según el mes y el año seleccionados
        const datosFiltrados = data.filter(item =>
          item.fecha.getMonth() + 1 === mes && item.fecha.getFullYear() === anio
        );

        // Agrupar por nombre de producto y sumar los valores
        const agrupados = datosFiltrados.reduce((acc: any, item) => {
          if (item.estado) {
            if (!acc[item.name]) {
              acc[item.name] = 0;
            }
            acc[item.name] += item.value;
          }
          return acc;
        }, {});

        // Convertir el objeto agrupado a un array de objetos
        const resultado = Object.keys(agrupados).map(key => ({
          name: key,
          value: agrupados[key]
        })).sort((a, b) => b.value - a.value);

        this.single5 = resultado;
      }
    });
  }

  kardexFechaAnio(anio: number) {
    this.kardexService.getKardex().subscribe(resp => {
      if (resp) {
        const data = resp.map(item => ({
          name: item.tipoMov,
          estado: item.estado,
          value: item.details.reduce((acumulador, detalle) => acumulador + detalle.cantidad, 0),
          fecha: new Date(item.fecha)
        }));

        // Filtrar los datos según el mes y el año seleccionados
        const datosFiltrados = data.filter(item =>
          item.fecha.getFullYear() === anio
        );

        // Agrupar por nombre de producto y sumar los valores
        const agrupados = datosFiltrados.reduce((acc: any, item) => {
          if (item.estado) {
            if (!acc[item.name]) {
              acc[item.name] = 0;
            }
            acc[item.name] += item.value;
          }
          return acc;
        }, {});

        // Convertir el objeto agrupado a un array de objetos
        const resultado = Object.keys(agrupados).map(key => ({
          name: key,
          value: agrupados[key]
        })).sort((a, b) => b.value - a.value);

        this.single5 = resultado;
      }
    });
  }

  // productgrafic(product: string) {
  //   this.kardexService.getKardex().subscribe(resp => {
  //     if (resp) {

  //       const data = {
  //         name: product,
  //         series: resp.filter(item => item.detalles.find(item => item.producto === product)).map(item =>
  //           item.fecha,
  //         ),
  //       };
  //       // const data = resp.map(item => ({
  //       // }));

  //       //   item.det
  //       //   name: item.fecha,
  //       //   value: item.detalles.find(detalle => detalle.producto === product)?.saldo || 0
  //       // }))

  //       console.log(data);
  //     }
  //   });
  // }



  productgrafic2(product: any) {
    this.kardexService.getKardex().subscribe(resp => {
      if (resp) {
        this.selectproduct = product;
        const filteredData = resp.filter(item => item.estado === true && item.details.some(detalle => detalle.producto === product))
          .filter(item => item.tipoMov === "Entrada")
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  
        const data = [{
          name: product,
          series: filteredData.map(item => ({
            name: item.fecha,  // Asegúrate de convertir `item.fecha` a un objeto Date
            value: item.details.find(detalle => detalle.producto === product)?.precioVenta || 0
          }))
        }];

        const data2 = [{
          name: product,
          series: filteredData.map(item => ({
            name: item.fecha,  // Asegúrate de convertir `item.fecha` a un objeto Date
            value: 0
          }))
        }];

        console.log(data)
        this.multi = data;
      }
    });
  }

  listaproductos() {
    this.productService.getProducts().subscribe(resp => {
      if (resp) {
        this.listproducts = resp.sort((a,b)=>a.prodDesc.localeCompare(b.prodDesc));
      }
    });
  }

}
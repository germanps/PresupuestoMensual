//variables
const agregarPresupuesto = document.getElementById('agregarPresupuesto');
const agregarGasto = document.getElementById('agregarGasto');
let presupuesto;//Lo introduce el usuario (sin el restante)
let presupuestoTotal;
let gasto;

//listeners
window.addEventListener('DOMContentLoaded', cargaDatosInicio, false);
agregarPresupuesto.addEventListener('click', agregaPresupuesto, false);
agregarGasto.addEventListener('click', agregaGasto, false);


//clases
class Presupuesto {
    constructor(presupuesto, restante){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(restante);
    }
    // Resta el presupuesto
    restaGasto(cantidad){
      return this.restante -= Number(cantidad);
    }
}

class Interfaz {
    //inicializa presupuesto
    imprimirMensaje(mensaje, tipo){
      const nodoMensaje = document.getElementById('mensaje');
      nodoMensaje.classList.add('mensaje');
      if (tipo == 'error') {
         nodoMensaje.classList.add('texto-danger');
      }else{
         nodoMensaje.classList.add('texto-success');
      }
      nodoMensaje.innerText = mensaje;
      setTimeout(function(){
         nodoMensaje.innerText = '';
         nodoMensaje.className= 'mensaje';
      }, 3000);
   }

   imprimirGastoLista(nombre, cantidad){
     const listado = document.querySelector('#gastos .list-group');
     const listItem = document.createElement('li');
     listItem.className = 'gastos-item';
     listItem.innerHTML = `
              <span class="nombre">${nombre}</span>
              <span class="cantidad">${cantidad}</span>
          `;
      listado.appendChild(listItem);
      console.log(listItem);
   }
   imprimirRestante(){
     const restante = document.getElementById('restante');
     restante.innerHTML = presupuestoTotal.restante;    
   }
   insertarGastoLS(nombreGasto, cantidadGasto){
     const gasto = {
       nombre: nombreGasto,
       gasto: cantidadGasto
     }
     guardarGastoLS(gasto);
   }
}

//funciones
function cargaDatosInicio(){
  //Cargar presupuesto del localstorage
   const compruebaPresuLS = obtenerPresuLocalStorage();
   const compruebaGastosLS = obtenerGastosLocalStorage();
   console.log(compruebaPresuLS);
   console.log(compruebaGastosLS);
   if(compruebaPresuLS){
      const total = document.getElementById('total');
      const restante = document.getElementById('restante');
      total.innerHTML = compruebaPresuLS.presupuesto;
      restante.innerHTML = compruebaPresuLS.restante;
   }else{
     return false;
   }
   //Cargar gastos del localStorage
   leerLocalStorageGastos();
}
function agregaPresupuesto(e){
   let datosLS = obtenerPresuLocalStorage();
   if (!datosLS) {
      //Si no hay datos en el LS hacemos la mandanga
      if (presupuesto == '' || presupuesto == null) {
         //Pedimos el presupuesto al usuario
         presupuesto = prompt('Introduce el presupuesto del mes');
         compruebaDatos();
      }

  }else{
      //Si hay datos en el LS
      const ui = new Interfaz();
      ui.imprimirMensaje('Ya tienes un presupuesto definido!', 'error');
      return false;
  }
   
}
function agregaGasto(e){
  const nombreGasto = document.getElementById('nombre').value;
  const cantidadGasto = document.getElementById('cantidad').value;
  const compruebaPresuLS = obtenerPresuLocalStorage();
  //Comprobamos que hay un presupuesto insertado
  if (compruebaPresuLS) {  
    if (nombreGasto !== '' || cantidadGasto !== '') {
      if (!/^([0-9])*$/.test(cantidadGasto)) {
        alert('Cantidad erronea, prueba de nuevo');
      }else{
        //Todo OK => hacemos la mandanga
        //console.log(`nombre:${nombreGasto} cantidad:${cantidadGasto}`);
        //Obtenemos datos del LS
        let localS = obtenerPresuLocalStorage();
        //Reinstanciamos el presupuesto total con el nuevo restante
        presupuestoTotal = new Presupuesto(localS.presupuesto, localS.restante);
        //Restamos del presupuesto
        presupuestoTotal.restaGasto(cantidadGasto);
        //Volvemos a meter el objeto al local storage
        localStorage.setItem('datosLS', JSON.stringify(presupuestoTotal));
        console.log(presupuestoTotal);
        const ui = new Interfaz();
        ui.imprimirGastoLista(nombreGasto, cantidadGasto);
        ui.imprimirRestante();
        ui.insertarGastoLS(nombreGasto, cantidadGasto);
      }
    }

  }else{
    //Si no hay presupuesto imprimimos un mensaje de error
    const ui = new Interfaz();
    ui.imprimirMensaje('No hay presupuesto!', 'error');
  }
}
function compruebaDatos(e){
   if (!/^([0-9])*$/.test(presupuesto) || presupuesto === '') {
      //Error de entrada de datos por el prompt
      const ui = new Interfaz();
      ui.imprimirMensaje('Datos erroneos, prueba de nuevo!', 'error');
      //Reseteamos el presupuesto a blanco
      presupuesto = '';

   }else{
      //Todo ok
      //Creamos la instacia del presupuesto(con el restante == al presupuesto)
      presupuestoTotal = new Presupuesto(presupuesto, presupuesto);
      //Guardamos el objeto en el Local Storage(como JSON)
      localStorage.setItem('datosLS', JSON.stringify(presupuestoTotal));
      //Instanciamos una vista para el mensaje
      const ui = new Interfaz();
      ui.imprimirMensaje('Presupuesto guardado!', 'success');
      cargaDatosInicio();//imprimimos en el DOM
   }
}

function obtenerPresuLocalStorage(){
   let localS;
   if (localStorage.getItem('datosLS') === null) {
      localS = false;
   }else{
      localS = JSON.parse(localStorage.getItem('datosLS'));
   }
   return localS;
}

function obtenerGastosLocalStorage(){
  let gastosLS;
  //Comprobamos si tenemos items en el LS
  if(localStorage.getItem('gastos') === null){
    //si no hay gastos aún iniciamos un array vacio
    gastosLS = [];
  }else{
    //recuperamos el localstorage
    gastosLS = JSON.parse(localStorage.getItem('gastos'));
  }
  return gastosLS;
}
function leerLocalStorageGastos(){
  let localS;
  localS = obtenerGastosLocalStorage();
  //Foreach con el html de los gastos


}
function guardarGastoLS(gasto){
  let gastos;
  //Obtenemos los gastos que ya estan en el LS
  gastos = obtenerGastosLocalStorage();
  //agregamos el nuevo gasto al array
  gastos.push(gasto);
  localStorage.setItem('gastos', JSON.stringify(gastos));
  console.log(gastos);
}
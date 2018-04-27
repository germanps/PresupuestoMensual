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
}

//funciones
function cargaDatosInicio(){
   let compruebaLS = obtenerLocalStorage();
   console.log(compruebaLS);
   if(compruebaLS){
      const total = document.getElementById('total');
      const restante = document.getElementById('restante');
      total.innerHTML = compruebaLS.presupuesto;
      restante.innerHTML = compruebaLS.restante;
   }else{
     return false;
   }
}
function agregaPresupuesto(e){
   let datosLS = obtenerLocalStorage();
   if (!datosLS) {
      //Si no hay datos en el LS hacemos la mandanga
      if (presupuesto == '' || presupuesto == null) {
         //Pedimos el presupuesto al usuario
         presupuesto = prompt('Introduce el presupuesto del mes');
         compruebaDatos();
      }else{
         //Mostrar un error
         console.log(presupuesto);
         console.log('El presupuesto ya ha sido definido anteriormente');
      }
   }else{
      //Si hay datos en el LS
      alert('Ya tienes un presupuesto guardado');
      return false;
   }
   
}
function agregaGasto(e){
  const nombreGasto = document.getElementById('nombre').value;
  const cantidadGasto = document.getElementById('cantidad').value;
  if (nombreGasto !== '' || cantidadGasto !== '') {
    if (!/^([0-9])*$/.test(cantidadGasto)) {
      alert('Cantidad erronea, prueba de nuevo');
    }else{
      //Todo OK => hacemos la mandanga
      console.log(`nombre:${nombreGasto} cantidad:${cantidadGasto}`);
      //Obtenemos datos del LS
      let localS = obtenerLocalStorage();
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
    }
    
  }else{
    console.log('datos erroneos');
  }
}
function compruebaDatos(e){
   if (!/^([0-9])*$/.test(presupuesto) || presupuesto === '') {
      //Error de entrada de datos por el prompt
      alert(`Este presupuesto es incorrecto: ${presupuesto}, prueba de nuevo`);
      //Reseteamos el presupuesto a blanco
      presupuesto = '';
      agregaPresupuesto();//Volvemos a pedir el presupuesto
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

function obtenerLocalStorage(){
   let localS;
   if (localStorage.getItem('datosLS') === null) {
      localS = false;
   }else{
      localS = JSON.parse(localStorage.getItem('datosLS'));
   }
   return localS;
}
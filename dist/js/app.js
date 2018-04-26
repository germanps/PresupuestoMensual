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
   constructor(presupuesto){
      this.presupuesto = Number(presupuesto);
      this.restante = Number(presupuesto);
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
}

//funciones
function cargaDatosInicio(){
   let compruebaLS = obtenerLocalStorage();
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

}
function compruebaDatos(e){
   if (!/^([0-9])*$/.test(presupuesto)) {
      //Error de entrada de datos por el prompt
      alert(`Este presupuesto es incorrecto: ${presupuesto}, prueba de nuevo`);
      //Reseteamos el presupuesto a blanco
      presupuesto = '';
      agregaPresupuesto();//Volvemos a pedir el presupuesto
   }else{
      //Todo ok
      //Creamos la instacia del presupuesto(con el restante == al presupuesto)
      presupuestoTotal = new Presupuesto(presupuesto);
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
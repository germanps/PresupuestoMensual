/*** Variables ***/
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var browserSync = require('browser-sync').create();
var cssnested = require('postcss-nested');
var mixins = require('postcss-mixins');
var addImport = require('postcss-import');
//var autoprefixer = require('autoprefixer');


/*** Tareas ***/
// Servidor de desarrollo
gulp.task('serve', function(){
	browserSync.init({
		server: {
			baseDir: './dist' //donde estarán los ficheros finales de la app
		}
	})
});

// Procesado de CSS
gulp.task('css', function(){

	//Array de plugins de posctcss que utilizaremos(el orden es importante)
	var processors = [
		//separación de ficheros con import
		addImport(),
		//mixins
		mixins(),
		//prefijos para navegadores con mas del 5% de uso y ie8 en adelante
		//autoprefixer({ browsers: ['> 5%', 'ie 8']}), Lo incluimos en cssnext
		//anidamiento de selectores(tipo sass o less)
		cssnested,
		//cssnext
		cssnext({ browsers: ['> 5%', 'ie 8']})
	];

	return gulp.src('./src/main.css') //ficheros final de producción
		.pipe(postcss(processors)) //pasamos el array con los plugins
		.pipe(gulp.dest('./dist/css')) //destino ficheros de los plugins
		.pipe(browserSync.stream()); //auto-recarga del navegador
});

// Watch de tareas (cambios)
gulp.task('watch', function(){
	gulp.watch('./src/*.css', ['css']) //carpeta a 'vigilar', array con las tareas que queremos que se ejecuten
	gulp.watch('./dist/*.html').on('change', browserSync.reload) //vigilar cambios en el html
})


// Unir todas las tareas
gulp.task('default', ['watch', 'serve']);
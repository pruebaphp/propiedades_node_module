import path from 'path'

export default {
    mode: 'development',
    entry:{
        mapa: './src/js/mapa.js',
        agregarImagen : './src/js/agregarImagen.js',
        mostrarMapa: './src/js/mostrarMapa.js',
        mapaInicio: './src/js/mapaInicio.js',
        cambiarEstado: './src/js/cambiarEstado.js',

    },
    output:{
        filename: '[name].js',
        //esto es una ruta absoluta EJMP: http://localhost:3000/public/js o http://google.com/public/js
        path: path.resolve('public/js')
    }
}
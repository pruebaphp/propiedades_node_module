//esto lo que hace es extraer la dependencia que hemos instalado, va ir a node_modules y importar el archivo
//const express = require('express'); //CommonJS
import express from 'express' //Enmascripts modules
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

//crear la app

const app = express();

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended:true}))

//Habilitar Cookie Parser
app.use(cookieParser())

//Habilitar el CSRF
app.use(csrf({cookie:true}))

//Conexion a la base de datos

try {
    //va tratar de autenticarse a la base de datos con el authenticate() es un metodo de sequalize ;
    await db.authenticate();
    //genera las tablas de la db si no existen 
    db.sync();
    console.log('Conexion a la base de datos exitosa.')
} catch (error) {
    console.log(error);
}

//Habilitar pug

//set sirve para asignar configuraciones
app.set('view engine','pug'); //especificando el tipo de engine que es pug
app.set('views','./views'); // especificando que carpeta será la de vistas


//Carpeta pública
app.use(express.static('public'))



//Routing
//use hace buscar,escanear todas las rutas que inician con diagonal del archivo usuarioRoutes
app.use('/',appRoutes)
app.use('/auth',usuarioRoutes);
app.use('/',propiedadesRoutes);
app.use('/api', apiRoutes);





//Definir un puerto y arrancar el proyecto

const port = process.env.PORT || 3000;
//esto significa "escucha o conectate en este puerto"
app.listen(port,()=>{
    console.log(`El servidor está funcionando en el puerto ${port}`);
})
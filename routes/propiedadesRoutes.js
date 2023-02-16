import express from 'express';
import { body } from "express-validator";
import { admin,crear,guardar,agregarImagen,almacenarImagen,editar,guardarCambios,eliminar,cambiarEstado,mostrarPropiedad, enviarMensaje,verMensajes } from "../controllers/propiedadesController.js";
import protegerRuta from '../middleware/protegerRuta.js'
import upload from '../middleware/subirImagen.js'
import identificarUsuario from '../middleware/identificarUsuario.js';

const router = express.Router();

router.get('/mis-propiedades',protegerRuta, admin) //esto lo que hace es cuando el usuario se dirige a esa url, luego se va a la fnt protegerRuta, luego a la funcion admin
router.get('/propiedades/crear',protegerRuta, crear)
router.post('/propiedades/crear',

    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción no puede ir vacía')
        .isLength({max:200}).withMessage('La descripción es muy larga'),

    body('categoria').isNumeric().withMessage('Selecciona una categoría'),
    body('precio').isNumeric().withMessage('Selecciona un rango de Precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de Estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('calle').notEmpty().withMessage('Ubica la propiedad en el Mapa'),

    protegerRuta,

    guardar

)

router.get('/propiedades/agregar-imagen/:idPropiedad',protegerRuta,agregarImagen)
router.post('/propiedades/agregar-imagen/:idPropiedad',protegerRuta,upload.single('imagen'),almacenarImagen)
router.get('/propiedades/editar/:id',protegerRuta,editar)
router.post('/propiedades/editar/:id',

    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción no puede ir vacía')
        .isLength({max:200}).withMessage('La descripción es muy larga'),

    body('categoria').isNumeric().withMessage('Selecciona una categoría'),
    body('precio').isNumeric().withMessage('Selecciona un rango de Precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de Estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('calle').notEmpty().withMessage('Ubica la propiedad en el Mapa'),

    protegerRuta,

    guardarCambios

)

router.post('/propiedades/eliminar/:id',protegerRuta,eliminar);

router.put('/propiedades/:id',protegerRuta,cambiarEstado)

//Area pública

router.get('/propiedad/:id',identificarUsuario,mostrarPropiedad)

//

router.post('/propiedad/:id',
identificarUsuario,
body('mensaje').isLength({min:10}).withMessage('El mensaje no puede ir vacio o es muy corto'),
enviarMensaje);

router.get('/mensajes/:id',protegerRuta,verMensajes)


export default router
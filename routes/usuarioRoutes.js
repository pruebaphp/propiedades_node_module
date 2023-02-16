import express from "express";
import { formularioLogin,formularioRegistro,formularioOlvidePassword,registrar,confirmar,resetPassword,comprobarToken,nuevoPassword , validarUsuario, cerrarSesion} from "../controllers/usuarioController.js";

const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login',validarUsuario);

//Cerrar sesion
router.post('/cerrar-sesion',cerrarSesion);

router.get('/registro',formularioRegistro);
router.post('/registro',registrar);
//:token se lee como una variable es un routing dinámico
router.get('/confirmar/:token',confirmar);
router.get('/olvide-password',formularioOlvidePassword);
router.post('/olvide-password',resetPassword)

//Almacena el nuevo password
router.get('/olvide-password/:token',comprobarToken);
router.post('/olvide-password/:token',nuevoPassword);





export default router

/*router.route('/')
    .get(function(request,response){
        //.send hace mostrar la información
        //.json para enviar un json
        response.json({msg: ' Hola mundo en express'});
    })

    .post(function(request,response){
        response.json({msg: 'Respuesta de tipo POST'});
    })*/


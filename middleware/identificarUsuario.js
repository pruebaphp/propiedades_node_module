import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const identificarUsuario = async(request,response,next)=>{
    //Identificar si hay un token;
    const {_token} = request.cookies

    if(!_token){
        request.usuario = null;
        return next();
    }
    //Comprobar el token

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        //obtener de la base de datos la información del usuario, pero con el eliminarPassword que es un scope, esto lo que hace es traernos solamente cierta información
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        if(usuario){
            request.usuario = usuario;
        }else{
            return response.redirect('auth/login')
        }
        return next();
    } catch (error) {
        console.log(error)
        return response.clearCookie('_token').redirect('auth/login')
    }

}

export default identificarUsuario
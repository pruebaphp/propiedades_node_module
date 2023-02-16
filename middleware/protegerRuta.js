import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

const protegerRuta = async (request,response,next)=>{

    //Verificar si hay un token
    const { _token } = request.cookies
    if(!_token){
        return response.redirect('/auth/login')
    }
    //Comprobar el token
    try {
         //esto sirve para verificar el token que esta almacenado en cache, y se le debe pasar la palabra secreta con la que se creó   
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        //obtener de la base de datos la información del usuario, pero con el eliminarPassword que es un scope, esto lo que hace es traernos solamente cierta información
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
       // const usuario = await Usuario.findOne({where:{id:decoded.id}})

       //Almacenar el usuario al Request
       if(usuario){
        //almacenamos este usuario para que esté disponible en otro request
        request.usuario = usuario;
       }else{
        return response.redirect('/auth/login')
       }

       // console.log(request.usuario.dataValues);

        //console.log(decoded)

       //Esto para que se vaya al siguiente middelware clase 99: Eliminar el password de la respuesta e la ocnsulta
        return next();
    } catch (error) {
        //si no es un token valido, limpia el token de la cache y nos lleva al login
        return response.clearCookie('_token').redirect('/auth/login')
    }

  
}

export default protegerRuta
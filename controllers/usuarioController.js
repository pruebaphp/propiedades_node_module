import {check,validationResult}  from 'express-validator';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js'
import { generarId,generarJWT } from "../helpers/tokens.js";
import { emailRegistro,emailOlvidePassword } from "../helpers/emails.js";



const formularioLogin = (request,response)=>{
    response.render('auth/login',{
        pagina: 'Iniciar Sesión',
        csrfToken:request.csrfToken(),
    })
}

const formularioRegistro = (request,response)=>{

    console.log()

    response.render('auth/registro',{
        pagina: 'Crear cuenta',
        csrfToken:request.csrfToken(),
    })
}
//como vamos a interactuar con la base de datos, volvemos esta funcion a async await
const registrar = async(request,response)=>{
    //Validación
    const {nombre,email,password} = request.body
    //.run() para llamar la funcion y ejecutarla
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(request)
    await check('email').isEmail().withMessage('Eso no parece un email').run(request)
    await check('password').isLength({min:6}).withMessage('El password debe ser de almenos 6 caracteres').run(request);
    await check('repetir_password').equals(request.body.password).withMessage('Los password no son iguales').run(request);

    
    //Verificar que el resultado esté vacio
   // return response.json(resultado.array());
   //console.log(request.body)

   let resultado = validationResult(request)

    if(!resultado.isEmpty()){
        
        return  response.render('auth/registro',{
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: request.body.nombre,
                email: request.body.email,
            },
            csrfToken:request.csrfToken(),
        })
    }


        //Verificar que el usuario no esté duplicado
     const existeEmail = await Usuario.findOne({where:{email:email}})  

        if(existeEmail){
            return  response.render('auth/registro',{
                pagina: 'Crear cuenta',
                errores: [{msg:"El email ya existe"}],
                usuario: {
                    nombre: request.body.nombre,
                    email: request.body.email,
                },
                csrfToken:request.csrfToken(),
            })
        }


  //  return console.log(existeEmail);
    
   // const usuario = await Usuario.create(request.body)
//Almacenar usuario
   const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token:generarId(),
   })

   //Envia email de cnfirmación
   emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
   })


   response.render('templates/mensaje',{
    pagina: 'Cuenta creada correctamente',
    mensaje: `Hemos enviado un Email de Confirmación a ${usuario.email}, presiona el enlace`,
    csrfToken:request.csrfToken(),
    
})
       
    //response.json(usuario);

}

const confirmar = async(request,response)=>{
    //aplicando destructuring
    const {token} = request.params;
    console.log(token); 



    //Verificar si el token es valido

    const usuario = await Usuario.findOne({where:{token}})

    if(!usuario){
        response.render('templates/confirmar-cuenta',{
            pagina:'Error al confirmar tu cuenta',
            error:true,
            mensaje:'Hubo un error al confirmar tu cuenta, intenta de nuevo'
        })
        return;
    }

    
    //confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;

    await usuario.save();

    response.render('templates/confirmar-cuenta',{
        pagina:'Cuenta confirmada correctamente',
        error:false,
        mensaje:'Se confirmó tu cuenta correctamente, bienvenido(a) a BienesRaices'
    })


    

    
    
}


const formularioOlvidePassword = (request,response)=>{
    response.render('auth/olvide-password',{
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken:request.csrfToken(),
    })
}

const resetPassword = async(request,response)=>{
   await check('email').isEmail().withMessage('Eso no parece un email').run(request);

   let resultado = validationResult(request);

   if(!resultado.isEmpty()){
        response.render('auth/olvide-password',{
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken:request.csrfToken(),
            errores: resultado.array(),
            usuario:{
                email: request.body.email,
            }
        })
       
         return;
   }

   //validar si existe el email
   const {email} = request.body

   const usuario = await Usuario.findOne({where:{email}})

   if(!usuario){
       return response.render('auth/olvide-password',{
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken:request.csrfToken(),
            errores: [{msg:'El correo ingresado no pertenece a BienesRaices'}],
            usuario:{
                email: request.body.email,
            }
            
        })
   }

   if(usuario.confirmado!=1){
    return response.render('auth/olvide-password',{
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken:request.csrfToken(),
        errores: [{msg:'Esta cuenta aún no está confirmada.'}],
        usuario:{
            email: request.body.email,
        }
        
    })
   }

   //generar un token y enviar el email
   usuario.token = generarId();
   await usuario.save();

   //enviar el email

   emailOlvidePassword({
    nombre:usuario.nombre,
    email:usuario.email,
    token:usuario.token,
   })

   response.render('templates/mensaje',{
        pagina: 'Correo enviado correctamente',
        mensaje: `El correo de recuperación, se envió correctamente a ${usuario.email}`
   })
   

}

const comprobarToken = async(request,response)=>{

    const {token} = (request.params);
    
    let usuario = await Usuario.findOne({where:{token}});


    if(!usuario){
      return  response.render('templates/confirmar-cuenta',{
            pagina: 'Error al confirmar cuenta',
            mensaje: 'No se pudo validar tu cuenta, intenta en otro momento.',
            error:true,
        })
    }

    if(usuario.confirmado!=1){
        return  response.render('templates/confirmar-cuenta',{
              pagina: 'Cuenta inactiva',
              mensaje: 'Aún no has confirmado el correo de registro',
              error:true,
          })
      }

    //mostrar formulario para modificar el password
    response.render('auth/reset-password',{
        csrfToken:request.csrfToken(),
        pagina: 'Actualiza tu password',
    })

}

const nuevoPassword = async(request,response)=>{

    //validar el password

    await check('password').isLength({min:6}).withMessage('El password debe ser al menos de 6 caracteres').run(request);
    await check('repetir_password').equals(request.body.password).withMessage('Los passwords no son iguales').run(request);
    let resultado = validationResult(request);

    if(!resultado.isEmpty()){
        return response.render('auth/reset-password',{
            pagina: 'Actualiza tu password',
            csrfToken:request.csrfToken(),
            errores: resultado.array(),

        })
    }

    //Identificar quien hace el cambio

    const {token} = request.params;
    const {password} = request.body;

    let usuario = await Usuario.findOne({where:{token}})
    
    //hashear el nuevo password

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password,salt);
    usuario.token = null;

    await usuario.save();

    response.render('templates/confirmar-cuenta',{
        pagina: 'Password Reestablecido',
        mensaje:'El password se cambió correctamente',
        error:false,
    })

}

const validarUsuario = async (request,response)=>{

    const {email,password} = request.body;

    await check('email').isEmail().withMessage('Eso no parece un email').run(request);
    await check('password').notEmpty().withMessage('Debes ingresar una contraseña').run(request);

    let resultado = validationResult(request);
//validando que sean correctos los campos
    if(!resultado.isEmpty()){
        return  response.render('auth/login',{
             csrfToken:request.csrfToken(),
             pagina:'Inicia Sesión',
             errores: resultado.array(),
             email,
         })
     }

    
    //validar si existe el usuario
    
    
    let usuario = await Usuario.findOne({where:{email}});

    if(!usuario){
       return  response.render('auth/login',{
            csrfToken:request.csrfToken(),
            pagina:'Inicia Sesión',
            errores: [{msg:'Email o contraseña incorrectos'}],
            email,
        })
    }

    if(usuario.confirmado!=1){
        return  response.render('auth/login',{
            csrfToken:request.csrfToken(),
            pagina:'Inicia Sesión',
            errores: [{msg:'Esta cuenta aún no ha sido confirmada'}],
            email,
        })
    }

    if(!usuario.verificarPasword(password)){
        return  response.render('auth/login',{
            csrfToken:request.csrfToken(),
            pagina:'Inicia Sesión',
            errores: [{msg:'El password es incorrecto'}],
            email,
        })
   
    }

    //Autenticar un usuario
//el .sign sirve para crear un json web token
const token = generarJWT({id:usuario.id,nombre:usuario.nombre});

//almacenar en un cookie

return response.cookie('_token',token,{
    httpOnly:true,
 //   secure: true,
}).redirect('/mis-propiedades')

//console.log(usuario.id)
//console.log(token);

    
}

const cerrarSesion = (request,response)=>{
    return response.clearCookie('_token').status(200).redirect('/auth/login');
}

export{
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    validarUsuario,
    cerrarSesion,

}
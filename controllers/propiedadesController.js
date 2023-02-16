import {unlink} from 'node:fs/promises' //esta es una dependencia interna de node
import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad, Usuario,Mensaje} from '../models/index.js'


import { esVendedor,formatearFecha } from '../helpers/index.js'


const admin = async (request,response)=>{

    //Leer QueryString /mis-propiedades?pagina=1&orden=DESC
   // console.log(request.query)
   const {pagina:paginaActual} = request.query;

    console.log(paginaActual);

    const expresionRegular = /^[0-9]$/

    if(!expresionRegular.test(paginaActual)){
        return response.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const {id} = request.usuario;

        //Límites y Offset para el paginador;

        const limite = 5;
        const offset = ((paginaActual*limite)-limite);

        const [propiedades,total] = await Promise.all([
            Propiedad.findAll({
                limit: limite, //esto es cuantos registros nos va traer la consulta
                offset, //esto es la cantidad de registros que se va saltar de la db
                where:{
                    usuarioId: id,
                  
                },
                include:[
                    {model: Categoria, as:'categoria' },
                    {model: Precio, as:'precio' },
                    {model: Mensaje, as: 'mensajes'}
                   
                ]
            })
            ,

            Propiedad.count({
                where:{
                        usuarioId:id,
                        publicado: 1,
                    }
                })
        ])
        

    
     
    
        response.render('propiedades/admin',{
            pagina:'Mis propiedades',
            propiedades,
            csrfToken: request.csrfToken(),
            paginas: Math.ceil(total/limite),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limite,
            registrosActuales:propiedades.length,
        })
    } catch (error) {
        
    }




}
//formulario para crear una nueva propiedad
const crear = async (request,response)=>{

    //Consultar modelo de precios y categorias

   const [categorias,precios] = await Promise.all([
            
            Categoria.findAll(),
            Precio.findAll(),
    ])



    response.render('propiedades/crear',{
        pagina:'Crear propiedad',
        barra:true,
        categorias:categorias,
        precios:precios,
        csrfToken: request.csrfToken(),
        datos:{}
    })

    
}


const guardar = async(request,response)=>{
    //Validacion
    

    const [categorias,precios] = await Promise.all([Categoria.findAll(),Precio.findAll()])

    let resultado = validationResult(request);


  //  console.log(request.body);


    if(!resultado.isEmpty()){
        return response.render('propiedades/crear',{
            pagina:'Crear Propiedad',
            barra:true,
            csrfToken: request.csrfToken(),
            errores: resultado.array(),
            categorias,
            precios,
            datos:request.body,
            NumeroCategoria:request.body.categoria,

        })
    }

    //Crear un registro
    const {titulo,descripcion,categoria,precio,habitaciones,estacionamiento,wc,calle,lat,lng} = request.body

    const { id: usuarioId } = request.usuario;



    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            img: '',
            precioId: precio ,
            categoriaId: categoria,
            usuarioId,
            
        })

        const {id} = propiedadGuardada;

        response.redirect(`/propiedades/agregar-imagen/${id}`)
        
    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (request,response)=>{
    //response.send('Agregando imagen');

    const {idPropiedad} = request.params;

   // console.log(idPropiedad);

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(idPropiedad)

    // console.log(request.usuario.id);
    // console.log(propiedad.usuarioId);

    if(!propiedad){
        return response.redirect('/mis-propiedades')
    }

    if(propiedad.publicado){
        return response.redirect('/mis-propiedades')
    }


    if(request.usuario.id!=propiedad.usuarioId){
        return response.redirect('/mis-propiedades')
    }


    //Validar que la propiedad no esté publicada


    //Validar que la propiedad pertenece a quien visita esta página


   response.render('propiedades/agregar-imagen',{
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        propiedad,
        csrfToken: request.csrfToken(),
    })

}

const almacenarImagen = async (request,response)=>{
    const {idPropiedad} = request.params;

   // console.log(idPropiedad);

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(idPropiedad)

    // console.log(request.usuario.id);
    // console.log(propiedad.usuarioId);

    if(!propiedad){
        return response.redirect('/mis-propiedades')
    }

    if(propiedad.publicado){
        return response.redirect('/mis-propiedades')
    }


    if(request.usuario.id!=propiedad.usuarioId){
        return response.redirect('/mis-propiedades')
    }

    try {
      //  console.log(request.file.filename);
      //  console.log(propiedad);

    

        //Almacenar la imagen y publicar la propiedad 
            //el request.file es de la libreria multer

          propiedad.img = request.file.filename;

          propiedad.publicado = 1 ;

         await propiedad.save();

         response.redirect('/mis-propiedades') // o tambien se puede poner next()

        
    } catch (error) {
        console.log(error);
    }

}

const editar = async (request,response)=>{
    const {id:idPropiedad} = request.params;
    const idUsuario =  request.usuario.id;
    const propiedad = await Propiedad.findByPk(idPropiedad);

    

    if(!propiedad || propiedad.usuarioId !== idUsuario){
       return response.redirect('/mis-propiedades')
    }

    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    ])

    response.render('propiedades/editar',{
        csrfToken: request.csrfToken(),
        pagina: 'Edita la propiedad',
        categorias,
        precios,
        datos: propiedad,
    })




}

const guardarCambios = async (request,response)=>{

    //Verificar la validacion

    let resultado = validationResult(request);

    console.log(request.body);

    if(!resultado.isEmpty()){
        const [categorias,precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll(),
        ])
    
        return response.render('propiedades/editar',{
            pagina: 'Edita la propiedad',
            csrfToken: request.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: request.body,
        })

       
    }

    const {id:idPropiedad} = request.params;
    const idUsuario =  request.usuario.id;
    const propiedad = await Propiedad.findByPk(idPropiedad);

    

    if(!propiedad || propiedad.usuarioId !== idUsuario){
       return response.redirect('/mis-propiedades')
    }

    //Reescribir el objeto y actualizarlo

    try {

        const {titulo,descripcion,categoria,precio,habitaciones,estacionamiento,wc,calle,lat,lng} = request.body

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId:precio,
            categoriaId:categoria,
            
        })

       await propiedad.save();
        response.redirect('/mis-propiedades');
        
    } catch (error) {
        console.log(error)
    }




}

const eliminar = async (request,response)=>{
   
    const {id} = request.params;

    // console.log(idPropiedad);
 
     //Validar que la propiedad exista
     const propiedad = await Propiedad.findByPk(id)
 
     // console.log(request.usuario.id);
     // console.log(propiedad.usuarioId);
   //  console.log(propiedad);
 
     if(!propiedad){
         return response.redirect('/mis-propiedades')
     }

     if(request.usuario.id!=propiedad.usuarioId){
        return response.redirect('/mis-propiedades')
    }

    //Eliminar la imagen
//se debe colocar directamente public , no funciona si salimos como ../public
    await unlink(`public/uploads/${propiedad.img}`)

    console.log(`Se eliminó la imagen ${propiedad.img}`)

    //Eliminar la propiedad
    await propiedad.destroy();
    response.redirect('/mis-propiedades')
}

//Modifica el estado de la propiedad
const cambiarEstado = async (request,response)=>{
    const {id} = request.params
    const {id:usuarioId} = request.usuario

    const propiedad = await Propiedad.findByPk(id);


    if(!propiedad){
        return response.redirect('/mis-propiedades')
    }

    if(propiedad.usuarioId != usuarioId){
        return response.redirect('/mis-propiedades')
    }

 

   //propiedad.publicado = !propiedad.publicado;
   propiedad.publicado ? propiedad.publicado=0 : propiedad.publicado=1;
   
    await propiedad.save(); 
    
    response.json({
        status: true,
        estadoPropiedad: propiedad.publicado,
    })

}

//Muestra una propiedad, disponible para todos los usuarios
const mostrarPropiedad = async (request,response)=>{

    const {id} = request.params;

    const propiedad = await Propiedad.findOne({where:{
        id},
        include:[
            {model: Precio},
            {model: Categoria},
        ]
    })

    // console.log(request.usuario)
  //  console.log(usuario.id)




    if(!propiedad || propiedad.publicado==0){
       return response.redirect('/404');
    }

    const vendedor = esVendedor(request.usuario?.id,propiedad.usuarioId);
    console.log(vendedor);

    response.render('propiedades/mostrar',{
        pagina:'Propiedad',
        propiedad,
        csrfToken: request.csrfToken(),
        usuario: request.usuario,
        vendedor,
    })
}


const enviarMensaje = async (request,response)=>{
    const {id} = request.params;

    const propiedad = await Propiedad.findOne({where:{
        id},
        include:[
            {model: Precio},
            {model: Categoria},
        ]
    })

 

    if(!propiedad || propiedad.publicado==0){
       return response.redirect('/404');
    }

    const vendedor = esVendedor(request.usuario?.id,propiedad.usuarioId);

    console.log(vendedor);

    //Renderizar los errores
    let resultado = validationResult(request);

    if(!resultado.isEmpty()){

       return response.render('propiedades/mostrar',{
            pagina:'Propiedad',
            propiedad,
            csrfToken: request.csrfToken(),
            usuario: request.usuario,
            vendedor,
            errores: resultado.array(),
        })

    }

    //Almacenar mensaje
    const {mensaje} = request.body;
    const {id: usuarioId} = request.usuario;
    const {id: propiedadId} = request.params;

    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId,
    })
    

    response.render('propiedades/mostrar',{
        pagina:'Propiedad',
        propiedad,
        csrfToken: request.csrfToken(),
        usuario: request.usuario,
        vendedor,
        enviado:true,
    })
}

const verMensajes = async (request,response)=>{
    const {id} = request.params;
    const {id: usuarioId} = request.usuario;
    
    const propiedad = await Propiedad.findByPk(id,{
        include:[
            {model: Mensaje, as:'mensajes',
            include: [{model:Usuario.scope('eliminarPassword'), as: 'usuario'}]
        }
        ]
    });

    if(!propiedad){
      return  response.redirect('/mis-propiedades');
    }

    if(propiedad.usuarioId !== usuarioId){
        return  response.redirect('/mis-propiedades');
    }

    response.render('propiedades/mensajes',{
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha,
    })

    
}

export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes,
    cambiarEstado,
}
import  Sequelize  from 'sequelize'
//import {Precio,Categoria,Propiedad} from '../models/index.js'
import {Precio,Categoria} from '../models/index.js'
import Propiedad from '../models/Propiedad.js'

const inicio = async (request,response)=>{

      const [categorias,precios,casas,departamentos] = await Promise.all([
        Categoria.findAll({raw:true}),
        Precio.findAll({raw:true}),
        Propiedad.findAll({
            limit:3,
            where:{
                categoriaId: 1
            },
            include :[
                {model:Precio, as:'precio'}
            ],
            order:[['createdAt','DESC']]
        }),

        Propiedad.findAll({
            limit:3,
            where:{
                categoriaId: 2
            },
            include :[
                {model:Precio, as:'precio'}
            ],
            order:[['createdAt','DESC']]
        })


      ]) 

   
    response.render('inicio',{
        csrfToken: request.csrfToken(),
        categorias,
        precios,
        pagina:'inicio',
        casas,
        departamentos,

    })
}

const categorias = async (request,response)=>{

    const {id} = request.params;

    //Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id);

    if(!categoria){
        return response.redirect('/404')
    }
    

    //Obtener las propiedades de la categoría
    const categorias = await Categoria.findAll();
    
    const propiedades = await Propiedad.findAll({where:{
        categoriaId:id,
        publicado:1,
    },
        include:[
            {model:Precio, as: 'precio'},
            {model:Categoria, as: 'categoria'}
        ]
    })

    response.render('categoria',{
        pagina: 'Categoria',
        propiedades,
        categorias,
        categoria,
        csrfToken: request.csrfToken(),
    })
}

const noEncontrado = async (request,response)=>{
    const categorias = await Categoria.findAll();
    response.render('404',{
        pagina:'No encontrado',
        categorias,
        csrfToken: request.csrfToken(),
    })
}

const buscador = async (request,response)=>{
    const {termino} = request.body;
    if(!termino.trim()){
        return response.redirect('/')
    }

    const categorias = await Categoria.findAll()

    const propiedades = await Propiedad.findAll({
        where:{
            publicado:1,
            titulo:{//haciendo una busqueda segun el termino
                [Sequelize.Op.like] : '%'+ termino +'%'  
            }
        },
        include:[
            {model:Precio, as: 'precio'}
        ]
    })
    console.log(propiedades);

    response.render('busqueda',{
        pagina: 'Resultados de la busqueda',
        propiedades,
        csrfToken: request.csrfToken(),
        categorias,
    })
}

export{
    inicio,
    categorias,
    noEncontrado,
    buscador,

}
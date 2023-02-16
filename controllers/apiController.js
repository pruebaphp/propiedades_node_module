import {Propiedad, Precio, Categoria}  from '../models/index.js'

const propiedades = async (request,response)=>{

    const propiedades = await Propiedad.findAll({
        where:{
            publicado:1,
        },
        include:[
            {model:Precio,as:'precio'},
            {model:Categoria,as: 'categoria'},
        ]
    });




    response.json(propiedades);
}

export{
    propiedades
}
import categorias from './categorias.js'
// import Categoria from '../models/Categoria.js'
// import Precio from '../models/Precio.js'
import precios from './precios.js'
import db from '../config/db.js'
import {Categoria,Precio, Usuario,Propiedad,Mensaje} from '../models/index.js'
import usuarios from './usuarios.js'


const importarDatos = async ()=>{

    try {

        //Autenticar en la base de datos
        await db.authenticate()

        //Generar las columnas de la base de datos
        await db.sync()

        //Insertamos los datos
       /* categorias.forEach( async(categoria)=>{
           await   Categoria.create(categoria);
          
              
        })*/


        await Promise.all([
            Precio.bulkCreate(precios),
            Categoria.bulkCreate(categorias),
            Usuario.bulkCreate(usuarios),
        ])

     

        console.log('Datos importados Correctamente')
         //Se le pasa 0, ya que si finalizó sin ningun error, caso contrario del parametro 1   
        process.exit(0)
        
    } catch (error) {
        console.log(error);
        //como es un seeder, hacemos esto para que finalize el proceso, se le pasa 1 cuando es un error
        process.exit(1);
    }


}

const eliminarDatos = async()=>{
    try {

      /*  await Promise.all([
            Categoria.destroy({where:{},truncate:true}),
            Precio.destroy({where:{},truncate:true}),
        ])*/
        //Esto lo que hace es limpiar la base de datos, primero elimina las tablas y luego las crea, esto es un poco mas fuerte 
        await db.sync({force:true})

        console.log('Datos eliminados correctamente');
        process.exit(0);
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

//el argv y process son algo interno de node || "db:importar":"node ./seed/seeder.js -i"
if(process.argv[2]==="-i"){ 
    //importarDatos(precios,Precio);
   importarDatos();
}

if(process.argv[2]==="-e"){ 
    //importarDatos(precios,Precio);
   eliminarDatos();

}



import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'
import Mensaje from './Mensaje.js'

//El hasOne quiere decir que una propiedad tendrá un solo precio
//Precio.hasOne(Propiedad)
Propiedad.belongsTo(Precio);
//Esto sirve para asignarle un nombre a la llave foranea, caso contrario, se llamara precioID
//Propiedad.belongsTo(Precio, {foreingKey:'llaveForaneaPrecio'})


Propiedad.belongsTo(Categoria);
Propiedad.belongsTo(Usuario);
Propiedad.hasMany(Mensaje, {foreignKey: 'propiedadId'})


Mensaje.belongsTo(Usuario);
Mensaje.belongsTo(Propiedad, {foreignKey: 'propiedadId'});


export{
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje,
}
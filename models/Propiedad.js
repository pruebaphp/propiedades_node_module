import { DataTypes} from 'sequelize';
import db from '../config/db.js';

const Propiedad = db.define('propiedades',{
    //Cuando un id es entero, no es necesario definirlo
    id:{
        type: DataTypes.UUID,//esto genera un unique id
        defaultValue: DataTypes.UUIDV4,//utilizando la version 4
        allowNull:false,
        primaryKey:true,

    },
    titulo:{
        type:DataTypes.STRING(100),
        allowNull:false,  
    },

    descripcion:{
        type: DataTypes.TEXT,
        allowNull:false,
    },

    habitaciones:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    estacionamiento:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    wc:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    calle:{
        type: DataTypes.STRING(60),
        allowNull: false
    },

    lat: {
        type:DataTypes.STRING,
        allowNull:false
    },

    lng: {
        type:DataTypes.STRING,
        allowNull:false
    },

    img:{
        type:DataTypes.STRING,
        allowNull:false
    },

    publicado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false,

    }

});

export default Propiedad;


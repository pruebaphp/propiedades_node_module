import {DataTypes} from "sequelize";
import bcrypt from 'bcrypt'
import db from "../config/db.js";

//nombre del model, va ser la tabla de los registros(usuarios)
const Usuario = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull:false,

    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
    //los hooks son funciones que se pueden agregar a cierto modelo
    hooks:{
        beforeCreate: async function(usuario){// el usuario es el request.body
            //creando el salt para hashear el password
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password,salt);
        }
    },

    //los skopes sirven para eliminar ciertos campos al traer información
    scopes:{
        eliminarPassword:{
            attributes:{
                exclude: ['password','token','confirmado','createdAt','updatedAt']
            }
        }
    }
})

//Métodos personalizados esto permite el sequelize

Usuario.prototype.verificarPasword = function(password){
    return bcrypt.compareSync(password,this.password);
}

export default Usuario 
import Sequelize from "sequelize";
import dotenv from 'dotenv';
dotenv.config({path: '.env'})
//dotenv.config({path: '../.env'})
//creando la instancia de sequelize, y se va conectar con la base de datos que se va crear

const db = new Sequelize(process.env.DB_NOMBRE,process.env.DB_USER,process.env.DB_PASS || '',{
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    define:{
        //cuando fue creado el usuario y actualizado
        timestaps:true
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases:false
});

export default db
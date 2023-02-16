import multer from 'multer'
import path from 'path'
import { generarId } from '../helpers/tokens.js'

const storage = multer.diskStorage({
    //este destinatin es donde se van a guardar los archivos
    destination: function(request, file, callback){
        //se le pasa el null, ya que si se ejecuto todo, pasara a esta linea, y el null es para decirle que no hubo errores, luego se pasa la direccion de las imagenes
        callback(null,'./public/uploads')
    },
    filename: function(request,file,callback){
                    //aqui lo que se hace es con la función generarId(), asignarle un nombre único, ya que si se repiten las imagenes al guardar, habrá conflicto. Con el path.extname() obtenemos la extensión del archivo que se está subiendo por ejemplo : .jpg .gif .png 
        callback(null, generarId() + path.extname(file.originalname))
    }
})

const upload = multer({storage})

export default upload
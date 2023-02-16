import { Dropzone } from 'dropzone';

const token = document.querySelector('[name="_csrf"]').value

                //.imagen es el id del formulario en agregar-imagen.puh
Dropzone.options.imagen = {
    //para cambiar el texto de ingles a español
    dictDefaultMessage: 'Sube las imagenes de tu propiedad aquí',
    //para aceptar solamente ciertos formatos
    acceptedFiles: '.png,.jpg,.jpeg',
    //para el tamaño de los archivos
    maxFilesize: 50, //esto son 5 megas
    maxFiles: 1, //cantidad maxima de archivos
    parallelUploads:1, // es la cantidad de archivos que estamos subiendo
    autoProcessQueue: false, // esto para poder arrastrar y que dropzone no lo suba en automatico, ya que tiene el false
    addRemoveLinks: true, //esto para generar un enlace para eliminar la imagen
    dictRemoveFile: 'Borrar archivo', // esto para cambiarle el nombre 
    dictMaxFilesExceeded: 'El Límite es 1 archivo',
    //antes de subir imagenes, se sube lo que es el token
    headers:{
        'CSRF-Token': token
    },
    //aqui le pasamos el mismo nombre que está en nuestro upload.single('imagen'); ya que si no son iguales no funcionara
    paramName: 'imagen',
    init: function(){
        //this hace referencia a dropzone
       const dropzone = this;
       const btnPublicar = document.querySelector('#publicar');

       btnPublicar.addEventListener('click',function(){
        dropzone.processQueue();

       })
       //esto quiere decir que ya se completo la subida de archivos (queuecomplete)
       dropzone.on('queuecomplete',function(){
        //el getActiveFiles().length quiere decir cuantos archivos faltan por subir o estan en la cola de espera
            if(dropzone.getActiveFiles().length==0){
                window.location.href = '/mis-propiedades';
            }
       })
    }

}
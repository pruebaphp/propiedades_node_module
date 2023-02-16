(function(){

    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado');
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    cambiarEstadoBotones.forEach(btn=>{
            btn.addEventListener('click',cambiarEstadoPropiedad)
    })

    async function cambiarEstadoPropiedad(e){
        const id = e.target.getAttribute('data-id');
        //console.log(id);
        try {
            const url = `/propiedades/${id}`
        
            const respuesta = await fetch(url,{
                method: 'PUT',
                headers:{
                    'CSRF-Token':token
                }
            })

            const data = await respuesta.json();
            const {status, estadoPropiedad} = data;    
            
            if(status){
                if(estadoPropiedad){
                    e.target.classList.remove('bg-green-100','text-green-800')
                    e.target.classList.add('bg-yellow-100','text-yellow-800')
                    e.target.textContent = 'No Publicado'
                }else{
                   
                    e.target.classList.remove('bg-yellow-100','text-yellow-800')
                    e.target.classList.add('bg-green-100','text-green-800')
                    e.target.textContent = 'Publicado'
                }
            }
            
        } catch (error) {
            console.log(error)
        }

    }



})();
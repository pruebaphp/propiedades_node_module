(function(){
       //si es false quiere decir que no tiene nada, y  se va a -12.106850
       const lat = -12.106850;
       const lng = -76.993024;
       const mapa = L.map('mapa-inicio').setView([lat, lng ], 17);

       let markers = new L.FeatureGroup().addTo(mapa);

       let propiedades = [];

       //Filtros

       const filtros = {
        categoria: '',
        precio: '',
    }

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');


        
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtrado de categorias y precios

    categoriasSelect.addEventListener('change', e=>{
        filtros.categoria = (e.target.value);
        console.log(filtros);
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e=>{
        filtros.precio = (e.target.value);
        console.log(filtros);
        filtrarPropiedades();
    })


    const obtenerPropiedades = async ()=>{
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url);
            propiedades = await respuesta.json();

           mostrarPropiedades(propiedades)
        } catch (error) {
                console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {

        //Limpiar los markers previos
        markers.clearLayers();

        console.log(propiedades);
        propiedades.forEach((propiedad)=>{
                //Agregar los pines
                const marker = new L.marker([propiedad?.lat,propiedad?.lng],{
                    autoPan:true,
                }).addTo(mapa).bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
                  <h1 class="text-xl font-extrabold uppercase my-3">${propiedad.titulo}</h1>  
                  <img src="/uploads/${propiedad.img}" alt="Imagen de la propiedad ${propiedad.titulo}">
                  <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                  <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase rounded-lg" >Ver propiedad</a>
                  
                `)


                markers.addLayer(marker)
        })
    }

    function filtrarPropiedades(){
       
            const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio)
            console.log(resultado);
            mostrarPropiedades(resultado);
    }

    function filtrarCategoria(e){
        if(filtros.categoria){
            return e.categoriaId == filtros.categoria;
        }else{
            return e;
        }
    }

    function filtrarPrecio(e){
        if(filtros.precio){
            return e.precioId  == filtros.precio;  
        }else{
            return e;
        }
    }

    obtenerPropiedades();

})();
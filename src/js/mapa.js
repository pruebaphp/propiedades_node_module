(function() {

   //si es false quiere decir que no tiene nada, y  se va a -12.106850
    const lat = document.querySelector('#lat').value || -12.106850;
    const lng = document.querySelector('#lng').value || -76.993024;
    const mapa = L.map('mapa').setView([lat, lng ], 17);
    let marker;
    
    //Utilizar Provider y Geocorder
    //esto nos va permitir obtener en base a las cordenadas el nombre de la calle
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //El pin
    marker = new L.marker([lat,lng],{
        
        draggable:true,         //esto hace que se pueda mover el pin, ya que por defecto está en false
        autoPan:true,           //Esto hace que cuando se mueva el pin, el mapa lo siga y se centre
    })

    .addTo(mapa);

    //Detectar el movimiento del pin y leer su lat y long
    marker.on('moveend',function(e){
        marker = e.target;

        const posicion = marker.getLatLng();

      //  console.log(posicion);
        //esto hace que se centre
        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng));

        //Obtener la información de las calles al soltar el pin

        geocodeService.reverse().latlng(posicion,17).run(function(error,resultado){
            console.log(resultado);

            //pone un globo de información arriba del pin
            marker.bindPopup(resultado.address.LongLabel)
            console.log(resultado);
            //Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.LongLabel || '';
            document.querySelector('#calle').value = resultado?.address?.LongLabel || '';
            document.querySelector('#lat').value = resultado?.latlng?.lat || '';
            document.querySelector('#lng').value = resultado?.latlng?.lng || '';


        })

    })


})()
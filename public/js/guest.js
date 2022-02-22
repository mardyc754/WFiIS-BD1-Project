async function guestInfo(){
    const Guest = {
        idGosc: sessionStorage.getItem('guestId'),
    }
    return await getFromDatabase(`${url}/guest/info`, Guest); 
}

async function displayGuestInfo(event){
    event.preventDefault();

    const client = await guestInfo();
    if(client.length === 1){
        let content = document.getElementById("tableContent");
        content.innerHTML =  "<p>Imię: " + client[0].imie + 
                             "</p><p>Nazwisko: " + client[0].nazwisko + 
                             "</p><p>Telefon: " + client[0].telefon + 
                             "</p><p>E-mail: " + client[0].email + "</p>";
    }
}

async function guestReservations(event){
    if(event) event.preventDefault();

    const Guest = {
        idGosc: sessionStorage.getItem('guestId'),
    }

    const result = await getFromDatabase(`${url}/reservations/${Guest.idGosc}`, Guest)

    let content = document.getElementById("tableContent");

    if(result.length > 0){
        let resultRows = "<h2>Twoje rezerwacje</h2><table><tr><th>ID pokoju</th> <th>ID rezerwacji</th> <th>Data rozpoczęcia</th> <th>Data zakończenia</th> <th>Status</th><th>Akcja</th></tr>";
        for(let i = 0; i<result.length; i++){

            let startDate = new Date(result[i].data_rozpoczecia).toLocaleDateString('pl', {year:"numeric", month:"numeric", day:"numeric"});
            let endDate = new Date(result[i].data_zakonczenia).toLocaleDateString('pl', {year:"numeric", month:"numeric", day:"numeric"});
            resultRows += "<tr><td>" + result[i].id_pokoj + "</td>"
                        +"<td>" + result[i].id_rezerwacja + "</td>"
                        +"<td>" + startDate  + "</td>"
                        +"<td>" + endDate + "</td>"
                        +"<td>" + result[i].status + "</td>"
                        +`<td><button onclick="deleteReservation(${result[i].id_hotel}, ${result[i].id_rezerwacja})">Usuń</button></td></tr>`;
        }
        resultRows += "</table>";
        content.innerHTML = resultRows;
    } else{
        content.innerHTML = "Nie posiadasz jeszcze rezerwacji w żadnym z hoteli, dlatego rezerwacje się nie wyświetlają";
    }
}

async function loadReservationParameters(event){
    if(event) event.preventDefault();

    const Hotel = {hotelId: document.getElementById("hotelSelect").value};
    const result = await getFromDatabase(url + '/hotel', Hotel);

    let hotelSelect = document.getElementById("hotelSelect");
    let resultRows = "";
    
    for(let i = 0; i<result.length; i++){
        if(i==0){
            resultRows += "<option value=\"" + result[i].id_hotel + "\" selected>" + result[i].nazwa + "</option>";
        }
        else{
            resultRows += "<option value=\"" + result[i].id_hotel + "\">" + result[i].nazwa + "</option>";
        }
    }   
    hotelSelect.innerHTML = resultRows;
}

async function loadRoomsInHotel(event){
    event.preventDefault();
    await loadReservationParameters(event);
    await displayRoomsInHotel(event);
}


async function displayRoomsInHotel(event){
    event.preventDefault();

    let hotelId = document.getElementById("hotelSelect").value
    const result = await getFromDatabase(`/hotel/${hotelId}/rooms`);

    let roomSelect = document.getElementById("roomSelect");
    let resultRows = "";
    
    for(let i = 0; i<result.length; i++){
        if(i==0){
            resultRows += "<option value=\"" + result[i].id_pokoj + "\" selected>" + result[i].id_pokoj + "</option>";
        }
        else{
            resultRows += "<option value=\"" + result[i].id_pokoj + "\">" + result[i].id_pokoj + "</option>";
        }
    }   
    roomSelect.innerHTML = resultRows;  
}

async function loadHotelDescription(event){
    event.preventDefault();

    const hotelId = document.getElementById("hotelSelect").value;
    const hotelInfo = await getFromDatabase(`${url}/hotel/${hotelId}`);
    
    let hotelRows = '';
    if(hotelInfo.length > 0){
        hotelRows += "<p>ID hotelu: " + hotelInfo[0].id_hotel +"</p>";
        hotelRows += "<p>Nazwa: "    + hotelInfo[0].nazwa +"</p>";
        hotelRows += "<p>Miejscowość: " + hotelInfo[0].miejscowosc +"</p>";
        hotelRows += "<p>Posiada windę: " + hotelInfo[0].posiada_winde +"</p>";
        hotelRows += "<p>Adress www: "   + hotelInfo[0].adres_www +"</p>";
        hotelRows += "<p>Właściciele hotelu: "
        for(let i=0; i<hotelInfo.length; i++){
            hotelRows += hotelInfo[i].wlasciciel_hotelu +", ";
        }
        hotelRows += "</p>"
    }
    document.getElementById('hotelDescription').innerHTML = hotelRows;
}

async function loadRoomDescription(event){
    event.preventDefault();

    const Room = {
        roomId: document.getElementById("roomSelect").value,
        hotelId: document.getElementById("hotelSelect").value
    }
    const result = await getFromDatabase(`${url}/hotel/${Room.hotelId}/rooms/${Room.roomId}`, Room);

    let roomInfo = document.getElementById("roomDescription");
    let resultRows = "<p>Wybrany pokój: </p>";
    
    for(let i = 0; i<result.length; i++){
            resultRows += "<p>ID pokoju: " + result[i].id_pokoj +"</p>";
            resultRows += "<p>Piętro: "    + result[i].pietro   +"</p>";
            resultRows += "<p>Typ standardu: " + result[i].typ_standardu +"</p>";
            resultRows += "<p>Posiada łazienkę: " + result[i].z_lazienka +"</p>";
            resultRows += "<p>Dla palących: "   + result[i].dla_palacych +"</p>";
            resultRows += "<p>Liczba miejsc: " + result[i].ilosc_miejsc +"</p>";
            resultRows += "<p>Cena: " + result[i].cena +" zł/dzień</p>";
    }   
    roomInfo.innerHTML = resultRows;  
}

async function makeReservation(guestId){
    const Body = {
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        roomId: document.getElementById('roomSelect').value,
        guestId: guestId
    }

    const response = await getFromDatabaseWithStatus(`${url}/guest/makeReservation`, Body);
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie zarezerwowano pokój!';
        getGuestMoney();
    }
    else{
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function selectService(guestId){
    const Body = {
        guestId: guestId
    }

    const services = await getFromDatabase(`${url}/guest/services`, Body);

    if(services.length > 0){
        let servicesTable = `<table><tr><th>Nazwa hotelu</th><th>Nazwa usługi</th><th>Cena</th><th>Akcja</th></tr>`;

        for(let i=0; i<services.length; i++){
            servicesTable += `<tr><td>${services[i].nazwa_hotelu}</td>`;
            servicesTable += `<td>${services[i].nazwa_uslugi}</td>`;
            servicesTable += `<td>${services[i].cena}</td>`; 
            servicesTable += `<td><button onclick="buyService(${guestId},${services[i].id_hotel},${services[i].id_usluga})">Zamów</button></td></tr>`;
        }
        servicesTable += "</table>";

        document.getElementById('tableContent').innerHTML = servicesTable;
    }
    else{
        document.getElementById('tableContent').innerHTML = 'Nie posiadasz jeszcze rezerwacji w którymkolwiek z hoteli, dlatego usługi się nie wyświetlają';
    }
}

async function getGuestMoney(){
    const result = await getFromDatabase(`${url}/guest/info`);
    if(result){
        document.getElementById('guestMoney').innerHTML = result[0].pieniadze;
    }
}

async function buyService(guestId, hotelId, serviceId){
    const foundService = await getFromDatabase(`${url}/services/${hotelId}/${serviceId}`);

    const Service = {
        guestId: guestId,
        serviceId: serviceId,
        hotelId: hotelId,
        price: foundService[0].cena
    }
    

    if(foundService.length > 0){
        const response = await getFromDatabaseWithStatus(`guest/services/buy`, Service);

        if(response.status === 200){
            document.getElementById('actionStatus').innerHTML = 'Kupiono usługę!';
            getGuestMoney();
        }
        else{
            document.getElementById('actionStatus').innerHTML = response.result.error;
        }
    }
}
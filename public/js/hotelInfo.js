async function loadHotelList(){
    const result = await getFromDatabase('/hotel');

    let hotelList = '';
    if(result){
        for(let i=0; i<result.length; i++){
            hotelList += "<li onclick=\"loadHotelButtons(" + result[i].id_hotel + ")\"> "+ 
                        result[i].nazwa +"</li>";
        }
    }

    document.getElementById("hotelList").innerHTML = hotelList;
}

function loadHotelButtons(hotelId){
    loadHotelInfo(hotelId);
    buttons = "<button onclick = loadHotelInfo(" + hotelId + ")>Wyświetl podstawowe informacje</button>" +
              "<button onclick = loadHotelRoomsInfo(" + hotelId + ")>Sprawdź pokoje</button>" + 
              "<button onclick = loadServicesInfo(" + hotelId + ")>Zobacz usługi</button>" + 
              "<button onclick = loadEmployeesInfo(" + hotelId + ")>Sprawdź pracowników</button>";
    document.getElementById("buttonArea").innerHTML = buttons;
}

async function loadHotelInfo(hotelId){
    const hotelInfo = await getFromDatabase('/hotel/' + hotelId);
    
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
    document.getElementById('tableContent').innerHTML = hotelRows;
    document.getElementById("roomInfo").innerHTML = '';
}


async function loadHotelRoomsInfo(hotelId){
    const hotelRooms = await getFromDatabase('/hotel/' + hotelId + 
                                                '/rooms');
    let roomsList = '<ul id="roomList">';

    for(let i=0; i<hotelRooms.length; i++){
        roomsList += `<li onclick="displayRoomInfo(${hotelRooms[i].id_hotel}, ${hotelRooms[i].id_pokoj})">${hotelRooms[i].id_pokoj}</li>`;
    }
    roomsList += "</ul>";

    document.getElementById("tableContent").innerHTML = roomsList;
}

async function loadServicesInfo(hotelId){
    const services = await getFromDatabase('/hotel/' + hotelId + '/services');
    let servicesTable = '<table><tr><th>Nazwa usługi</th><th>Cena</th></tr>';

    for(let i=0; i<services.length; i++){
        servicesTable += "<tr><td>" + services[i].nazwa +
                        "</td><td>"+ services[i].cena + "</td></tr>";
    }
    servicesTable += "</table>";
    document.getElementById("tableContent").innerHTML = servicesTable;
    if(window.location.href === url + '/hotels'){
        document.getElementById("roomInfo").innerHTML = '';
    }
}

async function loadEmployeesInfo(hotelId){
    const employees = await getFromDatabase('/hotel/' + hotelId + '/employees');
    let employeesTable = '<table><tr><th>Imię</th><th>Nazwisko</th><th>Numer telefonu</th><th>Adres email</th></th></tr>';
    for(let i=0; i<employees.length; i++){
        employeesTable += "<tr><td>" + employees[i].imie +
                        "</td><td>"+ employees[i].nazwisko + "</td>" +
                        "<td>"+ employees[i].telefon + "</td>"+ 
                        "<td>"+ employees[i].email + "</td></tr>";
        }
    employeesTable += "</table>";

    document.getElementById("tableContent").innerHTML = employeesTable;
    document.getElementById("roomInfo").innerHTML = '';
}

async function displayRoomInfo(hotelId, roomId){
    const result = await getFromDatabase('/hotel/' + hotelId + '/rooms/' + roomId);
    
    let roomInfo = document.getElementById("roomInfo");
        let resultRows = "";
        
        if(result.length > 0){
            resultRows += "<p>ID pokoju: " + result[0].id_pokoj +"</p>";
            resultRows += "<p>Piętro: "    + result[0].pietro   +"</p>";
            resultRows += "<p>Typ standardu: " + result[0].typ_standardu +"</p>";
            resultRows += "<p>Posiada łazienkę: " + result[0].z_lazienka +"</p>";
            resultRows += "<p>Dla palących: "   + result[0].dla_palacych +"</p>";
            resultRows += "<p>Liczba miejsc: " + result[0].ilosc_miejsc +"</p>";
            resultRows += "<p>Cena: " + result[0].cena +" zł/dzień</p>";
        }  

    roomInfo.innerHTML = resultRows;
}
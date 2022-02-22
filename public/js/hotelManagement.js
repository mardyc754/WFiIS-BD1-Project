async function employeeInfo(){
    const Employee = {
        idPracownik: sessionStorage.getItem('employeeId'),
    }
    return await getFromDatabase(`${url}/employee/info`, Employee);

}

async function displayEmployeeInfo(event){
    event.preventDefault();

    const client = await employeeInfo();
    if(client.length === 1){
        let content = document.getElementById("tableContent");
        content.innerHTML =  "<p>Imię: " + client[0].imie + 
                             "</p><p>Nazwisko: " + client[0].nazwisko + 
                             "</p><p>Telefon: " + client[0].telefon + 
                             "</p><p>E-mail: " + client[0].email + "</p>";
    }
}

async function loadEmployeeHotels(employeeId){
    const result = await getFromDatabase(`/employee/${employeeId}/hotels`);

    let hotelList = '<p>Twoje hotele:</p>';
    if(result && result.length > 0){
        hotelList += '<ul id="hotelList">';
        if(result){
            for(let i=0; i<result.length; i++){
                hotelList += `<li onclick="displayManageHotelButtons(${result[i].id_hotel})">${result[i].nazwa}</li>`;
            }
        }
        hotelList += '</ul>';
    }  
    else{
        hotelList = 'Nie posiadasz jeszcze żadnych hoteli';
    } 
    document.getElementById("employeeHotels").innerHTML = hotelList;
    document.getElementById("submenu").innerHTML = '';
}

function displayManageHotelButtons(hotelId){
    let buttons = `<button onclick = manageHotelServices(${hotelId})>Edytuj usługi</button>` +
              `<button onclick = manageRoomStandards(${hotelId})>Edytuj standardy pokoi</button>` + 
              `<button onclick = manageRoomReservations(${hotelId})>Sprawdź rezerwacje na pokoje</button>` + 
              `<button onclick = manageHotelRooms(${hotelId})>Edytuj pokoje</button>` +
              `<button onclick = manageEmployees(${hotelId})>Zarządzaj pracownikami</button>`;
    document.getElementById("buttonArea").innerHTML = buttons;
}

async function manageHotelServices(hotelId){
    document.getElementById('submenu').innerHTML = '';
    const services = await getFromDatabase('/hotel/' + hotelId + '/services');
    let servicesTable = '<table><tr><th>Nazwa usługi</th><th>Cena</th><th>Akcja</th></tr>';

    for(let i=0; i<services.length; i++){
        servicesTable += `<tr><td>${services[i].nazwa}</td>` +
                        `<td>${services[i].cena}</td>` + 
                        "<td><button onclick=\"editService("+ hotelId + ", "
                        + services[i].id_usluga + ", '"+ services[i].nazwa + 
                        "')\"><a href=\"#updateService\">Edytuj...</a></button></td></tr>";
    }
    servicesTable += "</table>";

    servicesTable += `<p><button onclick="addNewServiceForm(${hotelId})">Dodaj usługę...</button></p>`;
    document.getElementById("tableContent").innerHTML = servicesTable;
}

function editService(hotelId, serviceId, serviceName){
    let submenu = '<form name="updateService" id="updateService">';
        submenu += '<p>Zmień cenę usługi ' + serviceName + ':</p> ';
        submenu += '<input type="text" name="newPrice" id="newPrice"/><br/>';
        submenu += `<input type="button" onclick="sendNewPrice(${hotelId}, ${serviceId}, 'services')" value="Zapisz"/></form>`;
    document.getElementById('submenu').innerHTML = submenu;
}

async function sendNewPrice(hotelId, serviceId, dataType){
    let newPrice = parseFloat(document.getElementById('newPrice').value);

    const Data = {
        hotelId: hotelId,
        serviceId: serviceId,
        newPrice: parseFloat(newPrice.toFixed(2))
    }

    const response = await getFromDatabaseWithStatus(`${url}/hotel/${hotelId}/${dataType}/${serviceId}/update`, Data);
    
    if(response.status === 400){
        document.getElementById('actionStatus').innerHTML = 'Podano złe dane: ';
    }
    else if(response.status === 200){
        if(dataType=== 'services'){
            document.getElementById('actionStatus').innerHTML = 'Pomyślnie zmieniono cenę usługi!';
            await manageHotelServices(hotelId);
        }
        else if(dataType === 'standards'){
            document.getElementById('actionStatus').innerHTML = 'Pomyślnie zmieniono cenę standardu!';
            await manageRoomStandards(hotelId);
        }
    }
    else if(response.status === 500){
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function manageRoomStandards(hotelId){
    document.getElementById('submenu').innerHTML = '';
    const standards = await getFromDatabase('/hotel/' + hotelId + '/standards');
    let standardsTable = '<table><tr><th>Nazwa standardu</th><th>Cena</th><th>Akcja</th></tr>';

    if(standards.length > 0 && standards[0].nazwa != null){
        for(let i=0; i<standards.length; i++){
            standardsTable += "<tr><td>" + standards[i].nazwa +
                            "</td><td>"+ standards[i].cena + 
                            "</td><td><button onclick=\"editStandard("+ hotelId + ", "
                            + standards[i].id_standard + ", '"+ standards[i].nazwa + 
                            "')\">Edytuj...</button></td></tr>";
        }
    }
    standardsTable += "</table>";

    standardsTable += `<p><button onclick="addNewStandardForm(${hotelId})">Dodaj standard...</button></p>`;
    document.getElementById("tableContent").innerHTML = standardsTable;
    // zmiana cen standardów (ale nie nazwy, to już byłoby zbyt skomplikowane...)
}

function editStandard(hotelId, standardId, standardName){
    let submenu = '<form name="updateStandard">';
        submenu += `<p>Zmień cenę standardu ${standardName}:</p>`;
        submenu += '<input type="text" name="newPrice" id="newPrice"/><br/>';
        submenu += `<input type="button" onclick="sendNewPrice(${hotelId}, ${standardId}, 'standards')" value="Zapisz"/></form>`;
    document.getElementById('submenu').innerHTML = submenu;
}


// TODO
async function manageRoomReservations(hotelId){
    document.getElementById('submenu').innerHTML = '';
    const result = await getFromDatabase('/hotel/' + hotelId + 
                                                '/reservations');
    let reservationsTable = '<p>Wybierz rezerwacje:</p>';
    reservationsTable = '<table><tr><th>Id rezerwacji</th>' +
                        '<th>Id pokoju</th>' +
                        '<th>Data rozpoczęcia</th>' +
                        '<th>Data zakończenia</th>' +
                        '<th>Status</th>' + 
                        '<th>Id statusu</th>' +
                        '<th>Akcja</th></tr>';

    for(let i=0; i<result.length; i++){
        let startDate = new Date(result[i].data_rozpoczecia).toLocaleDateString('pl', {year:"numeric", month:"numeric", day:"numeric"});
        let endDate = new Date(result[i].data_zakonczenia).toLocaleDateString('pl', {year:"numeric", month:"numeric", day:"numeric"});
        reservationsTable += `<tr><td>${result[i].id_rezerwacja}</td>` +
                             `<td>${result[i].id_pokoj}</td>` + 
                             `<td>${startDate}</td>` +
                             `<td>${endDate}</td>` +
                             `<td>${result[i].status}</td>` +
                             `<td>${result[i].id_status}</td>` +
                             `<td><button onclick="editReservation(${hotelId}, ${result[i].id_rezerwacja})">Edytuj...</button></td>` +
                             `</tr>`;
    }
    reservationsTable += "</table>";
    // tworzenie submenu submenu z akcjami - zmiana statusu, potwierdzanie, odrzucanie
    document.getElementById("tableContent").innerHTML = reservationsTable;
}

function editReservation(hotelId, reservationId){
    let submenu = '<form name="updateReservation">';
        submenu += `<p>Zmień status rezerwacji o ID = ${reservationId} na:</p>`;
        submenu += `<select name="reservationStatus" id="reservationStatus">`;
        submenu += `<option value="3">Zaakceptowana</option>`;
        submenu += `<option value="4">Odrzucona</option>`;
        submenu += '</select></br>';
        submenu += '<input type="button" value="Zmień status"';
        submenu += `onclick="changeReservationStatus(${hotelId}, ${reservationId})"><br/>`;
        submenu += `<input type="button" value="Usuń rezerwację" onclick="deleteReservation(${hotelId}, ${reservationId})"/></form>`;
    document.getElementById('submenu').innerHTML = submenu;
}

async function changeReservationStatus(hotelId, reservationId){
    const newStatus = document.getElementById('reservationStatus').value;
    const Data = {
        reservationId: reservationId,
        newStatus: newStatus
    }

    const response = await fetch(`${url}/hotel/${hotelId}/reservations/${reservationId}/update`,
    {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'post',
        body: JSON.stringify(Data)
    });
    
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie zmieniono status rezerwacji!';
        await manageRoomReservations(hotelId);
    }
}

// TODO
async function manageHotelRooms(hotelId){
    document.getElementById('submenu').innerHTML = '';
    const result = await getFromDatabase('/hotel/' + hotelId + '/rooms');
    let roomsTable = '<p>Wybierz pokój:</p>';
    roomsTable = '<table><tr><th>Id pokoju</th>' +
                        '<th>Piętro</th>' +
                        '<th>Typ standardu</th>' +
                        '<th>Z łazienką</th>' +
                        '<th>Dla palących</th>' + 
                        '<th>Ilość miejsc</th>' +
                        '<th>Cena</th>' +
                        '<th>Akcja</th></tr>';

    for(let i=0; i<result.length; i++){
        roomsTable += `<tr><td>${result[i].id_pokoj}</td>` +
        `<td>${result[i].pietro}</td>` + 
        `<td>${result[i].typ_standardu}</td>` +
        `<td>${result[i].z_lazienka}</td>` +
        `<td>${result[i].dla_palacych}</td>` +
        `<td>${result[i].ilosc_miejsc}</td>` +
        `<td>${result[i].cena}</td>` +
        `<td><button onclick="editRoom(${hotelId}, ${result[i].id_pokoj})">Edytuj...</button></td>` +
        `</tr>`;
    }
    roomsTable += `</table><br/><button onclick="addNewRoomForm(${hotelId})">Dodaj pokój</button>`;

    document.getElementById("tableContent").innerHTML = roomsTable;
}

async function editRoom(hotelId, roomId){
    const standards = await getFromDatabase('/hotel/' + hotelId + '/standards');
    let submenu = '<form name="updateRoomStandard">';
        submenu += `<p>Zmień standard pokoju o ID = ${roomId} na:</p>`;
        submenu += `<select name="newStandardSelect" id="newStandardSelect">`;
        for(let i=0; i<standards.length; i++){
            submenu += 
            `<option value="${standards[i].id_standard}"}>${standards[i].nazwa}</option>`;
        }
        submenu += '</select></br>';
        submenu += '<input type="button" value="Zmień standard"';
        submenu += `onclick="changeRoomStandard(${hotelId}, ${roomId})">`;
        submenu += `</form>`;
    document.getElementById('submenu').innerHTML = submenu;
}

// zmienić funkcję odpowiedzialną za zmianę standardu
async function changeRoomStandard(hotelId, roomId){
    const newStandard = document.getElementById('newStandardSelect').value;

    const Data = {
        newStandard: newStandard
    }

    const response = await getFromDatabaseWithStatus(`/hotel/${hotelId}/rooms/${roomId}/update`, Data);

    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie zmieniono standard pokoju!';
        await manageHotelRooms(hotelId);
    }
    else if(response.status === 400){
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function manageEmployees(hotelId){
    document.getElementById('submenu').innerHTML = '';
    const result = await getFromDatabase(`/hotel/${hotelId}/employees`);
    let employeeTable = '<p>Wybierz pracownika:</p>';
    employeeTable = '<table><tr><th>Imię</th>' +
                        '<th>Nazwisko</th>' +
                        '<th>Telefon</th>' +
                        '<th>Adres e-mail</th>' +
                        '<th>Wynagrodzenie</th>' +
                        '<th>Akcja</th></tr>';

    for(let i=0; i<result.length; i++){
        employeeTable += `<tr>` +
        `<td>${result[i].imie}</td>` + 
        `<td>${result[i].nazwisko}</td>` +
        `<td>${result[i].telefon}</td>` +
        `<td>${result[i].email}</td>` +
        `<td>${result[i].wynagrodzenie}</td>` +
        `<td><button onclick="manageHotelEmployee(${hotelId}, ${result[i].id_pracownik}, ${result[i].wlasciciel})">Zarządzaj...</button></td>` +
        `</tr>`;
    }
    employeeTable += "</table>";

    employeeTable += `<p><button onclick="addNewEmployeeSelect(${hotelId})">Dodaj pracownika</button></p>`;
    document.getElementById("tableContent").innerHTML = employeeTable;
}


async function manageHotelEmployee(hotelId, employeeId, isEmployeeHotelManager){
    let submenu = '<form name="editEmployee">';
        submenu += `<p>Pracownik o ID = ${employeeId}:</p>`;
        submenu += `<input type="button" onclick="dismissEmployee(${hotelId}, ${employeeId})" value="Zwolnij pracownika"/></br>`;
        submenu += `<input type="button" onclick="makeEmployeeHotelManager(${hotelId}, ${employeeId})" value="Dodaj pracownika do właścicieli hotelu"/><br/>`; 
        if(isEmployeeHotelManager){
            submenu += `<input type="button" onclick="removeEmployeeFromHotelManagers(${hotelId}, ${employeeId})" value="Usuń pracownika z właścicieli hotelu"/>`;
        }
        submenu += '<p>Zmień wynagrodzenie:</p>'
        submenu += '<input type="text" name="newSalary" id="newSalary"/><br/>';
        submenu += `<input type="button" onclick="changeSalary(${hotelId}, ${employeeId})" value="Zapisz"/>`;
        submenu += `</form>`;
    document.getElementById('submenu').innerHTML = submenu;
}

async function changeSalary(hotelId, employeeId){
    let newSalary = parseFloat(document.getElementById('newSalary').value);

    const Data = {
        hotelId: hotelId,
        employeeId: employeeId,
        newSalary: parseFloat(newSalary.toFixed(2))
    }

    const response = await getFromDatabaseWithStatus(`${url}/hotel/${hotelId}/employees/${employeeId}/update`, Data);
    
    if(response.status === 400){
        document.getElementById('actionStatus').innerHTML = 'Podano złe dane';
    }
    else if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie zmieniono wynagrodzenie pracownika!';
        await manageEmployees(hotelId);
    }
    else if(response.status === 500){
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function dismissEmployee(hotelId, employeeId){
    const response = await getFromDatabaseWithStatus(`/hotel/${hotelId}/employees/${employeeId}/delete`);
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie zwolniono pracownika!';
        await manageEmployees(hotelId);
    }
    else if(response.status === 500){
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function makeEmployeeHotelManager(hotelId, employeeId){
    const response = await getFromDatabaseWithStatus(`/hotel/${hotelId}/employees/${employeeId}/makeManager`);
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie zmieniono uprawnienia pracownika!';
        await manageEmployees(hotelId);
    }
    else if(response.status === 500){
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function removeEmployeeFromHotelManagers(hotelId, employeeId){
    const response = await getFromDatabaseWithStatus(`/hotel/${hotelId}/employees/${employeeId}/removeManagement`);
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie usunięto pracownika z właścicieli hotelu!';
        await manageEmployees(hotelId);
    }
    else if(response.status === 500){
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function addNewEmployeeSelect(hotelId){
    const freeStandards = await getFromDatabase(`/employee/${hotelId}/others`);
    let submenu = '<form name="addEmployee">';
        submenu += `<p>Dodaj pracownika z bazy:</p>`;
        submenu += `<select name="newEmployeeSelect" id="newEmployeeSelect">`;
        for(let i=0; i<freeStandards.length; i++){
            submenu += 
            `<option value="${freeStandards[i].id_pracownik}"}>${freeStandards[i].imie} ${freeStandards[i].nazwisko}</option>`;
        }
        submenu += '</select></br>';
        submenu += '<input type="button" value="Dodaj pracownika"';
        submenu += `onclick="addNewEmployee(${hotelId})">`;
        submenu += `</form>`;
    document.getElementById('submenu').innerHTML = submenu;
}

async function addNewEmployee(hotelId){
    const newEmployeeId = document.getElementById('newEmployeeSelect').value;
    const Employee = { newEmployeeId: newEmployeeId};

    const response = await getFromDatabaseWithStatus(`/hotel/${hotelId}/addEmployee`, Employee);
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie dodano pracownika!';
        await manageEmployees(hotelId);
    }
    else if(response.status === 500){
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

function createNewHotelForm(employeeId){
    document.getElementById('buttonArea').innerHTML = '';
    document.getElementById('tableContent').innerHTML = '';
    let submenu = '<form name="createHotel">';
    submenu += `<p>Utwórz nowy hotel:</p>`;
    submenu += `<label for="hotelName">Nazwa:</label>`;
    submenu += `<input type="text" name="hotelName" id="hotelName" /><br/>`;
    submenu += `<label for="hotelLocation">Miejscowość:</label>`;
    submenu += `<input type="text" name="hotelLocation" id="hotelLocation" /><br/>`;
    submenu += `<p>Posiada windę:</p>`;
    submenu += `<input type="radio" name="isElevator" value="true" checked/> Tak`;
    submenu += `<input type="radio" name="isElevator" value="false" /> Nie<br/>`;
    submenu += `<label for="isElevator">Strona www:</label>`;
    submenu += `<input type="text" name="website" id="website" /><br/>`;


    submenu += '<input type="button" value="Utwórz hotel"';
    submenu += `onclick="createNewHotel(${employeeId})"></form>`;
document.getElementById('submenu').innerHTML = submenu;
}

// tworzenie nowego hotelu
async function createNewHotel(employeeId){
    const newHotel = {
        name: document.getElementById("hotelName").value,
        location: document.getElementById("hotelLocation").value,
        isElevator: document.querySelector('input[name=isElevator]:checked').value,
        website: document.getElementById("website").value,
        employeeId: employeeId
    };
    const response = await getFromDatabaseWithStatus('/hotel/create', newHotel);
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie utworzono hotel!';
    }
    else{
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function addNewServiceForm(hotelId){

    const Hotel = {hotelId: hotelId};
    const otherServices = await getFromDatabase(`${url}/hotel/services/other`, Hotel);
    
    let submenu = '<form name="addService">';
        submenu += `<p>Dodaj usługę z bazy:</p>`;
        submenu += `<select name="newServiceSelect" id="newServiceSelect">`;
        for(let i=0; i<otherServices.length; i++){
            if(otherServices[i].id_hotel != hotelId)
            submenu += 
            `<option value="${otherServices[i].id_usluga}"}>${otherServices[i].nazwa}</option>`;
        }
        submenu += '</select></br>';
        submenu += '<input type="button" value="Dodaj usługę"';
        submenu += `onclick="addNewService(${hotelId})" />`;
        submenu += `</form>`;
    document.getElementById('submenu').innerHTML = submenu;
}

async function addNewService(hotelId){
    const newServiceId = document.getElementById('newServiceSelect').value;
    const Service = { newServiceId: newServiceId};

    const response = await getFromDatabaseWithStatus(`/hotel/${hotelId}/addService`, Service);
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie dodano usługę!';
        await manageHotelServices(hotelId);
    }
    else{
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function addNewStandardForm(hotelId){
    const freeStandards = await getFromDatabase(`/standards/${hotelId}/others`);
    let submenu = '<form name="addEmployee">';
        submenu += `<p>Dodaj standard z bazy:</p>`;
        submenu += `<select name="newStandardSelect" id="newStandardSelect">`;
        for(let i=0; i<freeStandards.length; i++){
            submenu += 
            `<option value="${freeStandards[i].id_standard}"}>${freeStandards[i].nazwa}</option>`;
        }
        submenu += '</select></br>';
        submenu += '<input type="button" value="Dodaj standard"';
        submenu += `onclick="addNewStandard(${hotelId})">`;
        submenu += `</form>`;
    document.getElementById('submenu').innerHTML = submenu;
}


async function addNewStandard(hotelId){
    const newStandardId = document.getElementById('newStandardSelect').value;
    const Standard = { newStandardId: newStandardId};

    const response = await getFromDatabaseWithStatus(`/hotel/${hotelId}/addStandard`, Standard);
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie dodano standard!';
        await manageRoomStandards(hotelId);
    }
    else{
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function checkSalaries(employeeId){
    const Employee = {employeeId: employeeId};
    const salaries = await getFromDatabase('/employee/salaries', Employee);
    if(salaries){
        let salaryTable = `<table><tr><th>Nazwa hotelu</th><th>Wynagrodzenie</th></tr>`;
        for(let i=0; i<salaries.length; i++){
            salaryTable += `<tr><td>${salaries[i].nazwa_hotelu}</td><td>${salaries[i].wynagrodzenie}</td></tr>`
        }
        salaryTable += `</table>`;
        document.getElementById('tableContent').innerHTML = salaryTable;
    }
    else{
        document.getElementById('tableContent').innerHTML = 
        'Nie pracujesz jeszcze w żadnym z hoteli, '
        + 'dlatego wynagrodzenia się nie wyświetlają';
    }
}


async function addNewRoomForm(hotelId){
    const hotelRooms = await getFromDatabase(`/hotel/${hotelId}/rooms`);
    let floor = 1;
    if(hotelRooms){
        floor = parseInt(hotelRooms.length / 5) + 1;
    }
    const hotelStandards = await getFromDatabase(`/hotel/${hotelId}/standards`);
    let submenu = '<form name="addRoom">';
    
    // na początku standard
        submenu += `<p>Wybierz standard:</p>`;
        submenu += `<select name="roomStandardSelect" id="roomStandardSelect">`;
        for(let i=0; i<hotelStandards.length; i++){
            submenu += 
            `<option value="${hotelStandards[i].id_standard}"}>${hotelStandards[i].nazwa}</option>`;
        }
        submenu += '</select></br>';
        submenu += '<input type="button" value="Dodaj pokój"';
        submenu += `onclick="addNewRoom(${hotelId}, ${floor})">`;
        submenu += `</form>`;
    document.getElementById('submenu').innerHTML = submenu;

    document.getElementById('actionStatus').innerHTML = 'Jeśli lista "Wybierz standard" jest pusta oznacza to, że należy dodać standard do hotelu';
}

async function addNewRoom(hotelId, floor){
    const newStandardId = document.getElementById('roomStandardSelect').value;
    const Room = { standardId: newStandardId, hotelId: hotelId, floor};

    const response = await getFromDatabaseWithStatus(`/hotel/${hotelId}/addRoom`, Room);
    if(response.status === 200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie dodano pokój!';
        await manageHotelRooms(hotelId);
    }
    else{
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}

async function deleteReservation(hotelId, reservationId){
    const response = await getFromDatabaseWithStatus(`${url}/reservations/${reservationId}/delete`);

    if(response.status===200){
        document.getElementById('actionStatus').innerHTML = 'Pomyślnie usunięto rezerwację';
        if(window.location.href == `${url}/employee/hotels`)
            await manageRoomReservations(hotelId);
        else if(window.location.href == `${url}/guest`)
            guestReservations();
    }
    else{
        document.getElementById('actionStatus').innerHTML = response.result.error;
    }
}
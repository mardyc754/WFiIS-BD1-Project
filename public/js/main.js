async function getFromDatabase(url, Body){
    try {
        const response = await fetch(url,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify(Body) // dla POST
        });
        console.log(response.status);
        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
        return {};
    } 
}

async function getFromDatabaseWithStatus(url, Body){
    try {
        const response = await fetch(url,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify(Body) // dla POST
        });
        console.log(response.status);
        const result = await response.json();
        return {result: result, status: response.status};
    } catch (error) {
        console.log(error);
    } 
}

async function loginHandler(event, role) {
    event.preventDefault();
    const User = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
        const response = await getFromDatabaseWithStatus(`${url}/login${role}`, User);
        
        if(response.result.length === 1){
            if(role === 'Guest'){
                sessionStorage.setItem('guestId', response.result[0].id_gosc);
                sessionStorage.setItem('isGuest', true);
                sessionStorage.setItem('isEmployee', false);
            }
            else if(role === 'Employee'){
                sessionStorage.setItem('employeeId', response.result[0].id_employee);
                sessionStorage.setItem('isGuest', false);
                sessionStorage.setItem('isEmployee', true);
            }
            
            window.location.href = "/" + role.toLowerCase();
        } else {
            document.getElementById('actionStatus').innerHTML = 'Podanego użytkownika nie ma w bazie';
        }
}

async function registrationHandler(event, role) {
    event.preventDefault();
    const newUser = {
        name: document.querySelector("#name").value,
        lastName: document.querySelector("#lastName").value,
        phone: document.querySelector("#phone").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value
    };

    const response = await getFromDatabaseWithStatus(`${url}/register${role}`, newUser);
    if(response.status === 409) {
        document.getElementById('actionStatus').innerHTML = 'Konto o podanym adresie e-mail istnieje w bazie';
    } else if(response.status === 201) {
        alert("Rejestracja przebiegła pomyślnie!");
        window.location.href = "/";
    }
} 



window.onload = (event) =>{

    if(window.location.href === url + '/hotels'){
        loadHotelList();
    }
    if(window.location.href === url + '/guest/makeReservation'){
        getGuestMoney();
        loadRoomsInHotel(event);
    }

    if(window.location.href === url + '/guest'){
        getGuestMoney();
    }
}
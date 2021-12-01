import { url } from './common.js';

window.addEventListener('load', () => getProfileInfo());

const getProfileInfo = () => {
    document.getElementById("fname").placeholder = sessionStorage.firstName;
    document.getElementById("lname").placeholder = sessionStorage.lastName;
    document.getElementById("biography").placeholder = sessionStorage.bio;
    document.getElementById("password").placeholder = "********";
}

const saveChangesButton = document.getElementById("button_edit");
saveChangesButton.addEventListener("click", (event) => handleProfileEdit(event));

const handleProfileEdit = (event) => {
    event.preventDefault();

    const username = sessionStorage.username;
    const token = sessionStorage.token;
    const visibility = sessionStorage.visibility;

    const firstName = document.getElementById("fname").value;
    const lastName = document.getElementById("lname").value;
    const bio = document.getElementById("biography").value;
    const password = document.getElementById("password").value;

    // Edit user info
    fetch(`${url}/user/${token}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            { 
                firstName: firstName, 
                password: password, 
                lastName: lastName, 
                username: username, 
                bio: bio, 
                visibility: visibility 
            }
        )
    }).then((response) => {
        if (response.ok) {
            // Update placeholders
            if (firstName != "") {
                sessionStorage.firstName = firstName;
            }
            if (lastName != "") {
                sessionStorage.lastName = lastName;
            }
            if (bio != "") {
                sessionStorage.bio = bio;
            }

            alert(`O utilizar ${username} foi editado com sucesso!`);
            location.reload();
        } else {
            console.error(`Erro: não foi possível editar o perfil.`)
            throw new Error("não foi possível editar o perfil.");
        }
    }).catch(alert);
}
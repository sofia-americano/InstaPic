import { url } from './common.js';

const createButton = document.getElementById("create_button");
createButton.addEventListener("click", () => handleCreate());

const handleCreate = () => {
    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const username = document.getElementById("user_name").value;
    const password = document.getElementById("password").value;
    const bio = document.getElementById("biography").value;
    const visibility = "PRIVATE";

    fetch(`${url}/user`, {
        method: "post",
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
        if (response.ok){
            alert(`O utilizador ${username} foi criado com sucesso!`);
            location.replace('login.html');
        } else {
            return response.text();
        }
    }).then((responseBody) => {
        if (responseBody != undefined) {
            if (responseBody.includes("Username already exists")) {
                throw new Error (`o utilizador ${username} já existe. Pode recuperar a sua conta via email.`);
            } else {
                throw new Error ("não foi possível criar o novo utilizador.");
            }
        }
    }).catch(alert);
}
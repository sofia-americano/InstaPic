import { url } from './common.js';

const loginButton=document.getElementById("login_button");
loginButton.addEventListener("click", ()=>handleLogin());

const handleLogin=()=>{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Login user
    fetch(`${url}/login`,{
        method: "post",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(
            {
                username: username,
                password: password
            }
        )
    }).then((response) => {
        if (response.ok){
            return response.text();
        } else {
            console.error(`Erro: credenciais inválidas!`);
            throw new Error("credenciais inválidas!");
        }
    }).then((token) => {
        sessionStorage.token = token;
        sessionStorage.username = username;

        location.assign('feed.html');
    }).catch(alert);
}
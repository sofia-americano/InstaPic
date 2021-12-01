import { url } from './common.js';

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => handleLogout());

const handleLogout = () => {
    const username = sessionStorage.username;
    const token = sessionStorage.token;

    // Logout user
    fetch(`${url}/logout/${username}/${token}`, {
        method: "post",
    }).then((response) => {
        if (response.ok) {
            sessionStorage.clear();
        } else {
            location.assign('login.html');
            console.error(`Error: could not logout.`)
            throw new Error("could not logout.");
        }
        location.assign('login.html');
    }).catch(alert);
}
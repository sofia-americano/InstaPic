import { url } from './common.js';

//#region On Page Loading

window.addEventListener('load', () => getSearchedUser());

// Get Searched User
const getSearchedUser = () => {
    const searchedUser = localStorage.searchedUser;

    fetch(`${url}/user`, {
        method: "get",
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.error(`Erro: o utilizador ${searchedUser} não existe.`);
            throw new Error(`o utilizador ${searchedUser} não existe.`);
        }
    }).then((body) => {
        for (const user of body) {
            const username = user.username;
            
            if (username.includes(searchedUser)) {
                addTableRow(username);
            }
        }
    }).catch(alert);
}

// Add row with user to the result table
const addTableRow = (username) => {  
    const table = document.getElementById("user_results_table");  
    const rowCount = table.rows.length;  
    const row = table.insertRow(rowCount);  
    
    // User Column
    const userCell = row.insertCell(0);  
    const userElement = document.createElement("a");  
    userElement.href = "other_profile.html";
    userElement.innerText = username;
    userCell.appendChild(userElement); 
}  

//#endregion

//#region On Click of Username

const userTable = document.getElementById('user_results_table');
userTable.addEventListener("click", (event) => onUserSelection(event));

const onUserSelection = (event) => {
    localStorage.selectedUser = event.target.innerText;
}

//#endregion
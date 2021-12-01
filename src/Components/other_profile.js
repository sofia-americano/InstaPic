import { url, aSeguir, Seguir } from './common.js';

const selectedUser = localStorage.selectedUser;
const username = sessionStorage.username;
const token = sessionStorage.token;

const followButton = document.getElementById("follow_button");

let isFollowed = false;

//#region On Page Loading

window.addEventListener('load', () => getProfileInfo());

// Get profile details
const getProfileInfo = () => {
    document.getElementById('username').innerHTML = selectedUser;

    // Get selected user's photos
    getProfilePhotos();

    // If selected user is followed by main user, disable the follow button
    if (isSelectedUserFollowed()) {
        isFollowed = true;
        followButton.innerText = aSeguir;
    } else {
        isFollowed = false;
        followButton.innerText = Seguir;
    }
}

// Get selected user's photos
const getProfilePhotos = () => {
    fetch(`${url}/photo/${selectedUser}`, {
        method: "get",
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.error(`Erro: não foi possível obter as fotos do utilizador ${selectedUser}.`);
            throw new Error(`não foi possível obter as fotos do utilizador ${selectedUser}.`);
        }
    }).then((body) => {
        document.getElementById('publication_count').innerHTML = 'Fotos: ' + body.length;

        const leftValues = [500, 720, 940];
        const marginTop = 350;
        const marginTopDiff = 180;
        const picturesPerRow = 3;

        let row = 0;
        let column = 0;

        for (const photo of body) {
            const elem = document.createElement("img");
            elem.src = `data:image/${photo.format};base64,${photo.pictureBytes}`;
            elem.id = `user-photos`;
            elem.style.cssText = `left: ${leftValues[column]}px; margin-top: ${marginTop + marginTopDiff * row}px;`;
            document.getElementById("profile_feed").appendChild(elem);

            if (column === (picturesPerRow - 1)) {
                column = 0;
                row++;
            } else {
                column++;
            }
        }
    })
}

// Validate if selected user is followed by main user
const isSelectedUserFollowed = () => {
    fetch(`${url}/user/details/${username}/${token}`, {
        method: "get",
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.error(`Erro: não foi possível obter informação do utilizador ${username}.`);
            throw new Error(`não foi possível obter informação do utilizador ${username}.`);
        }
    }).then((body) => {
        if (body.following.includes(selectedUser)) {
            return true;
        }
        return false;
    })
}

//#endregion

//#region On Follow Click

// Call the handleUser function on click of follow button
followButton.addEventListener("click", () => handleUser());

// Validate if the follow user or the unfollow user api should be called
const handleUser = () => {
    if (isFollowed) {
        unfollowUser();
    } else {
        followUser();
    }
}

// Call api to follow user
const followUser = () => {
    fetch(`${url}/user/follow/${username}/${selectedUser}/${encodeURIComponent(token)}`, {
        method: "PATCH"
    }).then((response) => {
        console.log(response)
        if (response.ok) {
            isFollowed = true;
            followButton.innerText = aSeguir;
        } else {
            throw new Error(`não foi possível seguir o utilizador ${selectedUser}.`);
        }
    }).catch(alert);
}

// Call api to unfollow user
const unfollowUser = () => {
    fetch(`${url}/user/unfollow/${username}/${selectedUser}/${token}`, {
        method: "delete"
    }).then((response) => {
        if (response.ok) {
            isFollowed = false;
            followButton.innerText = Seguir;
        } else {
            throw new Error(`não foi possível deixar de seguir o utilizador ${selectedUser}.`);
        }
    }).catch(alert);
}

//#endregion
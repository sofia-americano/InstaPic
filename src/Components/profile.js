import { url } from './common.js';

//#region On Page Loading

window.addEventListener('load', () => getProfileInfo());

// Get Profile Info and Setup Page
const getProfileInfo = () => {
    const username = sessionStorage.username;
    const token = sessionStorage.token;

    // Setup Profile Page
    getUserDetails(username, token);
}

// Get User Details and Photos
const getUserDetails = (username, token) => {
    document.getElementById('username').innerHTML = username;

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
        // Details
        document.getElementById('complete_name').innerHTML = body.firstName + ' ' + body.lastName;
        document.getElementById('following_count').innerHTML = 'A seguir: ' + body.following.length;
        document.getElementById('biography').innerHTML = 'Bio: ' + body.bio;

        sessionStorage.firstName = body.firstName;
        sessionStorage.lastName = body.lastName;
        sessionStorage.bio = body.bio;
        sessionStorage.visibility = body.visibility;

        // Photos
        document.getElementById('publication_count').innerHTML = 'Fotos: ' + body.photos.length;

        const leftValues = [500, 720, 940];
        const marginTop = 350;
        const marginTopDiff = 180;
        const picturesPerRow = 3;

        let row = 0;
        let column = 0;

        for (const photo of body.photos) {
            const photoContainer = document.createElement("div");
            photoContainer.id=`photo${photo.id}`;
            const elem = document.createElement("img");
            elem.src = `data:image/${photo.format};base64,${photo.pictureBytes}`;
            elem.id = `${photo.id}`;
            elem.style.cssText = `left: ${leftValues[column]}px; margin-top: ${marginTop + marginTopDiff * row}px;`;
            
            const removePhotoButton= document.createElement("button");
            removePhotoButton.innerText="Remove Photo";
            removePhotoButton.addEventListener("click",()=>{

                fetch(`${url}/photo/${photo.id}/${sessionStorage.token}`,{
                    method:"DELETE"
                }).then((response)=>{
                    if(response.ok){
                        const photoContainerToBeRemoved=document.getElementById(`photo${photo.id}`)
                        photoContainerToBeRemoved.parentNode.removeChild(photoContainer)
                        return;
                    }
                    throw new Error("Could not delete photo");
                }).catch(alert);
            })
            
            photoContainer.appendChild(elem)
            photoContainer.appendChild(removePhotoButton);
            document.getElementById("profile_feed").appendChild(photoContainer);

            if (column === (picturesPerRow - 1)) {
                column = 0;
                row++;
            } else {
                column++;
            }
        }
    })
}

//#endregion

//#region On Image Input

// Get the modal
var imageUploadModal = document.getElementById("imageUploadModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Function to close the modal
const closeModal = () => {
    imageUploadModal.style.display = "none";
    location.reload();
}

// When the user clicks on <span> (x), close the modal
span.onclick = () => closeModal();

// Store file to send to server
let fileToStore;

// Call the openImageUploadModal function on image input
const imageInputButton = document.getElementById("file-input");
imageInputButton.addEventListener("input", (event) => openImageUploadModal(event));

// When the user clicks on the button, open the modal
const openImageUploadModal = (event) => {
    event.preventDefault();
    imageUploadModal.style.display = "block";

    fileToStore = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(fileToStore);
    reader.onload = () => {
        document.getElementById("uploadedImage").src = reader.result;
    }
}

// Call the handleImageUpload function on image upload
const imageUploadButton = document.getElementById("submitImage");
imageUploadButton.addEventListener("click", () => handleImageUpload());

// Send photo to the server
const handleImageUpload = () => {
    const username = sessionStorage.username;
    const token = sessionStorage.token;
    const imageDescription = document.getElementById("uploadedImageDescription").value;
    const photoVisibility = document.getElementById("visibility-selected").value;

    const formData = new FormData();
    formData.append("file", fileToStore); 
    
    // Add image
    fetch(`${url}/photo/${username}/${imageDescription}/${photoVisibility}/${token}`, {
        method: "post",
        body: formData
    }).then((response) => {
        if (response.ok){
            alert(`Foto adicionada com sucesso!`);
        } else {
            closeModal();
            throw new Error(`não foi possível adicionar a foto.`);
        }
        closeModal();
    }).catch(alert);
}

//#endregion
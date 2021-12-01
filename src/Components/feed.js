//getAllFavorites , getAllUSers , getAllPhotos
import {url} from './common.js';
window.onload=()=>{
    console.log("page loaded");
    fetch(`${url}/user/details/${sessionStorage.username}/${sessionStorage.token}`,{})
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
        throw new Error("Could not fetch user photo")
    }).then((userDetails)=>{
        const photosDiv=document.getElementById("photos");
        console.log(userDetails.photos);
        userDetails.photos.forEach(photo=>{

            let photoElement=document.createElement("img");
            photoElement.src=`data:image/${photo.format};base64,${photo.pictureBytes}`
            photosDiv.append(photoElement);
        })
    })
    .catch(alert);
}
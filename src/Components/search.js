const searchButton = document.getElementById("search_button");
searchButton.addEventListener("click", () => handleSearch());

const handleSearch = () => {
    localStorage.searchedUser = document.getElementById("search_id").value;
}
document.querySelector("#state").addEventListener("change", loadCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#password").addEventListener("click", generatePassword);
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#signupForm").addEventListener("submit", validateForm);

loadStates();

async function validateForm(event) {
    event.preventDefault();

    let isValid = true;

    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");

    usernameError.textContent = "";

    // Username required CHECK
    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        isValid = false;
    } else {
        // Check if username is available
        let usernameAvailable = await checkUsername();

        if (usernameAvailable === false) {
            isValid = false;
        }
    }

    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;
    let passwordError = document.querySelector("#passwordError");

    passwordError.textContent = "";

    // Password length CHECK
    if (password.length < 6) {
        document.querySelector("#passwordError").textContent = "Password must be at least 6 characters long";
        document.querySelector("#passwordError").style.color = "red";
        isValid = false;
    } else {
        // Passwords must match CHECK
        if (password !== passwordAgain) {
            document.querySelector("#passwordError").textContent = "Passwords do not match";
            document.querySelector("#passwordError").style.color = "red";
            isValid = false;
        } else {
            document.querySelector("#passwordError").textContent = "";
        }
    }

    if (isValid) {
        document.querySelector("#signupForm").submit();
    }
}

async function checkUsername() {
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");

    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        return false;
    }

    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.available) {
        usernameError.textContent = "Username available!";
        usernameError.style.color = "green";
        return true;
    } else {
        usernameError.textContent = "Username taken";
        usernameError.style.color = "red";
        return false;
    }
}

async function generatePassword() {
    let url = "https://csumb.space/api/suggestedPassword.php?length=8";
    let response = await fetch(url);
    let data = await response.json();

    document.querySelector("#suggestedPassword").textContent = `${data.password}`;
    document.querySelector("#suggestedPassword").style.color = "orange";
}

async function displayCity() {
    document.querySelector("#city").style.color = "white";
    try {
        let zipCode = document.querySelector("#zip").value;
        let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
        let response = await fetch(url);
        let data = await response.json();

        //the API returns false when the zip code is not found, so we can check for that case before trying to access the city property
        if (data === false) {
            document.querySelector("#city").textContent = "Error: Zip code not found";
            document.querySelector("#city").style.color = "red";
            document.querySelector("#city").style.fontWeight = "bold";

            document.querySelector("#latitude").textContent = "";
            document.querySelector("#longitude").textContent = "";
            return;
        }

        document.querySelector("#city").textContent = data.city;
        document.querySelector("#city").style.fontWeight = "bold";
        document.querySelector("#latitude").textContent = data.latitude;
        document.querySelector("#latitude").style.fontWeight = "bold";
        document.querySelector("#longitude").textContent = data.longitude;
        document.querySelector("#longitude").style.fontWeight = "bold";

    } catch (error) {
        document.querySelector("#city").textContent = "Unable to retrieve city";
        document.querySelector("#latitude").textContent = "Unable to retrieve latitude";
        document.querySelector("#longitude").textContent = "Unable to retrieve longitude";
        console.error(error);
    }
}

async function loadStates() {
    let stateMenu = document.querySelector("#state");

    stateMenu.textContent = "";

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select One";
    stateMenu.appendChild(defaultOption);

    try {
        let url = "https://csumb.space/api/allStatesAPI.php";
        let response = await fetch(url);
        let data = await response.json();

        for (let item of data) {
            let option = document.createElement("option");
            option.value = item.usps;
            option.textContent = item.state;
            stateMenu.appendChild(option);
        }
    } catch (error) {
        console.error(error);

        stateMenu.textContent = "";

        let errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Unable to load states";
        stateMenu.appendChild(errorOption);
    }
}

async function loadCounties() {
    let countyMenu = document.querySelector("#county");
    let state = document.querySelector("#state").value;

    countyMenu.textContent = "";

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "";

    if (state === "") {
        defaultOption.textContent = "";
        countyMenu.appendChild(defaultOption);
        return;
    }
    defaultOption.textContent = "Select One";
    countyMenu.appendChild(defaultOption);

    try {
        let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
        let response = await fetch(url);
        let data = await response.json();

        for (let item of data) {
            let option = document.createElement("option");
            option.value = item.county;
            option.textContent = item.county;
            countyMenu.appendChild(option);
        }
    } catch (error) {
        console.error(error);

        countyMenu.textContent = "";

        let errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Unable to load counties";
        countyMenu.appendChild(errorOption);
    }
}



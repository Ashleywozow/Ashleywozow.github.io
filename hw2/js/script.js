// Reset scroll position to top of page on reload
if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {
    window.scrollTo(0, 0);
});

// Timer functionality
let timeLeft = 300;

let timer = setInterval(function () {
    timeLeft--;

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    document.querySelector("#timer").textContent = `Time Left: ${minutes}:${seconds}`;
    document.querySelector("#timer").style.position = "sticky";
    document.querySelector("#timer").style.top = "0";


    if (timeLeft === 0) {
        clearInterval(timer);
        gradeQuiz();
    }
}, 1000);

// Event listeners
document.querySelector("button").addEventListener("click", gradeOrReset);
document.querySelector("#q8").addEventListener("input", function () {
    document.querySelector("#q8Value").textContent = this.value;
});


// Quiz grading/form functionality
let score = 0;
displayQ4Choices();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function displayQ4Choices() {
    let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
    shuffleArray(q4ChoicesArray);

    let choicesContainer = document.querySelector("#q4Choices");
    choicesContainer.textContent = "";

    for (let choice of q4ChoicesArray) {
        let input = document.createElement("input");
        input.type = "radio";
        input.name = "q4";
        input.id = choice;
        input.value = choice;

        let label = document.createElement("label");
        label.htmlFor = choice;
        label.textContent = choice;

        choicesContainer.appendChild(input);
        choicesContainer.appendChild(label);
        choicesContainer.appendChild(document.createTextNode(" "));
    }
}

function isFormValid() {
    let isValid = true;
    let q1Response = document.querySelector("#q1").value;
    let validationFdbk = document.querySelector("#validationFdbk");

    if (q1Response === "") {
        isValid = false;
        validationFdbk.textContent = "Question 1 was not answered";
    }

    return isValid;
}

function setMarkImage(index, imageName, altText) {
    let markContainer = document.querySelector(`#markImg${index}`);
    markContainer.textContent = "";

    let img = document.createElement("img");
    img.src = `img/${imageName}`;
    img.alt = altText;

    if (index === 11) {
        img.width = 100;
        img.height = 100;
    } else {
        img.width = 35;
        img.height = 35;
    }

    markContainer.appendChild(img);
}

function rightAnswer(index) {
    let feedback = document.querySelector(`#q${index}Feedback`);
    feedback.textContent = "Correct!";
    feedback.className = "bg-success text-white";
    setMarkImage(index, "checkmark.png", "Checkmark");
    score += 10;
}

function wrongAnswer(index) {
    let feedback = document.querySelector(`#q${index}Feedback`);
    feedback.textContent = "Incorrect!";
    feedback.className = "bg-warning text-white";
    setMarkImage(index, "xmark.png", "X mark");
}

function gradeQuiz() {
    clearInterval(timer);
    
    document.querySelector("#validationFdbk").textContent = "";
    document.querySelector("#scoreMessage").textContent = "";
    document.querySelector("#markImg11").textContent = "";

    if (!isFormValid()) {
        return;
    }

    score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q2Response = document.querySelector("#q2").value;

    if (q1Response === "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }

    if (q2Response === "mo") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    if (document.querySelector("#Jefferson").checked &&
        document.querySelector("#Roosevelt").checked &&
        !document.querySelector("#Jackson").checked &&
        !document.querySelector("#Franklin").checked) {
        rightAnswer(3);
    } else {
        wrongAnswer(3);
    }

    let selectedQ4 = document.querySelector("input[name=q4]:checked");

    if (selectedQ4 !== null && selectedQ4.value === "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    let q5Response = document.querySelector("#q5").value;
    if (q5Response === "50") {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }

    let q6Response = document.querySelector("#q6").value;
    if (q6Response.endsWith("-06")) {
        rightAnswer(6);
    } else {
        wrongAnswer(6);
    }

    let q7Response = document.querySelector("#q7").value.toLowerCase();
    if (q7Response === "oregon" || q7Response === "nevada" || q7Response === "arizona") {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }

    let q8Response = document.querySelector("#q8").value;
    if (q8Response === "5") {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }

    let q9Response = document.querySelector("#q9").value.toLowerCase();
    if (q9Response === "austin") {
        rightAnswer(9);
    } else {
        wrongAnswer(9);
    }

    let q10Response = document.querySelector("#q10").value;
    if (q10Response === "fl") {
        rightAnswer(10);
    } else {
        wrongAnswer(10);
    }

    let attempts = localStorage.getItem("total_attempts");

    if (attempts === null) {
        attempts = 0;
    } else {
        attempts = Number(attempts);
    }

    document.querySelector("#totalScore").textContent = `Total Score: ${score} pts`;
    let finalResult = document.querySelector("#finalResult");

    if (score > 80) {
        document.querySelector("#scoreMessage").textContent = "Congratulations! You passed the quiz!";
        finalResult.className = "mt-4 p-4 bg-success text-white";
        setMarkImage(11, "congrats.png", "Congrats");
    } else {
        document.querySelector("#scoreMessage").textContent = "Better luck next time! Give it another try!";
        finalResult.className = "mt-4 p-4 bg-warning text-dark";
        setMarkImage(11, "tryagain.png", "Try Again");
    }

    disableForm();

    document.querySelector("button").textContent = "Reset Quiz";

    attempts++;
    document.querySelector("#totalAttempts").textContent = `Total Attempts: ${attempts}`;
    localStorage.setItem("total_attempts", attempts);
}

function resetQuiz() {
    location.reload();
}

function gradeOrReset() {
    if (document.querySelector("#totalScore").textContent === "") {
        gradeQuiz();
    } else {
        resetQuiz();
    }
}

function disableForm() {
    let inputs = document.querySelectorAll("input");
    for (let input of inputs) {
        input.disabled = true;
    }
    let selects = document.querySelectorAll("select");
    for (let select of selects) {
        select.disabled = true;
    }
    let textareas = document.querySelectorAll("textarea");
    for (let textarea of textareas) {
        textarea.disabled = true;
    }
}


// declared variables

const inputNumber = document.getElementById("inputNumber");
let fibY = document.getElementById("fibYContainer");
const resultsWrapper = document.getElementById("resultsWrapper");
const resultsContainer = document.getElementById("resultsContainer");
const fibYInputWrapper = document.getElementById("fibYInputWrapper");
const submitButton = document.getElementById("btn");
const spinnerNumber = document.getElementById("spinnerNumber");
const spinnerResults = document.getElementById("spinnerResults");
const checkForm = document.getElementById("checkForm");
const checkBox = document.getElementById("checkBox");
const selector = document.getElementById("selector");
const numAsc = document.getElementById("numAsc");
const numDesc = document.getElementById("numDesc");
const dateAsc = document.getElementById("dateAsc");
const dateDesc = document.getElementById("dateDesc");

spinnerNumber.style.visibility = "hidden";
spinnerResults.style.visibility = "hidden";

const fibonacciRecursive = (n) => {
  if (n < 1) {
    return 0;
  }
  if (n <= 2) {
    return 1;
  }
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
};

const getFibFromServer = async (fibX) => {
  const urlFibServ = `http://localhost:5050/fibonacci/${fibX}`;
  try {
    const responseFib = await fetch(urlFibServ);
    spinnerNumber.style.visibility = "visible";

    if (!responseFib.ok) {
      let errorMessage = await responseFib.text();
      fibY.innerText = `Server Error: ${errorMessage}`;
      styleServerError();
    }
    const data = await responseFib.json();
    spinnerNumber.style.visibility = "hidden";
    fibY.innerHTML = data.result;
    styleMyFibY();
  } catch (error) {
    spinnerNumber.style.visibility = "hidden";
    resultsWrapper.style.visibility = "hidden";
    checkForm.style.visibility = "hidden";
    console.log(error);
  }
};

const checkForErrors = async (e) => {
  const fibX = inputNumber.value;
  e.preventDefault();
  fibY.innerHTML = "";

  if (fibX >= 50) {
    styleMyErrors();
    fibY.innerText = "Can't be larger than 50";
  } else if (fibX < 1) {
    styleMyErrors();
    fibY.innerText = "Can't be less than 1";
  } else if (checkBox.checked == true) {
    displayPreviousResults("dateDesc");
    await getFibFromServer(fibX);
    resultsWrapper.style.visibility = "visible";
    checkForm.style.visibility = "visible";
  } else {
    styleMyFibY();
    fibY.innerHTML = fibonacciRecursive(fibX);

    if (fibX == 42) {
      fibY.innerText = "Server Error: 42 is the meaning of life";
      styleServerError();
    }
  }
};

const displayPreviousResults = async (order) => {
  resultsContainer.innerHTML = "";
  const urlResults = `http://localhost:5050/getFibonacciResults`;
  const responseResults = await fetch(urlResults);
  spinnerResults.style.visibility = "visible";
  const dataResults = await responseResults.json();
  spinnerResults.style.visibility = "hidden";

  if (order == "numAsc") {
    dataResults.results.sort(function (a, b) {
      return a.number - b.number;
    });
  } else if (order == "numDesc") {
    dataResults.results.sort(function (a, b) {
      return b.number - a.number;
    });
  } else if (order == "dateAsc") {
    dataResults.results.sort(function (a, b) {
      return a.createdDate > b.createdDate ? 1 : -1;
    });
  } else if (order == "dateDesc") {
    dataResults.results.sort(function (a, b) {
      return b.createdDate > a.createdDate ? 1 : -1;
    });
  }

  for (let i = 0; i < dataResults.results.length; i++) {
    let dateStr = JSON.parse(dataResults.results[i].createdDate);
    let date = new Date(dateStr);
    let number = dataResults.results[i].number;
    let result = dataResults.results[i].result;

    let results = document.createElement("li");
    results.classList.add("results");
    results.classList.add("d-inline-block");
    results.innerHTML = `The Fibonacci Of <strong>${number}</strong> is <strong>${result}</strong>. Calculated at: ${date}`;
    dataResults.results.splice(10);
    resultsContainer.appendChild(results);
    const appendHR = document.createElement("hr");
    results.appendChild(appendHR);
  }
};

const styleMyErrors = () => {
  fibY.classList.remove("fiby-number");
  fibY.classList.remove("fw-bold");
  fibYInputWrapper.classList.add("fiby-wrapper");
  fibY.classList.add("fiby-error");
  inputNumber.classList.add("input-number");
  resultsWrapper.style.visibility = "hidden";
  checkForm.style.visibility = "hidden";
};

const styleServerError = () => {
  fibY.classList.remove("fiby-number");
  fibY.classList.remove("fiby-error");
  fibY.classList.remove("fiby-wrapper");
  fibY.classList.remove("fw-bold");
  fibY.classList.add("text-danger");
  fibY.classList.add("fw-normal");
  fibY.classList.add("fs-6");
};

const styleMyFibY = () => {
  inputNumber.classList.remove("input-number");
  fibY.classList.remove("fiby-error");
  fibY.classList.remove("text-danger");
  fibY.classList.add("fiby-number");
  fibY.classList.add("fw-bold");
  resultsWrapper.style.visibility = "visible";
  checkForm.style.visibility = "visible";
};

selector.addEventListener("click", (event) => {
  displayPreviousResults(event.target.id);
});

submitButton.addEventListener("click", checkForErrors);
displayPreviousResults();

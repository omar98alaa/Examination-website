var nameRegx = /^[a-zA-z]+$/;
var emailRegx = /^[a-zA-Z0-9_+\-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/;

var FirstName = "";
var LastName = "";
var Email = "";
var Password = "";
var PassConfirmation = "";

function validateName(e) {
  var inputField = e.target;
  var errorMsg = inputField.nextElementSibling;

  if (!nameRegx.test(inputField.value)) {
    inputField.classList.add("error-input");
    errorMsg.classList.add("error-msg-visible");

    if (inputField.id === "firstName") {
      FirstName = "";
    } else {
      LastName = "";
    }
  } else {
    inputField.classList.remove("error-input");
    errorMsg.classList.remove("error-msg-visible");

    if (inputField.id === "firstName") {
      FirstName = inputField.value;
    } else {
      LastName = inputField.value;
    }
  }
}

function validateEmail(e) {
  var inputField = e.target;
  var errorMsg = inputField.nextElementSibling;

  if (!emailRegx.test(inputField.value)) {
    inputField.classList.add("error-input");
    errorMsg.classList.add("error-msg-visible");

    Email = "";
  } else {
    inputField.classList.remove("error-input");
    errorMsg.classList.remove("error-msg-visible");

    Email = inputField.value;
  }
}

function validatePassword(e) {
  var inputField = e.target;
  var errorMsg = inputField.nextElementSibling;
  var passConfirmation = document.getElementById("passConfirmation");

  if (inputField.value.length < 8) {
    inputField.classList.add("error-input");
    errorMsg.classList.add("error-msg-visible");

    Password = "";
  } else {
    inputField.classList.remove("error-input");
    errorMsg.classList.remove("error-msg-visible");

    Password = inputField.value;
  }

  passConfirmation.value = "";
}

function validatePassConfirmation(e) {
  var inputField = e.target;
  var errorMsg = inputField.nextElementSibling;
  var passInp = document.getElementById("password");

  if (inputField.value !== passInp.value) {
    inputField.classList.add("error-input");
    errorMsg.classList.add("error-msg-visible");

    PassConfirmation = "";
  } else {
    inputField.classList.remove("error-input");
    errorMsg.classList.remove("error-msg-visible");

    PassConfirmation = inputField.value;
  }
}

function submitForm(e) {
  e.preventDefault();

  if (FirstName && LastName && Email && Password && PassConfirmation) {
    localStorage.setItem("email", Email);
    localStorage.setItem("password", Password);
    localStorage.setItem("firstName", FirstName);
    localStorage.setItem("lastName", LastName);

    location.replace("index.html");
  }
}

import * as fetchedData from "./receivingData.js";

const cookieForm = document.querySelector(".cookies-request-form ");

let cookiesAccepted = localStorage.getItem("cookiesAccepted");
if (cookiesAccepted) {
  cookieForm.ariaHidden = true;
}

cookieForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (e.submitter.name === "accept") {
    localStorage.setItem("cookiesAccepted", true);
    cookiesAccepted = true;
  } else if (e.submitter.name === "decline") {
    // nothing really happens
  }

  cookieForm.ariaHidden = true;
});

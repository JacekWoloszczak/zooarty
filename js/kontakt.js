const form = document.querySelector("#contactForm");
const fields = form.querySelectorAll("[required]");
const formMessage = form.querySelector(".form-message");

const url = "send-script.php";
form.setAttribute("novalidate", true);

for (const field of fields) {
  field.addEventListener("input", () =>
    field.classList.toggle("is-invalid", !field.checkValidity())
  );
}
function showSubmitError() {
  formMessage.innerHTML = "Wysłanie wiadomości się nie powiodło";
}

function showSubmitSuccess() {
  const div = document.createElement("div");
  div.classList.add("form-send-success");
  form.after(div);
  div.innerHTML = `
      <strong>Wiadomość została wysłana</strong>
      <span>Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej</span>
  `;
  form.remove();
}
function checkRequiredFields() {
  let formErrors = false;

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.classList.add("form-error");
      formErrors = true;
    } else {
      field.classList.remove("form-error");
    }
  }

  return formErrors;
}

function afterSubmit(res) {
  if (res.errors) {
    const selectors = res.errors.map((el) => `[name="${el}"]`);
    const fieldsWithErrors = form.querySelectorAll(selectors.join(","));
    for (const field of fieldsWithErrors) {
      field.classList.add("is-invalid");
    }
  } else {
    if (res.status === "success") {
      showSubmitSuccess();
    }
    if (res.status === "error") {
      showSubmitError(res.status);
    }
  }
}
async function makeRequest(data) {
  const res = await fetch(url, {
    method: "post",
    body: data,
  });
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`${res.status}: ${res.statusText}`);
}
async function submitForm() {
  let formErrors = checkRequiredFields();

  if (!formErrors) {
    const formData = new FormData(form);

    const submit = form.querySelector(".form-submit");
    submit.disabled = true;
    submit.classList.add("loading");
    try {
      const response = await makeRequest(formData);
      afterSubmit(response);
    } catch (err) {
      showSubmitError();
    }

    submit.disabled = false;
    submit.classList.remove("loading");
  }
}


 

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#contactForm").addEventListener("submit", function (e) {
    e.preventDefault();  // Zapobiega przeładowaniu strony

    // Sprawdzamy, czy checkbox jest zaznaczony
    const legalCheckbox = document.querySelector("#legal");
    if (!legalCheckbox.checked) {
      const messageBox = document.querySelector("#messageBox");
      messageBox.textContent = "Musisz zaakceptować Politykę Prywatności, aby wysłać formularz.";
      // messageBox.style.backgroundColor = "red";
      messageBox.style.color = "red";
      messageBox.style.display = "block"; 
      messageBox.style.textAlign="center";
      messageBox.style.width="50%";
      messageBox.style.margin="auto";
      messageBox.style.fontSize="24";
      return;  // Zatrzymujemy wysyłanie formularza
    }

    const formData = new FormData(this);

    fetch("send-script.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      const messageBox = document.querySelector("#messageBox");
      if (data.status === "success") {
        messageBox.textContent = "Wiadomość została wysłana pomyślnie!";
        // messageBox.style.backgroundColor = "green";
        messageBox.style.color = "green";
        messageBox.style.display="block";
        messageBox.style.textAlign="center";
        messageBox.style.width="50%" ;
        messageBox.style.margin="auto";
         messageBox.style.fontSize="24";
      } else {
        messageBox.textContent = data.message || "Wystąpił błąd, spróbuj ponownie.";
        // messageBox.style.backgroundColor = "red";
        messageBox.style.color = "red";
        messageBox.style.display="block";
        messageBox.style.textAlign="center";
        messageBox.style.width="50%" ;
        messageBox.style.margin="auto";
        messageBox.style.fontSize="24";
      }

      // Wyświetla komunikat na stronie
      messageBox.style.display = "block";  // Ujawnia komunikat

      // Opcjonalnie, ukrywa komunikat po 5 sekundach
      setTimeout(() => {
        messageBox.style.display = "none";  // Ukrywa komunikat po 5 sekundach
      }, 5000);
    })
    .catch(error => {
      console.error("Błąd:", error);
      const messageBox = document.querySelector("#messageBox");
      messageBox.textContent = "Wystąpił błąd podczas wysyłania wiadomości.";
      messageBox.style.backgroundColor = "red";
      messageBox.style.color = "white";
      messageBox.style.display = "block";
    });
  });
});
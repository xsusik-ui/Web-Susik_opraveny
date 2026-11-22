document.addEventListener("DOMContentLoaded", function() {
    const menoInput = document.getElementById("meno");
    const emailInput = document.getElementById("email");
    const telefonInput = document.getElementById("telefon");
    const datumInput = document.getElementById("datum");
    const kurzSelect = document.getElementById("kurz");
    const poznamkaTextarea = document.getElementById("poznamka");
    const formElement = document.getElementById("zadanie-form");
    const formWrapper = document.getElementById("form-wrapper");
    const prevMeno = document.getElementById("prev-meno");
    const prevEmail = document.getElementById("prev-email");
    const prevTelefon = document.getElementById("prev-telefon");
    const prevDatum = document.getElementById("prev-datum");
    const prevKurz = document.getElementById("prev-kurz");
    const prevUroven = document.getElementById("prev-uroven");
    const prevPoznamka = document.getElementById("prev-poznamka");
    function updatePreview() {
        prevMeno.textContent = menoInput.value || "-";
        prevEmail.textContent = emailInput.value || "-";
        prevTelefon.textContent = telefonInput.value || "-";
        prevDatum.textContent = datumInput.value || "-";
        prevKurz.textContent = kurzSelect.value || "-";
        const selectedUroven = document.querySelector('input[name="uroven"]:checked');
        prevUroven.textContent = selectedUroven ? selectedUroven.value : "-";

        prevPoznamka.textContent = poznamkaTextarea.value || "-";
    }
    const trackedElements = [menoInput, emailInput, telefonInput, datumInput, kurzSelect, poznamkaTextarea];
    
    trackedElements.forEach(element => {
        element.addEventListener("input", updatePreview);
        element.addEventListener("change", updatePreview);
    });
    const radioButtons = document.querySelectorAll('input[name="uroven"]');
    radioButtons.forEach(radio => {
        radio.addEventListener("change", updatePreview);
    });
    formElement.addEventListener("submit", function(event) {
        event.preventDefault();
        formWrapper.style.display = "none";
        alert("Formulár bol úspešne odoslaný.");
    });
});
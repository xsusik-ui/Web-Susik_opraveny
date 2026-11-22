document.addEventListener("DOMContentLoaded", function() {
    fetch("topbar.html")
        .then(response => response.text())
        .then(data => {
            const topbarContainer = document.getElementById("topbar-container");
            if (topbarContainer) {
                topbarContainer.innerHTML = data;
            }
        })
        .catch(error => console.error("Chyba pri načítavaní topbaru:", error));
    const btnAlert = document.getElementById("btn-alert");
    if (btnAlert) {
        btnAlert.addEventListener("click", function() {
            alert("ERoRR : 404 - Stránka nenájdená(sranda)");
        });
    }
});
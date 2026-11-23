function nacitajPouzivatelov() {
    fetch("/api/pouzivatelia")
        .then(odpoved => odpoved.json())
        .then(pouzivatelia => {
            const zoznam = document.getElementById("zoznamPouzivatelov");
            zoznam.innerHTML = "";

            pouzivatelia.forEach(pouzivatel => {
                const riadok = document.createElement("tr");

                [pouzivatel.id, pouzivatel.meno, pouzivatel.email].forEach(hodnota => {
                    const bunka = document.createElement("td");
                    bunka.textContent = hodnota;
                    riadok.appendChild(bunka);
                });

                const akciaBunka = document.createElement("td");
                const vymazBtn = document.createElement("button");
                vymazBtn.textContent = "Vymazat";
                vymazBtn.onclick = () => {
                    fetch("/api/pouzivatelia/" + pouzivatel.id, { method: "DELETE" })
                        .then(() => nacitajPouzivatelov());
                };
                akciaBunka.appendChild(vymazBtn);
                riadok.appendChild(akciaBunka);

                zoznam.appendChild(riadok);
            });
        });
}

const form = document.getElementById("registraciaForm");
const spravaEl = document.getElementById("sprava");

form.addEventListener("submit", async event => {
    event.preventDefault();

    const novyPouzivatel = {
        meno: document.getElementById("meno").value,
        email: document.getElementById("email").value,
        heslo: document.getElementById("heslo").value
    };

    const odpoved = await fetch("/api/pouzivatelia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novyPouzivatel)
    });

    const text = await odpoved.text();
    spravaEl.textContent = text;
    spravaEl.style.color = odpoved.ok ? "green" : "red";

    if (odpoved.ok) {
        form.reset();
        nacitajPouzivatelov();
    }
});

nacitajPouzivatelov();

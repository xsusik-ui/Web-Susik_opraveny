const POLIA = [
    { kluc: "cena",  popis: "Zmeniť cenu",         typ: "number", step: "0.01" },
    { kluc: "nazov", popis: "Zmeniť názov knihy",  typ: "text" },
    { kluc: "autor", popis: "Zmeniť autora",       typ: "text" },
    { kluc: "rok",   popis: "Zmeniť rok vydania",  typ: "number", step: "1" }
];

function otvorNastavenia(kniha) {
    const pozadie = document.createElement("div");
    pozadie.className = "modal-pozadie";
    const okno = document.createElement("div");
    okno.className = "modal-okno";
    pozadie.appendChild(okno);

    const zatvor = () => pozadie.remove();
    pozadie.onclick = e => { if (e.target === pozadie) zatvor(); };

    function menu() {
        okno.innerHTML = "";
        const h = document.createElement("h2");
        h.textContent = "Nastavenia: " + kniha.nazov;
        okno.appendChild(h);
        POLIA.forEach(pole => {
            const b = document.createElement("button");
            b.textContent = pole.popis;
            b.onclick = () => formular(pole);
            okno.appendChild(b);
        });
        const x = document.createElement("button");
        x.textContent = "Zavrieť";
        x.onclick = zatvor;
        okno.appendChild(x);
    }

    function formular(pole) {
        okno.innerHTML = "";
        const h = document.createElement("h2");
        h.textContent = pole.popis;
        okno.appendChild(h);
        const vstup = document.createElement("input");
        vstup.type = pole.typ;
        if (pole.step) vstup.step = pole.step;
        vstup.value = kniha[pole.kluc];
        okno.appendChild(vstup);

        const ulozit = document.createElement("button");
        ulozit.textContent = "Uložiť";
        ulozit.onclick = () => {
            const hodnota = vstup.value.trim();
            if (hodnota === "") return alert("Hodnota nemôže byť prázdna");
            const nove = { ...kniha, [pole.kluc]: hodnota };
            fetch("/api/knihy/" + kniha.id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nazov: nove.nazov, autor: nove.autor, rok: nove.rok, cena: nove.cena })
            }).then(r => {
                if (!r.ok) return alert("Chyba pri ukladaní");
                zatvor();
                nacitajKnihy();
            });
        };
        okno.appendChild(ulozit);

        const spat = document.createElement("button");
        spat.textContent = "Späť";
        spat.onclick = menu;
        okno.appendChild(spat);
        vstup.focus();
    }

    menu();
    document.body.appendChild(pozadie);
}

function nacitajKnihy() {
    fetch("/api/knihy")
        .then(odpoved => odpoved.json())
        .then(knihy => {
            const zoznam = document.getElementById("zoznam");
            if (!zoznam) return;
            zoznam.innerHTML = "";
            
            knihy.forEach(kniha => {
                const riadok = document.createElement("tr");
                
                // Ošetrenie všetkých možných variantov veľkých/malých písmen pre každý stĺpec
                const bunky = [
                    kniha.id ?? kniha.ID, 
                    kniha.nazov ?? kniha.NAZOV ?? kniha.Nazov, 
                    kniha.autor ?? kniha.AUTOR ?? kniha.Autor, 
                    kniha.rok ?? kniha.ROK ?? kniha.Rok, 
                    kniha.cena ?? kniha.CENA ?? kniha.Cena
                ];

                bunky.forEach(hodnota => {
                    const bunka = document.createElement("td");
                    bunka.textContent = hodnota !== undefined && hodnota !== null ? hodnota : "";
                    riadok.appendChild(bunka);
                });

                const bunkaAkcia = document.createElement("td");
                const tlacidlo = document.createElement("button");
                tlacidlo.textContent = "Vymazať";
                
                const bookId = kniha.id ?? kniha.ID;
                tlacidlo.onclick = () => {
                    fetch("/api/knihy/" + bookId, { method: "DELETE" })
                        .then(() => nacitajKnihy());
                };
                
                const nastavenia = document.createElement("button");
                nastavenia.textContent = "Nastavenia";
                nastavenia.onclick = () => otvorNastavenia({
                    id: bookId,
                    nazov: bunky[1] ?? "",
                    autor: bunky[2] ?? "",
                    rok: bunky[3] ?? "",
                    cena: bunky[4] ?? ""
                });

                const zmenaCeny = document.createElement("button");
                zmenaCeny.textContent = "Zmeniť cenu";
                zmenaCeny.onclick = () => {
                    const zmena = Number(document.getElementById("cena").value);
                    if (document.getElementById("cena").value === "" || !Number.isFinite(zmena))
                        return alert("Zadaj zmenu ceny do poľa 'Zmena ceny'");
                    fetch("/api/knihy/" + bookId + "/cena", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ zmena })
                    }).then(r => {
                        if (!r.ok) return alert("Chyba pri zmene ceny");
                        nacitajKnihy();
                    });
                };

                bunkaAkcia.appendChild(zmenaCeny);
                bunkaAkcia.appendChild(nastavenia);
                bunkaAkcia.appendChild(tlacidlo);
                riadok.appendChild(bunkaAkcia);

                zoznam.appendChild(riadok);
            });
        });
}

nacitajKnihy();

document.getElementById("novaKniha").addEventListener("submit", e => {
    e.preventDefault();
    const formular = e.target;
    fetch("/api/knihy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nazov: document.getElementById("nNazov").value.trim(),
            autor: document.getElementById("nAutor").value.trim(),
            rok: document.getElementById("nRok").value,
            cena: document.getElementById("nCena").value
        })
    }).then(r => {
        if (!r.ok) return alert("Chyba pri pridávaní knihy");
        formular.reset();
        nacitajKnihy();
    });
});

const express = require("express");
const mysql = require("mysql2");
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kniznica"
});

app.get("/api/knihy", (req, res) => {
    db.query("SELECT * FROM knihy", (error, knihy) => {
        if (error) return res.status(500).send("Chyba SQL");
        res.json(knihy);
    });
});
app.post("/api/knihy", (req, res) => {
    const { nazov, autor, rok, cena } = req.body;
    db.query("INSERT INTO knihy (nazov, autor, rok, cena) VALUES (?, ?, ?, ?)",
        [nazov, autor, rok, cena], (error) => {
            if (error) return res.status(500).send("Chyba SQL");
            res.send("Kniha pridana");
        });
});
app.put("/api/knihy/:id", (req, res) => {
    const { nazov, autor, rok, cena } = req.body;
    if (!nazov || !autor || !Number.isFinite(Number(rok)) || !Number.isFinite(Number(cena)))
        return res.status(400).send("Neplatne udaje");

    const sql = "UPDATE knihy SET NAZOV = ?, AUTOR = ?, ROK = ?, cena = ? WHERE ID = ?";
    db.query(sql, [nazov, autor, Number(rok), Number(cena), req.params.id], (error, vysledok) => {
        if (error) return res.status(500).send("Chyba SQL");
        if (!vysledok.affectedRows) return res.sendStatus(404);
        res.send("Kniha upravená");
    });
});
app.patch("/api/knihy/:id/cena", (req, res) => {
    const zmena = Number(req.body.zmena);
    if (!Number.isFinite(zmena))
        return res.status(400).send("Neplatna zmena");
    const sql = "UPDATE knihy SET cena = cena + ? WHERE ID = ?";
    db.query(sql, [zmena, req.params.id], (error, vysledok) => {
        if (error) return res.status(500).send("Chyba SQL");
        if (!vysledok.affectedRows) return res.sendStatus(404);
        res.send("Cena zmenena");
    });
});
app.delete("/api/knihy/:id", (req, res) => {
    db.query("DELETE FROM knihy WHERE id = ?", [req.params.id], (error) => {
        if (error) return res.status(500).send("Chyba SQL");
        res.send("Kniha vymazana");
    });
});

// 404 - musí byť až za API endpointmi, pred app.listen
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "404.html"));
});

app.listen(4000, () => console.log("http://localhost:4000"));
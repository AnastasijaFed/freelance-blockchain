# 💰 Laisvai samdomų žmonių (Freelance) platforma

Šio projekto tikslas – sukurti išmaniąją sutartį (angl. *Smart Contract*) ir decentralizuotą aplikaciją (DApp), kuri užtikrintų saugų ir skaidrų atsiskaitymą tarp užsakovo ir vykdytojo Ethereum tinkle. Sistema naudoja „Escrow“ (saugios sąskaitos) principą, kur lėšos yra užšaldomos kontrakte tol, kol darbas nėra patvirtintas.

---

## Turinys

- [Verslo Modelis ir Logika](#verslo-modelis-ir-logika)
- [Sekų Diagrama](#3-sekų-diagrama-sequence-diagram)
- [Išmanioji Sutartis](#4-išmanioji-sutartis-smart-contract)
- [Testavimas Lokaliame Tinkle (Ganache)](#5-testavimas-lokaliame-tinkle-ganache)
- [Testavimas Viešajame Tinkle (Sepolia)](#6-testavimas-viešajame-tinkle-sepolia)
- [Vartotojo Sąsaja (Front-End)](#7-vartotojo-sąsaja-front-end)
- [Paleidimo Instrukcija](#8-paleidimo-instrukcija-how-to-run)

---

## Verslo Modelis ir Logika
Platforma sprendžia pasitikėjimo problemą tarp nepažįstamų šalių. [cite_start]Pinigai nėra pervedami tiesiogiai vykdytojui, kol užsakovas nepatvirtina rezultato[cite: 13, 14, 21].

### Veikėjai (Actors):
* **Užsakovas (Client):** Inicijuoja užsakymą, nustato biudžetą ir įneša kriptovaliutą (ETH) į kontraktą.
* **Vykdytojas (Freelancer):** Priima užsakymą, atlieka darbą ir priduoda jį per sistemą.
* **Išmanioji Sutartis (Smart Contract):** Veikia kaip arbitras – saugo lėšas ir automatiškai jas paskirsto pagal užprogramuotą logiką.

### Scenarijus:
1.  Užsakovas sukuria darbą (`createJob`) – 100% sumos nuskaičiuojama iš jo piniginės į kontraktą.
2.  Vykdytojas priima darbą (`acceptJob`).
3.  Vykdytojas atlieka darbą ir pažymi kaip baigtą (`completeJob`).
4.  Užsakovas patikrina kokybę ir patvirtina (`approveJob`) – kontraktas perveda lėšas vykdytojui.

## 3. Sekų Diagrama (Sequence Diagram)
[cite_start]Diagrama vaizduoja sąveiką tarp vartotojo sąsajos, kontrakto ir Blockchain tinklo[cite: 22].

![Sekų diagrama](diagrama.png)
> *[ČIA ĮDĖKITE NUOTRAUKĄ: Jūsų nubraižyta sekų diagrama iš draw.io ar mermaid]*

## 4. Išmanioji Sutartis (Smart Contract)
[cite_start]Sutartis įgyvendinta `Solidity` kalba[cite: 7]. [cite_start]Žemiau pateikiamas pagrindinio kodo fragmentas ir failų struktūra[cite: 24].

![Kodo vaizdas](code_snippet.png)
> *[ČIA ĮDĖKITE NUOTRAUKĄ: Ekrano nuotrauka iš VS Code arba Remix IDE, kur matosi .sol failas]*

## 5. Testavimas Lokaliame Tinkle (Ganache)
[cite_start]Sutartis sėkmingai ištestuota naudojant **Ganache** (lokalus Ethereum tinklas, Port 7545) ir **Truffle**[cite: 9, 25].

### 5.1. Migracija
Sėkmingas kontrakto įkėlimas („Deployment“) į vietinį tinklą:

![Migracija](migration.png)
> *[ČIA ĮDĖKITE NUOTRAUKĄ: Terminalo nuotrauka su sėkminga `truffle migrate` komanda]*

### 5.2. Sąskaitos ir Transakcijos
Matyti sąskaitų balansų pokyčiai (nuskaičiuotas ETH už „Gas“ ir depozitus) bei atliktos transakcijos:

![Ganache sąskaitos](ganache_accounts.png)
> *[ČIA ĮDĖKITE NUOTRAUKĄ: Ganache programos pagrindinis langas su sąskaitomis]*

![Ganache transakcijos](ganache_tx.png)
> *[ČIA ĮDĖKITE NUOTRAUKĄ: Ganache programos „Transactions“ skiltis]*

## 6. Testavimas Viešajame Tinkle (Sepolia)
[cite_start]Kontraktas buvo sėkmingai įkeltas į viešąjį **Sepolia Testnet** tinklą[cite: 11, 26].

* **Kontrakto adresas:** `0x...` *(Įrašykite savo tikrąjį adresą)*
* **Etherscan nuoroda:** `https://sepolia.etherscan.io/address/...`

![Etherscan logs](etherscan.png)
> [cite_start]*[ČIA ĮDĖKITE NUOTRAUKĄ: Etherscan puslapio nuotrauka, kur matosi „Contract Creation“ ir transakcijos [cite: 27]]*

## 7. Vartotojo Sąsaja (Front-End)
[cite_start]Sukurta **React** aplikacija, leidžianti vartotojui valdyti procesus per naršyklę naudojant **MetaMask** piniginę[cite: 6, 10, 28].

### 7.1. Pradinis puslapis
Vartotojas mato pasveikinimo langą ir gali prisijungti su pinigine.

![Frontend Home](frontend_home.png)
> *[ČIA ĮDĖKITE NUOTRAUKĄ: Jūsų puslapio „Welcome“ vaizdas]*

### 7.2. Darbo valdymas
Vartotojas (Užsakovas) mato sukurtą darbą, o Vykdytojas gali jį priimti.

![Job Card](frontend_job.png)
> *[ČIA ĮDĖKITE NUOTRAUKĄ: Jūsų puslapio vaizdas su sukurta darbo kortele/sąrašu]*

## 8. Paleidimo Instrukcija (How to Run)

Norint paleisti projektą savo kompiuteryje:

1.  **Paleiskite Ganache:**
    * Nustatykite Port: `7545`
    * Network ID: `5777`

2.  **Įdiekite priklausomybes ir įkelkite kontraktą:**
    ```bash
    npm install
    truffle migrate --reset
    ```

3.  **Paleiskite React aplikaciją:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **MetaMask Nustatymai:**
    * Tinklas: `Localhost 7545` (RPC: `http://127.0.0.1:7545`, Chain ID: `5777`).
    * Importuokite privačius raktus iš Ganache.

# 💰 Laisvai samdomų žmonių (Freelance) platforma

Šio projekto tikslas – sukurti išmaniąją sutartį (angl. *Smart Contract*) ir decentralizuotą aplikaciją (DApp), kuri užtikrintų saugų ir skaidrų atsiskaitymą tarp užsakovo ir vykdytojo Ethereum tinkle. Sistema naudoja „Escrow“ (saugios sąskaitos) principą, kur lėšos yra užšaldomos kontrakte tol, kol darbas nėra patvirtintas.

---

## Turinys

- [Verslo modelis ir logika](#verslo-modelis-ir-logika)
- [Sekų Diagrama](#sekų-diagrama-sequence-diagram)
- [Išmanioji Sutartis](#išmanioji-sutartis-smart-contract)
- [Testavimas Lokaliame Tinkle (Ganache)](#testavimas-lokaliame-tinkle-ganache)
- [Testavimas Viešajame Tinkle (Sepolia)](#testavimas-viešajame-tinkle-sepolia)
- [Vartotojo Sąsaja (Front-End)](#vartotojo-sąsaja-front-end)
- [Paleidimo Instrukcija](#paleidimo-instrukcija-how-to-run)

---

## Verslo modelis ir logika
Platforma sprendžia pasitikėjimo problemą tarp nepažįstamų žmonių. Pinigai nėra pervedami tiesiogiai vykdytojui, kol užsakovas nepatvirtina rezultato.

### Rolės:
* **Client:** Inicijuoja užsakymą, nustato algą už atliktą projektą ir įneša kriptovaliutą (ETH) į kontraktą.
* **Freelancer:** Priima užsakymą, atlieka darbą ir priduoda jį per sistemą.
* **Išmanioji Sutartis (Smart Contract):** Veikia kaip trečioji šalis, kuri saugo lėšas ir automatiškai jas paskirsto pagal užprogramuotą logiką.

### Verslo scenarijus:
1.  Užsakovas sukuria darbą (`createJob`) – 100% sumos nuskaičiuojama iš jo piniginės į kontraktą.
2.  Vykdytojas priima darbą (`acceptJob`).
3.  Vykdytojas atlieka darbą ir pažymi kaip baigtą (`completeJob`).
4.  **Atmetimo atvejis:** Jei atliktas darbas netinka, Užsakovas pasirenka ginčą (`toggleDispute`) – darbas grąžinamas vykdytojui pataisymui.
5.  **Sėkmingas atvejis:** Kai Užsakovas patikrina kokybę ir patvirtina (`approveJob`) – kontraktas perveda lėšas vykdytojui.

---

## Sekų Diagrama (Sequence Diagram)
Diagrama vaizduoja sąveiką tarp vartotojo sąsajos, kontrakto ir Blockchain tinklo.

<img width="6265" height="7060" alt="Mermaid Chart - Create complex, visual diagrams with text -2025-12-14-173524" src="https://github.com/user-attachments/assets/754e748d-4fc9-4919-b876-80eb0c85d7e5" />

---

## Išmanioji Sutartis (Smart Contract)
Sutartis įgyvendinta `Solidity` kalba. Žemiau pateikiamas pagrindinio kodo fragmentas ir failų struktūra.

Sutartis naudoja `enum` būsenoms valdyti ir `struct` detaliai informacijai apie darbą saugoti:

```solidity
    enum Status {
        Open,        // Darbas sukurtas, laukia vykdytojo
        InProgress,  // Vykdytojas priėmė darbą
        Submitted,   // Darbas atliktas, laukia patvirtinimo
        Completed,   // Užsakovas patvirtino, pinigai išmokėti
        Cancelled,   // Atšaukta (grąžinta užsakovui)
        Disputed     // Iškeltas ginčas (grąžinta taisymui)
    }

    struct Job {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;      // Užrakinta suma (Escrow)
        Status status;
        string title;
        string description;
        string workUri;      // Nuoroda į atliktą darbą
        uint256 deadline;    
    }
```

Žemiau pateiktos esminės funkcijos, kurios užtikrina saugų "Escrow" procesą.

Darbo kūrimas (Lėšų įnešimas):

``` solidity

    function createJob(...) external payable {
        require(msg.value > 0, "Must send payment"); // Privalomas depozitas
        // ... (kodo logika)
        jobs[jobId] = Job({ ..., amount: msg.value, ... });
    }
```

Ginčo inicijavimas (Dispute):

``` solidity

    function disputeJob(uint256 _jobId) external onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        job.status = Status.Disputed; // Statusas pakeičiamas, pinigai lieka kontrakte
        emit JobDisputed(_jobId);
    }
```

---

## Testavimas Lokaliame Tinkle (Ganache)
Sutartis sėkmingai ištestuota naudojant **Ganache** (lokalus Ethereum tinklas, Port 7545) ir **Truffle**.

### Migracija
Sėkmingas kontrakto įkėlimas („Deployment“) į vietinį tinklą:
> <img width="1086" height="24" alt="image" src="https://github.com/user-attachments/assets/4bce2717-b257-4d95-8909-70057e66fee2" />
> <img width="1564" height="617" alt="image" src="https://github.com/user-attachments/assets/f30d500f-4a8e-41f7-8e06-573e46b77bbb" />

### Sąskaitos ir transakcijos
Matyti sąskaitų balansų pokyčiai (nuskaičiuotas ETH už „Gas“ ir depozitus) bei atliktos transakcijos:

> <img width="1919" height="1021" alt="image" src="https://github.com/user-attachments/assets/3a2537b7-3fd7-4343-8c69-3d26a4c0480b" />
> <img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/448d5a82-de6f-4164-b72d-996b94f6e41a" />

---

## Testavimas Viešajame Tinkle (Sepolia)
Kontraktas buvo sėkmingai įkeltas į viešąjį **Sepolia Testnet** tinklą.

* **Kontrakto adresas:** `0x...` **
* **Etherscan nuoroda:** `https://sepolia.etherscan.io/address/...`

![Etherscan logs](etherscan.png)
> [Etherscan puslapio nuotrauka, kur matosi „Contract Creation“ ir transakcijos]

---

## Vartotojo sąsaja (Front-End)
Sukurta **React** aplikacija, leidžianti vartotojui valdyti procesus per naršyklę naudojant **MetaMask** piniginę.

### Pradinis puslapis
Vartotojas mato pasveikinimo langą ir gali prisijungti su pinigine.

<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/9b8cb4b1-3564-4130-bc78-752f8ada72ef" />

### Darbo valdymas
Client mato sukurtą darbą, o Freelancer gali jį priimti.

<img width="1916" height="910" alt="image" src="https://github.com/user-attachments/assets/02cc8ecf-456d-4d25-8239-91010afef040" />
<img width="1895" height="921" alt="image" src="https://github.com/user-attachments/assets/534d7321-76e4-4890-a646-cb4e996d0d8f" />
<img width="1919" height="1012" alt="image" src="https://github.com/user-attachments/assets/cd5bee84-e473-45f1-a8b0-9d8a55fc8dde" />
<img width="1919" height="698" alt="image" src="https://github.com/user-attachments/assets/4a2e5da7-bc98-4935-a34b-641a70f3fe15" />
<img width="1347" height="801" alt="image" src="https://github.com/user-attachments/assets/04088498-28e1-4558-909d-42733352ff4b" />
<img width="1919" height="924" alt="image" src="https://github.com/user-attachments/assets/02e7403a-09fa-4625-ba23-ee564fb411fb" />
<img width="1905" height="857" alt="image" src="https://github.com/user-attachments/assets/1a009cf6-4a0e-49ab-98f1-d25b1437080a" />
<img width="1919" height="935" alt="image" src="https://github.com/user-attachments/assets/46439f70-050f-4a99-81d8-7d3057276a0d" />
<img width="1919" height="1006" alt="image" src="https://github.com/user-attachments/assets/18b90435-42be-49a5-998e-e4ab6ab4f73e" />
<img width="615" height="270" alt="image" src="https://github.com/user-attachments/assets/c00cfa7e-78e2-4d2c-9115-aa11271c5164" />
<img width="1916" height="872" alt="image" src="https://github.com/user-attachments/assets/bff62fa7-19ee-46cb-9a3e-0b4550a11618" />
<img width="1919" height="860" alt="image" src="https://github.com/user-attachments/assets/39fe20f3-ab7b-49f9-a3f2-9e0ce7989710" />

---

## Paleidimo Instrukcija (How to Run)

Norint paleisti projektą savo kompiuteryje:

1.  **Paleiskite Ganache:**
    * Nustatykite Port
    * Network ID

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

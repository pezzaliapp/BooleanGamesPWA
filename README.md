# BooleanGamesPWA — Imparare la logica come giocare con i LEGO

👉 **Gioca subito online:** **<https://www.alessandropezzali.it/BooleanGamesPWA/>**

BooleanGamesPWA trasforma la logica booleana in **sei mini-giochi**.  
Pensa alla logica come ai **LEGO**: pochi pezzi semplici (1/0, vero/falso) che, incastrati, costruiscono cose potenti.  
Non servono conoscenze pregresse: **clicca, prova, osserva**. L’obiettivo è coltivare la capacità di **imparare ad imparare**.

---

## 🧭 Come iniziare (subito)

- Apri il link sopra e scegli un gioco dal menu.
- Ogni gioco ha pulsanti **Nuovo / Hint / Check / Soluzione** (quando presenti) e un **feedback immediato**.
- Se qualcosa sembra “non cambiarsi”, aggiorna la pagina con **Cmd+Shift+R** (macOS) o **Ctrl+F5** (Windows).

---

## 🧱 Legenda completa dei simboli (i nostri “LEGO”)

### Valori logici

| Notazione | Significato | Metafora |
|---|---|---|
| `1`, **vero**, **true** | acceso | lampadina accesa |
| `0`, **falso**, **false** | spento | lampadina spenta |

### Variabili
- **A, B, C, D**: interruttori che possono valere 0 o 1.

### Operatori (con verità-table)

> Nelle tabelle: **1**=vero, **0**=falso

**NOT (negazione)** — `¬X`  
Inverte il valore.

| X | ¬X |
|---|---|
| 0 | 1 |
| 1 | 0 |

**AND (e logico)** — `X ∧ Y`  
Vero **solo** se entrambi sono veri.

| X | Y | X ∧ Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**OR (o logico)** — `X ∨ Y`  
Vero se **almeno uno** è vero.

| X | Y | X ∨ Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

**XOR (o esclusivo)** — `X ⊕ Y`  
Vero se **esattamente uno** è vero.

| X | Y | X ⊕ Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

**Implica** — `X → Y`  
Falso **solo** se X=1 e Y=0; altrimenti vero.

| X | Y | X → Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**Suggerimenti di lettura**
- Priorità tipica: `¬` > `∧` > `∨` > `⊕` > `→`.  
- Usa **parentesi** per evitare ambiguità, es.: `(A ∧ B) → ¬C`.

### Mappe di Karnaugh (K-map) — etichette in **Gray code**
- **3 variabili** (A; BC in colonne): colonne ordinate **00, 01, 11, 10**  
- **4 variabili** (AB righe; CD colonne): righe **00, 01, 11, 10** e colonne **00, 01, 11, 10**  
> Il Gray code cambia **un solo bit alla volta** tra celle adiacenti: utile per “vedere” pattern.

---

## 🎮 I giochi (istruzioni + esempio + obiettivo didattico)

### 1) 🧮 Verità o Falso — Valutare una formula
**Obiettivo**: decidere se una formula è vera o falsa con i valori dati.

**Come si gioca**
1. Click **Nuovo** (appare una formula e un’assegnazione di A,B,C).  
2. Sostituisci i valori nella formula.  
3. Valuta passo passo (usa la legenda sopra).  
4. Premi **Vero** o **Falso**.  
5. **Hint** mostra la formula annotata con 0/1.

**Esempio**
```
Formula: (A ∧ B) → ¬C
Valori:  A=1, B=0, C=1

(1 ∧ 0) = 0
¬C = ¬1 = 0
(0 → 0) = 1 ⇒ Vero
```

**Cosa impari**: lettura, sostituzione, valutazione — la “grammatica” della logica.

---

### 2) 🗺️ K-map (3 variabili) — Vedere la funzione su una mappa
**Obiettivo**: riempire la griglia 2×4 (A; BC) con 0/1 per **matchare** la funzione mostrata.

**Come si gioca**
1. **Nuovo** → funzione casuale (es. `A ∧ C`).  
2. Clicca le celle per impostare 0/1.  
3. **Check** mostra quante celle coincidono.  
4. **Hint** corregge una cella. **Soluzione** compila tutto. **Pulisci** resetta.

**Esempio**
- Funzione `A ∧ C` → metti **1** in tutte le celle dove **A=1** e **C=1** (secondo le etichette A/BC della griglia).  

**Cosa impari**: trasformare una formula astratta in una **mappa visiva**.

---

### 3) 🧩 SAT 3-CNF — Rendere vere tutte le clausole
**Obiettivo**: trovare A,B,C che rendano **tutte** le clausole vere.

**Come si gioca**
1. **Nuovo** → elenco di clausole tipo `(A ∨ ¬B ∨ C)`.  
2. Attiva/disattiva i checkbox **A**, **B**, **C**.  
3. Le clausole diventano **verdi** quando soddisfatte.  
4. **Hint** imposta automaticamente una variabile corretta. **Reset** azzera.

**Esempio**
- Clausole: `(A ∨ ¬B ∨ C)`, `(¬A ∨ C ∨ B)`  
- Prova **A=1, B=0, C=1** → entrambe vere → **risolto**.

**Cosa impari**: problem solving con **tentativi informati** (osserva il feedback).

---

### 4) 🗺️ K-map (4 variabili) — Stesse regole, scala maggiore
**Obiettivo**: riempire la **griglia 4×4** (AB; CD) secondo la funzione data.

**Come si gioca**
1. **Nuovo** → funzione su A,B,C,D.  
2. Clicca le celle 0/1.  
3. Usa **Check / Hint / Soluzione / Pulisci** come guida.

**Esempio**
- Funzione `B ∨ D` → metti **1** dove **B=1** o **D=1** (riga/colonna in Gray).

**Cosa impari**: **generalizzazione** e riconoscimento di **pattern** più estesi.

---

### 5) 🧠 Quine–McCluskey — Semplificare (pensiero essenziale)
**Obiettivo**: ridurre una funzione alla **forma minima**.

**Come si gioca**
1. **Nuovo (3 o 4 variabili)** → appaiono i **minterms**.  
2. **Mostra passaggi** → vedi gruppi, implicanti primi, essenziali, copertura minima.  
3. Leggi la **formula minimale**.

**Esempio (2 variabili)**
- Vera nei casi 01 e 11 → espressione completa: `(¬A ∧ B) ∨ (A ∧ B)`  
- Forma minima: **`B`** (se B=1, il risultato è 1 indipendentemente da A).

**Cosa impari**: togliere il superfluo, capire la **struttura**.

---

### 6) 🔌 Circuiti logici — Costruire con blocchi (AND/OR/NOT/XOR)
**Obiettivo**: comporre porte logiche, osservare l’uscita e la **tabella di verità** in tempo reale.

**Come si gioca**
1. **+AND/OR/NOT/XOR** → crea un blocco (es. **G1**).  
2. Imposta gli ingressi del blocco (A/B/C/D o l’uscita di un altro blocco).  
3. In basso scegli **Output osservato** (es. G1).  
4. Attiva/spegni A/B/C/D → aggiornamento **live** di uscita e tabella.  
5. **Reset** pulisce tutto.

**Esempio**
- G1 = **AND(A, B)**  
- Con A=1 e B=1 → uscita=1; se uno è 0 → uscita=0.  
- Aggiungi G2 = **XOR(G1, C)** → componi logiche più ricche.

**Cosa impari**: dal simbolo al circuito, **pensiero compositivo**.

---

## 🛣️ Percorsi consigliati (per tutti i livelli)

- **Principiante (15–20 min)** → Verità o Falso → SAT  
- **Pratico (30 min)** → K-map 3v → K-map 4v  
- **Curioso/Avanzato (45–60+ min)** → Quine–McCluskey → Circuiti

---

## ❓ FAQ rapide

- **Non capisco i simboli.**  
  Guarda la **Legenda** sopra e le **tabelle di verità**: sono il tuo “foglio di comandi”.

- **La pagina non si aggiorna.**  
  Fai **Cmd+Shift+R** (macOS) o **Ctrl+F5** (Windows). Su sito HTTPS il service worker aggiorna in automatico, ma a volte serve un hard refresh.

- **Posso usarlo in classe?**  
  Sì. Proposta: 10′ di Verità/Falso condiviso, poi gruppi su K-map, chiusura con un circuito semplice costruito insieme.

---

## 📚 Glossario essenziale

- **Variabile**: interruttore che vale 0/1.  
- **Funzione**: regola che, dati gli interruttori, produce 0/1.  
- **Minterm**: combinazione specifica di variabili per cui la funzione vale 1.  
- **K-map**: mappa che mostra dove la funzione vale 1 (etichette in Gray).  
- **Implicante primo / essenziale**: “blocchi” indispensabili nella forma minima.  
- **Forma minima**: modo più corto e chiaro di scrivere la stessa funzione.

---

## 🧾 Licenza

Software rilasciato con licenza **MIT**.  
Se insegni, traduci, migliori: **condividi**. La cultura cresce se si costruisce insieme, **un mattoncino alla volta**.

# BooleanGamesPWA (flat)

Sei mini-giochi **booleani** in una PWA, con i file direttamente in radice (niente sottocartelle).

## Come usare
- Copia *tutti* i file nella root della repository GitHub.
- Abilita GitHub Pages: Settings → Pages → Source: `Deploy from a branch`, Branch: `main` (root).
- In locale, apri con un piccolo server:
  ```bash
  python3 -m http.server 8080
  ```
  e visita http://localhost:8080/

## File
- index.html — struttura e stile
- app.js — logica dei 6 giochi
- manifest.json — PWA metadata
- sw.js — cache offline (funziona su HTTPS o localhost)
- icon-192.png, icon-512.png — icone PWA

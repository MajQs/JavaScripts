// Loop: farm -> scavenger -> wrecker -> addingBarbarianVillagesToAF
// === PARAMS ===
var conf = {
  farm: {                           // FARMA -> wysyła A z AF (pełna wygrana lub poziom muru 0)
    speedInMilliseconds: 750,           // odstęp pomiędzy wysłaniem wojsk (speedInMilliseconds +-250ms)
    repeatWhenNoMoreVillagesLeft: 0     // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone
  },
  scavenger: {                      // ZBIERAK -> nie bierze LK pod uwagę
    durationInMin: 30                   // minuty spędzone na zbieraku
  },
  wrecker: {                        // BURZYCIEL -> wymaga: (1 skan, 4 lk, 4 taran), opcjonalne: 3 kat
    maxDistance: 10                     // (10 = 5h przy prędkość jednostek: 0.625)
  },
  addingBarbarianVillagesToAF: {    // AUTOMATYCZNE DODAWANIE WIOSEK BARBARZYŃSKICH - wysyła 1 skan na wioske z poza listy AF
    maxDistance: 20
  }
}

// ==============
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@df86887/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@df86887/plemiona/rozkazy.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@df86887/plemiona/asystent_farmera.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@df86887/plemiona/zbierak.js');
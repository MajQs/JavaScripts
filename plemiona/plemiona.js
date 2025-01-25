// Loop: farm -> scavenger -> wrecker -> autoExpansion
// TIMER: default time = 10 min
// === PARAMS ===
var conf = {
  freezeOffOnVillages: ["village 1", "village 2"]
  freezeDeffOnVillages: []
  farm: {                               // FARMA -> wysyła A z AF (pełna wygrana lub poziom muru 0)
    maxDistance: 10,
    speedInMilliseconds: 700,               // odstęp pomiędzy wysłaniem wojsk (speedInMilliseconds +-250ms)
    repeatWhenNoMoreVillagesLeft: 0,        // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone
    wrecker: {                              // BURZYCIEL -> wymaga: (1 skan, 4 lk, 4 taran), opcjonalne: 3 kat
      maxDistance: 10                           // (10 = 5h przy prędkości jednostek: 0.625)
    },
    autoExpansion: {                        // AUTO EKSPANSIA - wysyła 1 skan na niezbadane barby
      maxDistance: 20,
      maxVillagePoints: 500,                    // aby uniknąć wiosek graczy którzy usuneli konto itp.
      dailyNumberOfAttacksFromVillage: 10       // ilość ataków z jednej wioski gracza na dzień
    }
  },
  scavenger: {                          // ZBIERAK -> nie bierze LK pod uwagę
    durationInMin: 30                       // minuty spędzone na zbieraku
  }
}

// ==============
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@cfebd1d/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@cfebd1d/plemiona/rozkazy.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@cfebd1d/plemiona/asystent_farmera.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@cfebd1d/plemiona/zbierak.js');
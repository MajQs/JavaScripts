// Loop: farm -> scavenger -> (collecting data) -> wrecker -> autoExpansion -> switch village
// TIMER: default time = 10 min
// FREEZE:
//  off  -> avoid farm, wrecker and units(axe, lk, marcher) on scavenger
//  deff -> avoid units(spear, sword, archer, ck) on scavenger

// === PARAMS ===
var conf = {
  farm: {                               // FARMA -> wysyła A z AF (pełna wygrana lub poziom muru 0)
    maxDistance: 10,
    speedInMilliseconds: 700,               // odstęp pomiędzy wysłaniem wojsk (speedInMilliseconds +-250ms)
    repeatWhenNoMoreVillagesLeft: 0,        // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone
    wrecker: {                              // BURZYCIEL -> wymaga: (1 skan, 4 lk, 4 taran), opcjonalne: 3 kat
      maxDistance: 10                           // (10 = 5h przy prędkości jednostek: 0.625)
    },
    autoExpansion: {                        // AUTO EKSPANSIA - wysyła 1 skan na niezbadane barby
      maxDistance: 0,
      maxVillagePoints: 500,                    // aby uniknąć wiosek graczy którzy usuneli konto itp.
      dailyNumberOfAttacksFromVillage: 10       // ilość ataków z jednej wioski gracza na dzień
    }
  },
  scavenger: {                          // ZBIERAK -> nie bierze LK pod uwagę
  	archers: 0,                             // świat z łucznikami? (1 - yes, 0 - no)
    durationInMinutes: 30                       // minuty spędzone na zbieraku (+- 3min)
  },
  freeze: {                             // ZAMRAŻARKA
    offOnVillages: ["M001", "village 2"],
    deffOnVillages: ["village 1"]
  }
}

// === SCRIPT ===
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@dc5d818/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@dc5d818/plemiona/rozkazy_v2.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@dc5d818/plemiona/asystent_farmera_v2.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@dc5d818/plemiona/zbierak_v2.js');
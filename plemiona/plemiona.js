// Loop: farm -> scavenger -> wrecker
// === PARAMS ===
var conf = {
  farm: {                           // FARMA -> wysyła A z AF
    speedInMilliseconds: 750,           // odstęp pomiędzy wysłaniem wojsk (speedInMilliseconds +-250ms)
    repeatWhenNoMoreVillagesLeft: 0     // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone
  },
  scavenger: {                      // ZBIERAK -> nie bierze LK pod uwagę
    durationInMin: 30                   // minuty spędzone na zbieraku
  },
  wrecker: {                        // BURZYCIEL -> wymaga: (1 skan, 4 lk, 4 taran), opcjonalne: 3 kat
    maxDistance: 10                     // do jakiej odległości ma wysyłać, (10 = 5h przy prędkość jednostek: 0.625)
  },
  addingBarbarianVillagesToAF: {
    radius: 5
  }
}

// ==============
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@020cd9a/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@020cd9a/plemiona/rozkazy.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@020cd9a/plemiona/asystent_farmera.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@020cd9a/plemiona/zbierak.js');
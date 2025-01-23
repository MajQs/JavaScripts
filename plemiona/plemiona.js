// Loop: farm -> scavenger -> wrecker -> addingBarbarianVillagesToAF
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
    maxDistance: 10                     // do jakiej odległości ma atakować, (10 = 5h przy prędkość jednostek: 0.625)
  },
  addingBarbarianVillagesToAF: {    // AUTOMATYCZNE DODAWANIE WIOSEK BARBARZYŃSKICH - wysyła 1LK na wioske z poza listy AF
    maxDistance: 30                      // do jakiej odległości ma atakować
  }
}

// ==============
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@2ff685a/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@2ff685a/plemiona/rozkazy.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@2ff685a/plemiona/asystent_farmera.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@2ff685a/plemiona/zbierak.js');
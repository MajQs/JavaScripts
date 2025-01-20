// Loop: farm -> scavenger -> wrecker
// === PARAMS ===
var conf = {
  farm: {                           // FARMA -> wysyła A z AF na barbe
    enabled: 1,                         // 0 -> wyłączone, 1 - właczone
    speedInMilliseconds: 1000,          // odstęp pomiędzy wysłaniem wojsk (speedInMilliseconds +-250ms)
    repeatWhenNoMoreVillagesLeft: 0     // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone
  },
  scavenger: {                      // ZBIERAK -> nie bierze LK pod uwagę
    enabled: 1,
    durationInMin: 30                   // minuty spędzone na zbieraku
  },
  wrecker: {                        // BURZYCIEL -> zbiera coordy z AF i z placu wysyła wojska
    enabled: 1
  }
}

// ==============
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@e5dcdaa/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@e5dcdaa/plemiona/rozkazy.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@e5dcdaa/plemiona/asystent_farmera.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@e5dcdaa/plemiona/zbierak.js');
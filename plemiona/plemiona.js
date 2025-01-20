//  Loop: farm -> scavenger -> wrecker
// === PARAMS ===
var conf = {
  farm: {
    enabled: 1,
    speedInMilliseconds: 1000,      // speedInMilliseconds +-250ms
    repeatWhenNoMoreVillagesLeft: 0 // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone
  },
  wrecker: {
    enabled: 1
  },
  scavenger: {
    enabled: 1,
    durationInMin: 30               // minuty spędzone na zbieraku
  }
}

// ==============
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@790c1cd/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@790c1cd/plemiona/rozkazy.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@790c1cd/plemiona/asystent_farmera.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@790c1cd/plemiona/zbierak.js');
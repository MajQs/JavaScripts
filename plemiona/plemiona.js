// === PARAMS ===
var scavenger = {
  durationInMin: 30 // minuty spędzone na zbieraku
}

var af = {
  farm: {
    speedInMilliseconds: 1000,
    repeatWhenNoMoreVillagesLeft: 0 // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone
  }
}

// ==============
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@3d74eae/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@3d74eae/plemiona/rozkazy.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@3d74eae/plemiona/asystent_farmera.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@3d74eae/plemiona/zbierak.js');
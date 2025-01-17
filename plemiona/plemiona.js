// === PARAMS ===
var scavenger = {
   durationInMin: 30 // minuty spędzone na zbieraku
}

var af = {
   repeatWhenNoMoreVillagesLeft: 0 // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone jak są jeszcze wojska
}

// ==============
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@cc359b8/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@cc359b8/plemiona/anty_bot.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@cc359b8/plemiona/asystent_farmera.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@cc359b8/plemiona/zbierak.js');
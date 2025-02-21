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
    wrecker: {                              // BURZYCIEL -> wymaga: (1 skan, lk, taran), opcjonalne: kat
      maxDistance: 10,                           // (10 = 5h przy prędkości jednostek: 0.625)
      units: {
        light: 4,
        ram: 4,
        catapult: 7
      }
    },
    autoExpansion: {                        // AUTO EKSPANSIA - wysyła 1 skan na niezbadane barby
      maxDistance: 20,
      maxVillagePoints: 1200,                    // aby uniknąć wiosek graczy którzy usuneli konto itp.
      dailyNumberOfAttacksFromVillage: 10       // ilość ataków z jednej wioski gracza na dzień
    }
  },
  scavenger: {                              // ZBIERAK -> nie bierze LK pod uwagę
  	archers: 0,                                 // świat z łucznikami? (1 - yes, 0 - no)
    spearSafeguard: 50,                         // ile pozostawić pik
    durationInMinutes: 30                       // minuty spędzone na zbieraku (+- 3min)
  },
  freeze: {                                 // ZAMRAŻARKA - wystarczy podać część nazwy wioski
    offOnVillages: ["M001", "village 2"],
    deffOnVillages: ["village 1"]
  },
  scheduler: [
    // [data wejścia, z, do, lista ataków [[pic, miecz, top, łuk, skan, LK, łNK, CK, tar, kat, ryc, szl]]]
    // przykład OFFa ["2025-02-18T22:06:01", "A001", "676|648", [[0,0,"all",0,0,"all",0,0,0,0,1,0]]]
    // przykład karety ["2025-02-18T22:06:01", "A001", "676|648", [[0,0,3000,0,0,1500,0,0,0,0,1,1],[],[],[]]] //pozostawienie ataków 2, 3 i 4 pustymi powoduje automatyczne uzupełnienie wojskiem
    ["2025-02-18T22:06:01", "A001", "676|648", [[0,0,0,0,9,0,0,0,0,0,0,0]]]
  ]
}

// === SCRIPT ===
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@582d160/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@582d160/plemiona/rozkazy_v2.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@582d160/plemiona/asystent_farmera_v2.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@582d160/plemiona/zbierak_v2.js');

// Page timer
// return to AF when you stay too long on the same page
var timer = 10 ;
function pageTimer() {
    console.log("TIMER: min left = " + timer );
    autoTagIncomingAttacks()
    schedulerCheck()
    setTimeout(function() {
        timer--;
        if (timer >= 0) {
            completeQuest()
            pageTimer()
        } else {
            goToNextLevel(defaultLevel)
        }
    }, 60000);
}
setTimeout(function() {
    pageTimer()
}, 1000);

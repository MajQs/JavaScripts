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
    spearSafeguard: 50,                         // ile pozostawić pik
    durationInMinutes: 30                       // minuty spędzone na zbieraku (+- 3min)
  },
  freeze: {                                 // ZAMRAŻARKA - wystarczy podać część nazwy wioski
    offOnVillages: ["M001", "village 2"],
    deffOnVillages: ["village 1"]
  },
  scheduler: [
    //Opis: [data wejścia, z, do, lista ataków [[pic, miecz, top, łuk, skan, LK, łNK, CK, tar, kat, ryc, szl]]]
    //["2025-02-26T22:50:01.000", "M010", "393|564", [[0,0,"all",0,0,"all","all",0,"all","all","all",0]]],              //off
    //["2025-02-26T22:50:02.000", "M005", "393|564", [[0,0,3000,0,0,1000,"all",0,"all","all","all",1],[],[],[]]]        //kareta
  ]
}

// === SCRIPT ===
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@582d160/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@582d160/plemiona/rozkazy_v2.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@582d160/plemiona/asystent_farmera_v2.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@582d160/plemiona/zbierak_v2.js');

var timer = 5;
setTimeout(function() {
    location.reload();
}, (timer+1)*60*1000);

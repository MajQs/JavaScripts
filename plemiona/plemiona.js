// Loop: farm -> scavenger -> (collecting data) -> wrecker -> autoExpansion -> switch village
// TIMER: default time = 10 min
// FREEZE:
//  off  -> avoid farm, wrecker and units(axe, lk, marcher) on scavenger
//  deff -> avoid units(spear, sword, archer, ck) on scavenger

// === PARAMS ===
var conf = {
  farm: {                               // FARMA -> wysyła A z AF (pełna wygrana lub poziom muru 0)
    maxDistance: 99,
    speedInMilliseconds: 700,               // odstęp pomiędzy wysłaniem wojsk (speedInMilliseconds +-250ms)
    repeatWhenNoMoreVillagesLeft: 1,        // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone
    wrecker: {                              // BURZYCIEL -> wymaga: (1 skan, lk, taran), opcjonalne: kat
      maxDistance: 15,                           // (10 = 5h przy prędkości jednostek: 0.625)
      units: {
        light: 4,
        ram: 4,
        catapult: 7
      }
    },
    autoExpansion: {                        // AUTO EKSPANSIA - wysyła 1 skan na niezbadane barby
      maxDistance: 30,
      maxVillagePoints: 500,                    // aby uniknąć wiosek graczy którzy usuneli konto itp.
      dailyNumberOfAttacksFromVillage: 50       // ilość ataków z jednej wioski gracza na dzień
    }
  },
  scavenger: {                              // ZBIERAK -> nie bierze LK pod uwagę
    spearSafeguard: 50,                         // ile pozostawić pik
    durationInMinutes: 30                       // minuty spędzone na zbieraku (+- 3min)
  },
  freeze: {                                 // ZAMRAŻARKA - wystarczy podać część nazwy wioski
    offOnVillages: ["village 1", "village 2"],
    deffOnVillages: ["village 1"]
  },
  scheduler: [
    //Opis: ["Napad"/"Pomoc", data wejścia, z, do, cel katapult ,lista ataków [[pic, miecz, top, łuk, skan, LK, łNK, CK, tar, kat, ryc, szl]]]
    //["Napad", "2025-02-26T22:50:01.000", "M010", "393|564", "Mur",     [[0,0,"all",0,0,"all","all",0,"all","all","all",0]]],              //off
    //["Napad", "2025-02-26T22:50:01.000", "M010", "393|564", "Zagroda", [[0,0,"all",0,0,"all","all",0,"all","all","all",0]]],              //burzak
    //["Napad", "2025-02-26T22:50:02.000", "M005", "393|564", "Mur",     [[0,0,3000,0,0,1000,"all",0,"all","all","all",1],[],[],[]]]        //kareta
    //["Pomoc", "2025-02-26T22:50:02.000", "M005", "393|564", "",        [["all","all",0,0,0,0,0,"all",0,0,0,0]]]                           //klin
  ]
}

// === SCRIPT ===
var timer = 5;
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@2cf29c2/plemiona/util.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@2cf29c2/plemiona/rozkazy_v2.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@2cf29c2/plemiona/asystent_farmera_v2.js');
$.getScript('https://cdn.jsdelivr.net/gh/MajQs/JavaScripts@2cf29c2/plemiona/zbierak_v2.js');

setTimeout(function() {
    location.reload();
}, (timer+1)*60*1000);

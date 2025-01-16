 javascript:
 console.log("Hello");
 // parametry do modyfikowania
 var minNaZbieraku = 30;



// ===========================

 var settings = {
   max_ressources: '9999',
   archers: '0',
   skip_level_1: '0'
 }

 var settings_spear = {
   untouchable: '0',
   max_unit_number: '9999',
   conditional_safeguard: '0'
 }

 var settings_sword = {
   untouchable: '0',
   max_unit_number: '9999',
   conditional_safeguard: '0'
 }

 var settings_axe = {
   untouchable: '0',
   max_unit_number: '9999',
   conditional_safeguard: '0'
 }

 var settings_archer = {
   untouchable: '0',
   max_unit_number: '9999',
   conditional_safeguard: '0'
 }

 var settings_light = {
   untouchable: '0',
   max_unit_number: '0',
   conditional_safeguard: '0'
 }

 var settings_marcher = {
   untouchable: '0',
   max_unit_number: '9999',
   conditional_safeguard: '0'
 }

 var settings_heavy = {
   untouchable: '0',
   max_unit_number: '9999',
   conditional_safeguard: '0'
 }

 var timer = 0;

 // ===========================

 function getRandomDelay(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
 }

 function isScavenge() {
   var url = new URL(window.location.href);
   var params = new URLSearchParams(url.search);

   return params.get('mode') === "scavenge"
 }

 function isAF() {
   var url = new URL(window.location.href);
   var params = new URLSearchParams(url.search);

   return params.get('screen') === "am_farm"
 }

 function goToScavenge() {
   var url = new URL(window.location.href);
   var params = new URLSearchParams(url.search);

   var village = params.get('village');

   params.forEach(function(value, key) {
     params.delete(key);
   });

   params.set('village', village);
   params.set('screen', 'place');
   params.set('mode', 'scavenge');
   window.location.href = url.origin + url.pathname + '?' + params.toString();
 }

 function goToAF() {
   var url = new URL(window.location.href);
   var params = new URLSearchParams(url.search);

   var village = params.get('village');

   params.forEach(function(value, key) {
     params.delete(key);
   });

   params.set('village', village);
   params.set('screen', 'am_farm');
   window.location.href = url.origin + url.pathname + '?' + params.toString();
 }

 function processAF(delay) {
   let rows = $(`#plunder_list tr`).slice(2);

   function processRowWithDelay(index) {
     // go to next page
     if (index >= rows.length) {
       let firstColumnElements = $(`#plunder_list_nav tr`).eq(0).find('td').eq(0).children();
       let strongElement = firstColumnElements.filter('strong');

       if (strongElement.length > 0) {
         let nextAnchor = strongElement.next('a');
         if (nextAnchor.length > 0) {
           nextAnchor[0].click(); // next page
         } else {
           goToScavenge()
         }
       }
       return;
     }

     // Click A
     var aButton = $(rows[index]).find('td').eq(8).find('a').first();
     if (aButton.is('.farm_icon_disabled')) {
       goToScavenge()
     }
     aButton.click();

     setTimeout(function() {
       // no army?
       if ($('div.autoHideBox.error').length > 0) {
         goToScavenge()
         return;
       }

       // next row
       processRowWithDelay(index + 1);
     }, getRandomDelay(500, 1200));
   }

   // start AF
   setTimeout(function() {
     processRowWithDelay(0);
   }, 3000)

 }

 function processScavenge() {
   var container = $('.options-container');

   function test(index) {
     if (index < 0) {
       return
     }

     var div = container.find('.scavenge-option')[index]
     if ($(div).find('.free_send_button').length > 0) {
       console.log("Zbierak");
       $.getScript('https://media.innogamescdn.com/com_DS_PL/skrypty/Asystent_Zbieracza.js');

       setTimeout(function() {
         console.log("WyÅ›lij");
         $(div).find('.free_send_button')[0].click();

         setTimeout(function() {
           test(index - 1)
         }, 2000);
       }, 2000);
     }
   }
   setTimeout(function() {
     if ($('.time').length > 0) {
     } else {
       setTimeout(function() {
         test(3)
       }, 3000);
     }
   }, 3000);
 }

 function processScavenge2() {
   timer = minNaZbieraku;
   setTimeout(function() {
     if (timer > 0) {
       timer--;
       console.log("minutes left: " + timer);
       processScavenge()
       processScavenge2()
     } else {
       goToAF()
     }
   }, 60000);
 }

 if (isScavenge()) {
   processScavenge2()
 }
 if (isAF()) {
   processAF();
 }
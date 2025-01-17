

// global params
 var minInScavenge = 30;

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
     if ($('.time').is(":visible")) {
       console.log("Scavenge still working: skipping " );
     } else {
       setTimeout(function() {
         test(3)
       }, 3000);
     }
   }, 3000);
 }

 function processScavenge2() {
   processScavenge()
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
   timer = minInScavenge;
   processScavenge2()
 }

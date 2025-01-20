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
       console.log("Scavenger still working: skipping " );
     } else {
       setTimeout(function() {
         test(3)
       }, 3000);
     }
   }, 3000);
 }

 function processScavengerLoop() {
   processScavenge()
   console.log("Min left: " + timer);
   setTimeout(function() {
     if (timer > 0) {
       timer--;
       processScavengerLoop()
     } else {
       localStorage.setItem("wreckerEnabled", true)
       goToAF()
     }
   }, 60000);
 }

 function isScavenge() {
   var url = new URL(window.location.href);
   var params = new URLSearchParams(url.search);

   return params.get('mode') === "scavenge"
 }

 if (isScavenge()) {
   console.log("Processing Scavenger..." );
   timer = scavenger.durationInMin;
   processScavengerLoop()
 }

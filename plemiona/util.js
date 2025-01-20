 function getRandomDelay(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
 }

 function goToScavenge() {
   var url = new URL(window.location.href);
   var village = new URLSearchParams(url.search).get('village');

   window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=scavenge';
 }

 function goToAF() {
   var url = new URL(window.location.href);
   var village = new URLSearchParams(url.search).get('village');

   window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=am_farm';
 }

 function goToCommand() {
   var url = new URL(window.location.href);
   var village = new URLSearchParams(url.search).get('village');

   window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=command';
 }

 setTimeout(function() {
   var captcha = $('#bot_check')
   if ($(captcha).length > 0) {
     $(captcha).find('a').first().click()
   }
 }, 5000);
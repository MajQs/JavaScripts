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
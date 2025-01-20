
 function processWreckerInPlace() {
   console.log("Processing wrecker..." );

   localStorage.setItem("wreckerEnabled",false)
   goToAF()
 }

 function isPlace() {
   var url = new URL(window.location.href);
   var params = new URLSearchParams(url.search);

   return params.get('screen') === "place" && params.get('mode') === "command"
 }

 if (isPlace()) {
   console.log("Processing Place..." );
   setTimeout(function() {
     processWreckerInPlace();
   }, 3000)
 }

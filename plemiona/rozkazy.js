
 function processWreckerInCommand() {
   console.log("Processing wrecker..." );
   var coordinatesForWrecker = JSON.parse(localStorage.getItem("coordinatesForWrecker"));

   if ($('.error_box').length > 0 || coordinatesForWrecker.length == 0) {
     localStorage.setItem("wreckerEnabled",false)
     localStorage.setItem("coordinatesForWrecker", JSON.stringify([]));
     goToAF()
     return;
   }

   var coordinate = coordinatesForWrecker.shift()
   localStorage.setItem("coordinatesForWrecker", JSON.stringify(coordinatesForWrecker));

   $("#place_target").find('input').first().val(coordinate)

   $("#unit_input_light").val("4")
   $("#unit_input_ram").val("4")
   $("#unit_input_spy").val("1")

   $("#target_attack").click()
 }

 function isCommand() {
   var url = new URL(window.location.href);
   var params = new URLSearchParams(url.search);

   return params.get('screen') === "place" && (params.get('mode') === "command" || params.get('mode') == null)
 }

 function isCommandConfirm() {
   var url = new URL(window.location.href);
   var params = new URLSearchParams(url.search);

   return params.get('screen') === "place" && params.get('try') === "confirm" && Array.from(url.searchParams).length == 3
 }

 if (isCommand()) {
   console.log("Processing Command..." );
     if(localStorage.getItem("wreckerEnabled") == 'true'){
        setTimeout(function() {
          processWreckerInCommand();
        }, 2000)
     }
 }

 if (isCommandConfirm()) {
   console.log("Processing Command Confirm..." );
   if(localStorage.getItem("wreckerEnabled") == 'true'){
      setTimeout(function() {
        $("#troop_confirm_submit").click()
      }, 2000)
   }
 }
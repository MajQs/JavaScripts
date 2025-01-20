function processWrecker() {
   console.log("Processing Wrecker..." );
   var coordinatesForWrecker = []

   let rows = $(`#plunder_list tr`).slice(2);

   function processRowWithDelay(index) {
     // go to next page
     if (index >= rows.length) {
       let firstColumnElements = $(`#plunder_list_nav tr`).eq(0).find('td').eq(0).children();
       let strongElement = firstColumnElements.filter('strong');

       if (strongElement.length > 0) {
         let nextAnchor = strongElement.next('a');
         if (nextAnchor.length > 0) {
           let current = JSON.parse(localStorage.getItem("coordinatesForWrecker"));
           if(current == null){
             localStorage.setItem("coordinatesForWrecker", JSON.stringify(coordinatesForWrecker));
           }else{
             localStorage.setItem("coordinatesForWrecker", JSON.stringify(current.concat(coordinatesForWrecker)));
           }
           nextAnchor[0].click(); // next page
         } else {
           goToCommand()
         }
       }
       return;
     }

     if ($(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('red') > -1 ) { // defeated
       if ($(rows[index]).find('td').eq(3).find('img').length == 0){ // no attack is coming
         var coordinates = $(rows[index]).find('td').eq(3).find('a').first().text()
         coordinatesForWrecker.push(coordinates.substr(coordinates.indexOf('(') + 1, coordinates.indexOf(')') -2 ))
       }
     }

     setTimeout(function() {
       // some error?
       if ($('div.autoHideBox.error').length > 0) {
//         goToScavenge()
         return;
       }

       // next row
       processRowWithDelay(index + 1);
     }, 50);
   }

   // start AF
   setTimeout(function() {
     processRowWithDelay(0);
   }, 3000)

 }

 function processFarm() {
   console.log("Processing Farm..." );
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
            if(af.repeatWhenNoMoreVillagesLeft === 0){
              goToScavenge()
            }else{
              firstColumnElements[0].click() // back to [1]
            }
         }
       }
       return;
     }

     // Click A
     if ( $(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('green') > -1 ) {
       var aButton = $(rows[index]).find('td').eq(8).find('a').first();
       if (aButton.is('.farm_icon_disabled')) {
         goToScavenge()
       }
       aButton.click();
     }

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

 function isAF() {
   var url = new URL(window.location.href);
   var params = new URLSearchParams(url.search);

   return params.get('screen') === "am_farm"
 }

 if (isAF()) {
   console.log("Processing AF..." );
   if(localStorage.getItem("wreckerEnabled") == 'true'){
      processWrecker();
   } else{
      processFarm();
   }
 }

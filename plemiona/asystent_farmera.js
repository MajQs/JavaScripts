
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

 if (isAF()) {
   console.log("Processing AF..." );
   processAF();
 }

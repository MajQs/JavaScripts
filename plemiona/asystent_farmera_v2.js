function processCollectAFStatistics() {
    console.log("Processing collecting AF statistics..." );
    var playerVillages = JSON.parse(localStorage.getItem("MajQs.playerVillages"));
    var coordinatesForWrecker
//    var allAFCoordinates = []

    var cfw = JSON.parse(localStorage.getItem("MajQs.coordinatesForWreckerTemp"))
    if (cfw == null){
        coordinatesForWrecker = new Map();
    } else {
        coordinatesForWrecker = new Map(cfw);
    }


//    var afs = JSON.parse(localStorage.getItem("MajQs.afStatistics"))
//    var afStatistics = []
//    if (afs == null){
//        afStatistics = new Map();
//    } else {
//        afStatistics = new Map(afs);
//    }

    // collect coordinates
    let rows = $(`#plunder_list tr`).slice(2);
    for (let index = 0; index < rows.length; index++) {
        let coordinatesWithBrackets = $(rows[index]).find('td').eq(3).find('a').first().text()
        let coordinates = coordinatesWithBrackets.substr(coordinatesWithBrackets.indexOf('(') + 1, coordinatesWithBrackets.indexOf(')') -2 )

        // afStatistics
//        allAFCoordinates.push(coordinates)
//        //coords, max_loot, date
//        var max_loot = $(rows[index]).find('td').eq(2).find('img').first().attr('src')
//        if(max_loot == null){
//            max_loot = false;
//        }else{
//            max_loot = max_loot.indexOf('max_loot/1') > -1
//        }
//
//        var date = $(rows[index]).find('td').eq(4).text().replace("dzisiaj o ","").replace("wczoraj o ","")
//        let exist = false;
//        for(let afsi = 0; afsi < afStatistics.length; afsi++){
//            if(afStatistics[afsi][0] == coordinates){
//                exist = true;
//                if(afStatistics[afsi][1][afStatistics[afsi][1].length-1][0] != date){
//                    if(afStatistics[afsi][1].length >= 10){
//                        afStatistics[afsi][1].shift()
//                    }
//                    afStatistics[afsi][1].push([date, max_loot])
//                }
//            }
//        }
//        if(!exist){
//            afStatistics.push([coordinates, [[date, max_loot]]])
//        }

        // coordinatesForWrecker
        if (($(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('red') > -1                        // defeated
            || $(rows[index]).find('td').eq(6).text() <= 1)                                                             // wall
            && $(rows[index]).find('td').eq(3).find('img').length == 0                                                  // no attack is coming
            && playerVillages != null)
        {
            var coords = coordinates.split("|")
            for (let pvi = playerVillages.length-1; pvi >= 0; pvi--) {
                var distance = Math.sqrt(Math.pow(coords[0]-playerVillages[pvi][1].X,2)+Math.pow(coords[1]-playerVillages[pvi][1].Y,2))
                if(distance <= conf.farm.wrecker.maxDistance    // is in rage of max distance
                    && playerVillages[pvi][1].isWrecker)         // is wrecker
                {
                    for (let foovi = conf.freeze.offOnVillages.length-1; foovi >= 0; foovi--) {
                        if(!conf.freeze.offOnVillages[foovi].indexOf(playerVillages[pvi][1].name)){
                            var current = coordinatesForWrecker.get(coordinates)
                            if(current == null){
                                current = []
                            }
                            current.push([playerVillages[pvi][0], distance])
                            current.sort(function (a, b) {
                                return a[1] - b[1]
                            })
                            coordinatesForWrecker.set(coordinates, current)
                        }
                    }
                }
            }
        }
    }

    localStorage.setItem("MajQs.coordinatesForWreckerTemp", JSON.stringify(Array.from(coordinatesForWrecker)))
//    saveParameterToLocalStorage("allAFCoordinates", allAFCoordinates)
//    localStorage.setItem("afStatistics", JSON.stringify(afStatistics));


    function saveCoordinatesForWrecker(){
        if(coordinatesForWrecker != null && coordinatesForWrecker.size > 0){
            var sortedByDistance = Array.from(coordinatesForWrecker.entries()).sort(function (a, b) {return a[1][0][1] - b[1][0][1]})
            var sortedByVillage = sortedByDistance.sort(function (a, b) {return a[1][0][0] - b[1][0][0]})
            var villageMap = new Map()
            for(let i=0; i< sortedByVillage.length; i++){
                var t = villageMap.get(sortedByVillage[i][1][0][0])
                if(t == null){
                    t = []
                }
                t.push(sortedByVillage[i][0])
                villageMap.set(sortedByVillage[i][1][0][0], t)
            }
            localStorage.setItem("MajQs.coordinatesForWrecker", JSON.stringify(Array.from(villageMap)));
            return 0;
        }
    }

    // next page
    let strongElement = $(`#plunder_list_nav tr`).eq(0).find('td').eq(0).children().filter('strong'); // current page
    let nextAnchor = strongElement.next('a');   // next page
    if (nextAnchor.length > 0) {
        nextAnchor[0].click();                  // next page
    } else {
        saveCoordinatesForWrecker()
        localStorage.removeItem("MajQs.coordinatesForWreckerTemp")
        goToNextLevel(collectServerDataLevel)
    }
}

function nextVillage(){
    var nextVillage = $("#village_switch_right").find(".arrowRight")
    if(nextVillage.length > 0){
        nextVillage.click()
    }else{
        goToMassScavengePage()
    }
}

function processFarm() {
    console.log("Processing Farm..." );
    let rows = $(`#plunder_list tr`).slice(2);

    var minDelay = conf.farm.speedInMilliseconds - 250
    if(minDelay < 250){
        minDelay = 250
    }

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
                    if(conf.farm.repeatWhenNoMoreVillagesLeft === 0){
                        saveParameterToLocalStorage("MajQs.farmVillageDoneList", [$.cookie("global_village_id")])
                        nextVillage()
                    }else{
                        firstColumnElements[0].click() // back to [1]
                    }
                }
            }
            return 0;
        }

        if($(rows[index]).find('td').eq(7).text() > conf.farm.maxDistance){
            saveParameterToLocalStorage("MajQs.farmVillageDoneList", [$.cookie("global_village_id")])
            nextVillage()
            return 0;
        }

        if ($(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('green') > -1   // pełna wygrana
            || $(rows[index]).find('td').eq(6).text() == '0' ) {                                    // mur 0

            function pressA(){
                // Click A
                var aButton = $(rows[index]).find('td').eq(8).find('a').first();
                if (aButton.is('.farm_icon_disabled')) {
                    saveParameterToLocalStorage("MajQs.farmVillageDoneList", [$.cookie("global_village_id")])
                    nextVillage()
                }else{
                    console.log("pressing A")
                    aButton.click();
                }
                return 0;
            }

            function pressB(){
                // Click B
                var bButton = $(rows[index]).find('td').eq(9).find('a').first();
                if (bButton.is('.farm_icon_disabled')) {
                    pressA()
                }else{
                    console.log("pressing B")
                    bButton.click();
                }
                return 0;
            }

            function shouldPressB(){
//                var afStatistics = JSON.parse(localStorage.getItem("afStatistics"));
//                if(afStatistics == null) {
//                    return 0;
//                }
//                for(let i=0; i < afStatistics.length; i++){
//                    let coordinatesWithBrackets = $(rows[index]).find('td').eq(3).find('a').first().text()
//                    let coordinates = coordinatesWithBrackets.substr(coordinatesWithBrackets.indexOf('(') + 1, coordinatesWithBrackets.indexOf(')') -2 )
//                    if(afStatistics[i][0] == coordinates){
//                        if(afStatistics[i][1].length - 3 < 0){
//                            return false
//                        }else{
//                            let pressB = true;
//                            for(let d=afStatistics[i][1].length - 3; d < afStatistics[i][1].length; d++){
//                                if(afStatistics[i][1][d][1] == false){
//                                    pressB = false;
//                                }
//                            }
//                            return pressB;
//                        }
//                    }
//                }
                return false
            }

            if(shouldPressB()){
                pressB()
            }else{
                pressA()
            }
        }


        setTimeout(function() {
            if ($('div.autoHideBox.error').length > 0 || isVillageWithFrozenOff()) {
                saveParameterToLocalStorage("MajQs.farmVillageDoneList", [$.cookie("global_village_id")])
                nextVillage()
            }else {
                processRowWithDelay(index + 1);
            }
        }, getRandomDelay(minDelay, conf.farm.speedInMilliseconds + 250));
    }

    if ($('div.autoHideBox.error').length > 0 || isVillageWithFrozenOff()) {
        saveParameterToLocalStorage("MajQs.farmVillageDoneList", [$.cookie("global_village_id")])
        nextVillage()
    }else {
        // start farm
        processRowWithDelay(0);
    }
}

function isAF() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('screen') === "am_farm"
}

if (isAF()) {
    console.log("AF page..." );
    setTimeout(function() {

        function isVillageAlreadyNotVisited(){
            var farmVillageDoneList = JSON.parse(localStorage.getItem("MajQs.farmVillageDoneList"));
            if(farmVillageDoneList == null) {
                farmVillageDoneList = []
            }
            for(let i=0; i<farmVillageDoneList.length; i++){
                if(farmVillageDoneList[i] == $.cookie("global_village_id")){
                    return false
                }
            }
            return true
        }

        if(shouldProcessLevel(collectAFStatisticsLevel)){
            processCollectAFStatistics();
        } else {
            if(isVillageAlreadyNotVisited()){
                processFarm();
            } else {
                goToMassScavengePage()
            }
        }
    }, 1500)
} else {
    localStorage.removeItem("MajQs.farmVillageDoneList");
}
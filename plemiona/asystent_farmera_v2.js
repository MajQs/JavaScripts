function processCollectAFStatistics() {
    console.log("Processing collecting AF statistics..." );
    var playerVillages = Array.from(getPlayerVillages())
    var coordinatesForWrecker
    var afStatistics

    var cfw = JSON.parse(localStorage.getItem("MajQs.coordinatesForWreckerTemp"))
    if (cfw == null){
        coordinatesForWrecker = new Map();
    } else {
        coordinatesForWrecker = new Map(cfw);
    }

    var afs = JSON.parse(localStorage.getItem("MajQs.afStatistics"))
    if (afs == null){
        afStatistics = new Map();
    } else {
        afStatistics = new Map(afs);
    }

    // collect coordinates
    let rows = $(`#plunder_list tr`).slice(2);
    for (let index = 0; index < rows.length; index++) {
        let coordinatesWithBrackets = $(rows[index]).find('td').eq(3).find('a').first().text()
        let coordinates = coordinatesWithBrackets.substr(coordinatesWithBrackets.indexOf('(') + 1, coordinatesWithBrackets.indexOf(')') -2 )

        function collectAfStatistic(){
            function getMaxLoot(){
                var max_loot = $(rows[index]).find('td').eq(2).find('img').first().attr('src')
                if(max_loot == null){
                    max_loot = false;
                }else{
                    max_loot = max_loot.indexOf('max_loot/1') > -1
                }
                return max_loot
            }

            var villageStatistics = afStatistics.get(coordinates)
            if(villageStatistics == null){
                villageStatistics = []
            }

            var ravStatus = $(rows[index]).find('td').eq(1).find('img').first().attr('src')

            var villageStatistic = {
                 "date": $(rows[index]).find('td').eq(4).text().replace("dzisiaj o ","").replace("wczoraj o ",""),
                 "max_loot": getMaxLoot(),
                 "status": ravStatus.substring(ravStatus.indexOf("dots/")+5, ravStatus.indexOf(".png")),
                 "wall": $(rows[index]).find('td').eq(6).text()
            }

            if(villageStatistics.length == 0
                || villageStatistics[villageStatistics.length-1].date != villageStatistic.date)
            {
                if(villageStatistics.length >= 10){
                      villageStatistics.shift()
                }
                villageStatistics.push(villageStatistic)
                afStatistics.set(coordinates, villageStatistics)
            }
            return 0
        }

        function collectCoordinatesForWrecker(){
            if (($(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('red.png') > -1                        // defeated
                || $(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('yellow.png') > -1                   // or losses
                || $(rows[index]).find('td').eq(6).text() <= 2)                                                                 // or wall <= 2
                && $(rows[index]).find('td').eq(3).find('img').length == 0                                                      // and no attack is coming
                && playerVillages != null)
            {
                var coords = coordinates.split("|")
                for (let pvi = playerVillages.length-1; pvi >= 0; pvi--) {
                    var distance = Math.sqrt(Math.pow(coords[0]-playerVillages[pvi][1].X,2)+Math.pow(coords[1]-playerVillages[pvi][1].Y,2))
                    if(distance <= conf.farm.wrecker.maxDistance        // is in rage of max distance
                        && playerVillages[pvi][1].isWrecker)            // is wrecker
                    {
                        function isVillageWithNotFrozenOff(name){
                            let result = true
                            for (let foovi = conf.freeze.offOnVillages.length-1; foovi >= 0; foovi--) {
                                if(name.indexOf(conf.freeze.offOnVillages[foovi]) >= 0){
                                    result = false
                                }
                            }
                            return result
                        }

                        if(isVillageWithNotFrozenOff(playerVillages[pvi][1].name)){
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
            return 0
        }

        collectAfStatistic()
        collectCoordinatesForWrecker()
    }

    localStorage.setItem("MajQs.coordinatesForWreckerTemp", JSON.stringify(Array.from(coordinatesForWrecker)))
    localStorage.setItem("MajQs.afStatistics", JSON.stringify(Array.from(afStatistics)))

    // next page
    let strongElement = $(`#plunder_list_nav tr`).eq(0).find('td').eq(0).children().filter('strong'); // current page
    let nextAnchor = strongElement.next('a');   // next page
    if (nextAnchor.length > 0) {
        nextAnchor[0].click();                  // next page
    } else {
        sortAndSaveCoordinates("MajQs.coordinatesForWrecker", coordinatesForWrecker)
        localStorage.removeItem("MajQs.coordinatesForWreckerTemp")
        goToNextLevel(collectServerDataLevel)
    }
}

function nextVillage(){
    var nextVillage = $("#village_switch_right").find(".arrowRight")
    if(nextVillage.length > 0){
        nextVillage.click()
    }else{
        playerVillages = getPlayerVillages()
        JSON.parse(localStorage.getItem("MajQs.farmVillageDoneList"))
            .forEach((villageId) => playerVillages.delete(villageId));
        if(playerVillages.size > 0){
            goToAfPageFor(playerVillages.entries().next().value[0])
        } else {
            goToScavengePage()
        }
    }
}

function processFarm() {
    console.log("Processing Farm..." );
    let rows = $(`#plunder_list tr`).slice(2);
    let firstColumnElements = $(`#plunder_list_nav tr`).eq(0).find('td').eq(0).children();
    let strongElement = firstColumnElements.filter('strong');

    var minDelay = conf.farm.speedInMilliseconds - 250
    if(minDelay < 250){
        minDelay = 250
    }

    function goBackToOneOrNextVillage(){
        if(firstColumnElements[0].tagName == 'STRONG'){
            nextVillage()
        } else {
            localStorage.setItem("MajQs.farmVillageDoneTemp" , $.cookie("global_village_id"))
            firstColumnElements[0].click() // back to [1]
        }
        return 0
    }

    function processRowWithDelay(index) {
        // go to next page
        if (index >= rows.length) {
            if (strongElement.length > 0) {
                let nextAnchor = strongElement.next('a');
                if (nextAnchor.length > 0) {
                    nextAnchor[0].click(); // next page
                } else {
                    if(conf.farm.repeatWhenNoMoreVillagesLeft === 0){
                        saveParameterToLocalStorage("MajQs.farmVillageDoneList", [$.cookie("global_village_id")])
                    }
                    goBackToOneOrNextVillage()
                }
            }
            return 0;
        }

        if($(rows[index]).find('td').eq(7).text() > conf.farm.maxDistance){
            saveParameterToLocalStorage("MajQs.farmVillageDoneList", [$.cookie("global_village_id")])
            goBackToOneOrNextVillage()
            return 0;
        }

        if ($(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('green') > -1   // pełna wygrana
            || $(rows[index]).find('td').eq(6).text() == '0' ) {                                    // mur 0

            function pressA(){
                // Click A
                var aButton = $(rows[index]).find('td').eq(8).find('a').first();
                if (aButton.is('.farm_icon_disabled')) {
                    saveParameterToLocalStorage("MajQs.farmVillageDoneList", [$.cookie("global_village_id")])
                    goBackToOneOrNextVillage()
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
                var afs = JSON.parse(localStorage.getItem("MajQs.afStatistics"));
                if(afs == null) {
                    return false
                }else{
                    var afStatistics = new Map(afs)
                    let coordinatesWithBrackets = $(rows[index]).find('td').eq(3).find('a').first().text()
                    let coordinates = coordinatesWithBrackets.substr(coordinatesWithBrackets.indexOf('(') + 1, coordinatesWithBrackets.indexOf(')') -2 )
                    var villageStatistics = afStatistics.get(coordinates)
                    if(villageStatistics == null || villageStatistics.length < 5){
                        return false
                    }else{
                        let pressB = true;
                        for(let vsi=villageStatistics.length - 5; vsi < villageStatistics.length; vsi++){
                            if(villageStatistics[vsi].max_loot == false){
                                pressB = false;
                            }
                        }
                        return pressB;
                    }
                }
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
                goBackToOneOrNextVillage()
            }else {
                processRowWithDelay(index + 1);
            }
        }, getRandomDelay(minDelay, conf.farm.speedInMilliseconds + 250));
    }

    if ($('div.autoHideBox.error').length > 0 || isVillageWithFrozenOff()) {
        saveParameterToLocalStorage("MajQs.farmVillageDoneList", [$.cookie("global_village_id")])
        goBackToOneOrNextVillage()
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
                if(JSON.parse(localStorage.getItem("MajQs.farmVillageDoneList")).length >= getPlayerVillages().size ){
                    goToScavengePage()
                } else {
                    nextVillage()
                }
            }
        }
    }, 1500)
} else {
    localStorage.removeItem("MajQs.farmVillageDoneList");
}
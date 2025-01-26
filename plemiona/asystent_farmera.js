function processCollectAFStatistics() {
    console.log("Processing collecting AF statistics..." );
    var coordinatesForWrecker = []
    var allAFCoordinates = []

    var afStatistics = JSON.parse(localStorage.getItem("afStatistics"));
    if (afStatistics == null){
        afStatistics = [];
    }

    // collect coordinates
    let rows = $(`#plunder_list tr`).slice(2);
    for (let index = 0; index < rows.length; index++) {
        let coordinatesWithBrackets = $(rows[index]).find('td').eq(3).find('a').first().text()
        let coordinates = coordinatesWithBrackets.substr(coordinatesWithBrackets.indexOf('(') + 1, coordinatesWithBrackets.indexOf(')') -2 )
        allAFCoordinates.push(coordinates)
        //coords, max_loot, date
        var max_loot = $(rows[index]).find('td').eq(2).find('img').first().attr('src')
        if(max_loot == null){
            max_loot = false;
        }else{
            max_loot = max_loot.indexOf('max_loot/1') > -1
        }

        var date = $(rows[index]).find('td').eq(4).text().replace("dzisiaj o ","").replace("wczoraj o ","")
        let exist = false;
        for(let afsi = 0; afsi < afStatistics.length; afsi++){
            if(afStatistics[afsi][0] == coordinates){
                exist = true;
                if(afStatistics[afsi][1][afStatistics[afsi][1].length-1][0] != date){
                    if(afStatistics[afsi][1].length >= 10){
                        afStatistics[afsi][1].shift()
                    }
                    afStatistics[afsi][1].push([date, max_loot])
                }
            }
        }
        if(!exist){
            afStatistics.push([coordinates, [[date, max_loot]]])
        }

        if ($(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('red') > -1                         // defeated
            && $(rows[index]).find('td').eq(3).find('img').length == 0                                                  // no attack is coming
            && $(rows[index]).find('td').eq(7).text() <= conf.farm.wrecker.maxDistance)                                 // is in rage of max distance
        {
            coordinatesForWrecker.push(coordinates)
        }
    }

    saveParameterToLocalStorage("coordinatesForWrecker", coordinatesForWrecker)
    saveParameterToLocalStorage("allAFCoordinates", allAFCoordinates)
    localStorage.setItem("afStatistics", JSON.stringify(afStatistics));

    // next page
    let strongElement = $(`#plunder_list_nav tr`).eq(0).find('td').eq(0).children().filter('strong'); // current page
    let nextAnchor = strongElement.next('a');   // next page
    if (nextAnchor.length > 0) {
        nextAnchor[0].click();                  // next page
    } else {
        goToNextLevel(collectServerDataLevel)
        return 0;
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
                        goToScavengePage()
                    }else{
                        firstColumnElements[0].click() // back to [1]
                    }
                }
            }
            return 0;
        }

        if($(rows[index]).find('td').eq(7).text() > conf.farm.maxDistance){
            goToScavengePage()
            return 0;
        }

        if ($(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('green') > -1   // pełna wygrana
            || $(rows[index]).find('td').eq(6).text() == '0' ) {                                    // mur 0

            var afStatistics = JSON.parse(localStorage.getItem("afStatistics"));
            for(let i=0; i < afStatistics.length; i++){
                let coordinatesWithBrackets = $(rows[index]).find('td').eq(3).find('a').first().text()
                let coordinates = coordinatesWithBrackets.substr(coordinatesWithBrackets.indexOf('(') + 1, coordinatesWithBrackets.indexOf(')') -2 )
                function pressA(){
                    console.log("pressing A")
                    // Click A
                    var aButton = $(rows[index]).find('td').eq(8).find('a').first();
                    if (aButton.is('.farm_icon_disabled')) {
                        goToScavengePage()
                    }
                    aButton.click();
                    return 0;
                }
                function pressB(){
                    console.log("pressing B")
                    // Click B
                    var bButton = $(rows[index]).find('td').eq(9).find('a').first();
                    if (bButton.is('.farm_icon_disabled')) {
                        pressA()
                    }
                    bButton.click();
                    return 0;
                }

                if(afStatistics[i][0] == coordinates){
                    function shouldPressB(){
                        let pressB = true;
                        for(let d=afStatistics[i][1].length - 3; d < afStatistics[i][1].length; d++){
                            if(afStatistics[i][1][d][1] == false){
                                pressB = false;
                            }
                        }
                        return pressB;
                    }
                    if(shouldPressB()){
                        pressB()
                    }else{
                        pressA()
                    }
                }else{
                    pressA()
                }
            }
        }

        setTimeout(function() {
            if ($('div.autoHideBox.error').length > 0) {
                goToScavengePage()
            }
            processRowWithDelay(index + 1);
        }, getRandomDelay(minDelay, conf.farm.speedInMilliseconds + 250));
    }

    if(isVillageWithFrozenOff()){
        goToScavengePage()
    }else{
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
        if(shouldProcessLevel(collectAFStatisticsLevel)){
            processCollectAFStatistics();
        } else {
            processFarm();
        }
    }, 1500)
}
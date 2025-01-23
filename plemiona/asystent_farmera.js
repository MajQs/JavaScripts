function processCollectAFStatistics() {
    console.log("Processing collecting AF statistics..." );
    var coordinatesForWrecker = []
    var allAFCoordinates= []

    // collect coordinates
    let rows = $(`#plunder_list tr`).slice(2);
    for (let index = 0; index < rows.length; index++) {
        let coordinatesWithBrackets = $(rows[index]).find('td').eq(3).find('a').first().text()
        let coordinates = coordinatesWithBrackets.substr(coordinatesWithBrackets.indexOf('(') + 1, coordinatesWithBrackets.indexOf(')') -2 )
        allAFCoordinates.push(coordinates)
        if ($(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('red') > -1 ) { // defeated
            if ($(rows[index]).find('td').eq(3).find('img').length == 0){ // no attack is coming
                coordinatesForWrecker.push(coordinates)
            }
        }
    }

    let currentCoordinatesForWrecker = JSON.parse(localStorage.getItem("coordinatesForWrecker"));
    if(currentCoordinatesForWrecker == null){
        localStorage.setItem("coordinatesForWrecker", JSON.stringify(coordinatesForWrecker));
    }else{
        localStorage.setItem("coordinatesForWrecker", JSON.stringify(currentCoordinatesForWrecker.concat(coordinatesForWrecker)));
    }

    let currentAllAFCoordinates = JSON.parse(localStorage.getItem("allAFCoordinates"));
    if(currentAllAFCoordinates == null){
        localStorage.setItem("allAFCoordinates", JSON.stringify(coordinatesForWrecker));
    }else{
        localStorage.setItem("allAFCoordinates", JSON.stringify(currentAllAFCoordinates.concat(allAFCoordinates)));
    }

    // next page
    let strongElement = $(`#plunder_list_nav tr`).eq(0).find('td').eq(0).children().filter('strong'); // current page
    let nextAnchor = strongElement.next('a'); // next page
    if (nextAnchor.length > 0) {
        nextAnchor[0].click(); // next page
    } else {
        goToCommandPage();
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

        // Click A
        if ( $(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('green') > -1 ) {
            var aButton = $(rows[index]).find('td').eq(8).find('a').first();
            if (aButton.is('.farm_icon_disabled')) {
                goToScavengePage()
            }
            aButton.click();
        }

        setTimeout(function() {
            if ($('div.autoHideBox.error').length > 0) {
                goToScavengePage()
            }
            processRowWithDelay(index + 1);
        }, getRandomDelay(minDelay, conf.farm.speedInMilliseconds + 250));
    }

    // start farm
    processRowWithDelay(0);
}

function isAF() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('screen') === "am_farm"
}

if (isAF()) {
    console.log("AF page..." );
    setTimeout(function() {
        if(localStorage.getItem("wreckerEnabled") == 'true'){
            processCollectAFStatistics();
        } else {
            processFarm();
        }
    }, 2000)
}

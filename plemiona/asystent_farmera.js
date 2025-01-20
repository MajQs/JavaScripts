function processWrecker() {
    console.log("Processing Wrecker..." );
    var coordinatesForWrecker = []

    function processWreckerWithDelay() {
        // collect coordinates
        let rows = $(`#plunder_list tr`).slice(2);
        for (let index = 0; index < rows.length; index++) {
            if ($(rows[index]).find('td').eq(1).find('img').first().attr('src').indexOf('red') > -1 ) { // defeated
                if ($(rows[index]).find('td').eq(3).find('img').length == 0){ // no attack is coming
                    var coordinates = $(rows[index]).find('td').eq(3).find('a').first().text()
                    coordinatesForWrecker.push(coordinates.substr(coordinates.indexOf('(') + 1, coordinates.indexOf(')') -2 ))
                }
            }
        }

        // next page
        let strongElement = $(`#plunder_list_nav tr`).eq(0).find('td').eq(0).children().filter('strong'); // current page
        let nextAnchor = strongElement.next('a'); // next page
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

    // start Wrecker
    processWreckerWithDelay();
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
            if ($('div.autoHideBox.error').length > 0) {
                goToScavenge()
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
        if(conf.wrecker.enabled == 1 && localStorage.getItem("wreckerEnabled") == 'true'){
            processWrecker();
        } else if (conf.farm.enabled == 1) {
            processFarm();
        }
    }, 2000)
}

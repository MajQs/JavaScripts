
function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function goToScavengePage() {
    var url = new URL(window.location.href);
    var village = new URLSearchParams(url.search).get('village');
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=scavenge';
}

function goToMassScavengePage() {
    var url = new URL(window.location.href);
    var village = new URLSearchParams(url.search).get('village');
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=scavenge_mass';
}

function goToAfPage() {
    var url = new URL(window.location.href);
    var village = new URLSearchParams(url.search).get('village');
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=am_farm';
}

function goToCommandPage() {
    var url = new URL(window.location.href);
    var village = new URLSearchParams(url.search).get('village');
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=command';
}

function goToCommandPageFor(village) {
    var url = new URL(window.location.href);
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=command';
}

function processCollectingServerData() {
    console.log("Processing Collecting Server Data..." );

	var Request = new XMLHttpRequest();
	Request.onreadystatechange = function() {

        function ScriptVillage(Data) {
            var allAFCoordinates = JSON.parse(localStorage.getItem("allAFCoordinates"));
            var mainVillageId = $.cookie("global_village_id")
            var playerId;
            var playerVillages = new Map();
            var possibleVillages = [];
            var Villages = Data.split("\n");

            function setPlayerId(){
                var i = Villages.length - 1;
                while(i--) {
                    Village[i] = Villages[i].split(',');
                    if(Village[i][0] == mainVillageId){
                        playerId = Village[i][4]
                        localStorage.setItem("MajQs.playerId", playerId);
                    }
                }
                return 0;
            }
            setPlayerId();

            function setPlayerVillages(){
                var i = Villages.length - 1;

                function isOff(villageId){
                    let ram = false;
                    let light = false;
                    let spy = false;
                    var Request = new XMLHttpRequest();
                    Request.open('GET', 'game.php?village='+villageId+'&screen=train', false);
                    Request.send(null);
                    var units = $("<div>").html(Request.responseText).find("#train_form").find('tr');
                    for(let i=0; i<units.length; i++){
                        if(units.eq(i).find(".nowrap a").attr("data-unit") == "ram"
                            && units.eq(i).find("td").eq(2).text().split("/")[1] >= 1){
                            ram = true
                        }
                        if(units.eq(i).find(".nowrap a").attr("data-unit") == "light"
                            && units.eq(i).find("td").eq(2).text().split("/")[1] >= 1){
                            light = true
                        }
                        if(units.eq(i).find(".nowrap a").attr("data-unit") == "spy"
                            && units.eq(i).find("td").eq(2).text().split("/")[1] >= 1){
                            spy = true
                        }
                    }
                    return ram && light && spy
                }

                while(i--) {
                    Village[i] = Villages[i].split(',');
                    if(Village[i][4] == playerId){
                        var villageData = {
                            "name": Village[i][1],
                            "X": Village[i][2],
                            "Y": Village[i][3],
                            "isWrecker": isOff(Village[i][0]),
                            "autoExpansionDailyAttacks": conf.farm.autoExpansion.dailyNumberOfAttacksFromVillage
                        }
                        playerVillages.set(Village[i][0], villageData)
                    }
                }
                return 0;
            }
            setPlayerVillages();
            localStorage.setItem("MajQs.playerVillages", JSON.stringify(Array.from(playerVillages)));

            // ignore villages available in AF
//            function filterPossibleVillages(){
//                for (let vi = Villages.length-1; vi >= 0; vi--) {
//                    for (let afci = allAFCoordinates.length-1; afci >= 0; afci--) {
//                        village = Villages[vi].split(',');
//                        coords = allAFCoordinates[afci].split("|")
//                        if(coords[0] == village[2] && coords[1] == village[3]){
//                            Villages.splice(vi,1);
//                            allAFCoordinates.splice(afci,1);
//                            afci = 0;
//                        }
//                    }
//                }
//                return 0;
//            }
//            filterPossibleVillages();

            // look for possible barbarian villages in distance
//            function setPossibleVillages(){
//                var i = Villages.length - 1;
//                while(i--) {
//                    Village[i] = Villages[i].split(',');
//                    if(Village[i][4] == 0 && Village[i][5] <= conf.farm.autoExpansion.maxVillagePoints){       // barbarian village
//                        for (let pvi = playerVillages.length-1; pvi >= 0; pvi--) {
//                            var distance = Math.sqrt(Math.pow(Village[i][2]-playerVillages[pvi][0][2],2)+Math.pow(Village[i][3]-playerVillages[pvi][0][3],2))
//                            if(distance <= conf.farm.autoExpansion.maxDistance){
//                                //[playerVillageID, distance, barbarianVillage]
//                                possibleVillages.push([playerVillages[pvi][0][0], distance, Village[i]])
//                            }
//                        }
//                    }
//                }
//                return 0;
//            }
//            setPossibleVillages()

            // sort possibleVillages by distance
//            possibleVillages.sort(function (a, b) {
//                return a[1] - b[1]
//            })
//
//            localStorage.setItem("coordinatesForAutoExpansion", JSON.stringify(possibleVillages));
            return 0;
        }
        ScriptVillage(Request.responseText)
        return 0;
	};
	Request.open('GET', '/map/village.txt' , true);
    Request.send();
    return 0;
}

// Start bot check
setTimeout(function() {
    var captcha = $('#bot_check')
    if ($(captcha).length > 0) {
        $(captcha).find('a').first().click()
    }
}, 2000);

// Complete Quest
function completeQuest(){
    var completeQuestBtn = $('.btn btn-confirm-yes status-btn quest-complete-btn')
    if ($(completeQuestBtn).length > 0) {
        $(completeQuestBtn).first().click()
    }
}

// Page timer
// return to AF when you stay too long on the same page
var timer = 10 ;
function pageTimer() {
    setTimeout(function() {
        console.log("TIMER: min left = " + timer );
        if (timer >= 0) {
            timer--;
            completeQuest()
            pageTimer()
        } else {
            goToNextLevel(defaultLevel)
        }
    }, 60000);
}
pageTimer()


const defaultLevel = 0
const collectAFStatisticsLevel = 1
const collectServerDataLevel = 2
const wreckerLevel = 3
const autoExpansionLevel = 4
const switchVillageLevel = 99

if(localStorage.getItem("MajQs.scriptLevel") == switchVillageLevel){
    goToNextLevel(defaultLevel);
}

function goToNextLevel(level){
    localStorage.setItem("MajQs.scriptLevel", level)
    switch(level){
        case defaultLevel:
            goToAfPage()
            break;
        case collectAFStatisticsLevel:
            goToAfPage()
            break;
        case collectServerDataLevel:
            var day = String(new Date().getDate()).padStart(2, '0');
            if(localStorage.getItem("MajQs.collectedServerDataDay") != day){
                processCollectingServerData()
                localStorage.setItem("MajQs.collectedServerDataDay", day);
                setTimeout(function() {
                    goToNextLevel(wreckerLevel);
                }, 20000)
            }else{
                goToNextLevel(wreckerLevel);
            }
            break;
        case wreckerLevel:
            goToCommandPage();
            break;
        case autoExpansionLevel:
            localStorage.removeItem("MajQs.coordinatesForWrecker")
            goToCommandPage();
            break;
        case switchVillageLevel:
            var nextVillage = $("#village_switch_right").find(".arrowRight")
            if(nextVillage.length > 0){
                nextVillage.click()
            }else{
                goToNextLevel(defaultLevel);
            }
            break;
        default:
            localStorage.setItem("MajQs.scriptLevel", 0)
            goToAfPage()
    }
    return 0;
}

function shouldProcessLevel(level){
    return localStorage.getItem("MajQs.scriptLevel") == level
}

function saveParameterToLocalStorage(name, data){
    let current = JSON.parse(localStorage.getItem(name));
    if(current == null){
        localStorage.setItem(name, JSON.stringify(data));
    }else{
        localStorage.setItem(name, JSON.stringify(current.concat(data)));
    }
    return 0;
}

function isVillageWithFrozenOff(){
    for(let i=0; i < conf.freeze.offOnVillages.length; i++){
        if($("#menu_row2_village").find('a').text().indexOf(conf.freeze.offOnVillages[i]) >= 0){
            return true
        }
    }
    return false
}

function isVillageWithFrozenDeff(){
    for(let i=0; i < conf.freeze.deffOnVillages.length; i++){
        if($("#menu_row2_village").find('a').text().indexOf(conf.freeze.deffOnVillages[i]) >= 0){
        if(conf.freeze.deffOnVillages[i] == $("#menu_row2_village").find('a').text()){
            return true
        }
    }
    return false
}


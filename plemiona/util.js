
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

function getPlayerVillages(){
    var playerVillages = JSON.parse(localStorage.getItem("MajQs.playerVillages"))
    if(playerVillages == null){
        return new Map()
    }else {
        return new Map(playerVillages)
    }
}

function getWorldSetup(){
    ws = JSON.parse(localStorage.getItem("MajQs.worldSetup"))
    if(ws == null){
        var dt;
        $.ajax({
            'async':false,
            'url':'/interface.php?func=get_config',
            'dataType':'xml',
            'success':function(data){dt=data;}
        });

        var worldSetup = {
            speed:Number($(dt).find("config speed").text()),
            unit_speed:Number($(dt).find("config unit_speed").text()),
            archer:Number($(dt).find("game archer").text()),
            knight:Number($(dt).find("game knight").text())
        };
        localStorage.setItem("MajQs.worldSetup", JSON.stringify(worldSetup))
        return worldSetup
    } else{
        return ws
    }
}

function sortAndSaveCoordinates(name, coordMap){
    if(coordMap != null && coordMap.size > 0){
        var sortedByDistance = Array.from(coordMap.entries()).sort(function (a, b) {return a[1][0][1] - b[1][0][1]})
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
        localStorage.setItem(name, JSON.stringify(Array.from(villageMap)));
        return 0;
    }
}

function processCollectingServerData() {
    console.log("Processing Collecting Server Data..." );
    getWorldSetup()

	var Request = new XMLHttpRequest();
	Request.onreadystatechange = function() {

        function ScriptVillage(Data) {
            var afStatistics = new Map(JSON.parse(localStorage.getItem("MajQs.afStatistics")));
            var mainVillageId = $.cookie("global_village_id")
            var playerId;
            var playerVillages = new Map();
            var coordinatesForAutoExpansion = new Map();
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
            function filterPossibleVillages(){
                for (let vi = Villages.length-1; vi >= 0; vi--) {
                    village = Villages[vi].split(',');
                    villageCoords = village[2]+"|"+village[3]
                    if(afStatistics.get(villageCoords) != null){
                        Villages.splice(vi,1);
                        afStatistics.delete(villageCoords);
                    }
                }
                return 0;
            }
            filterPossibleVillages();

            // look for possible barbarian villages in distance
            function setCoordinatesForAutoExpansion(){
                var i = Villages.length - 1;
                playerVillagesArray = Array.from(playerVillages)
                while(i--) {
                    Village[i] = Villages[i].split(',');
                    if(Village[i][4] == 0 && Village[i][5] <= conf.farm.autoExpansion.maxVillagePoints){       // barbarian village
                        for (let pvi = playerVillagesArray.length-1; pvi >= 0; pvi--) {
                            var distance = Math.sqrt(Math.pow(Village[i][2]-playerVillagesArray[pvi][1].X,2)+Math.pow(Village[i][3]-playerVillagesArray[pvi][1].Y,2))
                            if(distance <= conf.farm.autoExpansion.maxDistance){
                                //[playerVillageID, distance, barbarianVillage]
                                coordinates = Village[i][2]+"|"+Village[i][3]
                                var current = coordinatesForAutoExpansion.get(coordinates)
                                if(current == null){
                                    current = []
                                }
                                current.push([playerVillagesArray[pvi][0], distance])
                                current.sort(function (a, b) {
                                    return a[1] - b[1]
                                })
                                coordinatesForAutoExpansion.set(coordinates, current)
                            }
                        }
                    }
                }
                return 0;
            }
            setCoordinatesForAutoExpansion()
            sortAndSaveCoordinates("MajQs.coordinatesForAutoExpansion", coordinatesForAutoExpansion)

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

const defaultLevel = 0
const collectAFStatisticsLevel = 1
const collectServerDataLevel = 2
const wreckerLevel = 3
const autoExpansionLevel = 4
const schedulerLevel = 5
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
            goToCommandPage();
            break;
        case schedulerLevel:
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
            return true
        }
    }
    return false
}


// *** autoTagIncomingAttacks ***
function autoTagIncomingAttacks(){
    var incomingsAmount = localStorage.getItem("MajQs.incomingsAmount");
    if(incomingsAmount == null){
        incomingsAmount = 0
    }
    var currentIncomingsAmount = $("#incomings_amount").text()
    if(incomingsAmount != currentIncomingsAmount){
        localStorage.setItem("MajQs.incomingsAmount", currentIncomingsAmount);
        $("#incomings_amount").click()
    }
    return 0
}

function isIncomingsAttacks() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('mode') === "incomings" && params.get('subtype') === "attacks"
}

if (isIncomingsAttacks()) {
    console.log("Incomings Attacks page..." );
    setTimeout(function() {
        if($('.quickedit-label:contains("Atak")').length > 0){
            $("#select_all").click()
            $('#incomings_table :input[value="Etykieta"]').click()
        }else{
            goToNextLevel(defaultLevel)
        }
    }, 1500)
}

function schedulerCalculateSendDate(){
    var playerVillages = getPlayerVillages()
    var worldSetup = getWorldSetup()
    var scheduler = localStorage.getItem("MajQs.scheduler")
    function getSlowestUnitFactor(units){
        var unitSpeeds = [18,22,18,18,9,10,10,11,30,30,10,35] //"Pikinier","Miecznik","Topornik","Ĺucznik","Zwiadowca","LK","ĹNK","CK","Taran","Katapulta","Rycerz","Szlachcic"
        var slowestUnitFactor = 0
        for(let i=0; i< units.length; i++){
            if(units[i] > 0 && unitSpeeds[i] > slowestUnitFactor){
                slowestUnitFactor = unitSpeeds[i]
            }
        }
        return slowestUnitFactor
    }

    if(scheduler == null || scheduler.length != conf.scheduler.length){
        scheduler = []
        for(let i=0; i < conf.scheduler.length; i++){
            var entryDate = new Date(conf.scheduler[i][0]);
            var playerVillage = playerVillages.get(conf.scheduler[i][1])
            var targetCoords = conf.scheduler[i][2].split("|")
            var distance = Math.sqrt(Math.pow(targetCoords[0]-playerVillage.X,2)+Math.pow(targetCoords[1]-playerVillage.Y,2))
            var sendDate = entryDate - (distance * worldSetup.speed * worldSetup.unit_speed * getSlowestUnitFactor(conf.scheduler[i][3]) * 60000)
            scheduler.push({
                "item": i,
                "sendDateUTC": new Date(sendDate)
            })
        }
        localStorage.setItem("MajQs.scheduler", JSON.stringify(scheduler))
    }
    return scheduler
}

function schedulerCheck() {
    if(!shouldProcessLevel(schedulerLevel)){
        var scheduler = schedulerCalculateSendDate()
        var now = new Date();
        for(let i=0; i < scheduler.length; i++){
            var sendDate = new Date(scheduler[i].sendDateUTC);
            var diffMins = Math.round((((sendDate - now) % 86400000) % 3600000) / 60000); // minutes
            if(diffMins > 0 && diffMins <= 3){
                localStorage.setItem("MajQs.scheduledItem", scheduler[i].item)
                goToNextLevel(schedulerLevel)
            }
        }
    }
    return 0
}

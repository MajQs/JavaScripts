
function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function goToScavengePage() {
    var url = new URL(window.location.href);
    var village = new URLSearchParams(url.search).get('village');
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=scavenge';
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

function processCollectingAddingBarbarianVillagesToAF() {
    console.log("Processing adding barbarian villages to AF..." );

	var Request = new XMLHttpRequest();
	Request.onreadystatechange = function() {

        function ScriptVillage(Data) {
            var allAFCoordinates = JSON.parse(localStorage.getItem("allAFCoordinates"));
            var mainVillageId = $.cookie("global_village_id")
            var targetVillages = [];
            var X; var Y;
            var Villages = Data.split("\n");

            // find main village coords
            var i = Villages.length - 1;
            while(i--) {
                Village[i] = Villages[i].split(',');
                if(Village[i][0] == mainVillageId){
                    X = Village[i][2]
                    Y = Village[i][3]
                }
            }
            console.log("Main coords " + X + "|" + Y)

            // look for possible barbarian villages in distance
            var possibleVillages = [];
            var i = Villages.length - 1;
            while(i--) {
                Village[i] = Villages[i].split(',');
                if((Village[i][4] == 0 || Village[i][4] == undefined)   // barbarian village
                    && conf.addingBarbarianVillagesToAF.maxDistance >= Math.sqrt(Math.pow(Village[i][2]-X,2)+Math.pow(Village[i][3]-Y,2)))
                {
                    possibleVillages.push(Village[i])
                }
            }

            // ignore villages available in AF from possibleVillages
            for (let pvi = possibleVillages.length-1; pvi >= 0; pvi--) {
                for (let afci = allAFCoordinates.length-1; afci >= 0; afci--) {
                    coords = allAFCoordinates[afci].split("|")
                    if(coords[0] == possibleVillages[pvi][2] && coords[1] == possibleVillages[pvi][3]){
                        possibleVillages.splice(pvi,1)
                        allAFCoordinates.splice(afci,1)
                        //afci = 0;
                    }
                }
            }
            localStorage.setItem("coordinatesForAddingBarbarianVillagesToAF", JSON.stringify(possibleVillages));
        }
        ScriptVillage(Request.responseText)

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
var timer = conf.scavenger.durationInMin ;
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


var defaultLevel = 0
var collectAFStatisticsLevel = 1
var wreckerLevel = 2
var addingBarbarianVillagesToAFLevel = 3

function goToNextLevel(level){
    localStorage.setItem("scriptLevel", level)
    switch(level){
        case 0:
            localStorage.setItem("coordinatesForWrecker", JSON.stringify([]));
            localStorage.setItem("allAFCoordinates", JSON.stringify([]));
            goToAfPage()
            break;
        case 1:
            localStorage.setItem("coordinatesForWrecker", JSON.stringify([]));
            localStorage.setItem("allAFCoordinates", JSON.stringify([]));
            goToAfPage()
            break;
        case 2:
            goToCommandPage();
            break;
        case 3:
            var day = String(new Date().getDate()).padStart(2, '0');
            if(localStorage.getItem("day") != day){
                processCollectingAddingBarbarianVillagesToAF()
                localStorage.setItem("day", day);
            }
            setTimeout(function() {
                goToCommandPage();
            }, 2000)
            break;
        default:
            localStorage.setItem("scriptLevel", 0)
            goToAfPage()
    }
}

function shouldProcessLevel(level){
    return localStorage.getItem("scriptLevel") == level
}



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

// Start bot check
setTimeout(function() {
    var captcha = $('#bot_check')
    if ($(captcha).length > 0) {
        $(captcha).find('a').first().click()
    }
}, 5000);

// Page timer
// return to AF when you stay too long on the same page
var timer = conf.scavenger.durationInMin + 1 ;
function pageTimer() {
    setTimeout(function() {
        console.log("TIMER: min left = " + timer );
        if (timer > 0) {
            timer--;
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
        default:
            localStorage.setItem("scriptLevel", 0)
            goToAfPage()
    }
}

function shouldProcessLevel(level){
    return localStorage.getItem("scriptLevel") == level
}


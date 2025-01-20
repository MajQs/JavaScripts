var settings = {
    max_ressources: '9999',
    archers: '0',
    skip_level_1: '0'
}

var settings_spear = {
    untouchable: '0',
    max_unit_number: '9999',
    conditional_safeguard: '0'
}

var settings_sword = {
    untouchable: '0',
    max_unit_number: '9999',
    conditional_safeguard: '0'
}

var settings_axe = {
    untouchable: '0',
    max_unit_number: '9999',
    conditional_safeguard: '0'
}

var settings_archer = {
    untouchable: '0',
    max_unit_number: '9999',
    conditional_safeguard: '0'
}

var settings_light = {
    untouchable: '0',
    max_unit_number: '0',
    conditional_safeguard: '0'
}

var settings_marcher = {
    untouchable: '0',
    max_unit_number: '9999',
    conditional_safeguard: '0'
}

var settings_heavy = {
    untouchable: '0',
    max_unit_number: '9999',
    conditional_safeguard: '0'
}

function processScavenge() {
    var container = $('.options-container');

    function processLevel(level) {
        if (level < 0) {
            return
        }

        var divLevel = container.find('.scavenge-option')[level]
        if ($(divLevel).find('.free_send_button').length > 0) {
            $.getScript('https://media.innogamescdn.com/com_DS_PL/skrypty/Asystent_Zbieracza.js');

            setTimeout(function() {
                $(divLevel).find('.free_send_button')[0].click();
                setTimeout(function() {
                    processLevel(level - 1)
                }, 2000);
            }, 2000);
        }
    }

    if ($('.time').is(":visible")) {
        console.log("Scavenger still working: skipping " );
    } else {
        processLevel(3)
    }
}

function processScavengerLoop() {
    processScavenge()
    console.log("Min left: " + timer);
    setTimeout(function() {
        if (timer > 0) {
            timer--;
            processScavengerLoop()
        } else {
            localStorage.setItem("coordinatesForWrecker", JSON.stringify([]));
            localStorage.setItem("wreckerEnabled", true)
            goToAF()
        }
    }, 60000);
}

function isScavenge() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('mode') === "scavenge"
}

if (isScavenge()) {
    console.log("Scavenger page..." );
    timer = conf.scavenger.durationInMin;
    if(conf.scavenger.enabled == 1){
        setTimeout(function() {
            processScavengerLoop()
        }, 2000)
    }
}

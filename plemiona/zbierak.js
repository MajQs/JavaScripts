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
    console.log("Processing Scavenger..." );
    var container = $('.options-container');

    function processLevel(level) {
        if (level < 0) {
            return 0;
        }

        var divLevel = container.find('.scavenge-option')[level]
        if ($(divLevel).find('.free_send_button').length > 0) {
            $.getScript('https://media.innogamescdn.com/com_DS_PL/skrypty/Asystent_Zbieracza.js');

            setTimeout(function() {
                if($('.autoHideBox.error').length > 0){
                    goToNextLevel(collectAFStatisticsLevel)
                }
            }, 500);

            setTimeout(function() {
                $(divLevel).find('.free_send_button')[0].click();
                setTimeout(function() {
                    processLevel(level - 1)
                }, 2000);
            }, 2000);
        }else {
            processLevel(level - 1)
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
    setTimeout(function() {
        if (timer > 0) {
            processScavengerLoop()
        } else {
            goToNextLevel(collectAFStatisticsLevel)
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
    setTimeout(function() {
        if(isVillageWithFrozenOff()){
            settings_axe.max_unit_number = 0
            settings_light.max_unit_number = 0
            settings_marcher.max_unit_number = 0
        }
        if(isVillageWithFrozenDeff()) {
            settings_spear.max_unit_number = 0
            settings_sword.max_unit_number = 0
            settings_archer.max_unit_number = 0
            settings_heavy.max_unit_number = 0
        }
        processScavengerLoop()
    }, 2000)
}

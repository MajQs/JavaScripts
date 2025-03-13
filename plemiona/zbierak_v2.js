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
    saveParameterToLocalStorage("MajQs.scavengerVillageDoneList", [$.cookie("global_village_id")])

    var container = $('.options-container');
    function processLevel(level) {
        if (level < 0) {
            goToMassScavengePage()
        } else {
            var divLevel = container.find('.scavenge-option')[level]
            if ($(divLevel).find('.free_send_button').length > 0) {

                $.getScript('https://media.innogamescdn.com/com_DS_PL/skrypty/Asystent_Zbieracza.js');

                let n = 30
                function waitForScript(){
                    if ($('input[name="spear"]').val() > 0
                        || $('input[name="sword"]').val() > 0
                        || $('input[name="axe"]').val() > 0
                        || $('input[name="archer"]').val() > 0
                        || $('input[name="light"]').val() > 0
                        || $('input[name="marcher"]').val() > 0
                        || $('input[name="heavy"]').val() > 0
                        || n == 0)
                    {

                        setTimeout(function() {
                            $(divLevel).find('.free_send_button')[0].click();

                            setTimeout(function() {
                                if($('.autoHideBox.error').length > 0){
                                    goToMassScavengePage()
                                }
                            }, 100);

                            setTimeout(function() {
                                processLevel(level - 1)
                            }, 500);
                        }, 100);

                    } else {
                        setTimeout(function() {
                            console.log("n = " + n );
                            n--
                            waitForScript()
                        }, 100);
                    }
                }
                waitForScript()

            }else {
                processLevel(level - 1)
            }
        }
        return 0;
    }

    if ($('.time').is(":visible")) {
        console.log("Scavenger still working: skipping " );
        goToMassScavengePage()
    } else {
        processLevel(3)
    }
    return 0;
}

function processMassScavenger(){
    console.log("Mass Scavenger page..." );
    var villages = $(".villages-container tbody tr").slice(1);

    function isVillageAlreadyNotVisited(villageId){
        var scavengerVillageDoneList = JSON.parse(localStorage.getItem("MajQs.scavengerVillageDoneList"));
        if(scavengerVillageDoneList == null) {
            scavengerVillageDoneList = []
        }
        for(let i=0; i<scavengerVillageDoneList.length; i++){
            if(villages.eq(villageId).attr("id").indexOf(scavengerVillageDoneList[i]) > 0){
                return false
            }
        }
        return true
    }

    if(villages != null){
        function findAndProcessVillage(){
            let found = false;
            for(let i=0; i< villages.length; i++){
                if(villages.eq(i).find(".option.option-1.option-active").length == 0
                    && villages.eq(i).find(".option.option-2.option-active").length == 0
                    && villages.eq(i).find(".option.option-3.option-active").length == 0
                    && villages.eq(i).find(".option.option-4.option-active").length == 0)
                {
                    if(isVillageAlreadyNotVisited(i)){
                        found = true
                        window.location.href = villages.eq(i).find("td a").first().attr('href')
                    }
                }
            }
            return found
        }

        let found = findAndProcessVillage()
        if(!found){
            let firstColumnElements = $('div.premium-required table tr').eq(0).find('td').eq(0).children();
            let strongElement = firstColumnElements.filter('strong');
            if (strongElement.length > 0) {
                let nextAnchor = strongElement.next('a');
                if (nextAnchor.length > 0) {
                    nextAnchor[0].click(); // next page
                } else {
                    setTimeout(function() {
                        firstColumnElements[0].click() // back to [1]
                    }, 15 * 60000);
                }
            }
        }
    }
}

function isScavenge() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('mode') === "scavenge"
}

function isMassScavenge() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('mode') === "scavenge_mass"
}

function getLeftTime(){
    var startTime = JSON.parse(localStorage.getItem("MajQs.scavengerStartTime"));
    if(startTime == null){
        startTime = Date.now()
        localStorage.setItem("MajQs.scavengerStartTime", startTime);
    }
    let margin = 3
    let pass = (Date.now() - startTime)/60/1000
    return Math.round(conf.scavenger.durationInMinutes - getRandomDelay(pass - margin , pass + margin))
}

if (isScavenge()) {
    console.log("Scavenger page..." );
    setTimeout(function() {
        settings.archers = getWorldSetup().archer
        settings_spear.conditional_safeguard = conf.scavenger.spearSafeguard
        if(isVillageWithFrozenOff()){
            console.log("Off frozen!");
            settings_axe.max_unit_number = 0
            settings_light.max_unit_number = 0
            settings_marcher.max_unit_number = 0
        }
        if(isVillageWithFrozenDeff()) {
           console.log("Deff frozen!");
            settings_spear.max_unit_number = 0
            settings_sword.max_unit_number = 0
            settings_archer.max_unit_number = 0
            settings_heavy.max_unit_number = 0
        }
        processScavenge()
    }, 500)
}

function processMassScavengerLoop() {
    processMassScavenger()
    setTimeout(function() {
        if (timer > 0) {
            processMassScavengerLoop()
        } else {
            goToNextLevel(collectAFStatisticsLevel)
        }
    }, 60000);
}

if (isMassScavenge()) {
    console.log("Mass Scavenger page..." );
    setTimeout(function() {
        timer = getLeftTime();
        processMassScavengerLoop()
    }, 500)
}

if(!isMassScavenge() && !isScavenge()){
    localStorage.removeItem("MajQs.scavengerVillageDoneList");
    localStorage.removeItem("MajQs.scavengerStartTime");
}

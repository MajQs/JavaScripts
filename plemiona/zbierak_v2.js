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

function Asystent_Zbieracza(){

    function fill(unit, number) {
        let field = $(`[name=${unit}]`);
        number = Number(number);
        field.trigger('focus');
        field.trigger('keydown');
        field.val(number);
        field.trigger('keyup');
        field.trigger('change');
        field.blur();
    }
    var units_settings = {
        0: settings_spear,
        1: settings_sword,
        2: settings_axe,
        3: settings_archer,
        4: settings_light,
        5: settings_marcher,
        6: settings_heavy
    };

    var units = {
        0: 'spear',
        1: 'sword',
        2: 'axe',
        3: 'archer',
        4: 'light',
        5: 'marcher',
        6: 'heavy'
    };

    var units_capacity = [25,15,10,10,80,50,50];
    var to_send = [0,0,0,0,0,0,0];

    var doc=document;
    url=doc.URL;
    if(url.indexOf('screen=place')==-1 || url.indexOf('mode=scavenge')==-1)
        alert('Skrypt do uĹźycia w placu w zakĹadce zbieractwo');
    else{
        var unfree_levels = doc.getElementsByClassName('btn btn-default free_send_button btn-disabled');
        var unlocked_levels = doc.getElementsByClassName('btn btn-default free_send_button');
        var free_levels = unlocked_levels.length - unfree_levels.length;

        if(free_levels == 0){

        } else {
            if(unlocked_levels.length > 1 && free_levels == 1 && settings.skip_level_1 == 1){

            } else {
                let unit;
                for(var i = 0; i<7; i++){
                    if(settings.archers == 0)
                        if(i==3 || i==5)
                            i++;
                    if(units_settings[i].max_unit_number > 0){
                        unit = units[i];
                        let field = $(`[name=${unit}]`)
                        let available = Number(field[0].parentNode.children[1].innerText.match(/\d+/)[0]);

                        if(available > units_settings[i].untouchable)
                            available -= units_settings[i].untouchable;
                        else
                            available = 0;

                        if(available >= units_settings[i].conditional_safeguard)
                            available -= units_settings[i].conditional_safeguard;

                        if(unlocked_levels.length == 1){
                            if(available > units_settings[i].max_unit_number)
                                available = units_settings[i].max_unit_number;
                            to_send[i] = available;
                        }
                        else{
                            let packs = 0;
                            if(settings.skip_level_1 == 0)
                                packs += 15;
                            if(unlocked_levels.length >= 2)
                                packs += 6;
                            if(unlocked_levels.length >= 3)
                                packs += 3;
                            if(unlocked_levels.length == 4)
                                packs += 2;

                            let left_packs = 0;
                            let packs_now;

                            if(free_levels >= 1 && settings.skip_level_1 == 0){
                                packs_now = 15;
                                left_packs += 15;
                            }
                            if(free_levels >= 2){
                                packs_now = 6;
                                left_packs += 6;
                            }
                            if(free_levels >= 3){
                                packs_now = 3;
                                left_packs += 3;
                            }
                            if(free_levels ==4){
                                packs_now = 2;
                                left_packs += 2;
                            }

                            if(available*packs/left_packs > units_settings[i].max_unit_number)
                                to_send[i] = units_settings[i].max_unit_number*packs_now/packs;
                            else
                                to_send[i] = available*packs_now/left_packs;
                        }
                    }
                }

                let capacity = 0;
                for(var i = 0; i<7; i++){
                    if(settings.archers == 0)
                        if(i==3 || i==5)
                            i++;
                    capacity += units_capacity[i] * to_send[i];
                }

                if(free_levels == 1){
                    settings.max_ressources *= 10;
                }
                else if(free_levels == 2){
                    settings.max_ressources *= 4;
                }
                else if(free_levels == 3){
                    settings.max_ressources *= 2;
                }
                else{
                    settings.max_ressources *= 1.3333;
                }

                if(capacity > settings.max_ressources){
                    let ratio = settings.max_ressources / capacity;
                    for(var i = 0; i<7; i++){
                        if(settings.archers == 0)
                            if(i==3 || i==5)
                                i++;
                        to_send[i] = to_send[i] * ratio;
                    }
                }

                for(var i = 0; i<7; i++){
                    if(settings.archers == 0)
                        if(i==3 || i==5)
                            i++;
                    unit = units[i];
                    fill(unit, Math.floor(to_send[i]));
                }
            }
        }
    }

    return true
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

                //$.getScript('https://media.innogamescdn.com/com_DS_PL/skrypty/Asystent_Zbieracza.js');
                Asystent_Zbieracza()

                let n = 10
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
                            }, SETTINGS.scavenger.speedInMilliseconds * 0.8);

                            setTimeout(function() {
                                processLevel(level - 1)
                            }, SETTINGS.scavenger.speedInMilliseconds);
                        }, SETTINGS.scavenger.speedInMilliseconds);

                    } else {
                        setTimeout(function() {
                            console.log("n = " + n );
                            n--
                            waitForScript()
                        }, SETTINGS.scavenger.speedInMilliseconds);
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

    return params.get('mode') === "scavenge" && $(".captcha").length == 0
}

function isMassScavenge() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('mode') === "scavenge_mass" && $(".captcha").length == 0
}

function getLeftTime(){
    var startTime = JSON.parse(localStorage.getItem("MajQs.scavengerStartTime"));
    if(startTime == null){
        startTime = Date.now()
        localStorage.setItem("MajQs.scavengerStartTime", startTime);
    }
    let margin = 3
    let pass = (Date.now() - startTime)/60/1000
    return Math.round(SETTINGS.scavenger.durationInMinutes - getRandomDelay(pass - margin , pass + margin))
}

if (isScavenge()) {
    console.log("Scavenger page..." );
    setTimeout(function() {
        settings.archers = getWorldSetup().archer
        settings_spear.conditional_safeguard = SETTINGS.scavenger.spearSafeguardMode == "Number" ? SETTINGS.scavenger.spearSafeguard : Math.round(($('a[data-unit="spear"]').text().replace("(","").replace(")","") * SETTINGS.scavenger.spearSafeguard / 100))
        settings_sword.conditional_safeguard = SETTINGS.scavenger.swordSafeguardMode == "Number" ? SETTINGS.scavenger.swordSafeguard : Math.round(($('a[data-unit="sword"]').text().replace("(","").replace(")","") * SETTINGS.scavenger.swordSafeguard / 100))
        settings_archer.conditional_safeguard = SETTINGS.scavenger.archerSafeguardMode == "Number" ? SETTINGS.scavenger.archerSafeguard : Math.round(($('a[data-unit="archer"]').text().replace("(","").replace(")","") * SETTINGS.scavenger.archerSafeguard / 100))
        settings_heavy.conditional_safeguard = SETTINGS.scavenger.heavySafeguardMode == "Number" ? SETTINGS.scavenger.heavySafeguard : Math.round(($('a[data-unit="heavy"]').text().replace("(","").replace(")","") * SETTINGS.scavenger.heavySafeguard / 100))
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
    }, 1000)
}

if(!isMassScavenge() && !isScavenge()){
    localStorage.removeItem("MajQs.scavengerVillageDoneList");
    localStorage.removeItem("MajQs.scavengerStartTime");
}

function processWrecker() {
    console.log("Processing wrecker..." );
    var coordinatesForWrecker = JSON.parse(localStorage.getItem("MajQs.coordinatesForWrecker"));

    function process(target){
        function isEnough(unit, count){
            var unit = $("#"+unit).text()
            return unit.substr(unit.indexOf('(') + 1, unit.indexOf(')') - 1 ) >= count
        }

        if(isEnough("units_entry_all_light" , conf.farm.wrecker.units.light)
            && isEnough("units_entry_all_ram" , conf.farm.wrecker.units.ram)
            && isEnough("units_entry_all_spy" ,1))
        {
             $("#place_target").find('input').first().val(target)

             $("#unit_input_light").val(conf.farm.wrecker.units.light)
             $("#unit_input_ram").val(conf.farm.wrecker.units.ram)
             $("#unit_input_spy").val("1")

             var catapultsCountText = $("#units_entry_all_catapult").text()
             if(catapultsCountText.substr(catapultsCountText.indexOf('(') + 1, catapultsCountText.indexOf(')') - 1 ) >= conf.farm.wrecker.units.catapult){
                 $("#unit_input_catapult").val(conf.farm.wrecker.units.catapult)
             }

             $("#target_attack").click()
        } else {
            coordMap.delete($.cookie("global_village_id"))
            localStorage.setItem("MajQs.coordinatesForWrecker", JSON.stringify(Array.from(coordMap)));
            if(coordMap.size > 0){
                goToCommandPageFor(coordMap.entries().next().value[0])
            } else{
                goToNextLevel(autoExpansionLevel)
            }
        }

        return 0;
    }

    if ($('.error_box').length > 0
        || coordinatesForWrecker == null
        || coordinatesForWrecker.length == 0)
    {
        localStorage.removeItem("MajQs.coordinatesForWrecker");
        goToNextLevel(autoExpansionLevel)
    } else {
        var coordMap = new Map(coordinatesForWrecker)
        var villageTargets = coordMap.get($.cookie("global_village_id"))
        if(villageTargets != null && !isVillageWithFrozenOff()){
            let target = villageTargets.shift()
            if(villageTargets.length == 0){
                coordMap.delete($.cookie("global_village_id"))
            }
            localStorage.setItem("MajQs.coordinatesForWrecker", JSON.stringify(Array.from(coordMap)));
            process(target);
        }else if(isVillageWithFrozenOff()){
            coordMap.delete($.cookie("global_village_id"))
            localStorage.setItem("MajQs.coordinatesForWrecker", JSON.stringify(Array.from(coordMap)));
            if(coordMap.size > 0){
                goToCommandPageFor(coordMap.entries().next().value[0])
            } else{
                goToNextLevel(autoExpansionLevel)
            }
        }else{
            goToCommandPageFor(coordMap.entries().next().value[0])
        }
    }

    return 0;
}

function processAutoExpansion() {
    console.log("Processing Auto Expansion..." );
    var coordinatesForAutoExpansion = JSON.parse(localStorage.getItem("MajQs.coordinatesForAutoExpansion"));

    var playerVillages = JSON.parse(localStorage.getItem("MajQs.playerVillages"));
    var attacksLeft
    for(let pvi=0; pvi < playerVillages.length; pvi++){
        if($.cookie("global_village_id") == playerVillages[pvi][0]){
            attacksLeft = playerVillages[pvi][1].autoExpansionDailyAttacks
        }
    }

    function process(target){
        function isEnough(unit, count){
            var unit = $("#"+unit).text()
            return unit.substr(unit.indexOf('(') + 1, unit.indexOf(')') - 1 ) >= count
        }

        if(isEnough("units_entry_all_spy" ,1)){
            for(let pvi=0; pvi < playerVillages.length; pvi++){
                if($.cookie("global_village_id") == playerVillages[pvi][0]){
                    playerVillages[pvi][1].autoExpansionDailyAttacks = --attacksLeft
                }
            }
            localStorage.setItem("MajQs.playerVillages", JSON.stringify(playerVillages));

            $("#place_target").find('input').first().val(target)
            $("#unit_input_spy").val("1")
            $("#target_attack").click()
        } else {
            coordMap.delete($.cookie("global_village_id"))
            localStorage.setItem("MajQs.coordinatesForAutoExpansion", JSON.stringify(Array.from(coordMap)));
            if(coordMap.size > 0){
                goToCommandPageFor(coordMap.entries().next().value[0])
            } else{
                goToNextLevel(defaultLevel)
            }
        }

        return 0;
    }

    var spyCountText = $("#units_entry_all_spy").text()
    if ($('.error_box').length > 0
        || coordinatesForAutoExpansion == null
        || coordinatesForAutoExpansion.length == 0
        || attacksLeft <= 0
        || spyCountText.substr(spyCountText.indexOf('(') + 1, spyCountText.indexOf(')') - 1 ) == 0)
    {
        localStorage.removeItem("MajQs.coordinatesForAutoExpansion");
        goToNextLevel(defaultLevel)
    } else {
        var coordMap = new Map(coordinatesForAutoExpansion)
        var villageTargets = coordMap.get($.cookie("global_village_id"))
        if(villageTargets != null){
            let target = villageTargets.shift()
            if(villageTargets.length == 0){
                coordMap.delete($.cookie("global_village_id"))
            }
            localStorage.setItem("MajQs.coordinatesForAutoExpansion", JSON.stringify(Array.from(coordMap)));
            process(target);
        }else{
            goToCommandPageFor(coordMap.entries().next().value[0])
        }
    }
    return 0;
}

function processScheduler() {
    var action = conf.scheduler[localStorage.getItem("MajQs.scheduledItem")]

    if($.cookie("global_village_id") != action[1]){
        goToCommandPageFor(action[1])
    } else {
        $("#unit_input_spy").val("1")
        $("#place_target").find('input').first().val(action[2])
        $("#target_attack").click()
    }
    return 0
}

function isCommand() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('screen') === "place" && $("#target_attack").length > 0
}

function isCommandConfirm() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('screen') === "place" && $("#troop_confirm_submit").length > 0
}

function schedulerSubmitLoop(){
    var today = new Date();
    var date = new Date(conf.scheduler[localStorage.getItem("MajQs.scheduledItem")][0]);
    var diffMs = date - today

    if(diffMs <= 10){
        localStorage.removeItem("MajQs.scheduledItem")
        localStorage.setItem("MajQs.scriptLevel", autoExpansionLevel)
        $("#troop_confirm_submit").click()
    }else{
        setTimeout(function() {
            schedulerSubmitLoop()
        }, 2000)
    }
}

if (isCommand()) {
    console.log("Command page..." );
    setTimeout(function() {
        if(shouldProcessLevel(wreckerLevel)){
            processWrecker();
        } else if(shouldProcessLevel(autoExpansionLevel)){
            processAutoExpansion()
        } else if(shouldProcessLevel(schedulerLevel)){
            processScheduler()
        }
    }, 2000)
}

if (isCommandConfirm()) {
    console.log("Command Confirm page..." );
    setTimeout(function() {
        if(shouldProcessLevel(wreckerLevel) || shouldProcessLevel(autoExpansionLevel)){
            $("#troop_confirm_submit").click()
        }else if(shouldProcessLevel(schedulerLevel)){
            schedulerSubmitLoop()
        }
    }, 2000)
}
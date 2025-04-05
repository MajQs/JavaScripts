function processWrecker() {
    console.log("Processing wrecker..." );
    var coordinatesForWrecker = JSON.parse(localStorage.getItem("MajQs.coordinatesForWrecker"));

    function process(target){
        function isEnough(unit, count){
            var unit = $("#"+unit).text()
            return unit.substr(unit.indexOf('(') + 1, unit.indexOf(')') - 1 ) >= count
        }

        if(isEnough("units_entry_all_light" , SETTINGS.farm.wrecker.units.light)
            && isEnough("units_entry_all_ram" , SETTINGS.farm.wrecker.units.ram)
            && isEnough("units_entry_all_spy" ,1))
        {
             $("#place_target").find('input').first().val(target)

             $("#unit_input_light").val(SETTINGS.farm.wrecker.units.light)
             $("#unit_input_ram").val(SETTINGS.farm.wrecker.units.ram)
             $("#unit_input_spy").val("1")

             var catapultsCountText = $("#units_entry_all_catapult").text()
             if(catapultsCountText.substr(catapultsCountText.indexOf('(') + 1, catapultsCountText.indexOf(')') - 1 ) >= SETTINGS.farm.wrecker.units.catapult){
                 $("#unit_input_catapult").val(SETTINGS.farm.wrecker.units.catapult)
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
    var action = SETTINGS.scheduler[localStorage.getItem("MajQs.scheduledItem")]

    if($('.error_box').length > 0){
        localStorage.removeItem("MajQs.scheduledItem")
        goToNextLevel(defaultLevel)
    } else {

        function setUnit(name, count){
            if(count == "all"){
                $("#units_entry_all_" + name).click()
            }else{
                $("#unit_input_" + name).val(count)
            }
        }

        playerVillageId = action[scheduler_fromVillage_index]
        if($.cookie("global_village_id") != playerVillageId){
            goToCommandPageFor(playerVillageId)
        } else {
            units = action[scheduler_units_index]
            setUnit("spear", units[0][0])
            setUnit("sword", units[0][1])
            setUnit("axe", units[0][2])
            setUnit("archer", units[0][3])
            setUnit("spy", units[0][4])
            setUnit("light", units[0][5])
            setUnit("marcher", units[0][6])
            setUnit("heavy", units[0][7])
            setUnit("ram", units[0][8])
            setUnit("catapult", units[0][9])
            setUnit("knight", units[0][10])
            setUnit("snob", units[0][11])

            $("#place_target").find('input').first().val(action[scheduler_toCords_index])

            setTimeout(function() {
                if(action[scheduler_type_index] == "Napad"){
                    $("#target_attack").click()
                } else if(action[scheduler_type_index] == "Pomoc"){
                    $("#target_support").click()
                }
            }, 2000)
        }
    }

    return 0
}

function isCommand() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('screen') === "place" && $("#target_attack").length > 0 && $(".captcha").length == 0
}

function isCommandConfirm() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('screen') === "place" && $("#troop_confirm_submit").length > 0 && $(".captcha").length == 0
}

function schedulerSubmit(){

    Timing.resetTickHandlers()

    var action = SETTINGS.scheduler[localStorage.getItem("MajQs.scheduledItem")]
    SETTINGS.scheduler.splice(localStorage.getItem("MajQs.scheduledItem"),1)
    localStorage.setItem("MajQs.settings", JSON.stringify(SETTINGS))

    units = action[scheduler_units_index]
    for(let i=1; i < units.length; i++){
        $("#troop_confirm_train").click()
    }

    for(let i=1; i < units.length; i++){
        if(units[i].length > 0){
          $('input[name="train['+(i+1)+'][spear]"]').val(units[i][0])
          $('input[name="train['+(i+1)+'][sword]"]').val(units[i][1])
          $('input[name="train['+(i+1)+'][axe]"]').val(units[i][2])
          $('input[name="train['+(i+1)+'][archer]"]').val(units[i][3])
          $('input[name="train['+(i+1)+'][spy]"]').val(units[i][4])
          $('input[name="train['+(i+1)+'][light]"]').val(units[i][5])
          $('input[name="train['+(i+1)+'][marcher]"]').val(units[i][6])
          $('input[name="train['+(i+1)+'][heavy]"]').val(units[i][7])
          $('input[name="train['+(i+1)+'][ram]"]').val(units[i][8])
          $('input[name="train['+(i+1)+'][catapult]"]').val(units[i][9])
          $('input[name="train['+(i+1)+'][knight]"]').val(units[i][10])
          $('input[name="train['+(i+1)+'][snob]"]').val(units[i][11])
        }
    }
    Place.confirmScreen.updateUnitsSum()

    const catTargetMap = new Map([
      ["Ratusz", 'main'],
      ["Koszary", 'barracks'],
      ["Stajnia", 'stable'],
      ["Warsztat", 'garage'],
      ["Kościół", 'church'],
      ["Pałac", 'snob'],
      ["Kuźnia", 'smith'],
      ["Plac", 'place'],
      ["Piedestał", 'statue'],
      ["Rynek", 'market'],
      ["Tartak", 'wood'],
      ["Cegielnia", 'stone'],
      ["Huta żelaza", 'iron'],
      ["Zagroda", 'farm'],
      ["Spichlerz", 'storage'],
      ["Mur", 'wall'],
    ]);
    var catTarget = catTargetMap.get(action[scheduler_target_index])
    if(catTarget != null){
        $('select[name="building"]').val(catTarget)
    }

    sendDate = new Date(action[scheduler_sendTime_index])

    localStorage.setItem("MajQs.scriptLevel", autoExpansionLevel)

    function greed(){
        setTimeout(function() {
            if( (Timing.getCurrentServerTime() + Timing.getEstimatedLatency()) >= sendDate){
                $("#troop_confirm_submit").click()
            } else {
                greed()
            }
        }, 10)
    }
    greed()

    return 0
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
            schedulerSubmit()
        }
    }, 2000)
}

if(!isCommand() && !isCommandConfirm() ){
    localStorage.removeItem("MajQs.scheduledItem")
}
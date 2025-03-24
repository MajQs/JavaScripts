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

        playerVillageId = villageNameToId(action[2])
        if($.cookie("global_village_id") != playerVillageId){
            goToCommandPageFor(playerVillageId)
        } else {
            setUnit("spear", action[5][0][0])
            setUnit("sword", action[5][0][1])
            setUnit("axe", action[5][0][2])
            setUnit("archer", action[5][0][3])
            setUnit("spy", action[5][0][4])
            setUnit("light", action[5][0][5])
            setUnit("marcher", action[5][0][6])
            setUnit("heavy", action[5][0][7])
            setUnit("ram", action[5][0][8])
            setUnit("catapult", action[5][0][9])
            setUnit("knight", action[5][0][10])
            setUnit("snob", action[5][0][11])

            $("#place_target").find('input').first().val(action[3])

            setTimeout(function() {
                if(action[0] == "Napad"){
                    $("#target_attack").click()
                } else if(action[0] == "Pomoc"){
                    $("#target_support").click()
                }
            }, 1000)
        }
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

function schedulerSubmit(){

    Timing.resetTickHandlers()

    var action = SETTINGS.scheduler[localStorage.getItem("MajQs.scheduledItem")]
    for(let i=1; i < action[5].length; i++){
        $("#troop_confirm_train").click()
    }
    for(let i=1; i < action[5].length; i++){
        if(action[5][i].length > 0){
          $('input[name="train['+(i+1)+'][spear]"]').val(action[5][i][0])
          $('input[name="train['+(i+1)+'][sword]"]').val(action[5][i][1])
          $('input[name="train['+(i+1)+'][axe]"]').val(action[5][i][2])
          $('input[name="train['+(i+1)+'][archer]"]').val(action[5][i][3])
          $('input[name="train['+(i+1)+'][spy]"]').val(action[5][i][4])
          $('input[name="train['+(i+1)+'][light]"]').val(action[5][i][5])
          $('input[name="train['+(i+1)+'][marcher]"]').val(action[5][i][6])
          $('input[name="train['+(i+1)+'][heavy]"]').val(action[5][i][7])
          $('input[name="train['+(i+1)+'][ram]"]').val(action[5][i][8])
          $('input[name="train['+(i+1)+'][catapult]"]').val(action[5][i][9])
          $('input[name="train['+(i+1)+'][knight]"]').val(action[5][i][10])
          $('input[name="train['+(i+1)+'][snob]"]').val(action[5][i][11])
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
    var catTarget = catTargetMap.get(action[4])
    if(catTarget != null){
        $('select[name="building"]').val(catTarget)
    }

    sendDate = new Date(JSON.parse(localStorage.getItem("MajQs.scheduler"))[localStorage.getItem("MajQs.scheduledItem")].sendDateUTC)
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
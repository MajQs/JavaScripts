function processWrecker() {
    console.log("Processing wrecker..." );
    var coordinatesForWrecker = JSON.parse(localStorage.getItem("coordinatesForWrecker"));

    function process(){
        var coordinate = coordinatesForWrecker.shift()
        localStorage.setItem("coordinatesForWrecker", JSON.stringify(coordinatesForWrecker));
        $("#place_target").find('input').first().val(coordinate)

        $("#unit_input_light").val("4")
        $("#unit_input_ram").val("4")
        $("#unit_input_spy").val("1")

        var catapultsCountText = $("#units_entry_all_catapult").text()
        if(catapultsCountText.substr(catapultsCountText.indexOf('(') + 1, catapultsCountText.indexOf(')') - 1 ) >= 3){
            $("#unit_input_catapult").val("3")
        }

        $("#target_attack").click()
        return 0;
    }

    if ($('.error_box').length > 0
        || coordinatesForWrecker.length == 0
        || coordinatesForWrecker == null
        || isVillageWithFrozenOff())
    {
        localStorage.setItem("coordinatesForWrecker", JSON.stringify([]));
        goToNextLevel(autoExpansionLevel)
    } else{
        process();
    }

    return 0;
}

function processAutoExpansion() {
    console.log("Processing Auto Expansion..." );
    var coordinatesForAutoExpansion = JSON.parse(localStorage.getItem("coordinatesForAutoExpansion"));
    var playerVillages = JSON.parse(localStorage.getItem("playerVillages"));
    var mainVillageId = $.cookie("global_village_id")

    var attacksLeft
    for(let pvi=0; pvi < playerVillages.length; pvi++){
        if(mainVillageId == playerVillages[pvi][0][0]){
            attacksLeft = playerVillages[pvi][1]
        }
    }

    function process(){
        for (let i = 0; i < coordinatesForAutoExpansion.length; i++) {
            if(mainVillageId == coordinatesForAutoExpansion[i][0]){
            var target = coordinatesForAutoExpansion[i][2][0]
                function isUnderAttack(){
                    let isUnderAttack = false
                    var Request = new XMLHttpRequest();
                	Request.open('GET', 'game.php?village='+mainVillageId+'&screen=info_village&id=' + target , false);
                    Request.send(null);
                    var commands = $("<div>").html(Request.responseText).find("#commands_outgoings");
                    for(let cvni=0; cvni < commands.length; cvni++){
                        for(let pvi=0; pvi < playerVillages.length; pvi++){
                            var pvn = playerVillages[pvi][0][1].replace("+", " ")
                            var cvn = commands.eq(cvni).text()
                            if(cvn.indexOf(pvn) > -1){
                                isUnderAttack = true
                            }
                        }
                    }
                    return isUnderAttack
                }

                $("#place_target").find('input').first().val(coordinatesForAutoExpansion[i][2][2]+"|"+coordinatesForAutoExpansion[i][2][3])
                coordinatesForAutoExpansion.splice(i,1)
                localStorage.setItem("coordinatesForAutoExpansion", JSON.stringify(coordinatesForAutoExpansion));

                if(!isUnderAttack()){
                    for(let pvi=0; pvi < playerVillages.length; pvi++){
                        if(mainVillageId == playerVillages[pvi][0][0]){
                            playerVillages[pvi][1] = --attacksLeft
                        }
                    }
                    localStorage.setItem("playerVillages", JSON.stringify(playerVillages));
                    $("#unit_input_spy").val("1")
                    $("#target_attack").click()
                    return 0;
                } else {
                    goToCommandPage();
                }
            }
        }
        return 0;
    }

    var spyCountText = $("#units_entry_all_spy").text()
    if ($('.error_box').length > 0
        || coordinatesForAutoExpansion.length == 0
        || coordinatesForAutoExpansion == null
        || attacksLeft <= 0
        || spyCountText.substr(spyCountText.indexOf('(') + 1, spyCountText.indexOf(')') - 1 ) == 0)
    {
        goToNextLevel(switchVillageLevel)
    } else {
        process();
    }

    return 0;
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

if (isCommand()) {
    console.log("Command page..." );
    setTimeout(function() {
        if(shouldProcessLevel(wreckerLevel)){
            processWrecker();
        } else if(shouldProcessLevel(autoExpansionLevel)){
            processAutoExpansion()
        }
    }, 2000)
}

if (isCommandConfirm()) {
    console.log("Command Confirm page..." );
    setTimeout(function() {
        if(shouldProcessLevel(wreckerLevel) || shouldProcessLevel(autoExpansionLevel)){
            $("#troop_confirm_submit").click()
        }
    }, 2000)
}
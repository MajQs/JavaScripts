function processWrecker() {
    console.log("Processing wrecker..." );
    var coordinatesForWrecker = JSON.parse(localStorage.getItem("coordinatesForWrecker"));

    if ($('.error_box').length > 0 || coordinatesForWrecker.length == 0 || coordinatesForWrecker == null) {
        localStorage.setItem("coordinatesForWrecker", JSON.stringify([]));
        goToNextLevel(autoExpansionLevel)
        return 0;
    }

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

function processAutoExpansionLevel() {
    console.log("Processing Auto Expansion..." );
    var coordinatesForAutoExpansion = JSON.parse(localStorage.getItem("coordinatesForAutoExpansion"));

    if ($('.error_box').length > 0 || coordinatesForAutoExpansion.length == 0 || coordinatesForAutoExpansion == null) {
        goToNextLevel(defaultLevel)
        return 0;
    }

    var mainVillageId = $.cookie("global_village_id")
    for (let i = 0; i < coordinatesForAutoExpansion.length; i++) {
        if(mainVillageId == coordinatesForAutoExpansion[i][0]){
            $("#place_target").find('input').first().val(coordinatesForAutoExpansion[i][2][2]+"|"+coordinatesForAutoExpansion[i][2][3])
            coordinatesForAutoExpansion.splice(i,1)
            localStorage.setItem("coordinatesForAutoExpansion", JSON.stringify(coordinatesForAutoExpansion));

            $("#unit_input_spy").val("1")

            $("#target_attack").click()
            return 0;
        }
    }

    return 0;
}

function isCommand() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('screen') === "place" && (params.get('mode') === "command" || params.get('mode') == null)
}

function isCommandConfirm() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('screen') === "place" && params.get('try') === "confirm" && Array.from(url.searchParams).length == 3
}

if (isCommand()) {
    console.log("Command page..." );
    setTimeout(function() {
        if(shouldProcessLevel(wreckerLevel)){
            processWrecker();
        } else if(shouldProcessLevel(autoExpansionLevel)){
            processAutoExpansionLevel()
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
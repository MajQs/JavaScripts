function processWreckerInCommand() {
    console.log("Processing wrecker..." );
    var coordinatesForWrecker = JSON.parse(localStorage.getItem("coordinatesForWrecker"));

    if ($('.error_box').length > 0 || coordinatesForWrecker.length == 0 || coordinatesForWrecker == null) {
        localStorage.setItem("wreckerEnabled", false)
        localStorage.setItem("coordinatesForWrecker", JSON.stringify([]));
        goToAfPage()
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
}

//function processAddingBarbarianVillagesToAF() {
//    console.log("Processing adding barbarian villages to AF..." );
//
//	var Request = new XMLHttpRequest();
//	Request.onreadystatechange = function() {
//	    console.log("READY")
//
//        var Distance;
//
//        function ScriptVillage(Data) {
//            var allAFCoordinates = JSON.parse(localStorage.getItem("allAFCoordinates"));
//            var mainVillageId = $.cookie("global_village_id")
//            var targetVillages = [];
//            var X; var Y;
//            var Villages = Data.split("\n");
//
//            var i = Villages.length - 1;
//            while(i--) {
//                Village[i] = Villages[i].split(',');
//                if(Village[i][0] == mainVillageId){
//                    X = Village[i][2]
//                    Y = Village[i][3]
//                }
//            }
//
//            var i = Villages.length - 1;
//            while(i--) {
//                Village[i] = Villages[i].split(',');
//                if((Village[i][4] == 0 || Village[i][4] == undefined) && conf.addingBarbarianVillagesToAF.radius >= Math.sqrt(Math.pow(Village[i][2]-X,2)+Math.pow(Village[i][3]-Y,2)))
//                {
//                    targetVillages.push(Village[i])
//                }
//            }
//            console.log(targetVillages)
//        }
//
//        ScriptVillage(Request.responseText)
//
//	};
//	Request.open('GET', '/map/village.txt' , true);
//    Request.send();
//
//}

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
    if(localStorage.getItem("wreckerEnabled") == 'true'){
        setTimeout(function() {
            processWreckerInCommand();
        }, 2000)
    }
}

if (isCommandConfirm()) {
    console.log("Command Confirm page..." );
    if(localStorage.getItem("wreckerEnabled") == 'true'){
        setTimeout(function() {
            $("#troop_confirm_submit").click()
        }, 2000)
    }
}
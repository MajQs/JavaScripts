$.getScript('https://stevenlevithan.com/assets/misc/date.format.js');

// Page timer
// return to AF when you stay too long on the same page
function pageTimer() {
    console.log("TIMER: min left = " + timer );
    autoTagIncomingAttacks()
    schedulerCheck()
    setTimeout(function() {
        timer--;
        if (timer >= 0) {
            completeQuest()
            pageTimer()
        } else {
            goToNextLevel(defaultLevel)
        }
    }, 60000);
}
setTimeout(function() {
    pageTimer()
}, 1000);

function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// *** SETTINGS ***
function loadSettings(){
    settings = JSON.parse(localStorage.getItem("MajQs.settings"))
    if(settings == null){
        var default_settings =
        {
            farm: {                               // FARMA -> wysyła A z AF (pełna wygrana lub poziom muru 0)
                maxDistance: 99,
                speedInMilliseconds: 700,               // odstęp pomiędzy wysłaniem wojsk (speedInMilliseconds +-250ms)
                repeatWhenNoMoreVillagesLeft: 1,        // 0 -> idzie do zbieraka, 1 -> wraca na pierwszą strone
                wrecker: {                              // BURZYCIEL -> wymaga: (1 skan, lk, taran), opcjonalne: kat
                    maxDistance: 15,                           // (10 = 5h przy prędkości jednostek: 0.625)
                    units: {
                        light: 4,
                        ram: 4,
                        catapult: 7
                    }
                },
                autoExpansion: {                        // AUTO EKSPANSIA - wysyła 1 skan na niezbadane barby
                    maxDistance: 30,
                    maxVillagePoints: 500,                    // aby uniknąć wiosek graczy którzy usuneli konto itp.
                    dailyNumberOfAttacksFromVillage: 50       // ilość ataków z jednej wioski gracza na dzień
                }
            },
            scavenger: {                              // ZBIERAK -> nie bierze LK pod uwagę
                spearSafeguard: 0,                         // ile pozostawić pik
                swordSafeguard: 0,                          // ile pozostawić mieczy
                durationInMinutes: 30                       // minuty spędzone na zbieraku (+- 3min)
            },
            freeze: {                                 // ZAMRAŻARKA - wystarczy podać część nazwy wioski
                offOnVillages: ["village1", "village2"],
                deffOnVillages: ["village1"]
            },
            scheduler: [
                ["Napad", 0, "2025-02-26T22:50:01.000", "2025-02-26T22:50:01.000", "M001", "393|564", "Mur",     [[0,0,"all",0,0,"all","all",0,"all","all","all",0],[0,0,0,10,0,0,0,0,0,0,0,0]]],
                ["Napad", 0, "2025-02-27T22:50:01.000", "2025-02-26T22:50:01.000", "M002", "393|564", "Zagroda", [[0,0,200,0,0,10,"all",0,"all","all","all",0]]],
                ["Pomoc", 0, "2025-02-27T22:50:01.000", "2025-02-26T22:50:01.000", "M002", "393|564", "", [[0,0,200,0,0,10,"all",0,"all","all","all",0]]]
            ]
        }
        return default_settings
    } else{
        return settings
    }
}
var SETTINGS = loadSettings()

var handleSettingsEvent = () => {
	var startDialog = Dialog.show(
		'Script', `<div id='dudialog'><form>
			<fieldset><legend>Farm</legend><table>
                <tr>
                    <td><label>Max distance:</label></td>
                    <td><input id='farm-maxDistance' type="number" value='${SETTINGS.farm.maxDistance}'/></td>
                </tr>
                <tr>
                    <td><label>Speed in Milliseconds:</label></td>
                    <td><input id='farm-speedInMilliseconds' type="number" value='${SETTINGS.farm.speedInMilliseconds}'/></td>
                </tr>
                <tr>
                    <td><label for="repeatWhenNoMoreVillagesLeft">Repeat when no more villages left</label></td>
                    <td><input type="checkbox" id="farm-repeatWhenNoMoreVillagesLeft" name="repeatWhenNoMoreVillagesLeft"></td>
                </tr>
			</table></fieldset>
			<fieldset><legend>Wrecker</legend><table>
                <tr>
                    <td><label>Max distance:</label></td>
                    <td><input id='wrecker-maxDistance' type="number" value='${SETTINGS.farm.wrecker.maxDistance}'/></td>
                </tr>
                <tr>
                    <td><label>Light:</label></td>
                    <td><input id='wrecker-light' type="number" value='${SETTINGS.farm.wrecker.units.light}'/></td>
                </tr>
                <tr>
                    <td><label>Ram:</label></td>
                    <td><input id='wrecker-ram' type="number" value='${SETTINGS.farm.wrecker.units.ram}'/></td>
                </tr>
                <tr>
                    <td><label>Catapult:</label></td>
                    <td><input id='wrecker-catapult' type="number" value='${SETTINGS.farm.wrecker.units.catapult}'/></td>
                </tr>
            </table></fieldset>
            <fieldset><legend>Auto Expansion</legend><table>
                <tr>
                    <td><label>Max distance:</label></td>
                    <td><input id='autoExpansion-maxDistance' type="number" value='${SETTINGS.farm.autoExpansion.maxDistance}'/></td>
                </tr>
                <tr>
                    <td><label>Max Village points:</label></td>
                    <td><input id='autoExpansion-maxVillagePoints' type="number" value='${SETTINGS.farm.autoExpansion.maxVillagePoints}'/></td>
                </tr>
            </table></fieldset>
            <fieldset><legend>Scavenger</legend><table>
                <tr>
                    <td><label>Duration in minutes:</label></td>
                    <td><input id='scavenger-durationInMinutes' type="number" value='${SETTINGS.scavenger.durationInMinutes}'/></td>
                </tr>
                <tr>
                    <td><label>Spear safeguard:</label></td>
                    <td><input id='scavenger-spearSafeguard' type="number" value='${SETTINGS.scavenger.spearSafeguard}'/></td>
                </tr>
                <tr>
                    <td><label>Sword safeguard:</label></td>
                    <td><input id='scavenger-swordSafeguard' type="number" value='${SETTINGS.scavenger.swordSafeguard}'/></td>
                </tr>
            </table></fieldset>
            <fieldset><legend>Freeze</legend><table>
                <tr>
                    <td><label>Off on Villages:</label></td>
                    <td><input id='freeze-offOnVillages' value='${SETTINGS.freeze.offOnVillages}'/></td>
                </tr>
                <tr>
                    <td><label>Deff on Villages:</label></td>
                    <td><input id='freeze-deffOnVillages' value='${SETTINGS.freeze.deffOnVillages}'/></td>
                </tr>
            </table></fieldset>
            <fieldset><legend>Scheduler</legend><table id='scheduler-table' style="border-collapse: collapse;">
                <tr>
                    <td></td>
                    <td>Typ</td>

                    <td>Data wysłania</td>

                    <td>Data dotarcia</td>
                    <td>Z</td>
                    <td>DO</td>
                    <td>Cel</td>
                    <td>Wojska</td>
                </tr>
                <tr>
                    <td><select name="Typ" id="type">
                          <option value="Napad">Napad</option>
                        </select></td>
                    <td><input type="checkbox" id="farm" name=""></td>
                    <td><input id='freeze-offOnVillages' value='2025-03-19T23:59:00.500'/></td>
                    <td><input type="checkbox" id="farm" name=""></td>
                    <td><input id='freeze-offOnVillages' value='2025-03-19T23:59:00.500'/></td>
                    <td><input id='freeze-offOnVillages' value='001' /></td>
                    <td><input id='freeze-offOnVillages' value='678|647' style="width: 60px"/></td>
                    <td><select name="Cel" id="target">
                          <option value="Huta żelaza">Huta żelaza</option>
                        </select></td>
                    <td>
                        <table>
                            <tr>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                                <td><input type="number" id='1' value='1' style="width: 40px"/></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <button type="button" onclick="handleAddRowEvent()" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">Add</button>
        </fieldset>
        <br>
		<button type="button" onclick="handleSaveButtonEvent()" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">Zapisz!</button>
		</form></div>`
	)
	if(SETTINGS.farm.repeatWhenNoMoreVillagesLeft == 1){
      $("#farm-repeatWhenNoMoreVillagesLeft").prop('checked', true);
    }

    var window_height = $(window).height() * 0.65
    $("#dudialog").css({height:window_height+"px", overflow:"auto"});
    fillSchedulerTable()
}

function fillSchedulerTable(){
	const settings_image = document.createElement('img');
	settings_image.setAttribute('id', 'MajQs-settings');
    var tr = new Array()

    tr.push(
        `<tr style="border-bottom: 2pt solid black;">
            <td></td>
            <td>Typ</td>
            <td></td>
            <td>Data wysłania</td>
            <td></td>
            <td>Data dotarcia</td>
            <td>Z</td>
            <td>DO</td>
            <td>Cel</td>
            <td>Wojska</td>
        </tr>`)
    for (var r=0; r < SETTINGS.scheduler.length; r++){

            var type_index = 0
            var timeCheckbox_index = 1
            var sendTime_index = 2
            var attackTime_index = 3
            var fromVillage_index = 4
            var toCords_index = 5
            var target_index = 6
            var units_index = 7

            var tv = new Array()
            var playerVillages = Array.from(getPlayerVillages())
            playerVillages.sort((x, y) => x[1].name.localeCompare(y[1].name))
            for (var v=0; v < playerVillages.length; v++){
                tv[v] = `<option value=${playerVillages[v][0]} ${SETTINGS.scheduler[r][fromVillage_index] == playerVillages[v][0] ? 'selected="selected"' : ''} >${playerVillages[v][1].name}</option>`
            }

            var tur = new Array()
            for (var ur=0; ur < SETTINGS.scheduler[r][units_index].length; ur++){
                tur[ur] = `
                    <tr id='scheduler_${r}_units_${ur}'>
                        <td><input id='scheduler_${r}_units_${ur}_unit_0' value=${SETTINGS.scheduler[r][units_index][ur][0]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_1' value=${SETTINGS.scheduler[r][units_index][ur][1]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_2' value=${SETTINGS.scheduler[r][units_index][ur][2]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_3' value=${SETTINGS.scheduler[r][units_index][ur][3]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_4' value=${SETTINGS.scheduler[r][units_index][ur][4]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_5' value=${SETTINGS.scheduler[r][units_index][ur][5]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_6' value=${SETTINGS.scheduler[r][units_index][ur][6]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_7' value=${SETTINGS.scheduler[r][units_index][ur][7]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_8' value=${SETTINGS.scheduler[r][units_index][ur][8]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_9' value=${SETTINGS.scheduler[r][units_index][ur][9]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_10' value=${SETTINGS.scheduler[r][units_index][ur][10]} style="width: 30px"/></td>
                        <td><input id='scheduler_${r}_units_${ur}_unit_11' value=${SETTINGS.scheduler[r][units_index][ur][11]} style="width: 30px"/></td>
                    </tr>`
            }

            tr.push(`
            <tr style="border-bottom: 1pt solid black;">
                <td><button type="button" onclick="handleRemoveRowEvent(${r})" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">-</button></td>
                <td><select name="Typ" id='scheduler_${r}_type'>
                      <option value="Napad" ${SETTINGS.scheduler[r][type_index] == "Napad" ? 'selected="selected"' : ''} >Napad</option>
                      <option value="Pomoc" ${SETTINGS.scheduler[r][type_index] == "Pomoc" ? 'selected="selected"' : ''} >Pomoc</option>
                    </select></td>
                <td><input type="checkbox" id="scheduler_${r}_sendTime_checkbox" onclick="calculateTime(0, ${r})" name="" ${SETTINGS.scheduler[r][timeCheckbox_index] == 0 ? 'checked="checked"' : ''}></td>
                <td><input id='scheduler_${r}_sendTime' onchange="calculateTime(0, ${r})" value=${SETTINGS.scheduler[r][sendTime_index]} /></td>
                <td><input type="checkbox" id="scheduler_${r}_attackTime_checkbox" onclick="calculateTime(1, ${r})" name="" ${SETTINGS.scheduler[r][timeCheckbox_index] == 1 ? 'checked="checked"' : ''}></td>
                <td><input id='scheduler_${r}_attackTime' onchange="calculateTime(1, ${r})" value=${SETTINGS.scheduler[r][attackTime_index]} /></td>
                <td><select name="Typ" id='scheduler_${r}_fromVillage'>
                        ${tv.join('')}
                    </select></td>
                <td><input id='scheduler_${r}_toCords' value=${SETTINGS.scheduler[r][toCords_index]} style="width: 40px"/></td>
                <td><select name="Cel" id="scheduler_${r}_target">
                      <option value="" ${SETTINGS.scheduler[r][target_index] == "" ? 'selected="selected"' : ''}>Domyślny</option>
                      <option value="Ratusz" ${SETTINGS.scheduler[r][target_index] == "Ratusz" ? 'selected="selected"' : ''}>Ratusz</option>
                      <option value="Koszary" ${SETTINGS.scheduler[r][target_index] == "Koszary" ? 'selected="selected"' : ''}>Koszary</option>
                      <option value="Stajnia" ${SETTINGS.scheduler[r][target_index] == "Stajnia" ? 'selected="selected"' : ''}>Stajnia</option>
                      <option value="Warsztat" ${SETTINGS.scheduler[r][target_index] == "Warsztat" ? 'selected="selected"' : ''}>Warsztat</option>
                      <option value="Kościół" ${SETTINGS.scheduler[r][target_index] == "Kościół" ? 'selected="selected"' : ''}>Kościół</option>
                      <option value="Pałac" ${SETTINGS.scheduler[r][target_index] == "Pałac" ? 'selected="selected"' : ''}>Pałac</option>
                      <option value="Kuźnia" ${SETTINGS.scheduler[r][target_index] == "Kuźnia" ? 'selected="selected"' : ''}>Kuźnia</option>
                      <option value="Plac" ${SETTINGS.scheduler[r][target_index] == "Plac" ? 'selected="selected"' : ''}>Plac</option>
                      <option value="Piedestał" ${SETTINGS.scheduler[r][target_index] == "Piedestał" ? 'selected="selected"' : ''}>Piedestał</option>
                      <option value="Rynek" ${SETTINGS.scheduler[r][target_index] == "Rynek" ? 'selected="selected"' : ''}>Rynek</option>
                      <option value="Tartak" ${SETTINGS.scheduler[r][target_index] == "Tartak" ? 'selected="selected"' : ''}>Tartak</option>
                      <option value="Cegielnia" ${SETTINGS.scheduler[r][target_index] == "Cegielnia" ? 'selected="selected"' : ''}>Cegielnia</option>
                      <option value="Huta żelaza" ${SETTINGS.scheduler[r][target_index] == "Huta żelaza" ? 'selected="selected"' : ''}>Huta żelaza</option>
                      <option value="Zagroda" ${SETTINGS.scheduler[r][target_index] == "Zagroda" ? 'selected="selected"' : ''}>Zagroda</option>
                      <option value="Spichlerz" ${SETTINGS.scheduler[r][target_index] == "Spichlerz" ? 'selected="selected"' : ''}>Spichlerz</option>
                      <option value="Mur" ${SETTINGS.scheduler[r][target_index] == "Mur" ? 'selected="selected"' : ''}>Mur</option>
                    </select></td>
                <td>
                    <table id='scheduler_${r}_units-table'>
                        ${tur.join('')}
                    </table>
                    <button type="button" onclick="handleAddAttackEvent(${r})" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">Add</button>
                    <button type="button" onclick="handleRemoveAttackEvent(${r})" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">Remove</button>
                </td>
            </tr>`)
    }

	$('#scheduler-table').eq(0).html(tr.join(''))
}

function handleAddAttackEvent(row) {
	console.log("Add attack to row " + row);
	var attacks = $('#scheduler_'+row+'_units-table tr').length
    $('#scheduler_'+row+'_units-table').append(
        `<tr id='scheduler_${row}_units_${ur}'>
            <td><input id='scheduler_${row}_units_${attacks}_unit_0' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_1' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_2' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_3' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_4' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_5' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_6' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_7' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_8' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_9' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_10' value=0 style="width: 30px"/></td>
            <td><input id='scheduler_${row}_units_${attacks}_unit_11' value=0 style="width: 30px"/></td>
        </tr>`
    )
}
function handleRemoveAttackEvent(row) {
	console.log("Remove attack from row " + row);
	var attacks = $('#scheduler_'+row+'_units-table tr').length - 1
	$('#scheduler_'+row+'_units_'+ attacks).remove();
}

function handleAddRowEvent() {
	console.log("Add row");
	SETTINGS.scheduler.push(["Napad", "2025-02-27T22:50:01.000", $.cookie("global_village_id"), "393|564", "Mur", [[0,0,"all",0,0,10,"all",0,"all","all","all",0]]])
    fillSchedulerTable()
}

function handleRemoveRowEvent(row) {
	console.log("Add row");
	SETTINGS.scheduler.splice(row, 1);
    fillSchedulerTable()
}

function calculateTime(i, row) {
	console.log("Calculate time for row " + row);

	$("#scheduler_"+row+"_sendTime_checkbox").prop('checked', i == 0 ? true : false)
	$("#scheduler_"+row+"_attackTime_checkbox").prop('checked', i == 1 ? true : false)
	$("#scheduler_"+row+"_sendTime").prop('disabled', i == 0 ? false : true)
    $("#scheduler_"+row+"_attackTime").prop('disabled', i == 1 ? false : true)

    if(i==0){
        $("#scheduler_"+row+"_attackTime").val(calculateSendEntryDate(
                                                        0,
                                                        $("#scheduler_"+row+"_sendTime").val(),
                                                        $("#scheduler_"+row+"_fromVillage").val(),
                                                        $("#scheduler_"+row+"_toCords").val(),
                                                        schedulerUnits(row)
                                                    ))
    } else {
        $("#scheduler_"+row+"_sendTime").val(calculateSendEntryDate(
                                                        1,
                                                        $("#scheduler_"+row+"_attackTime").val(),
                                                        $("#scheduler_"+row+"_fromVillage").val(),
                                                        $("#scheduler_"+row+"_toCords").val(),
                                                        schedulerUnits(row)
                                                    ))
    }
}

function schedulerUnits(i){
    var units = new Array()
    for (var ui=0; ui < 999; ui++){
        if($('#scheduler_'+i+'_units_'+ui+'_unit_0').length > 0){
            units.push([
                $('#scheduler_'+i+'_units_'+ui+'_unit_0').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_1').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_2').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_3').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_4').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_5').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_6').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_7').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_8').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_9').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_10').val(),
                $('#scheduler_'+i+'_units_'+ui+'_unit_11').val()
            ])
        }else{
            ui = 999999
        }
    }

    return units
}

var handleSaveButtonEvent = () => {
	console.log("Save config");

	var new_conf = {
	  farm: {
		maxDistance: $("#farm-maxDistance").val(),
		speedInMilliseconds: $("#farm-speedInMilliseconds").val(),
		repeatWhenNoMoreVillagesLeft: $('#farm-repeatWhenNoMoreVillagesLeft').is(':checked') ? 1 : 0,
		wrecker: {
		  maxDistance: $("#wrecker-maxDistance").val(),
		  units: {
			light: $("#wrecker-light").val(),
			ram: $("#wrecker-ram").val(),
			catapult: $("#wrecker-catapult").val()
		  }
		},
		autoExpansion: {
		  maxDistance: $("#autoExpansion-maxDistance").val(),
		  maxVillagePoints: $("#autoExpansion-maxVillagePoints").val(),
		  dailyNumberOfAttacksFromVillage: 9999 // deprecated
		}
	  },
	  scavenger: {
		durationInMinutes: $("#scavenger-durationInMinutes").val(),
		spearSafeguard: $("#scavenger-spearSafeguard").val(),
		swordSafeguard: $("#scavenger-swordSafeguard").val()
	  },
	  freeze: {
		offOnVillages: $("#freeze-offOnVillages").val().split(","),
		deffOnVillages: $("#freeze-deffOnVillages").val().split(",")
	  },
	  scheduler: scheduler_items
	}

	localStorage.setItem("MajQs.settings", JSON.stringify(new_conf))
	SETTINGS = new_conf
	alert("Settings Saved!")
}
function settingsUI() {
	const settings_image = document.createElement('img');
	settings_image.setAttribute('id', 'MajQs-settings');
	settings_image.setAttribute('src', "https://dspl.innogamescdn.com/asset/81e5cb4d/graphic/icons/settings.png");
	settings_image.setAttribute('alt', 'settings');
	settings_image.setAttribute("style", "top:10px; right:10px; width:30px; height:auto;");
	settings_image.setAttribute('onclick', 'handleSettingsEvent()');
	//settings_image.style.margin = 'auto';
	//settings_image.style.display = 'block';
	$('td .menu-side').eq(1).append(settings_image)
}
settingsUI()

// *** PAGES ***
function goToScavengePage() {
    var url = new URL(window.location.href);
    var village = new URLSearchParams(url.search).get('village');
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=scavenge';
}

function goToMassScavengePage() {
    var url = new URL(window.location.href);
    var village = new URLSearchParams(url.search).get('village');
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=scavenge_mass';
}

function goToAfPage() {
    var url = new URL(window.location.href);
    var village = new URLSearchParams(url.search).get('village');
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=am_farm';
}

function goToAfPageFor(village) {
    var url = new URL(window.location.href);
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=am_farm';
}

function goToCommandPage() {
    var url = new URL(window.location.href);
    var village = new URLSearchParams(url.search).get('village');
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=command';
}

function goToCommandPageFor(village) {
    var url = new URL(window.location.href);
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=place&mode=command';
}

function getPlayerVillages(){
    var playerVillages = JSON.parse(localStorage.getItem("MajQs.playerVillages"))
    if(playerVillages == null){
        return new Map()
    }else {
        return new Map(playerVillages)
    }
}

function getWorldSetup(){
    ws = JSON.parse(localStorage.getItem("MajQs.worldSetup"))
    if(ws == null){
        var dt;
        $.ajax({
            'async':false,
            'url':'/interface.php?func=get_config',
            'dataType':'xml',
            'success':function(data){dt=data;}
        });

        var worldSetup = {
            speed:Number($(dt).find("config speed").text()),
            unit_speed:Number($(dt).find("config unit_speed").text()),
            archer:Number($(dt).find("game archer").text()),
            knight:Number($(dt).find("game knight").text())
        };
        localStorage.setItem("MajQs.worldSetup", JSON.stringify(worldSetup))
        return worldSetup
    } else{
        return ws
    }
}

function sortAndSaveCoordinates(name, coordMap){
    if(coordMap != null && coordMap.size > 0){
        var sortedByDistance = Array.from(coordMap.entries()).sort(function (a, b) {return a[1][0][1] - b[1][0][1]})
        var sortedByVillage = sortedByDistance.sort(function (a, b) {return a[1][0][0] - b[1][0][0]})
        var villageMap = new Map()
        for(let i=0; i< sortedByVillage.length; i++){
            var t = villageMap.get(sortedByVillage[i][1][0][0])
            if(t == null){
                t = []
            }
            t.push(sortedByVillage[i][0])
            villageMap.set(sortedByVillage[i][1][0][0], t)
        }
        localStorage.setItem(name, JSON.stringify(Array.from(villageMap)));
        return 0;
    }
}

function processCollectingServerData() {
    console.log("Processing Collecting Server Data..." );
    getWorldSetup()

	var Request = new XMLHttpRequest();
	Request.onreadystatechange = function() {

        function ScriptVillage(Data) {
            var afStatistics = new Map(JSON.parse(localStorage.getItem("MajQs.afStatistics")));
            var mainVillageId = $.cookie("global_village_id")
            var playerId;
            var playerVillages = new Map();
            var coordinatesForAutoExpansion = new Map();
            var Villages = Data.split("\n");

            function setPlayerId(){
                var i = Villages.length - 1;
                while(i--) {
                    Village[i] = Villages[i].split(',');
                    if(Village[i][0] == mainVillageId){
                        playerId = Village[i][4]
                        localStorage.setItem("MajQs.playerId", playerId);
                    }
                }
                return 0;
            }
            setPlayerId();

            function setPlayerVillages(){
                var i = Villages.length - 1;

                function isOff(villageId){
                    let ram = false;
                    let light = false;
                    let spy = false;
                    var Request = new XMLHttpRequest();
                    Request.open('GET', 'game.php?village='+villageId+'&screen=train', false);
                    Request.send(null);
                    var units = $("<div>").html(Request.responseText).find("#train_form").find('tr');
                    for(let i=0; i<units.length; i++){
                        if(units.eq(i).find(".nowrap a").attr("data-unit") == "ram"
                            && units.eq(i).find("td").eq(2).text().split("/")[1] >= 1){
                            ram = true
                        }
                        if(units.eq(i).find(".nowrap a").attr("data-unit") == "light"
                            && units.eq(i).find("td").eq(2).text().split("/")[1] >= 1){
                            light = true
                        }
                        if(units.eq(i).find(".nowrap a").attr("data-unit") == "spy"
                            && units.eq(i).find("td").eq(2).text().split("/")[1] >= 1){
                            spy = true
                        }
                    }
                    return ram && light && spy
                }

                while(i--) {
                    Village[i] = Villages[i].split(',');
                    if(Village[i][4] == playerId){
                        var villageData = {
                            "name": Village[i][1],
                            "X": Village[i][2],
                            "Y": Village[i][3],
                            "isWrecker": isOff(Village[i][0]),
                            "autoExpansionDailyAttacks": SETTINGS.farm.autoExpansion.dailyNumberOfAttacksFromVillage
                        }
                        playerVillages.set(Village[i][0], villageData)
                    }
                }
                return 0;
            }
            setPlayerVillages();
            localStorage.setItem("MajQs.playerVillages", JSON.stringify(Array.from(playerVillages)));

            // ignore villages available in AF
            function filterPossibleVillages(){
                for (let vi = Villages.length-1; vi >= 0; vi--) {
                    village = Villages[vi].split(',');
                    villageCoords = village[2]+"|"+village[3]
                    if(afStatistics.get(villageCoords) != null){
                        Villages.splice(vi,1);
                        afStatistics.delete(villageCoords);
                    }
                }
                return 0;
            }
            filterPossibleVillages();

            // look for possible barbarian villages in distance
            function setCoordinatesForAutoExpansion(){
                var i = Villages.length - 1;
                playerVillagesArray = Array.from(playerVillages)
                while(i--) {
                    Village[i] = Villages[i].split(',');
                    if(Village[i][4] == 0 && Village[i][5] <= SETTINGS.farm.autoExpansion.maxVillagePoints){       // barbarian village
                        for (let pvi = playerVillagesArray.length-1; pvi >= 0; pvi--) {
                            var distance = Math.sqrt(Math.pow(Village[i][2]-playerVillagesArray[pvi][1].X,2)+Math.pow(Village[i][3]-playerVillagesArray[pvi][1].Y,2))
                            if(distance <= SETTINGS.farm.autoExpansion.maxDistance){
                                //[playerVillageID, distance, barbarianVillage]
                                coordinates = Village[i][2]+"|"+Village[i][3]
                                var current = coordinatesForAutoExpansion.get(coordinates)
                                if(current == null){
                                    current = []
                                }
                                current.push([playerVillagesArray[pvi][0], distance])
                                current.sort(function (a, b) {
                                    return a[1] - b[1]
                                })
                                coordinatesForAutoExpansion.set(coordinates, current)
                            }
                        }
                    }
                }
                return 0;
            }
            setCoordinatesForAutoExpansion()
            sortAndSaveCoordinates("MajQs.coordinatesForAutoExpansion", coordinatesForAutoExpansion)

            return 0;
        }
        ScriptVillage(Request.responseText)
        return 0;
	};
	Request.open('GET', '/map/village.txt' , true);
    Request.send();
    return 0;
}

// Start bot check
setTimeout(function() {
    var captcha = $('#bot_check')
    if ($(captcha).length > 0) {
        $(captcha).find('a').first().click()
    }
}, 2000);

// Complete Quest
function completeQuest(){
    var completeQuestBtn = $('.btn btn-confirm-yes status-btn quest-complete-btn')
    if ($(completeQuestBtn).length > 0) {
        $(completeQuestBtn).first().click()
    }
}

const defaultLevel = 0
const collectAFStatisticsLevel = 1
const collectServerDataLevel = 2
const wreckerLevel = 3
const autoExpansionLevel = 4
const schedulerLevel = 5
const switchVillageLevel = 99

if(localStorage.getItem("MajQs.scriptLevel") == switchVillageLevel){
    goToNextLevel(defaultLevel);
}

function goToNextLevel(level){
    localStorage.setItem("MajQs.scriptLevel", level)
    switch(level){
        case defaultLevel:
            goToAfPage()
            break;
        case collectAFStatisticsLevel:
            goToAfPage()
            break;
        case collectServerDataLevel:
            var day = String(new Date().getDate()).padStart(2, '0');
            if(localStorage.getItem("MajQs.collectedServerDataDay") != day){
                processCollectingServerData()
                localStorage.setItem("MajQs.collectedServerDataDay", day);
                setTimeout(function() {
                    goToNextLevel(wreckerLevel);
                }, 20000)
            }else{
                goToNextLevel(wreckerLevel);
            }
            break;
        case wreckerLevel:
            goToCommandPage();
            break;
        case autoExpansionLevel:
            goToCommandPage();
            break;
        case schedulerLevel:
            goToCommandPage();
            break;
        case switchVillageLevel:
            var nextVillage = $("#village_switch_right").find(".arrowRight")
            if(nextVillage.length > 0){
                nextVillage.click()
            }else{
                goToNextLevel(defaultLevel);
            }
            break;
        default:
            localStorage.setItem("MajQs.scriptLevel", 0)
            goToAfPage()
    }
    return 0;
}

function shouldProcessLevel(level){
    return localStorage.getItem("MajQs.scriptLevel") == level
}

function saveParameterToLocalStorage(name, data){
    let current = JSON.parse(localStorage.getItem(name));
    if(current == null){
        localStorage.setItem(name, JSON.stringify(data));
    }else{
        localStorage.setItem(name, JSON.stringify(current.concat(data)));
    }
    return 0;
}

function isVillageWithFrozenOff(){
    for(let i=0; i < SETTINGS.freeze.offOnVillages.length; i++){
        if($("#menu_row2_village").find('a').text().indexOf(SETTINGS.freeze.offOnVillages[i]) >= 0){
            return true
        }
    }
    return false
}

function isVillageWithFrozenDeff(){
    for(let i=0; i < SETTINGS.freeze.deffOnVillages.length; i++){
        if($("#menu_row2_village").find('a').text().indexOf(SETTINGS.freeze.deffOnVillages[i]) >= 0){
            return true
        }
    }
    return false
}

// *** autoTagIncomingAttacks ***
function autoTagIncomingAttacks(){
    var incomingsAmount = localStorage.getItem("MajQs.incomingsAmount");
    if(incomingsAmount == null){
        incomingsAmount = 0
    }
    var currentIncomingsAmount = $("#incomings_amount").text()
    if(incomingsAmount != currentIncomingsAmount && !shouldProcessLevel(schedulerLevel)){
        localStorage.setItem("MajQs.incomingsAmount", currentIncomingsAmount);
        $("#incomings_amount").click()
    }
    return 0
}

function isIncomingsAttacks() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('mode') === "incomings" && params.get('subtype') === "attacks"
}

if (isIncomingsAttacks()) {
    console.log("Incomings Attacks page..." );
    setTimeout(function() {
        if($('.quickedit-label:contains("Atak")').length > 0){
            $("#select_all").click()
            $('#incomings_table :input[value="Etykieta"]').click()
        }else{
            goToNextLevel(defaultLevel)
        }
    }, 1500)
}

function schedulerCalculateSendDate(){
    var playerVillages = getPlayerVillages()
    var worldSetup = getWorldSetup()
    var scheduler = []
    function getSlowestUnitFactor(attacks){
        var unitSpeeds = [18,22,18,18,9,10,10,11,30,30,10,35]
        var slowestUnitFactor = 0
        for(let ai=0; ai< attacks.length; ai++){
            units = attacks[ai]
            for(let i=0; i< units.length; i++){
                if((units[i] > 0 || units[i] == "all") && unitSpeeds[i] > slowestUnitFactor){
                    slowestUnitFactor = unitSpeeds[i]
                }
            }
        }
        return slowestUnitFactor
    }
    function roundToSeconds(date) {
      p = 1000;
      return new Date(Math.round(date.getTime() / p ) * p);
    }

    for(let i=0; i < SETTINGS.scheduler.length; i++){
        var entryDate = new Date(SETTINGS.scheduler[i][1]);
        var playerVillage = playerVillages.get(villageNameToId(SETTINGS.scheduler[i][2]))
        if(playerVillage != null){
            var targetCoords = SETTINGS.scheduler[i][3].split("|")
            var distance = Math.sqrt(Math.pow(targetCoords[0]-playerVillage.X,2)+Math.pow(targetCoords[1]-playerVillage.Y,2))
            var sendDate = entryDate - roundToSeconds(new Date(distance * worldSetup.speed * worldSetup.unit_speed * getSlowestUnitFactor(SETTINGS.scheduler[i][5]) * 60000))
            scheduler.push({
                "item": i,
                "sendDateUTC": new Date(sendDate)
            })
        }
    }
    localStorage.setItem("MajQs.scheduler", JSON.stringify(scheduler))

    return scheduler
}

function calculateSendEntryDate(option, date, villageId, targetCords, units){
    var playerVillages = getPlayerVillages()
    var worldSetup = getWorldSetup()

    function getSlowestUnitFactor(attacks){
        var unitSpeeds = [18,22,18,18,9,10,10,11,30,30,10,35]
        var slowestUnitFactor = 0
        for(let ai=0; ai< attacks.length; ai++){
            units = attacks[ai]
            for(let i=0; i< units.length; i++){
                if((units[i] > 0 || units[i] == "all") && unitSpeeds[i] > slowestUnitFactor){
                    slowestUnitFactor = unitSpeeds[i]
                }
            }
        }
        return slowestUnitFactor
    }
    function roundToSeconds(date) {
      p = 1000;
      return new Date(Math.round(date.getTime() / p ) * p);
    }

    var playerVillage = playerVillages.get(villageId)
    var targetCoords = targetCords.split("|")
    var distance = Math.sqrt(Math.pow(targetCoords[0]-playerVillage.X,2)+Math.pow(targetCoords[1]-playerVillage.Y,2))

    if(option == 0){
        var entryDate = new Date(date);
        return new Date(entryDate - roundToSeconds(new Date(distance * worldSetup.speed * worldSetup.unit_speed * getSlowestUnitFactor(units) * 60000))).format("isoDateTime");
    } else {
        var sendDate = new Date(date);
        return new Date(sendDate + roundToSeconds(new Date(distance * worldSetup.speed * worldSetup.unit_speed * getSlowestUnitFactor(units) * 60000))).format("isoDateTime");
    }
}

function schedulerCheck() {
    if(!shouldProcessLevel(schedulerLevel) && localStorage.getItem("MajQs.scheduledItem") == null){
        var scheduler = schedulerCalculateSendDate()
        var now = new Date();
        for(let i=0; i < scheduler.length; i++){
            var sendDate = new Date(scheduler[i].sendDateUTC);
            var diffMins = (sendDate - now) / 60000
            if(diffMins > 0 && diffMins <= 2){
                localStorage.setItem("MajQs.scheduledItem", scheduler[i].item)
                goToNextLevel(schedulerLevel)
            }
        }
    }
    return 0
}

function villageNameToId(villageName){
    var playerVillages = Array.from(getPlayerVillages())
    for(let pvi = 0; pvi < playerVillages.length; pvi++){
        if(playerVillages[pvi][1].name.indexOf(villageName) > -1){
            return playerVillages[pvi][0]
        }
    }
    return 0
}

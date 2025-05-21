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
}, 100);

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
                maxDistance: 20,
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
                    maxDistance: 20,
                    maxVillagePoints: 500,                    // aby uniknąć wiosek graczy którzy usuneli konto itp.
                    dailyNumberOfAttacksFromVillage: 99999       // ilość ataków z jednej wioski gracza na dzień
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
            scheduler: []
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
                    <td><input id='farm-maxDistance' type="number" value='${SETTINGS.farm.maxDistance}' onchange="saveSettings()" /></td>
                </tr>
                <tr>
                    <td><label>Speed in Milliseconds:</label></td>
                    <td><input id='farm-speedInMilliseconds' type="number" value='${SETTINGS.farm.speedInMilliseconds}' onchange="saveSettings()" /></td>
                </tr>
                <tr>
                    <td><label for="repeatWhenNoMoreVillagesLeft">Repeat when no more villages left</label></td>
                    <td><input type="checkbox" id="farm-repeatWhenNoMoreVillagesLeft" name="repeatWhenNoMoreVillagesLeft" onchange="saveSettings()" /></td>
                </tr>
			</table></fieldset>
			<fieldset><legend>Wrecker</legend><table>
                <tr>
                    <td><label>Max distance:</label></td>
                    <td><input id='wrecker-maxDistance' type="number" value='${SETTINGS.farm.wrecker.maxDistance}' onchange="saveSettings()" /></td>
                </tr>
                <tr>
                    <td><label>Light:</label></td>
                    <td><input id='wrecker-light' type="number" value='${SETTINGS.farm.wrecker.units.light}' onchange="saveSettings()" /></td>
                </tr>
                <tr>
                    <td><label>Ram:</label></td>
                    <td><input id='wrecker-ram' type="number" value='${SETTINGS.farm.wrecker.units.ram}' onchange="saveSettings()"/></td>
                </tr>
                <tr>
                    <td><label>Catapult:</label></td>
                    <td><input id='wrecker-catapult' type="number" value='${SETTINGS.farm.wrecker.units.catapult}' onchange="saveSettings()"/></td>
                </tr>
            </table></fieldset>
            <fieldset><legend>Auto Expansion</legend><table>
                <tr>
                    <td><label>Max distance:</label></td>
                    <td><input id='autoExpansion-maxDistance' type="number" value='${SETTINGS.farm.autoExpansion.maxDistance}' onchange="saveSettings()" /></td>
                </tr>
                <tr>
                    <td><label>Max Village points:</label></td>
                    <td><input id='autoExpansion-maxVillagePoints' type="number" value='${SETTINGS.farm.autoExpansion.maxVillagePoints}' onchange="saveSettings()" /></td>
                </tr>
            </table></fieldset>
            <fieldset><legend>Scavenger</legend><table>
                <tr>
                    <td><label>Duration in minutes:</label></td>
                    <td><input id='scavenger-durationInMinutes' type="number" value='${SETTINGS.scavenger.durationInMinutes}' onchange="saveSettings()" /></td>
                </tr>
                <tr>
                   <td><label>Speed in Milliseconds:</label></td>
                   <td><input id='scavenger-speedInMilliseconds' type="number" value='${SETTINGS.scavenger.speedInMilliseconds || 500}' onchange="saveSettings()" /></td>
                </tr>
                <tr>
                    <td><label>Spear safeguard:</label></td>
                    <td><input id='scavenger-spearSafeguard' type="number" value='${SETTINGS.scavenger.spearSafeguard || 0}' onchange="saveSettings()" /></td>
                    <td><input type="radio" id="spearSafeguardMode_number" name="spearSafeguardMode" value="Number" onchange="saveSettings()" ${SETTINGS.scavenger.spearSafeguardMode == "Number" || SETTINGS.scavenger.spearSafeguardMode == null? 'checked="checked"' : ''}></td>
                    <td><label for="spearSafeguardMode_number">Number</label></td>
                    <td><input type="radio" id="spearSafeguardMode_perc" name="spearSafeguardMode" value="%" onchange="saveSettings()" ${SETTINGS.scavenger.spearSafeguardMode == "%" ? 'checked="checked"' : ''}></td>
                    <td><label for="spearSafeguardMode_perc">%</label></td>
                </tr>
                <tr>
                    <td><label>Sword safeguard:</label></td>
                    <td><input id='scavenger-swordSafeguard' type="number" value='${SETTINGS.scavenger.swordSafeguard || 0}' onchange="saveSettings()" /></td>
                    <td><input type="radio" id="swordSafeguardMode_number" name="swordSafeguardMode" value="Number" onchange="saveSettings()" ${SETTINGS.scavenger.swordSafeguardMode == "Number" || SETTINGS.scavenger.swordSafeguardMode == null ? 'checked="checked"' : ''}></td>
                    <td><label for="swordSafeguardMode_number">Number</label></td>
                    <td><input type="radio" id="swordSafeguardMode_perc" name="swordSafeguardMode" value="%" onchange="saveSettings()" ${SETTINGS.scavenger.swordSafeguardMode == "%" ? 'checked="checked"' : ''}></td>
                    <td><label for="swordSafeguardMode_perc">%</label></td>
                </tr>
                <tr>
                    <td><label>Archer safeguard:</label></td>
                    <td><input id='scavenger-archerSafeguard' type="number" value='${SETTINGS.scavenger.archerSafeguard || 0}' onchange="saveSettings()" /></td>
                    <td><input type="radio" id="archerSafeguardMode_number" name="archerSafeguardMode" value="Number" onchange="saveSettings()" ${SETTINGS.scavenger.archerSafeguardMode == "Number" || SETTINGS.scavenger.archerSafeguardMode == null ? 'checked="checked"' : ''}></td>
                    <td><label for="archerSafeguardMode_number">Number</label></td>
                    <td><input type="radio" id="archerSafeguardMode_perc" name="archerSafeguardMode" value="%" onchange="saveSettings()" ${SETTINGS.scavenger.archerSafeguardMode == "%" ? 'checked="checked"' : ''}></td>
                    <td><label for="archerSafeguardMode_perc">%</label></td>
                </tr>
                <tr>
                    <td><label>Heavy safeguard:</label></td>
                    <td><input id='scavenger-heavySafeguard' type="number" value='${SETTINGS.scavenger.heavySafeguard || 0}' onchange="saveSettings()" /></td>
                    <td><input type="radio" id="heavySafeguardMode_number" name="heavySafeguardMode" value="Number" onchange="saveSettings()" ${SETTINGS.scavenger.heavySafeguardMode == "Number" || SETTINGS.scavenger.heavySafeguardMode == null ? 'checked="checked"' : ''}></td>
                    <td><label for="heavySafeguardMode_number">Number</label></td>
                    <td><input type="radio" id="heavySafeguardMode_perc" name="heavySafeguardMode" value="%" onchange="saveSettings()" ${SETTINGS.scavenger.heavySafeguardMode == "%" ? 'checked="checked"' : ''}></td>
                    <td><label for="heavySafeguardMode_perc">%</label></td>
                </tr>
            </table></fieldset>
            <fieldset><legend>Freeze</legend><table>
                <tr>
                    <td><label>Off on Villages:</label></td>
                    <td><input id='freeze-offOnVillages' value='${SETTINGS.freeze.offOnVillages}' onchange="saveSettings()" /></td>
                </tr>
                <tr>
                    <td><label>Deff on Villages:</label></td>
                    <td><input id='freeze-deffOnVillages' value='${SETTINGS.freeze.deffOnVillages}' onchange="saveSettings()" /></td>
                </tr>
            </table></fieldset>
            <fieldset><legend>Scheduler</legend>
                <table id='scheduler-table' style="border-collapse: collapse;">
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
            <button type="button" onclick="saveSettings()" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">Zapisz!</button>
            </form></div>`
	)
	if(SETTINGS.farm.repeatWhenNoMoreVillagesLeft == 1){
      $("#farm-repeatWhenNoMoreVillagesLeft").prop('checked', true);
    }

    var window_height = $(window).height() * 0.65
    $("#dudialog").css({height:window_height+"px", overflow:"auto"});
    fillSchedulerTable()
}

var scheduler_type_index = 0
var scheduler_timeCheckbox_index = 1
var scheduler_sendTime_index = 2
var scheduler_attackTime_index = 3
var scheduler_fromVillage_index = 4
var scheduler_toCords_index = 5
var scheduler_target_index = 6
var scheduler_units_index = 7

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

            var tv = new Array()
            var playerVillages = Array.from(getPlayerVillages())
            playerVillages.sort((x, y) => x[1].name.localeCompare(y[1].name))
            for (var v=0; v < playerVillages.length; v++){
                tv[v] = `<option value=${playerVillages[v][0]} ${SETTINGS.scheduler[r][scheduler_fromVillage_index] == playerVillages[v][0] ? 'selected="selected"' : ''} >${playerVillages[v][1].name}</option>`
            }

            var tur = new Array()

            var villageUnits = getVillageUnits(SETTINGS.scheduler[r][scheduler_fromVillage_index])

            for (var ur=0; ur < SETTINGS.scheduler[r][scheduler_units_index].length; ur++){
                if(SETTINGS.scheduler[r][scheduler_units_index][ur].length == 0){
                    tur[ur] = `
                        <tr id='scheduler_${r}_units_${ur}'>
                            <td></td>
                            <td colspan = "10">
                                <strong> AUTOMATIC FILL </strong>
                            </td>
                        </tr>`
                } else {
                    tur[ur] = `
                        <tr id='scheduler_${r}_units_${ur}'>
                            <td><input id='scheduler_${r}_units_${ur}_unit_0' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][0]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_1' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][1]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_2' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][2]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_3' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][3]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_4' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][4]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_5' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][5]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_6' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][6]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_7' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][7]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_8' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][8]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_9' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][9]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_10' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][10]} style="width: 30px"/></td>
                            <td><input id='scheduler_${r}_units_${ur}_unit_11' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_units_index][ur][11]} style="width: 30px"/></td>
                        </tr>`
                }
            }

            tr.push(`
            <tr style="border-bottom: 1pt solid black;">
                <td><button type="button" onclick="handleRemoveRowEvent(${r})" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">-</button></td>
                <td><select name="Typ" id='scheduler_${r}_type' onchange="saveSettings()">
                      <option value="Napad" ${SETTINGS.scheduler[r][scheduler_type_index] == "Napad" ? 'selected="selected"' : ''} >Napad</option>
                      <option value="Pomoc" ${SETTINGS.scheduler[r][scheduler_type_index] == "Pomoc" ? 'selected="selected"' : ''} >Pomoc</option>
                    </select></td>
                <td><input type="checkbox" id="scheduler_${r}_sendTime_checkbox" onclick="checkboxEvent(0, ${r})" name="" ${SETTINGS.scheduler[r][scheduler_timeCheckbox_index] == 0 ? 'checked="checked"' : ''}></td>
                <td><input id='scheduler_${r}_sendTime' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_sendTime_index]} ${SETTINGS.scheduler[r][scheduler_timeCheckbox_index] == 0 ? '' : 'disabled'}/></td>
                <td><input type="checkbox" id="scheduler_${r}_attackTime_checkbox" onclick="checkboxEvent(1, ${r})" name="" ${SETTINGS.scheduler[r][scheduler_timeCheckbox_index] == 1 ? 'checked="checked"' : ''}></td>
                <td><input id='scheduler_${r}_attackTime' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_attackTime_index]} ${SETTINGS.scheduler[r][scheduler_timeCheckbox_index] == 1 ? '' : 'disabled'} /></td>
                <td><select name="Typ" id='scheduler_${r}_fromVillage' onchange="handleVillageChange(${r})">
                        ${tv.join('')}
                    </select></td>
                <td><input id='scheduler_${r}_toCords' onchange="calculateTime(${r})" value=${SETTINGS.scheduler[r][scheduler_toCords_index]} style="width: 40px"/></td>
                <td><select name="Cel" id="scheduler_${r}_target" onchange="saveSettings()">
                      <option value="" ${SETTINGS.scheduler[r][scheduler_target_index] == "" ? 'selected="selected"' : ''}>Domyślny</option>
                      <option value="Ratusz" ${SETTINGS.scheduler[r][scheduler_target_index] == "Ratusz" ? 'selected="selected"' : ''}>Ratusz</option>
                      <option value="Koszary" ${SETTINGS.scheduler[r][scheduler_target_index] == "Koszary" ? 'selected="selected"' : ''}>Koszary</option>
                      <option value="Stajnia" ${SETTINGS.scheduler[r][scheduler_target_index] == "Stajnia" ? 'selected="selected"' : ''}>Stajnia</option>
                      <option value="Warsztat" ${SETTINGS.scheduler[r][scheduler_target_index] == "Warsztat" ? 'selected="selected"' : ''}>Warsztat</option>
                      <option value="Kościół" ${SETTINGS.scheduler[r][scheduler_target_index] == "Kościół" ? 'selected="selected"' : ''}>Kościół</option>
                      <option value="Pałac" ${SETTINGS.scheduler[r][scheduler_target_index] == "Pałac" ? 'selected="selected"' : ''}>Pałac</option>
                      <option value="Kuźnia" ${SETTINGS.scheduler[r][scheduler_target_index] == "Kuźnia" ? 'selected="selected"' : ''}>Kuźnia</option>
                      <option value="Plac" ${SETTINGS.scheduler[r][scheduler_target_index] == "Plac" ? 'selected="selected"' : ''}>Plac</option>
                      <option value="Piedestał" ${SETTINGS.scheduler[r][scheduler_target_index] == "Piedestał" ? 'selected="selected"' : ''}>Piedestał</option>
                      <option value="Rynek" ${SETTINGS.scheduler[r][scheduler_target_index] == "Rynek" ? 'selected="selected"' : ''}>Rynek</option>
                      <option value="Tartak" ${SETTINGS.scheduler[r][scheduler_target_index] == "Tartak" ? 'selected="selected"' : ''}>Tartak</option>
                      <option value="Cegielnia" ${SETTINGS.scheduler[r][scheduler_target_index] == "Cegielnia" ? 'selected="selected"' : ''}>Cegielnia</option>
                      <option value="Huta żelaza" ${SETTINGS.scheduler[r][scheduler_target_index] == "Huta żelaza" ? 'selected="selected"' : ''}>Huta żelaza</option>
                      <option value="Zagroda" ${SETTINGS.scheduler[r][scheduler_target_index] == "Zagroda" ? 'selected="selected"' : ''}>Zagroda</option>
                      <option value="Spichlerz" ${SETTINGS.scheduler[r][scheduler_target_index] == "Spichlerz" ? 'selected="selected"' : ''}>Spichlerz</option>
                      <option value="Mur" ${SETTINGS.scheduler[r][scheduler_target_index] == "Mur" ? 'selected="selected"' : ''}>Mur</option>
                    </select></td>
                <td>
                    <table id='scheduler_${r}_units-table'>
                        <tr>
                            <td><label>${villageUnits[0]}</label></td>
                            <td><label>${villageUnits[1]}</label></td>
                            <td><label>${villageUnits[2]}</label></td>
                            <td><label>${villageUnits[3]}</label></td>
                            <td><label>${villageUnits[4]}</label></td>
                            <td><label>${villageUnits[5]}</label></td>
                            <td><label>${villageUnits[6]}</label></td>
                            <td><label>${villageUnits[7]}</label></td>
                            <td><label>${villageUnits[8]}</label></td>
                            <td><label>${villageUnits[9]}</label></td>
                            <td><label>${villageUnits[10]}</label></td>
                            <td><label>${villageUnits[11]}</label></td>
                        </tr>
                        ${tur.join('')}
                    </table>
                    <button type="button" onclick="handleAddAttackEvent(${r})" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">Add</button>
                    <button type="button" onclick="handleOffAttackEvent(${r})" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">Off</button>
                    <button type="button" onclick="handleTrainAttackEvent(${r})" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">Train</button>
                    <button type="button" onclick="handleRemoveAttackEvent(${r})" style="border-radius: 5px; border: 1px solid #000; color: #fff; background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)">Remove</button>
                </td>
            </tr>`)
    }

	$('#scheduler-table').eq(0).html(tr.join(''))
	checkSendingAttacksTime()
}

function handleAddAttackEvent(row) {
	console.log("Add attack to row " + row);
	if(SETTINGS.scheduler[row][scheduler_units_index].length < 5){
		SETTINGS.scheduler[row][scheduler_units_index].push([0,0,0,0,0,0,0,0,0,0,0,0])
    	fillSchedulerTable()
        if(calculateTime(row)){
            fillSchedulerTable()
        }
	}
}
function handleOffAttackEvent(row) {
	console.log("Off to row " + row);
	SETTINGS.scheduler[row][scheduler_units_index] = [[0,0,"all",0,0,"all","all",0,"all","all","all",0]]
	fillSchedulerTable()
    if(calculateTime(row)){
        fillSchedulerTable()
    }
}

function handleTrainAttackEvent(row) {
	console.log("Train to row " + row);
	var axe = schedulerVillageUnitsMap.get(SETTINGS.scheduler[row][scheduler_fromVillage_index])[2]
	var axe_for_first_attack = Math.round(axe * 0.95)
	SETTINGS.scheduler[row][scheduler_units_index] = [[0,0,axe_for_first_attack,0,0,"all","all",0,"all","all","all",1],[],[],[]]
    fillSchedulerTable()
    saveSettings()
}

function handleRemoveAttackEvent(row) {
	console.log("Remove attack from row " + row);
	SETTINGS.scheduler[row][scheduler_units_index].splice(-1)
    fillSchedulerTable()
    saveSettings()
}

function handleAddRowEvent() {
	console.log("Add row");
	new_row = SETTINGS.scheduler.length != 0 ? SETTINGS.scheduler[SETTINGS.scheduler.length-1] : ["Napad", 0, new Date().format("yyyy-mm-dd'T'HH:MM:ss.l"), new Date().format("yyyy-mm-dd'T'HH:MM:ss.l"), $.cookie("global_village_id"), "500|500", "Mur", [[0,0,"all",0,0,10,"all",0,"all","all","all",0]]]
	SETTINGS.scheduler.push(new_row)
    fillSchedulerTable()
    saveSettings()
}

function handleRemoveRowEvent(row) {
	console.log("Add row");
	SETTINGS.scheduler.splice(row, 1);
    fillSchedulerTable()
    saveSettings()
}

function handleVillageChange(row){
    if(calculateTime(row)){
        fillSchedulerTable()
    }
}

function checkboxEvent(i, row) {
	console.log("Calculate time for row " + row);

	$("#scheduler_"+row+"_sendTime_checkbox").prop('checked', i == 0 ? true : false)
	$("#scheduler_"+row+"_attackTime_checkbox").prop('checked', i == 1 ? true : false)
	$("#scheduler_"+row+"_sendTime").prop('disabled', i == 0 ? false : true)
    $("#scheduler_"+row+"_attackTime").prop('disabled', i == 1 ? false : true)

    calculateTime(row)
}

function calculateTime(row){
    var playerVillages = getPlayerVillages()
    var worldSetup = getWorldSetup()
    var option = $("#scheduler_"+row+"_sendTime_checkbox").prop("checked")
    var type = $("#scheduler_"+row+"_type").val()

    var villageId = $("#scheduler_"+row+"_fromVillage").val()
    var targetCords = $("#scheduler_"+row+"_toCords").val()

    function getSlowestUnitFactor(attacks){
        var unitSpeeds = [18,22,18,18,9,10,10,11,30,30,10,35]
        var slowestUnitFactor = 0
        for(let ai=0; ai< attacks.length; ai++){
            units = attacks[ai]
            for(let i=0; i< units.length; i++){
                if((units[i] > 0 || units[i] == "all") && unitSpeeds[i] > slowestUnitFactor){
                    slowestUnitFactor = unitSpeeds[i]
                    if(type == "Pomoc" && i == 11) {
                        ai = 99, i = 99
                    }
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
    var diff = roundToSeconds(new Date(distance * worldSetup.speed * worldSetup.unit_speed * getSlowestUnitFactor(schedulerUnits(row)) * 60000))

    if(option){
        var sendDate = new Date($("#scheduler_"+row+"_sendTime").val())
        var entryDate = new Date((+sendDate) + (+diff))
        $("#scheduler_"+row+"_attackTime").val(entryDate.format("yyyy-mm-dd'T'HH:MM:ss.l"))
    } else {
        var entryDate = new Date($("#scheduler_"+row+"_attackTime").val());
        var sendDate = new Date(entryDate - diff)
        $("#scheduler_"+row+"_sendTime").val(sendDate.format("yyyy-mm-dd'T'HH:MM:ss.l"))
    }

    checkSendingAttacksTime()
    return saveSettings()
}

function checkSendingAttacksTime(){
    var sendTimeColor = "white"
    var fromVillageColor = "white"

    for (var i=0; i < 999; i++){
        if($('#scheduler_'+i+'_type').length > 0){
            for (var i2=0; i2 < 999; i2++){
                if(i != i2 && $('#scheduler_'+i2+'_type').length > 0){
                    // SEND TIME CHECK
                    diff = (new Date($('#scheduler_'+i+'_sendTime').val()) - new Date($('#scheduler_'+i2+'_sendTime').val())) / 1000 / 60
                    if(diff > -5 && diff < 5
                        || new Date($('#scheduler_'+i+'_sendTime').val()) <= Date.now()){
                        sendTimeColor = "red"
                    }
                    // FROM VILLAGE CHECK
                    if(i != i2 && $('#scheduler_'+i+'_fromVillage').val() == $('#scheduler_'+i2+'_fromVillage').val()){
                        fromVillageColor = "yellow"
                    }
                }
            }

            // UNITS CHECK
            var villageUnits = getVillageUnits($('#scheduler_'+i+'_fromVillage').val())
            for (var ui=0; ui < 5; ui++){
                if($('#scheduler_'+i+'_units_'+ui+'_unit_0').length > 0){
                    for (var uii=0; uii < 12; uii++){
                        if($('#scheduler_'+i+'_units_'+ui+'_unit_'+uii).val() != "all" && $('#scheduler_'+i+'_units_'+ui+'_unit_'+uii).val() > villageUnits[uii]){
                            $('#scheduler_'+i+'_units_'+ui+'_unit_'+uii).css("background-color", "red");
                        } else if ($('#scheduler_'+i+'_units_'+ui+'_unit_'+uii).val() == "all" && villageUnits[uii] == 0){
                            $('#scheduler_'+i+'_units_'+ui+'_unit_'+uii).css("background-color", "yellow");
                        } else {
                            $('#scheduler_'+i+'_units_'+ui+'_unit_'+uii).css("background-color", "white");
                        }
                    }
                }else{
                    ui = 5
                }
            }

            $('#scheduler_'+i+'_sendTime').css("background-color", sendTimeColor);
            $('#scheduler_'+i+'_fromVillage').css("background-color", fromVillageColor);
        }else{
            i = 999
        }
    }
}

function schedulerUnits(i){
    var units = new Array()
    for (var ui=0; ui < 5; ui++){
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
            ui = 5
        }
    }

    return units
}

var schedulerVillageUnitsMap = new Map()
function getVillageUnits(villageId){

    var villageUnits = schedulerVillageUnitsMap.get(villageId)
    if(villageUnits == null){
        var Request = new XMLHttpRequest();
        Request.open('GET', 'game.php?village='+villageId+'&screen=place', false);
        Request.send(null);
        var response = $("<div>").html(Request.responseText)

        function getUnit(unitName){
            var unit = response.find("#units_entry_all_"+unitName).text()
            return unit.substr(unit.indexOf('(') + 1, unit.indexOf(')') - 1 )
        }

        var units = [
            getUnit("spear"),
            getUnit("sword"),
            getUnit("axe"),
            getUnit("archer"),
            getUnit("spy"),
            getUnit("light"),
            getUnit("marcher"),
            getUnit("heavy"),
            getUnit("ram"),
            getUnit("catapult"),
            getUnit("knight"),
            getUnit("snob")
        ]
        schedulerVillageUnitsMap.set(villageId, units)
        return units
    } else {
        return villageUnits
    }
}

function saveSettings() {
	console.log("Save config");

    var scheduler_items = new Array()
    for (var i=0; i < 999; i++){
        if($('#scheduler_'+i+'_type').length > 0){
        	var units = new Array()
            for (var ui=0; ui < 999; ui++){
                if($('#scheduler_'+i+'_units_'+ui).length > 0){
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
                    } else {
                        units.push([])
                    }
                }else{
                    ui = 999999
                }
            }
            scheduler_items[i] = [
                $('#scheduler_'+i+'_type').val(),
                $('#scheduler_'+i+'_sendTime_checkbox').prop("checked") ? 0 : 1,
                $('#scheduler_'+i+'_sendTime').val(),
                $('#scheduler_'+i+'_attackTime').val(),
                $('#scheduler_'+i+'_fromVillage').val(),
                $('#scheduler_'+i+'_toCords').val(),
                $('#scheduler_'+i+'_target').val(),
                units
            ]
        } else{
            i = 999999
        }
    }

	var new_conf = {
	  farm: {
		maxDistance: parseInt($("#farm-maxDistance").val()),
		speedInMilliseconds: parseInt($("#farm-speedInMilliseconds").val()),
		repeatWhenNoMoreVillagesLeft: $('#farm-repeatWhenNoMoreVillagesLeft').is(':checked') ? 1 : 0,
		wrecker: {
		  maxDistance: parseInt($("#wrecker-maxDistance").val()),
		  units: {
			light: parseInt($("#wrecker-light").val()),
			ram: parseInt($("#wrecker-ram").val()),
			catapult: parseInt($("#wrecker-catapult").val())
		  }
		},
		autoExpansion: {
		  maxDistance: parseInt($("#autoExpansion-maxDistance").val()),
		  maxVillagePoints: parseInt($("#autoExpansion-maxVillagePoints").val()),
		  dailyNumberOfAttacksFromVillage: 9999 // deprecated
		}
	  },
	  scavenger: {
		durationInMinutes: parseInt($("#scavenger-durationInMinutes").val()),
		speedInMilliseconds: parseInt($("#scavenger-speedInMilliseconds").val()),
		spearSafeguard: parseInt($("#scavenger-spearSafeguard").val()),
		spearSafeguardMode: $('input:radio[name=spearSafeguardMode]:checked').val(),
		swordSafeguard: parseInt($("#scavenger-swordSafeguard").val()),
		swordSafeguardMode: $('input:radio[name=swordSafeguardMode]:checked').val(),
		archerSafeguard: parseInt($("#scavenger-archerSafeguard").val()),
        archerSafeguardMode: $('input:radio[name=archerSafeguardMode]:checked').val(),
        heavySafeguard: parseInt($("#scavenger-heavySafeguard").val()),
        heavySafeguardMode: $('input:radio[name=heavySafeguardMode]:checked').val()
	  },
	  freeze: {
		offOnVillages: $("#freeze-offOnVillages").val().split(","),
		deffOnVillages: $("#freeze-deffOnVillages").val().split(",")
	  },
	  scheduler: scheduler_items
	}

	localStorage.setItem("MajQs.settings", JSON.stringify(new_conf))
	SETTINGS = new_conf

	return true
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

function goToMarketCallPageFor(village) {
    var url = new URL(window.location.href);
    window.location.href = url.origin + url.pathname + '?village=' + village + '&screen=market&mode=call';
}

function getPlayerVillages(){
    var playerVillages = JSON.parse(localStorage.getItem("MajQs.playerVillages"))
    if(playerVillages == null){
        goToNextLevel(collectAFStatisticsLevel)
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

            function collectCoordinatesForAutoExpansion(){
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
            }
            if(localStorage.getItem("MajQs.isAfNotAvailable") != 1){
                collectCoordinatesForAutoExpansion()
            }

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
        if(SETTINGS.freeze.offOnVillages[i] != "" && $("#menu_row2_village").find('a').text().indexOf(SETTINGS.freeze.offOnVillages[i]) >= 0){
            return true
        }
    }
    return false
}

function isVillageWithFrozenDeff(){
    for(let i=0; i < SETTINGS.freeze.deffOnVillages.length; i++){
        if(SETTINGS.freeze.deffOnVillages[i] != "" && $("#menu_row2_village").find('a').text().indexOf(SETTINGS.freeze.deffOnVillages[i]) >= 0){
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

function schedulerCheck() {
    if(!shouldProcessLevel(schedulerLevel) && localStorage.getItem("MajQs.scheduledItem") == null){
        var scheduler = SETTINGS.scheduler
        var now = new Date();
        var scheduledItem = null;
        for(let i=0; i < scheduler.length; i++){
            var sendDate = new Date(scheduler[i][scheduler_sendTime_index]);
            var diffMins = (sendDate - now) / 60000
            if(diffMins >= 0 && diffMins < 5){
                scheduledItem = i
                i = scheduler.length
            }
        }
        if(scheduledItem != null){
            localStorage.setItem("MajQs.scheduledItem", scheduledItem)
            setTimeout(function() {
                goToNextLevel(schedulerLevel)
            }, 20)
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

function checkVillageUrlWithCookie(){
    if(window.location.href.indexOf($.cookie("global_village_id")) == -1){
        localStorage.removeItem("MajQs.collectedServerDataDay");
        localStorage.removeItem("MajQs.coordinatesForWrecker");
        localStorage.removeItem("MajQs.coordinatesForAutoExpansion");
        goToAfPageFor($.cookie("global_village_id"))
    }
}
checkVillageUrlWithCookie()


// RYNEK\
function collectMarketData(){
    var marketData = new Map()

    function storageThreshold(storage){
        if(storage <= 40000){
            return storage * 0.9
        } if(storage > 400000) {
            return 130000
        } else {
            return parseInt(0.2611 * storage + 25555)
        }
    }
    function resFunction(storage, resource){
        return resource - storageThreshold(storage)
    }

    var villageList = $("#village_list tr").slice(1)
    for (let index = 0; index < villageList.length; index++) {
        var storage = villageList.eq(index).find("td").eq(5).text()
        var wood = villageList.eq(index).find(".wood").attr("data-res")
        var stone = villageList.eq(index).find(".stone").attr("data-res")
        var iron = villageList.eq(index).find(".iron").attr("data-res")

        var callWood = resFunction(storage, wood)
        var callStone = resFunction(storage, stone)
        var callIron = resFunction(storage, iron)

        marketData.set(villageList.eq(index).attr("data-village"),
            {
                "villageId": villageList.eq(index).attr("data-village"),
                "storageThreshold": storageThreshold(storage),
                "wood": callWood,
                "stone": callStone,
                "iron": callIron,
            }
        )
    }

    marketData.set($.cookie("global_village_id"),
        {
            "villageId": $.cookie("global_village_id"),
            "storageThreshold": storageThreshold($("#storage").text()),
            "wood": resFunction($("#storage").text(), $("#wood").text()),
            "stone": resFunction($("#storage").text(), $("#stone").text()),
            "iron": resFunction($("#storage").text(), $("#iron").text()),
        }
    )

    localStorage.setItem("MajQs.marketData", JSON.stringify(Array.from(marketData)))

    return JSON.stringify(Array.from(marketData))
}

function callResources(){

    var villageThatNeedResources = JSON.parse(localStorage.getItem("MajQs.marketData")).sort(function (a, b) {
        return (a[1].wood + a[1].stone + a[1].iron)/(a[1].storageThreshold * 3) - (b[1].wood + b[1].stone + b[1].iron)/(b[1].storageThreshold * 3)
    })[0]

    var marketData = new Map(JSON.parse(localStorage.getItem("MajQs.marketData")))

    function noNeedResources(villageThatNeedResources){
        return villageThatNeedResources[1].wood > -1000
                   && villageThatNeedResources[1].stone > -1000
                   && villageThatNeedResources[1].iron > -1000
    }

    function noDonorAvailable(){
      for (const [key, value] of marketData.entries()) {
        var availableTraders = $("tr[data-village='" + value.villageId + "']").find(".traders").text().split("/")[0]
        if ((value.wood > 1000
            || value.stone > 1000
            || value.iron > 1000)
            && availableTraders > 0 ) {
          return false;
        }
      }
      return true;
    }

    if(noNeedResources(villageThatNeedResources)
        || noDonorAvailable()
    ){
        goToNextLevel(defaultLevel)
    } else {
        if($.cookie("global_village_id") != villageThatNeedResources[0]) {
            goToMarketCallPageFor(villageThatNeedResources[0])
        } else {
            // include incoming resources
            if(villageThatNeedResources[1].wood < 0) villageThatNeedResources[1].wood = villageThatNeedResources[1].wood + parseInt($("#total_wood span").text().replaceAll(".",""))
            if(villageThatNeedResources[1].stone < 0) villageThatNeedResources[1].stone = villageThatNeedResources[1].stone + parseInt($("#total_stone span").text().replaceAll(".",""))
            if(villageThatNeedResources[1].iron < 0) villageThatNeedResources[1].iron = villageThatNeedResources[1].iron + parseInt($("#total_iron span").text().replaceAll(".",""))

            var villageList = $("#village_list tr").slice(1)
            for (let index = 0; index < villageList.length; index++) {
                var availableTraders = villageList.eq(index).find(".traders").text().split("/")[0]
                var donorId = villageList.eq(index).attr("data-village")
                var donorData = marketData.get(donorId)

                function clearResources(){
                    if(villageList.eq(index).find("input:checkbox[name=select-village]:checked").length == 0){
                        villageList.eq(index).find("input:checkbox[name=select-village]").click()
                        villageList.eq(index).find(".wood input").val(0)
                        villageList.eq(index).find(".stone input").val(0)
                        villageList.eq(index).find(".iron input").val(0)
                    }
                }

                if(availableTraders > 0){
                    var needWood = Math.abs(Math.min(villageThatNeedResources[1].wood,0))
                    var needStone = Math.abs(Math.min(villageThatNeedResources[1].stone,0))
                    var needIron = Math.abs(Math.min(villageThatNeedResources[1].iron,0))

                    var canSendWood = Math.max(donorData.wood,0)
                    var canSendStone = Math.max(donorData.stone,0)
                    var canSendIron = Math.max(donorData.iron,0)

                    var woodPossibleTransfers = parseInt(Math.min(needWood, canSendWood) / 1000)
                    var stonePossibleTransfers = parseInt(Math.min(needStone, canSendStone) / 1000)
                    var ironPossibleTransfers = parseInt(Math.min(needIron, canSendIron) / 1000)
                    var sumPossibleTransfers = woodPossibleTransfers + stonePossibleTransfers + ironPossibleTransfers

                    if(sumPossibleTransfers > 0){
                        clearResources()
                        var woodToSend = parseInt(Math.min(Math.min(availableTraders * woodPossibleTransfers / sumPossibleTransfers, parseInt(needWood/1000)), woodPossibleTransfers) * 1000)
                        var stoneToSend = parseInt(Math.min(Math.min(availableTraders * stonePossibleTransfers / sumPossibleTransfers, parseInt(needStone/1000)), stonePossibleTransfers) * 1000)
                        var ironToSend = parseInt(Math.min(Math.min(availableTraders * ironPossibleTransfers / sumPossibleTransfers, parseInt(needIron/1000)), ironPossibleTransfers) * 1000)

                        villageList.eq(index).find(".wood input").val(woodToSend)
                        villageList.eq(index).find(".stone input").val(stoneToSend)
                        villageList.eq(index).find(".iron input").val(ironToSend)

                        donorData.wood = donorData.wood - woodToSend
                        donorData.stone = donorData.stone - stoneToSend
                        donorData.iron = donorData.iron - ironToSend
                        marketData.set(donorId, donorData)

                        villageThatNeedResources[1].wood = villageThatNeedResources[1].wood + woodToSend
                        villageThatNeedResources[1].stone = villageThatNeedResources[1].stone + stoneToSend
                        villageThatNeedResources[1].iron = villageThatNeedResources[1].iron + ironToSend
                    }
                }
            }

            if($("input:checkbox[name=select-village]:checked").length == 0){
                if(villageThatNeedResources[1].wood < 0) villageThatNeedResources[1].wood = 0
                if(villageThatNeedResources[1].stone < 0) villageThatNeedResources[1].stone = 0
                if(villageThatNeedResources[1].iron < 0) villageThatNeedResources[1].iron = 0
            }
            marketData.set($.cookie("global_village_id"), villageThatNeedResources[1])
            localStorage.setItem("MajQs.marketData",JSON.stringify(Array.from(marketData)))

            setTimeout(function() {
                $('input:submit[value="Poproś o surowce"]').eq(0).click()
                setTimeout(function() {
                    callResources()
                }, 1500)
            }, 5000)

        }
    }
}

function isMarketCallPage() {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);

    return params.get('screen') === "market" && params.get('mode') === "call" && $(".captcha").length == 0
}
if (isMarketCallPage()) {
    console.log("Market page..." );
    if(localStorage.getItem("MajQs.marketData") == null){
        collectMarketData()
    }
    setTimeout(function() {
        callResources()
    }, 1000)
}else{
    localStorage.removeItem("MajQs.marketData")
}
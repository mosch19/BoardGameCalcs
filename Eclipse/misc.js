/*
  Garbage global variables.
*/
var shipTypes = {"interceptor":2, "crusier":4, "dreadnought":6, "starbase":4};
var p1ShipCount;
var p2ShipCount;
var shipOptions;
var starbaseOptions;

/*
  All input functions. Should have drop downs that correspond to JSONs.
*/
function getPlayer(num) {
  // Need to make lower case and read from JSON to get player stats.
  for(var ship in shipTypes) {
    if(document.getElementById(ship + num) != null) {
      // Loop through and add the components.
      for(var i = 1; i < shipTypes[ship] + 1; i++) {
        // This is the name of the html element:
        var element = document.getElementById("cmp" + i + ship + num);
        var component = element.options[element.selectedIndex].text;
        // Search the JSON to get the values to add
        component.toLowerCase();
      }
    }
  }
}

/*
  Do on case by case basis since starbase won't need power/drive and ancients are not configurable!
*/
function addDesign(num) {
  var components;
  var design = document.getElementById("design" + num).value;

  // Can only have one design per ship.
  if(checkExists(design, num)) {
    return;
  }

  switch(design) {
    case "interceptor":
      shipDefault(design, num);
      addInterceptor(design, num);
      break;
    case "cruiser":
      shipDefault(design, num);
      addCruiser(design, num, shipOptions);
      break;
    case "dreadnought":
      shipDefault(design, num);
      addDreadnought(design, num);
      break;
    case "starbase":
    $('.design-' + num + '-container').append('<div class="row entry">'+
        '<h3 id="' + design + num + '">' + design.charAt(0).toUpperCase() + design.slice(1) + '</h3>' +
        '<div class="col-sm-6">'+
          '<label for="quan' + design + num + '"> Quanitity:</label>' +
          '<input id="' + design + num + '" type="number" max="7" min="0" value="1" name="value">' +
        '</div>' +
        '<div class="col-sm-6">'+
          '<label for="drv' + design + num + '"> Base Power:</label>' +
          '<p id="drv' + design + num + '"> 3</p>' +
        '</div>' +
      '</div>');
      addCruiser(design, num, starbaseOptions);
      $('.design-' + num + '-container').append('<div class="row entry">'+
      '<div class="col-sm-3">' +
        '<label for="cmp5' + design + num + '"> Add:</label>' +
        '<select id="cmp5' + design + num + '">' +
        starbaseOptions +
        '</select>' +
      '</div>' +
      '</div>');
      break;
    case "ancient":
      $('.design-' + num + '-container').append('<div class="row entry">'+
          '<h3 id="' + design + num + '">' + design.charAt(0).toUpperCase() + design.slice(1) + '</h3>' +
          '<label for="quan' + design + num + '"> Quanitity:</label>' +
          '<input id="' + design + num + '" type="number" max="7" min="0" value="1" name="value">' +
        '</div>' +
      '<div class="row entry">'+
        '<div class="col-sm-3">' +
          '<label for="cmp1' + design + num + '"> Weapons:</label>' +
          '<p id="cmp1' + design + num + '"> Ion Cannon x2 </p>' +
        '</div>' +
        '<div class="col-sm-3">' +
          '<label for="cmp2' + design + num + '"> Computer:</label>' +
          '<p id="cmp2' + design + num + '"> Electron (+1) </p>' +
        '</div>' +
        '<div class="col-sm-3">' +
          '<label for="cmp2' + design + num + '"> Hull:</label>' +
          '<p id="cmp2' + design + num + '"> Hull x1 </p>' +
        '</div>' +
      '</div>');
      break;
    case "gcds":
      $('.design-' + num + '-container').append('<div class="row entry">'+
          '<h3 id="' + design + num + '">' + design.toUpperCase() + '</h3>' +
        '</div>' +
      '<div class="row entry">'+
        '<div class="col-sm-3">' +
          '<label for="cmp1' + design + num + '"> Weapons:</label>' +
          '<p id="cmp1' + design + num + '"> Ion Cannon x4 </p>' +
        '</div>' +
        '<div class="col-sm-3">' +
          '<label for="cmp2' + design + num + '"> Computer:</label>' +
          '<p id="cmp2' + design + num + '"> Electron (+1) </p>' +
        '</div>' +
        '<div class="col-sm-3">' +
          '<label for="cmp2' + design + num + '"> Hull:</label>' +
          '<p id="cmp2' + design + num + '"> Hull x7 </p>' +
        '</div>' +
      '</div>');
      break;
  }

}

function shipDefault(design, num) {
  $('.design-' + num + '-container').append('<div class="row entry">'+
      '<h3 id="' + design + num + '">' + design.charAt(0).toUpperCase() + design.slice(1) + '</h3>' +
      '<div class="col-sm-3">'+
        '<label for="quan' + design + num + '"> Quanitity:</label>' +
        '<input id="' + design + num + '" type="number" max="7" min="0" value="1" name="value">' +
      '</div>' +
      '<div class="col-sm-3">'+
        '<label for="pwrSrc' + design + num + '"> Power:</label>' +
        '<select id="pwrSrc' + design + num + '">' +
          '<option value="fusionsrc">Fusion Source</option>' +
        '</select>' +
      '</div>' +
      '<div class="col-sm-3">'+
        '<label for="drv' + design + num + '"> Drive:</label>' +
        '<select id="drv' + design + num + '">' +
          '<option value="fusion">Fusion Drive</option>' +
        '</select>' +
      '</div>' +
    '</div>');
}

function addInterceptor(design, num) {
  $('.design-' + num + '-container').append('<div class="row entry">'+
    '<div class="col-sm-6">' +
      '<label for="cmp1' + design + num + '"> Add:</label>' +
      '<select id="cmp1' + design + num + '">' +
        '<option value="fusion">Fusion Drive</option>' +
      '</select>' +
    '</div>' +
    '<div class="col-sm-6">' +
      '<label for="cmp2' + design + num + '"> Add:</label>' +
      '<select id="cmp2' + design + num + '">' +
        '<option value="fusion">Fusion Drive</option>' +
      '</select>' +
    '</div>' +
  '</div>');
}

function addCruiser(design, num, options) {
  $('.design-' + num + '-container').append('<div class="row entry">'+
    '<div class="col-sm-6">' +
      '<label for="cmp1' + design + num + '"> Add:</label>' +
      '<select id="cmp1' + design + num + '">' +
        options +
      '</select>' +
    '</div>' +
    '<div class="col-sm-6">' +
      '<label for="cmp2' + design + num + '"> Add:</label>' +
      '<select id="cmp2' + design + num + '">' +
        options +
      '</select>' +
    '</div>' +
    '<div class="col-sm-6">' +
      '<label for="cmp3' + design + num + '"> Add:</label>' +
      '<select id="cmp3' + design + num + '">' +
        options +
      '</select>' +
    '</div>' +
    '<div class="col-sm-6">' +
      '<label for="cmp4' + design + num + '"> Add:</label>' +
      '<select id="cmp4' + design + num + '">' +
        options +
      '</select>' +
    '</div>' +
  '</div>');
}

function addDreadnought(design, num) {
  $('.design-' + num + '-container').append('<div class="row entry">'+
      '<div class="col-sm-3">' +
        '<label for="cmp1' + design + num + '"> Add:</label>' +
        '<select id="cmp1' + design + num + '">' +
          '<option value="fusion">Fusion Drive</option>' +
        '</select>' +
      '</div>' +
      '<div class="col-sm-3">' +
        '<label for="cmp2' + design + num + '"> Add:</label>' +
        '<select id="cmp2' + design + num + '">' +
          '<option value="fusion">Fusion Drive</option>' +
        '</select>' +
      '</div>' +
      '<div class="col-sm-3">' +
        '<label for="cmp3' + design + num + '"> Add:</label>' +
        '<select id="cmp3' + design + num + '">' +
          '<option value="fusion">Fusion Drive</option>' +
        '</select>' +
      '</div>' +
    '</div>' +
    '<div class="row entry">' +
      '<div class="col-sm-3">' +
        '<label for="cmp4' + design + num + '"> Add:</label>' +
        '<select id="cmp4' + design + num + '">' +
          '<option value="fusion">Fusion Drive</option>' +
        '</select>' +
      '</div>' +
      '<div class="col-sm-3">' +
        '<label for="cmp5' + design + num + '"> Add:</label>' +
        '<select id="cmp5' + design + num + '">' +
          '<option value="fusion">Fusion Drive</option>' +
        '</select>' +
      '</div>' +
      '<div class="col-sm-3">' +
        '<label for="cmp6' + design + num + '"> Add:</label>' +
        '<select id="cmp6' + design + num + '">' +
          '<option value="fusion">Fusion Drive</option>' +
        '</select>' +
      '</div>' +
  '</div>');
}

// Since any stat can be anywhere need way to check where it should be.
function getShip(design, num) {
  if(checkExists(design, num)) {
    var hull = document.getElementById( + num).value;
    var comp = document.getElementById( + num).value;
    var shield = document.getElementById( + num).value;
    var init = document.getElementById( + num).value;
    var hull = document.getElementById( + num).value;
  }
}

function checkExists(shipType, playerNum) {
  return document.getElementById(shipType + playerNum) != null;
}

/*
  Players to hold ships and stats.
*/
function Player(name, ships, winNum, teamID) {
  this.name = name;
  this.ships = ships;
  for(var i = 0; i < ships.length - 1; i++) {
    this.ships[i].teamID = teamID;
  }
}

/*
  Ship object to be held by players.
*/
function Ship(hull, comp, shield, init, power, weapons, teamID) {
  this.hull = Number(hull);
  this.comp = Number(comp);
  this.shield = Number(shield);
  this.init = Number(init);
  this.power = Number(power);
  this.weapons = Number(weapons);
  this.dead = false;
  this.teamID = teamID;
}

/*
  Weapon object to be held by ships.
*/
function Weapon(damage, diceNum, missile) {
  this.damage = Number(damage);
  this.diceNum = Number(diceNum);
  this.missile = Boolean(missile);
}

/*
  Damage object to be created on firing and passed to targeted ship.
  Damage from one dice cannot be split.
*/
function Damage(successNum, damageVal, critHit, critFail) {
  this.successNum = successNum;
  this.damageVal = damageVal;
  this.critHit = critHit;
  this.critFail = critFail;
}

Ship.prototype.toString = function shipToString() {
  return this.hull;
}

/*
  This is actually garbage.
  Should run through the battle a single time. Nothing updates after. It just ends.
*/
function battle(playerOne, playerTwo) {
  // Merge the two players ships in one list and sort by inititiave.
  var initOrder = playerOne.ships.concat(playerTwo.ships);
  initOrder.sort(compare);
  // When this works will recreate the list and perform the battle 100 times.
  while(initOrder.length != 0) {
    for(var i = 0; i < initOrder.length; i++) {
      for(var j = 0; j < initOrder[i].weapons.length; j++) {
        for(var k = 0; k < initOrder[i].weapons.diceNum; k++) {
            // Get the result of the dice roll.
            var result = diceRoll(initOrder[i].comp, initOrder[i].weapons[j].damage);
            // Get a ship to target.
            var target;
            if(initOrder.teamID == 1) {
              target = serveShip(playerTwo);
            } else {
              target = serveShip(playerOne);
            }
            // This will be a fun test of how pass by reference works.
            takeDamage(target, result);
            // If dead should remove from the list.
            if(checkDead(target)) {
              // find it in the initOrderList and remove it but keep the reference in the player list.
              for(var x = 0; x < initOrder.length; x++) {
                if(initOrder[x] == target) {
                  // Found the ship. Now remove it from the firing list.
                  initOrder.splice(x, 1);
                }
              }
            }
        }
      }
    }
  }
}

/*
  6: always hits, 1: always misses. Returns damage objects.
*/
function diceRoll(comp, damageVal) {
  var val = Math.floor(Math.random() * 6) + 1;
  if(val == 6 || val == 1) {
    return new Damage(val, damageVal, val == 6, val == 1);
  } else {
    return new Damage(val + comp, damageVal, false, false);
  }
}

/*
  Take damage on the ship and check for crit hits or failures.
*/
function takeDamage(targetShip, damage) {
  if(damage.critHit) {
    targetShip.hull -= damage.damageVal;
  } else if(!damage.critFail) {
    if(damage.successNum - targetShip.shield > 5) {
      targetShip.hull -= damage.damageVal;
    }
  }
  return null;
}

/*
  Give up the best ship to target. Currently based off of hull.
*/
function serveShip(player) {
  player.ships.sort(hullCompare);
  return player.ships[player.ships.length - 1];
}

function checkDead(targetShip) {
  return targetShip.hull > 0;
}

/*
  Compare the ships based upon initiative.
*/
function compare(a, b) {
  if(a.init < b.init) {
    return -1;
  }
  if(a.init > b.init) {
    return 1;
  }
  return 0;
}

/*
  Compare the ships based upon hull.
*/
function hullCompare(a, b) {
  if(a.hull < b.hull) {
    return -1;
  }
  if(a.hull > b.hull) {
    return 1;
  }
  return 0;
}

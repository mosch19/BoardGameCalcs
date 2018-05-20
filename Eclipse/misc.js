/*
  Garbage global variables.
*/
var p1ShipCount;
var p2ShipCount;

/*
  All input functions. Should have drop downs that correspond to JSONs.
*/
function getPlayer(num) {

}

function getShip(num) {
  var hull = document.getElementById("p1Hull" + num).value;
  var comp = document.getElementById("p1Hull" + num).value;
  var shield = document.getElementById("p1Hull" + num).value;
  var init = document.getElementById("p1Hull" + num).value;
  var hull = document.getElementById("p1Hull" + num).value;
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
  this.teamID = teamID:
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

var monsterCount = 0;

    function addMonster() {
        if(monsterCount < 5) {
          monsterCount++;
          $('.monster-container').append('<div class="row entry">'+
              '<div class="col-sm-3 mSpinners">'+
                '<p class="mSpinner">'+
                  '<label for="mHealthSpinner' + monsterCount + '"> Health:</label>'+
                  '<input id="mHealthSpinner' + monsterCount + '" type="number" max="10" min="0" value="3" name="value">'+
                '</p>'+
              '</div>'+
              '<div class="col-sm-3 mSpinners">'+
                '<p class="mSpinner">'+
                  '<label for="damageSpinner' + monsterCount + '"> Damage:</label>'+
                  '<input id="damageSpinner' + monsterCount + '" type="number" max="10" min="0" value="2" name="value">'+
                '</p>'+
              '</div>'+
              '<div class="col-sm-3 mSpinners">'+
                '<p class="mSpinner">'+
                  '<label for="fearSpinner' + monsterCount + '"> Fear:</label>'+
                  '<input id="fearSpinner' + monsterCount + '" type="number" max="10" min="0" value="2" name="value">'+
                '</p>'+
              '</div>'+
            '</div>');
          $('.results-container').append(
            '<div id="results' + monsterCount + '" class="panel panel-success">' +
              '<div class="panel-heading"> <h3> Monster ' + (monsterCount + 1) + '</h3> </div>' +
              '<div id="trials' + monsterCount + '" class="panel-body results-panel-body"> Number of fights </div>' +
              '<div id="avgHL' + monsterCount + '" class="panel-body results-panel-body"> Avg health loss </div>' +
              '<div id="avgSL' + monsterCount + '" class="panel-body results-panel-body"> Avg sanity loss </div>' +
              '<div id="avgDD' + monsterCount + '" class="panel-body results-panel-body"> Avg damage dealt </div>' +
              '<div id="pD' + monsterCount + '" class="panel-body results-panel-body"> Player death % </div>' +
              '<div id="mD' + monsterCount + '" class="panel-body results-panel-body"> Monster death % </div>' +
            '</div>'
          );
        }
      }

    function removeMonster() {
      if(monsterCount > 0) {
        $('label[for="mHealthSpinner' + monsterCount + '"]').remove();
        $('#mHealthSpinner' + monsterCount).remove();
        $('label[for="damageSpinner' + monsterCount + '"]').remove();
        $('#damageSpinner' + monsterCount).remove();
        $('label[for="fearSpinner' + monsterCount + '"]').remove();
        $('#fearSpinner' + monsterCount).remove();
        $('#results' + monsterCount).remove();
        monsterCount--;
      }
    }

    function getPlayer() {
      var health = document.getElementById("pHealthSpinner").value;
      var sanity = document.getElementById("sanitySpinner").value;
      var strength = document.getElementById("strengthSpinner").value;
      var will = document.getElementById("willSpinner").value;
      var rerolls = document.getElementById("rerollSpinner").value;
      var status = $("input[name=state]:checked").val();

      return new Player(health, sanity, strength, will, rerolls, status);
    }

    function getMonster(num) {
      var health = document.getElementById("mHealthSpinner" + num).value;
      var damage = document.getElementById("damageSpinner" + num).value;
      var fear = document.getElementById("fearSpinner" + num).value;

      return new Monster(health, damage, fear);
    }

    function getMonsters() {
      var monsters = new Array();
      for(var i = 0; i < monsterCount + 1; i++) {
        monsters.push(getMonster(i));
      }
      return monsters;
    }

    function objectInput() {

      player = getPlayer();
      monsters = getMonsters();
      var survivedAll = 0;
      var results = new Array();

      for (var i = 0; i < 100; i++) {
        player = getPlayer();
        monsters = getMonsters();

        for(var j = 0; j < monsters.length; j++) {
          if(!checkDead("player", player)) {
            // If player is alive go to next monster
            results.push(willTest(player, monsters[j], j));
          }
        }
        // Check to see if the player survived the gauntlet
        if(!checkDead("player", player)) {
          survivedAll++;
        }
      }
      analyzeResults(results, survivedAll, monsters.length);
    }

    function analyzeResults(results, survivedAll, numMonsters) {
      var fightList;
      for(var i = 0; i < numMonsters; i++) {
        fightList = getFightsWithMonster(results, i);

        analysis = new Result(0, 0, 0, false, false);
        var monsterKillPercent = 0;
        var playerDeathPercent = 0;

        for(var j = 0; j < fightList.length; j++) {
          analysis.sanityLost += fightList[j].sanityLost;
          analysis.healthLost += fightList[j].healthLost;
          analysis.damageDealt += fightList[j].damageDealt;
          if (fightList[j].playerDeath) {
            playerDeathPercent++;
          }
          if (fightList[j].monsterDeath) {
            monsterKillPercent++;
          }
        }
        analysis.sanityLost /= fightList.length;
        analysis.healthLost /= fightList.length;
        analysis.damageDealt /= fightList.length;
        playerDeathPercent /= fightList.length;
        monsterKillPercent /= fightList.length;

        displayResults(analysis, playerDeathPercent * 100, monsterKillPercent * 100, i, fightList.length);
      }

      displayGauntletSurvival(survivedAll);
    }

    function getFightsWithMonster(allResults, monsterNum) {
      var fightList = new Array();
      for(var i = 0; i < allResults.length; i++) {
        if(allResults[i].monsterNum === monsterNum) {
          fightList.push(allResults[i]);
        }
      }
      return fightList;
    }

    function displayResults(analysis, playerDeathPercent, monsterKillPercent, monsterNum, trials) {
      document.getElementById("trials" + monsterNum).innerHTML = "Number of fights: " + trials;
      if(trials === 0) {
        document.getElementById("avgHL" + monsterNum).innerHTML = "Average health loss: ...";
        document.getElementById("avgSL" + monsterNum).innerHTML = "Average sanity loss: ...";
        document.getElementById("avgDD" + monsterNum).innerHTML = "Average damage dealt: ...";
        document.getElementById("pD" + monsterNum).innerHTML = "Average player death: ...";
        document.getElementById("mD" + monsterNum).innerHTML = "Average monster death: ...";
        document.getElementById("results" + monsterNum).classList.remove('panel-success');
        document.getElementById("results" + monsterNum).classList.add('panel-danger')
      } else {
        document.getElementById("avgHL" + monsterNum).innerHTML = "Average health loss: " + Math.round(analysis.healthLost * 100) / 100;
        document.getElementById("avgSL" + monsterNum).innerHTML = "Average sanity loss: " + Math.round(analysis.sanityLost * 100) / 100;
        document.getElementById("avgDD" + monsterNum).innerHTML = "Average damage dealt: " + Math.round(analysis.damageDealt * 100) / 100;
        document.getElementById("pD" + monsterNum).innerHTML = "Average player death: " + Math.round(playerDeathPercent * 100) / 100 + "%";
        document.getElementById("mD" + monsterNum).innerHTML = "Average monster death: " + Math.round(monsterKillPercent * 100) / 100 + "%";
      
        if(playerDeathPercent > 50) {
          document.getElementById("results" + monsterNum).classList.remove('panel-success');
          document.getElementById("results" + monsterNum).classList.add('panel-danger');
        } else {
          document.getElementById("results" + monsterNum).classList.remove('panel-danger');
          document.getElementById("results" + monsterNum).classList.add('panel-success');
        }
      }
    }

    function displayGauntletSurvival(survivedAll) {
      document.getElementById("gauntlet").innerHTML = "Results: You survived the gauntlet " + survivedAll + "% of the time.";
    }

    function Player(health, sanity, strength, will, rerolls, state) {
      this.health = Number(health);
      this.sanity = Number(sanity);
      this.strength = Number(strength);
      this.will = Number(will);
      this.rerolls = Number(rerolls);
      this.state = Number(state);b
    }

    Player.prototype.toString = function playerToString() {
      return this.health + ", " + this.sanity + ", " + this.strength + ", " + this.will + ", " + this.state;
    }

    function Monster(health, damage, fear) {
      this.original = Number(health);
      this.health = Number(health);
      this.damage = Number(damage);
      this.fear = Number(fear);
    }

    Monster.prototype.toString = function monsterToString() {
      return this.health + ", " + this.damage + ", " + this.fear;
    }

    function Result(sanityLost, healthLost, damageDealt, playerDeath, monsterDeath, monsterNum) {
      this.sanityLost = sanityLost;
      this.healthLost = healthLost;
      this.damageDealt = damageDealt;
      this.playerDeath = playerDeath;
      this.monsterDeath = monsterDeath;
      this.monsterNum = monsterNum;
    }

    Result.prototype.toString = function resultToString() {
      return this.sanityLost + ", " + this.healthLost + ", " + this.damageDealt + ", " + this.playerDeath + ", " + this.monsterDeath;
    }

    function diceRoll(statusEffect) {
      return (Math.floor(Math.random() * 6) + 1 > 4 + statusEffect);
    }

    function checkDead(type, creature) {
      if (type === "monster") {
        return creature.health < 1;
      } else if (type === "player") {
        return (creature.health < 1 || creature.sanity < 1);
      }
    }

    function isLethal(defense, attack) {
      return (Math.abs(attack) >= defense);
    }

    function willTest(player, monster, monsterNum) {
      var successes = 0;
      var sanityLost = 0;
      for (var i = 0; i < player.will; i++) {
        if (diceRoll(player.state)) {
          successes++;
        }
      }
      // Use rerolls if necessary
      while(player.rerolls > 0 && isLethal(player.sanity, successes - monster.fear)) {
        player.rerolls--;
        if(diceRoll(player.state)) {
          successes++;
        }
      }
      // Suffer consequences
      if (successes < monster.fear) {
        sanityLost = successes - monster.fear;
        player.sanity += sanityLost;
      }
      if (checkDead("player", player)) {
        return new Result(sanityLost, 0, 0, true, false, monsterNum);
      } else {
        return strengthTest(player, monster, sanityLost, monsterNum);
      }
    }

    function strengthTest(player, monster, sanityLost, monsterNum) {
      var successes = 0;
      var healthLost = 0;
      for (var i = 0; i < player.strength; i++) {
        if (diceRoll(player.state)) {
          successes++;
        }
      }
      // Use rerolls if necessary
      while(player.rerolls > 0 && isLethal(player.health, successes - monster.damage)) {
        player.rerolls--;
        if(diceRoll(player.state)) {
          successes++;
        }
      }
      if (successes < monster.damage) {
        healthLost = successes - monster.damage;
        player.health += healthLost;
      }
      monster.health -= successes;
      return new Result(sanityLost, healthLost, successes, checkDead("player", player), checkDead("monster", monster), monsterNum);
    }

    /*
    Loop through all permutations of the monster order to determine best order in terms of survival or killing %
    */
    function getScore(results, survivedAll) {
      // Loop through the results and return a score based upon killing potential and survival
      // Don't need to discriminate by monsters here. Only care about total killing % and survival %
      // Sum up all the kills and total survivls and add then return as scores
      // Append the scores to the permutations object so I can print them with the actual order using the toString()
      var monstersKilled = 0;
      for(var i = 0; i < results.length; i++) {
        if(results[i].monsterDeath) {
          monstersKilled++;
        }
      }
      return monstersKilled + survivedAll;
    }

    function compare(a, b) {
      if(a.score < b.score) {
        return -1;
      }
      if(a.score > b.score) {
        return 1;
      }
      return 0;
    }

    function bestOrder() {
      if(monsterCount < 1) {
        document.getElementById('perm0').innerHTML = "Best order: Add more monsters see an estimate at the best order.";
        document.getElementById('perm1').innerHTML = "Second best: ";
        return;
      }
      player = getPlayer();
      var permutations = permutate(getMonsters());

      // Loop through permutations and for each determine their score based upon either survival or killing potential
      for(var i = 0; i < permutations.length; i++) {
        var results = new Array();
        var survivedAll = 0;
        // 100 trials for this gauntlet
        for(var j = 0; j < 100; j++) {
          // This is going to be horribly inefficient. Need to reset health.
          player = getPlayer();
          // Loop through monsters in list
          for(var k = 0; k < permutations[i].length; k++) {
            permutations[i][k].health = permutations[i][k].original;
            if(!checkDead("player", player)) {
              // If player is alive go to next monster
              results.push(willTest(player, permutations[i][k], k));
            }
          }
          // Check to see if the player survived the gauntlet
          if(!checkDead("player", player)) {
            survivedAll++;
          }
        }
        // Get the values I want to compare from the results
        permutations[i].score = getScore(results, survivedAll);
      }
      permutations.sort(compare);

      var bestOrder = getMonsterElements(1, permutations[permutations.length - 1]);
      var secondBest = getMonsterElements(2, permutations[permutations.length - 2]);

      document.getElementById('perm0').innerHTML = "Best order: " + bestOrder + " with score of " + permutations[permutations.length - 1].score;
      document.getElementById('perm1').innerHTML = "Second best: " + secondBest + " with score of " + permutations[permutations.length - 2].score;
    }

    function getMonsterElements(index, monsterList) {
      var bestOrder = "";
      for(var i = 0; i < monsterCount + 1; i++) {
        monsterList[i].health = monsterList[i].original;
        bestOrder += monsterList[i].toString() + " then ";
      }
      return bestOrder.substring(0, bestOrder.length - 6);
    }

    function permutate(permutation) {
      var length = permutation.length,
          result = [permutation.slice()],
          c = new Array(length).fill(0),
          i = 1, k, p;

      while (i < length) {
        if (c[i] < i) {
          k = i % 2 && c[i];
          p = permutation[i];
          permutation[i] = permutation[k];
          permutation[k] = p;
          ++c[i];
          i = 1;
          result.push(permutation.slice());
        } else {
          c[i] = 0;
          ++i;
        }
      }
      return result;
    }

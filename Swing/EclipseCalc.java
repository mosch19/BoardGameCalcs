import javax.swing.*;
import javax.swing.event.ChangeListener;
import java.util.concurrent.ThreadLocalRandom;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.io.Serializable;
import java.lang.Comparable;

class EclipseCalc extends JFrame {
    
    ElcipseCalc() {
        setSize(700, 500);
        setTitle("Eclipse Dogfight Sim");
        Container c = getContentPane();

        setVisible(true);
    }

    public static void main(String args[]) {
        System.out.println("Hello there");
    }
}

class Player {

    String name;    
    private ArrayList<Ship> ships;

    Player(String name) {
        ships = new ArrayList<>();
        this.name = name;
    }

    public void addShip(Ship s) {
        ships.addShip(s);
    }

    // Loop through and get best ship
    public Ship getTarget() {
        Ship target = ships.get(0);
        for(Ship s : ships) {
            if(s < target) {
                s = target;
            }
            return s;
        }
    }

    public static ArrayList<Ship> initiativeOrder(Player a, Player b) {
        return new ArrayList<>();     
    }

    public Queue initiativeOrder() {
        return null;
    }

}

class Ship implements Comparable<Ship>, Serializable {

    private int hull, comp, shields, init, power;
    private boolean hasDrive;
    private ArrayList<Weapon> weapons;

    Ship(int hull, int comp, int shields, int init) {
        weapons = new ArrayList<>();
        this.hull = hull;
        this.comp = comp;
        this.shields = shields;
        this.init = init;
    }

    public void addWeapon(Weapon w) {
        weapons.add(w);
    }

    public void takeDamage(Damage d) {
        if(damage.getCriticalHit() || ) {
            this.hull -= damageVal;
        }
        
    }

    public boolean checkDead() {
        return (this.hull < 1);
    }

    public void fire(Player opponent) {
        for each weapons
            weapon.fire(opponent.getTarget(), this.comp);
        target.takeDamage();
    }

    @Override
    public int compareTo(Ship s) {
        return Integer.compare(init, s.init);
    }

    /*
    public static getOpponent(Player a, Player b) {
        if()
    }
    */
}

class Weapon {

    private int diceNum, damageVal;
    private boolean missile;

    Weapon(int diceNum, int damageVal, boolean missile) {
        this.diceNum = diceNum;
        this.damageVal = damageVal;
        this.missile = missile;
    }

    public boolean fire(Player opponent, int comp) {
        // Get resulting damage, apply to ship, return if hit is recorded
        opponent.takeDamage(damage);
    }

}

class Damage {

    private int rollNum, damageVal;
    private boolean criticalHit;

    Damage(int rollNum, int damageVal, boolean criticalHit) {
        this.rollNum = rollNum;
        this.damageVal = damageVal;
        this.criticalHit = criticalHit;
    }

    public int getRollNum()  { return this.rollNum; }

    public int getDamageVal() { return this.damageVal; }

    public int getCriticalHit() { return this.criticalHit; }

}

class Result {

}

class Simulator {
    
    public static Damage diceRoll(int damage, int comp) {
        if(ThreadLocalRandom.current().nextInt(1, 6 + 1) > 5) {
            return new Damage(damage, true);
        } else {
            return new Damage(damage, false);
        }
    }

    public static Result battle(Player a, Player b) {
        // Loop through each players ships and keep going in initiative order
        // ArrayList<Ship> turnOrder = Player.initiativeOrder(a, b);
        Queue queue = a.initiativeOrder();
        Queue queue2 = b.initiativeOrder();
        /*
        for ships in initiative order
        instead of having ship ids just have each player sort their own ship then compare with the opponent and the returned ship fires at the other player
        use a queue/stack instead of loops
            ship.fire(opponent);
            ship fire all weapons but targeting needs to change
            apply damage
            check deaths
            make sure they cant shoot if dead



        */
        return null;
    }

}

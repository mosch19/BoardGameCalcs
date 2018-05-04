// TODO: add rerolls into the mix and implemetn cursed vs blessed
import javax.swing.*;
import javax.swing.event.ChangeListener;
import java.util.concurrent.ThreadLocalRandom;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

class EldrtichHorroCalc extends JFrame {

    private JSpinner pHealth;
    private JSpinner sanity;
    private JSpinner strength;
    private JSpinner will;
    private JSpinner mHealth;
    private JSpinner damage;
    private JSpinner fear;
    private JLabel avgSanityLost;
    private JLabel avgHealthLost;
    private JLabel avgDamageDealt;
    private JLabel playerDeath;
    private JLabel monsterKilled;
    private JRadioButton[] stateButtons;
    private static ArrayList<Result> resultList;

    EldrtichHorroCalc() {
        setSize(700, 500);
        setTitle("Eldritch Horror Combat Sim");

        addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                dispose();
            }
        });

        Font titleFont = new Font("Helvetica", Font.BOLD, 20);

        Container c = getContentPane();

        SpinnerModel pHealthModel = new SpinnerNumberModel(4, 1, 8, 1);
        SpinnerModel sanityModel = new SpinnerNumberModel(4, 1, 8, 1);
        SpinnerModel willModel = new SpinnerNumberModel(4, 1, 8, 1);
        SpinnerModel strengthModel = new SpinnerNumberModel(4, 1, 8, 1);
        SpinnerModel fearModel = new SpinnerNumberModel(4, 1, 8, 1);
        SpinnerModel damageModel = new SpinnerNumberModel(4, 1, 8, 1);
        SpinnerModel mHealthModel = new SpinnerNumberModel(4, 1, 8, 1);

        JPanel titles = new JPanel();
        titles.setLayout(new GridLayout(1, 2, 5, 5));
        JLabel pTitle = new JLabel("Player Stats", SwingConstants.CENTER);
        pTitle.setForeground(Color.CYAN);
        JLabel mTitle = new JLabel("Monster Stats", SwingConstants.CENTER);
        mTitle.setForeground(Color.CYAN);
        titles.add(pTitle);
        titles.add(mTitle);
        pTitle.setFont(titleFont);
        mTitle.setFont(titleFont);
        titles.setBackground(Color.BLACK);
        
        JPanel info = new JPanel();
        info.setLayout(new GridLayout(2, 2, 5, 5));

        JPanel player = new JPanel();
        player.setLayout(new GridLayout(3, 4, 5, 5));
        JLabel pHealthLabel = new JLabel("Health:");
        pHealth = new JSpinner(pHealthModel);
        JLabel sanityLabel = new JLabel("Sanity:");
        sanity = new JSpinner(sanityModel);
        JLabel willLabel = new JLabel("Will:");
        will = new JSpinner(willModel);
        JLabel strengthLabel = new JLabel("Strength:");
        strength = new JSpinner(strengthModel);
        JLabel stateLabel = new JLabel("State:");
        JRadioButton blessed = new JRadioButton("Blessed");
        JRadioButton none = new JRadioButton("None");
        JRadioButton cursed = new JRadioButton("Cursed");
        stateButtons = new JRadioButton[] {blessed, none, cursed};
        ButtonGroup states = new ButtonGroup();
        states.add(blessed);
        states.add(none);
        states.add(cursed);
        none.setSelected(true);
        player.add(pHealthLabel);
        player.add(pHealth);
        player.add(sanityLabel);
        player.add(sanity);
        player.add(willLabel);
        player.add(will);
        player.add(strengthLabel);
        player.add(strength);
        player.add(stateLabel);
        player.add(blessed);
        player.add(none);
        player.add(cursed);
        // player.setBackground(Color.BLACK);

        JPanel monster = new JPanel();
        monster.setLayout(new GridLayout(2, 4, 5, 5));
        JLabel mHealthLabel = new JLabel("Health:");
        mHealth = new JSpinner(mHealthModel);
        JLabel fearLabel = new JLabel("Fear:");
        fear = new JSpinner(fearModel);
        JLabel damageLabel = new JLabel("Damage:");
        damage = new JSpinner(damageModel);
        JLabel what = new JLabel();
        JLabel why = new JLabel();
        monster.add(mHealthLabel);
        monster.add(mHealth);
        monster.add(fearLabel);
        monster.add(fear);
        monster.add(damageLabel);
        monster.add(damage);
        monster.add(what);
        monster.add(why);
        // monster.setBackground(Color.BLACK);

        JPanel results = new JPanel();
        results.setLayout(new GridLayout(5, 2, 1, 1));
        JLabel aslLabel = new JLabel("Avg sanity loss:");
        avgSanityLost = new JLabel();
        JLabel ahlLabel = new JLabel("Avg health loss:");
        avgHealthLost = new JLabel();
        JLabel addLabel = new JLabel("Avg damage dealt:");
        avgDamageDealt = new JLabel();
        JLabel pdLabel = new JLabel("Player death:");
        playerDeath = new JLabel();
        JLabel mkLabel = new JLabel("Monster death:");
        monsterKilled = new JLabel();
        results.add(aslLabel);
        results.add(avgSanityLost);
        results.add(ahlLabel);
        results.add(avgHealthLost);
        results.add(addLabel);
        results.add(avgDamageDealt);
        results.add(pdLabel);
        results.add(playerDeath);
        results.add(mkLabel);
        results.add(monsterKilled);

        info.add(player);
        info.add(monster);
        info.add(results);
        info.add(new JLabel());

        JButton fight = new JButton("Simulate");
        fight.addActionListener(new myListener());

        c.add(titles, BorderLayout.NORTH);
        c.add(info, BorderLayout.CENTER);
        c.add(fight, BorderLayout.SOUTH);

        setVisible(true);
    }

    public static void main(String args[]) {
        new EldrtichHorroCalc();
    }

    public double[] analyze() {
        double[] analysis = {0, 0, 0, 0, 0};
        for(Result r : resultList) {
            analysis[0] += r.getSanityLoss();
            analysis[1] += r.getHealthLoss();
            analysis[2] += r.getDamageDealt();
            if(r.playerDied()) {
                analysis[3]++;
            }
            if(r.monsterKilled()) {
                analysis[4]++;
            }
        }
        for(int i = 0; i < analysis.length; i++) {
            analysis[i] /= resultList.size();
        }
        return analysis;
    }

    public void showResults() {
        double[] analysis = analyze();
        avgSanityLost.setText(String.format("%.2f", analysis[0]));
        avgHealthLost.setText(String.format("%.2f", analysis[1]));
        avgDamageDealt.setText(String.format("%.2f", analysis[2]));
        playerDeath.setText(String.format("%.2f", analysis[3] * 100) + " %");
        monsterKilled.setText(String.format("%.2f", analysis[4] * 100) + " %");

        // String results = "Average sanity loss: " + String.format("%.2f", analysis[0]) + '\n'
        // + "Average health loss: " + String.format("%.2f",analysis[1]) + '\n'
        // + "Average damage dealt: " + String.format("%.2f",analysis[2]) + '\n'
        // + "Player death %: " + String.format("%.2f",analysis[3] * 100) + "%" + '\n'
        // + "Monster killed %: " + String.format("%.2f",analysis[4] * 100) + "%";

        // JOptionPane.showMessageDialog(null, results);
    }

    class myListener implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            int state = 0;
            for(JRadioButton b : stateButtons) {
                if(b.isSelected()) {
                    switch(b.getText()) {
                        case "Blessed":
                            state = -1;
                            break;
                        case "Cursed":
                            state = 1;
                            break;
                    }
                }
            }
            resultList = new ArrayList<>();
            Player player = null;
            Monster monster = null;
            for(int i = 0; i < 100; i++) {
                player = new Player((int) pHealth.getValue(), (int) sanity.getValue(), (int) strength.getValue(), (int) will.getValue(), state);
                monster = new Monster((int) mHealth.getValue(), (int) damage.getValue(), (int) fear.getValue());
                Result result = Test.willTest(player, monster);
                resultList.add(result);
            }
            showResults();
        }
    }
}

class Player {

    private int health, sanity, mod, strength, will;

    Player(int health, int sanity, int strength, int will, int mod) {
        this.health = health;
        this.sanity = sanity;
        this.strength = strength;
        this.will = will;
        this.mod = mod;
    }

    public int getHealth() { return this.health; }

    public int getStrength() { return this.strength; }

    public int getWill() { return this.will; }

    public int getMod() { return this.mod; }

    public void takeDamage(int damage) { this.health += damage; }

    public void loseSanity(int fear) { this.sanity += fear; }

    public boolean checkDead() {
        if(health < 1) {
            return true;
        } else if(sanity < 1) {
            return true;
        } else {
            return false;
        }
    }
}

class Monster {
    private int health, damage, fear;

    Monster(int health, int damage, int fear) {
        this.health = health;
        this.damage = damage;
        this.fear = fear;
    }

    public int getDamage() { return this.damage; }

    public int getFear() { return this.fear; }

    public void takeDamage(int damage) { this.health -= damage; }

    public boolean checkDead() {
        if(health < 1) {
            return true;
        } else {
            return false;
        }
    }
}

class Test {
    // Two tests should only produce a single result
    // Will test can only reduce sanity or cause insanity. If insane don't run strength test
    public static Result willTest(Player player, Monster monster) {
        int successes = 0;
        int sanityLost = 0;
        for(int i = 0; i < player.getWill(); i++) {
            if(Test.diceRoll(player.getMod())) {
                successes++;
            }
        }
        if(successes < monster.getFear()) {
            // Sanity is lost
            sanityLost = successes - monster.getFear();
            player.loseSanity(sanityLost);
        }
        if(player.checkDead()) {
            return new Result(sanityLost, true);
        } else {
            return strengthTest(player, monster, sanityLost);
        }
    }

    // If both are run pass in the sanity lost to avoid creating a new result
    public static Result strengthTest(Player player, Monster monster, int sanityLost) {
        int successes = 0;
        int healthLost = 0;
        for(int i = 0; i < player.getStrength(); i++) {
            if(Test.diceRoll(player.getMod())) {
                successes++;
            }
        }
        if(successes < monster.getDamage()) {
            // Player & monster take damage
            healthLost = successes - monster.getDamage();
            player.takeDamage(healthLost);
        }
        // Player takes no damage but deals some (all???)
        monster.takeDamage(successes);
        // Can a player and a monster both die on the same turn?
        return new Result(sanityLost, healthLost, successes, player.checkDead(), monster.checkDead());
    }

    public static boolean diceRoll(int statusEffect) {
        if(ThreadLocalRandom.current().nextInt(1, 6 + 1) > 4 + statusEffect) {
            return true;
        } else {
            return false;
        }
    }
}

class Result {
    private int sanityLost, healthLost, damageDealt;
    private boolean playerDeath, monsterDeath;

    // Full constructor
    Result(int sanityLost, int healthLost, int damageDealt, boolean playerDeath, boolean monsterDeath) {
        this.sanityLost = sanityLost;
        this.healthLost = healthLost;
        this.damageDealt = damageDealt;
        this.playerDeath = playerDeath;
        this.monsterDeath = monsterDeath;
    }

    // Constructor for willTest results
    Result(int sanityLost, boolean playerDeath) {
        this(sanityLost, 0, 0, playerDeath, false);
    }

    // Function to update result after strength test
    public void strengthUpdate(int healthLost, int damageDealt, boolean playerDeath, boolean monsterDeath) {
        this.healthLost = healthLost;
        this.damageDealt = damageDealt;
        this.playerDeath = playerDeath;
        this.monsterDeath = monsterDeath;
    }

    public int getHealthLoss() { return healthLost; }
    public int getSanityLoss() { return sanityLost; }
    public int getDamageDealt() { return damageDealt; }
    public boolean playerDied() { return playerDeath; }
    public boolean monsterKilled() { return monsterDeath; }

    public String toString() {
        return this.sanityLost + ", " + this.healthLost + ", " + this.damageDealt + ", " + this.playerDeath + ", " + this.monsterDeath;
    }
}

module.exports = function(bot) {

    /**
     * Est exécuté chaque fois que le bot est initialisé lors de sa connexion.
     */
    bot.on("ready", function(event) {
        console.log("====================================");
        console.log("> Utilisateur : " + bot.username);
        console.log("> Discriminant : " + bot.discriminator);
        console.log("> Identifiant : " + bot.id);
        console.log("====================================");

        console.log("[INFO] " + bot.username + " est maintenant connecté.");

    });

}



/* ===========================================================

    Fantaisie graphique inutile :)

 =========================================================== */

console.log("\
  _______  _____  ____   ___ _____ \n\
 | ____\\ \\/ / _ \\| __ ) / _ \\_   _|\n\
 |  _|  \\  / | | |  _ \\| | | || |  \n\
 | |___ /  \\ |_| | |_) | |_| || |  \n\
 |_____/_/\\_\\___/|____/ \\___/ |_|\n\
");

console.log('[INFO] onReady.js chargé.');

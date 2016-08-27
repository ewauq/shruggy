module.exports = function(bot) {

    /**
     * Est exécuté chaque fois que le bot est déconnecté.
     * Il est reconnecté automatiquement lors que l'évènement s'arrête.
     */
    bot.on('disconnect', function(error, code) {
        console.log("[INFO] " + bot.username + " s'est arrêté.");
        console.log("[INFO] Reconnexion automatique en cours...");

        // Reconnexion automatique.
        bot.connect();
    });

}

console.log('[INFO] onDisconnect.js chargé.');

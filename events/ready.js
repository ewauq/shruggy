module.exports = function(bot, start_time) {

    var first_time = true;

    /**
     * Est exécuté chaque fois que le bot est initialisé lors de sa connexion.
     */
    bot.on("ready", function(event) {

        /**
         * Affichage des informations dans la console lors du chargement du bot.
         */

        if(bot.connected)
            console.log(`[INFO] ${bot.username} est maintenant connecté.`);

        // Mise à jour automatique de l'avatar du bot.
        bot.updateAvatar();

        console.log("====================================");
        console.log(`> Utilisateur : ${bot.username}`);
        console.log(`> Discriminant : ${bot.discriminator}`);
        console.log(`> Identifiant : ${bot.id}`);
        console.log("====================================");

        // Affichage du temps de lancement du bot.
        var end_time = new Date();
        var loading = Math.abs(start_time - end_time);

        if(first_time)
            console.log(`[INFO] Le bot a été chargé avec succès. (${loading}ms)`);
        else
            console.log(`[INFO] Le bot a été chargé avec succès.`);

        first_time = false;



         /* ===========================================================

             Gestion des tâches

          =========================================================== */

        var tsk = require('../lib/task.js');

        // Lancement des tâches.
        tsk.run(function(output) {

            // On gère l'envoi de message ici.
            if(output.message)
                bot.sendMessage({ to: output.channelID, message: output.message });

          });

    });

};

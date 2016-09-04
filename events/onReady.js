module.exports = function(bot) {

    /**
     * Est exécuté chaque fois que le bot est initialisé lors de sa connexion.
     */
     bot.on("ready", function(event) {

         // Appel des librairies nécessaires pour les tâches.
         var _ = require('../libs/functions.js');

         console.log("====================================");
         console.log(`> Utilisateur : ${bot.username}`);
         console.log(`> Discriminant : ${bot.discriminator}`);
         console.log(`> Identifiant : ${bot.id}`);
         console.log("====================================");

        if(bot.connected)
            console.log(`[INFO] ${bot.username} est maintenant connecté.`);

         // Mise à jour automatique de l'avatar du bot.
         if(_.updateAvatar(bot))
            console.log("[INFO] L'avatar a été mis à jour.");
         else
            console.log("[ERREUR] L'avatar n'a pu être mis à jour. (voir l'erreur ci-dessus)");



         /* ===========================================================

             Gestion des tâches

          =========================================================== */

        var tsk = require('../libs/task.js');

        tsk.run(function(output) {

            // On gère l'envoi de message ici.
            if(output.message)
                bot.sendMessage({ to: output.channelID, message: output.message });

          });

     });

}



/* ===========================================================

    Fantaisie graphique inutile :)

 =========================================================== */

console.log("\
  _____ _                                    ____        _   \n\
 / ____| |                                  |  _ \\      | |  \n\
| (___ | |__  _ __ _   _  __ _  __ _ _   _  | |_) | ___ | |_ \n\
 \\___ \\| '_ \\| '__| | | |/ _` |/ _` | | | | |  _ < / _ \\| __|\n\
 ____) | | | | |  | |_| | (_| | (_| | |_| | | |_) | (_) | |_ \n\
|_____/|_| |_|_|   \\__,_|\\__, |\\__, |\\__, | |____/ \\___/ \\__|\n\
                          __/ | __/ | __/ |                  \n\
                         |___/ |___/ |___/                   \n\
");

console.log('[INFO] onReady.js chargé.');

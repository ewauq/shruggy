module.exports = function(bot) {

    /**
     * Est exécuté chaque fois qu'un utilisateur (le bot compris) envoie un message.
     */
    bot.on("message", function(user, userID, channelID, message, event) {

        /**
         * Appel de la librairie de fonctions de l'application.
         */
        var func = require('../functions.js');

        /**
         * Déclaration des variables
         */
        var date = new Date();
        var hours = ("0" + date.getHours()).slice(-2);
        var minutes = ("0" + date.getMinutes()).slice(-2);
        var seconds = ("0" + date.getSeconds()).slice(-2);
        var timestamp = hours + ":" + minutes + ":" + seconds;



        /* ===========================================================

            Affichage des messages dans la console.
            Inclut les URL des fichiers envoyés.

         =========================================================== */

        /**
         * Affichage textuel des message dans la console.
         */
        var attachment = "";

        // Si un fichier est envoyé, on récupère son url.
        if(event.d.attachments.length > 0)
            attachment = " <" + event.d.attachments[0].url + "> "

        console.log('{' + bot.channels[channelID].name + '} [' + timestamp + '] <' + user + '> ' + message + attachment);



        /* ===========================================================

            Gestion des commandes

         =========================================================== */

        if(message.isCommand()) {

            var command = require('../command.js');
            var output = command.run(event, function(output, error) {

                // Si la commande retourne une erreur, on la gère.
                if(error)
                    console.log("[ERREUR] " + error);

                // Envoi du message s'il existe.
                if(output)
                    bot.sendMessage({ to: channelID, message: output});

            });

        }

    });

}

console.log('[INFO] onMessage.js chargé.');

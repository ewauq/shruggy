module.exports = function(bot) {

    /**
     * Est exécuté chaque fois qu'un utilisateur (le bot compris) envoie un message.
     */
    bot.on("message", function(user, userID, channelID, message, event) {

        // Injection des propriétés personnalisées dans l'objet event qu'on renomme message.
        var message = require("../lib/event.js")(event, bot);


        /**
         * Filtrage des expressions blacklistées
         */

        message.filterMessage();

        /**
         *
         * Gestion des commandes
         *
         */

        if(message.isCommand()) {

            // Exécution de la commande.
            var command = require("../lib/command.js");

            command(message, function(output, error, params) {

                // Si la commande retourne une erreur, on la gère.
                if(error)
                    console.log(`[ERREUR] ${error}`);

                // Envoi du message s'il existe.
                if(output)
                    bot.sendMessage({ to: channelID, message: output }, function(error, response) {

                        if(error)
                            console.log(`[ERREUR] ${error}`);

                        var loading = new Date(new Date(response.timestamp).getTime() - message.timestamp).getTime();
                        console.log(`[COMMANDE] Commande exécutée en ${loading}ms.`);

                    });

            });

        }


        /**
         *
         * Gestion des dialogue
         *
         */

        var config = require("../config.json");

        // Le bot est en auto-réponse dans un salon paramétré dans config.json.
        // Dans les autres salons, il faut le mentionner à chaque fois.
        if( (channelID == config.auto_chat_channel || message.isBotMentioned() ) && !message.isCommand() && userID != bot.id) {


            try {

                    // TODO : Ingorer les emojis non pris en compte et les fichiers uploadés.

                    message.reply(function(output) {

                        if(output)
                            bot.sendMessage({ to: channelID, message: output, typing: true });

                    });

            }

            catch(e) {
                console.log(`[ERREUR] La réponse du bot a généré une erreur : ${e.message}`);
            }



        }

    });

};

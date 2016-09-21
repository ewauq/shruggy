module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "ping",

    description: "**${prefix}ping**  Retourne un ping, c'est tout.",

    triggers: [
        "ping"
    ],

    responses: [
        "Pong.",
        "Pong !",
        "PONG !",
        ":ping_pong:"
    ],


    /**
     * Exécution de la commande
     */

    exec: function(message, _callback) {

        this.output = null;
        this.error = null;

        // Exécution normale du code.
        try {

            var tools = require("../../lib/functions.js");
            this.output = tools.randomize(this.responses);

        }

        // Gestion des erreurs
        catch(e) {

            if(!this.responses) {
                this.error = `Les phrases de réponses de la commande <${this.name}> n'ont pas été trouvées.`;
            }
            else {
                this.error = `La commande <${this.name}> a provoqué une erreur : ${e.message}`;
            }

        }

        // Quoiqu'il arrive, on fait appel au callback.
        finally {

            _callback(this.output, this.error);

        }

    }

};

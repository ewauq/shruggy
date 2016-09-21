module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "coin",

    description: "**${prefix}pile ${prefix}face**  Lance une pièce et retourne le côté visible.",

    triggers: [
        "pile",
        "face"
    ],

    responses: [
        "Je lance une pièce... **PILE**.",
        "Je lance une pièce... **FACE**."
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

            var input = message.content.toLowerCase();
            var trigger = input.substr(1, input.length);
            var response = tools.randomize(this.responses);
            var state = (response.toLowerCase().indexOf(trigger) > -1)? "\nGagné ! :thumbsup::skin-tone-3:" : "\nPerdu...  :thumbsdown::skin-tone-3:" ;

            this.output = `${response} ${state}`;

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

module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "8ball",

    description: "**${prefix}8ball <question>**  Retourne une réponse sensée après avoir consulté sa boule magique.",

    triggers: [
        "8ball",
        "eball",
        "boullemagique"
    ],

    responses: [
        "Oui, surement.",
        "Absolument.",
        "Non, pas vraiment.",
        "Sans aucun doute.",
        "Hum, je ne pense pas.",
        "Jamais de la vie.",
        "Restons amis, je ne préfère pas répondre.",
        "Certainement pas, t'es fou !",
        "Jamais. JAMAIS T'ENTENDS?!",
        "Non, juste... non.",
        "Grave que oui !",
        "Ça me parait évident.",
        "C'est une évidence."
    ],

    triggers: [
        "8ball",
        "eball",
        "boullemagique"
    ],

    errors: [
        "Il me faut une phrase avec la commande mon ami.",
        "Ce serait bien avec une phrase, tu vois.",
        "Et la phrase qui va avec, elle s'est perdue ?",
        "Avec une phrase c'est mieux quand même."
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

            // Récupération du message.
            var input = message.content;

            // Récupération de la question.
            var matches = input.match(/\/[0-9a-z]+\s(.+)/);

            // Si la question est précisée.
            if(matches && matches.length > 0) {

                var mention = `<@${message.author_id}>`;
                var question = matches[1].capitalizeFirstLetter();
                var response = tools.randomize(this.responses);

                this.output = `${mention} ${question} : **${response}**`;
            }
            // Si la question n'est pas précisée.
            else {

                this.output = tools.randomize(this.errors);

            }

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

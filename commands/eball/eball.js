var command = {

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
   ]

};

exports.triggers = command.triggers;
exports.description = command.description;

/**
 * Retourne une phrase aléatoire.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var func = require('../../libs/functions.js');

        // Récupération du message.
        var message = event.d.content;

        // Récupération de la question.
        var matches = message.match(/\/[0-9a-z]+\s(.+)/);

        // Si la question est précisée.
        if(matches && matches.length > 0) {

            var mention = "<@" + event.d.author.id + ">";
            var question = matches[1].capitalizeFirstLetter();
            var response = func.randomize(command.responses);

            this.output = mention + " " + question + " : **" + response + "**";
        }
        // Si la question n'est pas précisée.
        else {

            this.output = func.randomize(command.errors);

        }

    }

    // Si le script rencontre une erreur, alors il la retourne.
    catch(e) {

        if(!command.responses) {
            this.error = "Les phrases de réponses de la commande <" + command.name + "> n'ont pas été trouvées.";
        }
        else {
            this.error = "La commande <" + command.name + "> a provoqué une erreur : " + e.message;
        }

    }

    // Quoiqu'il arrive on appelle le callback pour retourner les données.
    finally {
        callback(this.output, this.error);
    }

};

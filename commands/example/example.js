var command = {

    name: "example",

    triggers: [
        "example",
        "exemple"
    ],

    responses: [
        "Voici un exemple de réponse.",
        "Je suis une phrase de réponse.",
        "Voici une réponse..."
    ]

};

exports.triggers = command.triggers;

/**
 * Retourne le lien de l'avatar de l'utilisateur mentionné.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var _ = require('../../libs/functions.js');

        // On choisit aléatoirement une réponse parmi celles disponibles dans
        // la variable "responses".
        this.output = _.randomize(command.responses);

    }

    // Si le script rencontre une erreur, alors il la retourne.
    catch(e) {

        if(!command.responses) {
            this.error = `Les phrases de réponses de la commande <${command.name}> n'ont pas été trouvées.`;
        }
        else {
            this.error = `La commande <${command.name}> a provoqué une erreur : ${e.message}`;
        }

    }

    // Quoiqu'il arrive on appelle le callback pour retourner les données.
    finally {
        callback(this.output, this.error);
    }

};

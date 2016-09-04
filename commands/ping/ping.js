var command = {

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
    ]

};

exports.triggers = command.triggers;
exports.description = command.description;

/**
 * Retourne une phrase aléatoire pour la commande Ping.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var _ = require('../../libs/functions.js');

        this.output = _.randomize(command.responses);
    }

    // Si les réponses ne sont pas trouvées, on envoie une erreur.
    catch(e) {

        if(!command.responses) {
            this.error = `Les phrases de réponses de la commande <${command.name}> n'ont pas été trouvées.`;
        }
        else {
            this.error = `La commande <${command.name}> a provoqué une erreur : ${e.message}`;
        }

    }

    // Quoiqu'il arrive on appelle le callback.
    finally {
        callback(this.output, this.error);
    }

};

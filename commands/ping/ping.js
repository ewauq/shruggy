var triggers = [
    "ping"
]

var responses = [
    "Pong.",
    "Pong !",
    "PONG !",
    ":ping_pong:"
]

exports.triggers = triggers;

/**
 * Retourne une phrase aléatoire pour la commande Ping.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;
    this.name = "ping";

    // Exécution normale du code.
    try {

        var func = require('../../libs/functions.js');

        this.output = func.randomize(responses);
    }

    // Si les réponses ne sont pas trouvées, on envoie une erreur.
    catch(e) {

        if(!responses) {
            this.error = "Les phrases de réponses de la commande <" + this.name + "> n'ont pas été trouvées.";
        }
        else {
            this.error = "La commande <" + this.name + "> a provoqué une erreur : " + e.message;
        }

    }

    // Quoiqu'il arrive on appelle le callback.
    finally {
        callback(this.output, this.error);
    }

};

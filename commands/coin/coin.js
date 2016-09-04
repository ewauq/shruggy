var command = {

    name: "coin",

    description: "**${prefix}pile ${prefix}face**  Lance une pièce et retourne le côté visible.",

    triggers: [
        "flipcoin",
        "coinflip",
        "piece",
        "coin",
        "pile",
        "face",
        "pileouface"
    ],

    responses: [
        "Je lance une pièce... **PILE**.",
        "Je lance une pièce... **FACE**."
    ]

};

exports.triggers = command.triggers;
exports.description = command.description;

/**
 * Retourne la face d'une pièce (pile ou face).
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

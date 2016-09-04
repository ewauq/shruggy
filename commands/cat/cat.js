var command = {

    name: "cat",

    description: "**${prefix}cat ${prefix}chat**  Retourne une image aléatoire de chat.",

    triggers: [
        "cat",
        "chat",
        "chaton",
        "chatte",
        "kitten"
    ],

    responses: [
        null
    ]
};

exports.triggers = command.triggers;
exports.description = command.description;

/**
 * Retourne une image aléatoire de chat.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var _ = require('../../libs/functions.js');

        var json = JSON.parse(_.getFile("http://random.cat/meow"));

        this.output = json.file;

    }

    // Si le script rencontre une erreur, alors il la retourne.
    catch(e) {
        this.error = `La commande <${command.name}> a provoqué une erreur : ${e.message}`;
    }

    // Quoiqu'il arrive on appelle le callback pour retourner les données.
    finally {
        callback(this.output, this.error);
    }

};

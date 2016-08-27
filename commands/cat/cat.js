var command = {

    name: "cat",

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

/**
 * Retourne une image de chat aléatoire.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var func = require('../../libs/functions.js');

        var json = JSON.parse(func.getFile("http://random.cat/meow"));

        this.output = json.file;

    }

    // Si le script rencontre une erreur, alors il la retourne.
    catch(e) {
        this.error = "La commande <" + command.name + "> a provoqué une erreur : " + e.message;
    }

    // Quoiqu'il arrive on appelle le callback pour retourner les données.
    finally {
        callback(this.output, this.error);
    }

};

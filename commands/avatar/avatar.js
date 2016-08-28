var command = {

    name: "avatar",

    description: "**${prefix}avatar <@utilisateur>**  Retourne le lien de l'avatar de l'utilisateur mentionné.",

    triggers: [
        "avatar",
        "photo"
    ],

    responses: [
        "Voici l'avatar de **${username}** : ${url}"
    ],

    errors: [
        "J'ai besoin que tu mentionnes un utilisateur.",
        "Il me faut un utilisateur mentionné après la commande.",
        "Cette commande a besoin de la mention d'un utilisateur. ",
        "Cette commande nécessite la mention d'un utilisateur.",
        "Après la commande, j'ai besoin de la mention d'un utilisateur.",
        "J'ai besoin d'une mention avec cette commande.",
        "Tu as oublié de mentionner un utilisateur.",
        "Il faut préciser un utilisateur en le mentionnant."
    ]

};

exports.triggers = command.triggers;
exports.description = command.description;

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

        var func = require('../../libs/functions.js');

        // Si aucune mention n'est précisée.
        if(event.d.mentions.length == 0) {
            this.error = "La commande <" + command.name + "> a besoin d'un paramètre.";
            this.output = func.randomize(command.errors);
        }

        // Si la mention existe.
        // Si plusieurs mentions sont précisées, on ne prend que la première.
        else {

            // On récupère uniquement la première mention.
            var mention = event.d.mentions[0];

            // Préparation des données pour les littéraux.
            var data = {
                username: mention.username,
                url: "https://cdn.discordapp.com/avatars/" + mention.id + "/" + mention.avatar + ".jpg"
            };

            // Récupération d'une phrase aléatoire et remplacement des littéraux.
            this.output = func.randomize(command.responses).template(data);

        }

    }

    // Si les réponses ne sont pas trouvées, on envoie une erreur.
    catch(e) {

        if(!command.responses) {
            this.error = "Les phrases de réponses de la commande <" + command.name + "> n'ont pas été trouvées.";
        }
        else {
            this.error = "La commande <" + command.name + "> a provoqué une erreur : " + e.message;
        }

    }

    // Quoiqu'il arrive on appelle le callback.
    finally {
        callback(this.output, this.error);
    }

};

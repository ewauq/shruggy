var command = {

    name: "help",

    description: "**${prefix}help ${prefix}aide**  Retourne un message d'aide listant toutes les commandes disponibles.",

    triggers: [
        "aide",
        "info",
        "infos",
        "help"
    ],

    responses: [
        "Pour l'instant je ne suis pas très évolué, un peu comme les humains, mais j'apprends vite.\n\nVoilà ce que je sais faire :\n\n${command_list}\nVoilà, et à part ça, mon but ultime est de dominer le monde, mais ça tout le monde sait déjà."
    ]

};

exports.triggers = command.triggers;
exports.description = command.description;

/**
 * Retourne un message d'aide à l'utilisateur qui utilise la commande.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output = "";
    this.error;

    // Exécution normale du code.
    try {

        var _ = require('../../libs/functions.js');
        var config = require('../../config.json');

        var fs = require('fs');

        var command_list = "";

        // Liste des commandes du bot.
        var commands = fs.readdirSync("./commands");

        // Pour chaque commande présente, on récupère sa description.
        for(var i in commands) {

            var cmd = require(`${__dirname}/../${commands[i]}/${commands[i]}.js`);

            if(cmd.description)
                command_list = command_list + cmd.description.template({ prefix: config.command_prefix }) + "\n";

        }

        this.output = _.randomize(command.responses).template({ command_list });

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

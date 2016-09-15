module.exports = {

    /**
     * Paramètres de la commande.
     */

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
    ],


    /**
     * Exécution de la commande
     */

    exec: function(message, _callback) {

        this.output = null;
        this.error = null;

        // Exécution normale du code.
        try {

            var tools = require("../lib/functions.js");
            var config = require("../config.json");
            var fs = require('fs');

            var command_list = "";

            // Liste des commandes du bot.
            var commands = fs.readdirSync("./commands");

            // Pour chaque commande présente, on récupère sa description.
            for(var i in commands) {

                var cmd = require(`./${commands[i]}`);

                if(cmd.description)
                    command_list = command_list + cmd.description.template({ prefix: config.command_prefix }) + "\n";

            }

            this.output = tools.randomize(this.responses).template({ command_list });

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

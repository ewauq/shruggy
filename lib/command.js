/**
 * Exécute la commande passée en paramètre.
 * @param  {object} command L'objet complet de la commande envoyée.
 * @return {function} _callback Callback contenant le message retourné.
 */
module.exports = function(message, _callback) {

    require("./functions.js");

    // JS est sensible à la casse.
    var input = message.content.toLowerCase();

    // Récupération de la commande et de ses arguments.
    var matches = input.match(/\/([0-9a-z]+)(\s.+)?/);

    // Récupération des données de la commande.
    var trigger = matches[1];
    var argument = matches[2], argument = (argument)? argument.trim() : null ;

    // Repère pour le message d'erreur (commande inconnue).
    var found = false;

    // On va parcourir tous les commandes du bot et chercher une
    // correspondance avec la commande envoyée.
    var fs = require('fs');

    // Liste des commandes du bot.
    var commands = fs.readdirSync(`${__dirname}/../commands/`);

    // Pour chaque commande présente, on vérifie si elle est connue.
    commands.forEach(function(command) {

        // Si une correspondance a déjà été trouvée, on sort de la boucle.
        if(found)
            return;

        var cmd = require(`${__dirname}/../commands/${command}/${command}.js`);

        // On cherche la commande dans les triggers.
        if(trigger.in(cmd.triggers)) {

            // La commandé est marquée comme trouvée.
            found = true;

            // Si on a trouvé la commande dans les triggers, on l'exécute.
            console.log(`[COMMANDE] Exécution de la commande <${trigger}>...`);

            // On passe message à la fonction afin de récupérer tous les détails
            // du message (contenu, mentions, etc...).
            cmd.exec(message, function(output, error, params) {
                _callback(output, error, params);
            });

        }

    });

    // Si la commande n'a pas été trouvée, on le signale par un message d'erreur.
    if(!found)
        console.log(`[ERREUR] La commande <${trigger}> est inconnue.`);

};

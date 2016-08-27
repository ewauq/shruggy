/**
 * Exécute la commande passée en paramètre.
 * @param  {object} event L'objet complet du message.
 * @return {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    // JS est sensible à la casse.
    message = event.d.content.toLowerCase();

    // Si le paramètre n'est pas renseigné.
    if(!message) {
        console.log("[ERREUR] Command.run() a besoin d'un paramètre.");
        return;
    }

    // Récupération de la commande et de ses arguments.
    var matches = message.match(/\/([0-9a-z]+)(\s.+)?/);

    // On vérifie que la commande comporte plus que son préfixe.
    if(message.length <= 1 || !matches)
        return;

    // Récupération du nom de la commande.
    var name = matches[1];

    // Repère pour le message d'erreur (commande inconnue).
    var found = false;

    // On va parcourir tous les commandes du bot et chercher une
    // correspondance avec la commande envoyée.
    var fs = require('fs');

    // Liste des commandes du bot.
    var commands = fs.readdirSync(__dirname + '/../commands/');

    // Pour chaque commande présente, on vérifie si elle est connue.
    commands.forEach(function(command) {

        // Si une correspondance a déjà été trouvée, on sort de la boucle.
        if(found)
            return;

        var cmd = require(__dirname + `/../commands/${command}/${command}.js`);

        // On cherche la commande dans les triggers.
        if(name.in(cmd.triggers)) {

            // La commandé est marquée comme trouvée.
            found = true;

            // Si on a trouvé la commande dans les triggers, on l'exécute.
            console.log("[COMMANDE] Exécution de la commande <" + name + "> :");

            // On passe event à la fonction afin de récupérer tous les détails
            // du message (contenu, mentions, etc...).
            cmd.run(event, function(output, error) {
                callback(output, error);
            });

        }

    });

    // Si la commande n'a pas été trouvée, on le signale par un message d'erreur.
    if(!found)
        console.log("[ERREUR] La commande <" + name + "> est inconnue.");

};

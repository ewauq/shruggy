var command = {

    name: "help",

    triggers: [
        "aide",
        "info",
        "infos",
        "help"
    ],

    responses: [
        "Pour l'instant je ne suis pas très évolué, un peu comme les humains, mais j'apprends vite.\n\nVoilà ce que je sais faire : \n\n- **/ping** permet d'envoyer un ping, facilement compréhensible par les humains.\n- **/8ball <phrase>** permet de savoir ce que je vois dans ma boule magique, ooooh !\n- **/cat /chat /chatte** permet d'afficher une photo de chat trop pipou (uniquement de chat, oui).\n- **/steam /steamstatus** permet d'afficher le statut du magasin de Steam.\n- **/aww** retourne l'image du meilleur post de /r/aww/ de ces dernières 24h.\n- **/players /joueurs <nom d'un jeu>** retourne le nombre de joueurs en ligne via Steam.\n- **/loutre /otter** retourne une image aléatoire de loutre.\n\nVoilà, et à part ça, mon but ultime est de dominer le monde, mais ça tout le monde sait déjà."
    ]

};

exports.triggers = command.triggers;

/**
 * Retourne un message d'aide à l'utilisateur qui utilise la commande.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var func = require('../../libs/functions.js');

        this.output = func.randomize(command.responses);

    }

    // Si le script rencontre une erreur, alors il la retourne.
    catch(e) {

        if(!command.responses) {
            this.error = "Les phrases de réponses de la commande <" + command.name + "> n'ont pas été trouvées.";
        }
        else {
            this.error = "La commande <" + command.name + "> a provoqué une erreur : " + e.message;
        }

    }

    // Quoiqu'il arrive on appelle le callback pour retourner les données.
    finally {
        callback(this.output, this.error);
    }

};

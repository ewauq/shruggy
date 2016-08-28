var command = {

    name: "aww",

    description: "**${prefix}aww**  Retourne le sujet le plus populaire de /r/aww des dernières 24h.",

    triggers: [
        "aww",
        "awww",
        "awwww",
        "awwwww",
        "awwwwww"
    ],

    responses: [
        "Le meilleur post du jour sur reddit.com/r/aww (_${score} votes_) : **${title}** ${url}"
    ]

};

exports.triggers = command.triggers;
exports.description = command.description;

/**
 * Retourne le sujet le plus populaire de /r/aww des dernières 24h.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var func = require('../../libs/functions.js');

        var json = JSON.parse(func.getFile("https://www.reddit.com/r/aww/top.json?limit=1"));

        // Préparation des données pour les littéraux.
        var data = {
            title: json.data.children[0].data.title,
            score: json.data.children[0].data.score,
            url: json.data.children[0].data.url
        }

        // Récupération d'une phrase aléatoire et remplacement des littéraux.
        // Remplace également le caractère html &amp; en &.
        this.output = func.randomize(command.responses).template(data).replace(/&amp;/g, "&");

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

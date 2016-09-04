var command = {

    name: "otter",

    description: "**${prefix}otter ${prefix}loutre**  Retourne une image aléatoire de loutre.",

    triggers: [
        "loutre",
        "loutres",
        "otters",
        "otter",
        "oter"
    ],

    responses: [
        null
    ]

};

exports.triggers = command.triggers;
exports.description = command.description;

/**
 * Retourne une image aléatoire de loutre parmi 600 disponibles sur imgur.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var q = "otter";

        var page = Math.floor(Math.random() * 10);
        var image = Math.floor(Math.random() * 60);

        // Récupération des résultats au format JSON.
        var url = "https://api.imgur.com/3/gallery/search/top/all/" + page + "/?q=" + q;
        var clientID = "31574b3a9c65e38";

        var mod = require('xmlhttprequest');
        var req = new mod.XMLHttpRequest();
        req.open("GET", url, false);
        req.setRequestHeader('Authorization', "Client-ID " + clientID);
        req.send(null);

        var data = JSON.parse(req.responseText);

        // Récupération de l'image aléatoire.
        this.output = data.data[image].link;

        // On privilégie le gifv plutôt que le gif.
        if(data.data[image].gifv)
            this.output = data.data[image].gifv;

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

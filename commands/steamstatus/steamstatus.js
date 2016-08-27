var command = {

    name: "steamstatus",

    triggers: [
        "steam",
        "steamstatus",
        "steamstore",
        "steamstorestatus"
    ],

    responses: [
        ":white_check_mark:  Le magasin Steam est **en ligne** (${ping}ms).",
        ":x:  Le magasin Steam est actuellement en **hors ligne**.",
        "Satus du magasin Steam inconnu : ${error}"
    ]

};

exports.triggers = command.triggers;

/**
 * Retourne si le Store de Steam est disponible ou non.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var func = require('../../libs/functions.js');

        var json = JSON.parse( func.getFile("https://steamgaug.es/api/v2") );

        // Préparation des données pour les littéraux.
        var data = {
            ping: json.SteamStore.time,
            error: json.SteamStore.error
        }

        switch (json.SteamStore.online) {
            // Si le store est en ligne.
            case 1:
                this.output = command.responses[0].template(data);
            break;
            // Si le store est hors ligne.
            case 2:
                this.output = command.responses[1];
            break;
            // Si l'api rencontre une erreur.
            default:
                this.output = command.responses[2].template(data);
        }


    }

    // Si le script rencontre une erreur, alors il la retourne.
    catch(e) {

        if(!responses) {
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

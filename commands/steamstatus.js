module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "steamstatus",

    description: "**${prefix}steam ${prefix}steamstore**  Retourne si le Store de Steam est disponible ou non.",

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

            // Récupération du contenu de la page.
            var http = require('xmlhttprequest');
            var req = new http.XMLHttpRequest();

            var url = "https://steamgaug.es/api/v2";

            req.open("GET", url, false);
            req.timeout = 10000;

            req.ontimeout = function () {
                this.output = "timeout";
            }

            req.send(null);

            // Récupération des données recherchées
            if(req.responseText) {
                var response = JSON.parse(req.responseText);

                var data = {
                    ping: response.SteamStore.time,
                    error: response.SteamStore.error
                };

                switch (response.SteamStore.online) {
                    // Si le store est en ligne.
                    case 1:
                        this.output = this.responses[0].template(data);
                    break;
                    // Si le store est hors ligne.
                    case 2:
                        this.output = this.responses[1];
                    break;
                    // Si l'api rencontre une erreur.
                    default:
                        this.output = this.responses[2].template(data);
                }

            }
            else {
                this.error = "Un problème avec l'API Reddit a été détecté.";
            }

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

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

            var tools = require("../../lib/functions.js");

            // On préserve this dans that.
            var that = this;

            tools.get({
                    protocol: "https",
                    host: "steamgaug.es",
                    path: `/api/v2`
                },
                function(data, error) {

                    if(error)
                        console.log(`[ERREUR] Un problème avec l'API Reddit a été détecté : ${error}`);

                    // Si aucune donnée n'est retournée, on s'arrête ici.
                    if(!data)
                        return;

                    var response = JSON.parse(data);

                    // Récupération des données.
                    var data = {
                        ping: response.SteamStore.time,
                        error: response.SteamStore.error
                    };

                    switch (response.SteamStore.online) {
                        // Si le store est en ligne.
                        case 1:
                            that.output = that.responses[0].template(data);
                        break;
                        // Si le store est hors ligne.
                        case 2:
                            that.output = that.responses[1];
                        break;
                        // Si l'api rencontre une erreur.
                        default:
                            that.output = that.responses[2].template(data);
                    }

                    _callback(that.output , null);

                }
            );

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

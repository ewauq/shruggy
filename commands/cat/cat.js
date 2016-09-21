module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "cat",

    description: "**${prefix}cat ${prefix}chat**  Retourne une image aléatoire de chat.",

    triggers: [
        "cat",
        "chat",
        "chaton",
        "chatte",
        "kitten"
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
                    protocol: "http",
                    host: "random.cat",
                    path: `/meow`
                },
                function(data, error) {

                    if(error)
                        console.log(`[ERREUR] Un problème avec l'API random.cat a été détecté : ${error}`);

                    // Si aucune donnée n'est retournée, on s'arrête ici.
                    if(!data)
                        return;

                    var response = JSON.parse(data);

                    // Récupération du lien de l'image.
                    that.output = response.file;

                    _callback(that.output , null);

                }
            );

        }

        // Gestion des erreurs
        catch(e) {

            this.error = `La commande <${this.name}> a provoqué une erreur : ${e.message}`;

        }

        // Quoiqu'il arrive, on fait appel au callback.
        finally {

            _callback(this.output, this.error);

        }

    }

};

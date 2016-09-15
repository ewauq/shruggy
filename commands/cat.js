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

            var tools = require("../lib/functions.js");

            // Récupération du contenu de la page.
            var http = require('xmlhttprequest');
            var req = new http.XMLHttpRequest();

            var url = "http://random.cat/meow";

            req.open("GET", url, false);
            req.timeout = 10000;

            req.ontimeout = function () {
                this.output = "timeout";
            }

            req.send(null);

            // Récupération des données recherchées
            if(req.responseText) {
                var response = JSON.parse(req.responseText);

                // Récupération d'une phrase aléatoire et remplacement des littéraux.
                // Remplace également le caractère html &amp; en &.
                this.output = response.file;

            }
            else {
                this.error = "Un problème avec l'API random.cat a été détecté.";
            }


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

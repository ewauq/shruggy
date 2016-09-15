module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "otter",

    description: "**${prefix}otter ${prefix}loutre**  Retourne une image aléatoire de loutre.",

    triggers: [
        "loutre",
        "loutres",
        "otters",
        "otter",
        "oter"
    ],


    /**
     * Exécution de la commande
     */

    exec: function(message, _callback) {

        this.output = null;
        this.error = null;

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

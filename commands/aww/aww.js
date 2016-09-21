module.exports = {

    /**
     * Paramètres de la commande.
     */

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
     "Le meilleur post du jour sur le subreddit /r/aww (_${score} votes_) : \n\n:small_blue_diamond: **${title}** : ${url}"
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
                    host: "www.reddit.com",
                    path: `/r/aww/top.json?limit=1`
                },
                function(data, error) {

                    if(error)
                        console.log(`[ERREUR] Un problème avec l'API Reddit a été détecté : ${error}`);

                    // Si aucune donnée n'est retournée, on s'arrête ici.
                    if(!data)
                        return;

                    var response = JSON.parse(data);

                    var data = {
                        title: response.data.children[0].data.title,
                        score: response.data.children[0].data.score,
                        url: response.data.children[0].data.url
                    };

                    // Récupération d'une phrase aléatoire et remplacement des littéraux.
                    // Remplace également le caractère html &amp; en &.
                    that.output = tools.randomize(that.responses).template(data).replace(/&amp;/g, "&");

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

module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "podcasts",

    timer: 600000,

    output_channel: "213255127933517824",

    responses: [
        "🎙  Nouveau podcast de ${name} : **${title}** > ${url}"
    ],


    /**
     * Exécution de la commande
     */

    exec: function(_callback) {

        this.output = {
            message: null,
            channelID: this.output_channel
        };
        this.error;

        // Exécution normale du code.
        try {

            var podcasts = require('./podcasts.json');
            var filename = `${ __dirname}/podcasts.json`;
            var tools = require('../../lib/functions.js');


            /**
             * SOUNDCLOUD
             */
            var watchlist = podcasts.soundcloud.watchlist;

            // On liste les éléments de la watchlist.
            for(var i in watchlist) {

                // Récupération simplifiée des infos du podcast.
                var podcast = watchlist[i];

                // Préparation des littéraux.
                var info = {
                    podcast_id: podcast.id,
                    client_id: podcasts.soundcloud.client_id
                };

                // Création de l'url d'API.
                var url = podcasts.soundcloud.api_url.template(info);

                // Récupération du dernier podcast.
                var http = require('xmlhttprequest');
                var req = new http.XMLHttpRequest();

                req.open("GET", url, false);
                req.timeout = 10000;

                req.ontimeout = function () {
                    this.output = "timeout";
                }

                req.send(null);

                // Récupération des données recherchées
                if(req.responseText) {

                    var json = JSON.parse(req.responseText);

                    // S'il n'y a rien retourné.
                    if(!json)
                        continue;

                    // Récupération des infos du dernier podcast en date.
                    var track = {
                        id: json[0].id,
                        title: json[0].title,
                        url: json[0].permalink_url,
                        date: json[0].last_modified
                    }

                    // Si le dernier podcast n'est pas connu, on le poste et on l'ajoute à "last".
                    if(!podcast.last || (track.id != podcast.last) ) {

                        var info = {
                            name: podcast.name,
                            title: track.title,
                            url: track.url
                        };

                        this.output.message = tools.randomize(this.responses).template(info);

                        console.log(`[INFO] Nouveau podcast détecté. Last ID: ${podcast.last} | New ID: ${track.id}`);

                        podcast.last = track.id;

                        // Réécriture du fichier podcasts.json.
                        var fs = require('fs');
                        fs.writeFile(filename, JSON.stringify(podcasts, null, 4), function(err) {
                            if(err)
                              console.log(err);
                        });

                        break;

                    }
                    // Si on ne trouve rien, on vide this.output.
                    else {
                        this.output.message = null;
                    }

                }

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

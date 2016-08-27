var task = {
    name: "podcasts",
    timer: 600000,
    output_channel: "218689835886444547",
    responses: [
        ":microphone2:  Nouveau podcast de ${name} : **${title}** > ${url}",
        ":microphone2:  ${name} vient de publier un nouveau podcast : **${title}** > ${url}",
        ":microphone2:  ${name} vient de mettre en ligne un podcast : **${title}** > ${url}"
    ]
};

exports.timer = task.timer;

/**
 * Retourne le lien du dernier podcast disponible et non connu de podcasts.json.
 *
 * Uniquement pour Soundcloud.
 *
 * @param  {function} callback Callback contenant le message de retour.
 */
exports.run = function(callback) {

    this.output = {
        message: null,
        channelID: task.output_channel
    };
    this.error;

    // Exécution normale du code.
    try {

        var podcasts = require('./podcasts.json');
        var filename = __dirname + '/podcasts.json';
        var func = require('../../libs/functions.js');

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
            var json = JSON.parse( func.getFile(url) );

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
            if(!podcast.last || track.id != podcast.last) {

                var info = {
                    name: podcast.name,
                    title: track.title,
                    url: track.url
                };

                this.output.message = func.randomize(task.responses).template(info);

                console.log(this.output.message);

                podcast.last = track.id;

                // Réécriture du fichier podcasts.json.
                func.writeJSON(filename, podcasts);

                break;

            }
            // Si on ne trouve rien, on vide this.output.
            else {
                this.output.message = null;
            }

        }

    }

    // Si les réponses ne sont pas trouvées, on envoie une erreur.
    catch(e) {
        this.error = "La commande <" + this.name + "> a provoqué une erreur : " + e.message;
    }

    // Quoiqu'il arrive on appelle le callback.
    finally {
        callback(this.output, this.error);
    }

}

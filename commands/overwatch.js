module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "overwatch",

    description: "**${prefix}overwatch ${prefix}ow <battletag-id>**  Retourne le profil Overwatch de l'utilisateur spécifié.",

    triggers: [
        "ow",
        "overwatch"
    ],

    responses: [
        "Voici le profil Overwatch de **${username}** : \n\n${profile}",
        "Voilà le profil Overwatch de  **${username}** : \n\n${profile}"
    ],

    profile: [
        "```py\n",
        "Niveau : ${level}\n",

        "\n",

        "@ Match rapide :\n",
        "- Temps de jeu : ${quickmatch.hours}\n",
        "- Parties gagnées : ${quickmatch.wins}\n",

        "\n",

        "@ Compétitif :\n",
        "- Rang : ${ranked.rank}\n",
        "- Temps de jeu : ${ranked.hours}\n",
        "- Parties gagnées : ${ranked.wins} / ${ranked.played} soit ${ranked.winsratio}%\n",
        "```"
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

            // Récupération du message.
            var input = message.content;

            // Récupération du nom du jeu.
            var matches = input.match(/\/[0-9a-z]+\s(.+)/);

            // On vérifie que le paramètre est spécifié.
            if(matches && matches[1].length > 0) {

                // Récupération du Battletag.
                var battletag = matches[1].capitalizeFirstLetter();
                battletag = battletag.replace(/#/, "-");

                // Récupération du contenu de la page.
                var http = require('xmlhttprequest');
                var req = new http.XMLHttpRequest();

                var url = `https://api.lootbox.eu/pc/eu/${battletag}/profile`;

                req.open("GET", url, false);
                req.timeout = 10000;

                req.ontimeout = function () {
                    this.output = "timeout";
                }

                req.send(null);

                // Récupération des données recherchées
                if(req.responseText) {
                    var json = JSON.parse(req.responseText);


                    if(json.statusCode == 404) {
                        this.output = "Je n'ai rien trouvé pour ce BattleTag. Vérifie s'il y a des majuscules dans le pseudo."
                        return;
                    }


                    // Création du message.
                    var profile = new String();

                    for(var i in this.profile)
                        profile = profile + this.profile[i];




                    var data = {
                        level: (json.data.level)? json.data.level : "-",
                        quickmatch: {
                            hours: (json.data.playtime.quick)? json.data.playtime.quick.replace(" hours", " heures") : "-",
                            wins: (json.data.games.quick.wins)? json.data.games.quick.wins : "-"
                        },
                        ranked: {
                            rank: (json.data.competitive.rank)? json.data.competitive.rank : "-",
                            hours: (json.data.playtime.competitive)? json.data.playtime.competitive.replace(" hours", " heures") : "-" ,
                            wins: (json.data.games.competitive.wins)? json.data.games.competitive.wins : "-" ,
                            played: (json.data.games.competitive.played)? json.data.games.competitive.played : "-" ,
                            winsratio: (json.data.games.competitive.played)? Math.floor( (json.data.games.competitive.wins * 100) / json.data.games.competitive.played ) : "-"
                        }
                    };



                    var data = {
                        username: json.data.username,
                        profile: profile.template(data)
                    };

                    // Récupération d'une phrase aléatoire et remplacement des littéraux.
                    this.output = tools.randomize(this.responses).template(data);

                }
                else {
                    this.error = "Un problème avec l'API Lootbox.eu a été détecté.";
                }

            }
            else {
                this.output = "Il faut indiquer le Battletag complet, exemple _Kazaam-1895_.";
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

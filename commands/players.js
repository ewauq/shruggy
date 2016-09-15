module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "players",

    description: "**${prefix}players ${prefix}joueurs <nom d'un jeu>**  Retourne le nombre de joueurs en ligne sur Steam d'un jeu demandé.",

    triggers: [
        "joueur",
        "joueurs",
        "player",
        "players"
    ],

    responses: [
        "🎮  **${game}** a actuellement **${players}** joueurs en ligne.",
        "🎮  Il y a acutellement **${players}** joueurs sur **${game}**.",
        "🎮  **${players}** joueurs sont acutellement sur **${game}**.",
        "🎮  On compte actuellement **${players}** joueurs en ligne sur **${game}**.",
        "🎮  Il y a **${players}** joueurs en ligne sur **${game}**.",
        "🎮  **${players}** personnes jouent en ce moment à **${game}**.",
        "🎮  En ce moment, on compte **${players}** joueurs sur **${game}**."
    ],

    error_empty: [
        "J'ai besoin du nom précis d'un jeu.",
        "Sans un nom de jeu, je ne pourrais pas t'aider.",
        "Il me faut le nom d'un jeu après la commande.",
        "Je ne peux pas trouver d'infos si tu ne me donnes pas un jeu.",
        "Avec le nom d'un jeu c'est mieux.",
        "En principe, on me donne le nom d'un jeu avec cette commande."
    ],

    error_data_not_found: [
        "Le nombre de joueurs n'est pas disponible pour ce jeu sur SteamDB.",
        "Le total de joueurs en ligne pour ce jeu semble avoir été désactivé sur SteamDB."
    ],

    error_no_result: [
        "Désolé, mais je n'ai rien trouvé avec ce titre.",
        "Je n'ai rien trouvé avec ce nom, désolé.",
        "Ce titre de jeu ne retourne aucune information.",
        "Ce nom n'existe pas dans ma base de données."
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
            var input = message.content.toLowerCase();

            // Récupération du nom du jeu.
            var matches = input.match(/\/[0-9a-z]+\s(.+)/);

            // On préserve les propriétés de la commande.
            var that = this;

            // On vérifie que le paramètre est spécifié.
            if(matches && matches[1].length > 0) {


                /**
                 * Fonctions de récupération des données SteamDB.
                 * @return {string} str Le nombre de joueurs en ligne.
                 */
                var steamdb = function() {

                    // Chargement des modules.
                    var osmosis = require('osmosis');
                    var tools = require("../lib/functions.js");
                    require("string_score");

                    this.search = function(keywords, _callback) {

                        /**
                         * Recherche des jeux et récupération des résultats.
                         */

                        var search_url = `https://steamdb.info/search/?a=app&q=${keywords}&type=1&category=0`;

                        osmosis.get(search_url)
                        .set([
                            osmosis
                            .find("table#table-sortable tr.app")
                            .set("title", "td[3]/text()")
                            // .set("url", function(context, data) {
                            //     return "https://steamdb.info/app/" + context.querySelector("td[1]/a/text()")
                            // })
                            .set("id", "td[1]/a/text()")
                            .set("last_update", "td[4]/text()")
                        ])
                        .data(function(data) {

                            // S'il n'y a aucun résultat, on sort immédiatement.
                            if(!data || data.length == 0)
                                return;

                            var games = data;
                            var blacklist = ["dedicated server", "beta", "press", "nvidia", "nvida", "age rating", "ps3", "xbox", "ps4"];
                            var words = keywords.split(' ');

                            // Filtrage des résultats pour ne garder que ce qu'on recherche.
                            // On supprime les termes non voulus et on ne garde que les temes complets.
                            games = tools.filter(games, blacklist, "title").unmatched;
                            games = tools.filter(games, words, "title").matched;

                            // On ajoute le paramètre keywords filtré à l'objet games.

                            // La blacklist sert à affiner au mieux le score de recherche en supprimant
                            // les mots clés non utiles.
                            var keywords_blacklist = ["Sid Meier\'s", "Tom Clancy\'s", "Clive Barker\'s"];

                            for(var i in games) {

                                games[i].keywords = games[i].title;

                                // On supprime les mots clés inutiles.
                                for(var x in keywords_blacklist)
                                    games[i].keywords = games[i].keywords.replace(keywords_blacklist[x], "");

                                games[i].keywords = games[i].keywords.replace(/[^a-zA-Z0-9]/g, " ");
                                games[i].keywords = games[i].keywords.replace(/\s+/g, " ");
                                games[i].keywords = games[i].keywords.toLowerCase().trim();

                            }

                            // On formate la date de dernière mise à jour vers un timestamp plus facile à trier.
                            for(var i in games) {

                                var matches = games[i].last_update.match(/([A-Za-z]+)\s([0-9]+),\s([0-9]+)\s[–]\s([0-9]+):([0-9]+):([0-9]+)\sUTC/);

                                var date = {
                                    year: matches[3],
                                    month: new Date(Date.parse(matches[1] +" 1, 2000")).getMonth(),
                                    day: matches[2],
                                    hour: matches[4],
                                    minutes: matches[5],
                                    secondes: matches[6]
                                };

                                date = new Date(date.year, date.month, date.day, date.hour, date.minutes, date.secondes).getTime();
                                date = date.toString();
                                date = date.substring(0, date.length - 3); // getTime() retourne trois zéros en trop à la fin.

                                games[i].last_update = date;

                            }

                            // Calcul du score de matching.
                            for(var i in games)
                                games[i].score = games[i].keywords.score(keywords, 1).toFixed(3);


                            // On cherche le meilleur score de matching.
                            var best_score = 0;
                            for(var i in games)
                                best_score = (games[i].score > best_score)? games[i].score : best_score ;

                            // On récupère le(s) meilleur(s) résultat(s).
                            var best_results = [];
                            for(var i in games)
                                if(games[i].score == best_score) best_results.push(games[i]);

                            // On trie les résultats par date de mise à jour.
                            best_results.sort(function(a, b) {
                                return a.last_update - b.last_update;
                            });

                            var selected = best_results.slice(-1)[0];

                            var error = null;

                            _callback(selected);

                        })
                        .error(function() {
                            _callback(false);
                        });

                    };

                    this.getPlayers = function(game_id, _callback) {

                        // Récupération des infos via le module osmosis
                        var osmosis = require('osmosis');

                        // Récupération des joueurs du meilleur résultat.
                        osmosis.get(`https://steamdb.info/app/${game_id}/`)
                        .find('#js-graphs-button')
                        .set('players', ".")
                        .data(function(data) {
                            _callback(data.players.match(/([0-9,]+)/)[1]);
                        })
                        .error(function() {
                            // Si le nombre de joueur n'est pas trouvé, on retourne false.
                            _callback(false);
                        });

                    }

                };


                /**
                 * Récupération des données SteamDB.
                 */
                var steamdb = new steamdb();

                steamdb.search(matches[1], function(game) {

                    // Si aucun jeu n'est trouvé, on envoie la réponse d'erreur et on arrête le script.
                    if(!game) {
                        console.log(`[ERREUR] La recherche SteamDB n'a rien trouvé.`);
                        this.output = tools.randomize(that.error_no_result);
                        _callback(this.output, this.error);
                        return;
                    }

                    // Si un jeu est trouvé.
                    steamdb.getPlayers(game.id, function(players) {

                        // Si le jeu existe et qu'il a des joueurs.
                        if(players) {

                            console.log("[COMMANDE] Données récupérées depuis SteamDB :");
                            console.log(game);

                            // Préparation des données pour les littéraux.
                            var data = {
                                game: game.title,
                                players: players
                            }

                            // Récupération d'une phrase aléatoire et remplacement des littéraux.
                            this.output = tools.randomize(that.responses).template(data);

                        }

                        // Si le nombre de joueurs n'est pas trouvé.
                        else {
                            this.output = tools.randomize(that.error_no_result);
                        }

                        _callback(this.output, this.error);

                    });

                });

            }
            else {
                this.output = tools.randomize(that.error_empty);
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

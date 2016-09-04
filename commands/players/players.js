var command = {

    name: "players",

    description: "**${prefix}players ${prefix}joueurs <nom d'un jeu>**  Retourne le nombre de joueurs en ligne sur Steam d'un jeu demandé.",

    triggers: [
        "joueur",
        "joueurs",
        "player",
        "players"
    ],

    responses: [
        ":information_source:  **${game}** a actuellement **${players}** joueurs en ligne.",
        ":information_source:  Il y a acutellement **${players}** joueurs sur **${game}**.",
        ":information_source:  **${players}** joueurs sont acutellement sur **${game}**.",
        ":information_source:  On compte actuellement **${players}** joueurs en ligne sur **${game}**."
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
        "Désolé, mais je n'ai rien trouvé avec ce titre. Essayez un titre plus précis...",
        "Je n'ai rien trouvé avec ce nom, désolé. Essayez un titre plus précis...",
        "Ce titre de jeu ne retourne aucune information. Essayez un titre plus précis...",
        "Ce nom n'existe pas dans ma base de données. Essayez un titre plus précis..."
    ]

};

exports.triggers = command.triggers;
exports.description = command.description;

/*
    TODO
    - Améliorer le matching en ajoutant la date de dernière update de l'App.

    Cette fonction utilise le moteur de recherche de SteamDB. Il se peut que
    les résultats soient difficiles à obtenir si certains mots clés sont
    manquants ou dans le mauvais ordre.

    Plusieurs App Steam peuvent avoir le même nom ce qui peut donner lieu à
    des petites erreurs lors de l'exécution de la commande. La fonction peut
    retourner des pages "fantômes" laissées à l'abandon par leurs développeurs.
 */

/**
 * Retourne le nombre de joueurs Steam d'un jeu demandé.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;

    // Exécution normale du code.
    try {

        var _ = require('../../libs/functions.js');

        // Récupération du message.
        var message = event.d.content.toLowerCase();

        // Récupération du nom du jeu.
        var matches = message.match(/\/[0-9a-z]+\s(.+)/);

        // On vérifie que le paramètre est spécifié.
        if(matches && matches[1].length > 0) {

            // Récupération des données du jeu recherché.
            getSteamDBData(matches[1], function(data, error) {

                // S'il n'y a pas d'erreur.
                if(!error && data.players) {

                    // Préparation des données pour les littéraux.
                    var data = {
                        game: data.title,
                        players: data.players
                    }

                    // Récupération d'une phrase aléatoire et remplacement des littéraux.
                    this.output = _.randomize(command.responses).template(data);

                }

                // S'il y a une erreur.
                else {
                    this.output = _.randomize(command.error_no_result);
                    this.error = error;
                }

                callback(this.output, this.error);
            })

        }
        else {
            this.output = _.randomize(command.error_empty);

            callback(this.output, this.error);
        }

    }

    // Si le script rencontre une erreur, alors il la retourne.
    catch(e) {

        if(!command.responses) {
            this.error = `Les phrases de réponses de la commande <${command.name}> n'ont pas été trouvées.`;
        }
        else {
            this.error = `La commande <${command.name}> a provoqué une erreur : ${e.message}`;
        }

    }


    /* ===========================================================

        FONCTIONS

     =========================================================== */


     /**
      * Retourne le jeu le plus proche des critères de recherche.
      * @param  {string} str Les mots clés.
      * @param  {function} onSuccess Callback contenant les infos du jeu.
      */
    function getBestMatching(str, onSuccess) {

        require("string_score");

        // Récupération des infos via le module osmosis
        var osmosis = require('osmosis');

        osmosis.get("https://steamdb.info/search/?a=app&q="+ str +"&type=1&category=0")
        .set([
            osmosis
            .find('table#table-sortable tr.app')
            .set('title', 'td[3]/text()')
            .set('url', function(context, data) {
                return "https://steamdb.info/app/" + context.querySelector('td[1]/a/text()')
            })
            .set('score', function(context, data) {
                // On calcule un score de correspondance entre le titre du jeux
                // et les mots clés de la recherche. On limite le score à 3 chiffres
                // après la virgule.
                return data.object.title.toLowerCase().score(str).toFixed(3);
            })
        ])
        .data(function(data) {

            // S'il n'y a aucun résultat, on sort immédiatement.
            if(!data || data.length == 0)
                return;

            var games = data;
            var blacklist = ["dedicated server", "beta", "press", "nvidia", "nvida", "age rating", "ps3", "xbox", "ps4"];
            var words = str.split(' ');

            // Filtrage des résultats pour ne garder que ce qu'on recherche.
            //
            // Suppression des jeux dont des termes sont blacklistés.
            games = _.filter(games, blacklist, "title").included;

            // Récupération des titres contenant les mots complets recherchés.
            games = _.filter(games, words, "title").excluded;

            // Sélection et retour du meilleur résultat.
            games.sort(function(a,b) {
                return a.score - b.score;
            });

            var selected = games.slice(-1)[0];

            onSuccess(selected);

        })
        .error(function() {
            onSuccess(false);
        });


    }


    /**
     * Retourne le nombre de joueurs d'un jeu dont on donne l'url en paramètre.
     * @param  {string} url URL SteamDB du jeu.
     * @param  {function} onSuccess Callback contenant le nombre de joueurs.
     */
    function getPlayers(url, onSuccess) {

        // Récupération des infos via le module osmosis
        var osmosis = require('osmosis');

        // Récupération des joueurs du meilleur résultat.
        osmosis.get(url)
        .find('#js-graphs-button')
        .set('players', ".")
        .error(function() {
            // Si le nombre de joueur n'est pas trouvé, on retourne false.
            onSuccess(false);
        })
        .data(function(data) {
            var output;
            var num = data.players.match(/([0-9,]+)/);

            onSuccess(num[1]);
        });

    }


    /**
     * Récupère les données d'un jeu depuis les fonctions getBestMatching() et
     * getPlayers ().
     * @param  {string} keyword Les mots clés de la recherche.
     * @param  {[type]} onSuccess [description]
     * @return {[type]}           [description]
     */
    function getSteamDBData(keyword, onSuccess) {

        // On cherche d'abord la meilleure correspondance avec les mots clés fournis.
        getBestMatching(keyword, function(data) {

            // Si la recherche ne retourne rien, on retourne un message d'erreur.
            if(!data) {
                var error = _.randomize(command.error_no_result);
                onSuccess(false, error);
                return;
            }

            // Si une correspondance a été trouvée, on va cherche le nombre de joueurs
            // sur sa page SteamDB.
            getPlayers(data.url, function(players) {

                var result = {title: "", players: ""}
                var error;

                result.title = data.title;
                result.players = players;

                // Si la page existe mais la donnée non.
                if(!players) {
                    var error = _.randomize(command.error_data_not_found);
                }

                onSuccess(result, error);
            })

        })

    }

};

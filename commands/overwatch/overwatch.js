module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "overwatch",

    description: "**${prefix}overwatch ${prefix}ow <battletag>**  Retourne le profil Overwatch de l'utilisateur spécifié. (Europe uniquement)",

    triggers: [
        "ow",
        "overwatch"
    ],

    searching_message: [
        ":clock10: Recherche en cours, cela peut prendre plusieurs secondes...",
        ":clock10: Je lance la recherche, cela peut durer quelques secondes..."
    ],

    missing_battletag: [
        "Il faut indiquer un Battletag après la commande, ex : Joueur#1234.",
        "Il me faut un Battletag après la commande, ex : Joueur#1234."
    ],

    unknown_profile: [
        "Je n'ai rien trouvé avec ce Battletag.",
        "Il n'y a pas de profil Overwatch correspondant à ce Battletag.",
        "Aucun profil Overwatch trouvé avec ce Battletag."
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

            // Récupération du message.
            var input = message.content;

            // Récupération du Battletag.
            var matches = input.match(/\/[0-9a-z]+\s(.+)/);

            // On vérifie que le Battle est spécifié.
            if(matches && matches[1].length > 0) {

                // On envoit un message de recherche.
                _callback(tools.randomize(this.searching_message));

                /**
                 * Fonctions de récupération des données.
                 */
                var Lootbox = function(battletag, _callback) {

                    var battletag = battletag.replace(/#/, "-");

                    this.getProfile = function(_profile) {

                        /**
                         * Récupération des données du profil.
                         */
                        tools.get({
                                protocol: "https",
                                host: "api.lootbox.eu",
                                path: `/pc/eu/${battletag}/profile`
                            },
                            function(data, error) {

                                if(error)
                                    console.log(`[ERREUR] ${error}`);

                                // Si aucune donnée n'est retournée, on s'arrête ici.
                                if(!data)
                                    return;

                                _profile(data);

                            }
                        );

                    };

                    this.getQuickmatch = function(_quickmatch) {

                        /**
                         * Récupération des données des héros des Matchs rapides.
                         */
                        tools.get({
                                protocol: "https",
                                host: "api.lootbox.eu",
                                path: `/pc/eu/${battletag}/quick-play/allHeroes/`
                            },
                            function(data, error) {

                                if(error)
                                    console.log(`[ERREUR] ${error}`);

                                // Si aucune donnée n'est retournée, on s'arrête ici.
                                if(!data)
                                    return;

                                _quickmatch(data);

                            }
                        );

                    };

                    this.getCompetitive = function(_competitive) {

                        /**
                         * Récupération des données des héros des Matchs rapides.
                         */
                        tools.get({
                                protocol: "https",
                                host: "api.lootbox.eu",
                                path: `/pc/eu/${battletag}/competitive-play/allHeroes/`
                            },
                            function(data, error) {

                                if(error)
                                    console.log(`[ERREUR] ${error}`);

                                // Si aucune donnée n'est retournée, on s'arrête ici.
                                if(!data)
                                    return;

                                _competitive(data);

                            }
                        );

                    };


                    var that = this;

                    this.getData = function(_data) {

                        var data = {
                            profile: {},
                            quickmatch: {},
                            competitive: {}
                        };

                        that.getProfile(function(profile) {

                            data.profile = (data.profile)? JSON.parse(profile) : null ;

                            that.getQuickmatch(function(quickmatch) {

                                data.quickmatch = (data.quickmatch)? JSON.parse(quickmatch) : null ;

                                that.getCompetitive(function(competitive) {

                                    data.competitive = (data.competitive)? JSON.parse(competitive) : null ;
                                    _data(data);

                                });

                            });

                        });

                    };

                };


                /**
                 * Fonction d'ajustement des espaces entres les mots.
                 */
                var tabs = function(str, col) {

                    if(str.match(/\|/)) {

                        var pos = str.indexOf("|");

                        if(pos != -1 && pos < col) {

                            var new_pos = col - pos;
                            var spaces = new String();

                            var i = 0;
                            while(i < new_pos) {
                                spaces += " ";
                                i++;
                            }

                            var output = str.replace(/\|/, spaces);

                        }

                        return output;

                    }
                    else {
                        return str;
                    }

                };


                /**
                 * Récupération des données.
                 */
                var lootbox = new Lootbox(matches[1]);

                // On préserve l'objet this dans that.
                var that = this;

                lootbox.getData(function(data) {

                    // Si le profil Bnet n'existe pas.
                    if(data.profile.statusCode === 404 || !data) {
                        _callback(tools.randomize(that.unknown_profile));
                        return;
                    }

                    var stats = {};

                    stats.username = data.profile.data.username;
                    stats.level = data.profile.data.level;
                    stats.rank = (data.profile.data.competitive.rank)? data.profile.data.competitive.rank : "-" ;;

                    stats.quickmatch_kdratio = (Object.keys(data.quickmatch).length > 0)? ( data.quickmatch.Eliminations.replace(",", "") / data.quickmatch.Deaths.replace(",", "") ).toFixed(2) : "-" ;
                    stats.competitive_kdratio = (Object.keys(data.competitive).length > 0)? ( data.competitive.Eliminations.replace(",", "") / data.competitive.Deaths.replace(",", "") ).toFixed(2) : "-" ;

                    stats.quickmatch_playtime = (Object.keys(data.quickmatch).length > 0)? stats.quickmatch_playtime = data.quickmatch.TimePlayed : "0" ;
                    stats.competitive_playtime = (Object.keys(data.competitive).length > 0)? stats.competitive_playtime = data.competitive.TimePlayed : "0" ;

                    stats.quickmatch_wins = (data.profile.data.games.quick.wins)? data.profile.data.games.quick.wins : 0 ;
                    stats.competitive_wins = (data.profile.data.games.competitive.wins)? data.profile.data.games.competitive.wins : 0 ;
                    stats.competitive_played = (data.profile.data.games.competitive.played)? data.profile.data.games.competitive.played : 0 ;

                    stats.competitive_winspercentage = (data.profile.data.games.competitive.played)? ((data.profile.data.games.competitive.wins * 100) / data.profile.data.games.competitive.played).toFixed(2) : "-" ;

                    stats.quickmatch_kills = (data.quickmatch.Eliminations)? data.quickmatch.Eliminations : 0 ;
                    stats.competitive_kills = (data.competitive.Eliminations)? data.competitive.Eliminations : 0 ;

                    stats.quickmatch_solokills = (data.quickmatch.SoloKills)? data.quickmatch.SoloKills : 0 ;
                    stats.competitive_solokills = (data.competitive.SoloKills)? data.competitive.SoloKills : 0 ;

                    stats.quickmatch_melee = (data.quickmatch.MeleeFinalBlows)? data.quickmatch.MeleeFinalBlows : 0 ;
                    stats.competitive_melee = (data.competitive.MeleeFinalBlows)? data.competitive.MeleeFinalBlows : 0 ;

                    stats.quickmatch_environnement = (data.quickmatch.EnvironmentalKills)? data.quickmatch.EnvironmentalKills : 0 ;
                    stats.competitive_environnement = (data.competitive.EnvironmentalKills)? data.competitive.EnvironmentalKills : 0 ;

                    stats.quickmatch_damage = (data.quickmatch.DamageDone)? data.quickmatch.DamageDone : 0 ;
                    stats.competitive_damage = (data.competitive.DamageDone)? data.competitive.DamageDone : 0 ;

                    stats.quickmatch_deaths = (data.quickmatch.Deaths)? data.quickmatch.Deaths : 0 ;
                    stats.competitive_deaths = (data.competitive.Deaths)? data.competitive.Deaths : 0 ;

                    stats.quickmatch_healing = (data.quickmatch.HealingDone)? data.quickmatch.HealingDone : 0 ;
                    stats.competitive_healing = (data.competitive.HealingDone)? data.competitive.HealingDone : 0 ;

                    stats.quickmatch_medals = (data.quickmatch.Medals)? data.quickmatch.Medals : 0 ;
                    stats.competitive_medals = (data.competitive.Medals)? data.competitive.Medals : 0 ;

                    var message = [
                        "```py\n",
                        "Nom : ${username} \n",
                        "Niveau : ${level} \n",
                        "Rang : ${rank} \n",

                        "\n",

                        "@ ----------------|@ --------------------- \n",
                        "@ Partie rapide|@ Partie compétitive \n",
                        "@ ----------------|@ --------------------- \n",

                        "\n",

                        "K/D ratio : ${quickmatch_kdratio}|K/D ratio : ${competitive_kdratio} \n",
                        "Temps de jeu : ${quickmatch_playtime}|Temps de jeu : ${competitive_playtime} \n",
                        "Parties gagnées : ${quickmatch_wins}|Parties gagnées : ${competitive_wins}/${competitive_played} (${competitive_winspercentage}%) \n",

                        "\n",

                        "@ Eliminations|@ Eliminations \n",
                        "Total : ${quickmatch_kills}|Total : ${competitive_kills} \n",
                        "Solo : ${quickmatch_solokills}|Solo : ${competitive_solokills} \n",
                        "Mêlée : ${quickmatch_melee}|Mêlée : ${competitive_melee} \n",
                        "Environnement : ${quickmatch_environnement}|Environnement : ${competitive_environnement} \n",
                        "Dégâts infligés : ${quickmatch_damage}|Dégâts infligés : ${competitive_damage} \n",
                        "Morts : ${quickmatch_deaths}|Morts : ${competitive_deaths} \n",

                        "\n",

                        "@ Autre|@ Autre \n",
                        "Soin distribué : ${quickmatch_healing}|Soin distribué : ${competitive_healing} \n",
                        "Médailles : ${quickmatch_medals}|Médailles : ${competitive_medals} \n",
                        "```"
                    ];

                    // Composition du message.
                    var output = new String();

                    for(var i in message)
                        output += tabs(message[i].template(stats), 32);

                    // Envoi du message contenant le profil complet.
                    _callback(output);

                });

            }
            else {
                this.output = tools.randomize(this.missing_battletag);
            }

        }

        // Gestion des erreurs
        catch(e) {
            this.error = `La commande <${this.name}> a provoqué une erreur : (${e.name}) ${e.message}`;
        }

        // Quoiqu'il arrive, on fait appel au callback.
        finally {

            _callback(this.output, this.error);

        }

    }

};

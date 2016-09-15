// Variable de calcul du temps de chargement.
var start_time = new Date();

console.log("[INFO] Chargement du bot en cours...");

/**
 * Appel des modules et librairies.
 */

try {
    // Appel du module discord.io obligatoire.
    var Discord = require("discord.io");

    // Récupération de la configuration.
    // Si le fichier config.json n'existe pas, il est créé avec la configuration par défaut.
    var config = require("./lib/config.js"), config = config();

    // On vérifie si le token du bot n'est pas renseigné.
    if(config.token == "<bot_token_here>") {
        console.log("[ERREUR] Vous devez renseigner le token du bot dans config.json.");
        process.exit(1);
    }

    // Lancement et connexion du bot, et injection des propriétés personnalisées.
    var bot = new Discord.Client({
    	token: config.token,
    	autorun: config.autorun
    }),
    bot = require("./lib/bot.js")(bot);

    // Chargement des prototypes modifiés.
    require("./lib/prototypes.js")

    // Chargement des événements.
    require('./events/disconnect.js')(bot);
    require('./events/message.js')(bot);
    require('./events/any.js')(bot);
    require('./events/presence.js')(bot);
    require('./events/ready.js')(bot, start_time);

}

catch(e) {
    console.log(`[ERREUR] ${e.message}`);
	process.exit(1);
}

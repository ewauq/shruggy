/**
 * Importation des modules et autres librairies.
 */

// Appel du module discord.io obligatoire.
var Discord = require('discord.io');

// Récupération de la configuration.
var config = require("./libs/config.js"), config = config();


/**
 * Lancement et connexion du bot.
 */
var bot = new Discord.Client({
	token: config.token,
	autorun: config.autorun
});

// Si le token du bot n'est pas renseigné.
if(config.token == "<bot_token_here>") {
    console.log("[ERREUR] Vous devez renseigner le token du bot dans config.json.");
    return;
}


/**
 * Chargement des librairies d'évènements.
 *
 * Le paramètre {object} bot est obligatoire.
 */
require('./events/onReady.js')(bot);
require('./events/onDisconnect.js')(bot);
require('./events/onMessage.js')(bot);
require('./events/onAny.js')(bot);

console.log("[INFO] Le chargement du bot s'est déroulé avec succès.");

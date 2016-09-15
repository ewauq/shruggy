/**
 * Récupération des paramètres stockés dans le fichier de configuration.
 *
 * Si le fichier de configuration n'existe pas, il est créé avec les paramètres par défaut.
 *
 * @return {object} obj Les paramètres récupérés au format JSON.
 */
module.exports = function() {

    var config;

    var fs = require("fs");
    var filePath = `${__dirname}/../config.json`;

    // On vérifie si le fichier existe.
    try {
        fs.accessSync(filePath, fs.F_OK);
        config = require(filePath);
    }

    // Si le fichier n'existe pas, accessSync() génère une erreur.
    // accessSync() ne gère pas les erreurs, il faut donc le tester avec try{}.
    // On crée alors le fichier et on récupère les données.
    catch(e) {

        // Préparation de la configuration par défaut.
        var defautConfig = {
            token: "<bot_token_here>",
            autorun: true,
            command_prefix: "/",
            avatar_file: "avatar.png",
            auto_chat_channel: "0"
        };

        fs.writeFileSync(filePath, JSON.stringify(defautConfig, null, 4));
        config = require(filePath);
    }

    return config;

}

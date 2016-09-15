module.exports = function(bot) {

    /**
     * Met à jour l'avtar du bot en fonction du fichier spécifié dans config.json.
     * @param  {object} bot L'objet complet du bot.
     * @return {boolean} bool Retourne true si le changement est un succès, sinon false.
     */
    bot.updateAvatar = function() {

        try {

            var fs = require("fs");
            var config = require("../config.json");

            // On récupère l'image et on la transforme en une chaîne de base64.
            var base64 = fs.readFileSync(config.avatar_file, "base64");
            bot.editUserInfo({ avatar: base64 });

            console.log("[INFO] L'avatar a été mis à jour.");

            return true;

        }
        catch (e) {
            console.log(`[ERREUR] L'avatar n'a pas été mis à jour : ${e.message}`);
            return false;
        }

    }

    return bot;

};

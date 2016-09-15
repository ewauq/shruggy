module.exports = {

    /**
     * Paramètres de la commande.
     */

    name: "avatar",

    description: "**${prefix}avatar <@utilisateur>**  Retourne le lien de l'avatar de l'utilisateur mentionné.",

    triggers: [
        "avatar",
        "photo"
    ],

    responses: [
     "Voici l'avatar de **${username}** : ${url}"
    ],

    errors: [
     "J'ai besoin que tu mentionnes un utilisateur.",
     "Il me faut un utilisateur mentionné après la commande.",
     "Cette commande a besoin de la mention d'un utilisateur. ",
     "Cette commande nécessite la mention d'un utilisateur.",
     "Après la commande, j'ai besoin de la mention d'un utilisateur.",
     "J'ai besoin d'une mention avec cette commande.",
     "Tu as oublié de mentionner un utilisateur.",
     "Il faut préciser un utilisateur en le mentionnant."
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

            // Si aucune mention n'est précisée.
            if(message.mentions.length == 0) {
                this.error = `La commande <${this.name}> a besoin d'un paramètre.`;
                this.output = tools.randomize(this.errors);
            }

            // Si la mention existe.
            // Si plusieurs mentions sont précisées, on ne prend que la première.
            else {

                // On récupère uniquement la première mention.
                var mention = message.mentions[0];

                // Préparation des données pour les littéraux.
                var data = {
                    username: mention.username,
                    url: `https://cdn.discordapp.com/avatars/${mention.id}/${mention.avatar}.jpg`
                };

                // Récupération d'une phrase aléatoire et remplacement des littéraux.
                this.output = tools.randomize(this.responses).template(data);

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

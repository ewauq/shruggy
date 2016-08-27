/**
 * Liste des mots acceptés pour déclencher la commande.
 * Vous pouvez en indiquer autant que vous voulez.
 * Il faut impérativement que le mot ne soit pas utilisé ailleurs.
 */
var triggers = [
    "example",
    "exemple"
]

/**
 * Liste des réponses possibles que le bot peut envoyer.
 * Il est également possible d'utiliser des variables (littéraux)
 * dans les réponses, ainsi que des expressions spéciales.
 *
 * Consultez la doc pour plus d'informations.
 */
var responses = [
    "Voici un exemple de réponse.",
    "Je suis une phrase de réponse.",
    "Voici une réponse..."
]

// Il faut impérativement exporter les triggers, sinon le script
// ne fonctionnement pas.
exports.triggers = triggers;

/**
 * Retourne le lien de l'avatar de l'utilisateur mentionné.
 * @param  {object} event Contient toutes les informations du message reçu.
 * @param  {function} callback Callback contenant le message retourné.
 */
exports.run = function(event, callback) {

    this.output;
    this.error;
    this.name = "example";

    // Exécution normale du code.
    try {

        var func = require('../../libs/functions.js');

        // On choisit aléatoirement une réponse parmi celles disponibles dans
        // la variable "responses".
        this.output = func.randomize(responses);

    }

    // Si le script rencontre une erreur, alors il la retourne.
    catch(e) {

        if(!responses) {
            this.error = "Les phrases de réponses de la commande <" + this.name + "> n'ont pas été trouvées.";
        }
        else {
            this.error = "La commande <" + this.name + "> a provoqué une erreur : " + e.message;
        }

    }

    // Quoiqu'il arrive on appelle le callback pour retourner les données.
    finally {
        callback(this.output, this.error);
    }

};

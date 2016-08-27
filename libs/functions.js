/* ===========================================================

    PROTOTYPES

 =========================================================== */

/**
 * Retourne si une chaîne de caractères est une commande ou non.
 * @return {boolean} bool Vrai si la chaîne est une commande, sinon faux.
 */
String.prototype.isCommand = function() {

    var config = require('../config.json');

    if(this.indexOf(config.command_prefix) == 0) {
        return true;
    }
    else {
        return false;
    }
}


/**
 * Vérifie si la chaîne de caractères est présente ou non dans l'objet.
 * @param {object} obj L'objet dans lequel on cherche la chaîne.
 * @return {boolean} bool Retourne vrai si le chaîne est trouvé dans obj, sinon faux.
 */
String.prototype.in = function(obj) {

    var string = JSON.stringify(this);
    string = string.replace(/(")/g, "");

    if(obj.indexOf(string) > -1) {
        return true;
    }
    else {
        return false;
    }

}


/**
 * Met une majuscule de la première lettre d'une chaîne de caractères.
 * @return {string} str La châine de caractères formatée.
 */
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


/**
 * Retourne la chaîne de caractères après avoir cherché et remplacé
 * les littéraux par la valeur des attributs de l'objet passé en paramètre.
 *
 * Les noms des attributs doivent être les mêmes que les noms des littéraux
 * à remplacer.
 *
 * Exemples :
 * ${name}   sera remplacé par obj.name,
 * ${title}  sera remplacé par obj.title, etc...
 *
 * @param  {object} obj Objet contenant les littéraux à remplacer.
 * @return {string} str La phrase modifée.
 */
String.prototype.template = function(obj) {

    // Si le paramètre n'est pas précisé.
    if(!obj)
        return;

    this.output = this;

    for(var i in obj) {
        var re = new RegExp("[$]\{" + i + "\}", "g");
        this.output = this.output.replace(re, obj[i]);
    }

    return this.output;

}


/* ===========================================================

    FONCTIONS

 =========================================================== */

/**
 * Obtient l'élément d'un objet aléatoirement.
 * L'objet peut contenir une expression commençant par #.
 * @param  {object} obj L'objet à parcourir.
 * @return {string} str L'élément choisi aléatoirement.
 */
exports.randomize = function(obj) {

    var rnd = Math.floor(Math.random() * obj.length);

    // Si la phrase retournée est une expression.
    if(obj[rnd].indexOf('#') == 0) {
        var output = [];
        var input = obj[rnd];

        // On retire le #
        var exp = input.substring(1, input.length);

        // On récupère les expressions individuellement.
        exp = exp.match(/\(([^)]*)\)/g);

        exp.forEach(function(words) {
            // On supprime les parenthèses des expressions.
            var words = words.replace(/[()]/g, '');

            // On récupère les mots individuellement.
            words = words.split('|');

            // On récupère un mot aléatoirement parmi ceux disponibles.
            var rnd = Math.floor(Math.random() * words.length);
            output.push(words[rnd]);
        });

        // On transforme l'object en string.
        output = output.join("");

        return output;
    }
    else {
        return obj[rnd];
    }

}


/**
 * Récupère le contenu d'une page web.
 * @param  {string} url URL de la page.
 * @return {object} obj Objet représentant le contenu de la page.
 */
exports.getFile = function(url) {

    this.output;

    var mod = require('xmlhttprequest');
    var req = new mod.XMLHttpRequest();

    req.open("GET", url, false);
    req.timeout = 10000;

    req.ontimeout = function () {
        this.output = "timeout";
    }

    req.send(null);

    if(req.responseText)
        this.output = req.responseText;

    return this.output;
}


/**
 * Filtre les lignes d'un objet. Retourne les lignes gardées et supprimées leurs propriétés respectives.
 * La recherche est stricte, elle détecte uniquement sur les mots complets.
 * @param  {object} obj Objet a filtrer.
 * @param  {object} words Les mots à trouver.
 * @param  {string} property Nom de la propriété concernée par le filtrage.
 * @return {object} obj Retourne les lignes gardées et supprimées lors du filtrage.
 */
exports.filter = function(obj, words, property) {

    this.included = [];
    this.excluded = [];

    // Liste des objets à filtrer.
    loop1:
    for(var i in obj) {

        // Liste des mots à trouver.
        loop2:
        for(var ele in words) {

            var str = obj[i][property].toLowerCase();
            var exc = words[ele].toLowerCase();
            var reg = new RegExp("\\b" + exc + "\\b");

            if(str.match(reg)) {
                this.excluded.push(obj[i]);
                continue loop1;
            }

        }

        this.included.push(obj[i]);

    }

    return {
        included: this.included,
        excluded: this.excluded
    };

}


/**
 * Ecrit un objet formaté dans un fichier JSON.
 * @param  {string} filename Le chemin du fichier.
 * @param  {object} obj L'objet à écrire.
 */
exports.writeJSON = function(filename, obj) {

    var fs = require('fs');
    fs.writeFile(filename, JSON.stringify(obj, null, 4), function(err) {
        if(err) {
          console.log(err);
        }

    });

}



/**
 * Met à jour l'avtar du bot en fonction du fichier spécifié dans config.json.
 * @param  {object} bot L'objet complet du bot.
 * @return {boolean} bool Retourne true si le changement est un succès, sinon false.
 */
exports.updateAvatar = function(bot) {

    var fs = require('fs');
    var config = require('../config.json');

    try {

        // On récupère l'image et on la transforme en une chaîne de base64.
        var base64 = fs.readFileSync(config.avatar_file, "base64");
        bot.editUserInfo({ avatar: base64});
        return true;

    }
    catch (e) {
        console.log(e.message);
        return false;
    }

}




exports.isDirectMessage = function(bot, event) {

    var botDMChannelID = Object.keys(bot.directMessages).toString();
    var channelID = event.d.channel_id;

    if(botDMChannelID === channelID) {
        return true;
    }
    else {
        return false;
    }

}

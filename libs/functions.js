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

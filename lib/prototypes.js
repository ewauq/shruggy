/* ===========================================================

    PROTOTYPES

 =========================================================== */


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

};


/**
 * Met une majuscule de la première lettre d'une chaîne de caractères.
 * @return {string} str La châine de caractères formatée.
 */
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


/**
 * Retourne la chaîne de caractères après avoir cherché et remplacé
 * les littéraux par la valeur des attributs de l'objet passé en paramètre.
 *
 * Les noms des attributs doivent être les mêmes que les noms des littéraux
 * à remplacer.
 *
 * Exemples :
 * ${name}     sera remplacé par obj.name
 * ${title}    sera remplacé par obj.title
 * ${user.id}  sera remplacé par obj.user.id
 *
 * @param  {object} obj Objet contenant les littéraux à remplacer.
 * @return {string} str La phrase modifée.
 */
String.prototype.template = function(obj) {

    var tools = require("./functions.js")

    // Si le paramètre n'est pas précisé.
    if(!obj)
        return;

    this.output = this;

    var literals = tools.flattenObject(obj);

    for(var name in literals) {
        var re = new RegExp("[$]\{" + name + "\}", "g");
        this.output = this.output.replace(re, literals[name]);
    }

    return this.output;

};

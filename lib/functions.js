/* ===========================================================

    FUNCTIONS

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

};


/**
 * Aplatit un objet en récupérant ses propriétés et ses valeurs.
 * Largement inspiré de https://gist.github.com/penguinboy/762197
 * @param  {object} obj L'objet à aplatir.
 * @return {object} obj L'objet aplati.
 */
exports.flattenObject = function(obj) {

    var output = {};

	for (var a in obj) {

        if(typeof(obj[a]) === 'object') {

            var props = exports.flattenObject(obj[a]);

            for(var x in props)
                output[a + "." + x] = props[x];

        }
        else {
            output[a] = obj[a];
        }

    }

    return output;

};


/**
 * Filtre les lignes d'un objet. Retourne les lignes gardées et supprimées leurs propriétés respectives.
 * La recherche est stricte, elle détecte uniquement sur les mots complets, peu importe la casse.
 * @param  {object} obj Objet a filtrer.
 * @param  {object} words Les mots à trouver.
 * @param  {string} property Nom de la propriété concernée par le filtrage.
 * @return {object} obj Retourne les lignes gardées et supprimées lors du filtrage.
 */
exports.filter = function(obj, words, property) {

    this.unmatched = [];
    this.matched = [];

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
                this.matched.push(obj[i]);
                continue loop1;
            }

        }

        this.unmatched.push(obj[i]);

    }

    return {
        unmatched: this.unmatched,
        matched: this.matched
    };

};

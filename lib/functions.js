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


/**
 * Retourne le contenu d'une page web.
 * @param  {object} url L'objet de l'url = {protocol: "http ou https", host: "www.google", path: "/search"}
 * @param  {object} _callback Le callback retournant le contenu trouvé.
 */
exports.get = function(url, _callback) {

    this.output = null;
    this.error = null;
    this.protocols = ["http", "https"];

    // Si url n'est pas un objet.
    if(typeof url != "object") {
        this.error = "Error : The URL must be an object.";
        _callback(this.output, this.error);
        return;
    }

    // Si le protocol n'est pas spécifié ou ne fait pas partie des protocols.
    if(!url.protocol || this.protocols.indexOf(url.protocol) == -1) {
        this.error = "Error : The protocol must be http or https.";
        _callback(this.output, this.error);
        return;
    }

    // On appelle le module http ou https.
    var http = require(url.protocol.toLowerCase());

    try {

        // Récupération des données web.
        http.get({
            host: url.host,
            path: url.path
        },
        function(response) {

            // Si la page retourne un code 200 = OK
            if(response.statusCode === 200) {

                var body = new String();

                response.on('data', function(data) {
                    body += data;
                })
                .on('error', function(error) {
                    this.error = error;
                    _callback(this.output, this.error);
                })
                .on('end', function() {
                    this.output = body ;
                    _callback(this.output, this.error);
                });

            }
            else {
                this.error = `Status code ${response.statusCode} returned.`;
                _callback(this.output, this.error);
            }

        });

    }

    catch(e) {
        this.error = `The requested url returned an error :  ${e.message}.`;
        _callback(this.output, this.error);
    }

};

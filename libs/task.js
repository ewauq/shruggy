/**
 * Lance la boucle d'exécution des tâches.
 * @param  {function} callback Callback retournant l'output des tâches (les messages principalement).
 */
exports.run = function(callback) {

    var fs = require('fs');

    // On liste des tâches du bot.
    var tasks = fs.readdirSync(__dirname + '/../tasks/');

    // On va exécuter chaque tâche en fonction de son timer.
    tasks.forEach(function(task) {

        // Récupération de la tâche et de son timer.
        var tsk = require(__dirname + `/../tasks/${task}/${task}.js`);

        // Exécution de la tâche en boucle.
        setInterval(function () {

            tsk.run(function(output) {
                console.log(`[TACHE] Exécution de la tâche ${task}. (${tsk.timer}ms)`);
                callback(output);
            });

       }, tsk.timer);

    });

};

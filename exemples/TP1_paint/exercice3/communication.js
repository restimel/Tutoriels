/* ce fichier est prévu d'être utilisé comme un sharedWorker. Il sert à gérer la communication entre toutes les pages. */

// liste tous les ports pour communiquer avec les pages ouvertes
var listePages = [];

// envoi de l'information à toutes les pages
function dispatch(evt) {
    var data = evt.data;
    var originPort = evt.target;

    listePages.forEach(function(port) {
        if (port !== originPort) {
            port.postMessage(data);
        }
    });
}

// gestion d'une nouvelle page
onconnect = function(evt) {
    var port = evt.ports[0];

    listePages.push(port);

    port.onmessage = dispatch;
};

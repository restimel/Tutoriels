// sauvegarde des états du documents
var cfg = {
    forme: "rond", // forme du pinceau
    taille: 10, // taille du pinceau
    couleur: "black", //couleur du pinceau

    dessine: false, // est en train de dessiner

    hauteurOutils: 0, // hauteur de la barre d'outils
    marge: 20 // marge du canvas par rapport au bord de page
};

// compatibilité
var supporteLocalStorage = typeof localStorage !== "undefined";
var outilsPresent = false;

// Variable globale pour la communication
var communication;

// récupération des données depuis le localStorage
function recupereSauvegarde() {
    var forme = "rond";
    var taille = 10;
    var couleur = "black";

    if (supporteLocalStorage) {
        couleur = localStorage.getItem("couleur") || couleur;
        taille = parseInt(localStorage.getItem("taille"), 10) || taille;
        forme = localStorage.getItem("formePinceau") || forme;
    }

    // met à jour le pinceau
    cfg.couleur = couleur;
    cfg.taille = taille;
    if (outilsPresent) {
        changeForme(forme);
        // met à jour les champs avec les valeurs initiales
        updateInputs();
    } else {
        cfg.forme = forme;
    }
}

// crée un ShareWorker pour communiquer entre toutes les pages
function prepareCommunication() {
    if (typeof SharedWorker === "function") {
        communication = new SharedWorker("communication.js");
        communication.port.onmessage = onWorkerMessage;
    } else {
    	alert("Votre navigateur ne suporte pas les SharedWorker :(");
    }
}

// réception des messages provenant du ShareWorker
function onWorkerMessage(evt) {
    var valeur = evt.data.valeur;
    var action = evt.data.action;
    switch(action) {
        case "forme":
            if (outilsPresent) {
                changeForme(valeur);
            } else {
                cfg.forme = valeur;
            }
            break;
        case "imageData": cfg.imageData = JSON.parse(valeur); break;
        case "couleur":
        case "taille":
            cfg[action] = valeur;
            if (outilsPresent) {
                updateInputs();
            }
            break;
    }
}

// transmission de l'information à toutes les pages
function envoiMessage(action, valeur) {
    if (communication) {
        communication.port.postMessage({
            action: action,
            valeur: valeur
        });
    }
}

prepareCommunication();

// récupère les sauvegardes seulement quand tous les modules sont chargés
addEventListener("DOMContentLoaded", recupereSauvegarde);

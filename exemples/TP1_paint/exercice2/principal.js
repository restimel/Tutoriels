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
    changeForme(forme);
    // met à jour les champs avec les valeurs initiales
    updateInputs();
}

// récupère les sauvegardes seulement quand tous les modules sont chargés
addEventListener("DOMContentLoaded", recupereSauvegarde);

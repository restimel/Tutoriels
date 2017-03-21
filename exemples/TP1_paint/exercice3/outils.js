/* Ce fichier sert à gérer la barre d'outils */

function prepareOutils() {
    outilsPresent = true;

    // création des listeners
    var buttons = document.querySelectorAll("#forme > button");
    // Pour tous les boutons servant à dessiner des formes on écoute sur l'événement "click"
    Array.prototype.forEach.call(buttons, function(el) {
        el.onclick = onChangeForme;
    });

    document.getElementById("taille").onchange = onChangeTaille;
    document.getElementById("couleur").onchange = onChangeCouleur;

    // taille du header
    cfg.hauteurOutils = 50;
}

function changeForme(forme, sauvegarde) {
    // change l'état de la sélection
    document.getElementById(cfg.forme).classList.remove("actif");
    document.getElementById(forme).classList.add("actif");

    // sauvegarde de la nouvelle forme de pinceau
    cfg.forme = forme;
    if (sauvegarde && supporteLocalStorage) {
        localStorage.setItem("formePinceau", forme);
    }
}

function updateInputs() {
    document.getElementById("taille").value = cfg.taille;
    document.getElementById("couleur").value = cfg.couleur;
}

function onChangeForme(evt) {
    var forme = evt.currentTarget.id;
    changeForme(forme, true);
    envoiMessage("forme", forme);
}

function onChangeTaille(evt) {
    var taille = parseInt(evt.currentTarget.value, 10);
    cfg.taille = taille;
    if (supporteLocalStorage) {
        localStorage.setItem("taille", taille);
    }
    envoiMessage("taille", taille);
}

function onChangeCouleur(evt) {
    var couleur = evt.currentTarget.value;
    cfg.couleur = couleur;
    if (supporteLocalStorage) {
        localStorage.setItem("couleur", couleur);
    }
    envoiMessage("couleur", couleur);
}

prepareOutils();

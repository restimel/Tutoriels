/* Ce fichier sert à gérer la barre d'outils */

function prepareOutils() {
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

function onChangeForme(evt) {
    var id = evt.currentTarget.id;

    // change l'état de la sélection
    document.getElementById(cfg.forme).classList.remove("actif");
    document.getElementById(id).classList.add("actif");

    // sauvegarde de la nouvelle forme de pinceau
    cfg.forme = id;
}

function onChangeTaille(evt) {
    cfg.taille = parseInt(evt.currentTarget.value, 10);
}

function onChangeCouleur(evt) {
    cfg.couleur = evt.currentTarget.value;
}

prepareOutils();

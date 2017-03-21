/* Ce fichier sert à afficher les éléments sur le SVG et gérer les interaction avec celui-ci */

/* config */
var xmlns = "http://www.w3.org/2000/svg";
var xlink = "http://www.w3.org/1999/xlink";
var margeGenerale = 10;
var tailleSVG = 1000;
var partie;

/* initialise le SVG pour dessiner le plateau */
function preparePlateau() {
    var tailleFenetre = Math.min(window.innerWidth, window.innerHeight) - 2 * margeGenerale;
    var svg = document.querySelector("svg");
    svg.setAttribute("width", tailleFenetre);
    svg.setAttribute("height", tailleFenetre);

    // crée un nouveau jeu
    partie = new Gomoku();
    partie.fin = finDeJeu; //extension du comportement de fin
    partie.annuleFin = annuleFinDeJeu; //extension du comportement de quitter le dernier coup
    partie.changePierre = changePierre; //remplacement du comportement du changement de pierre
    partie.recommence = effaceSVG; //extension du comportement de recommencement de partie

    displayPlateau();
}

/* permet d'afficher le plateau */
function displayPlateau() {
    var ratio = 1 / partie.taille;
    var distance = tailleSVG / partie.taille;
    var decalage = distance / 2;
    var extremite = tailleSVG - decalage;
    var elPlateau = document.getElementById("plateau");

    // dessine les "cases"
    var chemin = "";
    for(var x = 0; x < partie.taille; x++) {
        chemin += "M " + (x * distance + decalage) + "," + decalage;
        chemin += "V " + extremite;
        chemin += "M " + decalage + "," + (x * distance + decalage);
        chemin += "H " + extremite;
    }
    var lignes = document.createElementNS(xmlns, "path");
    lignes.setAttribute("d", chemin);
    lignes.setAttribute("class", "lignePlateau");
    elPlateau.appendChild(lignes);

    // ajoute les pierres
    partie.elPierres = [];
    for(var x = 0; x < partie.taille; x++) {
        partie.elPierres[x] = [];
        for (var y = 0; y < partie.taille; y++) {
            var pierre = document.createElementNS(xmlns, "use");
            pierre.setAttributeNS(xlink, "href", "#pierre");
            pierre.setAttribute("transform", "translate(" + (x * distance) + "," + (y * distance) + ") scale(" + ratio + ")");
            pierre.setAttribute("class", "joueur" + partie.plateau[x][y]);
            pierre.onclick = onClickPierre.bind(pierre, x, y);
            elPlateau.appendChild(pierre);
            partie.elPierres[x][y] = pierre;
        }
    }
}

/* permet de modifier une case pour afficher la pierre de la bonne couleur */
function changePierre(x, y, valeur) {
    var elPierre = this.elPierres[x][y];
    elPierre.setAttribute("class", "joueur" + valeur);
}

/* actions à gérer lorsque la partie est finie */
function finDeJeu(couleur, x1, y1, x2, y2) {
    var nomCouleur, elLigne, distance, decalage;
    if (couleur === 0) {
        document.getElementById("partie-nulle").setAttribute("class", "affiche");
    } else {
        nomCouleur = {
            "1": "noir",
            "-1": "blanc"
        }
        document.getElementById("victoire-text").textContent = "Victoire du joueur " + nomCouleur[couleur] + " !";
        document.getElementById("victoire").setAttribute("class", "affiche-" + nomCouleur[couleur]);
        //dessine l'allignement qui gagne
        distance = tailleSVG / this.taille;
        decalage = distance / 2;
        elLigne = document.createElementNS(xmlns, "line");
        elLigne.setAttribute("x1", x1 * distance + decalage);
        elLigne.setAttribute("y1", y1 * distance + decalage);
        elLigne.setAttribute("x2", x2 * distance + decalage);
        elLigne.setAttribute("y2", y2 * distance + decalage);
        document.getElementById("marques").appendChild(elLigne);
    }
    //rappelle la méthode originale de l'objet Gomoku
    Gomoku.prototype.fin.apply(this, arguments);
}

function annuleFinDeJeu() {
    document.getElementById("partie-nulle").setAttribute("class", "");
    document.getElementById("victoire").setAttribute("class", "");
    document.getElementById("marques").innerHTML = "";
    //rappelle la méthode originale de l'objet Gomoku
    Gomoku.prototype.annuleFin.apply(this, arguments);
}

/* enlève toutes les pierres */
function effaceSVG() {
    //rappelle la méthode originale de l'objet Gomoku
    Gomoku.prototype.recommence.apply(this, arguments);
    document.getElementById("plateau").innerHTML = "";
    displayPlateau();
}

/* événement lorsqu'on clique sur une case */
function onClickPierre(x, y) {
    partie.joueCoup(x, y);
}

preparePlateau();
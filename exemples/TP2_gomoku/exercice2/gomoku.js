/* Ce fichier sert à gérer le déroulement de la partie et vérifier les coups */

/* L'objet Gomoku correspond à une partie en cours */
function Gomoku() {
    // construit le plateau initial
    this.plateau = [];
    for(var x = 0; x < this.taille; x++) {
        this.plateau[x] = [];
        for(var y = 0; y < this.taille; y++) {
            this.plateau[x][y] = 0;
        }
    }

    this.tourDeJeu = 1; // 1: joueur noir; -1: joueur blanc
    this.coupAuthorise = true;
    this.IA = {
        "joueur1": false,
        "joueur-1": true
    };
}

/* Règles */
Gomoku.prototype.taille = 9; // nombre de cases d'un côté du plateau
Gomoku.prototype.nbAligne = 5; // nombre de pierres à aligner pour gagner

/* indique la fin de partie */
Gomoku.prototype.fin = function() {
    this.coupAuthorise = false;
};

/* permet de savoir la couleur d'une case (et effecture les vérifications de sorties de tableau) */
Gomoku.prototype.couleurCase = function(x, y) {
    if (x < 0 || y < 0 || x >= this.taille || y >= this.taille) {
        return undefined;
    }
    return this.plateau[x][y];
};

/* permet de jouer un coup */
Gomoku.prototype.joueCoup = function(x, y) {
    if (this.coupAuthorise && this.couleurCase(x, y) === 0) {
        this.plateau[x][y] = this.tourDeJeu;
        this.changePierre(x, y, this.tourDeJeu);
        this.tourDeJeu = this.tourDeJeu * -1;
        if (!this.verifieFin(x, y) && this.IA["joueur" + this.tourDeJeu]) {
            this.joueIA();
        }
        return true;
    }
};

/* indique que c'est à l'IA de jouer */
Gomoku.prototype.joueIA = function() {
    if (!this.worker) {
        if (typeof Worker ==="function") {
            this.worker = new Worker("ia.js");
            this.worker.onmessage = this.reponseIA.bind(this);
            this.elProgression = document.getElementById("ia-progression");
        } else {
            console.warn("Worker non supporté")
            return;
        }
    }

    this.coupAuthorise = false;
    changeProgressionMax(this.nbCoupRestant());
    this.worker.postMessage({
        plateau: this.plateau,
        tourDeJeu: this.tourDeJeu
    });
};

/* gère la réponse du worker (soit l'état d'avancé, soit le coup à jouer) */
Gomoku.prototype.reponseIA = function(evt) {
    if (evt.data.progres < 0) {
        cacheProgression();
        this.coupAuthorise = true;
        this.joueCoup(evt.data.x, evt.data.y);
    } else {
        changeProgression(evt.data.progres);
    }
};

/* Compte le nombre de case vide */
Gomoku.prototype.nbCoupRestant = function() {
    var compteur = 0;
    for (var x = 0; x < this.taille; x++) {
        for (var y = 0; y < this.taille; y++) {
            if (this.plateau[x][y] === 0) {
                compteur++;
            }
        }
    }

    if (!compteur && typeof this.fin === "function") {
        this.fin(0);
    }

    return compteur;
};

/* vérifie s'il y a assez de pierres pour gagner selon une orientation donnée */
Gomoku.prototype.verifieLigne = function(x, y, incX, incY) {
    var couleur = this.plateau[x][y];
    var compteur = 1;
    var min = 0;
    var max = 0;
    var invIncX = incX * -1;
    var invIncY = incY * -1;
    while(this.couleurCase(x + (max + 1) * incX, y + (max + 1) * incY) === couleur) {
        max++;
        compteur++;
    }
    // vérifie dans l'autre sens
    while(this.couleurCase(x + (min + 1) * invIncX, y + (min + 1) * invIncY) === couleur) {
        min++;
        compteur++;
    }
    // vérifie s'il y a suffisament de pierres alignées
    if (compteur >= this.nbAligne) {
        this.fin(couleur, x + min * invIncX, y + min * invIncY, x + max * incX, y + max * incY);
        return true;
    }
}

/* vérifie si le dernier coup fait terminer le jeu */
Gomoku.prototype.verifieFin = function(x, y) {
    return this.verifieLigne(x, y, 0, 1) //vérifie verticalement
        || this.verifieLigne(x, y, 1, 0) //vérifie horizontalement
        || this.verifieLigne(x, y, 1, 1) //vérifie diagonalement \
        || this.verifieLigne(x, y, -1, 1)//vérifie diagonalement /
        || !this.nbCoupRestant()         //vérifie s'il reste des coups
}

/* Notifie un changement de pierre pour une case.
   Cette fonction est réécrite selon les besoins */
Gomoku.prototype.changePierre = function() {};
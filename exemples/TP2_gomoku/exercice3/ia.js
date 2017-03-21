/* Ce fichier est exécuté dans un worker. Il sert à gérer l'IA */

/* configuration */
var profondeurMax = 4;
var profondeur = 0;

importScripts("gomoku.js");

/* annule l'effet par défaut lorsqu'on atteind la fin de partie dans l'IA */
Gomoku.prototype.fin = function() {};

/* fonction gérant l'algorithme minimax et l'élagage alpha-beta
 Le but est de rechercher en profondeur le coup qui donne le meilleur résultat */
Gomoku.prototype.joueIA = function(couleur, profondeur, alpha, beta) {
    if (profondeur === 1) {
        this.IA.progres++;
        if (!(this.IA.progres%5)) postMessage({progres: this.IA.progres});
    }
    if (profondeur === profondeurMax) {
        //la limite de profondeur de calcul a été atteinte on retourne donc une estimation de la position actuelle
        return this.estimationPosition() * couleur;
    } else {
        var meilleur = -Infinity; //estimation du meilleur coup actuel
        var estim; //estimation de la valeur d'un coup
        var coup; //meilleur coup actuel

        //toutes les combinaisons possibles vont être essayées
        for (var x = 0; x < this.taille; x++) {
            for (var y = 0; y < this.taille; y++) {
                if (this.plateau[x][y]) continue; //case déjà occupée
                if (!coup) {coup = [x,y];} //pour proposer au moins un coup

                this.plateau[x][y] = couleur; //on va essayer avec ce coup
                //vérifie si le coup est gagnant
                if (this.verifieFin(x,y)) {
                    this.plateau[x][y] = 0; //restauration de la grille
                    return profondeur ? Infinity * couleur : [x,y];
                }
                estim = -this.joueIA(-couleur, profondeur+1, -beta, -alpha); //on calcule la valeur de ce coup
                this.plateau[x][y] = 0; //restauration de la grille

                if (estim > meilleur) {
                    //on vient de trouver un meilleur coup
                    meilleur = estim;
                    if (meilleur > alpha) {
                        alpha = meilleur;
                        coup = [x,y];
                        if (alpha >= beta) {
                        /* ce coup donne un meilleur résultat qu'un autre coup de l'adversaire. Le coup précédent ne devrait
                           donc pas être joué, inutile  d'estimer les autres possibilités (principe de l'élagage alpha-beta). */
                            return profondeur ? meilleur : coup;
                        }
                    }
                }
            }
        }
        return profondeur ? (coup ? meilleur : 0) : coup; //si coup n'a pas été défini c'est qu'il n'y a plus de possibilité de jeu. C'est partie nulle.
    }
};

/* compte le nombre de possibilité dans une direction */
Gomoku.prototype.iaComptePossibilite = function(x, y, incX, incY) {
    var valeur, compteur = 0, couleur = this.plateau[x][y];
    while((valeur = this.couleurCase(x + (compteur + 1) * incX, y + (compteur + 1) * incY)) === couleur || valeur === 0) {
        compteur++;
    }
    return compteur;
};

/* estimation d'une position */
Gomoku.prototype.estimationPosition = function() {
    var estimation = 0; //estimation globale de la position
    for (var x = 0; x < this.taille; x++) {
        for (var y = 0; y < this.taille; y++) {
            if (this.plateau[x][y]) {
                estimation += this.iaAnalyse(x, y) * this.plateau[x][y]; //estimation de la valeur de cette pierre
            }
        }
    }
    return estimation;
};

/* permet de calculer le nombre de "libertés" pour la case donnée */
Gomoku.prototype.iaAnalyse = function(x, y) {
    var estimation = 0; //estimation pour toutes les directions
    var possible; //longueur d'une ligne possible dans une direction
    var effectueEstimation = function() {
        if (possible >= this.nbAligne) {
            //il est possible de gagner dans cette direction
            estimation += possible;
        }
    }.bind(this);
    //recherche horizontale
    possible = this.iaComptePossibilite(x, y, 1, 0) + this.iaComptePossibilite(x, y, -1, 0) + 1;
    effectueEstimation();
    //recherche verticale
    possible = this.iaComptePossibilite(x, y, 0, 1) + this.iaComptePossibilite(x, y, 0, -1) + 1;
    effectueEstimation();
    //recherche diagonale \
    possible = this.iaComptePossibilite(x, y, 1, 1) + this.iaComptePossibilite(x, y, -1, -1) + 1;
    effectueEstimation();
    //recherche diagonale /
    possible = this.iaComptePossibilite(x, y, -1, 1) + this.iaComptePossibilite(x, y, 1, -1) + 1;
    effectueEstimation();

    return estimation;
};

/* réception des ordres depuis le thread principal */
onmessage = function(evt) {
    var gomoku = new Gomoku();
    gomoku.IA.progres = 0;
    gomoku.plateau = evt.data.plateau;
    gomoku.tourDeJeu = evt.data.tourDeJeu;
    var coup = gomoku.joueIA(gomoku.tourDeJeu, 0, -Infinity, Infinity);
    // envoie le coup à jouer
    postMessage({ progres: -1, x: coup[0], y: coup[1] });
};
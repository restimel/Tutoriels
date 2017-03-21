/* Ce fichier sert à gérer les choix de configuration de l'utilisateur */

/* Ce préfixe sert à trouver les clefs dans le localStorage et identifier celles qui sont propres aux parties */
var lsPrefixePartie = "partie-gomoku-";

function prepareInterface() {
    document.getElementById("ouvrir-configuration").onclick = elementStyle("configuration-form", "block");
    document.getElementById("fermer-configuration").onclick = elementStyle("configuration-form", "none");
    document.getElementById("ia-joueur-noir").onchange = onChangeIA;
    document.getElementById("ia-joueur-blanc").onchange = onChangeIA;

    document.getElementById("ouvrir-gestion-partie").onclick = elementStyle("gestion-partie", "block");
    document.getElementById("fermer-gestion-partie").onclick = elementStyle("gestion-partie", "none");
    document.getElementById("sauve-partie").onclick = sauvegarde;

    document.getElementById("coup-precedent").onclick = partie.reculeCoup.bind(partie);
    document.getElementById("coup-suivant").onclick = partie.avanceCoup.bind(partie);
    chargeListeParties();
}

/* change le style "display" d'un élément.
   Cette fonction retourne une autre fonction afin d'être utilisée comme callback. */
function elementStyle(elementId, valeur) {
    return function() {
        document.getElementById(elementId).style.display = valeur;
    };
}

/* change la valeur max de la barre de progression */
function changeProgressionMax(valeur) {
    var el = document.getElementById("ia-progression");
    el.max = valeur;
    el.style.display = "block";
}

/* change la valeur de la barre de progression */
function changeProgression(valeur) {
    document.getElementById("ia-progression").value = valeur;
}

/* cache la barre de progression */
var cacheProgression = elementStyle("ia-progression", "none");

/* change l'état d'un joueur IA/Humain */
function onChangeIA(evt) {
    var couleur = evt.currentTarget.id === "ia-joueur-noir" ? "joueur1" : "joueur-1";
    partie.IA[couleur] = evt.currentTarget.checked;
}

/* Récupère la liste des parties dans le localStorage et l'affiche */
function chargeListeParties() {
    var elListe = document.getElementById("liste-parties");
    var el, clef;

    elListe.innerHTML = "";
    // parcourt la liste des objets dans le localStroage
    for (var i = 0; i < localStorage.length; i++) {
        clef = localStorage.key(i);
        if (clef.indexOf(lsPrefixePartie) !== 0) {
            // on ne garde que les objets relatifs aux parties de gomoku
            continue;
        }
        el = document.createElement("li");
        el.className = "chargement-partie";
        el.textContent = clef.substr(lsPrefixePartie.length);
        el.onclick = chargePartie.bind(null, clef);
        elListe.appendChild(el);
    }
}

/* Ajoute la partie au localStorage */
function sauvegarde() {
    var elNom = document.getElementById("nom-partie");
    var nom = elNom.value;

    if (nom === "") {
        alert("vous devez entrer un nom de partie pour la sauvegarde");
        return;
    }
    localStorage.setItem(lsPrefixePartie + nom, JSON.stringify(partie.coups));
    elNom.value = "";
    // met à jour la liste des parties
    chargeListeParties();
}

/* charge une partie depuis le localStorage */
function chargePartie(nom) {
    partie.recommence();
    partie.coups = JSON.parse(localStorage.getItem(nom));
    document.getElementById("gestion-partie").style.display = "none";
}

/* fonction d’annulation du comportement par défaut */
function survoler(evt) {
    evt.preventDefault();
}

/* gestion du dépôt de fichier */
function deposer(evt) {
    evt.preventDefault();
    //récupération du premier fichier déposé
    var fichier = evt.dataTransfer.files[0];
    var lecture = new FileReader();
    lecture.onloadend = function(evt) {
        var json, texte = evt.target.result;
        try {
            json = JSON.parse(texte);
            partie.recommence();
            partie.coups = json;
            alert("partie chargée");
        } catch(e) {
            alert("le fichier chargé n'est pas au bon format");
        }
    };
    lecture.readAsText(fichier);
}

prepareInterface();
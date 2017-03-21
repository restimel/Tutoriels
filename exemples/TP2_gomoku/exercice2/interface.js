/* Ce fichier sert à gérer les choix de configuration de l'utilisateur */

function prepareInterface() {
    document.getElementById("ouvrir-configuration").onclick = elementStyle("configuration-form", "block");
    document.getElementById("fermer-configuration").onclick = elementStyle("configuration-form", "none");
    document.getElementById("ia-joueur-noir").onchange = onChangeIA;
    document.getElementById("ia-joueur-blanc").onchange = onChangeIA;
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

prepareInterface();
/* Ce fichier set à gérer les interactions entre les différents composants. */
//liste des lieux créés
var lieux = [];

function preparation() {
    document.getElementById("nouveauLieu").onclick = ajouteLieu;
    afficheChoix();
    document.body.ondrop = chargeFichier;
    document.body.ondragover = entreBody;
    document.body.ondragenter = entreBody;
    document.body.ondragleave = sortBody;
}

function annuleEvent(event) {
    event.preventDefault();
    /* l'arrêt de propagation d'événément est utilisé pour
    s'assurer que dropEffect a la bonne propriété et
    n'est pas réécrit par celui de document.body */
    event.stopPropagation();
}

/* affiche une dialogue pour demander le nom de l'objet (lieu ou serveur) */
function afficheDialogue(titre, objet) {
    function sauveDialogue() {
        var elNom = document.getElementById("nomObjet");
        var nom = elNom.value;
        elNom.value = "";

        if (nom) {
            objet.setNom(nom);
            document.getElementById("dialogue-propriete").style.display = "none";
        }
    }
    document.getElementById("sauveObjet").onclick = sauveDialogue;
    document.getElementById("nouveauTitre").textContent = titre;
    document.getElementById("dialogue-propriete").style.display = "block";
}

/* affiche la liste des serveurs disponible */
function afficheChoix() {
    var choix = document.getElementById("choix");
    Serveur.types.forEach(function(type) {
        var img = document.createElement("img");
        img.src = type.image;
        img.className = "srv-image";
        img.id = type.type;
        img.title = type.titre;
        choix.appendChild(img);
    });

    // gestion du glisser/déposer depuis cette zone
    choix.ondragover = annuleEvent;
    choix.ondragstart = function(event) {
        event.dataTransfer.dropEffect = "copy";
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("text", "choix," + event.target.id);
    };
    // gestion du glisser/déposer vers cette zone
    choix.ondrop = function(event) {
        event.preventDefault();
        choix.className = "";
        // ne fait rien dans le cas où un fichier est chargé (c'est le <body> qui le gère)
        if (event.dataTransfer.files.length > 0) return;
        var ids = event.dataTransfer.getData("text").split(",");
        if (ids[0] === "choix") {
            return;
        }
        var lieu = lieux.find(function(lieu) {
            return lieu.id === ids[0];
        });
        var serveur = lieu.serveurs.find(function(serveur) {
            return serveur.id === ids[1];
        });
        lieu.enleveServeur(serveur);
    };
    choix.ondragenter = function() {
        choix.className = "peutDeposer";
    };
    choix.ondragleave = function() {
        choix.className = "";
    };
}

/* Crée un nouveau lieu */
function ajouteLieu(options) {
    var lieu = new Lieu(options);

    document.getElementById("lieux").insertBefore(
        lieu.element(),
        document.getElementById("nouveauLieu")
    );

    lieux.push(lieu);
}

/* se déclenche lorsqu'on veut déposer un objet dans le <body> */
function entreBody(event) {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
        //change le curseur lorsqu'un fichier va être déposé
        event.dataTransfer.dropEffect = "copy";
        document.body.className = "peutDeposer";
    } else {
        event.dataTransfer.dropEffect = "none";
    }
}

/* Enlève l'effet du <body> lorsqu'on ne dépose plus dessus */
function sortBody(event) {
    document.body.className = "";
}

/* charge une configuration depuis un fichier */
function chargeFichier(event) {
    var fichier = event.dataTransfer.files[0];
    var lecteur = new FileReader();

    event.preventDefault();
    document.body.className = "";
    // ne fait rien s'il n'y a pas de fichier
    if (event.dataTransfer.files.length === 0) return;

    // retire tous les lieux créé jusqu'à présent
    for (var i = lieux.length - 1; i >= 0; i--) {
        lieux[i].supprime();
    }
    lecteur.onload = function() {
        var lieux = JSON.parse(lecteur.result);
        //ajoute tous les lieux définis par le fichier
        for (var i = 0; i < lieux.length; i++) {
            ajouteLieu(lieux[i]);
        }
    };
    lecteur.readAsText(fichier);
}

/* Crée un incrément pour construire un id unique */
var idUnique = (function() {
    var id = 0;
    return function() {
        return id++;
    };
})();

preparation();
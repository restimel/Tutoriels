/* Ce fichier set à gérer les interactions entre les différents composants. */
//liste des lieux créés
var lieux = [];
/* position par défaut [lat, lng] */
var positionDefaut = [0, 0];
var positionUtilisateur = [0, 0];
/* objet global pour la manipulation de la carte */
/* bougeMarqueur est réécrit par la fonction afficheCarte */
 var carte, bougeMarqueur;

function preparation() {
    document.getElementById("nouveauLieu").onclick = ajouteLieu;
    afficheChoix();
    afficheLieux();
    document.body.ondrop = chargeFichier;
    document.body.ondragover = entreBody;
    document.body.ondragenter = entreBody;
    document.body.ondragleave = sortBody;

    // préparation de la carte
    carte = L.map("carte");
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OSM</a>"
    }).addTo(carte);
    carte.marqueur = L.marker([0,0], {draggable: true}).addTo(carte);
    carte.marqueur.on("move", function(event){bougeMarqueur(event)});
    carte.cercle = L.circle([0,0], {
        radius: 1,
        color: "#f00", fillColor: "#f03", fillOpacity: 0.5
    }).addTo(carte);
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(recuperePosition, erreurRecuperationPosition);
    } else {
        message("API geolocation non supportée");
    }

    // enregistrement automatique toutes les 5s
    setInterval(enregistrement, 5000);
}

function annuleEvent(event) {
    event.preventDefault();
    /* l'arrêt de propagation d'événément est utilisé pour
    s'assurer que dropEffect a la bonne propriété et
    n'est pas réécrit par celui de document.body */
    event.stopPropagation();
}

/* permet d'afficher des messages dans le bandeau */
function message(msg) {
    document.getElementById("message").textContent = msg;
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

/* permet d'afficher une dialogue contenant une carte avec la position du lieu */
function afficheCarte(lieu) {
    var position = positionDefaut;

    function fermeDialogue() {
        document.getElementById("dialogue-position").style.display = "none";
        calculeProximite();
    }
    /* affiche les coordonées du marqueur */
    function affiche() {
        document.getElementById("valeurPosition").value = lieu.position.join(" | ");
    }
    bougeMarqueur = function(event) {
        lieu.position = [event.latlng.lat, event.latlng.lng];
        affiche();
    }

    carte.marqueur.setLatLng(lieu.position);
    
    carte.setView(lieu.position, 12);

    document.getElementById("fermePosition").onclick = fermeDialogue;
    document.getElementById("dialogue-position").style.display = "block";
    affiche();
    // redessine la carte une fois que tous les éléments sont visibles
    carte._onResize();
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

/* affiche les lieux qui sont enregistré dans le localStorage */
function afficheLieux() {
    var lieuxMemoire = localStorage.getItem("infraManager");
    if (lieuxMemoire) {
        lieuxMemoire = JSON.parse(lieuxMemoire);
        lieuxMemoire.forEach(function(lieu) {
            ajouteLieu(lieu);
        });
    }
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

/* Enregistrement des lieux et serveurs dans le localStorage */
function enregistrement() {
    localStorage.setItem("infraManager", JSON.stringify(lieux));
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

/* cherche le lieu le plus proche */
function calculeProximite() {
    var lieu, dist, distMin = Infinity;
    for (var i = 0; i < lieux.length; i++) {
        dist = lieux[i].calculeDistance(positionUtilisateur);
        if (dist < distMin) {
            distMin = dist;
            lieu = lieux[i];
        }
    }
    message("Le lieu " + lieu.nom + " est le plus proche de vous");
}

/* Récupère la position de l'utilisateur */
function recuperePosition(position) {
    positionUtilisateur = [position.coords.latitude, position.coords.longitude];
    if (positionDefaut[0] === 0 && positionDefaut[1] === 0) positionDefaut = positionUtilisateur;

    // affiche la position de l'utilisateur et l'imprécision de la mesure
    carte.cercle.setLatLng(positionUtilisateur);
    carte.cercle.setRadius(position.coords.accuracy);
    calculeProximite();
}

function erreurRecuperationPosition(err) {
    message("La position n'a pas pu être récupérée (" + err.message + ")");
}

/* Crée un incrément pour construire un id unique */
var idUnique = (function() {
    var id = 0;
    return function() {
        return id++;
    };
})();

preparation();
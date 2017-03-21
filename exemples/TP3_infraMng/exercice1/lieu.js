/* ce fichier sert à définir les objets lieux et à gérer les interactions avec eux */
function Lieu(options) {
    options = options || {};

    this.nom = options.nom;
    this.id = "lieu" + idUnique();

    if (!this.nom) {
        afficheDialogue("Création d'un nouveau lieu", this);
    }

    // liste des serveurs associés à ce lieu
    this.serveurs = [];
}

/* conversion en objet JSON */
Lieu.prototype.toJSON = function() {
    return {
        nom: this.nom,
        serveurs: JSON.parse(JSON.stringify(this.serveurs))
    };
};

/* supprime le lieu */
Lieu.prototype.supprime = function() {
    var index = lieux.indexOf(this);
    lieux.splice(index, 1);
    this.el.remove();
};

/* crée l'élement HTML du lieu */
Lieu.prototype.element = function() {
    var el = document.createElement("div");
    el.className = "lieu";
    el.id = this.id;
    el.ondragstart = this.ondragstart.bind(this);
    el.ondragover = annuleEvent;
    el.ondrop = this.ondrop.bind(this);
    el.ondragenter = function() {
        el.className = "lieu peutDeposer";
    };
    el.ondragleave = function() {
        el.className = "lieu";
    };

    var titre = document.createElement("header");
    titre.textContent = this.nom || "nouveau";
    el.appendChild(titre);

    var serveurs = document.createElement("div");
    serveurs.className = "serveurs";
    this.serveurs.forEach(function(serveur) {
        serveurs.appendChild(serveur.element());
    });
    el.appendChild(serveurs);

    var supprime = document.createElement("div");
    supprime.className = "supprimeLieu";
    supprime.onclick = this.supprime.bind(this);
    supprime.textContent = "×";
    el.appendChild(supprime);

    this.el = el;
    return el;
};

/* définit le nom du lieu */
Lieu.prototype.setNom = function(valeur) {
    this.nom = valeur;
    if (this.el) {
        this.el.querySelector("header").textContent = valeur;
    }
};

/* ajoute un serveur au lieu */
Lieu.prototype.ajouteServeur = function(serveur) {
    this.serveurs.push(serveur);
    this.el.querySelector(".serveurs").appendChild(serveur.element());
};

/* enlève un serveur au lieu */
Lieu.prototype.enleveServeur = function(serveur) {
    var index = this.serveurs.indexOf(serveur);
    
    this.serveurs.splice(index, 1);
    this.el.querySelector(".serveurs").removeChild(serveur.element());
};

/* commence un glisser/déposer */
Lieu.prototype.ondragstart = function(event) {
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text", this.id + "," + event.target.id);
};

/* dépose un serveur dans ce lieu */
Lieu.prototype.ondrop = function(event) {
    var ids = event.dataTransfer.getData("text").split(",");
    var lieu, serveur;

    event.preventDefault();
    this.el.className = "lieu";
    if (event.dataTransfer.files.length > 0) {
        // ne fait rien dans le cas où un fichier est chargé
        return;
    }
    if (ids[0] === "choix") {
        serveur = new Serveur({type: ids[1]});
    } else {
        lieu = lieux.find(function(lieu) {
            return lieu.id === ids[0];
        });
        serveur = lieu.serveurs.find(function(obj) {
            return obj.id === ids[1];
        });

        lieu.enleveServeur(serveur);
    }
    this.ajouteServeur(serveur);
};

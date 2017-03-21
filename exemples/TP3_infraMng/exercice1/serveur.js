/* Ce fichier sert à définir les objets serveurs et à gérer les interactions avec eux */
function Serveur(options) {
    options = options || {};

    this.nom = options.nom;
    this.type = Serveur.types.find(function(type) {return type.type === options.type;});
    this.id = "serveur" + idUnique();

    if (!this.nom) {
        afficheDialogue("Création d'un nouveau " + this.type.titre, this);
    }
}

/* liste des images pour les serveurs disponibles */
Serveur.types = [
    {type: "web", image: "images/serveurWWW.svg", titre:"serveur web"},
    {type: "app", image: "images/serveurApp.svg", titre: "serveur applicatif"},
    {type: "proxy", image: "images/serveurProxy.svg", titre: "serveur proxy"},
    {type: "fw", image: "images/serveurFW.svg", titre: "firewall"},
    {type: "bdd", image: "images/db.svg", titre: "serveur de base de données"},
];

/* conversion en objet JSON */
Serveur.prototype.toJSON = function() {
    return {
        nom: this.nom,
        type: this.type.type
    };
};

/* crée ou récupère l'élement HTML du serveur */
Serveur.prototype.element = function() {
    if (this.el) {
        return this.el;
    }
    var el = document.createElement("div");
    el.className = "serveur";
    el.id = this.id;
    el.title = this.type.titre;
    el.draggable = true;

    var image = document.createElement("img");
    image.className = "srv-image";
    image.src = this.type.image;
    image.draggable = false;
    el.appendChild(image);

    var titre = document.createElement("header");
    titre.textContent = this.nom;
    el.appendChild(titre);

    this.el = el;
    return el;
};

/* définit le nom du serveur */
Serveur.prototype.setNom = function(valeur) {
    this.nom = valeur;
    if (this.el) {
        this.el.querySelector("header").textContent = valeur;
    }
};

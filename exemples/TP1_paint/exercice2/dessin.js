/* Ce fichier sert à gérer les interaction avec le canvas et à dessiner dessus en fonction des outils.
Il y a 2 cnavas: "dessin" (qui sert à afficher le dessin final et "brouillon" qui sert à gérer toutes les interactions éphémères. */

function prepareCanvas() {
    var hauteurOutils = cfg.hauteurOutils;
    var marge = cfg.marge;
    var dessin = document.getElementById("dessin");
    var brouillon = document.getElementById("brouillon");

    // définit la taille du canvas selon la fenêtre
    dessin.width = window.innerWidth - marge;
    dessin.height = window.innerHeight - hauteurOutils - marge;
    dessin.style.top = hauteurOutils + "px";
    brouillon.width = window.innerWidth - marge;
    brouillon.height = window.innerHeight - hauteurOutils - marge;
    brouillon.style.top = hauteurOutils + "px";

    // création des listeners
    brouillon.onmousedown = onCommenceDessin;
    brouillon.onmouseup = onArreteDessin;
    brouillon.onmousemove = onDessine;

    // définit la configuration locale
    cfg.ctx = dessin.getContext("2d");
    cfg.brouillon = brouillon.getContext("2d");
    cfg.dernierPoint = [];
    cfg.sizeX = dessin.width;
    cfg.sizeY = dessin.height;
}

// trace tous les points entre le dernier point et celui demandé afin d'éviter un effet pointillé
function trait(f, contexte, X, Y) {
    var dx, dy, x, y, x0, y0, d, i;

    if (cfg.dernierPoint.length === 0) {
        x = X;
        y = Y;
    } else {
        x0 = cfg.dernierPoint[0];
        y0 = cfg.dernierPoint[1];

        // calcule les incréments entre le dernier point et celui demandé
        dx = X - x0;
        dy = Y - y0;

        // calcule l'incrément minimal pour avancer de 1 px
        d = Math.max(Math.abs(dx), Math.abs(dy));
        dx = dx / d;
        dy = dy / d;

        // trace toutes les formes entre le dernier point et celui demandé
        x = x0;
        y = y0;
        for (i = 1; i < d; i++) {
            x += dx;
            y += dy;
            f(contexte, x, y);
        }
    }

    // affiche la forme qui est sous la souris
    f(contexte, x, y);
}

function onCommenceDessin(evt) {
    cfg.dessine = true;
    cfg.initX = evt.offsetX;
    cfg.initY = evt.offsetY;
    cfg.ctx.fillStyle = cfg.couleur;
    cfg.ctx.strokeStyle = cfg.couleur;
    cfg.brouillon.fillStyle = cfg.couleur;
    cfg.brouillon.strokeStyle = cfg.couleur;
    cfg.ctx.lineWidth = cfg.taille;
    cfg.brouillon.lineWidth = cfg.taille;

    onDessine(evt);
}

function onArreteDessin(evt) {
    var x = evt.offsetX, y = evt.offsetY;

    cfg.dessine = false;
    cfg.dernierPoint = [];

    // dessine les formes définitive
    switch(cfg.forme) {
        case "rectangle": traceRect(cfg.ctx, x, y); break;
        case "cercle": traceCercle(cfg.ctx, x, y, false); break;
        case "copie": copie(cfg.ctx, x, y); break;
        case "colle": colle(cfg.ctx, x, y, true); break;
    }
}

function onDessine(evt) {
    var x = evt.offsetX, y = evt.offsetY;

    // efface le brouillon
    cfg.brouillon.clearRect(0, 0, cfg.sizeX, cfg.sizeY);

    // dessine sur le canvas principal
    if (cfg.dessine) {
        switch(cfg.forme) {
            case "rond": trait(traceRond, cfg.ctx, x, y); break;
            case "carre": trait(traceCarre, cfg.ctx, x, y); break;
            case "gomme": trait(effaceGomme, cfg.ctx, x, y); break;
            case "rectangle": traceRect(cfg.brouillon, x, y); break;
            case "cercle": traceCercle(cfg.brouillon, x, y, true); break;
            case "copie":
                cfg.brouillon.save();
                cfg.brouillon.strokeStyle = "black";
                cfg.brouillon.lineWidth = 1;
                cfg.brouillon.setLineDash([4, 2]);
                traceRect(cfg.brouillon, x, y);
                cfg.brouillon.restore();
                break;
        }
        cfg.dernierPoint = [x, y];
    }

    // affiche l'outil sur le brouillon
    switch(cfg.forme) {
        case "rond": traceRond(cfg.brouillon, x, y); break;
        case "carre": traceCarre(cfg.brouillon, x, y); break;
        case "gomme": 
            cfg.brouillon.save();
            cfg.brouillon.fillStyle = "white";
            traceCarre(cfg.brouillon, x, y);
            cfg.brouillon.restore();
            break;
        case "colle": colle(cfg.brouillon, x, y); break;
    }
}

function effaceGomme(contexte, x, y) {
    var top = y - cfg.taille / 2;
    var left = x - cfg.taille / 2;
    contexte.clearRect(left, top, cfg.taille, cfg.taille);
}

function traceCarre(contexte, x, y) {
    var top = y - cfg.taille / 2;
    var left = x - cfg.taille / 2;
    contexte.fillRect(left, top, cfg.taille, cfg.taille);
}

function traceRond(contexte, x, y) {
    contexte.beginPath();
    contexte.arc(x, y, cfg.taille / 2, 0, 2 * Math.PI);
    contexte.fill();
}

function traceRect(contexte, x, y) {
    var largeur = x - cfg.initX;
    var hauteur = y - cfg.initY;
    contexte.strokeRect(cfg.initX, cfg.initY, largeur, hauteur);
}

function traceCercle(contexte, x, y, traceCentre) {
    var dx = x - cfg.initX;
    var dy = y - cfg.initY;
    var rayon = Math.sqrt(dx * dx + dy * dy);

    // dessine le cercle
    contexte.beginPath();
    contexte.arc(cfg.initX, cfg.initY, rayon, 0, 2 * Math.PI);
    contexte.stroke();

    if (traceCentre) {
        // dessine le centre (une croix)
        contexte.beginPath();
        contexte.save();
        contexte.lineWidth = 2;
        contexte.strokeStyle = "black";
        contexte.moveTo(cfg.initX, cfg.initY - 10);
        contexte.lineTo(cfg.initX, cfg.initY + 10);
        contexte.moveTo(cfg.initX - 10, cfg.initY);
        contexte.lineTo(cfg.initX + 10, cfg.initY);
        contexte.stroke();
        contexte.restore();
    }
}

function copie(contexte, x, y) {
    cfg.imageData = cfg.ctx.getImageData(cfg.initX, cfg.initY, x - cfg.initX, y - cfg.initY);
}

function colle(contexte, x, y, compose) {
    var imageData = cfg.imageData;
    if (imageData) {
        x -= Math.round(imageData.width/2);
        y -= Math.round(imageData.height/2);

        if (compose) {
            imageData = contexte.getImageData(x, y, imageData.width, imageData.height);
            for (var i = 0, l = imageData.data.length; i < l; i += 4) {
                // remplace le pixel lorsque ce n'est pas transparent
                if (cfg.imageData.data[i + 3] !== 0) {
                    imageData.data[i] = cfg.imageData.data[i];
                    imageData.data[i + 1] = cfg.imageData.data[i + 1];
                    imageData.data[i + 2] = cfg.imageData.data[i + 2];
                    imageData.data[i + 3] = cfg.imageData.data[i + 3];
                }
            }
        }
        contexte.putImageData(imageData, x, y);
    }
}

prepareCanvas();

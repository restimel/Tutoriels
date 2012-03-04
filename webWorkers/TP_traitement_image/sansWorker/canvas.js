/*
 * création de la zone d'interaction
 */

//création d'un zone d'affichage pour les options liées au Canvas
var outils = document.createElement("menu");
document.body.appendChild(outils);

//création du canvas
var canvas = document.createElement("canvas");
canvas.addEventListener("mousedown",function(event){
		canvas.addEventListener("mousemove",draw,false);
		draw(event);
	},false);
canvas.addEventListener("mouseup",function(event){
		canvas.removeEventListener("mousemove",draw,false);
	},false);
canvas.addEventListener("mouseout",function(event){
		canvas.removeEventListener("mousemove",draw,false);
	},false);
canvas.width = window.innerWidth - 320; //largeur du canvas
canvas.height = window.innerHeight - 120; //hauteur du canvas
document.body.appendChild(canvas);

//création des options de modification du pinceau
var elem_couleur = document.createElement("input");
elem_couleur.type = "color";
elem_couleur.value = "#000000";
elem_couleur.addEventListener("change",function(){ctx.fillStyle=this.value;},false);
outils.appendChild(elem_couleur);

var elem_taille = document.createElement("input");
elem_taille.type = "number";
elem_taille.min = 1;
elem_taille.value = 20;
elem_taille.title = "Taille du pinceau";
outils.appendChild(elem_taille);

//création d'un bouton de reset
var elem_reset = document.createElement("button");
elem_reset.textContent = "Reset";
elem_reset.addEventListener("click",erase,false);
outils.appendChild(elem_reset);


/**
 * Fonctions de gestion du Canvas
 */
function erase(){
	ctx.save();
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
}

//permet de dessiner dans le canvas au niveau du curseur
function draw(event){
	var x = event.offsetX,//on récupère la position de la souris sur le canvas
		y = event.offsetY;
	ctx.beginPath();
	ctx.arc(x,y,elem_taille.value,0,Math.PI*2,true);//on trace un cercle
	ctx.fill();
}


/*
 * Initialisation
 */
var ctx = canvas.getContext("2d"); //référence au contexte de dessin
ctx.fillStyle = elem_couleur.value;

erase();


/**
	Ce fichier permet de regrouper toutes les fonctions liées à l'affichage du jeu de la vie
*/
var canvas = document.getElementById("canvas"); // référence à l'élément canvas

if (canvas.getContext) {
	var ctx = canvas.getContext("2d"); //référence au contexte de dessin
	erase();
}else{
	alert("Votre navigateur ne supporte pas CANVAS");
}

function erase(){
	ctx.clearRect (0, 0, canvas.width, canvas.height);
}

/**
	permet d'afficher la grille dans le canvas
		si px et py sont renseignés seul le pixel (px,py) est mis à jour
*/
function afficheGrille(grille, px,py){
	var x=0,
		lx=grille.length,
		y=0,
		ly=grille[0].length,
		tailleX=canvas.width/lx,
		tailleY=canvas.height/ly;
	if(px && py){
		x=px,y=py;
		if(grille[x][y]){
			ctx.fillRect (x*tailleX, y*tailleY, tailleX, tailleY);
		}
	}else{
		erase();
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		do{
			y=0;
			do{
				if(grille[x][y]){
					ctx.fillRect (x*tailleX, y*tailleY, tailleX, tailleY);
				}
			}while(++y<ly);
		}while(++x<lx);
	}
}

/**********************
Interactions
**********************/

/**
	Permet de redimensionner le canvas
*/
function sizeCanvas(){
	canvas.width=Math.floor(document.getElementById("canvasWidth").value*window.innerWidth/100);
	canvas.height=Math.floor(document.getElementById("canvasHeight").value*window.innerHeight/100);

	afficheGrille(grille);
}

/**
	agit sur la grille en fonction de la position du curseur
*/
var actionCanvas =(function(){
	var precedent=[0,0];
	return function (event,init){
		var x = Math.floor(offset_X(event)/canvas.width*grille.length),
			y = Math.floor(offset_Y(event)/canvas.height*grille[0].length);
		if(init || precedent[0]!==x || precedent[1]!==y){
			grille[x][y] = !grille[x][y];
			afficheGrille(grille,x,y);
			precedent=[x,y];
		}
	}
})();

/**
	enlève les listeners précédemment placés
*/
function removeListener(){
	canvas.removeEventListener("mousemove",actionCanvas,false);
	document.body.removeEventListener("mouseup",removeListener,false);
	document.body.removeEventListener("mouseout",removeListener,false);
}

/**
	Action a effectuer lorsque l'utilisateur clique sur le canvas
*/
function cliqueCanvas(event){
	canvas.addEventListener("mousemove",actionCanvas,false);
	document.body.addEventListener("mouseup",removeListener,false);
	document.body.addEventListener("mouseout",removeListener,false);
	actionCanvas(event,true);
}

/*********************************************
	Complément de support
*/
//permet de redéfinir la fonction event.offsetX
if(typeof(offset_X)==="undefined"){
	function offset_X(event){
		if(event.offsetX) return event.offsetX;
		var el = event.target, ox = -el.offsetLeft;
		while(el=el.offsetParent){
			ox += el.scrollLeft - el.offsetLeft;
		}
		if(window.scrollX){
			ox += window.scrollX;
		}
		return event.clientX + ox -7; //l'origine du -7 est mystérieuse peut-être la bordure de la fenêtre
	}
}

//permet de redéfinir la fonction event.offsetY
if(typeof(offset_Y)==="undefined"){
	function offset_Y(event){
		if(event.offsetY) return event.offsetY;
		var el = event.target, oy = -el.offsetTop;
		while(el=el.offsetParent){
			oy += el.scrollTop - el.offsetTop;
		}
		if(window.scrollY){
			oy += window.scrollY;
		}
		return event.clientY + oy -7; //l'origine du -7 est mystérieuse peut-être la bordure de la fenêtre
	}
}

/*********************************************
*/

/*
 * création de la zone d'interaction
 */
var canvas_width = document.body.clientWidth - 300;
var canvas_height = Math.round(canvas_width/3);
//alert(canvas_height);

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
canvas.width = canvas_width;
canvas.height = canvas_height;
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
elem_taille.value = 10;
elem_taille.title = "Taille du pinceau";
outils.appendChild(elem_taille);

//création d'un bouton de reset
var elem_reset = document.createElement("button");
elem_reset.textContent = "Reset";
elem_reset.addEventListener("click",erase,false);
outils.appendChild(elem_reset);


//Création d'une zone pour réaliser des traitements sur l'image
var elem_zoneTraitement = document.createElement("aside");
elem_zoneTraitement.className = "traitement";
document.body.appendChild(elem_zoneTraitement);

//ajout d'une liste de filtre
elem_zoneTraitement.appendChild( document.createTextNode("Filtre : ") );
var elem_listeFiltre = document.createElement("select");
elem_zoneTraitement.appendChild(elem_listeFiltre);

//ajout du bouton de démarrage
var btn_run = document.createElement("button");
btn_run.textContent = "Appliquer ce filtre";
btn_run.addEventListener("click",prepareFiltre,false);
elem_zoneTraitement.appendChild(btn_run);

//création de la zone de résultat
var elem_result = document.createElement("table");
elem_zoneTraitement.appendChild(elem_result);

//création d'une zone d'affichage pour le zoom du résultat
var elem_zoom = document.createElement("div");
elem_zoom.className = "zoom";
elem_zoneTraitement.appendChild(elem_zoom);

//création d'un canvas pour voir le résultat des filtres
var elem_canvasZoom = document.createElement("canvas");
elem_canvasZoom.width = canvas_width;
elem_canvasZoom.height = canvas_height;
elem_zoom.appendChild(elem_canvasZoom);


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
		var x = offset_X(event),
			y = offset_Y(event);
		ctx.beginPath();
		ctx.arc(x,y,elem_taille.value,0,Math.PI*2,true);
		ctx.fill();
}

/**
 * Fonctions de gestion des filtres
 */
var listeFiltre = [
{
	nom:"Flou (petit)",
	filtre:[
		[1/10,1/10,1/10],
		[1/10,2/10,1/10],
		[1/10,1/10,1/10]
	]
},
{
	nom:"Flou (moyen)",
	filtre:[
		[1/26,1/26,1/26,1/26,1/26],
		[1/26,1/26,1/26,1/26,1/26],
		[1/26,1/26,2/26,1/26,1/26],
		[1/26,1/26,1/26,1/26,1/26],
		[1/26,1/26,1/26,1/26,1/26]
	]
},
{
	nom:"Flou (grand)",
	filtre:[
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,2/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50]
	]
},
{
	nom:"Flou Gaussien (moyen, σ=0.7)",
	filtre:[
		[0.0001,0.002,0.0055,0.002,0.0001],
		[0.002,0.0422,0.1171,0.0422,0.002],
		[0.0055,0.1171,0.3248,0.1171,0.0055],
		[0.002,0.0422,0.1171,0.0422,0.002],
		[0.0001,0.002,0.0055,0.002,0.0001]
	]
},
{
	nom:"Filtre de Laplace (petit)",
	filtre:[
		[-1,-1,-1],
		[-1,8,-1],
		[-1,-1,-1]
	]
},
{
	nom:"Sobel (vertical)",
	filtre:[
		[-1,0,1],
		[-2,0,2],
		[-1,0,1]
	]
},
{
	nom:"Sobel (horizontal)",
	filtre:[
		[-1,-2,-1],
		[0,0,0],
		[1,2,1]
	]
}
];

//permet de préparer la liste des filtres disponibles
function generateFilterList(){
	var i = 0,
		li = listeFiltre.length,
		option;
	do{
		option = document.createElement("option");
		option.textContent = listeFiltre[i].nom;
		option.value = i;
		elem_listeFiltre.add(option, null);
	}while(++i<li);
}

//permet de préparer tout ce qui est nécessaire pour appliquer le filtre sur le canvas
function prepareFiltre(){
	var idFiltre = elem_listeFiltre.value;
	
	var image1D = []; //contiendra la liste des pixels correspondant à l'image du Canvas
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); //récupération des données binaires du Canvas
	if(imageData){
		// on a réussi à extraire les données du Canvas, dans ce cas on remplit imagePixels
		image1D = imageData.data;
	}//si on n'a pas réussi à extraire les données, alors on laisse le tableau vide.
	
	//génération d'une nouvelle ligne de résultat
	var ligne = elem_result.insertRow(-1);
	var cellule = ligne.insertCell(0);
	cellule.textContent = listeFiltre[idFiltre].nom;
	
	cellule = ligne.insertCell(1);
	cellule.id = "filtre_"+uid;
	cellule.textContent = "en cours de génération";
	
	var image2D = conversionImage(image1D,canvas.width); //prepare l'image en 2D (+RVB)
	image2D = appliquerFiltre(image2D, idFiltre, uid);//on applique le filtre à l'image
	finalisationFiltre(image2D,uid++); //on affiche le résultat
}

//permet de convertir un tableaude pixel 1D en 2D
function conversionImage(image1D,w,uid){
	//prepare l'image en 2D (+RVB)
	var image2D = [],
		i,
		x=0,
		y=0,
		li = image1D.length;
	
	for(i=0 ; i<li; i++){
		if(y===0){
			image2D[x]=[];
		}
		image2D[x][y]=[];
		image2D[x][y][0]=image1D[i++];
		image2D[x][y][1]=image1D[i++];
		image2D[x][y][2]=image1D[i++];
		if(++x>=w){
			x=0;
			y++;
		}
	}
	
	return image2D;
}

//permet d'appliquer le filtre sur l'image
function appliquerFiltre(image, idFiltre){
	var filtre = (listeFiltre[idFiltre] && listeFiltre[idFiltre].filtre) || [[]], //récupère le filtre s'il existe ou alors génère un filtre vide
		imgX, //position X sur l'image
		imgY, //position Y sur l'image
		imgMaxX = image.length, // largeur de l'image
		imgMaxY = image[0].length, //hauteur de l'image
		fltX, //position X sur le filtre
		fltY, //position Y sur le filtre
		fltMaxX = filtre.length, //largeur du filtre
		fltMaxY = filtre[0].length, //hauteur du filtre
		fltOffsetX = (fltMaxX - 1)/2, //offset X à appliquer sur le filtre pour trouver le bon pixel sur l'image
		fltOffsetY = (fltMaxY - 1)/2, //offset Y à appliquer sur le filtre pour trouver le bon pixel sur l'image
		index, //sert à identifier la position par rapport à la liste des pixels
		sommeRouge, //valeur temporaire pour l'application du filtre sur un pixel
		sommeVert, //valeur temporaire pour l'application du filtre sur un pixel
		sommeBleu, //valeur temporaire pour l'application du filtre sur un pixel
		x, //index X temporaire pour chercher le bon pixel dans l'image
		y, //index Y temporaire pour chercher le bon pixel dans l'image
		imageFinale=[]; // liste des pixels finales
	
	imageX:for(imgX = 0; imgX<imgMaxX; imgX++){
		imageFinale[imgX] = [];
		imageY:for(imgY = 0; imgY<imgMaxY; imgY++){
			sommeRouge = 0;
			sommeVert = 0;
			sommeBleu = 0;
			filtreX:for(fltX = 0; fltX<fltMaxX; fltX++){
				x = imgX + fltX + fltOffsetX;
				if( x < 0 || x >= imgMaxX){
					continue filtreX;
				}
				filtreY:for(fltY = 0; fltY<fltMaxY; fltY++){
					y = imgY + fltY + fltOffsetY;
					if( y < 0 || y >= imgMaxY){
						continue filtreY;
					}
					sommeRouge += image[x][y][0] * filtre[fltX][fltY];
					sommeVert += image[x][y][1] * filtre[fltX][fltY];
					sommeBleu += image[x][y][2] * filtre[fltX][fltY];
				}
			}
			imageFinale[imgX][imgY] = [sommeRouge, sommeVert, sommeBleu];
		}
	}

	return imageFinale;
}

//permet d'afficher le résultat du filtre
function finalisationFiltre(image2D,uid){
	//création du canvas résultat
	var canvas = document.createElement("canvas");
	canvas.width = canvas_width;
	canvas.height = canvas_height;
	canvas.className = "filteredCanvas";

	var elem=document.getElementById("filtre_"+uid);
	elem.removeChild(elem.firstChild);
	elem.appendChild(canvas);
	
	elem.parentNode.onmouseover = zoomCanvasOver;
	elem.parentNode.onmouseout = zoomCanvasOut;
	
	var ctx = canvas.getContext("2d");
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	var x,
		y,
		lx = image2D.length,
		ly = image2D[0].length,
		i=0,
		image1D = imageData.data;
	
	for(y = 0; y<ly; y++){
		for(x = 0; x<lx; x++){
			image1D[i++] = image2D[x][y][0];
			image1D[i++] = image2D[x][y][1];
			image1D[i++] = image2D[x][y][2];
			image1D[i++] = image2D[x][y][3] || 255;
		}
	}
	
	ctx.putImageData(imageData,0,0);
}

//permet d'afficher en plus grand un résultat
function zoomCanvasOver(event){
	var fcanvas = this.lastChild.firstChild;
	if(fcanvas.nodeName !== "CANVAS"){
		return false;
	}
	var ctx = fcanvas.getContext("2d"),
		imageData = ctx.getImageData(0,0,canvas_width,canvas_height);
	ctx = elem_canvasZoom.getContext("2d");
	ctx.putImageData(imageData,0,0);
	elem_zoom.style.display = "block";
}

//enlève l'affichage de résultat
function zoomCanvasOut(event){
	elem_zoom.style.display = "none";
}


/**
 * Shim & polyfill
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
		return event.clientX + ox -7;
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
		return event.clientY + oy -7;
	}
}


/*
 * Initialisation
 */
var ctx = canvas.getContext("2d"); //référence au contexte de dessin
ctx.fillStyle = elem_couleur.value;

var uid = 0; //id unique pour identifier le traitement

erase();
generateFilterList();

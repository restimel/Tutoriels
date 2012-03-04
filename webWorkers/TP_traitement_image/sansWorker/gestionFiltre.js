/*
 * création de la zone d'interaction
 */

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
elem_canvasZoom.width = canvas.width;
elem_canvasZoom.height = canvas.height;
elem_zoom.appendChild(elem_canvasZoom);



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
	
	//on parcourt tous les pixels de l'image
	imageX:for(imgX = 0; imgX<imgMaxX; imgX++){
		imageFinale[imgX] = [];
		imageY:for(imgY = 0; imgY<imgMaxY; imgY++){
			sommeRouge = 0;
			sommeVert = 0;
			sommeBleu = 0;
			
			//on parcourt toutes les valeurs du filtre
			filtreX:for(fltX = 0; fltX<fltMaxX; fltX++){
				x = imgX + fltX - fltOffsetX; //on calcule la valeur de x de l'image sur laquelle est appliqué le filtre
				if( x < 0 || x >= imgMaxX){
					//on est en dehors de l'image
					continue filtreX;
				}
				filtreY:for(fltY = 0; fltY<fltMaxY; fltY++){
					y = imgY + fltY - fltOffsetY; //on calcule la valeur de y de l'image sur laquelle est appliqué le filtre
					if( y < 0 || y >= imgMaxY){
						//on est en dehors de l'image
						continue filtreY;
					}
					//on effectue les sommes
					sommeRouge += image[x][y][0] * filtre[fltX][fltY];
					sommeVert += image[x][y][1] * filtre[fltX][fltY];
					sommeBleu += image[x][y][2] * filtre[fltX][fltY];
				}
			}
			//on affecte le résultat au pixel cible
			imageFinale[imgX][imgY] = [sommeRouge, sommeVert, sommeBleu];
		}
	}
	
	return imageFinale;
}

//permet d'afficher le résultat du filtre
function finalisationFiltre(image2D,uid){
	//création du canvas résultat
	var canvasResult = document.createElement("canvas");
	canvasResult.width = canvas.width;
	canvasResult.height = canvas.height;
	canvasResult.className = "filteredCanvas";
	
	var elem=document.getElementById("filtre_"+uid);
	elem.removeChild(elem.firstChild);
	elem.appendChild(canvasResult);
	
	elem.parentNode.onmouseover = zoomCanvasOver;
	elem.parentNode.onmouseout = zoomCanvasOut;
	
	var ctx = canvasResult.getContext("2d");
	var imageData = ctx.getImageData(0, 0, canvasResult.width, canvasResult.height);
	
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
	imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	ctx = elem_canvasZoom.getContext("2d");
	ctx.putImageData(imageData,0,0);
	elem_zoom.style.display = "block";
}

//enlève l'affichage de résultat
function zoomCanvasOut(event){
	elem_zoom.style.display = "none";
}


/*
 * Initialisation
 */

var uid = 0; //id unique de traitement pour identifier la bonne ligne
generateFilterList(); //on remplit le select
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
 
//ajout d'un script permettant de définir la liste des filtres (création de la variable globale listeFiltre)
var scr_filtre = document.createElement("script");
scr_filtre.src = "filtres.js";
document.body.appendChild(scr_filtre);

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
	
	var progressBar = document.createElement("progress");
	progressBar.max = 200;
	progressBar.id = "progress_"+uid;
	cellule.appendChild(progressBar);

	if(worker){
		//if(image1D instanceof Array){
		try{
			worker.postMessage({idFiltre:idFiltre,image:image1D,width:canvas.width,uid:uid});
		}catch(e){
			worker.postMessage({idFiltre:idFiltre,image:JSON.stringify(image1D),width:canvas.width,uid:uid});
		}
		uid++;
		worker = createNewWorker(); //on crée un nouveau worker afin de pouvoir lancer un 2e filtre en même temps.
	}else{
		var image2D = conversionImage(image1D,canvas.width); //prepare l'image en 2D (+RVB)
		image2D = appliquerFiltre(image2D, idFiltre, uid);//on applique le filtre à l'image
		finalisationFiltre(image2D,uid++); //on affiche le résultat
	}
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
 * gestion des workers
 */
function createNewWorker(){
	var w = new Worker("traitement.js");
	w.onmessage = function(event){
		var data = event.data;
		switch(data.status){
			case "start": //surtout pour le debug
				console.log("traitement commencé pour "+data.uid);
			break;
			case "debug": //debug
console.log("debug...");				
console.debug(data.debug);
				break;
			case "update":
				var elem = document.getElementById("progress_"+data.uid);
				if(elem){
					elem.value = data.progression;
					elem.textContent = Math.round(data.progression/2) +"%";
				}
			break;
			case "end":
				finalisationFiltre(data.image,data.uid);
				w.terminate(); //le worker a fini sa tâche, on ne le réutilisera plus
			break;
		}
	}
	w.onerror=function(e){console.error(e);}; // pour aider à déboguer
	return w;
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

if(window.Worker){
	var worker = createNewWorker();
}else{
	var scrpt_traitement = document.createElement("script");
	scrpt_traitement.src = "traitement.js";
	document.body.appendChild(scrpt_traitement);
}

window.onload=function(){
	erase();
	generateFilterList();
}

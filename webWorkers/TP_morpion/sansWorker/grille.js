var nx = 7; //nombre de cellules en largeur
var ny = 7; //nombre de cellules en hauteur
var nbAlligne = 5; //nombre de jetons à alligner pour gagner
var couleurTour = 1; //couleur dont c'est le tour
var continueJeu = false; //permet d'indquer si le jeu est arrêté ou non

var iaProfondeurMax = 4; //indique la profondeur de recherche de l'IA
var iaNoir = false; //indique si le joueur noir est une IA
var iaBlanc = true; //indique si le joueur blanc est une IA

var grille = []; //grille du jeu

var elemTable; //element contenant les éléments d'affichage du jeu
var elemIA; //element indiquant que l'ordinateur réfléchi

//Affichage des éléments pour le paramétrage
function affichageDOM(){
	//Règles
	var fieldset = document.createElement("fieldset");
	var legend = document.createElement("legend");
	legend.textContent = "Règles";
	fieldset.appendChild(legend);

	//NX
	var label = document.createElement("label");
	label.textContent = "Largeur :";
	var input = document.createElement("input");
	input.type="number";
	input.min=1;
	input.value=nx;
	input.onchange=function(){nx=this.value;};
	label.appendChild(input);
	fieldset.appendChild(label);

	//NY
	label = document.createElement("label");
	label.textContent = "Hauteur :";
	input = document.createElement("input");
	input.type="number";
	input.min=1;
	input.value=ny;
	input.onchange=function(){ny=this.value;};
	label.appendChild(input);
	fieldset.appendChild(label);

	//alligne
	label = document.createElement("label");
	label.textContent = "Nombre de jetons à alligner pour gagner :";
	input = document.createElement("input");
	input.type="number";
	input.min=1;
	input.value=nbAlligne;
	input.onchange=function(){nbAlligne=this.value;};
	label.appendChild(input);
	fieldset.appendChild(label);
	
	document.body.appendChild(fieldset);
	
	//Pour l'IA
	fieldset = document.createElement("fieldset");
	legend = document.createElement("legend");
	legend.textContent = "configuration de l'IA";
	fieldset.appendChild(legend);

	//IA noir?
	label = document.createElement("label");
	label.textContent = "Le joueur noir est un ordinateur :";
	input = document.createElement("input");
	input.type="checkbox";
	input.checked=false;
	input.onchange=function(){
		iaNoir=this.checked;
		iaToPlay(); //on vérifie si c'est au tour de l'IA de jouer
	};
	label.appendChild(input);
	fieldset.appendChild(label);
	
	//IA blanc?
	label = document.createElement("label");
	label.textContent = "Le joueur blanc est un ordinateur :";
	input = document.createElement("input");
	input.type="checkbox";
	input.checked=true;
	input.onchange=function(){
		iaBlanc=this.checked;
		iaToPlay(); //on vérifie si c'est au tour de l'IA de jouer
	};
	label.appendChild(input);
	fieldset.appendChild(label);
	
	//Profondeur
	label = document.createElement("label");
	label.textContent = "Profondeur de recherche :";
	input = document.createElement("input");
	input.type="number";
	input.min=1;
	input.value=iaProfondeurMax;
	input.onchange=function(){iaProfondeurMax=this.value;};
	label.appendChild(input);
	fieldset.appendChild(label);
	
	document.body.appendChild(fieldset);

	//bouton permettant de lancer la partie
	var btnStart = document.createElement("button");
	btnStart.textContent = "Commencer";
	btnStart.onclick=init;
	document.body.appendChild(btnStart);
	
	//Indicateur que l'ordinateur réfléchit
	elementIA = document.createElement("div");
	elementIA.textContent = "L'ordinateur est en train de réfléchir...";
	elementIA.style.visibility = "hidden";
	document.body.appendChild(elementIA);
	

	document.body.appendChild(document.createElement("hr"));
}

window.addEventListener("load",affichageDOM,false);

//Initialisation d'une partie
function init(){
	for(var x=0;x<nx;x++){
		grille[x]=[];
		for(var y=0;y<ny;y++){
			grille[x][y]=0;
		}
	}
	
	//suppression de la grille précédente
	if(elemTable){
		document.body.removeChild(elemTable);
	}

	//affichage de la grille de jeu
	elemTable = document.createElement("table");
	var row,cel;
	for(y=0;y<ny;y++){
		row=elemTable.insertRow(-1);
		for(x=0;x<nx;x++){
			cel = row.insertCell(-1);
			cel.id = "grille"+x+"_"+y;
			cel.onclick=setClick(x,y);
			switch(grille[x][y]){
				case 1:
					cel.className = "noir";
					break;
				case 2:
					cel.className = "blanc";
					break;
				case 0:
				default:
					cel.className = "empty";
			}
		}
	}
	document.body.appendChild(elemTable);
	couleurTour = 1;
	continueJeu = true;
	iaToPlay(); //on vérifie si c'est au tour de l'IA de jouer
};

//permet de changer la couleur lors d'un coup
function changeCouleur(x,y){
	grille[x][y]=couleurTour;
	var elem = document.getElementById("grille"+x+"_"+y);
	if(elem){
		elem.className=couleurTour===1?"noir":"blanc";
	}
}

//permet de jouer un coup en x,y
function joue(x,y){
	if(!continueJeu) return false;
	if(grille[x][y]) return false;
	var rslt;
	changeCouleur(x,y);
	couleurTour=couleurTour%2+1;
	if(rslt=verifVainqueur(x,y)){
		continueJeu = false;
		alert((rslt===1?"Noirs":"Blancs")+" vainqueurs");
	}
	
	if(!verifNbLibre()){
		continueJeu = false;
		alert("Parie nulle : égalité");
	}
	
	//est-ce que le prochain coup doit être joué par l'IA ?
	iaToPlay();
}

//est-ce que le prochain coup doit être joué par l'IA ?
function iaToPlay(){
	if(!continueJeu) return false;
	if((couleurTour === 1 && iaNoir) || (couleurTour === 2 && iaBlanc)){
		continueJeu = false; //pour empêcher un humain de jouer
		elementIA.style.visibility = "visible";
		setTimeout(function(){
			var rslt = iaJoue(grille,couleurTour);
			continueJeu = true;
			elementIA.style.visibility = "hidden";
			joue(rslt[0],rslt[1]);
		},10); //au cas où deux ordi jouent ensemble et pour voir le coup pendant que l'IA réfléchi
	}
}

//permet de créer une fonction listener sur un élément x,y
function setClick(x,y){
	return function(){
		joue(x,y);
	};
}

//permet de vérifier s'il reste des coups jouable
function verifNbLibre(){
	var nbLibre=0;
	for(var x=0;x<nx;x++){
		for(var y=0;y<ny;y++){
			if(grille[x][y]===0){
				nbLibre++;
			}
		}
	}
	return nbLibre;
}

//permet de vérifier s'il y a un vainqueur (en ne regardant que le dernier coup joué)
function verifVainqueur(x,y,vGrille){
	vGrille = vGrille || grille;
	var col=vGrille[x][y];
	var alignH = 1; //nombre de jetons alignés horizontalement
	var alignV = 1; //nombre de jetons alignés verticalement
	var alignD1 = 1; //nombre de jetons alignés diagonalement NO-SE
	var alignD2 = 1; //nombre de jetons alignés diagonalement SO-NE
	var xt,yt;
	
	//vérification horizontale
	xt=x-1;
	yt=y;
	while(xt>=0 && vGrille[xt][yt]===col){
		xt--;
		alignH++;
	}
	xt=x+1;
	yt=y;
	while(xt<nx && vGrille[xt][yt]===col){
		xt++;
		alignH++;
	}
	
	//vérification verticale
	xt=x;
	yt=y-1;
	while(yt>=0 && vGrille[xt][yt]===col){
		yt--;
		alignV++;
	}
	xt=x;
	yt=y+1;
	while(yt<ny && vGrille[xt][yt]===col){
		yt++;
		alignV++;
	}
	
	//vérification diagonale NO-SE
	xt=x-1;
	yt=y-1;
	while(xt>=0 && yt>=0 && vGrille[xt][yt]===col){
		xt--;
		yt--;
		alignD1++;
	}
	xt=x+1;
	yt=y+1;
	while(xt<nx && yt<ny && vGrille[xt][yt]===col){
		xt++;
		yt++;
		alignD1++;
	}
	
	//vérification diagonale SO-NE
	xt=x-1;
	yt=y+1;
	while(xt>=0 && yt<ny && vGrille[xt][yt]===col){
		xt--;
		yt++;
		alignD2++;
	}
	xt=x+1;
	yt=y-1;
	while(xt<nx && yt>=0 && vGrille[xt][yt]===col){
		xt++;
		yt--;
		alignD2++;
	}
	
	if(Math.max(alignH,alignV,alignD1,alignD2)>=nbAlligne){
		return col;
	}else{
		return 0;
	}
}


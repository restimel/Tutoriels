var nx = 9; //nombre de cellules en largeur
var ny = 9; //nombre de cellules en hauteur
var nbAlligne = 5; //nombre de jetons à alligner pour gagner
var couleurTour = 1; //couleur dont c'est le tour
var continueJeu = true; //permet d'indquer si le jeu est arrêté ou non

var grille = [];
for(var x=0;x<nx;x++){
	grille[x]=[];
	for(var y=0;y<ny;y++){
		grille[x][y]=0;
	}
}

//affichage de la grille de jeu
var elemTable = document.createElement("table");
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
	if(continueJeu && couleurTour===2){
		continueJeu = false; //pour empêcher un humain de jouer
		setTimeout(function(){
			rslt = iaJoue(grille,couleurTour);
			continueJeu = true;
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

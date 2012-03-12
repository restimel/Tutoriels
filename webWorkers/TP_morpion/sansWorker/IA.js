var profondeurMax = 4; //indique la profondeur de recherche de l'IA

//demande à l'IA de jouer
function iaJoue(grilleOrig,couleur,profondeur){
	profondeur = profondeur || 0;
	if(profondeur>=profondeurMax){
		//on a atteint la limite de profondeur de calcul
		return estimation(grilleOrig);
	}else{
		var grille = copieGrille(grilleOrig);
		var minMax = Infinity;
		var fCompare = Math.min;
		var couleurOpp = couleur%2+1;
		var coup=[];
		var estim;
		if(couleur===1){
			minMax = -Infinity;
			fCompare = Math.max;
		}
		for(var x=0;x<nx;x++){
			for(var y=0;y<ny;y++){
				if(grille[x][y]) continue; //case déjà occupée
				grille[x][y]=couleur; //on va essayer avec ce coup
				//vérifie si le coup est gagnant
				if(estim=verifVainqueur(x,y,grille)){
					if(profondeur===0){
						return [x,y];
					}else{
						return estim===1?Infinity:-Infinity;
					}
				}
				estim=iaJoue(grille,couleurOpp,profondeur+1); //on regardes les possibilités adverses
				if((couleur===1 && estim===Infinity) || (couleur===0 && estim===-Infinity)){
				//coup qui gagne
					if(profondeur===0){
						return [x,y];
					}else{
						return estim;
					}
				}
				minMax=fCompare(estim,minMax);
				if(profondeur===0 && minMax===estim){
					//on a trouvé un nouveau meilleur coup
					coup = [x,y];
				}
				
				//restauration de la grille
				grille[x][y]=0;
			}
		}
		if(profondeur===0){
			return coup;
		}else{
			return minMax;
		}
	}
	
}

//permet d'estimer la position
function estimation(grille){
	return 0;
}

//permet de copier une grille
function copieGrille(grille){
	var nvGrille=[];
	for(var x=0;x<nx;x++){
		nvGrille[x]=[];
		for(var y=0;y<ny;y++){
			nvGrille[x][y]=grille[x][y];
		}
	}
	return nvGrille;
}

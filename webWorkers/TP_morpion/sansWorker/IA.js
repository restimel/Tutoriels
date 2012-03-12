var profondeurMax = 4; //indique la profondeur de recherche de l'IA

//demande à l'IA de jouer
function iaJoue(grilleOrig,couleur){
	var grille = copieGrille(grilleOrig);
	return iaAlphaBeta(grille, couleur, profondeurMax, -Infinity, Infinity);
}

//fonction alphabeta
function iaAlphaBeta(grille, couleur, profondeur, alpha, beta){
	if(!profondeur){
		//on a atteint la limite de profondeur de calcul
		return iaEstimation(grille);
	}else{
		var meilleur = -Infinity;
		var estim;
		var coup=null;
		var couleurOpp = couleur%2+1;
		for(var x=0;x<nx;x++){
			for(var y=0;y<ny;y++){
				if(grille[x][y]) continue; //case déjà occupée
				
				if(!coup){coup=[x,y];} //pour proposer au moins un coup
				
				grille[x][y]=couleur; //on va essayer avec ce coup
				//vérifie si le coup est gagnant
				if(estim=verifVainqueur(x,y,grille)){
					grille[x][y]=0; //restauration de la grille
					if(profondeur===profondeurMax){
						return [x,y];
					}else{
						return Infinity;
					}
				}
				estim = -iaAlphaBeta(grille, couleurOpp, profondeur-1, -beta, -alpha);
			
				if(estim > meilleur){
					//on vient de trouver un meilleur coup
					meilleur = estim;
					if(meilleur > alpha){
						alpha = meilleur;
						coup = [x,y];
						if(alpha >= beta){
							grille[x][y]=0; //restauration de la grille
							if(profondeur===profondeurMax){
								return coup;
							}else{
								return meilleur;
							}
						}
					}
				}
				grille[x][y]=0; //restauration de la grille
			}
		}
		if(profondeur===profondeurMax){
			return coup;
		}else{
			if(coup) return meilleur;
		}
	}
}



//permet d'estimer la position
function iaEstimation(grille){
	//TODO
	return 0;
}

//permet de copier une grille
function copieGrille(grille){
	var nvGrille=[];
	for(var x=0;x<nx;x++){
		nvGrille[x]=grille[x].concat([]);//effectue une copie de la liste
	}
	return nvGrille;
}

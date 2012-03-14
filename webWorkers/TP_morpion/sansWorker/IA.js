
//demande à l'IA de jouer
function iaJoue(grilleOrig,couleur){
	var grille = copieGrille(grilleOrig);
	return iaAlphaBeta(grille, couleur, iaProfondeurMax, -Infinity, Infinity);
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
					if(profondeur===iaProfondeurMax){
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
							if(profondeur===iaProfondeurMax){
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
		if(profondeur===iaProfondeurMax){
			return coup;
		}else{
			if(coup) return meilleur;
			else return 0;
		}
	}
}



//permet d'estimer la position
function iaEstimation(grille){
	var estimation = 0; //estimation global de la position
	
	for(var x=0;x<nx;x++){
		for(var y=0;y<ny;y++){
			if(!grille[x][y]) continue;
			//estimation de la valeur de ce jeton et ajout au calcul d'estimation global
			switch(grille[x][y]){
				case 1:
					estimation += iaAnalyse(grille,x,y);
					break;
				case 2: 
					estimation -= iaAnalyse(grille,x,y);
					break;
			}
		}
	}
	return estimation;
}

//permet de calculer le nombre de "liberté" pour la case donnée
function iaAnalyse(grille,x,y){
	var couleur = grille[x][y];
	var estimation = 0; //estimation pour toutes les directions
	var compteur = 0; //compte le nombre de possibilité pour une direction
	var bonus = 0; //point bonus liée aux jetons alliés dans cette même direction
	var i,j; //pour les coordonées temporaires
	var pass=false; //permet de voir si on a passé la case étudiée

	//recherche horizontale
	for(i=0;i<nx;i++){
		if(i==x){
			compteur++;
			pass=true;
			continue;
		}
		switch(grille[i][y]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse
				if(pass){
					i=nx; //il n'y aura plus de liberté supplémentaire, on arrête la recherche ici
				}else{
					//on réinitialise la recherche
					compteur = 0;
					bonus = 0;
				}
		}
	}
	if(compteur>=nbAlligne){
		//il est possible de gagner dans cette direction
		estimation += compteur + bonus*10;
	}
	
	//recherche verticale
	compteur=0;
	bonus=0;
	pass=false;
	for(j=0;j<ny;j++){
		if(j==y){
			compteur++;
			pass=true;
			continue;
		}
		switch(grille[x][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse
				if(pass){
					j=ny; //il n'y aura plus de liberté supplémentaire, on arrête la recherche ici
				}else{
					//on réinitialise la recherche
					compteur = 0;
					bonus = 0;
				}
		}
	}
	if(compteur>=nbAlligne){
		//il est possible de gagner dans cette direction
		estimation += compteur + bonus*10;
	}
	
	//recherche diagonale (NO-SE)
	compteur=1;
	bonus=0;
	i=x;
	j=y;
	while(i-->0 && j-->0){
		switch(grille[i][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse, on arrete de rechercher
				i=0;
		}
	}
	i=x;
	j=y;
	while(++i<nx && ++j<ny){
		switch(grille[i][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse, on arrete de rechercher
				i=nx;
		}
	}
	if(compteur>=nbAlligne){
		//il est possible de gagner dans cette direction
		estimation += compteur + bonus*10;
	}
	
	//recherche diagonale (NE-SO)
	compteur=1;
	bonus=0;
	i=x;
	j=y;
	while(i-->0 && ++j<ny){
		switch(grille[i][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse, on arrete de rechercher
				i=0;
		}
	}
	i=x;
	j=y;
	while(++i<nx && j-->0){
		switch(grille[i][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse, on arrete de rechercher
				i=nx;
		}
	}
	if(compteur>=nbAlligne){
		//il est possible de gagner dans cette direction
		estimation += compteur + bonus*10;
	}
	
	return estimation;
}

//permet de copier une grille
function copieGrille(grille){
	var nvGrille=[];
	for(var x=0;x<nx;x++){
		nvGrille[x]=grille[x].concat([]);//effectue une copie de la liste
	}
	return nvGrille;
}

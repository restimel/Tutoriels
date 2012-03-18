
//permet de vérifier s'il y a un vainqueur (en ne regardant que le dernier coup joué)
function verifVainqueur(x,y,vGrille){
	vGrille = vGrille || grille;
	var col = vGrille[x][y]; //couleur du jeton qui vient d'être joué
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
	
	//parmis tous ces résultats on regarde s'il y en a un qui dépasse le nombre nécessaire pour gagner
	if(Math.max(alignH,alignV,alignD1,alignD2)>=nbAlligne){
		return col;
	}else{
		return 0;
	}
}


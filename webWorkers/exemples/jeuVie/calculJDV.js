/**
	Ce fichier permet de regrouper les fonctions liées aux calculs parralélisable
	Ce fichier peut donc aussi être appelé comme dedicated-worker
*/

/**
	permet de calculer l'état suivant d'une partie de la grille
*/
function calculNext(data,xMin,yMin,xMax,yMax){
	var next=[],
		x=xMin,
		w=data.length,
		y=yMin,
		h=data[0].length,
		cmpt;
	do{
		y=yMin;
		next[x]=[];
		do{
			cmpt=0;
			if(y) cmpt+=data[x][y-1];
			if(x) cmpt+=data[x-1][y];
			if(y+1<h) cmpt+=data[x][y+1];
			if(x+1<w) cmpt+=data[x+1][y];

			if(data[x][y]){
				if(cmpt === 2 || cmpt === 3){
					next[x][y] = true;
				}else{
					next[x][y] = false
				}
			}else{
				if(cmpt === 3){
					next[x][y] = true;
				}else{
					next[x][y] = false
				}
			}
		}while(++y<yMax);
	}while(++x<xMax);

	return next;
}

if(self.postMessage){
	self.onmessage=function(event){
		var data=event.data;
		switch(data.cmd){
			case "test":
				postMessage({cmd:"test",response:"reponse"});
				break;
			case "calcul":
				var next = calculNext(data.grille,data.xMin,data.yMin,data.xMax,data.yMax);
				postMessage({cmd:"calcul",next:next,xMin:data.xMin,yMin:data.yMin,xMax:data.xMax,yMax:data.yMax});
				break;
			default:
				postMessage({cmd:"alert",message:"Worker: "+data.cmd+"("+data+") → commande inconnue"});
		}
	};
}
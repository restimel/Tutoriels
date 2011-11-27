/**
	Ce fichier permet de regrouper toutes les fonctions liées à la gestion de la grille du jeu de la vie
	Le calcul de l'état suivant étant géré par calculJDV.js
*/

var nbSnapshot = 0; //nombre d'incrément d'image réalisé depuis le début
var grille=[[]]; //grille contenant l'état de chaque élément (true: vivant; false: mort)
var listeWorkers=[]; //liste de tous les workers actuellement utilisés
var infoCalcul={
	time : 0, //instant marquant le début du calcul
	identifiantOld : "", // chaine d'identification pour comparer deux états
	enCours : 0 //indique le nombre de workers qui n'ont pas encore répondu
}

function finishNext(){
	console.log("Temps génération: "+(Date.now()-infoCalcul.time));
	if(grille.toString() === infoCalcul.identifiantOld){
		document.getElementById("outputDivers").value="Etat stable\n(l'image n'a pas évolué)";
	}else{
		afficheGrille(grille);
		document.getElementById("outputDivers").value="";
	}

	var d=Date.now()-infoCalcul.time;
	document.getElementById("outputSnapshot").value = ++nbSnapshot;
	document.getElementById("outputTemps").value=d+"ms";
	var moyenne = document.getElementById("outputTmpsMoyen");
	moyenne.value=((parseFloat(moyenne.value)||0)*(nbSnapshot-1)+d)/nbSnapshot+"ms";

}

function precalculDecoupage(){
	var nbX, //nombre de morceau par largeur
		nbY, //nombre de morceau par hauteur
		nbW = listeWorkers.length, //nombre total de workers et donc de morceaux
		w=grille.length, //largeur de la grille
		h=grille[0].length, //hauteur de la grille
		nX=0, //largeur d'un morceau
		nY=0, //hauteur d'un morceau
		q=Infinity, //qutotien actuel de nbX/nbY
		p=w<h?w/h:h/w, //quotient idéal de x/y
		x=1, //nombre temporaire de morceau en largeur
		y, //nombre temporaire de morceau en hauteur
		lx=Math.sqrt(nbW); //nombre de morceau max en largeur
	if(nbW){
		do{
			if(nbW%x===0){
				y=nbW/x;
				if(Math.abs(p-x/y)<q){
					nbX=x;
					nbY=y;
					q=Math.abs(p-x/y);
				}else{
					break;
				}
			}
		}while(++x<=lx);
		if(w>h){ //ré-affectation des vrais valeurs nbX,nbY
			x=nbX;
			nbX=nbY;
			nbY=x;
		}

		//calcul du nombre de cellules par morceau
		nX=Math.ceil(w/nbX);
		nY=Math.ceil(h/nbY);

		infoCalcul.nbCelX=nX;
		infoCalcul.nbCelY=nY;
		infoCalcul.nbMorceauX=nbX;
		infoCalcul.nbMorceauY=nbY;
	}else{
		infoCalcul.nbCelX=w;
		infoCalcul.nbCelY=h;
		infoCalcul.nbMorceauX=1;
		infoCalcul.nbMorceauY=1;
	}
}


/**
	 Permet de générer l'état suivant de la grille
*/
function generateNext(){
	infoCalcul.time=Date.now();
	infoCalcul.identifiantOld=grille.toString();

	if(listeWorkers.length){
		//méthode avec Workers: découpage de la grille


		var w=grille.length, //largeur de la grille
			h=grille[0].length, //hauteur de la grille
			nbW=infoCalcul.enCours = listeWorkers.length, //nombre total de workers et donc de morceaux
			nX=infoCalcul.nbCelX, //largeur d'un morceau
			nY=infoCalcul.nbCelY, //hauteur d'un morceau
			nbX=infoCalcul.nbMorceauX, //nombre de morceau par largeur
			nbY=infoCalcul.nbMorceauY, //nombre de morceau par hauteur
			x,y;
		//lancement des workers
		for(var i=0; i<nbW; i++){
			x=i%nbX;
			y=(i-x)/nbX;
			listeWorkers[0].postMessage({cmd:"calcul",grille:grille,xMin:x*nX,yMin:y*nY,xMax:Math.min((x+1)*nX,w),yMax:Math.min((y+1)*nY,h)});
		}
	}else{
		//méthode sans worker
		grille=calculNext(grille,0,0,grille.length,grille[0].length);
		finishNext();
	}
}

/**
	demande à générer l'état suivant de manière automatique
*/
function requestAutoNext(){
	var commandAuto = document.getElementById("commandAuto");
	if(commandAuto.checked){
		generateNext();
		if(document.getElementById("outputDivers").value!==""){
			commandAuto.checked=false;
		}else{
			setTimeout(requestAutoNext,document.getElementById("commandDelay").value*1000);
		}
	}
}

/**
	Permet de créer la grille
*/
function generateGrille(){
	var oldGrille=grille;
	var x=0,lox=oldGrille.length, lx=document.getElementById("grilleWidth").value*1,
		y=0,loy=oldGrille[0].length, ly=document.getElementById("grilleHeight").value*1,
		prob=document.getElementById("grilleVivant").value/100;
	grille = [];
	do{
		grille[x] = [];
		y=0;
		do{
			if(x<lox && y<loy){
				grille[x][y] = oldGrille[x][y];
			}else{
				grille[x][y] = Math.random()<prob;
			}
		}while(++y<ly);
	}while(++x<lx);

	afficheGrille(grille);
	precalculDecoupage();
}

/**
	initalise les workers ou les détruits si besoin
*/
function prepareWorker(){
	var w,
		nb=document.getElementById("commandWorker").value-listeWorkers.length;
	if(nb>0){
		//il faut créer des workers suplémentaires
		while(nb--){
			w=new Worker("./calculJDV.js");
			w.onmessage=workerOnmessage;
			w.onerror=function(e){alert(e.message);};
			w.postMessage({cmd:"test"});
			listeWorkers.push(w);
		}
	}else{
		//il faut supprimer les workers en trop
		while(nb++){
			w=listeWorkers.pop();
			w.terminate();
		}
	}
	precalculDecoupage();
}

/**
	listener onmessage du worker
*/
function workerOnmessage(event){
	var data=event.data;
	switch(data.cmd){
		case "calcul":
			var x=data.xMin,
				lx=data.xMax,
				y=data.yMin,
				ly=data.yMax,
				nxt=data.next;
			do{
				y=data.yMin;
				do{
					grille[x][y]=nxt[x][y];
				}while(++y<ly);
			}while(++x<lx);
			infoCalcul.enCours--;
			if(infoCalcul.enCours===0){
				finishNext();
			}
			break;
		case "test":
				console.log("Worker: "+data.response);
				break;
		case "alert":
				alert(data.message);
				break;
		case "ready":
				console.log("Ready: "+(Date.now()-infoCalcul.time));
				break;
		default:
			alert("Commande inconnue: "+data.cmd);
	}
}

window.onload=function(){
	generateGrille();
	sizeCanvas();
}

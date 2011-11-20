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
	document.getElementById("outputTemps").value=(Date.now()-infoCalcul.time)+"ms";
	document.getElementById("outputSnapshot").value = ++nbSnapshot;
}


/**
	 Permet de générer l'état suivant de la grille
*/
function generateNext(){
	infoCalcul.time=Date.now();
	infoCalcul.identifiantOld=grille.toString();

	if(listeWorkers.length){
		//méthode avec Workers
		infoCalcul.enCours = listeWorkers.length;
		for(var i=0,li=listeWorkers.length; i<li; i++){
			//TODO faire le découpage des taches
		}
		//////////TODO temp
		console.log("TODO(generateNext): faire le dcoupage par tache et la gestion worker");
		infoCalcul.enCours = 1;
		listeWorkers[0].postMessage({grille:grille,xMin:0,yMin:0,xMax:grille.length,yMax:grille[0].length});
		//////////TODO
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
			setTimeout(requestAutoNext,document.getElementById("commandDelay").valueAsNumber*1000);
		}
	}
}

/**
	Permet de créer la grille
*/
function generateGrille(){
	var oldGrille=grille;
	var x=0,lox=oldGrille.length, lx=document.getElementById("grilleWidth").valueAsNumber,
		y=0,loy=oldGrille[0].length, ly=document.getElementById("grilleHeight").valueAsNumber,
		prob=document.getElementById("grilleVivant").valueAsNumber/100;
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
}

/**
	initalise les workers ou les détruits si besoin
*/
function prepareWorker(){
	var w,
		nb=document.getElementById("commandWorker").valueAsNumber-listeWorkers.length;
	if(nb>0){
		//il faut créer des workers suplémentaires
		while(nb--){
			w=new Worker("calculJDV.js");
			w.onmessage=workerOnmessage;
			w.onerror=function(e){alert(e.message);};
			listeWorkers.push(w);
		}
	}else{
		//il faut supprimer les workers en trop
		while(nb++){
			w=listeWorkers.pop();
			w.terminate();
		}
	}
}

/**
	listener onmessage du worker
*/
function workerOnmessage(event){
	var data=event.data,
		x=data.xMin,
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
}

window.onload=function(){
	generateGrille();
	sizeCanvas();
}
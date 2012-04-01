/*
  Références aux éléments HTML
*/

var zoneJeu = document.getElementById("zoneJeu");
var zonePlaque = document.getElementById("zonePlaque");
var zoneParametre = document.getElementById("zoneParametres");
var zoneResulat = document.getElementById("zoneResultat");

var zoneIA = document.getElementById("resultatIA");
var zoneCalcul = document.getElementById("zoneCalcul");

var regleNbPlaques = document.getElementById("regleNbPlaques");
var regleTemps = document.getElementById("regleTemps");

var jeuCible = document.getElementById("jeuCible");
var jeuTemps = document.getElementById("jeuTemps");
var jeuDistance = document.getElementById("jeuDistance");

var inputFormule = document.getElementById("entreeFormule");

var listeNombre = [];

//paramétrage par défaut
regleNbPlaques.value=6;
regleTemps.value=45;
document.getElementById("boutonCommence").onclick=initialisation;



// initialisation d'une nouvelle partie
function initialisation(){
	zoneParametre.style.display = "none";
	zoneJeu.style.display = "block";
	jeuCible.value = "???";
	jeuTemps.value = regleTemps.value;
	
	zonePlaque.innerHTML = "";
	zoneIA.innerHTML = "";
	zoneCalcul.innerHTML = "";
	
	listeNombre = [];
	
	generateNombre();
	
	inputFormule.style.display = "";
	inputFormule.addEventListener("blur",restoreFocus,false);
	inputFormule.addEventListener("keypress",analyseFormule,false);
	inputFormule.addEventListener("blur",analyseFormule,false);
	inputFormule.focus();
}

//gestion du chronometre
var chronometre=(function(){
	var timer,init;
	function chrono(){
		var temps = (Date.now() - init)/1000;
		jeuTemps.value = Math.round(regleTemps.value - temps);
		if(temps>regleTemps.value){
			clearInterval(timer);
			//TODO fin
			
			//On retire le formulaire
			inputFormule.style.display = "none";
			inputFormule.removeEventListener("blur",restoreFocus,false);
			inputFormule.removeEventListener("keypress",analyseFormule,false);
			inputFormule.removeEventListener("blur",analyseFormule,false);
			
			
			var liste = [];
			listeNombre.forEach(function(el){
				if(!el.parent1) liste.push(el.valeur);
			});
			var resultat = chercheSolution(liste,jeuCible.value);
			zoneIA.innerHTML = resultat[1].replace(/\n/g,"<br>")+"<div>"+(resultat[0]?"Compte approchant : " + resultat[0]:"Le compte est bon !")+"</div>";
		}
	}
	
	return function(){
		init = Date.now();
		timer = setInterval(chrono,400);
	};
})();

//permet de générer les nombres pour jouer et défini la cible
function generateNombre(){
	var choix = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,25,50,75,100];
	if(listeNombre.length < regleNbPlaques.value){
		listeNombre.push(new Nombre(null,null,null,choix[Math.floor(Math.random()*choix.length)]));
		setTimeout(generateNombre,500);
	}else{
		jeuCible.value = Math.floor(Math.random()*898)+101;
		chronometre();
	}
}

//permet de redonner le focus à l'input quand il le perd
function restoreFocus(event){
	setTimeout(function(){event.target.focus();},20);
}

//permet d'analyser l'entrée de l'utilisateur
function analyseFormule(event){
	var key = event.keyCode || event.which;
	if(key === undefined || key === 13 || key === 61 || key === 9){
		var operation = this.value.match(/\s*(\d+)\s*([-+*_\\/÷&xX×])\s*(\d+)/);
		if(operation){
			var n1 = listeNombre.filter(function(el){return !el.usedBy && el.valeur == operation[1]})[0],
			    n2 = listeNombre.filter(function(el){return !el.usedBy && el.valeur == operation[3] && el !== n1})[0];
			switch(operation[2]){
				case "&":
				case "+":
					operation = "+";
				break;
				case "_":
				case "-":
					operation = "-";
				break;
				case "*":
				case "x":
				case "X":
				case "×":
					operation = "×";
				break;
				case "/":
				case "\\":
				case "÷":
					operation = "÷";
				break;
				default:
					operation = null;
			}
		}
		if(operation && n1 && n2){
			var n = new Nombre(n1,n2,operation);
			if(n.valeur){
				listeNombre.push(n);
				this.value = "";
				majDistance();
			}
		}else{
			this.className = "erreur";
		}
	}else{
		this.className = "";
		if(key === 27){
			this.value = "";
		}
	}
}

//met à jour la distance entre les nombres et la cible
function majDistance(){
	var distance = Infinity;
	var cible = jeuCible.value;
	listeNombre.forEach(function(el){
		distance = Math.min(distance,Math.abs(el.valeur-cible));
	});
	if(distance){
		jeuDistance.value = "Compte approchant : " + distance;
	}else{
		jeuDistance.value = "Le compte est bon !";
	}
}

//création et affichage d'une plaque
function creationPlaque(nb){
	var plaque = document.createElement("div");
	plaque.textContent = nb;
	zonePlaque.appendChild(plaque);
	return plaque;
}

//constructeur d'un objet représentant les nombres manipulés par l'utilisateur
function Nombre(parent1,parent2,op,init){
	this.parent1 = parent1;
	this.parent2 = parent2;
	this.operateur = op;
	this.usedBy = null;
	
	if(init){
		this.valeur = init;
		creationPlaque(init);
	}else{
		switch(op){
			case "+":
				this.valeur = parent1.valeur + parent2.valeur;
			break;
			case "-":
				this.valeur = parent1.valeur - parent2.valeur;
			break;
			case "×":
				this.valeur = parent1.valeur * parent2.valeur;
			break;
			case "÷":
				this.valeur = parent1.valeur / parent2.valeur;
			break;
		}
		if(this.valeur < 0 || this.valeur !== Math.round(this.valeur)){
			this.valeur = 0;
			return null;
		}
		this.parent1.utilise(this);
		this.parent2.utilise(this);
		this.createCalcul();
	}
}

Nombre.prototype.createCalcul = function(){
	this.refCalcul = document.createElement("div");
	this.refCalcul.textContent = this.parent1.valeur + " " + this.operateur + " " + this.parent2.valeur + " = " + this.valeur;
	if(this.valeur == jeuCible.value){
		this.refCalcul.className = "compteBon";
	}else{
		var that = this;
		this.refCalcul.addEventListener("click",function(){that.supprime();},false);
	}
	zoneCalcul.appendChild(this.refCalcul);
};

Nombre.prototype.utilise = function(parent){
	this.usedBy = parent;
};

Nombre.prototype.libre = function(){
	this.usedBy = null;
};

Nombre.prototype.supprime = function(){
	if(this.usedBy){
		this.usedBy.supprime();
	}
	if(this.parent1){
		this.parent1.libre();
	}
	if(this.parent2){
		this.parent2.libre();
	}
	this.refCalcul.parentNode.removeChild(this.refCalcul);
	listeNombre.splice(listeNombre.indexOf(this),1);
};


//recherche une solution
function chercheSolution(nombres,cible){
	var li = nombres.length;
	var nb1,nb2;
	var i,j;
	var lj = li - 1;
	var calcul;
	var rslt;
	var distance = Infinity;
	var solution = "";
	
	var nombresSansNb1;
	var nombresSansNb2;
	
	for(i=0; i<li && distance; i++){
		nb1 = nombres[i];
		nombresSansNb1 = nombres.concat([]); //copie
		nombresSansNb1.splice(i,1); //on retire le nombre de la liste
		
		for(j=0; j<lj; j++){
			nb2 = nombresSansNb1[j];
			nombresSansNb2 = nombresSansNb1.concat([]);
			nombresSansNb2.splice(j,1);
			
			//calcul ×
			calcul = nb1 * nb2;
			if(Math.abs(cible - calcul)<distance){
				distance = Math.abs(cible - calcul);
				solution = nb1 +" × " + nb2 + " = " + calcul;
				if(!distance) break; //on a trouvé une solution on arrête la boucle
			}
			rslt = chercheSolution(nombresSansNb2.concat([calcul]),cible); // on relance la recherche avec les nombres restant + ce résultat
			if(rslt[0]<distance){
				distance = rslt[0];
				solution = nb1 +" × " + nb2 + " = " + calcul + "\n" + rslt[1];
				if(!distance) break; //on a trouvé une solution on arrête la boucle
			}
			
			//calcul +
			calcul = nb1 + nb2;
			if(Math.abs(cible - calcul)<distance){
				distance = Math.abs(cible - calcul);
				solution = nb1 +" + " + nb2 + " = " + calcul;
				if(!distance) break; //on a trouvé une solution on arrête la boucle
			}
			rslt = chercheSolution(nombresSansNb2.concat([calcul]),cible); // on relance la recherche avec les nombres restant + ce résultat
			if(rslt[0]<distance){
				distance = rslt[0];
				solution = nb1 +" + " + nb2 + " = " + calcul + "\n" + rslt[1];
				if(!distance) break; //on a trouvé une solution on arrête la boucle
			}
			
			//calcul -
			calcul = nb1 - nb2;
			if(calcul>0){
				if(Math.abs(cible - calcul)<distance){
					distance = Math.abs(cible - calcul);
					solution = nb1 +" - " + nb2 + " = " + calcul;
					if(!distance) break; //on a trouvé une solution on arrête la boucle
				}
				rslt = chercheSolution(nombresSansNb2.concat([calcul]),cible); // on relance la recherche avec les nombres restant + ce résultat
				if(rslt[0]<distance){
					distance = rslt[0];
					solution = nb1 +" - " + nb2 + " = " + calcul + "\n" + rslt[1];
					if(!distance) break; //on a trouvé une solution on arrête la boucle
				}
			}
			
			//calcul ÷
			calcul = nb1 / nb2;
			if(calcul === Math.floor(calcul)){
				if(Math.abs(cible - calcul)<distance){
					distance = Math.abs(cible - calcul);
					solution = nb1 +" ÷ " + nb2 + " = " + calcul;
					if(!distance) break; //on a trouvé une solution on arrête la boucle
				}
				rslt = chercheSolution(nombresSansNb2.concat([calcul]),cible); // on relance la recherche avec les nombres restant + ce résultat
				if(rslt[0]<distance){
					distance = rslt[0];
					solution = nb1 +" ÷ " + nb2 + " = " + calcul + "\n" + rslt[1];
					if(!distance) break; //on a trouvé une solution on arrête la boucle
				}
			}
			
		}
	}
	
	return [distance,solution];
}

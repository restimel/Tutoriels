/*
  Références globales aux éléments HTML frequemment utilisés
*/

var regleTemps = document.getElementById("regleTemps"); //élément indiquant le temps total de réflexion
var jeuTemps = document.getElementById("jeuTemps"); //élément indiquant le temps restant pour jouer
var jeuCible = document.getElementById("jeuCible"); //élément indiquant le nombre à trouver

var listeNombre = []; //liste des nombres utilisables par l'utilisateur

//paramétrage par défaut
document.getElementById("regleNbPlaques").value=6;
regleTemps.value=45;



// initialisation d'une nouvelle partie
function initialisation(){
	//cache les paramètres de règles
	document.getElementById("zoneParametres").style.display = "none";
	
	//préparation de la zone de jeu
	document.getElementById("zoneResultat").style.display = "block";
	document.getElementById("zoneJeu").style.display = "block";
	jeuCible.value = "???";
	jeuTemps.value = regleTemps.value;
	
	document.getElementById("zonePlaque").innerHTML = "";
	document.getElementById("resultatIA").innerHTML = "";
	document.getElementById("zoneCalcul").innerHTML = "";
	
	//initialisation des nombres
	listeNombre = [];
	generateNombre();
	
	//gestion de l'input servant à entrer un calcul
	var inputFormule = document.getElementById("entreeFormule");
	inputFormule.style.display = "";
	inputFormule.value = "";
	inputFormule.addEventListener("blur",restoreFocus,false);
	inputFormule.addEventListener("keypress",analyseFormule,false);
	inputFormule.addEventListener("blur",analyseFormule,false);
	inputFormule.focus();
}

//gestion du chronometre
var chronometre=(function(){
	var init,timer=-1
	function chrono(){
		var temps = (Date.now() - init)/1000; //temps écoulé depuis le début du jeu
		jeuTemps.value = Math.round(regleTemps.value - temps);
		if(temps>regleTemps.value){
			//le temps est écoulé
			clearInterval(timer);
			
			//On retire le formulaire
			var inputFormule = document.getElementById("entreeFormule");
			inputFormule.style.display = "none";
			inputFormule.removeEventListener("blur",restoreFocus,false);
			inputFormule.removeEventListener("keypress",analyseFormule,false);
			inputFormule.removeEventListener("blur",analyseFormule,false);
			
			//on affiche l'analyse de l'ordinateur
			analyseIA();
		}
	}
	
	return function(){
		//démarrage du chronomètre
		init = Date.now();
		clearInterval(timer);
		timer = setInterval(chrono,400);
	};
})();

//permet de rechercher une solution et de l'afficher
function analyseIA(){
	//recherche une des meilleures solutions 
	var liste = [];
	listeNombre.forEach(function(el){
		if(!el.parent1) liste.push(el.valeur);
	}); //récupération des nombres de départ
	var resultat = chercheSolution(liste,jeuCible.value);
	var explication = resultat[1].replace(/\n/g,"<br>");
	if(resultat[0]){
		explication += "<div>Compte approchant : " + resultat[0] + "</div>";
	}else{
		explication += "<div>Le compte est bon !</div>";
	}
	document.getElementById("resultatIA").innerHTML = explication;
}


//permet de générer les nombres pour jouer et définit la cible
function generateNombre(){
	var choix = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,25,50,75,100]; //plaques possibles
	var nbPlaque = parseInt(document.getElementById("regleNbPlaques").value,10);
	if(listeNombre.length < nbPlaque){
		listeNombre.push(new Nombre(null,null,null,choix[Math.floor(Math.random()*choix.length)]));
		setTimeout(generateNombre,500);
	}else{
		jeuCible.value = Math.floor(Math.random()*898)+101; //le nombre à trouver doit être compris entre 101 et 999
		chronometre(); //on démarre le compte à rebours
	}
}

//permet de redonner le focus à l'input quand il le perd
function restoreFocus(event){
	setTimeout(function(){event.target.focus();},20);
}

//permet d'analyser l'entrée de l'utilisateur
function analyseFormule(event){
	var key = event.keyCode || event.which;
	if(key === undefined || key === 13 || key === 61 || key === 9){ //demande de valider l'opération
	
		var operation = this.value.match(/(\d+)\s*([-+*_\\/÷&xX×])\s*(\d+)/); // permet de vérifier que l'opération contient un nombre, un opérateur, et un nombre
		if(operation){
			var n1 = getNombre(operation[1]),
			    n2 = getNombre(operation[3],n1);
			
			//analyse de l'opérateur utilisé
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
			//toutes les composantes sont correctes, on peut créer le Nombre
			var n = new Nombre(n1,n2,operation);
			if(n.valeur){ // si n.valeur vaut 0, c'est que l'opération ne respecte pas les règles
				listeNombre.push(n);
				this.value = "";
				majDistance();
			}
		}else{
			this.className = "erreur";
		}
	}else{
		this.className = ""; // au cas où l'état précédent était en "erreur"
	}
}

//permet de trouver un objet Nombre parmi ceux disponibles qui possède la valeur recherchée
// valeur : valeur à chercher
// except : continue la recherche si l'objet trouvé est celui indiqué par except
function getNombre(valeur, except){
	function filtre(el){
		//on ne veut que les objets non utilisés et ayant la bonne valeur
		return !el.usedBy && el.valeur == valeur && el !== except;
	}
	var liste = listeNombre.filter(filtre); //récupère la liste de tous les objets correspondant aux critères
	return liste[0]; //seul le premier objet est retourné
}

//met à jour la distance entre les nombres trouvés et la cible
function majDistance(){
	var distance = Infinity;
	var cible = jeuCible.value;
	listeNombre.forEach(function(el){
		distance = Math.min(distance,Math.abs(el.valeur-cible));
	});
	var jeuDistance = document.getElementById("jeuDistance");
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
	plaque.addEventListener("click",ajouteValeur,false);
	document.getElementById("zonePlaque").appendChild(plaque);
	return plaque;
}

//permet d'ajouter la valeur d'une plaque à la formule de calcul
function ajouteValeur(event){
	document.getElementById("entreeFormule").value += event.target.textContent;
}


//Nombre est un objet représentant les nombres manipulés par l'utilisateur
//Il permet de savoir quel nombre a permis de réaliser une opération. Ce qui facilite le retour en arrière pour supprimer une opération
function Nombre(parent1,parent2,op,init){
	this.parent1 = parent1; //le premier nombre de l'opération
	this.parent2 = parent2; //le deuxième nombre de l'opération
	this.operateur = op; //l'opérateur de l'opération
	this.usedBy = null; //autre opération qui utilise ce nombre
	
	if(init){
		this.valeur = init;
		creationPlaque(init);
	}else{
		//réalisation du calcul
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
		//vérification du calcul
		if(this.valeur < 0 || this.valeur !== Math.round(this.valeur)){
			this.valeur = 0;
			return null;
		}
		this.parent1.utilise(this);
		this.parent2.utilise(this);
		this.createCalcul();
	}
}

//affichage du calcul correspondant à ce nombre
Nombre.prototype.createCalcul = function(){
	this.refCalcul = document.createElement("div");
	this.refCalcul.textContent = this.parent1.valeur + " " + this.operateur + " " + this.parent2.valeur + " = " + this.valeur;
	if(this.valeur == jeuCible.value){
		this.refCalcul.className = "compteBon";
	}else{
		var that = this;
		this.refCalcul.addEventListener("click",function(){that.supprime();},false);
	}
	document.getElementById("zoneCalcul").appendChild(this.refCalcul);
};

//définit l'utilisation de ce nombre dans un opération
Nombre.prototype.utilise = function(parent){
	this.usedBy = parent;
};

//définit le fait que ce nombre n'est plus utilisé dans une opération
Nombre.prototype.libre = function(){
	this.usedBy = null;
};

//suppression de ce nombre et donc de l'opération
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
function chercheSolution(nombres,cible){ //il s'agit d'une fonction récursive
	var nb1,nb2; //nombres utilisés pour étudier une opération
	var i,j; //index itératifs
	var li = nombres.length; //taille de la liste des nombres parmi lesquels il faut chercher le premier nombre de l'opération
	var lj = li - 1; //taille de la liste des nombres moins nb1 parmi lesquels le deuxième nombre de l'opération est recherché
	var calcul; //résultat de l'opération en cours
	var rslt; //résultat d'une recherche avec moins de nombres
	var distance = Infinity; //distance de la solution actuelle par rapport à la cible
	var solution = ""; //meilleure solution actuelle
	
	var nombresSansNb1; //liste de nombre sans le premier nombre de l'opération (nb1)
	var nombresSansNb2; //liste de nombre sans les nombres de l'opération (nb1 et nb2)
	
	for(i=0; i<li && distance; i++){
		nb1 = nombres[i]; //analyse avec ce premier nombre
		nombresSansNb1 = nombres.concat([]); //copie de la liste
		nombresSansNb1.splice(i,1); //on retire le nombre de la liste
		
		for(j=0; j<lj; j++){
			nb2 = nombresSansNb1[j]; //analyse avec ce deuxième nombre
			nombresSansNb2 = nombresSansNb1.concat([]); //copie de la liste
			nombresSansNb2.splice(j,1); //on retire le nombre de la liste
			
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

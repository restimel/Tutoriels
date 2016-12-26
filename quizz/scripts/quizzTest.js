/*
	gestion de la liste de toutes les questions qui sont posées lors d'un test
	
	objet: quizzTest
	Propriétés: 
		liste (Array) : liste des questions
		length (number) : nombre de questions
		nbBonneReponse (number) : nombre de bonne réponses
		tempAlloue (number) : temps total disponbile
		tempsPasse (number) : temps total passé sur le test
		timerInit (number timestamp) : timestamp correspondant au début du test
		timerLast (number timestamp) : timestamp correspondant au dernier résultat
		timer (number) : id du setInterval utilisé
		elemTime (DOM element) : référence à l'élément d'affichage du temps (mise en cache afin d'éviter de le rechercher à chaque mise à jour)
		score (Array) : liste de tous les résultats de l'utilisateur. Liste d'objet:
			{
				id (number): id de la question,
				reponse (string): valeur choisie par l'utilisateur,
				bonneReponse (string): valeur de la bonne réponse,
				temps (number): temps passé sur la question
			}
		filtre (objet): filtre appliqué sur le questionnaire
	
	Méthodes:
		displayQuestion() : permet d'afficher la question courante
		reponse(str) : l'utilisateur répond à la question courante
		resultat() : permet d'afficher le résultat du test
		stop(stopRedirect) : l'utilisateur arrête le test. stopRedirect (boolean) : si vaut true alors ne redirige pas vers la page de résultat
		time() : gestion du temps
*/
"use strict";

function quizzTest(){
	var elemThemes = document.getElementById("prepThemes"),
		elemNiveau = document.getElementById("prepNiveau"),
		filtre = {themes:[],niveau:[]},
		i, li = elemThemes.options.length;
	
	//initialisation des propriétés
	this.nbBonneReponse = 0;
	this.tempAlloue = document.getElementById("prepIsTime").checked ? parseInt(document.getElementById("prepTime").value.replace(/^(?:(\d{1,2}):(\d{1,2})(?!\d))?(?::?(\d+))?(?:\s*[APap][Mm])?$/,function(mtf,h,mn,s){
		return parseInt(h||0,10)*3600 + parseInt(mn||0,10)*60 + parseInt(s||0,10);
		}))||600 : 0;
	this.tempsPasse = 0;
	this.score = [];
	
	//création du filtre
	for(i=0;i<li;i++){
		if(elemThemes.options[i].selected){
			filtre.themes.push(elemThemes.options[i].value);
		}
	}
	if(filtre.themes.length === 0){
		filtre.themes.push("Tous");
	}
	
	li = elemNiveau.options.length;
	for(i=0;i<li;i++){
		if(elemNiveau.options[i].selected){
			filtre.niveau.push(elemNiveau.options[i].value);
		}
	}
	if(filtre.niveau.length === 0){
		filtre.niveau.push("-1");
	}
	
	//récupération du nombre de question désiré
	this.length = parseInt(document.getElementById("prepNbQ").value,10) || 1;
	if(this.length<0) this.length = 1;
	
	
	this.filtre = filtre;
	
	this.liste = quizzItems.get(this.filtre).sort(function(){return Math.random()-0.5;}).splice(0,this.length);
	this.length = this.liste.length; //maj de la nouvelle longueur
	
	//ajout de l'arrêt quand on clique sur le bouton
	document.querySelector("#questionOption>button").onclick = this.stop.bind(this);
	
	//gestion du temps
	this.elemTime = document.getElementById("questionTime");
	this.elemTime.textContent = timeFormat(this.tempAlloue);
	this.timer = setInterval(this.time.bind(this),400);
	
	//afficher l'onglet de quizz
	document.getElementById("btn_quizzQuestion").parentNode.className = "";
	
	//lancer la session de questions
	this.timerInit = this.timerLast = Date.now();
	this.current = 0; //numéro de la question
	this.displayQuestion();

}

//permet d'afficher une question
quizzTest.prototype.displayQuestion = function(){
	var item = this.liste[this.current];
	if(!item){
		this.stop();
		return;
	}
	
	//(ré)affichage de la bonne section
	changeSession("quizzQuestion");

	//affichage des questions
	var elemQst = document.getElementById("form_quizz"),
		elem = document.createDocumentFragment(),
		label,input,
		i, li=item.reponses.length;
		
	elemQst.innerHTML = "";
	
	for(i=0;i<li;i++){
		input = document.createElement("input");
		input.type = "radio";
		input.name = "reponsesQuizz";
		input.value = item.reponses[i];
		input.onchange = answerDirectQuizz;

		label = document.createElement("label");
		label.appendChild(input);
		label.appendChild(document.createTextNode(item.reponses[i]));
		

		elem.appendChild(label);
		//elem.appendChild(document.createElement("br"));
	}
	
	elemQst.appendChild(elem);
	
	//affichage du code
	document.getElementById("questionCode").innerHTML = color(item.code,false);
	
	//maj des informations
	document.getElementById("questionScore").value = this.nbBonneReponse;
	document.getElementById("questionNum").textContent = (this.current+1)+" / "+this.length;
	
	//remise en état du bouton Répondre
	document.getElementById("btnRepondre").className = "notReady";
	
};

//permet de rentrer une réponse de l'utilisateur
quizzTest.prototype.reponse = function(rps){
	var item = this.liste[this.current],
	score = {
		id : item.id,
		reponse : rps,
		bonneReponse : item.bonneReponse,
		temps : (Date.now() - this.timerLast)/1000
	};
	this.tempsPasse = (Date.now() - this.timerInit)/1000;
	this.score.push(score);
	if(item.bonneReponse === rps){
		this.nbBonneReponse++;
	}
	this.current++;
	this.displayQuestion();
	this.timerLast = Date.now();
};

//permet d'afficher le résultat du test
quizzTest.prototype.resultat = function(){
	var message = [
		"Dommage mais ne désespérez pas. Si vraiment les questions sont trop dures, vous pouvez choisir des questions plus faciles.",
		"Il ne faut pas baisser les bras. Vous pouvez essayer des questions plus faciles ou passer du temps à comprendre vos erreurs, vous progresserez rapidement.",
		"Prenez du temps pour analyser vos erreurs. Vous ferez mieux la prochaine fois.",
		"Encore quelques progrès et ce sera bon. Prenez du temps pour bien comprendre les pièges des questions et vous finirez par avoir un très bon score.",
		"Bravo vous avez obtenu un bon score.",
		"Bravo ! Vous avez correctement répondu à toutes les questions ! Félicitation."
	]
	
	//changement d'affichage des onglets
	document.getElementById("btn_quizzQuestion").parentNode.className = "hidden";
	document.getElementById("btn_quizzResult").parentNode.className = "";
	document.querySelector("#quizzResult table").sort(1,1,null);
	
	
	//changement de session
	changeSession("quizzResult");
	
	//mise à jour de l'entête
	var rating = Math.round(this.nbBonneReponse/this.length*100),
		rsltScore = document.getElementById("rsltScore");
	
	rsltScore.textContent = this.nbBonneReponse+" / "+this.length;
	rsltScore.style.color = "rgb("+(rating<50?255:(405-rating*3))+","+(rating>50?200:(100+rating*2))+",50)"; //colorisation du score
	
	document.getElementById("rsltTemps").textContent = timeFormat(this.tempsPasse);
	document.getElementById("rsltMessage").textContent = message[Math.floor(rating/100*(message.length-1))]
	
	//affichage du détail
	var table = document.getElementById("rsltDetail");
	table.innerHTML = "";
	
	this.score.forEach(function(score){
		var input,
			question = quizzItems.get(score.id),
			cell,
			row = table.insertRow(-1);
		
		//gestion de la ligne
		row.className = score.bonneReponse === score.reponse ? "bonneReponse": "mauvaiseReponse";
		row.addEventListener("click",prepareListForAnalyze,false);
		
		//Colonne pour selection
		cell = row.insertCell(-1);
		input = document.createElement("input");
		input.type = "checkbox";
		input.value = '{"id":"'+score.id+'","reponse":"'+score.reponse.replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'"}';
		input.checked = true;
		input.addEventListener("click",majSelectionneur,false); //l'événement change n'a pas été utilisé pour éviter une boucle infinie (à voir du côté de oninput)
		cell.appendChild(input);
		
		//colonne num de question
		cell = row.insertCell(-1);
		cell.textContent = row.rowIndex;
		
		//colonne Thème
		cell = row.insertCell(-1);
		cell.textContent = question.theme.sort().join(", ");
		
		//colonne niveau
		cell = row.insertCell(-1);
		cell.textContent = niveauToString(question.niveau);
		
		//colonne temps
		cell = row.insertCell(-1);
		cell.textContent = timeFormat(score.temps);
		
		//colonne reponse
		cell = row.insertCell(-1);
		cell.textContent = score.reponse;
		
		//colonne bonne réponse
		cell = row.insertCell(-1);
		cell.textContent = score.bonneReponse;
		
	});
	//mise à jour de l'entête du tableau
	majSelectionneur.call(document.getElementById("rsltSelect"));
}

//permet d'arrêter le test en cours
quizzTest.prototype.stop = function(stopRedirect){
	clearInterval(this.timer);
	this.length = this.current;
	if(stopRedirect !== true){
		this.resultat();
	}
};

//gestion du temps et de son affichage
quizzTest.prototype.time = function(){
	var duree = (Date.now() - this.timerInit)/1000;
	if(this.tempAlloue){
		//l'utilisateur a un temps alloué pour résoudre les questions
		
		this.elemTime.textContent = timeFormat(this.tempAlloue - duree);
		
		//vérification du temps restant
		if(duree >= this.tempAlloue){
			//temps alloué écoulé
			this.reponse("… {Temps écoulé}");
			this.stop();
		}
	}else{
		//pas de temps alloué
		this.elemTime.textContent = timeFormat(duree);
	}
};
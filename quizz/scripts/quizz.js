/**
 * Global variable
**/

var currentTest = null; // test en cours

/**
 * Navigation
**/
//permet de changer la section active et d'en afficher une autre
var changeSession = function(){
	var activeSection = document.querySelector(".sectionActive");
	var copySection = document.getElementById("sectionCopy");

	//ajout de l'événement de fin de transition sur la section de copie
	copySection.addEventListener("transitionend", finTransition,true);
	copySection.addEventListener("webkitTransitionEnd", finTransition,true);

	function finTransition(){
		//remise à plat de la section de transition
		copySection.className = "";
		copySection.style.right = "";
		copySection.innerHTML = "";
	};
	
	//ajout des événements à tous les boutons de navigations
	var listeButton = document.querySelectorAll("nav button"),i,li=listeButton.length;
	for(i=0;i<li;i++){
		listeButton[i].onclick=changeSession;
	}
	
	return changeSession;
	
	function changeSession(id){
		//changement de section
		if(typeof id !== "string" && typeof this.id === "string") id = this.id.substr(4);
		var section = document.getElementById(id);
		activeSection.className="";
		
		//copie de la section active dans la section de transition
		copySection.appendChild(activeSection.cloneNode(true));
		copySection.className = "moveToLeft";
		setTimeout(finTransition,1000); //au cas où l'événement de fin ne se déclenche pas
		setTimeout(function(){copySection.style.right = "100%";},10); // pour que l'animation CSS fonctionne, il faut que la valeur soir 'enregistrée'
		
		//affichage de la nouvelle section
		section.className = "sectionActive";
		activeSection = section;
	}
}();

/**
 * chargement des données
**/
(function(){
	var ajx = new XMLHttpRequest();
	ajx.onreadystatechange=function(){
		if(ajx.readyState===4 && (ajx.status===200 || ajx.status===0)){
			var qz = JSON.parse(ajx.responseText);
			qz.quizz.pop();
			quizzItems.liste = qz.quizz;
			quizzItems.init();
			
			//maj des listes de themes
			removeOptionTheme();
			createOptionTheme("Tous",true);
			quizzItems.themes.forEach(createOptionTheme);
			
			//maj du nombre max de questions
			var nbQ = document.getElementById("prepNbQ");
			nbQ.max = quizzItems.length;
			nbQ.value = Math.min(10,quizzItems.length);
			document.getElementById("prepNbQMax").textContent = "/"+quizzItems.length;
			
		}else{
			//console.debug("ajax : "+ajx.readyState+" "+ajx.status);
		}
		
		//supprime toutes les option des select de themes
		function removeOptionTheme(){
			var select = document.getElementById("prepThemes");
			while(select.length){
				select.remove(0);
			}
			select = document.getElementById("srchThemes");
			while(select.length){
				select.remove(0);
			}
		}
		
		//ajoute une nouvelle option aux select de themes
		function createOptionTheme(theme,selected){
			var option = document.createElement("option");
			option.value = option.text = theme;
			if(selected === true){
				option.selected = true;
			}
			document.getElementById("prepThemes").add(option);
			
			option = option.cloneNode(true);
			if(selected === true){
				option.selected = true;
			}
			document.getElementById("srchThemes").add(option);
		}
	};
	ajx.open("get","./quizz.json",true);
	try{
		ajx.send(null);
	}catch(e){
		console.warn("Votre navigateur ne supporte pas l'AJAX\n"+e.message);
	}
})();

/**
 * Lancer le quizz
**/
function runQuizz(){
	if(currentTest){
		currentTest.stop(true); //arrête un éventuel précédent test (au cas où il ne serait pas fini
	}
	currentTest = new quizzTest();
}

/**
 * Lancer la recherche de quizz
 **/
function runSearch(){
	var elemThemes = document.getElementById("srchThemes"),
		elemNiveau = document.getElementById("srchNiveau"),
		filtre = {themes:[],niveau:[]},
		items, //liste des questions posable
		i, li = elemThemes.options.length;
	
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
	
	//récupération de la liste de question
	items = quizzItems.get(filtre);
	li = items.length;
	if(!li) return; //aucune question n'a été trouvée //TODO faire message
	
	
	//mise à jour de l'entête
	document.getElementById("srchRnb").textContent = li>1? li+" questions ont été trouvées": li+" question a été trouvée";
	
	//mise à jour de la table
	var table = document.getElementById("srchRDetail");
	table.innerHTML = "";
	
	//affichage de la liste
	items.forEach(function(question){
		var input,
			cell,
			row = table.insertRow(-1);
			
		//gestion de la ligne
		row.className = "search";
		row.addEventListener("click",prepareListForAnalyze,false);
	
		//Colonne pour selection
		cell = row.insertCell(-1);
		input = document.createElement("input");
		input.type = "checkbox";
		input.value = '{"id":"'+question.id+'"}';
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
		
		//colonne id
		cell = row.insertCell(-1);
		cell.textContent = question.id;
		
	});
	
	//mise à jour de l'entête du tableau
	majSelectionneur.call(document.getElementById("srchRSelect"));
	
	
	//afficher l'onglet de recherche
	document.getElementById("btn_srchResult").parentNode.className = "";
	
	//refaire le trie
	document.querySelector("#srchResult table").sort(1,1,null);
	
	//affichage de la bonne section
	changeSession("srchResult");
}

/**
 * verification de la réponse envoyée
**/
//vérification lorsque l'utilisateur a choisi sa réponse
function answerDirectQuizz(e){
	if(!document.getElementById("optAutoNext").checked){
		//on n'est pas en mode répondre directement. l'utilisateur doit cliquer sur le bouton "Répondre"
		document.getElementById("btnRepondre").className = "ready";
		return;
	}
	currentTest.reponse(this.value);
}

//vérification lorsque l'utilisateur clique sur le bouton
function answerButtonQuizz(e){
	var reponse = document.querySelector("form#form_quizz input:checked");
	if(!reponse){ //l'utilisateur n'a pas sélectioné de réponse
		reponse = "";
	}else{
		reponse = reponse.value;
	}
	
	currentTest.reponse(reponse);
}

/**
 * Selection des questions pour Analyse
**/
//permet de (dé)sélectionner tous les input du tableau
function selectAll(){
	var listeInput = this.parentNode.parentNode.parentNode.querySelectorAll("input");
	if(this.textContent === "☑"){
		Array.prototype.forEach.call(listeInput,function(input){input.checked=true;});
	}else{
		Array.prototype.forEach.call(listeInput,function(input){input.checked=false;});
	}
	majSelectionneur.call(this);
}

//permet de mettre à jour la valeur de la première colonne du tableau afin de (dé)sélectionner les input 
function majSelectionneur(){
	var btn = this.parentNode.parentNode.parentNode.parentNode.querySelector("th"),
	liste = this.parentNode.parentNode.parentNode.parentNode.querySelectorAll("input:not(:checked)");
	if(liste.length){
		btn.textContent = "☑";
		btn.title = "Tout sélectionner";
	}else{
		btn.textContent = "☐";
		btn.title = "Tout désélectionner";
	}
}

//permet de préparer la liste qui sera envoyé à l'analyse
function prepareListForAnalyze(e){
	if(e.target.tagName === "INPUT") return; //permet d'éviter de selectionner la ligne quand on clique sur le checkbox
	var input = this.querySelector("input"),
		num;

	//vérification si on a cliqué sur une ligne
	if(input){
		input.checked = true;
		num = parseInt(JSON.parse(input.value).id,10);
	}

	//récupération des éléments cochés
	var section = searchParent.call(this,"section"),
		liste = section.querySelectorAll("table input:checked"),
		analyze = []; 
	
	//création de la liste
	Array.prototype.forEach.call(liste,function(input){
		analyze.push(JSON.parse(input.value));
	});
	
	//envoit vers Analyse
	if(liste.length){
		document.getElementById("btn_"+section.id).parentNode.className = "hidden";
		displayAnalyze(analyze,section.id,num);
	}
}

//fonction permettant de trier selon les bonnes/mauvaise réponses
function sortReponses(s1,s2,r1,r2){
	return r1.className > r2.className ? 1 : -1;
}

//fonction permettant de trier selon le niveau
function sortNiveau(s1,s2,r1,r2){
	return niveauToInt(s1) > niveauToInt(s2) ? 1 : -1;
}

/**
 * Section Analyze
**/
//permet d'afficher la section analyze
	//liste : liste des quizz à montrer {id,reponse}
		// id : id du quizz à afficher
		// reponse : reponse eventuelle donnée par l'utilisateur
	//elemBack : section de retour
	//num : numéro de la question de la liste à afficher en premier
var displayAnalyze = (function(){
	var listeItems = [],
		length = listeItems.length,
		sectionBack = "accueil";
		current = 0;
	
	window.addEventListener("load",function(){
		//ajout/modification des événements sur les éléments
		document.getElementById("analyzeBack").onclick = back;
		document.getElementById("analyzePrevious").onclick = previous;
		document.getElementById("analyzeNext").onclick = next;
		document.getElementById("analyzeCodeEdit").onchange = majCode;
		document.querySelector("#quizzAnalyze fieldset.code>button").onclick = test;
	},false);
		
	return init;
	
	//permet d'initialiser la liste
	function init(liste,elemBack,numId){
		var numStart = 0; //numéro auquel l'analyse commence
		
		//sauvegarde des valeurs
		listeItems = liste;
		length = liste.length;
		sectionBack = elemBack;
		
		document.getElementById("analyzePrevious").disabled = false;
		document.getElementById("analyzeNext").disabled = false;
		
		//affichage de l'onglet
		document.getElementById("btn_quizzAnalyze").parentNode.className = "";
		
		//recherche du numéro de position correspondant à la question ayant cet ID
		if(typeof numId === "number"){
			numStart = length;
			while(--numStart && parseInt(listeItems[numStart].id,10) !== numId){}
			//maintenant numStart vaut soit 0 soit la position où se trouve l'ID
		}
		maj(numStart);
	}
	
	//mise à jour de la page
	function maj(num){
		if(num < 0 || num >= length) return false;
		
		current = num;
		changeSession("quizzAnalyze");
		
		//récupération de la question
		var item = quizzItems.get(parseInt(listeItems[current].id,10));
		
		//enregistrement de la reponse de l'utilisateur
		var reponse = listeItems[current].reponse;
		
		//désactiver les boutons
		if(current === 0){
			document.getElementById("analyzePrevious").disabled = true;
		}
		if(current === 1){
			document.getElementById("analyzePrevious").disabled = false;
		}
		if(current === length-1){
			document.getElementById("analyzeNext").disabled = true;
		}
		if(current === length-2){
			document.getElementById("analyzeNext").disabled = false;
		}
		
		//affichage de l'id
		document.querySelector("#quizzAnalyze>nav>div").innerHTML = "id&nbsp;: "+item.id+"<br>Niveau&nbsp;: "+niveauToString(item.niveau);
		
		//remplissage des éléments
		document.getElementById("analyzeCodeRead").innerHTML = color(item.code);
		document.getElementById("analyzeCodeEdit").value = item.code;
		document.querySelector("#quizzAnalyze>nav>output").textContent = (current+1) + " / "+ length;
		
		//remplissage des réponses
		var elemReponse = document.getElementById("analyzeQst"), //element où doivent se mettre les réponses (le ul)
			nbReponse = item.reponses.length, //nb de réponses possible
			elem = document.createDocumentFragment(), //élément temporaire
			i,elemLI,elemSpan,
			irps; //une reponse de l'item
		elemReponse.innerHTML = "";
		
		//structure ul>li>span>text (ul existe déjà dans le document)
		for(i=0;i<nbReponse;i++){
			irps = item.reponses[i];
			
			elemSpan = document.createElement("span");
			elemSpan.textContent = irps;
			
			elemLI = document.createElement("li");
			
			if(item.bonneReponse === irps){
				if(reponse === irps){
					elemLI.className = "bonneReponse userAnswer";
				}else{
					elemLI.className = "bonneReponse";
				}
			}else{
				if(reponse === irps){
					elemLI.className = "userAnswer";
				}
			}
			elemLI.appendChild(elemSpan);
			
			elem.appendChild(elemLI);
		}
		
		elemReponse.appendChild(elem);
		
		
		//mise à jour de l'affichage
		if(typeof reponse === "string"){
			document.getElementById("analyzeDonneReponse").checked = true;
		}else{
			document.getElementById("analyzeDonneReponse").checked = false;
		}
		
		//remplissage de l'explication
		document.getElementById("analyzeExplication").innerHTML = codeColorisation(item.explication);
		document.querySelector("#quizzAnalyze details").open = false;
	}
	
	//permet de revenir à la section précédente
	function back(){
		//cache l'onglet
		document.getElementById("btn_quizzAnalyze").parentNode.className = "hidden";
		
		//affiche l'onglet
		document.getElementById("btn_"+sectionBack).parentNode.className = "";
		
		//change la section
		changeSession(sectionBack);
	}
	
	//permet d'afficher l'item précédent
	function previous(){
		maj(current-1);
	}
	
	//permet d'afficher l'item suivant
	function next(){
		maj(current+1);
	}
	
	//met à jour le code depuis le textarea
	function majCode(){
		document.getElementById("analyzeCodeRead").innerHTML = color(this.value,false);
	}
	
	//permet de tester le code JavaScript
	//ATTENTION le code est exécutée dans un contexte EVAL et non GLOBAL
	function test(){
		var code = document.getElementById("analyzeCodeEdit").value;
		
		if(!/alert\(/.test(code)){ //au cas où le code n'a pas de fonction alert, une alert est ajoutée sur le retour de la dernière action
			code = code.replace(/(?:^|[\r\n])(?:[\r\n]|$)/g,"").replace(/(^|[\n\r;])([^;\r\n]+);?$/,"$1alert($2);");
		}
		
		try{
			var f = new Function(code); //interprétation du code
		}catch(e){
			alert("ERREUR de création\nUne erreur est apparue lors de l'interprétation :\n"+e.message);
		}
		if(f){
			try{
				f(); //exécution du code
			}catch(e){
				alert("ERREUR d'exécution\nUne erreur est survenue pendant l'exécution :\n"+e.message);
			}
		}
	}
})();


/**
 * Initialisation des événements sur les éléments
**/
window.addEventListener("load",function(){
	//boutons de navigation dans l'accueil
	document.getElementById("accueilQuizz").onclick = changeSession.bind(window,"quizzPreparation");
	document.getElementById("accueilExplore").onclick = changeSession.bind(window,"searchQuizz");
	
	//griser le temps dans la préparation du quizz
	document.getElementById("prepIsTime").onchange = function(){
		document.getElementById("prepTime").disabled = !this.checked;
	};
	document.getElementById("prepTime").disabled = !document.getElementById("prepIsTime").checked;
	
	//Utilisation du bouton "Lancer le Quizz"
	document.getElementById("prepRunQuizz").onclick = runQuizz;
	
	//Utilisation du bouton "Lancer la Recherche"
	document.querySelector("#searchQuizz>button").onclick = runSearch;
	
	//utilisation du bouton "répondre"
	document.getElementById("btnRepondre").onclick = answerButtonQuizz;
	
	//bouton (dé)sélectionner
	document.getElementById("rsltSelect").onclick = selectAll;
	document.getElementById("srchRSelect").onclick = selectAll;
	
	//bouton d'analyse
	document.querySelector("#quizzResult>button").onclick = prepareListForAnalyze;
	
	//bouton d'analyse après recherche
	document.querySelector("#srchResult>button").onclick = prepareListForAnalyze;
	
	//ajout des possibilité de trie sur les tableaux de recherche
	new tableSort(document.querySelector("#quizzResult table"),["none","number","string",sortNiveau,"number",sortReponses,sortReponses]);
	new tableSort(document.querySelector("#srchResult table"),["none","number","string",sortNiveau,"number"]);
	
},false);

/**
 * initialisation pour le fallback de navigateurs ne supportant pas les balises details/summary
**/
window.addEventListener("load",function(){
	var liste,i,li;

	if(typeof document.querySelector("details").open === "undefined"){
		//la balise HTML5 details n'est pas connue
		liste = document.querySelectorAll("summary");
		i = 0;
		li = liste.length,
		getterSetter = {
			get: getOpen,
			set: setOpen
		};
		while(i<li){
			Object.defineProperty(liste[i].parentNode, "open", getterSetter);
			liste[i].onclick = openSwitch;
			liste[i++].className = "detailsClosed";
		}
	}

	//fonction permettant d'afficher ou de cacher le details
	function openSwitch(status){
		this.parentNode.open = !this.parentNode.open;
	}
	
	//ouvre ou ferme l'élément en fonction du status
	function setOpen(status){
		if(status === false){
			this.firstElementChild.className = "detailsClosed";
		}else{
			this.firstElementChild.className = "detailsOpen";
		}
	}
	
	//fonction permettant de récupérer le statut ouvert/fermé
	function getOpen(){
		return this.firstElementChild.className === "detailsOpen";
	}
},false);

/**
 * Fonctions diverses pouvant être utilisées partout
**/

//retourne le premier parent du type TAG
function searchParent(tag){
	var elem = this;
	while(elem.parentNode){
		elem = elem.parentNode;
		if(elem.tagName === tag.toUpperCase()) return elem;
	}
	return null;
}

//retourne une chaine correpondant au nom de la difficultée
function niveauToString(niveau){
	var niveauStr = ["Débutant","Facile","Moyen","Assez difficile","Difficile","Très difficile"][niveau];
	if(typeof niveauStr === "undefined"){
		niveauStr = "Tous";
	}
	return niveauStr;
}

//retourne une chaine correpondant au nom de la difficultée
function niveauToInt(niveau){
	var niveauStr = ["Débutant","Facile","Moyen","Assez difficile","Difficile","Très difficile"];
	return niveauStr.indexOf(niveau);
}


//retourne une chaine correpondant au format de temps adapté (00:12:25)
function timeFormat(tmps){
	tmps = Math.floor(tmps);
	var heure = Math.floor(tmps/3600),
		min = Math.floor((tmps%3600)/60),
		s = tmps%60,
		txt = "";
	
	if(heure<10) txt+= "0";
	txt+= heure + ":";
	
	if(min<10) txt+= "0";
	txt+= min + ":";
	
	if(s<10) txt+= "0";
	txt+= s;
	
	return txt;
}
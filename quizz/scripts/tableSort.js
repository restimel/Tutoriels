/**
License: You are free to use, share, redistribute and modify it if you keep all authors and contributors names. ( http://creativecommons.org/licenses/by/3.0/)

License : Vous êtes autorisés à utiliser, partager, redistribuer et modifier ce code tant que vous gardez les noms des auteurs et contributeurs. (http://creativecommons.org/licenses/by/3.0/deed.fr)


	Il s'agit d'un petit script permettant de trier un tableau selon un de ses colones en cliquant sur l'entête.
	Les colonnes peuvent êtres triées selon différentes méthodes
		string	: selon les caractères (M10 est avant M2)
		number	: selon les nombres (10 est après 2, M10 est après M2)
		random	: au hasard
		none	: ne trie pas
	
	fichier original : disponible http://b.mariat.free.fr/
	
	Author : Benoit Mariat
	Date : 2013 - 05 - 19 (création)
**/

"use strict";

var tableSort = (function(){

	//fonctions à utiliser selon le type de tri
	var tri = {
		string : sortString,
		number : sortWithNumber,
		random : sortRandom,
		none : sortNone //Default
	}
	
	function tableSort(tableElement, sortType, sortedElement){
	//initialisation d'une gestion de trie sur un tableau	
		if( !(this instanceof tableSort) ){
			new tableSort(tableElement, sortType, sortedElement);
			return;
		}
		
		var i = 0,
			li = sortType.length,
			f;
	
		//remplacement des types par des fonctions
		this.sortMethod = [];
		while(i<li){
			if(typeof sortType[i] === "function"){
				f = sortType[i];
			}else if(typeof tri[sortType[i].toLowerCase()] === "function"){
				f = tri[sortType[i].toLowerCase()];
			}else{
				f = tri.none;
			}
			i = this.sortMethod.push(f);
		}

		//sauvegarde de l'élément à trier
		this.tableElement = tableElement;
		this.tableElement.addEventListener("click", evntClick.bind(this),false);
		
		//récupération de l'élément où doit se faire le tri
		this.sortedElement = sortedElement || this.tableElement.querySelector("tbody");
		
		//dernier élément de tri
		this.elemSorted = null; //référence au dernier élément ayant servi pour le tri
		
		//attache à l'élément
		this.tableElement.sort  = this.sort.bind(this);
		
	}
	
	/*
	 * Execute le tri
	 * 	col : numéro de la colonne de tri
	 * 	order : order de tri (1 : Ascendant, -1: Descendant)
	 * 	elemHead : référence à l'élément déclencheur (th)
	 * 	fSort : fonction à appliquer pour le tri (Default, celui définit pour cette colonne pendant l'initialisation)
	 */
	tableSort.prototype.sort = function(col, order, elemHead, fSort){
		//récupération de la fonction de tri
		fSort = typeof fSort === "function" ? fSort : this.sortMethod[col];
		
		if(fSort.name === "sortNone"){
			return;
		}
		
		//fonction permettant de réaliser le trie avec les bons paramètres
		function doSort(o1,o2){
			return fSort(o1[0],o2[0],o1[1],o2[1])*order;
		}
		
		//default value
		order = typeof order === "number" ? order : 1;
		
		//prépare un tableau à trier
		var rows = this.sortedElement.rows,
			i = 0,
			li = rows.length,
			//elemTri = [];
			elemTri = new Array(li);
		
		while(i<li){
			//i = elemTri.push([rows[i].cells[col].textContent, rows[i]]);
			elemTri[i] = [rows[i].cells[col].textContent, rows[i++]];
		}
			
		//effectue le tri
		elemTri = elemTri.sort(doSort);
		
		//applique les modifications à l'élément
		var df = document.createDocumentFragment();
		for(i=0;i<li;i++){
			df.appendChild(elemTri[i][1]);
		}
		this.sortedElement.appendChild(df);
		
		//applique les modifications à l'élément ayant servi à réaliser le tri
		if(this.elemSorted){
			this.elemSorted.className = ""; //TODO utiliser classList (mais probleme compatibilite IE9-)
		}
		this.elemSorted = elemHead;
		if(elemHead){
			elemHead.className = order === 1 ? "sortAsc" : "sortDesc"; //TODO utiliser classList (mais probleme compatibilite IE9-)
		}
	}
	
	
	//permet de gérer le click sur le tableau
	function evntClick(e){
		//vérifie que l'élément cliqué est un TH
		if(e.target.tagName !== "TH"){
			return;
		}
		
		//récupération du numéro de colonne
		var col = e.target.cellIndex;
		
		
		//ordre du tri
		var order = 1;
		if( e.target === this.elemSorted){
			order = e.target.className === "sortAsc" ? -1 : 1; //TODO utiliser classList (mais probleme compatibilite IE9-)
		}
		
		//exécute le tri
		this.sort(col, order, e.target);
	}
	
	
	/*
	 * Fonctions servant à ordronner deux cahines
	 */
	
	//permet de trier selon les caractères
	function sortString(s1, s2){
		if(s1 == s2){
			return 0;
		}
		if(s1 < s2){
			return -1;
		}else{
			return 1;
		}
	}


	//permet de trier une chaine en triant selon les nombres décimaux s'il y a des chiffres
	function sortWithNumber(s1, s2){
		if(!s1 && s1 !== 0) s1="";
		if(!s2 && s2 !== 0) s2="";
		s1 = s1.toString();
		s2 = s2.toString();
		if(s1 === s2){
			return 0;
		}

		//on extrait la partie nombre du texte
		var	t1 = s1.match(rgxSortWithNumber),
			t2 = s2.match(rgxSortWithNumber),
			rslt;
		if(!t1){return -1;}
		if(!t2){return 1;}
		if(t1[1] === t2[1]){
			if(t1[2] === t2[2]){
				return sortWithNumber(t1[3],t2[3]); //on cherche le nombre suivant
			}else if(parseInt(t1[2]||0,10)<parseInt(t2[2]||0,10)){ //comparaison entre nombre
				rslt = -1;
			}else{
				rslt = 1;
			}
		}else if(t1[1]<t2[1]){
			rslt = -1;
		}else{
			rslt = 1;
		}
		
		return rslt;
	}
	var rgxSortWithNumber = /^([^\d]*)([\d]*)([^\d].*?)?$/;	//est mis global à sortWithNumber afin d'éviter de le recréer à chaque fois
	
	//permet de trier au hasard
	function sortRandom(){
		return Math.random() - 0.5;
	}
	
	//permet de ne pas trier
	function sortNone(){
		return 0;
	}
	
	return tableSort;
})();

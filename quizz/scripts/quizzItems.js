/*
	gestion de la liste de toutes les questions
	
	objet: quizzItems
	Propriétés: 
		liste (Array) : liste des items (des questions)
		length (number) : nombre d'items
		themes (Array) : liste de tous les thèmes présent dans les items
	
	Méthodes:
		get(id) : récupère l'item ayant pour id le paramètre id (number)
				retourne un item
		get({}) : permet de récupérer une liste d'items correspondant au filtre définit par le paramètre
				retourne un Array contenant les items
				Le filtre possède les propriétées suivantes:
					id (Array) : liste des id acceptés (par défaut : tous)
					themes (Array) : liste des thèmes acceptés (par défaut : tous)
					niveau (Array) : liste des niveaux de difficulté acceptés (par défaut : tous)
				Pour correspondre un item doit satisfaire à tous les critères du filtre
		init() : sert à configurer les informations de l'objet. Doit être appelé après toutes modifications de l'objet quizzItems (ajout/suppression d'items)
*/
"use strict";

var quizzItems = {
	liste:[],
	length:0,
	themes:[],
	get:function(filter){ //permet de récupérer un ou des items en fonction du filtre
		var i, li=this.length;
		if(typeof filter === "number"){
			//recherche de l'id
			for(i=0;i<li;i++){
				if(this.liste[i].id === filter){
					return this.liste[i];
				}
			}
			return {id:0};
			
		}else{
			//recherche avec filtre
			return this.liste.filter(function(item){
				if(filter.id instanceof Array && filter.id.indexOf(item.id) === -1) return false; //id n'est pas présent dans la liste
				if(filter.themes instanceof Array && filter.themes.indexOf("Tous") === -1 && item.theme.every(function(theme){return filter.themes.indexOf(theme.toLowerCase()) === -1;})) return false; //aucun theme n'est présent dans la liste
				if(filter.niveau instanceof Array && filter.niveau.indexOf(item.niveau.toString()) === -1 && filter.niveau.indexOf("-1") === -1) return false; //niveau n'est pas présent dans la liste
				return true;
			});
		}
		
	},
	init:function(){ //permet de réinitialiser les paramètres de l'objet
		var li = this.liste.length,
			i,j,lj,item,
			themes = [];
		
		for(i=0;i<li;i++){
			item=this.liste[i];
			lj=item.theme.length;
			for(j=0;j<lj;j++){
				if(themes.indexOf(item.theme[j].toLowerCase()) === -1){
					themes.push(item.theme[j].toLowerCase());
				}
			}
		}

		this.length = li;
		this.themes = themes.sort();
	}
};


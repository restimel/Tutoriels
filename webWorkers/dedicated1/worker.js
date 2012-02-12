setTimeout(function(){
//le setTimeout ne sert qu'à permettre de bien voir les premiers messages

	//on informe le thread principal que le jardinier est prêt	
	postMessage("Le jardinier est dans son potager et est en train de faire pousser ses premières plantes");

	var jardin = [0,0,0,0,0];
	var plantePrete = 0;
	var parcelle;

	while(true){ //boucle infinie, on reste toujours là à "arroser les plantes"
		for(parcelle=0; parcelle<5; parcelle++){
			jardin[parcelle] += Math.random(); //on arrose un peu, et ça fait grandir la plante
			if(jardin[parcelle]>1000000){
			//la plante est suffisament grande et on la cueille
				jardin[parcelle] = 0;
				plantePrete++;
				postMessage("Le jardinier a pu récolter "+plantePrete+" plantes"); //régulièrement on informe le thread principal des plantes récoltées
			}
		}//boucle de fin de la parcelle
	}//boucle infinie

},1000);

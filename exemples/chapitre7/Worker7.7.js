var l = 50000000;
var tab = [];

//on remplit un tableau
for (var i = 0; i < l; i++) {
	//À chaque itération la mémoire consommée augmente
	tab.push("message");
	//tous les 100 tours, on informe le thread principal
	if (i%100 === 0) {
		postMessage(i);
	}
}
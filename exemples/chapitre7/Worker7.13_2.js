var a = 10;
var b = 20;
var c = 30;

function test(){
	var a = 1;
	var b = 2;
	var c = 3;

	importScripts("calcul2.js");

	var resultat1 = a; //vaut 1
	var resultat2 = self.a; //vaut 50
	postMessage("\nresultat1: " + resultat1 + "\nresultat2: " + resultat2);
} 

test();
//Bien que importScripts ait été appelé dans la fonction, son environnement
//de travail est l'espace global.
//Ce sont donc les variables a, b et c de self qui ont été modifiées et non
//pas les variables locales de la fonction test.
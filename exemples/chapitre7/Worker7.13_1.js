var a = 10;
var b = 20;
var c = 30;

importScripts("calcul2.js");

var resultat = a; //vaut 50
//Dans cet exemple la variable a a été modifiée dans le fichier importé.
//Ceci confirme le caractère synchrone de l’import.

postMessage(resultat);
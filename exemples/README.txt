Pour faire fonctionner l'ensemble des codes d'exemples sur un site différent, il y a quelques précaution à prendre et il faut changer certains fichiers.


Le site doit être en HTTPS pour faire fonctionner les services Workers et les codes de gestion de caches, et la géolocalisation sur certains navigateurs.

Il y a également un exemple qui demande une clef google map. La clef qui est actuellement dans le code n'autorise que la récupération des tuiles depuis Github (et le repository Restimel). Il faut donc générer une clef Google Map (https://developers.google.com/maps/documentation/javascript/get-api-key?hl=fr) et la lier au site où se trouve le code.
La page où se trouve la clef à changer est: chapitre3/ex3.5.html

Certains codes demandent des url absolues (depuis le nom de dommaine), il faut donc changer les valeurs de ces URL.
Les fichiers à modifier sont:
	chapitre7/sworker/sw1/baseURL.js
	chapitre7/sworker/sw2/baseURL.js
(attention à la différence entre ces 2 fichiers (dans leur nom et dans leur contenu): sw1 et sw2)

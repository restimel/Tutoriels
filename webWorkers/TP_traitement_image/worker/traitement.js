//ajout d'un script permettant de définir la liste des filtres (création de la variable globale listeFiltre)
if(self.importScripts){
	importScripts("filtres.js");
}

function gestionMessage(event){
	var data = event.data,
		uid = data.uid;
	self.postMessage({status:"start",uid:uid});
	var image1D = data.image;
	if(typeof image1D === "string"){
		image1D = JSON.parse(image1D);
	}
	var image2D = conversionImage(image1D,data.width, uid); //prepare l'image en 2D (+RVB)
	image2D = appliquerFiltre(image2D, data.idFiltre, uid); //on applique le filtre à l'image
	self.postMessage({status:"end",uid:uid,image:image2D}); //on envoit le résultat
}

self.onmessage = gestionMessage;

//permet de convertir un tableaude pixel 1D en 2D
function conversionImage(image1D,w,uid){
	//prepare l'image en 2D (+RVB)
	var image2D = [],
		i,
		x=0,
		y=0,
		li = image1D.length;
	
	for(i=0 ; i<li; i++){
		if(y===0){
			image2D[x]=[];
		}
		image2D[x][y]=[];
		image2D[x][y][0]=image1D[i++];
		image2D[x][y][1]=image1D[i++];
		image2D[x][y][2]=image1D[i++];
		if(++x>=w){
			x=0;
			if(typeof window === "undefined" && !(y%10)){ //dans le cas où on est dans un worker on envoit une mise à jour
				self.postMessage({status:"update",uid:uid,progression:i*100/li});
			}
			y++
		}
	}
	
	return image2D;
}

//permet d'appliquer le filtre sur l'image
function appliquerFiltre(image, idFiltre, uid){
	var filtre = (listeFiltre[idFiltre] && listeFiltre[idFiltre].filtre) || [[]], //récupère le filtre s'il existe ou alors génère un filtre vide
		imgX, //position X sur l'image
		imgY, //position Y sur l'image
		imgMaxX = image.length, // largeur de l'image
		imgMaxY = image[0].length, //hauteur de l'image
		fltX, //position X sur le filtre
		fltY, //position Y sur le filtre
		fltMaxX = filtre.length, //largeur du filtre
		fltMaxY = filtre[0].length, //hauteur du filtre
		fltOffsetX = (fltMaxX - 1)/2, //offset X à appliquer sur le filtre pour trouver le bon pixel sur l'image
		fltOffsetY = (fltMaxY - 1)/2, //offset Y à appliquer sur le filtre pour trouver le bon pixel sur l'image
		index, //sert à identifier la position par rapport à la liste des pixels
		sommeRouge, //valeur temporaire pour l'application du filtre sur un pixel
		sommeVert, //valeur temporaire pour l'application du filtre sur un pixel
		sommeBleu, //valeur temporaire pour l'application du filtre sur un pixel
		x, //index X temporaire pour chercher le bon pixel dans l'image
		y, //index Y temporaire pour chercher le bon pixel dans l'image
		imageFinale=[]; // liste des pixels finales
	
	imageX:for(imgX = 0; imgX<imgMaxX; imgX++){
		if(typeof window === "undefined" && !(imgX%10)){ //dans le cas où on est dans un worker on envoit une mise à jour
			self.postMessage({status:"update",uid:uid,progression:100+imgX*100/imgMaxX});
		}
		imageFinale[imgX] = [];
		imageY:for(imgY = 0; imgY<imgMaxY; imgY++){
			sommeRouge = 0;
			sommeVert = 0;
			sommeBleu = 0;
			filtreX:for(fltX = 0; fltX<fltMaxX; fltX++){
				x = imgX + fltX + fltOffsetX;
				if( x < 0 || x >= imgMaxX){
					continue filtreX;
				}
				filtreY:for(fltY = 0; fltY<fltMaxY; fltY++){
					y = imgY + fltY + fltOffsetY;
					if( y < 0 || y >= imgMaxY){
						continue filtreY;
					}
					sommeRouge += image[x][y][0] * filtre[fltX][fltY];
					sommeVert += image[x][y][1] * filtre[fltX][fltY];
					sommeBleu += image[x][y][2] * filtre[fltX][fltY];
				}
			}
			imageFinale[imgX][imgY] = [sommeRouge, sommeVert, sommeBleu];
		}
	}
	
	return imageFinale;
}

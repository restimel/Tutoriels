var num=0;
onconnect=function(e){
	var port = e.ports[0];
	port.postMessage("pret #"+num+" ? "+self.name);
	port.onmessage=function(event){
		port.postMessage("réponse à "+event.data);
	};
	num++; // incrémente pour chaque connection à ce thread
};


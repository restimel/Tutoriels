if(self.Worker){
	//on crée un nouveau worker
	var w=new Worker("worker2.js");
	w.addEventListener("message",function(event){
		//on transmet au parent (en modifiant le message)
		postMessage('worker2 me dit de te dire que "'+event.data+'"');
	},false);

	//on gère la communication avec le parent
	addEventListener("message",function(event){
		//on transmet le message au worker tel quel
		w.postMessage(event.data);
	},false);

}else{
  //le navigateur ne gère pas les workers dans un worker
  postMessage("Votre navigateur ne supporte pas les Workers dans les Workers ☹");
}


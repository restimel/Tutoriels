if(window.Worker){
//le navigateur supporte les workers

	//Création d'un Blob
	var blob=null;
	if(window.BlobBuilder){
		blob = new BlobBuilder();
	}else if(window.WebKitBlobBuilder){
		blob = new WebKitBlobBuilder();
	}else if(window.MozBlobBuilder){
		blob = new MozBlobBuilder();
	}else if(window.OBlobBuilder){
		blob = new OBlobBuilder();
	}else if(window.MsBlobBuilder){
		blob = new MsBlobBuilder();
	}else{
		alert("Désolé votre navigateur ne semble pas supporter les Blob ☹");
	}

	if(blob){
		//le navigateur supporte les Blob
		blob.append("onmessage = function(e){ postMessage('je réponds au message : ' + e.data); };"); //code du worker

		//création de l'URL
		var compatibleURL = window.URL || window.webkitURL || window.MozURL || window.mozURL || window.oURL || window.OURL || window.MsURL;
			
		if(!compatibleURL){
			alert("Désolé votre navigateur ne semble pas supporter la création d'URL à partir d'objet ☹");
		}else{
			var blobUrl = compatibleURL.createObjectURL(blob.getBlob()); //création de l'url à partir de l'objet


			var worker = new Worker(blobUrl); //création du worker
			worker.onmessage=function(e){
				alert(e.data);
			};
			worker.postMessage("Bonjour");
		}
	}



}else{
//le navigateur ne supporte pas les workers
	alert("Désolé votre navigateur ne supporte pas les workers ! ☹");
}

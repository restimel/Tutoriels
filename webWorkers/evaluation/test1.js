(function(){
var dWorker=taches.get("Dedicated-Worker");

if(typeof window.Worker !== "undefined"){
	dWorker.set("Dedicated-Worker",true);
	try{
		var w=new Worker("dworker/worker1_1.js");
		if(typeof w.postMessage === "function"){
			dWorker.set("worker.postMessage",true);
			w.postMessage("Message #001");
			w.postMessage({msg:"Message #002",code:2});
			w.postMessage("Message #003");
			w.postMessage("Message #004");
			setTimeout(function(){w.postMessage("Message #005");},100);
			//setTimeout(function(){w.postMessage("Message #008");},500); //close
		}
		
		var w2_1=new Worker("dworker/worker1_2.js");
		w2_1.postMessage("create onclose");
		w2_1.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				dWorker.set("self.close",true);
			}else if(data === "AfterClose"){
				dWorker.set("self.close",false);
			}else if(data === "self.onclose"){
				dWorker.set("self.onclose",true);
			}else if(data === "error"){
				dWorker.set("self.close",false);
			}
		};
		w2_1.postMessage("close");
		w2_1.postMessage("error");
		
		var w2_2=new Worker("dworker/worker1_2.js");
		w2_2.postMessage("create Listener close");
		w2_2.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				dWorker.set("self.close",true);
			}else if(data === "AfterClose"){
				dWorker.set("self.close",false);
			}else if(data === "self.addEventListener(close)"){
				dWorker.set("self.addEventListener(close)",true);
			}
		};
		w2_2.postMessage("close");
		
		var w2_3=new Worker("dworker/worker1_2.js");
		w2_3.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				dWorker.set("self.close",true);
			}else if(data === "AfterClose"){
				dWorker.set("self.close",false);
			}
		};
		w2_3.onclose=function(e){
			dWorker.set("worker.onclose",true);
		};
		w2_3.postMessage("close");
		
		var w2_4=new Worker("dworker/worker1_2.js");
		w2_4.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				dWorker.set("self.close",true);
			}else if(data === "AfterClose"){
				dWorker.set("self.close",false);
			}else if(data === "self.addEventListener(close)"){
				dWorker.set("self.addEventListener(close)",true);
			}
		};
		w2_4.addEventListener("close",function(e){
			dWorker.set("worker.addEventListener(close)",true);
		},false);
		w2_4.postMessage("close");
		
		var w3=new Worker("dworker/worker1_2.js");
		w3.onmessage=function(e){
			var data=e.data;
			if(data === "firstMessage"){
				if(w3.terminate){
					dWorker.set("worker.Terminate",true);
					w3.terminate();
					try{
						w3.postMessage("error");
					}catch(e){}
				}
			}else if(data === "secondMessage"){
				dWorker.set("worker.Terminate",false);
			}
		};
		w3.onerror=function(){dWorker.set("worker.Terminate",false);};
		w3.postMessage("send 2 messages");
		
		var w4=new Worker("dworker/worker1_3.js");
		w4.postMessage("Message #010");
		w4.postMessage("Message #011");
		w4.postMessage("Message #012");
		
	}catch(e){
		console.log(e);
	}
	
	try{
		if(typeof window.MessageChannel !== "undefined"){
			taches.set("MessageChannel",true);
			var ch=new MessageChannel();
			ch.port1.onmessage=function(){
				taches.set("port1←port2",true);
			};
			ch.port2.onmessage=function(){
				taches.set("port1→port2",true);
			};
			ch.port1.postMessage("msg");
			ch.port2.postMessage("msg");
			
			setTimeout(function(){
				ch.port1.onmessage=function(e){
					if(e.data==="Response #006"){
						var pstMsg=dWorker.get("worker.postMessage");
						pstMsg.set("worker.postMessage",true);
						pstMsg.set("transfert Port",true);
						dWorker.set("self.onmessage",true);
					}
				};
				w.postMessage("Message #006",[ch.port2]);
			},10);
		}
		w.postMessage("Message #007");
	}catch(e){
		console.log(e);
	}
	
	try{
		w.onmessage=function(e){
			var data=e.data;
			dWorker.set("worker.onmessage",true);
	
			if(data === "Response #001"){
				dWorker.set("send String",true);
				dWorker.set("self.onmessage",true);
				var sPstMsg=dWorker.get("self.postMessage");
				sPstMsg.set("self.postMessage",true);
				sPstMsg.set("send String",true);
			}else if(data === "Response #002"){
				dWorker.set("send Object",true);
				dWorker.set("self.onmessage",true);
				var sPstMsg=dWorker.get("self.postMessage");
				sPstMsg.set("self.postMessage",true);
				sPstMsg.set("send String",true);
			}else if(data && data.msg ===  "Response #003" && data.code === 3){
				dWorker.set("send String",true);
				dWorker.set("self.onmessage",true);
				var sPstMsg=dWorker.get("self.postMessage");
				sPstMsg.set("self.postMessage",true);
				sPstMsg.set("send Object",true);
			}else if(data === "Response #007"){
				dWorker.set("self.onmessage",true);
				dWorker.set("new MessageChannel",true);
				if(e.ports && e.ports[0]){
					e.ports[0].onmessage=function(e){
						if(e.data==="Channel #007"){
							var pstMsg=dWorker.get("self.postMessage");
							pstMsg.set("self.postMessage",true);
							pstMsg.set("transfert Port",true);
						}
					};
				}
			}else if(data === "Error"){
				dWorker.set("send String",true);
				dWorker.set("self.onmessage",true);
				dWorker.set("self.onerror",true);
			}else if(data === "XMLHttpRequest"){
				dWorker.set("send String",true);
				dWorker.set("XMLHttpRequest",true);
			}else if(data === "self.navigator"){
				dWorker.set("send String",true);
				dWorker.set("self.navigator",true);
			}else if(data === "self.location"){
				dWorker.set("send String",true);
				dWorker.set("self.location",true);
			}else if(data === "new dedicated-Worker"){
				dWorker.set("send String",true);
				dWorker.set("new dedicated-Worker",true);
			}else if(data === "new shared-Worker"){
				dWorker.set("send String",true);
				dWorker.set("new shared-Worker",true);
			}else{
				alert(data.msg + " → " + data.data);
			}
		};
		
		w4.addEventListener("message",function(e){
			var data=e.data;
			dWorker.set("worker.addEventListener(message)",true);
			switch(data){
				case "Response #010":
					dWorker.set("send String",true);
					dWorker.set("self.addEventListener(message)",true);
					break;
				case "Error #012":
					dWorker.set("self.addEventListener(error)",true);
					break;
				case "importScripts":
					dWorker.set("importScripts",true);
					break;
				case "importScripts_1":
					dWorker.set("importScripts with one file",true);
					break;
				case "importScripts_X":
					dWorker.set("importScripts with many files",true);
					break;
			}
		},false);
	}catch(e){
		console.log(e);
	}
	
	try{
		w.onerror=function(e){
			dWorker.set("worker.onerror",true);
		};
		w4.addEventListener("error",function(e){
			dWorker.set("worker.addEventListener(error)",true);
		},false);
	}catch(e){
		console.log(e);
	}
	
	try{
		var fileContents = ["onmessage=function(e){postMessage('je réponds au message : '+e.data);};"],
			blob=null;
		if(window.Blob){
			blob = new Blob(content);
		}else{
			dWorker.set("inline",false);
		}

		if(blob){
			dWorker.set("blob",true);
			if(!window.Blob){
				dWorker.set("blob",false); //Blob works but not with the "official" one
			}
		}
		
		var compatibleURL = window.URL || window.webkitURL || window.MozURL || window.mozURL || window.oURL || window.OURL || window.MsURL;
		if(compatibleURL){
			if(compatibleURL.createObjectURL){
				dWorker.set("createObjectURL",true);
			}
			if(!window.URL){
				dWorker.set("createObjectURL",false); //URL works but not with the "official" one
			}
			if(blob){
				var blobUrl = compatibleURL.createObjectURL(blob);
				var worker = new Worker(blobUrl);
				worker.onmessage=function(e){
					dWorker.set("inline",true);
					worker.terminate();
				};
				worker.postMessage("bonjour");
			}
		}
	}catch(e){
		console.log(e);
	}
}
setTimeout(function(){
	function terminate(worker){
		try{
			worker.terminate();
		}catch(e){}
	}
	terminate(w);
	terminate(w2_1);
	terminate(w2_2);
	terminate(w2_3);
	terminate(w2_4);
	terminate(w3);
	terminate(w4);
},5000);
})();

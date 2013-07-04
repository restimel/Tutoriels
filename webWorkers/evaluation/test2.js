(function(){
var sWorker=taches.get("Shared-Worker");

if(typeof window.SharedWorker !== "undefined"){
	sWorker.set("Shared-Worker",true);
	try{
		var sw=new SharedWorker("sworker/worker2_1.js");
		if(sw.port && typeof sw.port.postMessage === "function"){
			sWorker.set("worker.port.postMessage",true);
			sw.port.postMessage("Message #101");
			sw.port.postMessage({msg:"Message #102",code:2});
			sw.port.postMessage("Message #103");
			sw.port.postMessage("Message #104"); //error
			setTimeout(function(){sw.port.postMessage("Message #105");},100); //error
			setTimeout(function(){sw.port.postMessage("Message #106");},200); //error
		}
		
		//sert à tester le self.close() et le self.onclose
		var sw2_1=new SharedWorker("sworker/worker2_2.js","sw2_1");
		sw2_1.port.postMessage("create onclose");
		sw2_1.port.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				sWorker.set("self.close",true);
			}else if(data === "AfterClose"){
				sWorker.set("self.close",false);
			}else if(data === "self.onclose"){
				sWorker.set("self.onclose",true);
			}else if(data === "error"){
				sWorker.set("self.close",false);
			}
		};
		sw2_1.port.postMessage("self.close");
		sw2_1.port.postMessage("error");
		
		//sert à tester le self.addEventListener(close)
		var sw2_2=new SharedWorker("sworker/worker2_2.js","sw2_2");
		sw2_2.port.postMessage("create Listener close");
		sw2_2.port.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				sWorker.set("self.close",true);
			}else if(data === "AfterClose"){
				sWorker.set("self.close",false);
			}else if(data === "self.addEventListener(close)"){
				sWorker.set("self.addEventListener(close)",true);
			}
		};
		sw2_2.port.postMessage("self.close");
		
		//sert à tester le port.close() et le port.onclose
		var sw2_3=new SharedWorker("sworker/worker2_2.js","sw2_3");
		sw2_3.port.postMessage("create port.onclose");
		sw2_3.port.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				sWorker.set("port.close",true);
			}else if(data === "AfterClose"){
				sWorker.set("port.close",false);
			}else if(data === "port.onclose"){
				sWorker.set("port.onclose",true);
			}else if(data === "error"){
				sWorker.set("port.close",false);
			}
		};
		sw2_3.port.postMessage("port.close");
		sw2_3.port.postMessage("error");
		
		//sert à tester le port.addEventListener(close)
		var sw2_4=new SharedWorker("sworker/worker2_2.js","sw2_4");
		sw2_4.port.postMessage("create Listener port.close");
		sw2_4.port.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				sWorker.set("port.close",true);
			}else if(data === "AfterClose"){
				sWorker.set("port.close",false);
			}else if(data === "port.addEventListener(close)"){
				sWorker.set("port.addEventListener(close)",true);
			}
		};
		sw2_4.port.postMessage("port.close");
		
		/*
		//sert à tester le worker.onclose
		var w2_3=new Worker("sworker/worker1_2.js");
		w2_3.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				sWorker.set("self.close",true);
			}else if(data === "AfterClose"){
				sWorker.set("self.close",false);
			}
		};
		w2_3.onclose=function(e){
			sWorker.set("worker.onclose",true);
		};
		w2_3.postMessage("self.close");
		
		//sert à tester le worker.port.addEventListener(close)
		var w2_4=new Worker("sworker/worker1_2.js");
		w2_4.onmessage=function(e){
			var data=e.data;
			if(data === "BeforeClose"){
				sWorker.set("self.close",true);
			}else if(data === "AfterClose"){
				sWorker.set("self.close",false);
			}else if(data === "self.addEventListener(close)"){
				sWorker.set("self.addEventListener(close)",true);
			}
		};
		w2_4.addEventListener("close",function(e){
			sWorker.set("worker.addEventListener(close)",true);
		},false);
		w2_4.postMessage("self.close");
		*/
		
		//sert à tester le terminate
		var sw3=new SharedWorker("sworker/worker2_2.js","sw3");
		sw3.port.onmessage=function(e){
			var data=e.data;
			if(data === "firstMessage"){
				if(sw3.terminate){
					sWorker.set("worker.Terminate",true);
					sw3.terminate();
					try{
						sw3.port.postMessage("error");
					}catch(e){}
				}
			}else if(data === "secondMessage"){
				sWorker.set("worker.Terminate",false);
			}
		};
		sw3.onerror=function(){sWorker.set("worker.Terminate",false);};
		sw3.port.onerror=function(){sWorker.set("worker.Terminate",false);};
		sw3.port.postMessage("send 2 messages");
		
		//sert à tester les addEventlistener + importsScripts
		var sw4=new SharedWorker("sworker/worker2_3.js");
		sw4.port.postMessage("Message #110");
		sw4.port.postMessage("Message #111");
		sw4.port.postMessage("Message #112");
		
		//multi-access
		var sw5_1=new SharedWorker("sworker/worker2_4.js");
		var sw5_2=new SharedWorker("sworker/worker2_4.js");
		
		sw5_1.port.onmessage=function(e){
			var data=e.data;
			if(data.msg === "counter"){
				if(data.cmpt === 1){
				}else{
					sWorker.set("multi-access",false);
				}
			}else if(data.msg === "response"){
				if(data.cmpt === 2){
					sWorker.set("multi-access",true);
				}else{
					sWorker.set("multi-access",false);
				}
			}
		};
		sw5_2.port.onmessage=function(e){
			var data=e.data;
			if(data.msg === "counter"){
				if(data.cmpt === 2){
					sWorker.set("multi-access",true);
				}else{
					sWorker.set("multi-access",false);
				}
			}else if(data.msg === "response"){
				sWorker.set("worker.Terminate",false);
			}
		};
		sw5_1.port.postMessage("hello");
		setTimeout(function(){
			sw5_1.terminate();
			try{
				sw5_2.port.postMessage("hello");
			}catch(e){
				sWorker.set("worker.Terminate",true);
			}
		},200);

		//named workers
		var sw5_3=new SharedWorker("sworker/worker2_4.js","first");
		var sw5_4=new SharedWorker("sworker/worker2_4.js","second");
		var sw5_5=new SharedWorker("sworker/worker2_4.js","first");
		sw5_3.port.onmessage=function(e){
			var data=e.data;
			if(data.msg === "counter"){
				if(data.name === "first"){
					sWorker.set("self.name",true);
				}else{
					sWorker.set("self.name",false);
				}
				if(data.cmpt === 1){
				}else{
					sWorker.set("named worker",false);
				}
			}else if(data.msg === "response"){
				if(data.cmpt === 2){
					sWorker.set("named worker",true);
				}else{
					sWorker.set("named worker",false);
				}
			}
		};
		sw5_4.port.onmessage=function(e){
			var data=e.data;
			if(data.msg === "counter"){
				if(data.name === "second"){
					sWorker.set("self.name",true);
				}else{
					sWorker.set("self.name",false);
				}
				if(data.cmpt === 1){
				}else{
					sWorker.set("named worker",false);
				}
			}
		};
		sw5_5.port.onmessage=function(e){
			var data=e.data;
			if(data.msg === "counter"){
				if(data.name === "first"){
					sWorker.set("self.name",true);
				}else{
					sWorker.set("self.name",false);
				}
				if(data.cmpt === 2){
					sWorker.set("named worker",true);
				}else{
					sWorker.set("named worker",false);
				}
			}else if(data.msg === "response"){
				if(data.cmpt === 2){
					sWorker.set("named worker",true);
				}else{
					sWorker.set("worker.Terminate",false);
				}
			}
		};
		sw5_3.port.postMessage("hello");
		setTimeout(function(){
			sw5_3.terminate();
			try{
				sw5_5.port.postMessage("hello");
			}catch(e){
				sWorker.set("worker.Terminate",true);
			}
			try{
				sw5_4.port.postMessage("hello");
			}catch(e){
				sWorker.set("worker.Terminate",false);
			}
		},200);

	}catch(e){
		console.log(e);
	}
	
	try{
		if(typeof window.MessageChannel !== "undefined"){
			taches.set("MessageChannel",true);
			var ch=new MessageChannel();
			
			
			ch.port1.onmessage=function(e){
				if(e.data==="Response #107"){
					var pstMsg=sWorker.get("worker.port.postMessage");
					pstMsg.set("worker.port.postMessage",true);
					pstMsg.set("transfert Port",true);
					sWorker.set("self.port.onmessage",true);
				}
			};
			sw.port.postMessage("Message #107",[ch.port2]);
			
		}
		sw.port.postMessage("Message #108");
	}catch(e){
		console.log(e);
	}
	
	try{
		sw.port.onmessage=function(e){
			var data=e.data;
			sWorker.set("worker.port.onmessage",true);
	
			if(data === "Response #101"){
				sWorker.set("send String",true);
				sWorker.set("self.port.onmessage",true);
				var sPstMsg=sWorker.get("self.port.postMessage");
				sPstMsg.set("self.port.postMessage",true);
				sPstMsg.set("send String",true);
			}else if(data === "Response #102"){
				sWorker.set("send Object",true);
				sWorker.set("self.port.onmessage",true);
				var sPstMsg=sWorker.get("self.port.postMessage");
				sPstMsg.set("self.port.postMessage",true);
				sPstMsg.set("send String",true);
			}else if(data && data.msg ===  "Response #103" && data.code === 3){
				sWorker.set("send String",true);
				sWorker.set("self.port.onmessage",true);
				var sPstMsg=sWorker.get("self.port.postMessage");
				sPstMsg.set("self.port.postMessage",true);
				sPstMsg.set("send Object",true);
			}else if(data === "Response #108"){
				sWorker.set("self.port.onmessage",true);
				sWorker.set("new MessageChannel",true);
				if(e.ports && e.ports[0]){
					e.ports[0].onmessage=function(e){
						if(e.data==="Channel #108"){
							var pstMsg=sWorker.get("self.port.postMessage");
							pstMsg.set("self.port.postMessage",true);
							pstMsg.set("transfert Port",true);
						}
					};
				}
			}else if(data === "self Error"){
				sWorker.set("send String",true);
				sWorker.set("self.port.onmessage",true);
				sWorker.set("self.onerror",true);
			}else if(data === "port Error"){
				sWorker.set("send String",true);
				sWorker.set("self.port.onmessage",true);
				sWorker.set("self.port.onerror",true);
			}else if(data === "XMLHttpRequest"){
				sWorker.set("send String",true);
				sWorker.set("XMLHttpRequest",true);
			}else if(data === "self.navigator"){
				sWorker.set("send String",true);
				sWorker.set("self.navigator",true);
			}else if(data === "self.location"){
				sWorker.set("send String",true);
				sWorker.set("self.location",true);
			}else if(data === "new dedicated-Worker"){
				sWorker.set("send String",true);
				sWorker.set("new dedicated-Worker",true);
			}else if(data === "new shared-Worker"){
				sWorker.set("send String",true);
				sWorker.set("new shared-Worker",true);
			}else{
				alert(data.msg + " → " + data.data);
			}
		};
		
		sw4.port.addEventListener("message",function(e){
			var data=e.data;
			sWorker.set("worker.port.addEventListener(message)",true);
			switch(data){
				case "Response #110":
					sWorker.set("send String",true);
					sWorker.set("self.port.addEventListener(message)",true);
					break;
				case "Error #112":
					sWorker.set("self.addEventListener(error)",true);
					break;
				case "importScripts":
					sWorker.set("importScripts",true);
					break;
				case "importScripts_1":
					sWorker.set("importScripts with one file",true);
					break;
				case "importScripts_X":
					sWorker.set("importScripts with many files",true);
					break;
			}
		},false);
	}catch(e){
		console.log(e);
	}
	
	try{
		sw.onerror=function(e){
			sWorker.set("worker.onerror",true);
		};
		sw4.addEventListener("error",function(e){
			sWorker.set("worker.addEventListener(error)",true);
		},false);
		sw4.port.start();
	}catch(e){
		console.log(e);
	}
	
	try{
		var fileContents = ["onconnect=function(e){var port=e.ports[0];port.onmessage=function(e){port.postMessage('je réponds au message : '+e.data);};};"],
			blob=null;
		if(window.Blob){
			blob = new Blob(content);
		}else{
			sWorker.set("inline",false);
		}

		if(blob){
			sWorker.set("blob",true);

			var URL = window.URL || window.webkitURL || window.MozURL || window.mozURL || window.oURL || window.OURL || window.MsURL;
			if(URL){
				if(URL.createObjectURL) sWorker.set("createObjectURL",true);
				var blobUrl = URL.createObjectURL(blob);

				var worker = new SharedWorker(blobUrl);
				worker.port.onmessage=function(e){
					sWorker.set("inline",true);
					worker.terminate();
				};
				worker.port.postMessage("bonjour");
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
	terminate(sw);
	terminate(sw2_1);
	terminate(sw2_2);
	terminate(sw2_3);
	terminate(sw2_4);
	terminate(sw3);
	terminate(sw4);
	terminate(sw5_1);
	terminate(sw5_2);
	terminate(sw5_3);
	terminate(sw5_4);
	terminate(sw5_5);
},5000);

})();

var counter=0;
onconnect=function(e){
	var port=e.ports[0];
	counter++;
	port.postMessage({msg:"counter",cmpt:counter,name:self.name});
	port.onmessage=function(e){
		port.postMessage({msg:"response",cmpt:counter,name:self.name});
	};
	
};


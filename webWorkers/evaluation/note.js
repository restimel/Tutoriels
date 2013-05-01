var taches=(function(){
function Task(nom, poids, parent){
	this.name=nom;
	this.value=poids;
	this.support=false;
	this.buggy=false;
	this.subTask=[];
	if(parent && parent instanceof Task) parent.add(this);
}

Task.prototype.add=function(tsk){
	this.subTask.push(tsk);
};

Task.prototype.getNote=function(){
	var note=[(this.support?(this.buggy?0.5:1):0)*this.value,this.value,this.value==0?(this.support?(this.buggy?0.5:1):0):0],
		i=0,li=this.subTask.length,tmp;
	while(i<li){
		tmp=this.subTask[i++].getNote();
		note[0]+=tmp[0];
		note[1]+=tmp[1];
		note[2]+=tmp[2];
	}
	return note;
};

Task.prototype.get=function(id){
	if(this.name===id) return this;
	var i=0,li=this.subTask.length,tmp;
	while(i<li){
		if(tmp=this.subTask[i++].get(id)) return tmp;
	}
	return null;
}

Task.prototype.set=function(id,b){
	if(b){
		this.get(id).support=b;
	}else{
		this.get(id).buggy=true;
	}
}

Task.prototype.display=function(){
	var note = this.getNote();
	
	var hd=document.createElement("header");
	hd.onclick=function(){
		if(sct.style.display==="none"){
			sct.style.display="block";
		}else{
			sct.style.display="none";
		}
	};
	var elem=document.createElement("span");
	elem.style.display="inline-block";
	elem.style.width="600px";
	elem.textContent=this.name;
	hd.appendChild(elem);
	var elem=document.createElement("span");
	elem.textContent=note[0] + "/" + note[1] +(note[2]>0?" +"+note[2]:"");
	if(note[0] === note[1]){
		elem.style.color="green";
	}else if(note[0] === 0){
		elem.style.color="red";
	}else{
		elem.style.color="orange";
	}
	if(note[1] > 1){
		hd.style.cursor="pointer";
	}
	hd.appendChild(elem);
	
	var sct=document.createElement("section");
	sct.style.display="none";
	
	var i=0,li=this.subTask.length;
	while(i<li){
		sct.appendChild(this.subTask[i++].display());
	}
	
	elem=document.createElement("div");
	elem.appendChild(hd);
	elem.appendChild(sct);
	
	return elem;
}

Task.prototype.simpleObject=function(){
	var obj={
		name:this.name,
		note:this.getNote(),
		subtask:[]
	};
	
	var i=0,li=this.subTask.length;
	while(i<li){
		obj.subtask[i]=this.subTask[i++].simpleObject();
	}
	
	return obj;
};

var wWorker=new Task("Web-Workers",0);
var dWorker=new Task("Dedicated-Worker",1,wWorker);
var pstMsg=new Task("worker.postMessage",1,dWorker);
new Task("send String",1,pstMsg);
new Task("send Object",1,pstMsg);
new Task("transfert Port",1,pstMsg);
pstMsg=new Task("self.postMessage",1,dWorker);
new Task("send String",1,pstMsg);
new Task("send Object",1,pstMsg);
new Task("transfert Port",1,pstMsg);
var lstner=new Task("Listener",0,dWorker);
new Task("worker.onmessage",1,lstner);
new Task("worker.addEventListener(message)",1,lstner);
new Task("self.onmessage",1,lstner);
new Task("self.addEventListener(message)",1,lstner);
new Task("worker.onerror",1,lstner);
new Task("worker.addEventListener(error)",1,lstner);
new Task("self.onerror",1,lstner);
new Task("self.addEventListener(error)",1,lstner);
new Task("worker.onclose",0,lstner);
new Task("worker.addEventListener(close)",0,lstner);
new Task("self.onclose",0,lstner);
new Task("self.addEventListener(close)",0,lstner);
new Task("worker.Terminate",1,dWorker);
new Task("worker.close",0,dWorker);
new Task("self.close",1,dWorker);
var nWorker=new Task("new Worker",0,dWorker);
new Task("new dedicated-Worker",1,nWorker);
new Task("new shared-Worker",1,nWorker);
new Task("new MessageChannel",1,nWorker);
var impScr=new Task("importScripts",1,dWorker);
new Task("importScripts with one file",1,impScr);
new Task("importScripts with many files",1,impScr);
new Task("XMLHttpRequest",1,dWorker);
new Task("self.navigator",1,dWorker);
new Task("self.location",1,dWorker);
var inline=new Task("inline",1,dWorker);
new Task("blob",1,inline);
new Task("createObjectURL",1,inline);

var sWorker=new Task("Shared-Worker",1,wWorker);
pstMsg=new Task("worker.port.postMessage",1,sWorker);
new Task("send String",1,pstMsg);
new Task("send Object",1,pstMsg);
new Task("transfert Port",1,pstMsg);
pstMsg=new Task("self.port.postMessage",1,sWorker);
new Task("send String",1,pstMsg);
new Task("send Object",1,pstMsg);
new Task("transfert Port",1,pstMsg);
lstner=new Task("Listener",0,sWorker);
new Task("worker.port.onmessage",1,lstner);
new Task("worker.port.addEventListener(message)",1,lstner);
new Task("self.port.onmessage",1,lstner);
new Task("self.port.addEventListener(message)",1,lstner);
new Task("worker.onerror",1,lstner);
new Task("worker.port.onerror",0,lstner);
new Task("worker.addEventListener(error)",1,lstner);
new Task("self.onerror",1,lstner);
new Task("self.port.onerror",0,lstner);
new Task("self.addEventListener(error)",1,lstner);
new Task("worker.onclose",0,lstner);
new Task("worker.addEventListener(close)",0,lstner);
new Task("self.onclose",0,lstner);
new Task("self.addEventListener(close)",0,lstner);
new Task("self.port.onclose",0,lstner);
new Task("self.port.addEventListener(close)",0,lstner);
new Task("worker.Terminate",1,sWorker);
new Task("worker.close",0,sWorker);
new Task("self.close",1,sWorker);
new Task("port.close",1,sWorker);
nWorker=new Task("new Worker",0,sWorker);
new Task("new dedicated-Worker",1,nWorker);
new Task("new shared-Worker",1,nWorker);
new Task("new MessageChannel",1,nWorker);
impScr=new Task("importScripts",1,sWorker);
new Task("importScripts with one file",1,impScr);
new Task("importScripts with many files",1,impScr);
new Task("XMLHttpRequest",1,sWorker);
new Task("self.navigator",1,sWorker);
new Task("self.location",1,sWorker);
var mltaccess = new Task("multi-access",1,sWorker);
new Task("named worker",1,mltaccess);
new Task("self.name",1,mltaccess);
inline=new Task("inline",1,sWorker);
new Task("blob",1,inline);
new Task("createObjectURL",1,inline);

var msgChn=new Task("MessageChannel",1,wWorker);
new Task("port1→port2",1,msgChn);
new Task("port1←port2",1,msgChn);

return wWorker;
})();


function refresh(){
	var elem=document.getElementById("result");
	elem.innerHTML="";
	elem.appendChild(taches.display());
	return taches.simpleObject();
}




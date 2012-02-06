console.log("preparation");
var li=100000;
var lgString="";
var lgArray=[];
var lgObj={};
var deepObj={last:true};
console.log("length:"+li);
while(li--){
	lgString+="z";
	lgArray.push(123);
	lgObj["a"+li]="123";
	if(li%100 === 0) deepObj={next:deepObj};
}

var state="creation";

console.log("****Début****");
var d=Date.now();
var w=new Worker('dedicated.js');
w.onmessage=function(e){
	var d1=Date.now();
	console.log("-- "+state+" --");
	console.log("Send: "+(e.data-d));
	console.log("Response: "+(d1-e.data));
	console.log("Total: "+(d1-d));
	
	if(state==="creation") setTimeout(next,500);
	else setTimeout(next,100);
};
w.onerror=function(e){
	var d1=Date.now();
	console.error("XX "+state+" XX");
	console.log("Total: "+(d1-d));
	
	if(state==="creation") setTimeout(next,500);
	else setTimeout(next,100);
};

function next(){
	var liste = [
		"to avoid unknown",
		"creation",
		"send long string",
		"send long object to string",
		"send long object",
		"send deep object",
		"send long array",
		"send long array to string",
		"send long array to string cheat",
		""
	];
	
	state=liste[liste.indexOf(state)+1];
	
	var message = null;
	
	d=Date.now();
	switch(state){
		case "send long string":
			message=lgString;
			break;
		case "send long object":
			message=lgObj;
			break;
		case "send long object to string":
			message=JSON.stringify(lgObj);
			break;
		case "send deep object":
			message=deepObj;
			break;
		case "send long array":
			message=lgArray;
			break;
		case "send long array to string":
			message=lgArray.join(",");
			break;
		case "send long array to string cheat":
			message=lgArray.join(";");
			//message[3]=";";
			//d=Date.now();
			break;
		default:
			console.log("****Fini****");
			message=null;
	}
	
	if(message){
		w.postMessage(message);
	}
}
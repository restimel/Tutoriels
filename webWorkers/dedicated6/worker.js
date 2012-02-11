postMessage("string"); //on envoit un string
postMessage({string:"string"}); //on envoit un simple objet
var obj={a:1};
var obj2={a:2,l:obj};
obj.l=obj2;
postMessage(obj); //on envoit une référence croisée

postMessage(new Date()); //on envoit un objet 'fondamental'

function test(){
	this.a="f";
}
obj=new test();
postMessage(obj); //on envoit un objet construit avec prototype

obj={err:function(){this.toto=1;}};
postMessage(obj); //on envoit un objet avec une fonction

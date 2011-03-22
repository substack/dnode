
(function(undefined){var has=Object.prototype.hasOwnProperty;if(!Array.isArray){Array.isArray=function(obj){return Object.prototype.toString.call(obj)=="[object Array]";};}
if(!Array.prototype.forEach){Array.prototype.forEach=function(block,thisObject){var len=+this.length;for(var i=0;i<len;i++){if(i in this){block.call(thisObject,this[i],i,this);}}};}
if(!Array.prototype.map){Array.prototype.map=function(fun){var len=+this.length;if(typeof fun!="function")
throw new TypeError();var res=new Array(len);var thisp=arguments[1];for(var i=0;i<len;i++){if(i in this)
res[i]=fun.call(thisp,this[i],i,this);}
return res;};}
if(!Array.prototype.filter){Array.prototype.filter=function(block){var values=[];var thisp=arguments[1];for(var i=0;i<this.length;i++)
if(block.call(thisp,this[i]))
values.push(this[i]);return values;};}
if(!Array.prototype.every){Array.prototype.every=function(block){var thisp=arguments[1];for(var i=0;i<this.length;i++)
if(!block.call(thisp,this[i]))
return false;return true;};}
if(!Array.prototype.some){Array.prototype.some=function(block){var thisp=arguments[1];for(var i=0;i<this.length;i++)
if(block.call(thisp,this[i]))
return true;return false;};}
if(!Array.prototype.reduce){Array.prototype.reduce=function(fun){var len=+this.length;if(typeof fun!="function")
throw new TypeError();if(len==0&&arguments.length==1)
throw new TypeError();var i=0;if(arguments.length>=2){var rv=arguments[1];}else{do{if(i in this){rv=this[i++];break;}
if(++i>=len)
throw new TypeError();}while(true);}
for(;i<len;i++){if(i in this)
rv=fun.call(null,rv,this[i],i,this);}
return rv;};}
if(!Array.prototype.reduceRight){Array.prototype.reduceRight=function(fun){var len=+this.length;if(typeof fun!="function")
throw new TypeError();if(len==0&&arguments.length==1)
throw new TypeError();var i=len-1;if(arguments.length>=2){var rv=arguments[1];}else{do{if(i in this){rv=this[i--];break;}
if(--i<0)
throw new TypeError();}while(true);}
for(;i>=0;i--){if(i in this)
rv=fun.call(null,rv,this[i],i,this);}
return rv;};}
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(value){var length=this.length;if(!length)
return-1;var i=arguments[1]||0;if(i>=length)
return-1;if(i<0)
i+=length;for(;i<length;i++){if(!has.call(this,i))
continue;if(value===this[i])
return i;}
return-1;};}
if(!Array.prototype.lastIndexOf){Array.prototype.lastIndexOf=function(value){var length=this.length;if(!length)
return-1;var i=arguments[1]||length;if(i<0)
i+=length;i=Math.min(i,length-1);for(;i>=0;i--){if(!has.call(this,i))
continue;if(value===this[i])
return i;}
return-1;};}
if(!Object.getPrototypeOf){Object.getPrototypeOf=function(object){return object.__proto__||object.constructor.prototype;};}
if(!Object.getOwnPropertyDescriptor){Object.getOwnPropertyDescriptor=function(object,property){if(typeof object!=="object"&&typeof object!=="function"||object===null)
throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object");return has.call(object,property)?{value:object[property],enumerable:true,configurable:true,writeable:true}:undefined;};}
if(!Object.getOwnPropertyNames){Object.getOwnPropertyNames=function(object){return Object.keys(object);};}
if(!Object.create){Object.create=function(prototype,properties){var object;if(prototype===null){object={"__proto__":null};}else{if(typeof prototype!="object")
throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");var Type=function(){};Type.prototype=prototype;object=new Type();}
if(typeof properties!=="undefined")
Object.defineProperties(object,properties);return object;};}
if(!Object.defineProperty){Object.defineProperty=function(object,property,descriptor){if(typeof descriptor=="object"&&object.__defineGetter__){if(has.call(descriptor,"value")){if(!object.__lookupGetter__(property)&&!object.__lookupSetter__(property))
object[property]=descriptor.value;if(has.call(descriptor,"get")||has.call(descriptor,"set"))
throw new TypeError("Object doesn't support this action");}
else if(typeof descriptor.get=="function")
object.__defineGetter__(property,descriptor.get);if(typeof descriptor.set=="function")
object.__defineSetter__(property,descriptor.set);}
return object;};}
if(!Object.defineProperties){Object.defineProperties=function(object,properties){for(var property in properties){if(has.call(properties,property))
Object.defineProperty(object,property,properties[property]);}
return object;};}
if(!Object.seal){Object.seal=function(object){return object;};}
if(!Object.freeze){Object.freeze=function(object){return object;};}
try{Object.freeze(function(){});}catch(exception){Object.freeze=(function(freeze){return function(object){if(typeof object=="function"){return object;}else{return freeze(object);}};})(Object.freeze);}
if(!Object.preventExtensions){Object.preventExtensions=function(object){return object;};}
if(!Object.isSealed){Object.isSealed=function(object){return false;};}
if(!Object.isFrozen){Object.isFrozen=function(object){return false;};}
if(!Object.isExtensible){Object.isExtensible=function(object){return true;};}
if(!Object.keys){var hasDontEnumBug=true,dontEnums=['toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','constructor'],dontEnumsLength=dontEnums.length;for(var key in{"toString":null})
hasDontEnumBug=false;Object.keys=function(object){if(typeof object!=="object"&&typeof object!=="function"||object===null)
throw new TypeError("Object.keys called on a non-object");var keys=[];for(var name in object){if(has.call(object,name)){keys.push(name);}}
if(hasDontEnumBug){for(var i=0,ii=dontEnumsLength;i<ii;i++){var dontEnum=dontEnums[i];if(has.call(object,dontEnum)){keys.push(dontEnum);}}}
return keys;};}
if(!Date.prototype.toISOString){Date.prototype.toISOString=function(){return(this.getUTCFullYear()+"-"+
(this.getUTCMonth()+1)+"-"+
this.getUTCDate()+"T"+
this.getUTCHours()+":"+
this.getUTCMinutes()+":"+
this.getUTCSeconds()+"Z");}}
if(!Date.now){Date.now=function(){return new Date().getTime();};}
if(!Date.prototype.toJSON){Date.prototype.toJSON=function(key){if(typeof this.toISOString!="function")
throw new TypeError();return this.toISOString();};}
if(isNaN(Date.parse("T00:00"))){Date=(function(NativeDate){var Date=function(Y,M,D,h,m,s,ms){var length=arguments.length;if(this instanceof NativeDate){var date=length===1&&String(Y)===Y?new NativeDate(Date.parse(Y)):length>=7?new NativeDate(Y,M,D,h,m,s,ms):length>=6?new NativeDate(Y,M,D,h,m,s):length>=5?new NativeDate(Y,M,D,h,m):length>=4?new NativeDate(Y,M,D,h):length>=3?new NativeDate(Y,M,D):length>=2?new NativeDate(Y,M):length>=1?new NativeDate(Y):new NativeDate();date.constructor=Date;return date;}
return NativeDate.apply(this,arguments);};var isoDateExpression=new RegExp("^"+"(?:"+"("+"(?:[+-]\\d\\d)?"+"\\d\\d\\d\\d"+")"+"(?:-"+"(\\d\\d)"+"(?:-"+"(\\d\\d)"+")?"+")?"+")?"+"(?:T"+"(\\d\\d)"+":(\\d\\d)"+"(?::"+"(\\d\\d)"+"(?:\\.(\\d\\d\\d))?"+")?"+")?"+"(?:"+"Z|"+"([+-])(\\d\\d):(\\d\\d)"+")?"+"$");for(var key in NativeDate)
Date[key]=NativeDate[key];Date.now=NativeDate.now;Date.UTC=NativeDate.UTC;Date.prototype=NativeDate.prototype;Date.prototype.constructor=Date;Date.parse=function(string){var match=isoDateExpression.exec(string);if(match){match.shift();var timeOnly=match[0]===undefined;for(var i=0;i<10;i++){if(i===7)
continue;match[i]=+(match[i]||(i<3?1:0));if(i===1)
match[i]--;}
if(timeOnly)
return((match[3]*60+match[4])*60+match[5])*1000+match[6];var offset=(match[8]*60+match[9])*60*1000;if(match[6]==="-")
offset=-offset;return NativeDate.UTC.apply(this,match.slice(0,7))+offset;}
return NativeDate.parse.apply(this,arguments);};return Date;})(Date);}
var slice=Array.prototype.slice;if(!Function.prototype.bind){Function.prototype.bind=function(that){var target=this;if(typeof target.apply!="function"||typeof target.call!="function")
return new TypeError();var args=slice.call(arguments);var bound=function(){if(this instanceof bound){var self=Object.create(target.prototype);target.apply(self,args.concat(slice.call(arguments)));return self;}else{return target.call.apply(target,args.concat(slice.call(arguments)));}};bound.bound=target;bound.boundTo=that;bound.boundArgs=args;bound.length=(typeof target=="function"?Math.max(target.length-args.length,0):0)
return bound;};}
if(!String.prototype.trim){var trimBeginRegexp=/^\s\s*/;var trimEndRegexp=/\s\s*$/;String.prototype.trim=function(){return String(this).replace(trimBeginRegexp,'').replace(trimEndRegexp,'');};}})();
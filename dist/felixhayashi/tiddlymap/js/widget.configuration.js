/*\

title: $:/plugins/felixhayashi/tiddlymap/js/widget/MapConfigWidget
type: application/javascript
module-type: widget

@preserve

\*/
"use strict";exports["tmap-config"]=MapConfigWidget;var ViewAbstraction=require("$:/plugins/felixhayashi/tiddlymap/js/ViewAbstraction");var utils=require("$:/plugins/felixhayashi/tiddlymap/js/utils");var vis=require("$:/plugins/felixhayashi/vis/vis.js");var Widget=require("$:/core/modules/widgets/widget.js").widget;function MapConfigWidget(e,t){Widget.call(this);this.initialise(e,t);this.computeAttributes()}MapConfigWidget.prototype=Object.create(Widget.prototype);MapConfigWidget.prototype.render=function(e,t){this.parentDomNode=e;if(!this.domNode){this.domNode=this.document.createElement("div");$tw.utils.addClass(this.domNode,"tmap-config-widget");e.insertBefore(this.domNode,t)}if(this.network){this.network.destroy()}this.networkContainer=document.createElement("div");this.domNode.appendChild(this.networkContainer);this.refreshTrigger=this.getAttribute("refresh-trigger");this.pipeTRef=this.getVariable("currentTiddler");this.inheritedFields=$tw.utils.parseStringArray(this.getAttribute("inherited"));this.extensionTField=this.getAttribute("extension");this.mode=this.getAttribute("mode");for(var i=0;i<this.inheritedFields.length;i++){var s=this.inheritedFields[i];var n=utils.parseFieldData(this.pipeTRef,s,{});if(this.mode==="manage-edge-types"){if(!n.edges){n={edges:n}}}else if(this.mode==="manage-node-types"){if(!n.nodes){n={nodes:n}}}this.inherited=utils.merge(this.inherited,n)}this.extension=utils.parseFieldData(this.pipeTRef,this.extensionTField,{});if(this.mode==="manage-edge-types"){if(!this.extension.edges){this.extension={edges:this.extension}}}else if(this.mode==="manage-node-types"){if(!this.extension.nodes){this.extension={nodes:this.extension}}}var r=utils.isTrue(this.getAttribute("save-only-changes"));this.changes=r?{}:this.extension;var a={nodes:[],edges:[]};var o=utils.merge({},this.inherited,this.extension);$tw.utils.extend(o,{configure:{enabled:true,showButton:false,filter:this.getOptionFilter(this.mode)}});this.network=new vis.Network(this.networkContainer,a,o);this.network.on("configChange",this.handleConfigChange.bind(this));var h=this.parentDomNode.getBoundingClientRect().height;this.parentDomNode.style["height"]=h+"px";var l=this.handleResetEvent.bind(this);this.networkContainer.addEventListener("reset",l,false);$tm.registry.push(this);this.enhanceConfigurator()};MapConfigWidget.prototype.handleResetEvent=function(e){var t={};t[e.detail.trigger.path]=null;this.handleConfigChange(t)};MapConfigWidget.prototype.handleConfigChange=function(e){var t=utils.flatten(this.changes);var i=utils.flatten(e);var s=Object.keys(utils.flatten(e))[0];var n=i[s]===null;if(n){t[s]=undefined;this.changes=utils.unflatten(t)}else{this.changes=utils.merge(this.changes,e)}var r=utils.merge({},this.changes);if(this.mode==="manage-node-types"){r=r["nodes"]}if(this.mode==="manage-edge-types"){r=r["edges"]}utils.writeFieldData(this.pipeTRef,this.extensionTField,r,$tm.config.sys.jsonIndentation);var a="vis-configuration-wrapper";var o=this.networkContainer.getElementsByClassName(a)[0];o.style.height=o.getBoundingClientRect().height+"px";if(n){window.setTimeout(this.refresh.bind(this),0)}else{window.setTimeout(this.enhanceConfigurator.bind(this),50)}};MapConfigWidget.prototype.enhanceConfigurator=function(){var e="vis-configuration-wrapper";var t=this.networkContainer.getElementsByClassName(e)[0].children;var i=[];var s=utils.flatten(this.changes);for(var n=0;n<t.length;n++){if(!t[n].classList.contains("vis-config-item"))continue;var r=new VisConfElement(t[n],i,n);i.push(r);if(r.level===0)continue;r.setActive(!!s[r.path])}};function VisConfElement(e,t,i){var s="getElementsByClassName";var n="getElementsByTagName";this.isActive=false;this.pos=i;this.el=e;this.inputEl=e[s]("vis-config-colorBlock")[0]||e[n]("input")[0];this.labelEl=e[s]("vis-config-label")[0]||e[s]("vis-config-header")[0]||e;var r=this.labelEl.innerText||this.labelEl.textContent;this.label=r&&r.match(/([a-zA-Z0-9]+)/)[1];this.level=parseInt(e.className.match(/.*vis-config-s(.).*/)[1])||0;this.path=this.label;if(this.level>0){for(var a=i;a--;){var o=t[a];if(o.level<this.level){this.path=o.path+"."+this.path;break}}}}VisConfElement.prototype.setActive=function(e){if(!e)return;var t="tmap-vis-config-item-"+(e?"active":"inactive");$tw.utils.addClass(this.el,t);if(e){var i=document.createElement("button");i.innerHTML="reset";i.className="tmap-config-item-reset";var s=this;i.addEventListener("click",function(e){e.currentTarget.dispatchEvent(new CustomEvent("reset",{detail:{trigger:s},bubbles:true,cancelable:true}))},false);this.el.appendChild(i)}};MapConfigWidget.prototype.getOptionFilter=function(e){var t={nodes:{borderWidth:true,borderWidthSelected:true,color:{background:true,border:true},font:{color:true,size:true},icon:true,labelHighlightBold:false,shadow:true,shape:true,shapeProperties:{borderDashes:true},size:true},edges:{arrows:true,color:true,dashes:true,font:true,labelHighlightBold:false,length:true,selfReferenceSize:false,shadow:true,smooth:true,width:true},interaction:{hideEdgesOnDrag:true,hideNodesOnDrag:true,tooltipDelay:true},layout:{hierarchical:false},manipulation:{initiallyActive:true},physics:{forceAtlas2Based:{gravitationalConstant:true,springLength:true,springConstant:true,damping:true,centralGravity:true}}};if(e==="manage-edge-types"){t={edges:t.edges}}else if(e==="manage-node-types"){t={nodes:t.nodes}}else{t.edges.arrows=false}return function(e,i){i=i.concat([e]);var s=t;for(var n=0,r=i.length;n<r;n++){if(s[i[n]]===true){return true}else if(s[i[n]]==null){return false}s=s[i[n]]}return false}};MapConfigWidget.prototype.isZombieWidget=function(){return!document.body.contains(this.parentDomNode)};MapConfigWidget.prototype.destruct=function(){if(this.network){this.network.destroy()}};MapConfigWidget.prototype.refresh=function(e){if(this.isZombieWidget()||!this.network)return;if(!e||e[this.refreshTrigger]){this.refreshSelf();return true}};MapConfigWidget.prototype.setNull=function(e){for(var t in e){if(typeof e[t]=="object"){this.setNull(e[t])}else{e[t]=undefined}}};
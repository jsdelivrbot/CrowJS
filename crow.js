(function(global, factory){
    (typeof define==='function' && define.amd)? define(function(){return factory(global)}):factory(global);
}(this, function(window){
	if(!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	if(!Element.prototype.closest){
		Element.prototype.closest = function(s){
			var el = this;
			if(!document.documentElement.contains(el)) return null;
			do{ if(el.matches(s)) return el; el = el.parentElement; }while(el!==null);
			return null;
		};
	}
    var document        = window.document, body = document.body;
    var Crow            = (function(el){
        crow            = (el instanceof Object)? el:(!/^<.*?>$/.test(el) && !Number.isInteger(parseFloat(el)))? [].slice.call(document.querySelectorAll(el)):[Crow.createElementFromString(el)];
        crow.__proto__  = {
            addClass: function(class_){
                var toAdd   = class_.split(" ");
                for(var i=0;i<toAdd.length;i++){
                    [].forEach.call(this, function(item){
                        if(item.className.indexOf(toAdd[i])== -1) item.className = (item.className+" "+toAdd[i]).replace(/^\s+|\s+$/g,'');
                    });
                }
                return this;
            },
            toggleClass: function(class_){
                var toToggle    = class_.split(" ");
                for(var i=0;i<toToggle.length;i++){
                    [].forEach.call(this, function(item){
                        item.className = item.className.match(new RegExp('(\\s|^)'+toToggle[i]+'(\\s|$)'))? item.className.replace(new RegExp('(\\s|^)'+toToggle[i]+'(\\s|$)'), ''):item.className+" "+toToggle[i];
                    });
                }
                return this;
            },
            hasClass: function(class_){
                var hasClass = class_.split(" "), hasClassVal = false;
                for(var i=0;i<hasClass.length;i++){
                    [].forEach.call(this, function(item){
                        hasClassVal    = item.className.match(new RegExp('(\\s|^)'+hasClass[i]+'(\\s|$)'))? true:hasClassVal;
                    });
                }
                return hasClassVal;
            },
            removeClass: function(class_){
                var toRm    = class_.split(" ");
                for(var i=0;i<toRm.length;i++){
                    [].forEach.call(this, function(item){
                        if(item.className.match(new RegExp('(\\s|^)'+toRm[i]+'(\\s|$)'))) item.className = item.className.replace(new RegExp('(\\s|^)'+toRm[i]+'(\\s|$)'), '');
                    });
                }
                return this;
            },
            html: function(html){
                var thisHtml    = '';
                [].forEach.call(crow, function(item){
                    if(html) item.innerHTML = html;
                });
                return html? this:this[this.length-1].innerHTML;
            },
            append: function(html){
                if(html){
                    [].forEach.call(this, function(item){
                        (html instanceof Object)? [].forEach.call(html, function(item_){ item.appendChild(item_); }):item.appendChild(Crow.createElementFromString(html));
                    });
                }
                return this;
            },
            prepend: function(html){
                if(html){
                    [].forEach.call(this, function(item){
                        (html instanceof Object)? [].forEach.call(html, function(item_){ item.insertBefore(item_, item.firstChild); }):item.insertBefore(Crow.createElementFromString(html), item.firstChild);
                    });
                }
                return this;
            },
            after: function(html){
                if(html){
                    [].forEach.call(this, function(item){
                        (html instanceof Object)? [].forEach.call(html, function(item_){ item.parentNode.insertBefore(item_, item.nextSibling); }):item.parentNode.insertBefore(Crow.createElementFromString(html), item.nextSibling);
                    });
                }
                return this;
            },
            before: function(html){
                if(html){
                    [].forEach.call(this, function(item){
                        (html instanceof Object)? [].forEach.call(html, function(item_){ item.parentNode.insertBefore(item_, item); }):item.parentNode.insertBefore(Crow.createElementFromString(html), item);
                    });
                }
                return this;
            },
            remove: function(){
            	return (this instanceof Object)? [].forEach.call(this, function(item_){ item_.parentNode.removeChild(item_); }):this.parentNode.removeChild(this);
            },
            attr: function(attr){
            	if(attr) (this instanceof Object)? [].forEach.call(this, function(item_){ for(var i in attr){ item_.setAttribute(i, attr[i]); } }):(function(){ for(var i in attr){ item_.setAttribute(i, attr[i]); } });
            	return this;
            },
            find: function(selector){
                var finds    = [];
                [].forEach.call(this, function(item){
                    finds.push([].slice.call(item.querySelectorAll(selector)));
                });
                return Crow(finds[0]);
            },
            closest: function(selector){
                var closests    = [];
                [].forEach.call(this, function(item){
                    (selector)? closests.push(item.closest(selector)):closests.push(item.parentNode);
                });
                return Crow(closests);
            },
            show: function(){
                [].forEach.call(this, function(item){
                    item.style.display  = "";
                });
                return this;
            },
            hide: function(){
                [].forEach.call(this, function(item){
                    item.style.display  = "none";
                });
                return this;
            },
            focus: function(){
            	[].forEach.call(this, function(item){
                    item.focus();
                });
                return this;
            },
            blur: function(){
            	[].forEach.call(this, function(item){
                    item.blur();
                });
                return this;
            },
            click: function(func){
                document.addEventListener("click", function(e){
                    [].forEach.call(this, function(item){
                        if(e.target==item || e.target.parentNode==item) func();
                    });
                }, false);
                return this;
            }
        };
        return crow;
    });

    Crow.ready = function(callback){
        (/complete|loaded|interactive/.test(document.readyState) && document.body)? callback(Crow.ready):document.addEventListener('DOMContentLoaded', function(){callback(Crow.ready)}, false);
        return this;
    }

    Crow.createElementFromString = function(str){
        return new DOMParser().parseFromString(str, 'text/html').body.firstChild;
    }

    Crow.ajax   = (function(options){
        var xhr = new XMLHttpRequest();
        if(options && options.url){
            xhr.open((options.type? options.type:'GET'), options.url);
            if(options.type=="POST") xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.onload = function(){
                if(xhr.status===200){
                    xhr.data    = xhr.responseText;
                }
            }
            if(options.dataType) xhr.responseType = options.dataType;
            if(options.headers){
                for(var i in options.headers){
                    xhr.setRequestHeader(i, options.headers[i]);
                }
            }
            xhr.__proto__.percent = function(){
                return (xhr instanceof window.XMLHttpRequest)? xhr.addEventListener('porcentagem', this.progress, false):true;
                return (xhr.upload)? xhr.upload.addEventListener('porcentagem', this.progress, false):true;
                return xhr;
            }
            xhr.__proto__.done    = function(){
                return (this instanceof window.XMLHttpRequest)? this.responseText:this;
            }
            xhr.send((options.data? encodeURIComponent(JSON.stringify(options.data)):null));
        }
        return xhr;
    });

    window.Crow = Crow;
}));

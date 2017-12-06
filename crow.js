(function(global, factory){
    (typeof define==='function' && define.amd)? define(function(){return factory(global)}):factory(global);
}(this, function(window){
    var document        = window.document;
    var Crow            = (function(el){
        crow            = [].slice.call(document.querySelectorAll(el)) || {};
        crow.__proto__  = {
            addClass: function(class_){
                [].forEach.call(crow, function(item){
                    item.classList.add(class_.split(" "));
                });
                return crow;
            },
            toggleClass: function(class_){
                [].forEach.call(crow, function(item){
                    item.classList.toggle(class_.split(" "));
                });
                return crow;
            },
            hasClass: function(class_){
                var hasClass    = false;
                [].forEach.call(crow, function(item){
                    hasClass    = item.classList.contains(class_.split(" "))? true:hasClass;
                });
                return hasClass;
            },
            removeClass: function(class_){
                [].forEach.call(crow, function(item){
                    item.classList.remove(class_.split(" "));
                });
                return crow;
            },
        };
        return crow;
    });
    Crow.ready = function(callback){
        (/complete|loaded|interactive/.test(document.readyState) && document.body)? callback(Crow.ready):document.addEventListener('DOMContentLoaded', function(){callback(Crow.ready)}, false);
        return this;
    }
    window.Crow = Crow;
}));

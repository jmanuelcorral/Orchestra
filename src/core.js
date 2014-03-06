var Application = Application || {};

Application.Core = (function () {
    var moduleData = {}, to_s = function (anything) { return Object.prototype.toString.call(anything); }, debug = true;
    return {
        debug : function (on) {
            debug  = on ? true : false;
        },
        create_module : function (moduleID, creator) {
            var temp;
            if (typeof moduleID === 'string' && typeof creator === 'function') {
                temp = creator(Application.Sandbox.create(this, moduleID));
                if (temp.init && typeof temp.init === 'function' && temp.destroy && typeof temp.destroy === 'function') {
                    temp = null;
                    moduleData[moduleID] = {
                        create : creator, 
                        instance : null
                    };
                } else { 
                    this.log(1, "Error Module '" + moduleID + "' Registration : FAILED : instance has no init or destory functions");
                }
            } else {
                this.log(1, "Error Module '" + moduleID + "' Registration : FAILED : one or more arguments are of incorrect type");
            }
        },
        start : function (moduleID) {
            var mod = moduleData[moduleID];
            if (mod) {
                mod.instance = mod.create(Application.Sandbox.create(this, moduleID));
                mod.instance.init();
            }
        },
        start_all : function () {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    this.start(moduleID);
                }
            }
        },
        stop : function (moduleID) {
            var data = moduleData[moduleID];
            if (data && data.instance) {
                data.instance.destroy();
                data.instance = null;
            } else {
                this.log(1, "Error Stopping Module '" + moduleID + "': FAILED : module does not exist or has not been started");
            }
        },
        stop_all : function () {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    this.stop(moduleID);
                }
            }
        },
        registerEvents : function (evts, mod) {
            if (this.is_obj(evts) && mod) {
                if (moduleData[mod]) {
                    moduleData[mod].events = evts;
                } else {
                    this.log(1, "Error registering Module: "+ mod +" Event: " + evts);
                }
            } else {
                this.log(1, "Error Module : " + mod + " Undefined");
            }
        },
        triggerEvent : function (evt) {
            var mod;
            for (mod in moduleData) {
                if (moduleData.hasOwnProperty(mod)){
                    mod = moduleData[mod];
                    if (mod.events && mod.events[evt.type]) {
                        mod.events[evt.type](evt.data);
                    }
                }
            }
        },
        removeEvents : function (evts, mod) {
            if (this.is_obj(evts) && mod && (mod = moduleData[mod]) && mod.events) {
                delete mod.events;
            } 
        },
        log : function (severity, message) { 
            if (debug) {
                console[ (severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
            } else {
                // send to the server
            }     
        },
        dom : {
            query : function (selector, context) {
                var ret = {}, that = this, jqEls, i = 0;

                if (context && context.find) {
                    jqEls = context.find(selector);
                } else { 
                    jqEls = jQuery(selector);
                }
                
                ret = jqEls.get();
                ret.length = jqEls.length;
                ret.query = function (sel) {
                    return that.query(sel, jqEls);
                };
                return ret;
            },
            bind : function (element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).bind(evt, fn);
                } else {
                    this.log("Error Binding, Bad Arguments -> Element: " + element + " Event: " + evt + "Function: " + fn);
                }
            },
            unbind : function (element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).unbind(evt, fn);
                } else {
                    this.log("Error UnBinding, Bad Arguments -> Element: " + element + " Event: " + evt + "Function: "+ fn);
                }
            },
            create: function (el) {
                return document.createElement(el);        
            },
            apply_attrs: function (el, attrs) {
                jQuery(el).attr(attrs);             
            }
        },
        is_arr : function (arr) {
            return jQuery.isArray(arr);         
        },
        is_obj : function (obj) {
            return jQuery.isPlainObject(obj);         
        }
    };

}());

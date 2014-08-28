var Application;

Application = Application || {};

$(document).ready(function() {
  Application.Core = (function() {
    var debug, moduleData, to_s;
    moduleData = [];
    to_s = function(anything) {
      return Object.prototype.toString.call(anything);
    };
    debug = true;
    return {
      debug: function(on_) {
        debug = on_;
      },
      create_module: function(module_id, creator) {
        var temp;
        if (typeof module_id === "string" && typeof creator === "function") {
          if (moduleData.hasOwnProperty(module_id)) {
            this.log(1, "Error Module '" + module_id + " Registration : FAILED There is a module with that id registered");
          } else {
            temp = creator(Application.Sandbox.create(this, module_id));
            if (temp.init && typeof temp.init === "function" && temp.destroy && typeof temp.destroy === "function") {
              temp = null;
              moduleData[module_id] = {
                create: creator,
                instance: null,
                events: {}
              };
            } else {
              this.log(1, "Error Module '" + module_id + "' Registration : FAILED : instance has no init or destory functions");
            }
          }
        } else {
          this.log(1, "Error Module '" + module_id + "' Registration : FAILED : one or more arguments are of incorrect type");
        }
      },
      delete_module: function(module_id) {
        var data;
        data = moduleData[module_id];
        if (data) {
          if (data.instance !== null) {
            stop(module_id);
          }
          data = null;
          delete moduleData[module_id];
        }
      },
      start: function(module_id) {
        var mod;
        mod = moduleData[module_id];
        if (mod) {
          mod.instance = mod.create(Application.Sandbox.create(this, module_id));
          mod.instance.init();
        }
      },
      start_all: function() {
        var module_id;
        for (module_id in moduleData) {
          if (moduleData.hasOwnProperty(module_id)) {
            this.start(module_id);
          }
        }
      },
      stop: function(module_id) {
        var data;
        if (module_id) {
          data = moduleData[module_id];
          if (data && data.instance !== null) {
            data.instance.destroy();
            data.instance = null;
          } else {
            this.log(1, "Error Stopping Module " + module_id + " : FAILED : module does not exist or has not been started");
          }
        }
      },
      stop_all: function() {
        var module_id;
        for (module_id in moduleData) {
          if (moduleData.hasOwnProperty(module_id)) {
            this.stop(module_id);
          }
        }
      },
      register_events: function(events, module_id) {
        if (this.is_obj(events) && module_id) {
          if (moduleData[module_id]) {
            moduleData[module_id].events = events;
          } else {
            this.log(1, "Error registering event at module: " + module_id + ", event: " + events);
          }
        } else {
          this.log(1, "Error Module: " + module_id + " undefined");
        }
      },
      trigger_event: function(event) {
        var mod, _results;
        _results = [];
        for (mod in moduleData) {
          if (moduleData.hasOwnProperty(mod)) {
            mod = moduleData[mod];
            if (mod.events && mod.events[event.type]) {
              _results.push(mod.events[event.type](event.data));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      remove_events: function(module_id, events) {
        var mod;
        mod = moduleData[module_id];
        if (this.is_obj(events) && module_id && mod && mod.events) {
          delete mod.events;
        }
      },
      log: function(severity, message) {
        var sev;
        if (severity === 1) {
          sev = "log";
        } else {
          if (severity === 2) {
            sev = "warn";
          } else {
            sev = "error";
          }
        }
        if (debug) {
          console[sev](message);
        } else {

        }
      },
      is_arr: function(arr) {
        return jQuery.is_arr(arr);
      },
      is_obj: function(obj) {
        return jQuery.isPlainObject(obj);
      },
      dom: {
        query: function(selector, context) {
          var i, jqEls, ret, that;
          ret = {};
          i = 0;
          that = this;
          if (context && context.find) {
            jqEls = context.find(selector);
          } else {
            jqEls = jQuery(selector);
          }
          ret = jqEls.get();
          ret.length = jqEls.length;
          ret.query = function(sel) {
            that.query(sel, jqEls);
          };
          return ret;
        },
        bind: function(element, evt, fn) {
          if (element && evt) {
            if (typeof evt === "function") {
              fn = evt;
              evt = "click";
            }
            jQuery(element).bind(evt, fn);
          } else {
            this.log("Error Binding, Bad Arguments > Element: " + element + " Event:  " + evt + " Function: " + fn);
          }
        },
        unbind: function(element, evt, fn) {
          if (element && evt) {
            if (typeof evt === "function") {
              fn = evt;
              evt = "click";
            }
            jQuery(element).unbind(evt, fn);
          } else {
            this.log("Error UnBinding, Bad Arguments > Element: " + element + " Event:  " + evt + " Function: " + fn);
          }
        },
        create: function(el) {
          return document.createElement(el);
        },
        remove: function(el) {
          jQuery("#" + el.id).remove();
        },
        append: function(el) {
          document.body.appendChild(el);
        },
        apply_attrs: function(el, attrs) {
          jQuery(el).attr(attrs);
        }
      }
    };
  })();
});

$(document).ready(function() {
  Application.Sandbox = (function() {
    return {
      create: function(core, module_selector) {
        return {
          find: function(selector) {
            return core.dom.query(selector);
          },
          add_event: function(element, type, fn) {
            core.dom.bind(element, type, fn);
          },
          remove_event: function(element, type, fn) {
            core.dom.unbind(element, type, fn);
          },
          publish: function(evt) {
            if (core.is_obj(evt)) {
              core.trigger_event(evt);
            }
          },
          subscribe: function(evts) {
            if (core.is_obj(evts)) {
              core.register_events(evts, module_selector);
            }
          },
          ignore: function(evts) {
            if (core.is_arr) {
              core.remove_events(evts, module_selector);
            }
          },
          create_element: function(el, config) {
            var child, i;
            el = core.dom.create(el);
            if (config) {
              if (config.children && core.is_arr(config.children)) {
                i = 0;
                while (i !== config.children.length) {
                  child = config.children[i];
                  el.appendChild(child);
                  i++;
                }
                delete config.children;
                if (config.text) {
                  el.appendChild(document.createTextNode(config.text));
                  delete config.text;
                }
              }
              core.dom.apply_attrs(el, config);
              core.dom.append(el);
              return el;
            }
          },
          remove_element: function(el) {
            if (el.hasOwnProperty("id")) {
              core.dom.remove(el);
            }
          }
        };
      }
    };
  })();
});

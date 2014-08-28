$(document).ready( ->
  Application.Core = (->
    #properties
    moduleData = []
    to_s = (anything) -> Object::toString.call anything
    debug = true 
    #Public interface 
    return {
      debug: (on_) ->
        debug = on_
        return
      create_module: (module_id, creator) ->
        if typeof module_id is "string" and typeof creator is "function"
          #check duplicated module_id
          if(moduleData.hasOwnProperty module_id)
            @log 1, "Error Module '#{module_id} Registration : FAILED There is a module with that id registered"
          else
            temp = creator(Application.Sandbox.create(@, module_id))
            if temp.init and typeof temp.init is "function" and temp.destroy and typeof temp.destroy is "function"
              temp = null
              moduleData[module_id] =
                create: creator
                instance: null
                events: {}
            else
              @log 1, "Error Module '#{module_id}' Registration : FAILED : instance has no init or destory functions"
        else
          @log 1, "Error Module '#{module_id}' Registration : FAILED : one or more arguments are of incorrect type"
        return
      delete_module : (module_id) ->
        data = moduleData[module_id]
        if data 
          if data.instance isnt null
            stop module_id
          data = null
          delete moduleData[module_id]
        return
      start : (module_id) ->
        mod = moduleData[module_id]
        if mod 
          mod.instance = mod.create(Application.Sandbox.create(@, module_id))
          do mod.instance.init
        return 
      start_all : ->
        for module_id of moduleData 
          if moduleData.hasOwnProperty(module_id) then @start(module_id)
        return
      stop : (module_id) ->
        if(module_id)
          data = moduleData[module_id]
          if data and data.instance isnt null
            data.instance.destroy()
            data.instance = null
          else @log 1, "Error Stopping Module #{module_id} : FAILED : module does not exist or has not been started"
        return
      stop_all : ->
        for module_id of moduleData
          if moduleData.hasOwnProperty(module_id) then @stop module_id
        return
      register_events : (events, module_id) ->
        if @is_obj(events) and module_id 
          if moduleData[module_id] then moduleData[module_id].events = events
          else @log 1, "Error registering event at module: #{module_id}, event: #{events}"
        else @log 1, "Error Module: #{module_id} undefined"
        return
      trigger_event: (event) ->
        for mod of moduleData
          if moduleData.hasOwnProperty(mod)
            mod = moduleData[mod]
            if mod.events and mod.events[event.type] then mod.events[event.type] event.data
      remove_events : (module_id, events) ->
        mod = moduleData[module_id]
        if @is_obj(events) and module_id and mod and mod.events
          delete mod.events
        return
      log : (severity, message) ->
        if severity is 1 then sev = "log"
        else 
          if severity is 2 then sev = "warn"
          else sev = "error"
        if debug then console[sev] message
        else #do nothing
        return
      is_arr : (arr) ->
        jQuery.is_arr arr
      is_obj : (obj) ->
        jQuery.isPlainObject obj
      dom :
        query : (selector, context) ->
          ret = {}
          i = 0
          that = @
          if context and context.find then jqEls = context.find selector
          else jqEls = jQuery selector
          ret = do jqEls.get
          ret.length = jqEls.length
          ret.query = (sel) ->
            that.query sel, jqEls
            return 
          return ret
        bind : (element, evt, fn) ->
          if element and evt
            if typeof evt is "function"
              fn = evt
              evt = "click"
            jQuery(element).bind evt, fn
          else @log "Error Binding, Bad Arguments > Element: #{element} Event:  #{evt} Function: #{fn}"
          return
        unbind : (element, evt, fn) ->
          if element and evt
            if typeof evt is "function"
              fn = evt
              evt = "click"
            jQuery(element).unbind evt, fn
          else @log "Error UnBinding, Bad Arguments > Element: #{element} Event:  #{evt} Function: #{fn}"
          return
        create : (el) ->
          document.createElement el
        remove : (el) ->
          jQuery("##{el.id}").remove()
          return
        append: (el) ->
          document.body.appendChild el
          return
        apply_attrs : (el, attrs) ->
          jQuery(el).attr attrs
          return
    }
  )()
  return
)
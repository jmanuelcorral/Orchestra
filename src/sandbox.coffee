$(document).ready( ->
  Application.Sandbox = ( ->
    create : (core, module_selector) ->
      find : (selector) ->
        core.dom.query selector 
      add_event : (element, type, fn) ->
        core.dom.bind element, type, fn
        return
      remove_event: (element, type, fn) ->
        core.dom.unbind(element, type, fn)
        return
      publish : (evt) ->
        if core.is_obj(evt) then core.trigger_event evt
        return
      subscribe : (evts) ->
        if core.is_obj evts then core.register_events evts, module_selector
        return
      ignore : (evts) ->
        if core.is_arr then core.remove_events evts, module_selector
        return
      create_element : (el, config) ->
        el = core.dom.create el
        if config
          if config.children and core.is_arr config.children
            i = 0
            until i is config.children.length
              child = config.children[i]
              el.appendChild(child)
              i++
            delete config.children
            if config.text
              el.appendChild document.createTextNode config.text
              delete config.text
          core.dom.apply_attrs el, config 
          core.dom.append el
          el
      remove_element: (el) ->
        if el.hasOwnProperty("id") then core.dom.remove el 
        return
  )()
  return
)
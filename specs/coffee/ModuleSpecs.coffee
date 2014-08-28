$(document).ready( ->
  describe "Testing Modules Start and Stop", ->
    i = null
    myAwesomeModule = (sb) ->
      init : ->
        i = 0
        return
      destroy : ->
        i = -1
        return

    it "Should be possible to register Module in system", ->
      Application.Core.create_module "AwesomeModule", myAwesomeModule
      expect(i).toBe null

    it "Should be possible to initialize the module", ->
      Application.Core.start "AwesomeModule"
      expect(i).toBe 0

    it "Should be possible to stop the module", ->
      Application.Core.stop "AwesomeModule"
      expect(i).toBe -1

  describe "Modules Execute External Actions, throught Subscription", ->
    i = null
    myAwesomeModule = (sandbox) ->
      init : ->
        i = 0
        sandbox.subscribe {
          "Awincrement" : @increment,
          "Awdecrement" : @decrement
        }
        return
      destroy : ->
        i = -1
        sandbox.ignore ["Awincrement", "Awdecrement"]
        return
      increment : ->
        if i < 100 then i++
        return
      decrement : ->
        if i > 0 then i--
        return

    mySecondAwsomeModule = (sandbox) ->
      init : ->
        sandbox.publish { type : "Awincrement", data : null }
        return
      destroy : ->
        sandbox.publish { type : 'Awdecrement', data : null }
        return

    it "Should be possible to register two Modules in system", ->
      Application.Core.create_module "AwsomeModule", myAwesomeModule
      Application.Core.start "AwsomeModule"
      Application.Core.create_module "SecondMod", mySecondAwsomeModule
      Application.Core.start "SecondMod"
      expect(i).toBe 1  

      
    it "Should be possible to Unregister Second Module in system", ->
      Application.Core.stop "SecondMod"
      expect(i).toBe 0

    it "Should be possible to Unregister first Module in system", ->
      Application.Core.stop "AwsomeModule"
      expect(i).toBe -1

  describe "Modules bind and unbind DOM ELEMENTS", ->
    i = null
    myAwesomeModule = (sandbox) ->
      buttonUp = null
      buttonDown = null
      {
        init : ->
          i = 0
          sandbox.create_element "a", { "id" : "buttonup", "class" : "buttonup" }
          sandbox.create_element "a", { "id" : "buttondown", "class" : "buttondown" }
          buttonUp = sandbox.find ".buttonup"
          buttonDown = sandbox.find ".buttondown"
          sandbox.add_event buttonUp, "click", @increment
          sandbox.add_event buttonDown, "click", @decrement
          return
        destroy : ->
          i = -1
          sandbox.remove_event buttonUp, "click", @increment
          sandbox.remove_event buttonDown, "click", @decrement
          sandbox.remove_element buttonUp
          sandbox.remove_element buttonDown        
          buttonUp = buttonDown = null
          return
        increment : ->
          if i < 100 then i++
        decrement : ->
          if i > 0 then i--
      }
    Application.Core.create_module "AwsomeModule3", myAwesomeModule 
    Application.Core.start "AwsomeModule3"

    it "Should be buttons Created by module", ->
      expect($("#buttonup").length).toBe 1
      expect($("#buttondown").length).toBe 1
    
    it "Should be Incremented by module", ->
      $("#buttonup").click()
      expect(i).toBe 1 

    it "Should be destroyed module", ->
      Application.Core.stop "AwsomeModule3"
      expect(i).toBe -1   
)
$(document).ready( ->
  $("html").append "<a href='#' id='testbutton'>testbutton</a>"
  describe "Testing if Application Sandbox Exists", ->
    it "Should be a Global Object Application.Sandbox defined", ->
      expect(Application.Sandbox).not.toBe null
  describe "Testing if Sandbox Dom find function called", ->
    it "Should Sandbox -> Core have to been called", ->
      Application.Core.create_module "TestModule2", (sb) ->
        button = null
        {
          init : ->
            button = sb.find "#testbutton"
            spyOn sb, "find"
            sb.add_event button, "click", @PerformTest
            return
          destroy : ->
            sb.remove_event button, "click", @PerformTest
            button = null
            return
          PerformTest : ->
            console.info "Tested"
            return 
        }
      Application.Core.start "TestModule2"
      expect(Application.Core.dom.query).toHaveBeenCalled
)
$(document).ready( ->
  startvalue = 0;
  my_module = (sandbox) ->
    init : ->
      sandbox.create_element "h1", { "class" : "Hello", text : "Hello World Module" } 
      startvalue = 1
      return
    destroy : -> 
      startvalue = 2
      return

  beforeEach ->
      startvalue = 0
      return

  describe "Testing if Application Core Exists", ->
   it "Should be a Global Object Application.Core defined" , ->
     expect(Application.Core).not.toBe null

  describe "Creating a Single Module", ->
    it "Should create a Module", ->
      Application.Core.create_module "TestModule", my_module
      expect(startvalue).toBe 0

  describe "Starting a Created Module", ->
    it "Should Start a Created Module", ->
      Application.Core.start "TestModule"
      expect(startvalue).toBe 1
      
  describe "Stopping a Single Module", ->
    it "Should Stop a Module", ->
      Application.Core.stop "TestModule"
      expect(startvalue).toBe 2
  do Application.Core.stop_all
  Application.Core.delete_module "TestModule"
)
#Stops all modules and isolates the tests  



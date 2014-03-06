//Initialization
//$("html").append("<a href='#' id='testbutton'>testbutton</a>");


describe("Testing if Application Sandbox Exists", function(){
    it("Should be a Global Object Application.Sandbox defined", function(){
        expect(Application.Sandbox).not.toBe(undefined);
    }); 
});

/*
describe("Testing if Sandbox Dom find function called", function() {
    it("Should Sandbox -> Core have to been called", function() {
        
        Application.Core.create_module("TestModule", function(sb) {
            var button;
            return {
                init : function () {
                    //Looks inside DOM
                    button = sb.find("#testbutton")[0];
                    spyOn(sb, "find");
                    //Attach a new event
                    expect(Application.Core.dom.query).toHaveBeenCalled();
                    sb.addEvent(button, "click", this.PerformTest);
                },
                destroy : function () {
                    //Deattach Event
                    sb.removeEvent(button, "click", this.PerformTest);
                    //remove references, avoiding memory leaks
                    delete button;
                },
                PerformTest : function () {
                    console.info("Tested");
                }
            };
        });
        
        Application.Core.start("TestModule");
        
    });
}); 
*/
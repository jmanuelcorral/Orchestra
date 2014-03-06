var startvalue = 0;
var myExampleModule = function(sandbox) {
    return {
        init : function () {
             sandbox.create_element("h1", { 'class' : 'Hello', text : "Hello World Module" });
             startvalue=1;
        },
        destroy : function () { startvalue=2;}
    };
};

describe("Testing if Application Core Exists", function(){
    it("Should be a Global Object Application.Core defined", function(){
        expect(Application.Core).not.toBe(undefined);
    }); 
});

describe("Creating a Single Module", function() {
    it("Should create a Module", function() {
        startvalue=0;
        Application.Core.create_module("TestModule", myExampleModule);
        expect(startvalue).toBe(0);
    });
}); 

describe("Starting a Created Module", function() {
    it("Should Start a Created Module", function() {
        startvalue=0;
        Application.Core.start("TestModule");
        expect(startvalue).toBe(1);
    });
});

describe("Stopping a Single Module", function() {
    it("Should Stop a Module", function() {
        startvalue=0;
        Application.Core.stop("TestModule");
        expect(startvalue).toBe(2);
    });
});

Application.Core.stop_all(); //this stops all modules and isolates the tests  
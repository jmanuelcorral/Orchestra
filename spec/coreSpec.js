var myExampleModule = function(sandbox) {
    return {
        init : function () {
             sandbox.create_element("h1", { 'class' : 'Hello', text : "Hello World Module" });
        },
        destroy : function () { }
    };
};

describe("Testing if Application Core Exists", function(){
    it("Should be a Global Object Application.Core defined", function(){
        expect(Application.Core).not.toBe(undefined);
    }); 
});

describe("Creating a Single Module", function() {
    it("Should create a Module", function() {
        spyOn(Application.Core, 'create_module').andCallThrough();
        Application.Core.create_module("TestModule", myExampleModule);
        expect(Application.Core.create_module).toHaveBeenCalled();
    });
}); 

describe("Starting a Created Module", function() {
    it("Should Start a Created Module", function() {
        spyOn(Application.Core, 'start').andCallThrough();
        Application.Core.start("TestModule");
        expect(Application.Core.start).toHaveBeenCalled();
    });
});

describe("Stopping a Single Module", function() {
    it("Should Stop a Module", function() {
        spyOn(Application.Core, 'stop').andCallThrough();
        Application.Core.stop("TestModule");
        expect(Application.Core.stop).toHaveBeenCalled();
    });
});

Application.Core.stop_all(); //this stops all modules and isolates the tests  
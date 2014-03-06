describe("Testing Modules Start and Stop", function() {
   var i;
   var myAwsomeModule = function(sb) {
       return {
        init : function () {
            i=0;
        },
        destroy : function () {
            i=-1;
        }
    };
   };

   it("Should be possible to register Module in system", function(){
        Application.Core.create_module("AwsomeModule", myAwsomeModule);
		expect(i).toBe(undefined);
	});
    
    it("Should be possible to initialize the module", function(){
       Application.Core.start("AwsomeModule");
        expect(i).toBe(0);
    });
    
    it("Should be possible to stop the module", function(){
       Application.Core.stop("AwsomeModule");
        expect(i).toBe(-1);
    });
}); 

describe("Modules Execute External Actions, throught Subscription", function() {
   var i;
   var myAwsomeModule = function(sb) {
       return {
        init : function () {
            i=0;
            sb.subscribe({
                'Awincrement' : this.increment,
                'Awdecrement'  : this.decrement,
            });
        },
        destroy : function () {
            i=-1;
            sb.ignore(['Awincrement', 'Awdecrement']);
        },
        increment : function() {
            if (i< 100) i++;
       },
        decrement : function() {
            if (i>0) i--;
       }
    };
   };

   var mySecondAwsomeModule = function(sb) {
   return {
        init : function () {
           sb.emit({
                    type : 'Awincrement',
                    data : null
                });
        },
        destroy : function () {
           sb.emit({
                    type : 'Awdecrement',
                    data : null
                });
        }
    };
   };
       
   it("Should be possible to register two Modules in system", function(){
        Application.Core.create_module("AwsomeModule", myAwsomeModule);
        Application.Core.start("AwsomeModule");
        Application.Core.create_module("SecondMod", mySecondAwsomeModule);
        Application.Core.start("SecondMod");
	    expect(i).toBe(1);	
	});
    
    it("Should be possible to Unregister Second Module in system", function(){
        Application.Core.stop("SecondMod");
	    expect(i).toBe(0);	
	});
    
    it("Should be possible to Unregister first Module in system", function(){
        Application.Core.stop("AwsomeModule");
	    expect(i).toBe(-1);	
	});
    
}); 

/*
describe("Modules bind and unbind DOM ELEMENTS", function() {
   var i;
     
   var myAwesomeModule = function(sb) {
       var buttonUp, buttonDown;
       return {
        init : function () {
            i=0;
            sb.create_element("a", { "id" : "buttonup", "class" : "buttonup" });
            sb.create_element("a", { "id" : "buttondown", "class" : "buttondown" });
            buttonUp = sb.find(".buttonup");
            buttonDown = sb.find(".buttondown");
            console.info(JSON.stringify(buttonUp));
            sb.addEvent(buttonUp, "click", this.increment);
            sb.addEvent(buttonDown, "click", this.decrement);
        },
        destroy : function () {
            i=-1;
            sb.removeEvent(buttonUp, "click", this.increment);
            sb.removeEvent(buttonDown, "click", this.decrement);
            buttonUp=buttonDown=null;
        },
        increment : function() {
            if (i< 100) i++;
            console.log("increment");
       },
        decrement : function() {
            if (i>0) i--;
       }
    };
   };
   Application.Core.create_module("AwsomeModule", myAwesomeModule);
   Application.Core.start_all();
    console.info($("#buttonup").length);
    it("Should be buttons Created by module", function(){
          
           expect($("#buttonup").length).toBe(1);	
    });
    
    it("Should be Incremented by module", function(){
        $("#buttonup").trigger("click");
           expect(i).toBe(1);	
    });
    
    Application.Core.stop_all(); 
}); 
*/
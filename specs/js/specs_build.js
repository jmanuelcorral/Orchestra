describe("Testing if Application Exists", function() {
  return it("Should be a Global Object Application", function() {
    return expect(Application).not.toBe(undefined);
  });
});

$(document).ready(function() {
  var my_module, startvalue;
  startvalue = 0;
  my_module = function(sandbox) {
    return {
      init: function() {
        sandbox.create_element("h1", {
          "class": "Hello",
          text: "Hello World Module"
        });
        startvalue = 1;
      },
      destroy: function() {
        startvalue = 2;
      }
    };
  };
  beforeEach(function() {
    startvalue = 0;
  });
  describe("Testing if Application Core Exists", function() {
    return it("Should be a Global Object Application.Core defined", function() {
      return expect(Application.Core).not.toBe(null);
    });
  });
  describe("Creating a Single Module", function() {
    return it("Should create a Module", function() {
      Application.Core.create_module("TestModule", my_module);
      return expect(startvalue).toBe(0);
    });
  });
  describe("Starting a Created Module", function() {
    return it("Should Start a Created Module", function() {
      Application.Core.start("TestModule");
      return expect(startvalue).toBe(1);
    });
  });
  describe("Stopping a Single Module", function() {
    return it("Should Stop a Module", function() {
      Application.Core.stop("TestModule");
      return expect(startvalue).toBe(2);
    });
  });
  Application.Core.stop_all();
  return Application.Core.delete_module("TestModule");
});

$(document).ready(function() {
  describe("Testing Modules Start and Stop", function() {
    var i, myAwesomeModule;
    i = null;
    myAwesomeModule = function(sb) {
      return {
        init: function() {
          i = 0;
        },
        destroy: function() {
          i = -1;
        }
      };
    };
    it("Should be possible to register Module in system", function() {
      Application.Core.create_module("AwesomeModule", myAwesomeModule);
      return expect(i).toBe(null);
    });
    it("Should be possible to initialize the module", function() {
      Application.Core.start("AwesomeModule");
      return expect(i).toBe(0);
    });
    return it("Should be possible to stop the module", function() {
      Application.Core.stop("AwesomeModule");
      return expect(i).toBe(-1);
    });
  });
  describe("Modules Execute External Actions, throught Subscription", function() {
    var i, myAwesomeModule, mySecondAwsomeModule;
    i = null;
    myAwesomeModule = function(sandbox) {
      return {
        init: function() {
          i = 0;
          sandbox.subscribe({
            "Awincrement": this.increment,
            "Awdecrement": this.decrement
          });
        },
        destroy: function() {
          i = -1;
          sandbox.ignore(["Awincrement", "Awdecrement"]);
        },
        increment: function() {
          if (i < 100) {
            i++;
          }
        },
        decrement: function() {
          if (i > 0) {
            i--;
          }
        }
      };
    };
    mySecondAwsomeModule = function(sandbox) {
      return {
        init: function() {
          sandbox.publish({
            type: "Awincrement",
            data: null
          });
        },
        destroy: function() {
          sandbox.publish({
            type: 'Awdecrement',
            data: null
          });
        }
      };
    };
    it("Should be possible to register two Modules in system", function() {
      Application.Core.create_module("AwsomeModule", myAwesomeModule);
      Application.Core.start("AwsomeModule");
      Application.Core.create_module("SecondMod", mySecondAwsomeModule);
      Application.Core.start("SecondMod");
      return expect(i).toBe(1);
    });
    it("Should be possible to Unregister Second Module in system", function() {
      Application.Core.stop("SecondMod");
      return expect(i).toBe(0);
    });
    return it("Should be possible to Unregister first Module in system", function() {
      Application.Core.stop("AwsomeModule");
      return expect(i).toBe(-1);
    });
  });
  return describe("Modules bind and unbind DOM ELEMENTS", function() {
    var i, myAwesomeModule;
    i = null;
    myAwesomeModule = function(sandbox) {
      var buttonDown, buttonUp;
      buttonUp = null;
      buttonDown = null;
      return {
        init: function() {
          i = 0;
          sandbox.create_element("a", {
            "id": "buttonup",
            "class": "buttonup"
          });
          sandbox.create_element("a", {
            "id": "buttondown",
            "class": "buttondown"
          });
          buttonUp = sandbox.find(".buttonup");
          buttonDown = sandbox.find(".buttondown");
          sandbox.add_event(buttonUp, "click", this.increment);
          sandbox.add_event(buttonDown, "click", this.decrement);
        },
        destroy: function() {
          i = -1;
          sandbox.remove_event(buttonUp, "click", this.increment);
          sandbox.remove_event(buttonDown, "click", this.decrement);
          sandbox.remove_element(buttonUp);
          sandbox.remove_element(buttonDown);
          buttonUp = buttonDown = null;
        },
        increment: function() {
          if (i < 100) {
            return i++;
          }
        },
        decrement: function() {
          if (i > 0) {
            return i--;
          }
        }
      };
    };
    Application.Core.create_module("AwsomeModule3", myAwesomeModule);
    Application.Core.start("AwsomeModule3");
    it("Should be buttons Created by module", function() {
      expect($("#buttonup").length).toBe(1);
      return expect($("#buttondown").length).toBe(1);
    });
    it("Should be Incremented by module", function() {
      $("#buttonup").click();
      return expect(i).toBe(1);
    });
    return it("Should be destroyed module", function() {
      Application.Core.stop("AwsomeModule3");
      return expect(i).toBe(-1);
    });
  });
});

$(document).ready(function() {
  $("html").append("<a href='#' id='testbutton'>testbutton</a>");
  describe("Testing if Application Sandbox Exists", function() {
    return it("Should be a Global Object Application.Sandbox defined", function() {
      return expect(Application.Sandbox).not.toBe(null);
    });
  });
  return describe("Testing if Sandbox Dom find function called", function() {
    return it("Should Sandbox -> Core have to been called", function() {
      Application.Core.create_module("TestModule2", function(sb) {
        var button;
        button = null;
        return {
          init: function() {
            button = sb.find("#testbutton");
            spyOn(sb, "find");
            sb.add_event(button, "click", this.PerformTest);
          },
          destroy: function() {
            sb.remove_event(button, "click", this.PerformTest);
            button = null;
          },
          PerformTest: function() {
            console.info("Tested");
          }
        };
      });
      Application.Core.start("TestModule2");
      return expect(Application.Core.dom.query).toHaveBeenCalled;
    });
  });
});

# Orchestra  #

[![Build Status](https://travis-ci.org/jmanuelcorral/Orchestra.png?branch=master)](https://travis-ci.org/jmanuelcorral/Orchestra)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jmanuelcorral/orchestra/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[![Coverage Status](https://img.shields.io/coveralls/jmanuelcorral/Orchestra.svg)](https://coveralls.io/r/jmanuelcorral/Orchestra)

Orchestra Helps you to build complex Javascript Architectures using a Core/SandBox Architecture Pattern Approaching Showed by Nicholas Zakas [http://www.slideshare.net/nzakas/scalable-javascript-application-architecture](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture "Scalable Architectures in Javascript Slides"). 

Orchestra is based in a layered Architecture, It's Event Driven and the combination of different design patterns. 
## Core Layer ##
It have these Tasks:

- Dependency Injection Container for registering and manage modules lifecycle.
- DOM Manipulation with a Base Library (at the moment jQuery is the only library supported).
- DOM Event Manipulation.
- Mediator for inter-module comunication using publish/subscription events.   

## SandBox Layer

It's build on top Core Layer, and provides to your modules an isolated API for work in your aplication.

## Installing application ##
This Obtains the source code from this repo:

` git clone git://github.com/jmanuelcorral/orchestra.git`

This helps you to install the project Dependencies

`cd orchestra`

`npm install`

## Building library  ##

`grunt build`

you can find the result of the build progress in the .\build\ folder.

## Development environment ##

you can get a continous deployment environment opening in a separate console: 

`grunt`

## Integrating with your Systems ##

You only need to copy the build results for developing in your environment.


## Getting started with the framework ##

Creating a simple module (a input searchbox with 2 buttons, search and reset):

**HTML of your module**
	<div id="search-box">
		<input type="search_input" placeholder="Click Here to Search" />
		<button id="search_button">Search</button>
		<button id="quit_button">Reset</button>
	</div>

	<div id="search-box">
		<input type="search_input" placeholder="Click Here to Search" />
		<button id="search_button">Search</button>
		<button id="quit_button">Reset</button>
	</div>

**Creating our Javascript Module**

	var mymodule = function(sandbox) {
		var input, button, reset;
	    return {
	        init : function () {
	            input = sandbox.find("#search_input"),
	            button = sandbox.find("#search_button"),
	            reset  = sandbox.find("#quit_search");
	            sandbox.addEvent(button, "click", this.handleSearch);
	            sandbox.addEvent(reset, "click", this.quitSearch);
	        },
	        destroy : function () {
	            sandbox.removeEvent(button, "click", this.handleSearch);
	            sandbox.removeEvent(button, "click", this.quitSearch);
	            input = button = reset = null;
	        },
	        handleSearch : function () {
	            var query = input.value;
	            if (query) {
	                sb.emit({
	                    type : 'perform-search',
	                    data : query
	                });
	            }
	        },
	        quitSearch : function () {
	            input.value = "";
	            sb.emit({
	                type : 'quit-search',
	                data : null
	            });
	        }
	    };
	}


In **Orchestra**, Every module should have 2 methods, if they don't exist, the module will not be used, and the framework returns an error in your console (if framework debug module is activated). 

Once time you have your module created, you can add to the DI container using:

	Application.Core.create_module("searchbox", mymodule);

And you can start / stop module using:

	Application.Core.start("searchbox"); //starts the module
	Application.Core.stop("searchbox"); //stops the module
	Application.Core.start_all(); //starts all the modules
	Application.Core.stop_all(); //stops all the modules

module.exports = (grunt) ->
  #configuration
  grunt.initConfig
    
    #coffeescript definition
    coffee:
      compileJoin:
        expand : true
        options :
          join : true
          bare : true
        files :
          "build/js/orchestra_build.js" : "src/**/*.coffee"
          "specs/js/specs_build.js" : "specs/**/*.coffee"
    #jshint definition
    jshint :
      build :
        src : ["build/js/*.js", "specs/js/*.js"]
    
    #uglify definition
    uglify :
      build :
        src : "build/js/*.js"
        dest : "build/orchestra.min.js"
        options :
          sourceMap : "build/orchestra.min.js.map"
    
    #tests
    jasmine :
      build :
        src :  ["vendor/jquery/dist/jquery.js", "build/js/*.js"]
        options : 
          specs : "specs/**/*.js"
          keepRunner : false
    #watch
    watch :
      build :
        files : ["src/**/*.coffee", "specs/**/*.coffee",  ["vendor/jquery/dist/jquery.js", "build/js/*.js"]]
        tasks : ["coffee", "jshint", "jasmine", "jasmine_node", "uglify"]

  #defining tasks
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-jasmine"

  #registering tasks
  grunt.registerTask "default", ["watch"]
  grunt.registerTask "build", ["coffee", "jshint", "jasmine", "uglify"]
module.exports = function(grunt) {
  
  var srctoBuildFiles = ['./src/**/*.js', '!**/vendor/**'];
  var srctoTestFiles = ['./src/vendor/jquery.js', './src/core.js', './src/sandbox.js' ,'./src/**/*.js'];
  var specFiles = 'spec/**/*.js';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      build: {
        src: srctoBuildFiles,
      }
    },
    
    uglify: {
      build: {
        src: srctoBuildFiles,
        dest: './build/orchestra.min.js',
        options: {
          sourceMap: './build/orchestra.min.js.map'
        }
      }
    },
    
    jasmine: {
      build: {
        src: srctoTestFiles,
        options: {
          specs: specFiles
        }
      }
    },
    
    watch: {
      build: {
        files: [srctoBuildFiles, specFiles],
        tasks: ['jshint', 'jasmine', 'uglify']
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
 
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['jshint', 'jasmine', 'uglify']);
};
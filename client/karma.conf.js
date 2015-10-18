module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/Chart.js/Chart.min.js',
      'app/bower_components/angular-chart.js/dist/angular-chart.min.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-aria/angular-aria.js',
      'app/bower_components/angular-material-icons/angular-material-icons.js',
      'app/bower_components/svg-morpheus/compile/minified/svg-morpheus.js',
      'app/bower_components/angular-material/angular-material.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-material-mocks/angular-material-mocks.js',
      'app/node_modules/es5-shim/es5-shim.min.js',
      'app/components/**/*.js',
      'app/directives/**/*.js',
      'app/services/*.js',
      'app/dashboard/*.js',
      'app/**/*_test.js',
      'app/app.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
'use strict';

angular.module('codingQuizApp', ['ionic',
  'codingQuizApp.auth',
  'codingQuizApp.admin',
  'codingQuizApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'validation.match',
  'ion-tree-list',
  'ui.tinymce',
  'ngStorage'
])/*
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })*/

  .config(function($urlRouterProvider, $locationProvider, $httpProvider, $animateProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);

    $animateProvider.classNameFilter(/animate/);

    $httpProvider.interceptors.push(function ($q) {
      return {
        'request': function (config) {
          console.log(config.url);
          return config || $q.when(config);
        }
      }
    });
  })
  .run(function ($rootScope) {
    $rootScope.$on('$viewContentLoaded',
      function (event, toState, toParams, fromState, fromParams) {
        console.log("view content loaded");
        Prism.highlightAll();
      })
  });


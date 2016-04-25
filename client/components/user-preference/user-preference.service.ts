/* global io */
'use strict';

angular.module('codingQuizApp')
  .factory('userPref', function ($localStorage) {
    return {
      get: function(key, defaultVal){
        return angular.isDefined($localStorage[key])?$localStorage[key]:defaultVal;
      },
      set: function(key, value){
        $localStorage[key] = value;
      }
    }
  });

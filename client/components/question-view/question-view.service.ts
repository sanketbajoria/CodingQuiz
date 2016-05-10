/* global io */
'use strict';

angular.module('codingQuizApp')
  .factory('qView', function ($localStorage, Auth) {
    if(!$localStorage.qView)
      $localStorage.qView = {};
    if(!$localStorage.qFavorite)
      $localStorage.qFavorite = {};
    var qView = $localStorage.qView;
    var qFavorite = $localStorage.qFavorite;
    return {
      isViewed: function(question){
        return question && qView[question._id];
      },
      view: function(question){
        $localStorage.qView[question._id] = qView[question._id] = true;
      },
      getAllViews: function(){
        return Object.keys(qView);
      },
      isFavorite: function(question){
        return question && qFavorite[question._id];
      },
      toggleFavorite: function(question, toggle){
        $localStorage.qFavorite[question._id] = qFavorite[question._id] = toggle?question:null;
      },
      getAllFavorites: function(){
        return Object.keys(qFavorite).map(function (key) {
          return qFavorite[key];
        });
      }
    }
  });

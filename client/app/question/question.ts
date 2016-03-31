'use strict';

angular.module('codingQuizApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('question', {
        url: '/question',
        template: '<question-list></question-list>'
      })
      .state('editQuestion', {
        url: '/question/:id',
        template: '<question-detail></question-detail>'
      })
      .state('addQuestion', {
        url: '/question/new',
        template: '<question-detail></question-detail>'
      });
  });

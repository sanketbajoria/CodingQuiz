'use strict';

angular.module('codingQuizApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tag', {
        url: '/tag',
        template: '<tag></tag>'
      });
  });

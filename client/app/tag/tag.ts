'use strict';

angular.module('codingQuizApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tags', {
        url: '/tags',
        templateUrl: 'app/tag/tagList.html',
        controller: 'TagListController',
        controllerAs: 'vm'
      })
      .state('editTag', {
        url: '/tag/:id',
        templateUrl: 'app/tag/tagDetail.html',
        controller: 'TagDetailController',
        controllerAs: 'vm'
      })
      .state('addTag', {
        url: '/tag',
        templateUrl: 'app/tag/tagDetail.html',
        controller: 'TagDetailController',
        controllerAs: 'vm'
      });
  });

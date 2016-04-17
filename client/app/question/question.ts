'use strict';

angular.module('codingQuizApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('questions', {
        url: '/questions',
        templateUrl: 'app/question/questionList.html',
        controller: 'QuestionListController',
        controllerAs: 'vm'
      })
      .state('editQuestion', {
        url: '/question/:id',
        template: '<ion-nav-view name="question"></ion-nav-view>',
        abstract: true,
        controller: 'QuestionDetailController',
        controllerAs: 'vm',
        params:{
          id:{squash:true,value:null}
        }
      })
      .state('editQuestion.detail', {
        url: '',
        views:{
          "question":{
            templateUrl: 'app/question/editQuestionDetail.html'
          }
        }
      })
      .state('editQuestion.content', {
        url: '/edit/content',
        views:{
          "question":{
            templateUrl: 'app/question/editor.html'
          }
        }
      })
      .state('editQuestion.tag', {
        url: '/edit/tag',
        views:{
          "question":{
            templateUrl: 'app/question/tag.html'
          }
        }
      })
      .state('editQuestion.preview', {
        url: '/preview',
        views:{
          "question":{
            templateUrl: 'app/question/viewQuestionDetail.html'
          }
        }
      });

  });

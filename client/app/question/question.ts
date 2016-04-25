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
      .state('question', {
        url: '/question/:id',
        template: '<ion-nav-view name="question"></ion-nav-view>',
        abstract: true,
        controller: 'QuestionDetailController',
        controllerAs: 'vm',
        params:{
          id:{squash:true,value:null}
        }
      })
      .state('question.view', {
        url: '',
        views:{
          "question":{
            templateUrl: 'app/question/viewQuestionDetail.html'
          }
        }
      })
      .state('question.edit', {
        url: '/edit',
        views:{
          "question":{
            templateUrl: 'app/question/editQuestionDetail.html'
          }
        }
      })
      .state('question.content', {
        url: '/edit/content',
        views:{
          "question":{
            templateUrl: 'app/question/editor.html'
          }
        }
      })
      .state('question.tag', {
        url: '/edit/tag',
        views:{
          "question":{
            templateUrl: 'app/question/tag.html'
          }
        }
      });

  });

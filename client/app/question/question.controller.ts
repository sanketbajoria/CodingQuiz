'use strict';
(function(){

  class QuestionListComponent {
    constructor($http, $scope, socket) {
      this.$http = $http;
      this.socket = socket;
      //this.awesomeThings = [];

      $scope.$on('$destroy', function() {
        //socket.unsyncUpdates('thing');
      });
    }


    $onInit() {
      this.$http.get('/api/things').then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
    }

    addThing() {
      if (this.newThing) {
        this.$http.post('/api/things', { name: this.newThing });
        this.newThing = '';
      }
    }

    deleteThing(thing) {
      this.$http.delete('/api/things/' + thing._id);
    }
  }

  class QuestionDetailComponent {
    constructor($http, $scope, $stateParams) {
      this.$http = $http;
      this.$stateParams = $stateParams;
      this.question = {};
    }


    $onInit() {
      if(this.$stateParams.id){
        this.$http.get('/api/questions/'+this.$stateParams.id).then(response => {
          this.question = response.data;
        });
      }
    }

    saveQuestion() {
      if(!!!this.question._id){
        this.$http.post('/api/question', question);
      }else{
        this.$http.put()
      }
    }

    deleteQuestion(question) {
      this.$http.delete('/api/questions/' + question._id);
    }
  }

  /*angular.module('codingQuizApp')
    .component('questionList', {
      templateUrl: 'app/question/questionList.html',
      controller: QuestionListComponent
  }).component('questionDetail', {
      templateUrl: 'app/question/questionDetail.html',
      controller: QuestionDetailComponent
  });*/

})();

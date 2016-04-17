'use strict';
(function(){

  class QuestionListController {
    constructor($http, $scope, $state) {
      this.$http = $http;
      this.$state = $state;
      this.$onInit();
    }


    $onInit() {

      this.$http.get('/api/questions').then(response => {
        this.questions = response.data;
      });
    }

    viewEditQuestion(question) {
      if(question)
        this.$state.go('editQuestion.detail',{id:question._id});
    }

    deleteQuestion(question) {
      this.$http.delete('/api/questions/' + question._id);
    }
  }

  class QuestionDetailController {
    constructor($http, $scope, $stateParams, $state, Util, $rootScope) {
      this.$http = $http;
      this.$stateParams = $stateParams;
      this.Util = Util;
      this.$scope = $scope;
      this.$state = $state;
      this.$rootScope = $rootScope;
      this.$onInit();
      $scope.tinymceOptions = {
        onChange: function(e) {
          // put logic here for keypress and cut/paste changes
        },
        inline: false,
        plugins : 'codesample advlist autolink link image lists charmap print preview code',
        toolbar: ("insertfile undo redo | styleselect | bold italic | " +
        "alignleft aligncenter alignright alignjustify | " +
        "bullist numlist outdent indent | link image table | " +
        "code fullscreen codesample"),
        skin: 'lightgray',
        theme : 'modern'
      };
    }


    $onInit() {
      this.question = {};
      if(this.$stateParams.id){
        this.$http.get('/api/questions/'+this.$stateParams.id).then(response => {
          this.question = response.data;
        });
      }
      this.$http.get('/api/tags').then(response => {
        if (angular.isArray(response.data)) {
          this._tags = response.data;
          this.tagTree = this.Util.getTagTree(this._tags);
        }
      });
    }

    saveQuestion(questionForm) {
      var question = this.question;
      if (angular.isArray(question.tags))
        question.tags = question.tags.map(function (tag) {
          return angular.isString(tag) ? tag : angular.isObject(tag) && tag._id ? tag._id : null;
        });
      var p = !!!question._id?this.$http.post('/api/questions', question):this.$http.put('/api/questions/' + question._id, question);
      p.then(response =>  {
        this.$state.go('questions',{},{reload:true});
      });
    }

    deleteQuestion() {
      this.$http.delete('/api/questions/' + this.question._id).then(response => {
        this.$state.go('questions', {}, {reload: true});
      });
    }

    editContent(name){
      this.$scope.name = name;
      this.$state.go('editQuestion.content');
    }

    editTag(){
      this.$state.go('editQuestion.tag');
    }
  }

  angular.module('codingQuizApp')
    .controller('QuestionListController', QuestionListController)
    .controller('QuestionDetailController', QuestionDetailController);

})();

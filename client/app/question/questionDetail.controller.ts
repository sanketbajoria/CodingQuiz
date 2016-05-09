'use strict';
(function(){

  class QuestionDetailController {
    constructor($http, $scope, $stateParams, $state, Util, qView) {
      this.$http = $http;
      this.$stateParams = $stateParams;
      this.Util = Util;
      this.$scope = $scope;
      this.$state = $state;
      this.qView = qView;
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
      this.question = {level: 'intermediate'};
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
      var p = !!!question._id?this.$http.post('/api/questions', question):this.$http.put('/api/questions/' + question._id, question);
      p.then(response =>  {
        this.$state.go('questions');
      });
    }

    deleteQuestion() {
      this.$ionicPopup.confirm({
        title: "Delete Question",
        template: "Are you sure to delete it?"
      }).then(res => {
        if (res) {
          this.$http.delete('/api/questions/' + this.question._id).then(response => {
            this.$state.go('questions', {}, {reload: true});
          });
        }
      });
    }

    editContent(name){
      this.$scope.name = name;
      this.$state.go('question.content');
    }

    editTag(){
      this.$state.go('question.tag');
    }
  }

  angular.module('codingQuizApp')
    .controller('QuestionDetailController', QuestionDetailController);
})();

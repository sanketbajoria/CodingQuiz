'use strict';
(function(){

  class QuestionListController {

    constructor($http, $scope, $state, userPref, qView, $rootScope) {
      this.$http = $http;
      this.$state = $state;
      this.userPref = userPref;
      this.qView = qView;
      this.$onInit();

      //Slider options
      var self=this;
      $scope.options = {
        loop: false,
        onSlideChangeEnd: function(swiper){
          if(self.questions.length - swiper.activeIndex == 2){
              $scope.$apply(function(){
              self.questions.push(angular.copy(self.questions[0]));
              swiper.update(true);
            })
          }
        },
        speed: 500,
      }

      //Toggle the favorite item
      $rootScope.$on("$ionFlipper:toggleFavorite", function(e, question){
        qView.toggleFavorite(question, question.favorite);
      });
    }

    $onInit() {
      this.$http.get('/api/questions').then(response => {
        this.questions = response.data;
      });
      this.displayState = this.userPref.get('displayState', 1);
    }

    changeDisplayState(){
     this.displayState = (this.displayState+1) % 2;
     this.userPref.set('displayState',this.displayState);
    }

    viewQuestion(question) {
      if(question)
        this.$state.go('question.view',{id:question._id});
    }

    deleteQuestion(question) {
      this.$http.delete('/api/questions/' + question._id);
    }
  }

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
      var p = !!!question._id?this.$http.post('/api/questions', question):this.$http.put('/api/questions/' + question._id, question);
      p.then(response =>  {
        this.$state.go('question.view');
      });
    }

    deleteQuestion() {
      this.$http.delete('/api/questions/' + this.question._id).then(response => {
        this.$state.go('questions', {}, {reload: true});
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
    .controller('QuestionListController', QuestionListController)
    .controller('QuestionDetailController', QuestionDetailController);

})();

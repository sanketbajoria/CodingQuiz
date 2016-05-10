'use strict';
(function(){

  class QuestionListController {

    constructor($http, $scope, $state, userPref, qView, $ionicPopup, ionStorage) {
      this.$http = $http;
      this.$state = $state;
      this.userPref = userPref;
      this.ionStorage = ionStorage;
      this.qView = qView;
      this.$ionicPopup = $ionicPopup;
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
    }

    $onInit() {
      this.$http.get('/api/questions').then(response => {
        this.questions = response.data;
      });
      this.ionStorage.getPref('displayState',1).then(val => {
        this.displayState = val;
      })
    }

    changeDisplayState(){
     this.displayState = (this.displayState+1) % 2;
     this.ionStorage.setPref('displayState', this.displayState);
    }

    init(question){
      this.ionStorage.isViewed(question).then(viewed => {question.read=viewed});
      this.ionStorage.isFavorite(question).then(favorite => {question.favorite=favorite});
    }

    toggleFavorite(question){
      question.favorite = !question.favorite;
      this.ionStorage.toggleFavorite(question,question.favorite);
    }

    flipped(question) {
      question.read = true;
      this.ionStorage.view(question);
    }

    edit(question) {
      this.$state.go('question.edit',{id:question._id});
    }

    delete(question) {
      this.$ionicPopup.confirm({
        title: "Delete Question",
        template: "Are you sure to delete it?"
      }).then(res => {
        if (res) {
          this.$http.delete('/api/questions/' + question._id).then(response => {
            this.$state.go(this.$state.current, {}, {reload: true});
          });
        }
      });
    }
  }

  angular.module('codingQuizApp')
    .controller('QuestionListController', QuestionListController)
})();

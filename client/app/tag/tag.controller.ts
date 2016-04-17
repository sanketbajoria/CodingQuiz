'use strict';
(function () {

  class TagListController {
    constructor($http, Util, $scope, $state, $ionicPopup) {
      this._tags = [];
      this.$http = $http;
      this.Util = Util;
      this.$scope = $scope;
      this.$state = $state;
      this.$ionicPopup = $ionicPopup;
      this.$onInit();
    }

    $onInit() {
      this.$http.get('/api/tags').then(response => {
        if (angular.isArray(response.data)) {
          var vm = this;
          this._tags = response.data;
          this.tagTree = this.Util.getTagTree(this._tags);
          this.$scope.$on('$ionTreeList:ItemEdited', function (event, item) {
            vm.$state.go('editTag',{id:item._id});
          });
        }
      });
    }

    editTag() {
      if(this.selected){
        this.$state.go('editTag',{id:this.selected._id});
        this.selected = null;
      }
    }

    deleteTag() {
      if(this.selected){
        this.$ionicPopup.confirm({
          title: "Delete Tag",
          template: "It will delete the tag and it's children. Are you sure"
        }).then(res => {
          if (res) {
            this.$http.post('/api/tags/deleteTags', {tags: this.Util.getTagIds(this.selected)}).then(response => {
              this.$state.go(this.$state.current, {}, {reload: true});
              this.selected = null;
            });
          }
        });
      }
    }
  }

  class TagDetailController {
    constructor($http, Util, $stateParams, $state, $scope) {
      this._tags = [];
      this.$http = $http;
      this.Util = Util;
      this.$stateParams = $stateParams;
      this.$state = $state;
      this.$scope = $scope;
      this.$onInit();
      $scope.uniqueTag = function(){
        var vm = $scope.vm;
        return !!!(vm._tags && vm._tags.filter(function(t){
          return t._id !== vm.tag._id && t.name===vm.tag.name && vm.Util.normalizedValue(t.parent) === vm.Util.normalizedValue(vm.tag.parent);
        }).length);
      }
    }

    $onInit() {
      var vm = this;
      this.tag = {};
      this.$http.get('/api/tags').then(response => {
        if (angular.isArray(response.data)) {
          this._tags = response.data;
          this.tagOption = this.Util.getTagOptions(this._tags, this.$stateParams.id)
        }
      });
      if(this.$stateParams.id){
        this.$http.get('/api/tags/' + this.$stateParams.id).then(response => {
          this.tag = response.data;
        });
      }
      this.$scope.$watch("vm.tag.name", function(){
        vm.tag.slug = vm.getSlug();
      })
    }

    getSlug() {
      return this.tag && this.tag.name? this.tag.name.replace(/\s+/g, '-').toLowerCase(): "";
    }

    saveTag(tagForm) {
      var tag = this.tag;
      tag.parent = tag.parent || null;
      var p = !!!tag._id?this.$http.post('/api/tags', tag):this.$http.put('/api/tags/' + tag._id, tag);
      p.then(response =>  {
        this.$state.go('tags',{},{reload:true});
      });
    }

    deleteTag() {
      this.$ionicPopup.confirm({
        title: "Delete Tag",
        template: "It will delete the tag and it's children. Are you sure"
      }).then(res => {
        if (res) {
          this.$http.post('/api/tags/deleteTags', {tags: this.Util.getTagIds(this.tag)}).then(response => {
            this.$state.go('tags', {}, {reload: true});
          });
        }
      });
    }
  }

  angular.module('codingQuizApp')
    .controller('TagListController', TagListController)
    .controller('TagDetailController', TagDetailController);
})();

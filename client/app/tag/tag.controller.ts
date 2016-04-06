'use strict';
(function () {

  class TagListController {
    constructor($http, Util, $scope, $state) {
      this._tags = [];
      this.$http = $http;
      this.Util = Util;
      this.$scope = $scope;
      this.$state = $state;
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

    }

    deleteTag() {

    }
  }

  class TagDetailController {
    constructor($http, Util, $stateParams, $state) {
      this._tags = [];
      this.$http = $http;
      this.Util = Util;
      this.$stateParams = $stateParams;
      this.$state = $state;
      this.$onInit();
    }

    $onInit() {
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
    }

    saveTag() {
      var tag = this.tag;
      tag.parent = tag.parent || null;
      var p;
      if(!!!tag._id){
        p = this.$http.post('/api/tags', tag);
      }else{
        p = this.$http.put('/api/tags/' + tag._id, tag);
      }
      p.then(response =>  {
        this.$state.go('tags',{},{reload:true});
      });
    }
  }

  angular.module('codingQuizApp')
    .controller('TagListController', TagListController)
    .controller('TagDetailController', TagDetailController);
})();

'use strict';
(function () {

  class TagListController {
    constructor($http, Util) {
      this._tags = [];
      this.$http = $http;
      this.Util = Util;
      this.$onInit();
    }

    $onInit() {
      this.$http.get('/api/tags').then(response => {
        if (angular.isArray(response.data)) {
          this._tags = response.data;
          this.tagTree = this.Util.getTagTree(this._tags);
        }
      });
    }
  }

  class TagDetailController {
    constructor($http, Util, $stateParams) {
      this._tags = [];
      this.$http = $http;
      this.Util = Util;
      this.$onInit();
    }

    $onInit() {
      this.$http.get('/api/tags').then(response => {
        if (angular.isArray(response.data)) {
          this._tags = response.data;
        }
      });
    }

    saveTag() {
      var tag = this.tag;
      if(!!!tag._id){
        this.$http.post('/api/tags', tag);
      }else{
        this.$http.put('/api/tags/' + 'tag._id', tag);
      }
    }
  }

  angular.module('codingQuizApp')
    .controller('TagListController', TagListController)
    .controller('TagDetailController', TagDetailController);

})();

'use strict';
(function () {

  class TagListComponent {
    constructor($http, Util) {
      this._tags = [];
      this.$http = $http;
      this.Util = Util;
    }

    $onInit() {
      this.$http.get('/api/tags').then(response => {
        if (angular.isArray(response.data)) {
          this._tags = response.data;
        }
      });
    }

    getTags() {
      var tagMap = {};
      angular.forEach(this.tags, function (tag) {
        tag.children = [];
        tagMap[tag._id] = tag;
      });
      angular.forEach(tagMap, function (tag, id) {
        if (tag.parent) {
          tagMap[tag.parent].children.push(tag);
        }
      });
      return tagMap.values.filter(function(tag){
        return !!!tag.parent;
      });
    }
  }

  class TagDetailComponent {
    constructor($http, Util, $stateParams) {
      this._tags = [];
      this.$http = $http;
      this.Util = Util;
    }

    $onInit() {
      this.$http.get('/api/tags').then(response => {
        if (angular.isArray(response.data)) {
          this._tags = response.data;
        }
      });
    }

    saveTag() {
      var tag = $ctrl.tag;
    }

    getTagOptions() {
      var tagOptions = [];
      this.mapTagOptions(this.Util.getTagsTree(this._tags), 0, tagOptions);
      return tagOptions;
    }

    mapTagOptions(tags, level, tagOptions) {
      if (angular.isArray(tags)) {
        angular.forEach(tags, function (tag) {
          tag.label = Array(level + 1).join(" ") + tag.name
          tagOptions.push(tag);
          this.mapTagOptions(tag.children, level + 1, tagOptions);
        }, this);
      }
    }
  }

  angular.module('codingQuizApp')
    .component('tagList', {
      templateUrl: 'app/tag/tagList.html',
      controller: TagListComponent
    })
    .component('tagDetail', {
      templateUrl: 'app/tag/tagDetail.html',
      controller: TagDetailComponent
    });

})();

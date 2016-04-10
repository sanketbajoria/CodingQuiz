'use strict';

(function() {

/**
 * The Util service is for thin, globally reusable, utility functions
 */
function UtilService($window) {
  var Util = {
    /**
     * Return a callback or noop function
     *
     * @param  {Function|*} cb - a 'potential' function
     * @return {Function}
     */
    safeCb(cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    },

    /**
     * Parse a given url with the use of an anchor element
     *
     * @param  {String} url - the url to parse
     * @return {Object}     - the parsed url, anchor element
     */
    urlParse(url) {
      var a = document.createElement('a');
      a.href = url;

      // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
      if (a.host === '') {
        a.href = a.href;
      }

      return a;
    },

    /**
     * Test whether or not a given url is same origin
     *
     * @param  {String}           url       - url to test
     * @param  {String|String[]}  [origins] - additional origins to test against
     * @return {Boolean}                    - true if url is same origin
     */
    isSameOrigin(url, origins) {
      url = Util.urlParse(url);
      origins = (origins && [].concat(origins)) || [];
      origins = origins.map(Util.urlParse);
      origins.push($window.location);
      origins = origins.filter(function(o) {
        return url.hostname === o.hostname &&
          url.port === o.port &&
          url.protocol === o.protocol;
      });
      return (origins.length >= 1);
    },

    getTagTree(tags){
      var tagMap = {};
      angular.forEach(tags, function (tag) {
        tag.tree = [];
        tagMap[tag._id] = tag;
      });
      angular.forEach(tagMap, function (tag, id) {
        if (tag.parent) {
          tagMap[tag.parent].tree.push(tag);
        }
      });
      return Object.keys(tagMap).map(function(k){return tagMap[k];}).filter(function(tag){
        return !!!tag.parent;
      });
    },

    getTagOptions(tags, excludeTag) {
      var tagOptions = [];
      this.mapTagOptions(this.getTagTree(tags), 0, tagOptions, excludeTag);
      return tagOptions;
    },

    mapTagOptions(tags, level, tagOptions, excludeTag) {
      if (angular.isArray(tags)) {
        angular.forEach(tags, function (tag) {
          if(!excludeTag   || tag._id !== excludeTag){
            tag.label = Array(level + 1).join("&nbsp;&nbsp;") + tag.name
            tagOptions.push(tag);
            this.mapTagOptions(tag.tree, level + 1, tagOptions, excludeTag);
          }
        }, this);
      }
    },

    normalizedValue(val){
      if(val==="" || val===null || val===undefined){
        return false;
      }
      return val;
    }
  };

  return Util;
}

angular.module('codingQuizApp.util')
  .factory('Util', UtilService);

})();

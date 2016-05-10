/* global io */
'use strict';

angular.module('codingQuizApp')
  .factory('ionStorage', function ($q) {
    var deferredDB = $q.defer();
    var schema = {
      stores: [{
        name: 'favorite',
        keyPath: '_id', // optional,
        autoIncrement: false // optional.
      }, {
        name: 'view',
        keyPath: 'viewedAt', // optional,
        autoIncrement: false, // optional.
        indexes: [
          {
            name: '_id',
            keyPath: '_id'
          }
        ]
      }, {
        name: 'tag',
        keyPath: '_id',
        autoIncrement: false

      }, {
        name: 'preference'
      }]
    };

    new Fingerprint2().get(function (result, components) {
      var db = new ydn.db.Storage(result, schema);
      deferredDB.resolve(db);
    });
    var $db = deferredDB.promise;
    var recentView = null;
    return {
      getPref: function (key, defaultVal) {
        return $db.then(db => {
          return $q.when(db.get('preference', key).then(function (doc) {
            return doc ? doc[key] : defaultVal;
          }, function (err) {
            console.log(err);
            return defaultVal;
          }));
        })
      },
      setPref: function (key, value) {
        var pref = {updated: new Date().getTime()};
        pref[key] = value;
        return $db.then(db => {
          return $q.when(db.put('preference', pref, key));
        });
      },
      isViewed: function (question) {
        var key_range = ydn.db.KeyRange.only(question._id);
        return $db.then(db => {
          return $q.when(db.values('view', '_id', key_range, 1).then(function (docs) {
            return docs && docs.length > 0 ? true : false;
          }, function (err) {
            return false;
          }));
        });
      },
      view: function (question) {
        var qView = {viewedAt: new Date().getTime(), _id: question._id}
        return $db.then(db => {
          $q.when(recentView || db.values('view', new ydn.db.KeyRange(), 1, 0, true).then(function(docs){
              return docs && docs.length>0?docs[0]._id:null;
            })).then(r => {
            recentView = question._id;
            if(r != question._id){
              return $q.when(db.put('view', qView));
            }
          });
        })
      },
      getAllViews: function (limit, offset) {
        offset = offset || 0;
        limit = limit || 25;
        return $db.then(db => {
          return $q.when(db.values('view', new ydn.db.KeyRange(), limit, offset, true));
        });
      },
      isFavorite: function (question) {
        return $db.then(db => {
          return $q.when(db.get('favorite', question._id).then(function (doc) {
            return doc ? true : false;
          }, function (err) {
            return false;
          }));
        });
      },
      toggleFavorite: function (question, toggle) {
        return $db.then(db => {
          return $q.when(toggle ? db.put('favorite', question) : db.remove('favorite', question._id));
        });
      },
      getAllFavorites: function (limit, offset) {
        offset = offset || 0;
        limit = limit || 25;
        return $db.then(db => {
          return $q.when(db.values('favorite', new ydn.db.KeyRange(), limit, offset));
        });
      }
    }
  });





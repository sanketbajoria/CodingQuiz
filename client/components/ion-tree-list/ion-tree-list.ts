"use strict";
(function () {
  /* global angular */
  var CONF = {
    baseUrl: 'components/ion-tree-list',
    digestTtl: 35
  }

  function addDepthToTree(obj, depth, collapsed) {
    for (var key in obj) {
      if (obj[key] && typeof(obj[key]) == 'object') {
        obj[key].depth = depth;
        obj[key].collapsed = collapsed;
        addDepthToTree(obj[key], key === 'tree' ? ++depth : depth, collapsed)
      }
    }
    return obj
  }

  function toggleCollapse(obj) {
    for (var key in obj) {
      if (obj[key] && typeof(obj[key]) == 'object') {
        obj[key].collapsed = !obj[key].collapsed;
        toggleCollapse(obj[key])
      }
    }
    return obj
  }

  function getItemId(item){
    return angular.isString(item)?item:(angular.isObject(item) && item._id?item._id:(item?item:null));
  }

  function itemEquals(item1,item2){
    return getItemId(item1) ===  getItemId(item2);
  }

  function findItem(item, selectedItem){
    var ret = -1;
    if(angular.isArray(selectedItem) && item){
      for(var i=0;i<selectedItem.length;i++){
        if(itemEquals(selectedItem[i],item)){
          ret = i;
          break;
        }
      }
    }
    return ret;
  }

  function selectItem(item, selectedItem, multiple, key) {
    if (multiple) {
      var idx = findItem(item,selectedItem);
      if (idx === -1) {
        selectedItem.push(item);
      }
    } else {
      if (!!selectedItem)
        selectedItem[key] = false;
      selectedItem = item;
    }
    item[key] = true;
    return selectedItem;
  }

  function deselectItem(item, selectedItem, multiple, key) {
    if (multiple) {
      var idx = findItem(item,selectedItem);
      if (idx !== -1) {
        selectedItem.splice(idx, 1);
      }
    } else {
      if (itemEquals(selectedItem,item))
        selectedItem = null;
    }
    item[key] = false;
    return selectedItem;
  }


  angular.module('ion-tree-list', [], function ($rootScopeProvider) {
    $rootScopeProvider.digestTtl(CONF.digestTtl)
  })
    .directive('ionTreeList', function () {
      return {
        restrict: 'E',
        scope: {
          items: '=',
          collapsed: '=',
          templateUrl: '@',
          selectedItem: '=?',
          checkedItem: '=?',
          multipleSelect: '=?',
          multipleCheck: '=?'
        },
        templateUrl: CONF.baseUrl + '/ion-tree-list.tmpl.html',
        controller: function ($scope) {
          $scope.baseUrl = CONF.baseUrl;
          $scope.toggleCollapse = toggleCollapse;

          if (angular.isUndefined($scope.multipleSelect))
            $scope.multipleSelect = false;
          if (angular.isUndefined($scope.multipleCheck))
            $scope.multipleCheck = true;

          if ($scope.multipleSelect && !!!$scope.selectedItem)
            $scope.selectedItem = [];
          if ($scope.multipleCheck && !!!$scope.checkedItem)
            $scope.checkedItem = [];


          $scope.emitEvent = function (item, event) {
            $scope.$emit('$ionTreeList:' + event, item)
          }

          $scope.toggleSelect = function (item, $event) {
            if (!item.selected) {
              $scope.selectedItem = selectItem(item, $scope.selectedItem, $scope.multipleSelect, "selected");
            } else {
              $scope.selectedItem = deselectItem(item, $scope.selectedItem, $scope.multipleSelect, "selected");
            }
            $scope.emitEvent(item, item.selected ? "ItemHold" : "ItemUnhold");
            $event.stopPropagation();
          }

          $scope.isSelected = function (item) {
            if ($scope.multipleSelect) {
              return findItem(item, $scope.selectedItem) === -1 ? false : true;
            } else {
              return itemEquals($scope.selectedItem, item);
            }
          }

          $scope.toggleCheck = function (item, $event) {
            if (item.checked) {
              $scope.checkedItem = selectItem(item, $scope.checkedItem, $scope.multipleCheck, "checked");
            } else {
              $scope.checkedItem = deselectItem(item, $scope.checkedItem, $scope.multipleCheck, "checked");
            }
            $scope.emitEvent(item, item.checked ? "ItemCheck" : "ItemUncheck");
            $event.stopPropagation()
          }

          $scope.isChecked = function (item) {
            if ($scope.multipleCheck) {
              return findItem(item, $scope.checkedItem) === -1 ? false : true;
            } else {
              return itemEquals($scope.checkedItem, item);
            }
          }

          $scope.moveItem = function (item, fromIndex, toIndex) {
            $scope.items.splice(fromIndex, 1);
            $scope.items.splice(toIndex, 0, item)
          }

          $scope.editItem = function (item, $event) {
            $scope.$emit('$ionTreeList:ItemEdited', item);
            $event.stopPropagation();
          }

          $scope.$watch('collapsed', function () {
            $scope.toggleCollapse($scope.items)
          });

          $scope.$watch('items', function () {
            $scope.items = addDepthToTree($scope.items, 1, $scope.collapsed);
            $scope.$emit('$ionTreeList:LoadComplete', $scope.items)
          })
        },
        compile: function (element, attrs) {
          attrs.templateUrl = attrs.templateUrl ? attrs.templateUrl : 'item_default_renderer';
          return function (scope, elem, attrs, ctrl) {
            scope.selectEnabled = angular.isUndefined(attrs.selectedItem) ? false : true;
            scope.checkEnabled = angular.isUndefined(attrs.checkedItem) ? false : true;



          }
        }
      }
    });
})();

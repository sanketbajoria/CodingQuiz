'use strict';

angular.module('codingQuizApp')
  .directive('ionFlipper', function ($ionicGesture, $timeout) {
    return {
      templateUrl: 'components/ion-flipper/ion-flipper.tmpl.html',
      restrict: 'E',
      scope: {
        question: '=',
        style: '=?',
        class: '@',
        gesture: '@',
        itemFlipped: '&onFlip',
        read: '@',
        itemClicked: '&onClick',
        idx: '@'
      },
      controller: function ($scope, $element, $rootScope) {
        $scope.colors = ['#009688', '#CDDC39', '#FFC107', '#795548', '#FF5722', '#FF9800']
        if (!$scope.style) {
          if ($scope.class == 'small')
            $scope.style = $scope.frontStyle = $scope.backStyle = {height: '160px'};
        } else {
          $scope.frontStyle = $scope.backStyle = $scope.style;
        }
        $scope.$watch('flipped', function (newVal) {
          if (!$scope.style && $scope.class == 'normal') {
            $scope.style = newVal ? $scope.backStyle : $scope.frontStyle;
          }
        });

        $scope.emitEvent = function (ev, $event) {
          $scope.$emit('$ionFlipper:'+ev, $scope.question);
          $event.stopPropagation();
        };

        $scope.toggleFavorite = function($event){
          $scope.question.favorite = !$scope.question.favorite;
          $scope.emitEvent('toggleFavorite', $event);
        }
      },
      compile: function (element, attrs) {
        attrs.gesture = attrs.gesture || 'hold';
        attrs.class = attrs.class || 'normal';
        return function ($scope, $elem, $attrs) {
          $ionicGesture.on($scope.gesture, function (event) {
            $scope.$apply(function () {
              $scope.flipped = !$scope.flipped;
              if($scope.flipped)
                $scope.itemFlipped({question: $scope.question});
            });
          }, $elem);
          if (!$scope.style && $scope.class == 'normal') {
            $timeout(function () {
              $scope.frontStyle = {height: $elem[0].querySelector('.front').offsetHeight + 'px'};
              $scope.backStyle = {height: $elem[0].querySelector('.back').offsetHeight + 'px'};
              $scope.style = $scope.flipped ? $scope.backStyle : $scope.frontStyle;
            }, 0);
          }

        }
      }
    };
  });

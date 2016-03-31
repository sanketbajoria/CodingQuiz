'use strict';

describe('Component: TagListComponent', function () {

  // load the controller's module
  beforeEach(module('codingQuizApp'));

  var TagListComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    TagListComponent = $componentController('TagListComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

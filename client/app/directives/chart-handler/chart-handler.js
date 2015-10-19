'use strict';
  
  function chartDirective(){
    return{
      restrict: 'E',
      scope: {
        title: '=',
        data: '=',
        labels: '=',
        type: '=',
        options: '=?',
        click: '=?',
        previousChart: '=',
        hasDrilldown: '=',
        revertDrill: '=',
        legend: '=',
        selectSettings: '='
      },
      templateUrl: 'directives/chart-handler/chart-handler-template.html',
      controller: chartDirectiveCtrl
    }
  };

  /*
   * Separate the controller to simplify testing
   * Chart drilldown and recovery
   * NOTE: Prototype approach gets messy in directives
   */
  function chartDirectiveCtrl($scope){
    //Validates our click event and calls the parent drilldown function
    $scope.drilldown = function(points, evt){
      if($scope.hasDrilldown && points.length > 0)
      {
        $scope.click(points, evt);
      }
    };

    //Check if we have anything stored (toggles return button)
    $scope.hasPreviousChart = function(){
      return ($scope.previousChart ? true : false);
    };

    //Restores our previous chart, toggles our button and removes our saved chart
    $scope.restorePrevious = function(){
      $scope.data = angular.copy($scope.previousChart.data);
      $scope.labels = angular.copy($scope.previousChart.labels);
      $scope.hasDrilldown = true;
      $scope.title = angular.copy($scope.previousChart.title);
      $scope.previousChart = false;
    }

  }

angular
  .module('myApp.directives', [])
  .controller('chartDirectiveCtrl', chartDirectiveCtrl)
  .directive('chartHandler', chartDirective);
'use strict';


function dashboardConfig($routeProvider){
  $routeProvider.when('/dashboard', {
    templateUrl: 'dashboard/dashboard.html',
    controller: 'dashboardCtrl'
  });
}

function dashboardCtrl($scope, companyService){
  this.$scope = $scope;
  this.$scope.finalFundingYear = 2014;

  this.$scope.years = this.yearsAvailable();

  this.companyService = companyService;

  this.$scope.charts = [];

  //Fire off!
  this.init();
};

dashboardCtrl.prototype = {
  
  /*
   * Initializes all our charts from the database
   */
  init: function(){

    //Bind our functions
    this.$scope.drilldown = angular.bind(this, this.drilldown);
    this.$scope.updateYear = angular.bind(this, this.updateYear);


    //TODO: Refactor how we're initializing charts, this function is getting cluttered

    //Retrieve data for top 10 countries by company count
    var self = this;
    this.companyService.getCompanies().then(function(response){
      if(response.data){
        self.$scope.charts.push({
          labels: response.data.chartLabels,
          data: response.data.chartData,
          title: response.data.chartTitle,
          type: 'Bar',
          name: 'top-companies',
          hasDrilldown: true,
          click: self.drilldown()
        });
        console.log(self.$scope.charts);
      }
      else
      {
        //No data found
      }
    }, function(error){

    });

    //Retrieve data for average funding per year (per final funding)
    this.companyService.getAverageFinalFunding().then(function(response){
      if(response.data)
      {
        self.$scope.charts.push({
          labels: response.data.chartLabels,
          data: response.data.chartData,
          title: response.data.chartTitle,
          type: 'Line',
          options: {
            tooltipTemplate: '<%= value %> $',
          },
          name: 'funding'
        });
      }
      else
      {
        //No data found
      }
    }, function(error){

    });

    //Retrieve data for the number of final funding rounds per month by specific year
    this.companyService.getFinalFundingByMonth(this.$scope.finalFundingYear).then(function(response){
      if(response.data)
      {
        self.$scope.charts.push({
          labels: response.data.chartLabels,
          data: response.data.chartData,
          title: response.data.chartTitle,
          type: 'Bar',
          options: {
            tooltipTemplate: '<%= value %> $',
          },
          name: 'fundingrounds'
        });
      }
      else
      {
        //No data found
      }
    });
    
  },

  /*
   * Will fetch a new chart of specific data (based on its parent chart)
   * based on the type of chart selected
   */
  drilldown: function(points, evt){
    if(points)
    {
      var target = points[0].label,
          chartIndex,
          self = this,
          previousChart = {};

      //Possibly refactor using filter... find index how?
      for(var i = 0; i < this.$scope.charts.length; i++)
      {
        if(this.$scope.charts[i].name === 'top-companies')
        {
          chartIndex = i;
          previousChart = angular.copy(this.$scope.charts[i]);
          break;
        }
      }

      //Hardcoded example to fetch a drilldown bsed on a target label value
      //TODO: Create a dynamic approach for all charts
      this.companyService.drilldown('top-companies', target).then(function(response){
        self.$scope.charts[chartIndex].labels = response.data.chartLabels;
        self.$scope.charts[chartIndex].data = response.data.chartData;
        self.$scope.charts[chartIndex].title = response.data.chartTitle;
        self.$scope.charts[chartIndex].previousChart = previousChart;
        self.$scope.charts[chartIndex].hasDrilldown = false;
      },
      function(error){

      });
    }
  },

  /*
   * This can be used to update all our charts which
   * rely on a specific year... for this example,
   * we're updating a specific chart
   */
  updateYear: function(year){
    console.log('here');
    var thisIndex,
        self = this;
    for(var i = 0; i < this.$scope.charts.length; i++)
    {
      if(this.$scope.charts[i].name === 'fundingrounds')
      {
        thisIndex = i;
        break;
      }
    }

    //TODO: Refactor, this is called in init() - extract into function
    //Retrieve data for the number of final funding rounds per month by specific year
    this.companyService.getFinalFundingByMonth(year).then(function(response){
      if(response.data)
      {
        self.$scope.charts[thisIndex] = {
          labels: response.data.chartLabels,
          data: response.data.chartData,
          title: response.data.chartTitle,
          type: 'Bar',
          name: 'fundingrounds'
        };
      }
      else
      {
        //No data found
      }
    });
  },

  /*
   * Loop to create our valid year ranges within the data
   */
  yearsAvailable: function(){
    var years = [];
    for(var i = 2014; i > 1902; i--)
    {
      years.push(i);
    }
    return years;
  }
};

angular
  .module('myApp.dashboard', [])
  .controller('dashboardCtrl', dashboardCtrl)
  .config(dashboardConfig);

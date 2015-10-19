'use strict';
  
  function companyService($http, ENDPOINT_API){
    this.$http = $http;
    this.ENDPOINT_API = ENDPOINT_API;
  };

  companyService.prototype = {
    getCompanies: function(){
      return this.$http.get(this.ENDPOINT_API+'companies/top10');
    },
    getAverageFinalFunding: function(){
      return this.$http.get(this.ENDPOINT_API+'companies/funding/yearly');
    },
    drilldown: function(type, value){
      return this.$http.get(this.ENDPOINT_API+'drilldown/'+type+'/'+value);
    },
    getFinalFundingByMonth: function(year){
      return this.$http.get(this.ENDPOINT_API+'companies/fundingrounds/yearly/'+year);
    },
    getTrendingMarketsByCountry: function(country){
      return this.$http.get(this.ENDPOINT_API+'companies/trending/country/'+country);
    }
  };

angular
  .module('myApp.services', [])
  .service('companyService', companyService);
<?php
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

  /*
   * Slim Framework bootstrap file
   */
  require 'vendor/autoload.php';

  /*
   * Manually created database file, initializes connection and stores
   * the PDO instance in $pdo
   */
  require 'database.php';
  $dbh = new DatabaseHandler();


  /*
   * And awaaaaay we go!
   */
  $app = new \Slim\Slim();


  /*
   * API REST Settings
   */
  $app->response->headers->set('Content-Type', 'application/json');

  $app->group('/companies', function($categories = array()) use ($dbh, $app){

    /*
     * Get list of top 10 companies by country code 
     */
    $app->get('/top10(/:categories+)', function($categories = array()) use ($dbh, $app){
      $companies = $dbh->companies($categories);
      if($companies)
      {
        $app->response()->setStatus(200);
        $app->response()->write(json_encode($companies));
      }
      else
      {
        $app->response()->setStatus(400);
        $app->response()->write('No results found');
      }
    });

    /*
     *  Get average funding for the last 10 years
     */
    $app->get('/funding/yearly(/:categories+)', function($categories = array()) use ($dbh, $app){
      
      $funding = $dbh->companiesFundingYearly($categories);
      if($funding)
      {
        $app->response()->setStatus(200);
        $app->response()->write(json_encode($funding));
      }
      else
      {
        $app->response()->setStatus(400);
        $app->response()->write('No results found');
      }
    });

    /* 
     * Get trending market percentages by country
     */
    $app->get('/trending/country/:country(/:categories+)', function($country, $categories = array()) use ($dbh, $app){
      $trends = $dbh->getTrendingMarketsByCountry($country);
      if($trends)
      {
        $app->response()->setStatus(200);
        $app->response()->write(json_encode($trends));
      }
      else
      {
        $app->response()->setStatus(400);
        $app->response()->write('No results found');
      }
    });

    /*
     *  Get number of funding rounds according to final funding round given
     *  broken down by month for a specific year
     */
    $app->get('/fundingrounds/yearly/:year(/:categories+)', function($year = 2014, $categories = array()) use ($dbh, $app){
      $rounds = $dbh->fundingRoundsPerYear($year);
      if($rounds)
      {
        $app->response()->setStatus(200);
        $app->response()->write(json_encode($rounds));
      }
      else
      {
        $app->response()->setStatus(400);
        $app->response()->write('No results found');
      }
    });

  });


  $app->group('/drilldown', function($categories = array()) use ($dbh, $app){

    /*
     * Get drilldown of top 10 states/provinces on selected country
     */
    $app->get('/top-companies/:country(/:categories+)', function($country, $categories = array()) use ($dbh, $app){
      $states = $dbh->topStatesByCountry($country, $categories);
      if($states)
      {
        $app->response()->setStatus(200);
        $app->response()->write(json_encode($states));
      }
      else
      {
        $app->response()->setStatus(400);
        $app->response()->write('No results found');
      }
    });

  });
    



  $app->get('/', function(){
    $app->response()->setStatus(404);
    $app->response()->write(json_encode('Invalid URL request'));
  });

  $app->run();
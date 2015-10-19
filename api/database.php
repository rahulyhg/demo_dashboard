<?php

/*
 * Handles database connection, settings and queries
 */
class DatabaseHandler {

  private $name = 'intouch_crunchbase_monthly';
  private $host = 'localhost';
  private $user = 'root';
  private $password = '';
  private $connection;

  public function __construct()
  {
    try
    {
      $this->connection = new PDO('mysql:host='.$this->host.';dbname='.$this->name, $this->user, $this->password, array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ));
    }
    catch(Exception $e)
    {
      return FALSE;
    } 
  }

  public function companies($categories = array())
  {
    $sql = "SELECT COUNT(*) AS countryCount, strCountryCode AS countryCode 
    FROM entCompany 
    GROUP BY strCountryCode 
    ORDER BY countryCount DESC 
    LIMIT 10";

    $results = $this->_chartQuery($sql);

    $formattedData = array(
      'chartLabels' => array(),
      'chartData' => array(array()),
      'chartTitle' => 'Top 10 Countries Company Count'
    );

    $resultCount = count($results);
    for($i = 0; $i < $resultCount; $i++)
    {
      array_push($formattedData['chartLabels'], $results[$i]['countryCode']);
      array_push($formattedData['chartData'][0], $results[$i]['countryCount']);
    }

    return $formattedData;
  }

  public function getTrendingMarketsByCountry($country, $cateogires = array())
  {
    $sql = "SELECT ROUND(COUNT(strMarket) * 100 / (SELECT COUNT(*) FROM entCompany WHERE strCountryCode = :country), 2) AS marketPercent, strMarket AS market FROM entCompany
      WHERE strCountryCode = :country
      AND strMarket <> ''
      GROUP BY market, strCountryCode
      ORDER BY marketPercent DESC
      LIMIT 7";

    $data = array(
      "country" => $country
      );

    $results = $this->_chartQuery($sql, $data);

    $formattedData = array(
      'chartLabels' => array(),
      'chartData' => array(),
      'chartTitle' => 'Trending Markets - '.$country.' (%)'
    );
    $resultCount = count($results);
    for($i = 0; $i < $resultCount; $i++)
    {
      array_push($formattedData['chartLabels'], $results[$i]['market']);
      array_push($formattedData['chartData'], $results[$i]['marketPercent']);
    }

    return $formattedData;    
  }

  public function companiesFundingYearly($categories = array())
  {
    $sql = "SELECT AVG(bntFunding) AS averageFunding, YEAR(dttLastFunding) AS lastFundingYear 
    FROM entCompany AS entc
    WHERE YEAR(dttLastFunding) < '2015'
    GROUP BY lastFundingYear 
    ORDER BY lastFundingYear DESC
    LIMIT 10";

    $results = $this->_chartQuery($sql);

    $formattedData = array(
      'chartLabels' => array(),
      'chartData' => array(array()),
      'chartTitle' => 'Avg. Final Funding/Year ($)'
    );

    $resultCount = count($results);
    for($i = 0; $i < $resultCount; $i++)
    {
      $funds = number_format($results[$i]['averageFunding'], 2, '.', '');
      array_push($formattedData['chartLabels'], $results[$i]['lastFundingYear']);
      array_push($formattedData['chartData'][0], $funds);
    }

    $formattedData['chartLabels'] = array_reverse($formattedData['chartLabels']);
    $formattedData['chartData'][0] = array_reverse($formattedData['chartData'][0]);

    return $formattedData;
  }

  public function topStatesByCountry($country, $categories = array())
  {
    $sql = "SELECT COUNT(*) AS stateCount, strStateCode AS stateCode 
    FROM entCompany 
    WHERE strCountryCode = :country
    GROUP BY strStateCode 
    ORDER BY stateCount DESC 
    LIMIT 10";

    $data = array(
      "country" => $country
      );

    $results = $this->_chartQuery($sql, $data);

    $formattedData = array(
      'chartLabels' => array(),
      'chartData' => array(array()),
      'chartTitle' => 'Top 10 States/Provinces ('.$country.')'
    );

    $resultCount = count($results);
    for($i = 0; $i < $resultCount; $i++)
    {
      array_push($formattedData['chartLabels'], $results[$i]['stateCode']);
      array_push($formattedData['chartData'][0], $results[$i]['stateCount']);
    }

    return $formattedData;
  }

  public function fundingRoundsPerYear($year, $categories = array())
  {
    $sql = "SELECT SUM(intFundingRounds) AS fundingRounds, MONTH(dttLastFunding) AS fundingMonth FROM entCompany
    WHERE YEAR(dttLastFunding) = :year
    GROUP BY fundingMonth
    ORDER BY MONTH(dttLastFunding) ASC";

    $data = array(
      "year" => $year
      );

    $results = $this->_chartQuery($sql, $data);

    $formattedData = array(
      'chartLabels' => array(),
      'chartData' => array(array()),
      'chartTitle' => 'Final Fundings By Year ('.$year.')'
    );

    $resultCount = count($results);
    for($i = 0; $i < $resultCount; $i++)
    {
      array_push($formattedData['chartLabels'], date('M', mktime(0, 0, 0, $results[$i]['fundingMonth'], 1)));
      array_push($formattedData['chartData'][0], $results[$i]['fundingRounds']);
    }

    return $formattedData;
  }

  public function _chartQuery($sql = '', $data = array())
  {
    if($sql === '') return FALSE;

    try
    {
      $stmt = $this->connection->prepare($sql);
      $stmt->execute($data);
      $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

      if($results)
      {
        return $results;
      }
      else
      {
        return FALSE;
      }
    }
    catch(PDOException $e)
    {
      echo "<PRE>";
      print_r($e->errorInfo);
      exit;
      return FALSE;
    }
  }
}
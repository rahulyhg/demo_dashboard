<?php

  $file = new SplFileObject('crunchbase_monthly_cleaned.csv');
  echo "<PRE>";

  $sqlRaw = "INSERT INTO entCompany (strCompanyName, strCompanyUrl, strMarket, bntFunding, strStatus, strCountryCode, strStateCode, intFundingRounds, dttFounded, dttFirstFunding, dttLastFunding)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

  $sqlCategories = "INSERT INTO lkpCategory (strCategory) VALUES (?)";
  $sqlRel = "INSERT INTO relCompanyCategory (intCompanyID, intCategoryID) VALUES (?, ?)";
  $setCompSql = "SET @companyId = last_insert_id();";
  $setCatSql = "SET @categoryId = last_insert_id();";
  
  $allCategories = array();

  $dbh = new PDO('mysql:host=localhost;dbname=intouch_crunchbase_monthly', 'root', '');
  $dbh->beginTransaction();
  $globalCounter = 0;

  $companyStatement = $dbh->prepare($sqlRaw);

  $file->seek(1);
  while(!$file->eof())
  {
    $_ = $file->current();

    $sql = $sqlRaw;

    if($_ !== '')
    {
      $arr = array_map('trim', explode(",", $_));

      $count = count($arr);

      $categories = array();

      $sql .= '(';
      $tempSql = '';

      for($i = 0; $i < $count; $i++)
      {
        if(!is_numeric($arr[4]))
        {
          $arr[4] = 0;
        }

        if($i === 2)
        {
          if($arr[$i] != '')
          {
            $matches = array();
            $regex = "/\|(.*?)\|/";
            if(preg_match_all($regex, $arr[$i], $matches))
            {
              $categories = $matches[1];
              $cc = count($categories);
              for($x = 0; $x < $cc; $x++)
              {
                array_push($allCategories, $categories[$x]);
              }
            } 
          }
          unset($arr[2]);
          $arr = array_values($arr);
        }
      }
      $arr[8] = date("Y-m-d", strtotime($arr[8]));
      $arr[9] = date("Y-m-d", strtotime($arr[9]));
      $arr[10] = date("Y-m-d", strtotime($arr[10]));

      if($companyStatement->execute($arr) !== false)
      {
        // echo 'yes';
      }
      else
      {
        echo 'failed'."\r\n";
        print_r($arr);
        $dbh->rollback();
      }

      $lastId = $dbh->lastInsertId();      
      $companyIds[] = $lastId;

      if($categories)
      {
        $companyCategories[$lastId] = $categories;
      }

    }

    $file->next();
  }

  $categoryStatement = $dbh->prepare($sqlCategories);
  $allCategories = array_values(array_unique($allCategories));
  foreach($allCategories as $category)
  {
    if($categoryStatement->execute(array($category)) !== false)
    {
      $catId = $dbh->lastInsertId();
      $categoryId[$category] = $catId;
    }
    else
    {
      echo "error: ".$category;
      exit;
    }
  }

  $relStatement = $dbh->prepare($sqlRel);

  foreach($companyCategories as $compId => $compCats)
  {
    foreach($compCats as $compCat)
    {
      $data = array($compId, $categoryId[$compCat]);
      if($relStatement->execute($data) !== false)
      {
        // echo "yes\r\n";
      }
      else
      {
        $dbh->rollback();
        print_r($data);
        exit;
      }
    }
  }
$dbh->commit();
echo 'done';
exit;
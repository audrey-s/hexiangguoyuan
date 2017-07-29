<?php
    header('Content-type:application/json');
    @$start=$_REQUEST['start'];
    if(empty($start)){
        $start=0;
    }
    require('init.php');
    $sql="SELECT did,name,price,img_sm,material FROM kw_dish LIMIT $start,5 ";
    $result=mysqli_query($conn,$sql);
    //var_dump($result);
    $output=[];
    //fetch_all(php 7.0才支持)
    while(true){
      $row=mysqli_fetch_assoc($result);
      if(!$row){
        break;
      }
      $output[]=$row;
    }
    echo json_encode($output);
?>
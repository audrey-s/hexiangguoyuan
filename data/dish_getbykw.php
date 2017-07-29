<?php
    header('Content-type:application/json');
    @$kw=$_REQUEST['kw'];
    if(empty($kw)){
        echo '[]';
        return;
    }
    require('init.php');
    $sql="SELECT did,name,price,img_sm,material FROM kw_dish WHERE name LIKE '%$kw%' or material LIKE '%$kw%'";
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
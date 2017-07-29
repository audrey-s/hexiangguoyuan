<?php
    header('Content-type:application/json');
    @$phone=$_REQUEST['phone'];
    if(empty($phone)){
        echo '[]';
        return;
    }
    require('init.php');
    $sql="SELECT d.img_sm,o.order_time,o.user_name,o.oid,o.did FROM kw_dish d,kw_order o WHERE d.did=o.did AND phone='$phone'";
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
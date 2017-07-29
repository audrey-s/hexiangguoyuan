<?php
    header('Content-type:application/json');
    @$did=$_REQUEST['did'];
    if(empty($did)){
        echo '[]';
        return;
    }
    require('init.php');
    $sql="SELECT did,name,price,img_lg,material,detail FROM kw_dish WHERE did=$did";
    $result=mysqli_query($conn,$sql);
//    var_dump($result);
    $output=[];
    //fetch_all(php 7.0才支持)
    $row=mysqli_fetch_assoc($result);
    if(empty($row)){
        echo '[]';
    }else{
        $output[]=$row;
        echo json_encode($output);
    }
?>
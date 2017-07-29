<?php
/**
*查询指定用户的购物车内容
*请求参数：
  uid-用户ID，必需
*输出结果：
  {
    "uid": 1,
    "data":[
      {"cid":1,"title":"xxx","pic":"xxx","price":1599.00,'courseCount':1},
      {"cid":3,"title":"xxx","pic":"xxx","price":1599.00,'courseCount':3},
      ...
      {"cid":5,"title":"xxx","pic":"xxx","price":1599.00,'courseCount':5}
    ]
  }
*/
header('Content-type:application/json');
@$uid = $_REQUEST['uid'] or die('uid required');

require('init.php');

$output['uid'] = $uid;

$sql = "SELECT kw_cart.ctid,kw_cart.did,kw_cart.dishCount,kw_dish.name,kw_dish.img_sm,kw_dish.price FROM kw_dish,kw_cart WHERE kw_cart.did=kw_dish.did AND kw_cart.userid='$uid'";
$result = mysqli_query($conn,$sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);


echo json_encode($output);
?>
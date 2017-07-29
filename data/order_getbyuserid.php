<?php
/**根据用户id查询订单数据**/
header('Content-Type:application/json');

$output = [];

@$userid = $_REQUEST['userid'];

if(empty($userid)){
    echo "[]"; //若客户端未提交用户id，则返回一个空数组，
    return;    //并退出当前页面的执行
}

//访问数据库
require('init.php');

$sql = "SELECT kw_order.oid,kw_order.userid,kw_order.phone,kw_order.addr,
kw_order.totalprice,kw_order.user_name,kw_order.order_time,
kw_orderdetails.did,kw_orderdetails.dishcount,kw_orderdetails.price,
kw_dish.name,kw_dish.img_sm

 from kw_order,kw_orderdetails,kw_dish
WHERE kw_order.oid = kw_orderdetails.oid and kw_orderdetails.did = kw_dish.did and kw_order.userid='$userid'";
$result = mysqli_query($conn, $sql);

$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);
?>

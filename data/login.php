<?php
  header("Content-Type:application/json;charset=utf-8");
  //*必须的参数 uname upwd
  @$uname = $_REQUEST['uname']or die('{"code":-2,"msg":"用户名不以为空"}');
  @$upwd = $_REQUEST['upwd']or die('{"code":-3,"msg":"密码不以为空"}');
  require("init.php");
  $sql = " SELECT id FROM t_login WHERE uname='$uname' AND upwd='$upwd'";
  $result = mysqli_query($conn,$sql); 
  $rows = mysqli_fetch_assoc($result);
  if($rows===null){
    echo '{"code":-1,"msg":"用户名或密码错误"}';
  }else{
	$id = $rows['id'];
	$output = ["code"=>1,"msg"=>"登录成功","uname"=>$uname,"id"=>$id];
	echo json_encode($output);
  }
?>
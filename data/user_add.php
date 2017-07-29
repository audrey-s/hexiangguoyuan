<?php
	header("Content-type:text/html;charset=utf8");
	//必须的参数：uname upwd
	@$uname=$_REQUEST['uname']or die('用户名是必须的');
	@$upwd=$_REQUEST['upwd']or die('密码是必须的');
	require('init.php');
	$sql="SELECT * FROM t_login WHERE uname='$uname'";
	$result=mysqli_query($conn,$sql);
	$rows = mysqli_fetch_assoc($result);
	if($rows===null){
		$sql="INSERT INTO t_login VALUES(null,'$uname','$upwd')";
		$result=mysqli_query($conn,$sql);
		if($result==true){
			echo "注册成功";
		}else{
			echo "注册失败";
		}
	}else{
		echo "此用户名太受欢迎了，请您更换";
	}
?>
//创建kiwi模块,依赖于ionic模块，其中ionic底层依赖于ng
var app = angular.module('kiwi',['ionic']);
//配置路由状态
app.config(function($ionicConfigProvider,$stateProvider,$urlRouterProvider){
    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider.state('detail',{url:'/detail/:did',templateUrl:'tpl/detail.html',controller:'detailCtrl'})
                .state('main',{url:'/main',templateUrl:'tpl/main.html',controller:'mainCtrl'})
                .state('myorder',{url:'/myorder',templateUrl:'tpl/myorder.html',controller:'myorderCtrl'})
                .state('order',{url:'/order/:price',templateUrl:'tpl/order.html',controller:'orderCtrl'})
                .state('start',{url:'/start',templateUrl:'tpl/start.html'})
                .state('setting',{url:'/setting',templateUrl:'tpl/setting.html',controller:'settingCtrl'})
                .state('cart',{url:'/cart',templateUrl:'tpl/cart.html',controller:'cartCtrl'})
                .state('login',{url:'/login',templateUrl:'tpl/login.html',controller:'loginCtrl'})
                .state('intro',{url:'/intro',templateUrl:'tpl/intro.html'});
    $urlRouterProvider.otherwise('/start');
});

//封装服务:每发起网络请求，必须有个加载中的遮盖层，从而避免出现空白
app.service('$wikiHttp',['$ionicLoading','$http',function ($ionicLoading,$http) {
    this.sendRequest= function (url,func) {
        $ionicLoading.show({
            template:'加载中,亲，请稍等☺'
        });
        $http.get(url).success(function (data) {
                func(data);
                $ionicLoading.hide();
            })
    }
}]);
//创建body控制器，封装页面跳转功能
app.controller('bodyCtrl',['$scope','$state',function($scope,$state){
    $scope.jump = function(desState,args){
        $state.go(desState,args);
    }
}]);

//main页面控制器配置
app.controller('mainCtrl',['$scope','$wikiHttp', function ($scope,$wikiHttp) {
    //初始化数据,避免开始加载为undefined
    $scope.dishList=[];
    $scope.hasMore=true;
    //打开页面，就开始加载数据
    $wikiHttp.sendRequest('data/dish_getbypage.php', function (data) {
        $scope.dishList=data;
        console.log(data);
    });
    //点击按钮加载更多数据
    $scope.loadMore= function () {
        $wikiHttp.sendRequest('data/dish_getbypage.php?start='+$scope.dishList.length,function (data) {
            if(data.length<5){
                $scope.hasMore=false;
            }
            $scope.dishList=$scope.dishList.concat(data);
           // console.log(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    //模糊查询数据
    $scope.inputTxt={kw:''};
    $scope.$watch('inputTxt.kw', function (newValue,oldValue) {
        if(newValue.length>0){
            $wikiHttp.sendRequest('data/dish_getbykw.php?kw='+newValue, function (data) {
                if(data.length>0){
                    $scope.dishList=data;
                }
            })
        }
    })
}]);

//注册loginCtrl
app.controller('loginCtrl',['$scope','$stateParams','$wikiHttp','$ionicPopup','$httpParamSerializerJQLike','$timeout',function ($scope,$stateParams,$wikiHttp,$ionicPopup,$httpParamSerializerJQLike,$timeout){
    $scope.isRegister=true;
    $scope.user={
        uname:'',
        upwd:''
    }
    $scope.jumpToReg=function(){
        $scope.isRegister=false;
    }
    $scope.jumpToLog=function(){
        $scope.isRegister=true;
    }
    $scope.loginToKw=function(){
        var usermsg = $httpParamSerializerJQLike($scope.user);
        //console.log(usermsg);
        $wikiHttp.sendRequest('data/login.php?'+usermsg,function(data){
            console.log(data);
            $ionicPopup.alert({
                title:'登录页面',
                template:data.msg
            }).then(function(){
                if(data.msg=="登录成功"){
                    $timeout(function(){
                        $scope.jump('main');
                        sessionStorage.setItem('id',data.id);
                    },1000)
                }
            })
        })
    };
    $scope.registerToKw=function(){
        $scope.isRegister=false;
        var usermsg = $httpParamSerializerJQLike($scope.user);
        //console.log(usermsg);
        $wikiHttp.sendRequest('data/user_add.php?'+usermsg,function(data){
            //console.log(data);
            $ionicPopup.alert({
                title:'注册页面',
                template:data
            })
        })
    }
}]);

//为detail页面创建控制器
app.controller('detailCtrl',['$scope','$stateParams','$wikiHttp','$ionicPopup',function ($scope,$stateParams,$wikiHttp,$ionicPopup) {
    $wikiHttp.sendRequest('data/dish_getbyid.php?did='+$stateParams.did, function (data) {
        $scope.myDetail=data[0];
    });
    $scope.addToCart= function () {
        if(sessionStorage.id){
            $wikiHttp.sendRequest('data/cart_update.php?count=-1&uid='+sessionStorage.id+'&did='+$stateParams.did,function (result) {
                if(result.msg=="succ"){
                    $ionicPopup.confirm({
                        title:'购物车提醒窗口',
                        template:'亲，添加购物车成功'
                    })
                }
            });
        }else{
            $ionicPopup.alert({
                title:'提醒窗口',
                template:'亲，您还尚未登录，系统将自动跳转到登录页面'
            }).then(function(){
                $scope.jump('login');
            })

        }

    }
}]);

//为order页面创建控制器
app.controller('orderCtrl',['$scope','$stateParams','$wikiHttp','$httpParamSerializerJQLike', function ($scope,$stateParams,$wikiHttp,$httpParamSerializerJQLike) {
    $scope.submitResult='';
    $scope.order={
                    userid:sessionStorage.id,
                    phone:'',
                    user_name:'',
                    addr:'',
                    totalprice:$stateParams.price,
                    cartDetail:sessionStorage.cartDetail
                };
    //console.log($stateParams);
    $scope.succ=true;
    $scope.addMore= function () {
        //验证当前用户输入数据的完整性
        var result = $httpParamSerializerJQLike($scope.order);
        //console.log(result);
        $wikiHttp.sendRequest('data/order_add.php?'+result, function (data) {
            if(data){
                if(data[0].msg=="succ"){
                    $scope.submitResult=data[0].reason+'! 您的订单编号为：'+data[0].oid;
                    $scope.succ=false;
                }else if(data[0].msg=="error"){
                    $scope.submitResult=data[0].reason;
                }
            }

        });
    }
}]);

//为myorder页面设置控制器
app.controller('myorderCtrl',['$scope','$wikiHttp', function ($scope,$wikiHttp) {
    $scope.myList=[];
    $wikiHttp.sendRequest('data/order_getbyuserid.php?userid='+sessionStorage.id, function (result) {
        console.log(result);
         $scope.myList=result.data;
     })
}]);

//settingCtrl
app.controller('settingCtrl',['$scope','$ionicModal', function ($scope,$ionicModal) {
    $scope.offLine=function(){
        $scope.jump('login');
        sessionStorage.setItem('id','');
    }

    $ionicModal.fromTemplateUrl('tpl/my_modal.html',{
        scope:$scope,
        animation:'slide-in-up'
    }).then(function (modal) {
        $scope.modal=modal;
    });
    $scope.openModel= function () {
        $scope.modal.show();
    }
    $scope.closeModel= function () {
        $scope.modal.hide();
    }
}]);


//cartCtrl
app.controller('cartCtrl',['$scope','$wikiHttp','$ionicPopup', function ($scope,$wikiHttp,$ionicPopup) {
    $scope.cart=[ ];
    $scope.editText='编辑';
    $scope.editEnabled=true;
//编辑和完成切换功能
    $scope.toggleEdit= function () {
        if($scope.editEnabled){
            $scope.editText='完成';
            $scope.editEnabled=false;
        }else{
            $scope.editText='编辑';
            $scope.editEnabled=true;
        }
    }
    //进入页面开始请求购物车内容
    $wikiHttp.sendRequest('data/cart_select.php?uid='+sessionStorage.id, function (result) {
        //console.log(result);
        $scope.cart=result.data;
    })

    //定义一个方法：保存购物车详情并跳转
    $scope.saveAndJump= function () {
        sessionStorage.setItem('cartDetail',angular.toJson($scope.cart));
        $scope.jump('order',{price:$scope.sumALL()});
    }

    //计算总和
    $scope.sumALL= function () {
        var totalPrice=0;
        for(var i=0;i<$scope.cart.length;i++){
            var dish=$scope.cart[i];
            totalPrice+=(dish.price*dish.dishCount);
        }
        return  totalPrice;
    }
//+ - 功能:无论从购物车 加 或者减 都需要请求服务，因此可以封装一个方法
    //单独封装一个方法：
    $scope.minusFromCart= function (index) {
        //先通知服务端更新数据count，然后再更改视图
        var count=$scope.cart[index].dishCount;
        if(count>1){
            count--;
            $wikiHttp.sendRequest('data/cart_update.php?uid='+sessionStorage.id+'&did='+$scope.cart[index].did+'&count='+count, function () {
                //更改视图
                $scope.cart[index].dishCount--;
                //$ionicPopup.confirm({
                //    template:'更新成功'
                //})
            })
        }
    }
//+ 功能:
    $scope.plusToCart= function (index) {
        var count = $scope.cart[index].dishCount;
        count++;
        $wikiHttp.sendRequest('data/cart_update.php?uid='+sessionStorage.id+'&did='+$scope.cart[index].did+'&count='+count, function () {
            $scope.cart[index].dishCount++;
            //$ionicPopup.confirm({
            //    template:'更新成功'
            //})
        })
    }

//删除购物车记录功能
    $scope.deleteFromCart=function(ctid,index){
        $ionicPopup.alert({
            title:'警告窗口',
            template:'确定删除此产品吗？',
            okText:'好的',
            okType:'button-calm'
        }).then(function(result){
            if(result){
                $wikiHttp.sendRequest('data/cart_delete.php?ctid='+ctid,function(){
                    //更改视图
                    $scope.cart.splice(index,1);
                    //console.log(index);
                    //console.log($scope.cart);
                })
            }
        })
    }
}]);


 //实现上下左右的滑动，能够打印出往左右滑动的动作
        var panel = $('#panel');
        //console.log(panel);
        panel.on('swipeUp', function () {
            console.log("swipeUp is called");
        });
        panel.on('swipeDown', function () {
            console.log("swipeDown is called");
        });
        panel.on('swipeRight', function () {
            console.log("swipeRight is called");
        });
        panel.on('swipeLeft', function () {
            console.log("swipeLeft is called");
        });
        //阻止默认事件
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        },false);
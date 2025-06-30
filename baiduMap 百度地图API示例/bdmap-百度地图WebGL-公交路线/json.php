<?php  
    header('Content-type:text/json;charset=utf-8');  
    $username=$_POST['username'];  
    //$password=$_POST['password'];  
      
    //也可以在成功插入数据库后再赋值success  在这里不具体写出来，只是做一个简单判断后赋值  
    if($username==""){  
        $su="";  
    }else{  
        $su="success";//给su赋值“success”;  
    }  
      
   $data='{su:"' . $su .'"}';//只返回su变量值来判断是否注册成功，其它值不返回  
   //$data='{username:"' . $username . '",password:"' . $password .'",su:"' . $su .'"}';//所有值都返回  
   echo json_encode($data);  
?>  
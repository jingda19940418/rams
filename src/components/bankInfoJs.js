const $ = require('jquery');
const axios = require('axios');
var oldForm_data;
var oldForm_dataJson;
var newForm_data;
var newForm_dataJson;

export function onload(){
  var onloadMol = {};
  onloadMol["employeeOrCustomerNo"] = $("#employeeOrCustomerNo").val();
  onloadMol["accountBelongsStatus"] = $("#accountBelongsStatus").val();
  onloadMol["shoriKbn"] = $("#shoriKbn").val();
    axios.post("http://127.0.0.1:8080/bankInfo/getBankInfo",onloadMol)
    .then(function (resultMap) {
      var bankName = {};
      bankName = resultMap.data.accountInfoMod.bankName;
      for(let i = 0;i<bankName.length ; i++){
        $("#bankCode").append('<option value="'+(i+1)+'">'+resultMap.data.accountInfoMod.bankName[i]+'</option>');
      }
      if(resultMap.data.accountInfoMod != ''){
        $("#bankBranchName").val(resultMap.data.accountInfoMod["bankBranchName"]);
        $("#bankBranchCode").val(resultMap.data.accountInfoMod["bankBranchCode"]);
        $("#accountNo").val(resultMap.data.accountInfoMod["accountNo"]);
        $("#accountName").val(resultMap.data.accountInfoMod["accountName"]);
        $("#bankCode").val(resultMap.data.accountInfoMod["bankCode"]);   
        if(resultMap.data.accountInfoMod["accountBelongsStatus"] != null && resultMap.data.accountInfoMod["accountBelongsStatus"] != ''){
          $("#accountBelongsStatus").val(resultMap.data.accountInfoMod["accountBelongsStatus"]);
        }
        if(resultMap.data.accountInfoMod["accountTypeStatus"] === '0'){
          $("#futsu").attr("checked",true);
        }else if(resultMap.data.accountInfoMod["accountTypeStatus"] === '1'){
          $("#toza").attr("checked",true);
        }
        if($("#shoriKbn").val() === 'shusei'){
          $("#bankBranchName").attr("readonly",false);
          $("#bankBranchCode").attr("readonly",false);
          $("#accountNo").attr("readonly",false);
          $("#accountName").attr("readonly",false);
          $("#futsu").attr("disabled",false);
          $("#toza").attr("disabled",false);
          oldForm_data = $("#bankForm").serializeArray();
          oldForm_dataJson = JSON.stringify({ dataform: oldForm_data });
        }else if($("#shoriKbn").val() === "tsuika"){
          $("#bankBranchName").attr("readonly",true);
          $("#bankBranchCode").attr("readonly",true);
          $("#accountNo").attr("readonly",true);
          $("#accountName").attr("readonly",true);
          $("#bankCode").val('0'); 
          $("#futsu").attr("disabled",true);
          $("#toza").attr("disabled",true);
        }else if($("#shoriKbn").val() === "shosai"){
          setAllDisabled();
        }
      }
    })
    .catch(function (error) {
      alert("銀行名错误，请检查程序");
    });  
}
export function canSelect(){
	var val = $("#bankCode").val();
    // $("#bankBranchName").attr("readonly",true);
    // $("#bankBranchCode").attr("readonly",true);
    // $("#accountNo").attr("readonly",true);
    // $("#accountName").attr("readonly",true);
    // $("#futsu").attr("disabled",true);
    // $("#toza").attr("disabled",true);
    // $("#toza").attr("disabled",true);
	if(val != 0){
        $("#bankBranchName").attr("readonly",false);
        $("#bankBranchCode").attr("readonly",false);
        $("#accountNo").attr("readonly",false);
        $("#accountName").attr("readonly",false);
        $("#futsu").attr("disabled",false);
        $("#toza").attr("disabled",false);
        $("#futsu").attr("checked",true);
    }else{
        $("#bankBranchName").attr("readonly",true);
        $("#bankBranchCode").attr("readonly",true);
        $("#accountNo").attr("readonly",true);
        $("#accountName").attr("readonly",true);
        $("#futsu").attr("disabled",true);
        $("#toza").attr("disabled",true);
        $("#futsu").attr("checked",true);
    }
    $("#bankBranchName").val("");
    $("#bankBranchCode").val("");
    $("#accountNo").val("");
    $("#accountName").val("");
    $("#futsu").attr("checked",true);
}
export function setDisabled(){
    $("#bankBranchName").attr("readonly",true);
    $("#bankBranchCode").attr("readonly",true);
    $("#accountNo").attr("readonly",true);
    $("#accountName").attr("readonly",true);
    $("#futsu").attr("disabled",true);
    $("#toza").attr("disabled",true);
    $('#futsu').attr("checked",true);
}
export function checkAccountName(){
  var katakana = /^[ァ-ロワヲンー]*$/;//片仮名の正規表現
  var accountName = document.getElementById("accountName");
  
  if(!katakana.test(accountName.value)){
    accountName.className += " border-danger";
    // document.getElementById("tips").className = "show";
    return false;
  }else{
    accountName.className = " form-control";
    // document.getElementById("tips").className = "hidden";
    return true;
  }
}
export function getBankBranchInfo(noORname){
  var pra = {};
  pra[noORname] = $('#'+noORname+'').val();
  pra["bankCode"] = $('#bankCode').val();
  if($('#'+noORname+'').val() != ""){
    
    axios.post("http://127.0.0.1:8080/bankInfo/getBankBranchInfo",pra)
      .then(function (resultMap) {
        if(resultMap.data != ''){
            $('#bankBranchCode').val(resultMap.data["bankBranchCode"]);
            $('#bankBranchName').val(resultMap.data["bankBranchName"]);
        }else{
          $('#bankBranchCode').val("");
          $('#bankBranchName').val("");
        }
        
      })
      .catch(function (error) {
        alert("支店信息获取错误，请检查程序");
      });
  }else{
    $('#bankBranchCode').val("");
    $('#bankBranchName').val("");
  }
}
// 登录按钮
export function tokuro(){
  newForm_data = $("#bankForm").serializeArray();
  newForm_dataJson = JSON.stringify({ dataform: newForm_data });
  var result = checkAccountName();
  if(newForm_dataJson != oldForm_dataJson && result){
    var bankCol = {};
    var formArray =$("#bankForm").serializeArray();
    $.each(formArray,function(i,item){
      bankCol[item.name] = item.value;     
    });
    bankCol["shoriKbn"] = $("#shoriKbn").val();
    bankCol["updateUser"] = $("#employeeNo").val();
    axios.post("http://127.0.0.1:8080/bankInfo/toroku", bankCol)
    .then(function (result) {
      
      if(result.data == true){
        alert("登录完成");
        window.location.reload();
      }else{
        alert("登录失败");
      }
    })
    .catch(function (error) {
      alert("登录错误，请检查程序");
    });
  }else{
    if(newForm_dataJson == oldForm_dataJson){
      alert("修正してありません!");
    }else if(!checkAccountName()){
      document.getElementById("bankInfoErorMsg").style = "visibility:visible";
      document.getElementById("bankInfoErorMsg").innerHTML = "口座名義人をカタカナで入力してください"
    }
  }   
}
export function setAllDisabled(){
  $("#bankBranchName").attr("disabled",true);
  $("#bankBranchCode").attr("disabled",true);
  $("#accountNo").attr("disabled",true);
  $("#accountName").attr("disabled",true);
  $("#bankCode").attr("disabled",true);
  $("#futsu").attr("disabled",true);
  $("#toza").attr("disabled",true);
  $("#toroku").attr("disabled",true);
  $("#reset").attr("disabled",true);
}
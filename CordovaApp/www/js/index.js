/**
* Copyright 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
//var busyIndicator = null;
var currenciesList = null;

var Messages = {
    // Add here your messages for the default language.
    // Generate a similar file with a language suffix containing the translated messages.
    // key1 : message1,
};

var wlInitOptions = {
    // Options to initialize with the WL.Client object.
    // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

//***************************************************
// wlCommonInit
// - Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
//***************************************************
function wlCommonInit(){
  document.getElementById("JsToJsButton").addEventListener("click", getCurrenciesList_JsToJs, false);
  document.getElementById("JavaToJsButton").addEventListener("click", getCurrenciesList_JavaToJS, false);
  document.getElementById("JavaToJavaButton").addEventListener("click", getCurrenciesList_JavaToJava, false);
  document.getElementById("calculate").addEventListener("click", calculate, false);
  getCurrenciesList_JsToJs();
}

//***************************************************
// getCurrenciesList_JsToJs
//***************************************************
function getCurrenciesList_JsToJs(){
  var resourceRequest = new WLResourceRequest("/adapters/SQLAdapterJS/getCurrenciesList", WLResourceRequest.GET, 3000);
  resourceRequest.send()
  .then(
    function(response){
		var resultSet = response.responseJSON.resultSet;
  		if (resultSet.length == 0)
			alert("resultSet is empty");
		else {
			currenciesList = resultSet;
			fillCurrenciesLists();
		}
	},
    function(errorResponse){
		alert("getListFailure\n"+ JSON.stringify(errorResponse));
	}
  );
  switchButtonsFocus("JsToJsButton");
}

//***************************************************
// getCurrenciesList_JavaToJS
//***************************************************
function getCurrenciesList_JavaToJS(){
	alert("getCurrenciesList_JavaToJS");
}

//***************************************************
// getCurrenciesList_JavaToJava
//***************************************************
function getCurrenciesList_JavaToJava(){
	alert("getCurrenciesList_JavaToJava");
}

//***************************************************
// fillCurrenciesLists
//***************************************************
function fillCurrenciesLists(){
	document.getElementById("fromCurrencyList").options.length=0;
	document.getElementById("toCurrencyList").options.length=0;
	
	for (var i = 0; i < currenciesList.length; i++) {
		if(currenciesList[i].id == 3){ // Euro
			document.getElementById("fromCurrencyList").options[i] = new Option(currenciesList[i].name, currenciesList[i].id, false, true);
		}
		else{
			document.getElementById("fromCurrencyList").options[i] = new Option(currenciesList[i].name, currenciesList[i].id, false, false);
		}
		
		if(currenciesList[i].id == 5){ // USD (US Dollar)
			document.getElementById("toCurrencyList").options[i] = new Option(currenciesList[i].name, currenciesList[i].id, false, true);
		}
		else{
			document.getElementById("toCurrencyList").options[i] = new Option(currenciesList[i].name, currenciesList[i].id, false, false);
		}
	}
}

//***************************************************
// calculate
//***************************************************
function calculate(){	
	var fromCurrencyId = document.getElementById('fromCurrencyList').value;
	var toCurrencyId = document.getElementById('toCurrencyList').value;
	var amount = document.getElementById("amount").value
	
	if(amount == null || amount == "" || isNaN(amount)) {
		alert("Please enter a valid amount");
	}
	else {
		var resourceRequest = new WLResourceRequest("/adapters/SQLAdapterJS/getExchangeRate", WLResourceRequest.GET, 3000);
		resourceRequest.setQueryParameter("params", "['"+ fromCurrencyId +"','"+ toCurrencyId +"']");
  		resourceRequest.send().then(
    	// Success
		function(response){
			var fromCurrencySymbol = response.responseJSON.base;
			var toCurrencySymbol = Object.keys(response.responseJSON.rates)[0];
			var exchangeRate = eval("response.responseJSON.rates."+ Object.keys(response.responseJSON.rates)[0]);
			var sum = parseFloat(exchangeRate) * parseFloat(amount);
			var resultStr = "<b>"+ parseFloat(amount).toFixed(2) + "</b> " + fromCurrencySymbol 
							+ "<br>=<br><b>" 
							+ sum.toFixed(2) + "</b> " + toCurrencySymbol;
			document.getElementById("resultDiv").innerHTML = resultStr;
		},
		// Failure
    	function(errorResponse){
			alert("getExchangeRate Failure\n"+ JSON.stringify(errorResponse));
		})	
	}	
}

//***************************************************
// switchButtonsFocus
//***************************************************
/* This function changes the current button color to indicate the current adapter mashup */
function switchButtonsFocus(ButtonId){
    /* JS -> JS */
	if(ButtonId == "JsToJsButton"){
    	if($('#JsToJsButton').hasClass("AdapterTypeButton")){
    		$('#JsToJsButton').removeClass("AdapterTypeButton").addClass("AdapterTypeButtonSelected");
    		$('#subTitle').html("(JS adapter -> JS adapter)");
    	}
    	if($('#JavaToJsButton').hasClass("AdapterTypeButtonSelected")){
    		$('#JavaToJsButton').removeClass("AdapterTypeButtonSelected").addClass("AdapterTypeButton");
    	}
    	if($('#JavaToJavaButton').hasClass("AdapterTypeButtonSelected")){
    		$('#JavaToJavaButton').removeClass("AdapterTypeButtonSelected").addClass("AdapterTypeButton");
    	}
    }
	/* Java -> JS */
    else if(ButtonId == "JavaToJsButton"){
    	if($('#JavaToJsButton').hasClass("AdapterTypeButton")){
    		$('#JavaToJsButton').removeClass("AdapterTypeButton").addClass("AdapterTypeButtonSelected");
    		$('#subTitle').html("(Java adapter -> JS adapter)");
    	}
    	if($('#JsToJsButton').hasClass("AdapterTypeButtonSelected")){
    		$('#JsToJsButton').removeClass("AdapterTypeButtonSelected").addClass("AdapterTypeButton");
    	}
    	if($('#JavaToJavaButton').hasClass("AdapterTypeButtonSelected")){
    		$('#JavaToJavaButton').removeClass("AdapterTypeButtonSelected").addClass("AdapterTypeButton");
    	}
    }
	/* Java -> Java */
    else if(ButtonId == "JavaToJavaButton"){
    	if($('#JavaToJavaButton').hasClass("AdapterTypeButton")){
    		$('#JavaToJavaButton').removeClass("AdapterTypeButton").addClass("AdapterTypeButtonSelected");
    		$('#subTitle').html("(Java adapter -> Java adapter)");
    	}
    	if($('#JsToJsButton').hasClass("AdapterTypeButtonSelected")){
    		$('#JsToJsButton').removeClass("AdapterTypeButtonSelected").addClass("AdapterTypeButton");
    	}
    	if($('#JavaToJsButton').hasClass("AdapterTypeButtonSelected")){
    		$('#JavaToJsButton').removeClass("AdapterTypeButtonSelected").addClass("AdapterTypeButton");
    	}
    }
}

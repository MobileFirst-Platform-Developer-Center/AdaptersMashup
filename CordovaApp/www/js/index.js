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

var currenciesList = null;
var CURRENT_FLOW = "JsToJs";
// CURRENT_FLOW optional values are:
// 		JsToJs (JavaScript Adapter -> JavaScript Adapter),
// 		JavaToJs (Java Adapter -> JavaScript Adapter),
// 		JavaToJava (Java Adapter -> Java Adapter)

var Messages = {};
var wlInitOptions = {};

//***************************************************
// wlCommonInit
// - Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
//***************************************************
function wlCommonInit() {
    document.getElementById("JsToJsButton").addEventListener("click", function() {
        getCurrenciesList("JsToJs");
    }, false);
    document.getElementById("JavaToJsButton").addEventListener("click", function() {
        getCurrenciesList("JavaToJs");
    }, false);
    document.getElementById("JavaToJavaButton").addEventListener("click", function() {
        getCurrenciesList("JavaToJava");
    }, false);
    document.getElementById("calculate").addEventListener("click", calculate, false);
    getCurrenciesList("JsToJs");
}

//***************************************************
// getCurrenciesList
//***************************************************
function getCurrenciesList(flow) {
    CURRENT_FLOW = flow;
    switchButtonsFocus();
    var resourceRequest;
    if (CURRENT_FLOW == "JsToJs") {
        resourceRequest = new WLResourceRequest("/adapters/SQLAdapterJS/getCurrenciesList", WLResourceRequest.GET, 3000);
    } else {
        resourceRequest = new WLResourceRequest("/adapters/SQLAdapterJava/getCurrenciesList", WLResourceRequest.GET, 3000);
    }
    resourceRequest.send().then(
        // Success
        function(response) {
            currenciesList = response.responseJSON;
            if (currenciesList.length === 0)
                navigator.notification.alert("currenciesList is empty");
            else {
                fillCurrenciesLists();
            }
        },
        // Failure
        function(errorResponse) {
            navigator.notification.alert("getListFailure\n" + JSON.stringify(errorResponse));
        }
    );
}

//***************************************************
// fillCurrenciesLists
//***************************************************
function fillCurrenciesLists() {
    document.getElementById("fromCurrencyList").options.length = 0;
    document.getElementById("toCurrencyList").options.length = 0;

    for (var i = 0; i < currenciesList.length; i++) {
        document.getElementById("fromCurrencyList").options[i] = new Option(currenciesList[i].name, currenciesList[i].id, false, false);
        document.getElementById("toCurrencyList").options[i] = new Option(currenciesList[i].name, currenciesList[i].id, false, false);
        if (currenciesList[i].id == 3) { // Euro
            document.getElementById("fromCurrencyList").options[i].selected = true;
        } else if (currenciesList[i].id == 5) { // USD (US Dollar)
            document.getElementById("toCurrencyList").options[i].selected = true;
        }
    }
}

//***************************************************
// calculate
//***************************************************
function calculate() {
    var fromCurrencyId = document.getElementById('fromCurrencyList').value;
    var toCurrencyId = document.getElementById('toCurrencyList').value;
    var amount = document.getElementById("amount").value;

    if (amount === null || amount === "" || isNaN(amount)) {
        navigator.notification.alert("Please enter a valid amount");
    } else {
        var resourceRequest;
        // Java Adapter -> Java Adapter
        if (CURRENT_FLOW == "JavaToJava") {
            resourceRequest = new WLResourceRequest("/adapters/SQLAdapterJava/getExchangeRate_JavaToJava", WLResourceRequest.GET, 3000);
            resourceRequest.setQueryParameter("fromCurrencyId", fromCurrencyId);
            resourceRequest.setQueryParameter("toCurrencyId", toCurrencyId);
        }
        // Java Adapter -> JS Adapter
        else if (CURRENT_FLOW == "JavaToJS") {
            resourceRequest = new WLResourceRequest("/adapters/SQLAdapterJava/getExchangeRate_JavaToJS", WLResourceRequest.GET, 3000);
            resourceRequest.setQueryParameter("fromCurrencyId", fromCurrencyId);
            resourceRequest.setQueryParameter("toCurrencyId", toCurrencyId);
        }
        // JS Adapter -> JS Adapter
        else {
            resourceRequest = new WLResourceRequest("/adapters/SQLAdapterJS/getExchangeRate", WLResourceRequest.GET, 3000);
            resourceRequest.setQueryParameter("params", "['" + fromCurrencyId + "','" + toCurrencyId + "']");
        }
        resourceRequest.send().then(
            // Success
            function(response) {
                var exchangeRate = response.responseJSON.exchangeRate;
                var total = parseFloat(exchangeRate) * parseFloat(amount);
                fillResultDiv(amount, response.responseJSON.base, "visible", total.toFixed(2), response.responseJSON.target);
            },
            // Failure
            function(errorResponse) {
                navigator.notification.alert("getExchangeRate Failure\n" + JSON.stringify(errorResponse));
            });
    }
}

//***************************************************
// switchButtonsFocus
//***************************************************
/* This function changes the current button color to indicate the current adapter mashup */
function switchButtonsFocus() {
    fillResultDiv("", "", "hidden", "", ""); // Clear previous results
    document.getElementById("amount").value = "1"; // Reset the amount text field to 1

    // JS Adapter -> JS Adapter
    if (CURRENT_FLOW == "JsToJs") {
        document.getElementById("JsToJsButton").className = "AdapterTypeButtonSelected";
        document.getElementById("JavaToJsButton").className = "AdapterTypeButton";
        document.getElementById("JavaToJavaButton").className = "AdapterTypeButton";
    }

    // Java Adapter -> JS Adapter
    else if (CURRENT_FLOW == "JavaToJs") {
        document.getElementById("JsToJsButton").className = "AdapterTypeButton";
        document.getElementById("JavaToJsButton").className = "AdapterTypeButtonSelected";
        document.getElementById("JavaToJavaButton").className = "AdapterTypeButton";
    }

    // Java Adapter -> Java Adapter
    else if (CURRENT_FLOW == "JavaToJava") {
        document.getElementById("JsToJsButton").className = "AdapterTypeButton";
        document.getElementById("JavaToJsButton").className = "AdapterTypeButton";
        document.getElementById("JavaToJavaButton").className = "AdapterTypeButtonSelected";
    }
}

//***************************************************
// fillResultDiv
//***************************************************
function fillResultDiv(amount, from_symbol, seperatorVisibility, to_amount, to_symbol){
    document.getElementById("fromAmount").innerHTML = amount;
    document.getElementById("fromSymbol").innerHTML = from_symbol;
    document.getElementById("resultDivLineSeperator").style.visibility = seperatorVisibility;
    document.getElementById("toAmount").innerHTML = to_amount;
    document.getElementById("toSymbol").innerHTML = to_symbol;
}

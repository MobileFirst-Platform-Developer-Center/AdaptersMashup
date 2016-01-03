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
var busyIndicator = null;
var citiesList = null;

var Messages = {
    // Add here your messages for the default language.
    // Generate a similar file with a language suffix containing the translated messages.
    // key1 : message1,
};

var wlInitOptions = {
    // Options to initialize with the WL.Client object.
    // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

// Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
function wlCommonInit(){
  //busyIndicator = new WL.BusyIndicator("AppBody"); -- Removed in 8.0!!!!!!!!!!
  $('#citiesList').change(citySelectionChange);
  getCitiesList_JsToJs();

  document.getElementById('app_version').textContent = WL.Client.getAppProperty("APP_VERSION");
  document.getElementById('mobilefirst').setAttribute('style', 'display:block;');
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, 'app.receivedEvent(...);' must be explicitly called.
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update the DOM on a received event.
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

//***************************************************
// JS adapter -> JS adapter
//***************************************************
function getCitiesList_JsToJs() {
	//busyIndicator.show();
  window.plugins.spinnerDialog.show(null, "Loading...");
	var resourceRequest = new WLResourceRequest("/adapters/getCitiesListJS/getCitiesWeather", WLResourceRequest.GET, 30000);
	resourceRequest.send().then(
		getCitiesListSuccess,
		getCitiesListFailure
	);
	switchButtonsFocus("JsToJsButton");
}

//***************************************************
// Java adapter -> JS adapter
//***************************************************
function getCitiesList_JavaToJs() {
	//busyIndicator.show();
  window.plugins.spinnerDialog.show(null, "Loading...");
	var resourceRequest = new WLResourceRequest("/adapters/getCitiesListJavaToJs/getCitiesList_JavaToJs", WLResourceRequest.GET, 30000);
	resourceRequest.send().then(
		getCitiesListSuccess,
		getCitiesListFailure
	);
	switchButtonsFocus("JavaToJsButton");
}

//***************************************************
// Java adapter -> Java adapter
//***************************************************
function getCitiesList_JavaToJava() {
	//busyIndicator.show();
  window.plugins.spinnerDialog.show(null, "Loading...");
	var resourceRequest = new WLResourceRequest("/adapters/getCitiesListJava/getCitiesList_JavaToJava", WLResourceRequest.GET, 30000);
	resourceRequest.send().then(
		getCitiesListSuccess,
		getCitiesListFailure
	);
	switchButtonsFocus("JavaToJavaButton");
}

//***************************************************
// getCitiesListSuccess (resourceRequest success)
//***************************************************
function getCitiesListSuccess(response) {
	/* The response from JS adapters is different from the response that we receive from our Java adapters,
	 * JS adapters return response.responseJSON.resultSet while Java adapters return only response.responseJSON
	 * So first we check the response to decide what is the resultSet that we wish to use.
	 */
	if(response.responseJSON.resultSet != "undefined" && response.responseJSON.resultSet != null){
		var resultSet = response.responseJSON.resultSet;
	}
	else{
		var resultSet = response.responseJSON;
	}

	if (resultSet.length == 0)
		getCitiesListFailure();
	else {
		citiesList = resultSet;
		fillCitiesList();
	}
}

//***************************************************
// getCitiesListFailure (resourceRequest failure)
//***************************************************
function getCitiesListFailure(response) {
	WL.Logger.debug("CityWeather::getCitiesListFailure");
	busyIndicator.hide();
	WL.SimpleDialog.show("CityWeather",
			"Can't get cities list. Check database connection", [ {
				text : 'Reload app',
				handler : WL.Client.reloadApp
			} ]);
}

//***************************************************
// fillCitiesList
//***************************************************
/* This function fills the cities select drop-down box with the received cities-list */
function fillCitiesList(){
	$('#citiesList').empty();
	for (var i = 0; i < citiesList.length; i++) {
		var elem = $("<option/>").html(citiesList[i].city);
		$('#citiesList').append(elem);
	}
	busyIndicator.hide();
	citySelectionChange();
}

//***************************************************
// citySelectionChange
//***************************************************
/* This function changes the content of the page after the selected city has been changed */
function citySelectionChange() {
	var index = $('#citiesList').prop("selectedIndex");
	var citySumm = citiesList[index].summary;
	var cityWeather = citiesList[index].weather;
	$('#info').html(cityWeather + "<br>" + citySumm.slice(0, 200) + "...");
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
    		$('#subTitle').html("(Js adapter -> JS adapter)");
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

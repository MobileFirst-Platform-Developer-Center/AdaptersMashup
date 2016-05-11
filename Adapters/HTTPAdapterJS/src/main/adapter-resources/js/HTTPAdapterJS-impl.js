/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * @param tag: a topic such as MobileFirst_Platform, Bluemix, Cordova.
 * @returns json list of items.
 */


 function getExchangeRate(fromCurrencySymbol, toCurrencySymbol){
    var input = {
        method : 'get',
    	returnedContentType : 'json',
    	path : getPath(fromCurrencySymbol, toCurrencySymbol)
    };

    return MFP.Server.invokeHttp(input);
 }

 function getPath(from, to){
    return "/latest?base="+ from + "&symbols="+ to;
 }
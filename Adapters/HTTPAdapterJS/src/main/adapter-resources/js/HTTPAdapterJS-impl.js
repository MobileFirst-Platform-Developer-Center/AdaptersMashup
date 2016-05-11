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

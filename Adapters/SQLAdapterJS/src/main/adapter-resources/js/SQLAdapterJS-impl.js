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

//****************************************
// getCurrenciesList
//****************************************
var getCurrenciesListStatement = "SELECT id, symbol, name FROM currencies;";

function getCurrenciesList() {
	return MFP.Server.invokeSQLStatement({
		preparedStatement : getCurrenciesListStatement,
		parameters : []
	});
}

//****************************************
// getCurrencySymbol
//****************************************
var getCurrencySymbolStatement = "SELECT symbol FROM currencies where id=?;";

function getCurrencySymbol(currency_id) {
	return MFP.Server.invokeSQLStatement({
		preparedStatement : getCurrencySymbolStatement,
		parameters: [currency_id]
	});
}

//****************************************
// getExchangeRate
//****************************************
function getExchangeRate(fromId, toId){
    base = getCurrencySymbol(fromId).resultSet[0].symbol;
    exchangeTo = getCurrencySymbol(toId).resultSet[0].symbol;
		ExchangeRate = null;

		if(base == exchangeTo){
			ExchangeRate = 1;
		}
		else {
			var fixerExchangeRateJSON =  MFP.Server.invokeProcedure({
	    	adapter : 'HTTPAdapterJS',
	    	procedure : 'getExchangeRate',
	    	parameters : [base, exchangeTo]
	    });
			ExchangeRate = eval("fixerExchangeRateJSON.rates."+ exchangeTo);
		}

    return {"base":base, "target":exchangeTo, "exchangeRate":ExchangeRate};
}

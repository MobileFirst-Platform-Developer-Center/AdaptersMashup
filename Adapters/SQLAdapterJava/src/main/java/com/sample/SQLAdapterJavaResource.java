/**
 * Copyright 2016 IBM Corp.
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

package com.sample;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import com.ibm.mfp.adapter.api.AdaptersAPI;
import com.ibm.mfp.adapter.api.ConfigurationAPI;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Path("/")
public class SQLAdapterJavaResource {

	@Context
	AdaptersAPI adaptersAPI;

	@Context
	ConfigurationAPI configurationAPI;

	public Connection getSQLConnection() throws SQLException {
		// Create a connection object to the database
		SQLAdapterJavaApplication app = adaptersAPI.getJaxRsApplication(SQLAdapterJavaApplication.class);
		return app.dataSource.getConnection();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getCurrenciesList")
	public JSONArray getCurrenciesList() throws SQLException, IOException {
		JSONArray jsonArr = new JSONArray();

		Connection conn = getSQLConnection();
		PreparedStatement getAllCities = conn.prepareStatement("select id, symbol, name from currencies");
		ResultSet rs = getAllCities.executeQuery();
		while (rs.next()) {
			/* Putting the currency info in a JSONObject */
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("id", rs.getString("id"));
			jsonObj.put("symbol", rs.getString("symbol"));
			jsonObj.put("name", rs.getString("name"));

			/* Adding the JSONObject to a JSONArray that will be returned to the application */
			jsonArr.add(jsonObj);
		}
		rs.close();
		conn.close();
		return jsonArr;
	}

	private String getCurrencySymbol(Integer currency_id) throws SQLException, IOException {
		String symbol = null;
		Connection conn = getSQLConnection();
		PreparedStatement getSymbol = null;
		getSymbol = conn.prepareStatement("select symbol from currencies where id="+ currency_id);
		ResultSet rs = getSymbol.executeQuery();
		while (rs.next()) {
			symbol = rs.getString("symbol");
		}
		rs.close();
		conn.close();
		return symbol;
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getExchangeRate_JavaToJava")
	public JSONObject getExchangeRate_JavaToJava(@QueryParam("fromCurrencyId") Integer fromCurrencyId, @QueryParam("toCurrencyId") Integer toCurrencyId) throws SQLException, IOException{
		String base = getCurrencySymbol(fromCurrencyId);
		String exchangeTo = getCurrencySymbol(toCurrencyId);
		Double ExchangeRate = null;

		if(base.equals(exchangeTo)){
			ExchangeRate = 1.0;
		}
		else{
			//ExchangeRate = 2.0;
			String getFixerIOInfoProcedureURL = "/HTTPAdapterJava?fromCurrency="+ URLEncoder.encode(base, "UTF-8") +"&toCurrency="+ URLEncoder.encode(exchangeTo, "UTF-8");
			HttpUriRequest req = new HttpGet(getFixerIOInfoProcedureURL);
			HttpResponse response = adaptersAPI.executeAdapterRequest(req);
			JSONObject jsonExchangeRate = adaptersAPI.getResponseAsJSON(response);
			JSONObject rates = (JSONObject)jsonExchangeRate.get("rates");
			ExchangeRate = (Double) rates.get(exchangeTo);
		}

		JSONObject jsonObj = new JSONObject();
		jsonObj.put("base", base);
		jsonObj.put("target", exchangeTo);
		jsonObj.put("exchangeRate", ExchangeRate);

		return jsonObj;
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getExchangeRate_JavaToJS")
	public JSONObject getExchangeRate_JavaToJS(@QueryParam("fromCurrencyId") Integer fromCurrencyId, @QueryParam("toCurrencyId") Integer toCurrencyId) throws SQLException, IOException{
		String base = getCurrencySymbol(fromCurrencyId);
		String exchangeTo = getCurrencySymbol(toCurrencyId);
		Double ExchangeRate = null;

		if(base.equals(exchangeTo)){
			ExchangeRate = 1.0;
		}
		else{
			HttpUriRequest req = adaptersAPI.createJavascriptAdapterRequest("HTTPAdapterJS", "getExchangeRate", URLEncoder.encode(base, "UTF-8"), URLEncoder.encode(exchangeTo, "UTF-8"));
			org.apache.http.HttpResponse response = adaptersAPI.executeAdapterRequest(req);
			JSONObject jsonExchangeRate = adaptersAPI.getResponseAsJSON(response);
			JSONObject rates = (JSONObject)jsonExchangeRate.get("rates");
			ExchangeRate = (Double) rates.get(exchangeTo);
		}

		JSONObject jsonObj = new JSONObject();
		jsonObj.put("base", base);
		jsonObj.put("target", exchangeTo);
		jsonObj.put("exchangeRate", ExchangeRate);

		return jsonObj;
	}
}

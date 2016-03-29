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
import org.apache.http.client.methods.HttpUriRequest;

import java.net.URLEncoder;
import java.sql.*;
import java.io.IOException;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;



@Path("/")
public class GetCitiesListJavaToJSResource {

	@Context
	AdaptersAPI adaptersAPI;

	@Context
	ConfigurationAPI configurationAPI;

	public Connection getSQLConnection() throws SQLException{
		// Create a connection object to the database
		GetCitiesListJavaToJSApplication app = adaptersAPI.getJaxRsApplication(GetCitiesListJavaToJSApplication.class);
		return app.dataSource.getConnection();
	}

	@GET
	@Path("/getCitiesList_JavaToJS")
	public String JavaToJs() throws SQLException, IOException{
		JSONArray jsonArr = new JSONArray();

		// Run SQL Query
		Connection conn = getSQLConnection();
		PreparedStatement getAllCities = conn.prepareStatement("select city, identifier, summary from weather");
		ResultSet rs = getAllCities.executeQuery();
		while (rs.next()) {
			/* Calling a JavaScript HTTP adapter procedure */
			HttpUriRequest req = adaptersAPI.createJavascriptAdapterRequest("getCityWeatherJS", "getYahooWeather", URLEncoder.encode(rs.getString("identifier"), "UTF-8"));
			org.apache.http.HttpResponse response = adaptersAPI.executeAdapterRequest(req);
			JSONObject jsonWeather = adaptersAPI.getResponseAsJSON(response);

			/* iterating through the response to get only the weather as string (query.results.channel.item.description) */
			JSONObject query = (JSONObject) jsonWeather.get("query");
			JSONObject results = (JSONObject) query.get("results");
			JSONObject channel = (JSONObject) results.get("channel");
			JSONObject item = (JSONObject) channel.get("item");
			String cityWeatherSummary = (String) item.get("description");

			/* Putting the current city results into a JSONObject */
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("city", rs.getString("city"));
			jsonObj.put("identifier", rs.getString("identifier"));
			jsonObj.put("summary", rs.getString("summary"));
			jsonObj.put("weather", cityWeatherSummary);

			/* Adding the current JSONObject to a JSONArray that will be returned to the application */
			jsonArr.add(jsonObj);
		}
		conn.close(); // Close Database connection
		return jsonArr.toString();
	}
}

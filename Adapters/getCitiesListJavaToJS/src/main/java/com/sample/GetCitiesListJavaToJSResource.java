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
import org.apache.commons.dbcp.BasicDataSource;
import org.apache.http.client.methods.HttpUriRequest;

import java.net.URLEncoder;
import java.sql.*;
import java.util.List;
import java.util.logging.Logger;
import java.io.IOException;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;


@Path("/")
public class GetCitiesListJavaToJSResource {
	/*
	 * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	//Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(GetCitiesListJavaToJSResource.class.getName());

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

			/* iterating through the response to get only the weather as string (rss.channel.item.description) */
			JSONObject rss = (JSONObject) jsonWeather.get("rss");
			JSONObject channel = (JSONObject) rss.get("channel");
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

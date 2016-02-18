/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
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
public class GetCitiesListJavaToJsResource {
	/*
	 * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */
		
	//Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(GetCitiesListJavaToJsResource.class.getName());
	private static BasicDataSource ds = null;
	private static String DB_url = null;
	private static String DB_username = null;
	private static String DB_password  = null;

	@Context
	AdaptersAPI adaptersAPI;

	@Context
	ConfigurationAPI configurationAPI;

	public Connection getSQLConnection(){
		Connection conn = null;
		if(updatedProperties() || ds == null){
			ds= new BasicDataSource();
			ds.setDriverClassName("com.mysql.jdbc.Driver");
			ds.setUrl(configurationAPI.getPropertyValue("DB_url"));
			ds.setUsername(configurationAPI.getPropertyValue("DB_username"));
			ds.setPassword(configurationAPI.getPropertyValue("DB_password"));
		}
		try {
			conn = ds.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}

	private boolean updatedProperties() {
		// Check if the properties were changed during runtime (in the console)
		String last_url = DB_url;
		String last_username = DB_username;
		String last_password  = DB_password;

		DB_url = configurationAPI.getPropertyValue("DB_url");
		DB_username = configurationAPI.getPropertyValue("DB_username");
		DB_password = configurationAPI.getPropertyValue("DB_password");

		return !DB_url.equals(last_url) ||
				!DB_username.equals(last_username) ||
				!DB_password.equals(last_password);
	}

	@GET
	@Path("/getCitiesList_JavaToJs")
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

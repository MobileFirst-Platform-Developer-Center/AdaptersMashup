/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
package com.sample;

import java.net.URLEncoder;
import java.sql.*;
import java.util.logging.Logger;
import java.io.IOException;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import com.ibm.mfp.adapter.api.AdaptersAPI;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import org.apache.commons.dbcp.BasicDataSource;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;

import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

@Path("/")
public class GetCitiesListJavaResource {
	/*
	 * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */
		
	//Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(GetCitiesListJavaResource.class.getName());
	private static BasicDataSource ds = null;
	private static String DB_url = null;
	private static String DB_username = null;
	private static String DB_password  = null;

	@Context
	AdaptersAPI adaptersAPI;

	@Context
	ConfigurationAPI configurationAPI;

	public Connection getSQLConnection(){
		// Create a connection object to the database
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
	@Path("/getCitiesList_JavaToJava")
	public String doGetCitiesList() throws SQLException, IOException{
		// Run a query to get cities data from fatabase + for each city use a JavaScript adapter
		// to fetch data from a weather webservice and put it all in a jsonArray object
		JSONArray jsonArr = new JSONArray();
		String getWeatherInfoProcedureURL = null;

		Connection conn = getSQLConnection();
		PreparedStatement getAllCities = conn.prepareStatement("select city, identifier, summary from weather");
		ResultSet rs = getAllCities.executeQuery();
		while (rs.next()) {
			/* Calling another Java adapter procedure to get the weather of the current city */
			getWeatherInfoProcedureURL = "/getCityWeatherJava?cityId="+ URLEncoder.encode(rs.getString("identifier"), "UTF-8");
			HttpUriRequest req = new HttpGet(getWeatherInfoProcedureURL);
			HttpResponse response = adaptersAPI.executeAdapterRequest(req);
			JSONObject jsonWeather = adaptersAPI.getResponseAsJSON(response);

			/* iterating through the response to get only the weather as string (rss.channel.item.description) */
			JSONObject rss = (JSONObject) jsonWeather.get("rss");
			JSONObject channel = (JSONObject) rss.get("channel");
			JSONObject item = (JSONObject) channel.get("item");
			String weatherSummary = (String) item.get("description");

			/* Putting the current city results in a JSONObject */
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("city", rs.getString("city"));
			jsonObj.put("identifier", rs.getString("identifier"));
			jsonObj.put("summary", rs.getString("summary"));
			jsonObj.put("weather", weatherSummary);

			/* Adding the JSONObject to a JSONArray that will be returned to the application */
			jsonArr.add(jsonObj);
		}
		conn.close();
		return jsonArr.toString();
	}

}

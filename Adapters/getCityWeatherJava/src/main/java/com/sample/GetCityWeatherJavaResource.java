/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package com.sample;

import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.wink.json4j.utils.XML;
import org.xml.sax.SAXException;

import java.nio.charset.Charset;
import java.util.logging.Logger;
import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;


@Path("/")
public class GetCityWeatherJavaResource {
	/*
	 * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */
		
	//Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(GetCityWeatherJavaResource.class.getName());
	private static CloseableHttpClient client;
	private static HttpHost host;

	public static void init() {
		client = HttpClients.createDefault();
		host = new HttpHost("weather.yahooapis.com");
	}

	private String execute(HttpUriRequest req, HttpServletResponse resultResponse) throws ClientProtocolException, IOException, IllegalStateException, SAXException {
		String strOut = null;
		HttpResponse RSSResponse = client.execute(host, req);
		ServletOutputStream os = resultResponse.getOutputStream();
		if (RSSResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
			resultResponse.addHeader("Content-Type", "application/json");
			String json = XML.toJson(RSSResponse.getEntity().getContent());
			os.write(json.getBytes(Charset.forName("UTF-8")));

		}else{
			resultResponse.setStatus(RSSResponse.getStatusLine().getStatusCode());
			RSSResponse.getEntity().getContent().close();
			os.write(RSSResponse.getStatusLine().getReasonPhrase().getBytes());
		}
		strOut = os.toString();
		os.flush();
		os.close();
		return strOut;
	}

	@GET
	@Produces("application/json")
	public String get(HttpServletResponse response, @QueryParam("cityId") String cityId) throws ClientProtocolException, IOException, IllegalStateException, SAXException {
		String returnValue = execute(new HttpGet("/forecastrss?w="+ cityId +"&u=c"), response);
		return returnValue;
	}
		
}

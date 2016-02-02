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
import javax.ws.rs.core.Response;


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

	private Response execute(HttpUriRequest req) throws ClientProtocolException, IOException, IllegalStateException, SAXException {

		HttpResponse RSSResponse = client.execute(host, req);

		if (RSSResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
			String json = XML.toJson(RSSResponse.getEntity().getContent());
			return Response.ok().entity(json).build();
		}else{
			RSSResponse.getEntity().getContent().close();
			return Response.status(RSSResponse.getStatusLine().getStatusCode()).entity(RSSResponse.getStatusLine().getReasonPhrase()).build();
		}
	}

	@GET
	@Produces("application/json")
	public Response get(@QueryParam("cityId") String cityId) throws ClientProtocolException, IOException, IllegalStateException, SAXException {
		Response returnValue = execute(new HttpGet("/forecastrss?w="+ cityId +"&u=c"));
		return returnValue;
	}
		
}

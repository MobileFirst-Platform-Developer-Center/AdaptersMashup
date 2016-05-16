/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.sample;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.wink.json4j.utils.XML;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.URLEncoder;

import javax.ws.rs.GET;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

@Path("/")
public class HTTPAdapterJavaResource {
	private String responseAsText = null;
	private static CloseableHttpClient client;
	private static HttpHost host;

	public static void init() {
		client = HttpClients.createDefault();
		host = new HttpHost("api.fixer.io");
	}

	private Response execute(HttpUriRequest req) throws IOException, IllegalStateException, SAXException {
		HttpResponse RSSResponse = client.execute(host, req);

		InputStream content = RSSResponse.getEntity().getContent();
		if (RSSResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
			responseAsText = IOUtils.toString(content, "UTF-8");
			content.close();
			return Response.ok().entity(responseAsText).build();
		}else{
			content.close();
			return Response.status(RSSResponse.getStatusLine().getStatusCode()).entity(RSSResponse.getStatusLine().getReasonPhrase()).build();
		}
	}

	@GET
	@Produces("application/json")
	public Response get(@QueryParam("fromCurrency") String fromCurrency, @QueryParam("toCurrency") String toCurrency) throws IOException, IllegalStateException, SAXException {
		String path = "/latest?base="+ fromCurrency +"&symbols="+ toCurrency;
		return execute(new HttpGet(path));

	}
}

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

import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.wink.json4j.utils.XML;
import org.xml.sax.SAXException;

import java.io.IOException;

import javax.ws.rs.GET;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;


@Path("/")
public class GetCityWeatherJavaResource {

	private static CloseableHttpClient client;
	private static HttpHost host;

	public static void init() {
		client = HttpClients.createDefault();
		host = new HttpHost("weather.yahooapis.com");
	}

	private Response execute(HttpUriRequest req) throws IOException, IllegalStateException, SAXException {

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
	public Response get(@QueryParam("cityId") String cityId) throws IOException, IllegalStateException, SAXException {
		return execute(new HttpGet("/forecastrss?w="+ cityId +"&u=c"));
	}

}

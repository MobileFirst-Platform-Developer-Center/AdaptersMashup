/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package com.sample;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import org.apache.commons.dbcp.BasicDataSource;

import java.util.logging.Logger;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Context;
import java.util.*;


public class GetCitiesListJavaToJSApplication extends Application{

	static Logger logger = Logger.getLogger(GetCitiesListJavaToJSApplication.class.getName());

	@Context
	ConfigurationAPI configurationAPI;

	public BasicDataSource dataSource = null;

	protected void init() throws Exception {
		dataSource= new BasicDataSource();
		dataSource.setDriverClassName("com.mysql.jdbc.Driver");
		dataSource.setUrl(configurationAPI.getPropertyValue("DB_url"));
		dataSource.setUsername(configurationAPI.getPropertyValue("DB_username"));
		dataSource.setPassword(configurationAPI.getPropertyValue("DB_password"));
		logger.info("Adapter initialized!");
	}


	protected void destroy() throws Exception {
		logger.info("Adapter destroyed!");
	}


	protected String getPackageToScan() {
		//The package of this class will be scanned (recursively) to find JAX-RS resources.
		//It is also possible to override "getPackagesToScan" method in order to return more than one package for scanning
		return getClass().getPackage().getName();
	}

		public Set<Class<?>> getClasses() {
			Set<Class<?>> classes = new HashSet<Class<?>>();
			classes.add(GetCitiesListJavaToJSResource.class);
			return classes;
		}
}

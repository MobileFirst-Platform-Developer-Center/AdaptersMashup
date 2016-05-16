/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package com.sample;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.MFPJAXRSApplication;
import org.apache.commons.dbcp.BasicDataSource;

import javax.ws.rs.core.Context;
import java.util.logging.Logger;

public class SQLAdapterJavaApplication extends MFPJAXRSApplication {

	static Logger logger = Logger.getLogger(SQLAdapterJavaApplication.class.getName());
	public BasicDataSource dataSource = null;

	@Context
	ConfigurationAPI configurationAPI;

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
}

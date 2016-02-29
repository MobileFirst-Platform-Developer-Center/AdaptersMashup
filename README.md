IBM MobileFirst Platform Foundation
===
## Adapter Mashup
A sample that demonstrates adapters mashup (passing requests between different adapters paths/procedures).
This sample demonstrates a specific scenario where an SQL adapter collects data from a database, passes the data to an HTTP adapter that calls a Webservice and returns the data accepted from the Webservice.
The demonstration is presented in 3 possible combinations:

1. JavaScript adapter -> JavaScript adapter.
2. Java adapter -> JavaScript adapter.
3. Java adapter -> Java adapter.

### Tutorials
https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/adapters/advanced-adapter-usage-mashup

### Usage

#### SQL setup
An example of city list in SQL is available in the provided adapter maven project (located inside the Cordova project), under `Utils/mobilefirstTraining.sql`. 

1. Run the .sql script in your SQL database.
2. Use either Maven or MobileFirst Developer CLI to [build and deploy the adapters](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/adapters/creating-adapters/).
3. Open the MobileFirst Console
    - Click on the **getCitiesListJS** adapter and update the database connectivity properties.
    - Click on the **getCitiesListJava** adapter and update the database connectivity properties.

#### Application setup

1. From the command line, navigate to the project's root folder.
2. Add a platform by running the `cordova platform add` command.
3. Run the Cordova application by running the `cordova run` command.


### Supported Levels
IBM MobileFirst Platform Foundation 8.0

### License
Copyright 2015 IBM Corp.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

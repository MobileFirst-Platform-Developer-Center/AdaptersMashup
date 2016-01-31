/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015, 2016 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// Public modules
var path = require('path');
var shell = require('shelljs');
var plist = require('plist');
var log = require('npmlog');

// MFP modules
var AfterPrepare = require('./../utils/after-prepare');
var hookConsts = require('./../utils/hook-consts');
var externalizedStrings = require('./../externalizedStrings');
var MFPConfig = require('mfp-config-xml').mfpConfigXMLAPI;
var strings = require('ibm-strings');

/*
This class provides the hook script functionality for after prepare for
iOS.

projDirectory - Path to the project

After the hook is executed, the MFP project will have been prepared.
 */
function IOSAfterPrepare(projectDirectory) {
    var projName;			// Project name
    var mfpConfig;          // MFP configuration
    var projDir;            // Path to project
    var platformDir;        // Path to platform
    var propertiesPath;     // Path to properties
    var pluginDir;          // Path to platform specific plugins
    var that;			    // References this

    AfterPrepare.apply(this);

    that = this;
    projDir = projectDirectory;
    mfpConfig = new MFPConfig(path.join(projDir, hookConsts.CONFIG_XML),
        log.level);
    projName = mfpConfig.getWidgetName();
    platformDir = path.join(projDir, 'platforms', hookConsts.IOS);
    pluginDir = path.join(projDir, hookConsts.WORKLIGHT_DIR_IOS);
    propertiesPath = path.join(platformDir, projName,
        hookConsts.PROPS_PATH_IOS);

    logSilly('Project directory: ' + projDir);
    logSilly('Project name: ' + projName);
    logSilly('Platform directory: ' + platformDir);
    logSilly('Properties path: ' + propertiesPath);
    logSilly('Plugin directory: ' + pluginDir);

    /*
    Displays a log silly message. The log level must be set to silly.

    message - The message to log
     */
    function logSilly(message) {
        log.silly(hookConsts.IOS_AFTER_PREPARE, message);
    }

    /*
    Displays a log verbose message. The log level must be set to verbose.

    message - The message to log
     */
    function logVerbose(message) {
        log.verbose(hookConsts.IOS_AFTER_PREPARE, message);
    }

    /*
	The version from CordovaLib will be copied to Resources.

	An error is thrown if the VERSION file cannot be copied.
	*/
    function updateResourceVersion() {
        logVerbose('Updating resource version.');
        that.copyFile(path.join(platformDir, 'CordovaLib', 'VERSION'),
            path.join(platformDir, projName, 'Resources', 'VERSION'));
    }

    /*
    Updates the mfpclient.plist file with properties regarding the server,
    and app settings.

    An error is thrown of the properties file cannot be written.
	 */
    function updatePropertiesFile() {
        var serverInfo;		// Server information
        var serverURL;		// Server path
        var serverRuntime;	// Server runtime
        var properties;     // iOS properties

        logVerbose('Updating properties file.');

        serverURL = mfpConfig.getMFPServerURL();
        serverRuntime = mfpConfig.getMFPServerRuntime();
        serverInfo = that.parseServerInfo(serverURL, serverRuntime);

        logSilly('Server info: ' + JSON.stringify(serverInfo, null, 2));

        properties = strings.format(hookConsts.MFP_PROPERTIES_IOS,
            serverInfo.protocol,
            serverInfo.host,
            serverInfo.port,
            '/' + serverInfo.context + '/',
            mfpConfig.getWidgetId().replace(/\./g, '_'),
            mfpConfig.getWidgetVersion(),
            mfpConfig.getMFPPlatformVersion().slice(0,-15),
            mfpConfig.getMFPTestWebResources(hookConsts.IOS),
            mfpConfig.getMFPIgnoreFileExtensions(hookConsts.IOS),
            mfpConfig.getMFPDirectUpdateAuthKey(hookConsts.IOS),
            mfpConfig.getMFPLanguagePrefs());

        logSilly('Properties: ' + properties);

        that.writeFile(propertiesPath, properties);
    }

    /*
    Populates static_app_props.js with properties that are inhjected into
    worklight.js when the app boots. The mfpclient.plist must be populated
    before this method is called.

    An error is thrown of hte properties file cannot be read, or if
    static_app_props.js cannot be written.
	 */
    function buildStaticAppProps(preview) {
        var appProps;	// App properties
        var plistInfo;	// plist information
        var content;    // PList content

        logVerbose('Building platform specific static app properties.');

        content = that.readFile(propertiesPath);
        plistInfo = plist.parse(content);

        appProps = {};
        appProps.APP_ID = mfpConfig.getWidgetId().replace(/\./g, '_');
        appProps.APP_VERSION = mfpConfig.getWidgetVersion();
        appProps.WORKLIGHT_PLATFORM_VERSION = plistInfo['platformVersion'] ||
            '';
        appProps.WORKLIGHT_NATIVE_VERSION =
            mfpConfig.getMFPSDKChecksum(hookConsts.IOS);

        if (preview)
            appProps = buildPreviewStaticAppProps(appProps);
        else {
            appProps.ENVIRONMENT = hookConsts.IPHONE;
            appProps.WORKLIGHT_ROOT_URL =
                strings.format(hookConsts.WORKLIGHT_ROOT,
                    hookConsts.APP_SERVICES, appProps.APP_ID,
                    hookConsts.IPHONE);
            appProps.APP_SERVICES_URL = hookConsts.APP_SERVICES;
        }

        logSilly('Platform specific static app properties: ' + appProps);

        that.buildStaticAppProps(appProps,
            path.resolve(projDir, hookConsts.WWW_DIR_IOS,
            hookConsts.STATIC_APP_PROPS_PATH), mfpConfig);
    }

    /*
    Builds Preview specific static app properties. An initialized app
    properties object must be passed. The preview app properties are returned.
     */
    function buildPreviewStaticAppProps(appProps) {
        var serverURL;          // Server URL
        var serverRuntime;      // Server runtime
        var serverInfo;         // Server info object
        var appName;            // Application name
        var runtime;            // Server runtime
        var previewRootURL;     // Root URL for preview

        logVerbose('Building Preview platform specific static app properties');

        serverURL = mfpConfig.getMFPServerURL();
        serverRuntime = mfpConfig.getMFPServerRuntime();
        serverInfo = that.parseServerInfo(serverURL,
            serverRuntime);
        runtime = mfpConfig.getMFPServerRuntime();
        appName = mfpConfig.getWidgetName();
        previewRootURL = serverURL + '/' + runtime + '/';

        logSilly('Server info: ' + JSON.stringify(serverInfo, null, 2));
        logSilly('Runtime: ' + runtime);
        logSilly('App name: ' + appName);
        logSilly('Preview root URL: ' + previewRootURL);

        appProps.ENVIRONMENT = hookConsts.PREVIEW;
        appProps.PREVIEW_ENVIRONMENT = hookConsts.IPHONE;
        appProps.PREVIEW_ROOT_URL = previewRootURL;
        appProps.APP_SERVICES_URL =
            strings.format(hookConsts.PREVIEW_APP_SERVICES, runtime);
        appProps.POSTFIX_APP_SERVICES_URL =  appProps.APP_SERVICES_URL;
        appProps.WORKLIGHT_ROOT_URL =
            strings.format(hookConsts.PREVIEW_WORKLIGHT_ROOT, runtime,
                hookConsts.APP_SERVICES, appName, hookConsts.IPHONE);
        appProps.POSTFIX_WORKLIGHT_ROOT_URL = appProps.WORKLIGHT_ROOT_URL;

        logSilly('Preview app props: ' + JSON.stringify(appProps, null, 2));

        return appProps;
    }

    /*
    Modifies cordova.js so that Cordova will work in a browser. Throws
    exceptions if the cordova.js files cannot be read, or written to.

    An error is thrown if cordova.js cannot be read, or written.
     */
    function modifyCordovaJS() {
        var buf;        // File buffer

        logVerbose('Modifying cordova.js for Preview.');

        buf = that.readFile(path.join(projDir,
            hookConsts.CORDOVA_PATH_IOS));
        buf = buf.replace(hookConsts.PREVIEW_TIMEOUT_ORIG,
            hookConsts.PREVIEW_TIMEOUT);
        buf = buf.replace(hookConsts.PREVIEW_DEVICE_READY_ORIG,
            hookConsts.PREVIEW_DEVICE_READY);
        buf = buf.replace(hookConsts.PREVIEW_WINDOW_TIMEOUT_ORIG,
            hookConsts.PREVIEW_WINDOW_TIMEOUT);
        buf = buf.replace(hookConsts.PREVIEW_POKE_ORIG,
            hookConsts.PREVIEW_POKE);
        buf = buf + '\n';
        buf = buf + that.readFile(path.join(projDir,
                hookConsts.PREVIEW_CORDOVA_PATH_IOS));

        that.writeFile(path.join(projDir, hookConsts.CORDOVA_PATH_IOS), buf);

        logSilly('Preview cordova.js: ' + buf);
    }

    /*
    Replaces worklight.js with one that will work in a browser.

    An error is thrown if worklight.js cannot be copied.
     */
    function modifyWorklightJS() {
        logVerbose('Modifying worklight.js for preview.');

        // Setup fake worklight.js
        that.copyFile(
            path.join(projDir, hookConsts.PREVIEW_WORKLIGHT_PATH_IOS),
            path.join(projDir, hookConsts.WORKLIGHT_PATH_IOS)
        );
    }

    /*
    Updates template files to match the app's characteristics. The templated
    files must exist.

    An error will be thrown if the properties file cannot be read, of if the
    templated files cannot be modified.
	 */
    function updateTemplatedFiles() {
        var plistInfo;			    // plist information
        var wlPlatformVersion;	    // Worklight platform version
        var templateFile;		    // Path to templated file
        var content;                // PList content

        logVerbose('Updating templated files.');

        content = that.readFile(propertiesPath);
        plistInfo = plist.parse(content);

        wlPlatformVersion = plistInfo['platformVersion'] || '';
        templateFile = path.join(platformDir, '.wldata');

        logSilly('Template file path:' + templateFile);
        logSilly('Platform version: ' + wlPlatformVersion);

        try {
            // Log the file contents if level is Silly
            if (log.level === hookConsts.SILLY)
        	    logSilly('Original templated file: ' +
                    that.readFile(templateFile));

        	shell.sed('-i', /platformSourcesVersion.*/g,
                'platformSourcesVersion=' + wlPlatformVersion, templateFile);

            // Log the file contents if level is Silly
            if (log.level === hookConsts.SILLY)
        	    logSilly('Modified templated file: ' +
                    that.readFile(templateFile));
        } catch (err) {
            logVerbose(err);
            throw externalizedStrings.unexpectedErr;
        }
    }

    /*
    Processes config.xml update tags, creates checksum.js, updates VERSION file,
    updates mfpclient.plist file, builds static_app_props.js, updates templated
    files, and updates worklight.js and cordova.js for Preview.

    An error is thrown if the hook fails.
     */
    this.invokeHook = function (preview) {
        var checksum;       // Checksum value
        var checksumPath;   // Path to checksum

        logVerbose('Performing iOS after prepare hook.');
        logSilly('Preview: ' + preview);

        // Skip the hook if this is a platform install
        if (!this.exists(pluginDir)) {
            logVerbose(pluginDir + ' does not exist. Skipping hook.');
            return;
        }

        checksum = mfpConfig.getMFPAppChecksum(hookConsts.IOS);
        checksumPath = path.join(platformDir, hookConsts.CHECKSUM_PATH_IOS);

        try {
        	that.parseUpdates(projDir, platformDir, hookConsts.IOS);
        	that.createChecksumFile(checksum, checksumPath);
        	updateResourceVersion();
        	updatePropertiesFile();
        	buildStaticAppProps(preview);
            updateTemplatedFiles();

            // Perform Preview modifications
            if (preview) {
                modifyWorklightJS();
                modifyCordovaJS();
            }
        } catch (err){
            throw strings.format(externalizedStrings.failedPluginPrepare,
                hookConsts.IOS , err);
        }
    };

}

IOSAfterPrepare.prototype = new AfterPrepare();
module.exports = IOSAfterPrepare;

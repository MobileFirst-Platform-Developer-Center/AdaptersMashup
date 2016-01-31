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
var log = require('npmlog');

// MFP modules
var AfterPrepare = require('./../utils/after-prepare');
var hookConsts = require('./../utils/hook-consts');
var externalizedStrings = require('./../externalizedStrings');
var MFPConfig = require('mfp-config-xml').mfpConfigXMLAPI;
var strings = require('ibm-strings');

/*
This class provides the hook script functionality for after prepare for
Android.

projDirectory - Path to the project

After the hook is executed, the MFP project will have been prepared.
 */
function AndroidAfterPrepare(projectDirectory) {
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
    platformDir = path.join(projDir, 'platforms', hookConsts.ANDROID);
    propertiesPath = path.join(platformDir, hookConsts.PROPS_PATH_ANDROID);
    pluginDir = path.join(projDir, hookConsts.WORKLIGHT_DIR_ANDROID);
    mfpConfig = new MFPConfig(path.join(projDir, 'config.xml'), log.level);
    projName = mfpConfig.getWidgetName();

    logSilly('Project directory: ' + projDir);
    logSilly('Project name: ' + projName);
    logSilly('Properties path: ' + propertiesPath);
    logSilly('Platform directory: ' + platformDir);
    logSilly('Plugin directory: ' + pluginDir);

    /*
    Displays a log silly message. The log level must be set to silly.

    message - The message to log
     */
    function logSilly(message) {
        log.silly(hookConsts.ANDROID_AFTER_PREPARE, message);
    }

    /*
    Displays a log verbose message. The log level must be set to verbose.

    message - The message to log
     */
    function logVerbose(message) {
        log.verbose(hookConsts.ANDROID_AFTER_PREPARE, message);
    }

    /*
    Restores the filelist file to its original location. The filelist file must
    exist in the backup location.

    An error will be thrown if the filelist cannot be restored.
    */
    function restoreFileList() {
        var fileListPath;   // Path of filelist
        var backupPath;     // Path of backup filelist

        logVerbose('Restoring file list.');

        fileListPath = path.join(platformDir,
            hookConsts.FILE_LIST_PATH_ANDROID);
        backupPath = path.join(platformDir, hookConsts.FILE_LIST);

        // Restore the filelist if it exists
        if (that.exists(backupPath))
            that.moveFile(backupPath, fileListPath);
        else
            logVerbose('File does not exists: ' + fileListPath);
    }

    /*
    Updates mfpclient.properties with information about the server, and app
    settings.

    An error will be thrown if the properties cannot be written.
    */
    function updatePropertiesFile() {
        var serverInfo;     // Server information
        var serverURL;      // Server path
        var serverRuntime;  // Server runtime
        var properties;     // Android properties

        logVerbose('Updating properties file.');

        serverURL = mfpConfig.getMFPServerURL();
        serverRuntime = mfpConfig.getMFPServerRuntime();
        serverInfo = that.parseServerInfo(serverURL, serverRuntime);

        logSilly('Server info: ' + JSON.stringify(serverInfo, null, 2));

        properties = strings.format(hookConsts.MFP_PROPERTIES_ANDROID,
            serverInfo.protocol,
            serverInfo.host,
            serverInfo.port,
            '/' + serverInfo.context + '/',
            mfpConfig.getMFPTestWebResources(hookConsts.ANDROID),
            mfpConfig.getMFPIgnoreFileExtensions(hookConsts.ANDROID),
            mfpConfig.getMFPPlatformVersion().slice(0, -15),
            mfpConfig.getMFPDirectUpdateAuthKey(hookConsts.ANDROID),
            mfpConfig.getMFPLanguagePrefs());

        logSilly('Properties: ' + properties);
        that.writeFile(propertiesPath, properties);
    }

    /*
    Populates static_app_props.js  with properties that are injected into
    worklight.js when the app boots. The mfpclient.properties must be populated
    before this method is called.

    An error is thrown if static_app_props.js cannot be written.
    */
    function buildStaticAppProps(preview) {
        var appProps;   // App properties

        logVerbose('Building platform specfic static app properties.');

        appProps = {};
        appProps.APP_ID = mfpConfig.getWidgetId().replace(/\./g, '_');
        appProps.APP_VERSION = mfpConfig.getWidgetVersion();
        appProps.WORKLIGHT_PLATFORM_VERSION =
            getAndroidProperty('wlPlatformVersion', propertiesPath);
        appProps.WORKLIGHT_NATIVE_VERSION =
            mfpConfig.getMFPSDKChecksum(hookConsts.ANDROID);

        if (preview)
            appProps = buildPreviewStaticAppProps(appProps);
        else {
            appProps.ENVIRONMENT = hookConsts.ANDROID;
            appProps.WORKLIGHT_ROOT_URL =
                strings.format(hookConsts.WORKLIGHT_ROOT,
                    hookConsts.APP_SERVICES, appProps.APP_ID,
                    hookConsts.ANDROID);
            appProps.APP_SERVICES_URL = hookConsts.APP_SERVICES;
        }

        logSilly('Platform specific static app properties: ' + appProps);
        that.buildStaticAppProps(appProps, path.resolve(projDir,
            hookConsts.WWW_DIR_ANDROID, hookConsts.STATIC_APP_PROPS_PATH),
            mfpConfig);
    }

    /*
    Builds Preview specific static app properties. An initialized app properties
    object must be passed. The preview app properties are returned.
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
        serverInfo = that.parseServerInfo(serverURL, serverRuntime);
        runtime = mfpConfig.getMFPServerRuntime();
        appName = mfpConfig.getWidgetName();
        previewRootURL = serverURL + '/' + runtime + '/';

        logSilly('Server info: ' + JSON.stringify(serverInfo, null, 2));
        logSilly('Runtime: ' + runtime);
        logSilly('App name: ' + appName);
        logSilly('Preview root URL: ' + previewRootURL);

        appProps.ENVIRONMENT = hookConsts.PREVIEW;
        appProps.PREVIEW_ENVIRONMENT = hookConsts.ANDROID;
        appProps.PREVIEW_ROOT_URL = previewRootURL;
        appProps.APP_SERVICES_URL =
            strings.format(hookConsts.PREVIEW_APP_SERVICES, runtime);
        appProps.POSTFIX_APP_SERVICES_URL = appProps.APP_SERVICES_URL;
        appProps.WORKLIGHT_ROOT_URL =
            strings.format(hookConsts.PREVIEW_WORKLIGHT_ROOT, runtime,
                hookConsts.APP_SERVICES, appName, hookConsts.ANDROID);
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

        buf = hookConsts.ANDROID_POLYFILL;
        buf = buf + that.readFile(path.join(projDir,
                hookConsts.CORDOVA_PATH_ANDROID));
        buf = buf.replace(hookConsts.PREVIEW_TIMEOUT_ORIG,
            hookConsts.PREVIEW_TIMEOUT);
        buf = buf.replace(hookConsts.PREVIEW_DEVICE_READY_ORIG,
            hookConsts.PREVIEW_DEVICE_READY);
        buf = buf.replace(hookConsts.PREVIEW_WINDOW_TIMEOUT_ORIG,
            hookConsts.PREVIEW_WINDOW_TIMEOUT);
        buf = buf + '\n';
        buf = buf + that.readFile(path.join(projDir,
                hookConsts.PREVIEW_CORDOVA_PATH_ANDROID));

        that.writeFile(path.join(projDir, hookConsts.CORDOVA_PATH_ANDROID),
            buf);

        logSilly('Preview cordova.js: ' + buf);
    }

    /*
    Replaces worklight.js with one that will work in a browser.

    An error is thrown if worklight.js cannot be copied.
     */
    function modifyWorklightJS() {
        logVerbose('Modifying worklight.js for preview.');

        // Replace worklight.js with the one for preview
        that.copyFile(path.join(projDir,
            hookConsts.PREVIEW_WORKLIGHT_PATH_ANDROID), path.join(projDir,
            hookConsts.WORKLIGHT_PATH_ANDROID));
    }

    /*
    Updates template files to match the app's characteristics. The templated
    files must exist.

    An error will be thrown if the properties file cannot be read, of if the
    templated files cannot be modified.
     */
    function updateTemplatedFiles() {
        var templateFile;       // File to update
        var wlPlatformVersion;  // MobileFirst platform version

        logVerbose('Updating templated files.');

        wlPlatformVersion = getAndroidProperty('wlPlatformVersion',
            propertiesPath);
        templateFile = path.join(platformDir, '.wldata');

        logSilly('Template file path:' + templateFile);
        logSilly('Platform version: ' + wlPlatformVersion);

        // Log the file contents if level is Silly
        if (log.level === hookConsts.SILLY)
            logSilly('Original templated file: ' + that.readFile(templateFile));

        try {
            shell.sed('-i', /platformSourcesVersion.*/g,
                'platformSourcesVersion=' + wlPlatformVersion,
                templateFile);
        } catch (err) {
            logVerbose(err);
            throw externalizedStrings.unexpectedErr;
        }

        // Log the file contents if level is Silly
        if (log.level === hookConsts.SILLY)
            logSilly('Modified templated file: ' + that.readFile(templateFile));
    }

    /*
    Get Android property from mfpclient.properties The specified property will
    be returned. If the property was not found, a empty string will be returned.

    property - Property to read
    propFile - Properties path

    An error will be thrown if the property cannot be read.
     */
    function getAndroidProperty(property, propFile) {
        var value;  // Resultant property

        try {
            value = shell.grep(property, propFile);
        } catch (err) {
            logVerbose(err);
            throw externalizedStrings.unexpectedErr;
        }

        // The property was not found, return an empty string
        if (!value)
            return '';

        value = value.split('=');

        return value[1].trim();
    }

    /*
    Processes config.xml update tags, creates checksum.js, updates
    mfpclient.properties file, builds static_app_props.js, updates templated
    files, and updates worklight.js and cordova.js for Preview.

    An error is thrown if the hook fails.
    */
    this.invokeHook = function (preview) {
        var checksum;       // Checksum value
        var checksumPath;   // Path to checksum

        logVerbose('Performing Android after prepare hook.');
        logSilly('Preview: ' + preview);

        // Skip the hook if this is a platform install
        if (!this.exists(pluginDir)) {
            logVerbose(pluginDir + ' does not exist. Skipping hook.');
            return;
        }

        checksum = mfpConfig.getMFPAppChecksum(hookConsts.ANDROID);
        checksumPath = path.join(platformDir, hookConsts.CHECKSUM_PATH_ANDROID);

        try {
            this.parseUpdates(projDir, platformDir, hookConsts.ANDROID);
        	this.createChecksumFile(checksum, checksumPath);
        	restoreFileList();
            updatePropertiesFile();
            buildStaticAppProps(preview);
            updateTemplatedFiles();

            // Perform Preview modifications
            if (preview) {
                modifyWorklightJS();
                modifyCordovaJS();
            }
        } catch (err) {
        	throw strings.format(externalizedStrings.failedPluginPrepare,
                hookConsts.ANDROID, err);
		}
    };
}

AndroidAfterPrepare.prototype = new AfterPrepare();
module.exports = AndroidAfterPrepare;

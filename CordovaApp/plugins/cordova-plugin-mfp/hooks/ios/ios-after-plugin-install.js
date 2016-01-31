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
var log = require('npmlog');

// MFP modules
var externalizedStrings = require('./../externalizedStrings');
var hookConsts = require('./../utils/hook-consts');
var Hook = require('./../utils/hook');
var MFPConfig = require('mfp-config-xml').mfpConfigXMLAPI;
var strings = require('ibm-strings');

/*
This class provides the Android hook script functionality for after plugin
install for iOS.

projectDirectory - Path to the project

After the hook is executed, the MFP plugin will have been installed.
 */
function IOSAfterPluginInstall(projectDirectory) {
	var projDir;		// Path to project
	var pluginDir;		// Path to MFP plugin
	var platformDir;	// Path to platform
	var projName;		// Project name
	var mfpConfig;		// MFP configuration
	var that;			// References this

	Hook.apply(this);

	that = this;
	projDir = projectDirectory;
	pluginDir = path.join(projDir, hookConsts.MFP_PLUGIN_DIR);
	platformDir = path.join(projectDirectory, 'platforms', hookConsts.IOS);
	mfpConfig = new MFPConfig(path.join(projDir, hookConsts.CONFIG_XML),
		log.level);
	projName = mfpConfig.getWidgetName();

	logSilly('Project directory: ' + projDir);
	logSilly('Plugin directory: ' + pluginDir);
	logSilly('Project name: ' + projName);
	logSilly('Platform directory: ' + platformDir);

	/*
	Displays a log silly message. The log level must be set to silly.

	message - The message to log
	 */
	function logSilly(message) {
		log.silly(hookConsts.IOS_AFTER_PLUGIN_INSTALL, message);
	}

	/*
	Displays a log verbose message. The log level must be set to verbose.

	message - The message to log
	 */
	function logVerbose(message) {
		log.verbose(hookConsts.IOS_AFTER_PLUGIN_INSTALL, message);
	}

	/*
	Moves .wldata, and buildtim.sh to the platform directory.

	An error is thrown if a cannot be copied.
	 */
	function movePluginFiles() {
		var origSrcFiles;		// Orginal source path
		var destSrcFiles;		// Destination source path

		logVerbose('Moving plugin files.');

		origSrcFiles = [
			path.join(pluginDir, 'src', 'ios', '.wldata'),
			path.join(pluginDir, 'src', 'ios', 'buildtime.sh')
		];

		destSrcFiles = [
			path.join(platformDir, '.wldata'),
			path.join(platformDir, 'buildtime.sh')
		];

		// Copy each source file
		for (var i = 0; i < origSrcFiles.length; i++) {
			// Copy the file if it exists
			if (that.exists(origSrcFiles[i]))
				that.copyFile(origSrcFiles[i], destSrcFiles[i]);
			else
				logSilly('File does not exist ' + origSrcFiles[i]);
		}
	}

	/*
	The project's main.m will be overwritten with an MFP specific version. The
	old file will be backed up.

	An error will be thrown if main.m cannot be copied.
	 */
	function updateMainActivity() {
		var wlMainFile;			// Path to MFP plugin main.m
		var cdvMainFile;		// Path to app's main.m
		var cdvMainFileBackup;	// Path to main.m backup

		logVerbose('Updating MainActivity.');

        wlMainFile = path.join(pluginDir, 'src', 'ios', 'main.m');
		cdvMainFile = path.join(platformDir, projName, hookConsts.MAIN_M);
        cdvMainFileBackup = cdvMainFile + hookConsts.BAK;

        // Make a backup of main.m before replacing with Worklight's version
        if (!that.exists(cdvMainFileBackup))
			that.copyFile(cdvMainFile, cdvMainFileBackup);
        else
			logSilly('A back up of main.m already exists.');

		that.copyFile(wlMainFile, cdvMainFile);
        console.log(externalizedStrings.manuallyMergeMainM);
	}

	/*
	Reads the iOS SDK checksum value from mfppres.json then writes that value
	to config.xml.

	An error will be thrown if mfpprefs.json cannot be read.
	 */
    function addSdkChecksumToConfig(){
		var jsonFile;		// JSON file to read
		var parsedJSON;		// Parsed JSON file
		var iOSChecksum;	// Checksum for iOS

		logVerbose('Adding SDK checksum to configuration.');

        jsonFile = path.join(projDir, 'plugins', 'cordova-plugin-mfp', 'hooks',
			'mfpprefs.json');
		parsedJSON = JSON.parse(that.readFile(jsonFile));
		iOSChecksum = parsedJSON["base.iphone"];

		logSilly('iOS SDK checksum: ' + iOSChecksum);
        mfpConfig.setMFPSDKChecksum(iOSChecksum, hookConsts.IOS);
		mfpConfig.writeToFile();
    }

	/*
	The main.m file will be updated, and MFP specific plugin files will be
	setup.

	An error will be thrown if the hook fails.
	 */
	this.invokeHook = function() {
		logVerbose('Performing after plugin install hook.');

		try {
	        addSdkChecksumToConfig();
	        updateMainActivity();
	        movePluginFiles();
		} catch (err){
        	throw strings.format(externalizedStrings.failedPluginInstall,
				hookConsts.IOS, err);
		}
	};

}

IOSAfterPluginInstall.prototype = new Hook();
module.exports = IOSAfterPluginInstall;

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
This class provides the hook script functionality for before plugin uninstall
for iOS.

projectDirectory - Path to the project

After the hook is executed, the MFP project will have been uninstalled.
 */
function IOSBeforePluginUninstall(projectDirectory) {
	var projDir;		// Path to project
	var platformDir;	// Path to platform
	var projName;		// Project name
	var mfpConfig;		// MFP configuration
	var that;			    // References this

	Hook.apply(this);

	that = this;
	projDir = projectDirectory;
	mfpConfig = new MFPConfig(path.join(projDir, hookConsts.CONFIG_XML),
		log.level);
	projName = mfpConfig.getWidgetName();
	platformDir = path.join(projDir, 'platforms', hookConsts.IOS);

	logSilly('Project directory: ' + projDir);
	logSilly('Project name: ' + projName);
	logSilly('Platform directory: ' + platformDir);

	/*
	Displays a log silly message. The log level must be set to silly.

	message - The message to log
	 */
	function logSilly(message) {
		log.silly(hookConsts.IOS_AFTER_PREAPRE, message);
	}

	/*
	Displays a log verbose message. The log level must be set to verbose.

	message - The message to log
	 */
	function logVerbose(message) {
		log.verbose(hookConsts.IOS_AFTER_PREAPRE, message);
	}

	/*
	The mfpclient.plists file will be removed from the project.

	An error is thrown if the properties cannot be deleted.
	 */
	function removePropertiesFile() {
		var propPath;

		logVerbose('Removing properties file.');

		propPath = path.resolve(path.resolve(platformDir, projName,
			hookConsts.PROPS_PATH_IOS));

		logSilly('Removing ' + propPath);
		that.deleteFile(propPath);
	}

	/*
	The MFP specific main.m will be removed, and replaced with the original.

	An error will be thrown if main.m cannot be moved.
	 */
	function restoreMainActivity() {
		var mainFile;			// Path to main.m
		var mainFileBackup;		// Path to backup main.m

		log.verbose(hookConsts.IOS_BEFORE_PLUGIN_UNINSTALL,
			'Restoring MainActivity.');

		mainFile = path.resolve(platformDir, projName, hookConsts.MAIN_M);
		mainFileBackup = mainFile + hookConsts.BAK;

		logSilly('Original main.m path: ' + mainFileBackup);

		// Restore main.m to original from backup
		if (that.exists(mainFileBackup)) {
			that.moveFile(mainFileBackup, mainFile);
			console.log(
				strings.format(externalizedStrings.origMainActRestoreSuccess,
					mainFileBackup)
			);
		} else
			logVerbose('File not found: ' + mainFileBackup);
	}

	/*
	The mfpclient.plist will be removed, and the original main.m restored.

	An error will be thrown if the hook fails.
	 */
	this.invokeHook = function() {
		log.verbose(hookConsts.IOS_BEFORE_PLUGIN_UNINSTALL,
			'Performing before plugin uninstall hook.');

		try {
			removePropertiesFile();
			restoreMainActivity();
		} catch (err) {
			throw strings.format(externalizedStrings.failedPluginUninstall,
				hookConsts.IOS, err);
		}
	};

}

IOSBeforePluginUninstall.prototype = new Hook();
module.exports = IOSBeforePluginUninstall;

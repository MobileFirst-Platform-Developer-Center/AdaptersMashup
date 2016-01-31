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
var et = require('elementtree');
var shell = require('shelljs');

// MFP modules
var Hook = require('./../utils/hook');
var hookConsts = require('./../utils/hook-consts');
var externalizedStrings = require('./../externalizedStrings');
var MFPConfig = require('mfp-config-xml').mfpConfigXMLAPI;
var strings = require('ibm-strings');

/*
This class provides the hook script functionality for before prepare for
Android.

projDirectory - Path to the project

After the hook is executed, the MFP project will have been ready for prepare.
 */
function AndroidBeforePrepare(projectDirectory) {
	var projDir;		// Path to project
	var platformDir;	// Path to platform
    var mfpConfig;      // MFP configuration
	var that;			// References this

	Hook.apply(this);

	that = this;
	projDir = projectDirectory;
	platformDir = path.join(projDir, 'platforms', hookConsts.ANDROID);
    mfpConfig = new MFPConfig(path.join(projDir, 'config.xml'), log.level);

	logSilly('Project directory: ' + projDir);
	logSilly('Platform directory: ' + platformDir);

	/*
	Displays a log silly message. The log level must be set to silly.

	message - The message to log
	 */
	function logSilly(message) {
		log.silly(hookConsts.ANDROID_BEFORE_PREAPRE, message);
	}

	/*
	Displays a log verbose message. The log level must be set to verbose.

	message - The message to log
	 */
	function logVerbose(message) {
		log.verbose(hookConsts.ANDROID_BEFORE_PREAPRE, message);
	}

	/*
	Backs up the filelist.

	The filelist will be moved to the platform directory, so it can be restored
	after prepare.
	 */
	function backupFileList() {	
	    var fileListPath;			// Path to filelist
		var fileListBackupPath;		// Backup path for filelist

		logVerbose('Backing up filelist.');

	    fileListPath = path.resolve(platformDir,
			hookConsts.FILE_LIST_PATH_ANDROID);
		fileListBackupPath = path.resolve(platformDir, hookConsts.FILE_LIST);

		logSilly('Backuping up ' + fileListPath + ' to ' + fileListBackupPath);

		// Backup the filelist if it exists
	    if (that.exists(fileListPath))
			that.moveFile(fileListPath, fileListBackupPath);
	    else
	        log.verbose('File does not exists: ' + fileListPath);
	}

    /*
	Makes a data object of the Android package IDs and AndroidManifest.

    Returns an object with the Android data. 
	 */
    function getAndroidData() {
		var manifestContent;		// AndroidManifest.xml content
		var manifest;				// XML parsed AndroidManifest.xml
		var data;			        // Resultant Android data

		data = {};
		manifestContent = that.readFile(path.join(platformDir,
			hookConsts.ANDROID_MANIFEST_XML)).toString();

		manifest = et.parse(manifestContent);

        data.manifest = manifest;

		data.oldPackageName = manifest.getroot().attrib.package;
        data.newPackageName = mfpConfig.getWidgetId();

        data.oldPackageDir = path.join(platformDir, 'src',
			path.join.apply(null, data.oldPackageName.split('.')));
        data.newPackageDir = path.join(platformDir, 'src',
			path.join.apply(null, data.newPackageName.split('.')));

        logSilly('Package data: ' + JSON.stringify(data, null, 2));

        return data;
    }

    /*
	Finds, and returns the name of the MainActivity file. Gets the MainActivity
    name from the AndroidManifest. 

    manifest - element tree of AndroidManifest.xml

    Returns the name of the MainActivity file or null if not found
	 */
    function getMainActivity(manifest) {
        try {
            var mainActivity;       // MainActivity file

            var activities = manifest.getroot().find('application').findall('activity');
            activities.forEach(function(activity) {
                var intents = activity.findall('intent-filter');
                intents.forEach(function(intent) {
                    var actions = intent.findall('action');
                    actions.forEach(function(action) {
                        if (action.get('android:name') === 'android.intent.action.MAIN') {
                            mainActivity = activity.get('android:name');
                            return;
                        }
                    });
                });
            });
            return mainActivity;
        } catch (err) {
            logVerbose(err);
            throw externalizedStrings.unexpectedErr;
        }
    }

    /*
	Updates the Java src files if the package ID was modified in the 
    config.xml. Will update the package ID in each Java file and move
    the file to its new src directory. 

    data - data object containing information about the package IDs and 
    MainActivity file

    Throws an error if getting list of src files fails or moving the 
    Java files fails.
	 */
    function updatePackageId(data) {
        try {
            var oldPackageName = data.oldPackageName;   // Package ID from AndroidManifest.xml
            var newPackageName = data.newPackageName;   // Package ID from config.xml

            // If the package ID has changed, update Java src files
            if (oldPackageName != newPackageName) {
                var oldFilePath;    // Path of src file in the old directory
                var newFilePath;    // Path of src file in the new directory
                var oldPackageDir = data.oldPackageDir;    // Old directory of src files
                var newPackageDir = data.newPackageDir;    // New directory of src files

                var mainActivity = getMainActivity(data.manifest) + '.java';
                var oldPackageDirectoryFiles = that.readDir(oldPackageDir);

                oldPackageDirectoryFiles.forEach(function(file) {
                    if (file != mainActivity) {
                        oldFilePath = path.resolve(oldPackageDir, file);
                        newFilePath = path.resolve(newPackageDir, file);

                        shell.sed('-i', /package.*;/, 'package ' +
                            newPackageName + ';', oldFilePath);

                        that.moveFile(oldFilePath, newFilePath);
                    }
                });
            }
        } catch (err) {
            logVerbose(err);
            throw externalizedStrings.unexpectedErr;
        }
    }

	/*
	Backs up the filelist.
    Updates Java src files if package ID was modified in the config.xml. 

	An error will be thrown if the hook fails.
	 */
	this.invokeHook = function() {
		logVerbose('Performing before prepare hook.');

		try {
			backupFileList();
            var data = getAndroidData();
            updatePackageId(data);
		} catch (err) {
			throw strings.format(externalizedStrings.failedPluginPrepare,
				hookConsts.ANDROID, err);
		}
	};

}

AndroidBeforePrepare.prototype = new Hook();
module.exports = AndroidBeforePrepare;

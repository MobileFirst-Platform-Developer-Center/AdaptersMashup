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
var et = require('elementtree');
var log = require('npmlog');

// MFP modules
var externalizedStrings = require('./../externalizedStrings');
var hookConsts = require('./../utils/hook-consts');
var Hook = require('./../utils/hook');
var strings = require('ibm-strings');

/*
 This class provides the hook script functionality for before plugin uninstall
 for Android.

 projectDirectory - Path to the project

 After the hook is executed, the MFP project will have been uninstalled.
 */
function AndroidBeforePluginUninstall(projectDirectory) {
	var projDir;        // Path to project
	var platformDir;    // Path to platform
    var that;			// References this

    Hook.apply(this);

    that = this;
	projDir = projectDirectory;
    platformDir = path.join(projectDirectory, 'platforms', hookConsts.ANDROID);

    logSilly('Project directory: ' + projDir);
    logSilly('Platform directory: ' + platformDir);

    /*
    Displays a log silly message. The log level must be set to silly.

    message - The message to log
     */
    function logSilly(message) {
        log.silly(hookConsts.ANDROID_BEFORE_PLUGIN_UNINSTALL, message);
    }

    /*
    Displays a log verbose message. The log level must be set to verbose.

    message - The message to log
     */
    function logVerbose(message) {
        log.verbose(hookConsts.ANDROID_BEFORE_PLUGIN_UNINSTALL, message);
    }

    /*
    The mfpclient.properties file will be removed from the project.

    An error is thrown if the properties cannot be deleted.
     */
	function removePropertiesFile() {
        var propPath;       // Path to properties file

        logVerbose('Removing properties file.');

        propPath = path.resolve(platformDir, hookConsts.PROPS_PATH_ANDROID);

        logSilly('Removing ' + propPath);
        that.deleteFile(propPath);
	}

    /*
     Finds the package name, and package name directory, and returns the two
     in a class.

     An error is thrown if AndroidManifest.xml cannot be read.
     */
    function getPackageDirectory() {
        var manifestContent;		// AndroidManifest.xml content
        var manifest;				// XML parsed AndroidManifest.xml
        var packageData;			// Resultant package data

        logVerbose('Finding MainActivtiy.');

        packageData = {};
        manifestContent = that.readFile(path.join(platformDir,
            hookConsts.ANDROID_MANIFEST_XML)).toString();

        manifest = et.parse(manifestContent);
        packageData.packageName = manifest.getroot().attrib.package;
        packageData.packageNameDir = path.join(platformDir, 'src',
            path.join.apply(null, packageData.packageName.split('.')));

        logSilly('Mainifest file: ' + manifestContent);
        logSilly('Mainfest: ' + JSON.stringify(manifest, null, 2));
        logSilly('Package data: ' + JSON.stringify(packageData, null, 2));

        return packageData.packageNameDir;
    }

    /*
    Removes MFP .java files from the project.

    packageDirectory - Path of package directory

    An error will be thrown if a file cannot be deleted.
     */
    function removeMFPJavaFiles(packageDirectory) {
        var javaSRCPath;        // Path of file to remove

        logVerbose('Removing MFP Java files.');

        // Remove all MFP java files
        for (var i = 1; i < hookConsts.MFP_JAVA_SRC.length; i++) {
            javaSRCPath = path.resolve(packageDirectory,
                hookConsts.MFP_JAVA_SRC[i]);

            logSilly('Removing: ' + javaSRCPath);
            that.deleteFile(javaSRCPath);
        }
    }

    /*
    Finds, and returns the name of the MainActivity file. A package directory
    must be passed. If the MainActivity file is not found an empty string is
    returned.

    An error will be thrown if the package directory cannot be read, or if Java
    files cannot be read.
     */
    function getMainActivityName(packageDirectory) {
        var mainActivityName;       // MainActivity name
        var contentArr;             // Each line of orginal MainActivity
        var classArr;               // Class information

        logVerbose('Getting name of MainActivity.');

        contentArr = that.readFile(path.resolve(packageDirectory,
            hookConsts.MAIN_ACTIVITY_ORIG)).toString().split('\n');

        logSilly('Original MainActivity: ' + contentArr);

        // Find class name of original main activity
        for (var i = 0; i < contentArr.length; i++) {

            // Replace activity name
            if (contentArr[i].indexOf(hookConsts.PUBLIC_CLASS) !== -1) {
                classArr = contentArr[i].split(" ");
                mainActivityName = classArr[2] + hookConsts.DOT_JAVA;

                logSilly(mainActivityName);
                break;
            }
        }

        return mainActivityName;
    }

    /*
    MainActivity.java will be removed, and MainActivty.original will be renamed
    to MainActivity.java.

    packageDirectory - Path to package directory
    mainActivityName - Name of MainActivity

    An error will be thrown if Main Activity cannot be restored.
     */
    function restoreMainActivity(packageDirectory, mainActivityName) {
        var origMainActivityPath;       // Name of orginal MainActivity

        logVerbose('Restoring MainActivity.');

        origMainActivityPath = path.join(packageDirectory,
            hookConsts.MAIN_ACTIVITY_ORIG);

        logSilly('Orginal MainActivity path: ' + origMainActivityPath);

        // Restore the orginal MainActivity.java if it exists
        if (that.exists(origMainActivityPath)) {
            that.deleteFile(path.join(packageDirectory, mainActivityName));
            that.rename(origMainActivityPath, path.resolve(packageDirectory,
                mainActivityName));

            console.log(strings.format(
                externalizedStrings.origMainActRestoreSuccess, mainActivityName
            ));
        } else
            logVerbose('File not found: ' + origMainActivityPath);
    }

    /*
    Removes mfpclient.properties will be removed, removes MFP Java files, and
    restores MainActivty.java.

    An error will be thrown if the hook fails.
     */
	this.invokeHook = function() {
        var packageDir;			// Package directory, and package name
        var mainActivityName;	// Name of MainActivity

        logVerbose('Performing before plugin uninstall hook.');

        try {
            removePropertiesFile();
            packageDir = getPackageDirectory();
            removeMFPJavaFiles(packageDir);

            // Restore the original Main Activity if it exists
            if (this.exists(path.resolve(packageDir,
                    hookConsts.MAIN_ACTIVITY_ORIG))) {
                mainActivityName = getMainActivityName(packageDir);
                restoreMainActivity(packageDir, mainActivityName);
            }
        } catch (err){
        	throw strings.format(externalizedStrings.failedPluginUninstall,
                hookConsts.ANDROID, err);
        }
	};

}

AndroidBeforePluginUninstall.prototype = new Hook();
module.exports = AndroidBeforePluginUninstall;

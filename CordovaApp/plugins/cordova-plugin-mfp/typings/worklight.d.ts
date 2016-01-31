

/**
 * ================================================================= 
 * Source file taken from :: analytics.d.ts
 * ================================================================= 
 */

	declare module WL.Analytics {

		/**
		 * Turns on the capture of analytics data.
		 *
		 * The Promise returned by enable must be resolved prior to any WL.Analytics API call.
		 *
		 * Starting with IBM® Worklight® V6.2.0, WL.Analytics.enable no longer takes any parameter arguments and it
		 * is no longer necessary to wait for the returned Promise to be resolved to continue using the
		 * WL.Analytics API.
		 *
		 * @example
		 * WL.Analytics.enable()
		 *
		 * .then(function () {
    	 *   //Capture of analytics data is fully enabled.
    	 * })
		 *
		 * .fail(function (errObj) {
    	 *   //errObj.src = function that failed
    	 *   //errObj.res = error message
    	 * });
		 *
		 *
		 * @returns {Promise} Resolved with no parameters, rejected with an error object.
		 * @methodOf WL.Analytics#
		 */
		function enable():Promise;

		/**
		 * @deprecated since version 6.2. WL.Analytics.restart is now a NOP.
		 *
		 * @example
		 * WL.Analytics.restart()
		 *
		 * .then(function () {
		 *   //nop
    	 * })
		 *
		 * .fail(function (errObj) {
    	 *   //errObj.src = function that failed
    	 *   //errObj.res = error message
    	 * });
		 *
		 *
		 * @returns {Promise} Resolved with no parameters, rejected with an error object.
		 * @methodOf WL.Analytics#
		 */
		function restart():Promise;

		/**
		 * Turns off the capture of analytics data.
		 *
		 * @example
		 * WL.Analytics.disable()
		 *
		 * .then(function () {
    	 *   //Capture of analytics data is fully disabled.
    	 * })
		 *
		 * .fail(function (errObj) {
    	 *   //errObj.src = function that failed
    	 *   //errObj.res = error message
    	 * });
		 *
		 * @returns {Promise} Resolved with no parameters, rejected with an error object.
		 * @methodOf WL.Analytics#
		 */
		function disable():Promise;

		/**
		 *
		 * Logs a message with additional contextual information.
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobileFirst® server on the next successful network init or explicit WL.Analytics.send
		 * function call.
		 *
		 * @example
		 * WL.Analytics.log('my record');
		 * // or
		 * WL.Analytics.log({data: [1,2,3]});
		 * // or
		 * WL.Analytics.log({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string|Object} message The message to log.
		 * @param {string} name The name of the message to log.
		 *
		 * @returns {Promise} Resolved with no parameters, rejected with an error object.
		 * @methodOf WL.Analytics#
		 * @name WL.Analytics#log
		 */
		function log(message:string|Object, name?:string):Promise;

		/**
		 * Get the current state of WL.Analytics.
		 *
		 * The state object is kept by WL.Analytics and contains the following key:
		 * 
		 *   enabled (boolean) - Value is true if capture is enabled, false otherwise.
		 *
		 * Changing the state object that is returned does not affect the state object that is kept internally.
		 *
		 * WL.Analytics.state()
		 *
		 * .then(function (state) {
		 *   // {enabled: true}
		 * })
		 *
		 * .fail(function (errObj) {
		 *   //errObj.src = function that failed
		 *   //errObj.res = error message
		 * });
		 *
		 * @returns {Promise} Resolved with state object parameters, rejected with an error object.
		 * @methodOf WL.Analytics#
		 */
		function state():Promise;

		/**
		 *
		 * Send any analytics data collected up to this point to the IBM MobileFirst server.
		 *
		 * @returns {Promise} Resolved with success status, rejected with an error message.
		 *
		 * @methodOf WL.Analytics#
		 * @name WL.Analytics#send
		 */
		function send():Promise;
}

/**
 * ================================================================= 
 * Source file taken from :: jsonstore.d.ts
 * ================================================================= 
 */

declare module WL.JSONStore {

		/**
    	* Starts one or more collections.
    	*
    	*	@param {Object} collections Metadata about the collections.
    	*	@param {string} collections.collectionName Name of the the collection, must be an alphanumeric string ([a-z, A-Z, 0-9]) that starts with a letter.
    	*	@param {Object} collections.collectionName.searchFields The key value pairs in the data that will be indexed, by default nothing is indexed.
    	*	@param {Object} [collections.collectionName.additionalSearchFields] The additional key value pairs that will be indexed, by default nothing is indexed.
    	*	@param {Object} [collections.collectionName.adapter] Metadata about the adapter that will be linked to the collection.
    	*	@param {string} collections.collectionName.adapter.name Name of the Adapter.
    	*	@param {string} [collections.collectionName.adapter.add] Name of the add procedure.
    	*	@param {string} [collections.collectionName.adapter.remove] Name of remove procedure.
    	*	@param {Object} [collections.collectionName.adapter.load] Metadata about the load procedure.
    	*	@param {string} collections.collectionName.adapter.load.procedure Name of the load procedure.
    	*	@param {array}  collections.collectionName.adapter.load.params Parameters that are sent to the load procedure.
    	*	@param {string} collections.collectionName.adapter.load.key Key in the response object containing objects to add.
    	*	@param {function} [collections.collectionName.adapter.accept] Called after push with the response from the adapter, must return a boolean.
    	*	@param {integer} [collections.collectionName.adapter.timeout] Timeout for the adapter call.
    	*
    	* 	@param {Object} [options] Options that apply to the store.
    	*	@param {string} [options.username] Name of the file that is created to store data for the collections,
    	*			must be an alphanumeric string ([a-z, A-Z, 0-9]) and start with a letter. The default one is 'jsonstore'.
    	*	@param {string} [options.password] Password that is used to secure the contents of the store, by default there is no data encryption.
    	*	@param {boolean} [options.clear] Clears accessors without removing its contents from the store.
    	*	@param {boolean} [options.localKeyGen] Flag that determines if key generation uses a local (false) or remote (true) random number generator.
    	*	@param {boolean} [options.analytics] Enable the collection of analytics information for Android and iOS.
    	*	@param {integer} [options.pbkdf2Iterations] Change the number of iterations used by the Password-Based Key Derivation Function 2 (PBKDF2) algorithm used to secure the password. The default is 10,000 iterations. This is currently only supported on Android, and will be ignored in other versions, using 10,000 in those.
    	*
    	* @return {Promise} Resolved when all collections have been initialized.
    	*		Rejected when there is a failure (no accessors created).
    	*
    	* @methodOf WL.JSONStore#
    	*/
    function init(collections: Object, options?:Object): Promise;

		/**
    	* Provides an accessor to the collection if the collection exists, otherwise it returns undefined.
    	*
    	* @param {string} collectionName Name of the collection.
    	*
    	* @return {WL.JSONStore.JSONStoreInstance} Allows access to the collection by name.
    	*
    	* @methodOf WL.JSONStore#
    	*/
    function get(collectionName: string): WL.JSONStore.JSONStoreInstance;

		/**
		* Returns information about the file that is used to persist data in the store. The following key value pairs are returned:
		* name - name of the store,
		* size - the total size, in bytes, of the store,
		* and isEncrypted - boolean that is true when encrypted and false otherwise.
		*
		* @return {Promise} Resolved when the operation succeeds.
		*   Rejected when there is a failure.
		*
		* @methodOf WL.JSONStore#
		*/
    function fileInfo(): Promise;

		/**
    	* Locks access to all the collections until WL.JSONStore.init is called.
    	*
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore#
    	*/
    function closeAll(options: Object): Promise;

		/**
    	* Takes an _id and a JSON object and creates a JSONStore document.
    	*
    	* @param {integer} id _id for the Document
    	* @param {Object} data JSON data for the Document
    	*
    	* @return {Object} JSONStore document.
    	*
    	* @deprecated Since IBM® Worklight® V6.2.0.
    	* @methodOf WL.JSONStore#
    	*/
    function documentify(id: number, data: Object): Object;

		/**
    	* Changes the password for the internal storage.
    	* @description You must have an initialized collection before calling WL.JSONStore.changePassword.
    	* @param {string} oldPassword The old password. Must be alphanumeric ([a-z, A-Z, 0-9]), begin with a letter and have least 1 character.
    	*
    	* @param {string} newPassword The new password Must be alphanumeric ([a-z, A-Z, 0-9]), begin with a letter and have least 1 character.
    	*
    	* @param {string} [username] Default user name is 'jsonstore'. Must be alphanumeric ([a-z, A-Z, 0-9]), begin with a letter and have least 1 character.
    	*
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	* @param {integer} 	[options.pbkdf2Iterations] Change the number of iterations used by the Password-Based Key Derivation Function 2 (PBKDF2) algorithm used to secure the password. The default is 10,000 iterations. This is currently only supported on Android, and will be ignored in other versions, using 10,000 in those.
    	*
    	* @return {Promise} Resolved when the operation succeeds.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore#
    	*/
    function changePassword(oldPassword: string, newPassword: string, username: string, options:Object): Promise;

		/**
    	* Completely wipes data for all users, destroys the internal storage, and clears security artifacts.
    	*
    	* @param {string} [username] Only removes data that is related to the specific username that is passed.
    	* @param {Object} [options] Deprecated.
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds.
    	*  Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore#
    	*/
    function destroy(options: Object): Promise;

		/**
    	* Returns the message that is associated with a JSONStore error code.
    	*
    	* @param {number} errorCode The error code.
    	*
    	* @return {string} The Error Message that is associated with the status code or 'Not Found'
    	*        if you pass an invalid value (non-integer) or a nonexistent status code.
    	* @methodOf WL.JSONStore#
    	*/
    function getErrorMessage(errorCode: number): string;

		/**
    	* Initiates a transaction.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an integer.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore#
    	*/
    function startTransaction(): Promise;

		/**
    	* Commit a transaction.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an integer.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore#
    	*/
    function commitTransaction(): Promise;

		/**
    	* Roll back a transaction.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an integer.
    	*		Rejected when there is a failure.
    	*
    	*
    	* @methodOf WL.JSONStore#
    	*/
    function rollbackTransaction(): Promise;

		/**
    	* Removes the password from memory.
    	*
    	* @return {boolean} Returns true if the password that is stored in memory was set to null, false if there was no password
    	* in memory or if it was not set to null.
    	*
    	* @deprecated Since IBM® Worklight® V5.0.6, it is no longer needed if you use WL.JSONStore.init
    	* @methodOf WL.JSONStore#
    	*/
    function clearPassword(): boolean;

		/**
    	* Returns an accessor (also known a JSONStoreInstance) to a single collection.
    	*
    	* @param {string} name Name of the the collection, must be an alphanumeric string ([a-z, A-Z, 0-9]) that starts with a letter.
    	* @param {object} searchFields The key value pairs in the data that will be indexed, by default nothing is indexed.
    	* @param {options} options Options that you can pass to WL.JSONStore.init.
    	*
    	* @return {WL.JSONStore.JSONStoreInstance} Accessor to a single collection.
    	*
    	* @deprecated Since IBM® Worklight® V5.0.6, it is no longer needed if you use WL.JSONStore.init
    	* @methodOf WL.JSONStore#
    	*/
    function initCollection(name: string, searchFields: Object, options: Object): WL.JSONStore.JSONStoreInstance;

		/**
    	* Sets the password that is used to generate keys to encrypt data that is stored locally on the device.
    	*
    	* @param {string} pwd String that contains the password.
    	*
    	* @return {boolean} Returns true if the password is a valid string, false otherwise.
    	*
    	* @deprecated Since IBM® Worklight® V5.0.6, it is no longer needed if you use WL.JSONStore.init
    	* @methodOf WL.JSONStore#
    	*/
    function usePassword(pwd: string): boolean;

		/**
    	* Creates a query for advanced find. See {@link WL.JSONStore.QueryPart} for more information.
    	*
    	* @example
    	* WL.JSONStore.QueryPart();
    	*
    	* @methodOf WL.JSONStore#
    	*/
    function QueryPart(): WL.JSONStore._QueryPart;
    
    class JSONStoreInstance {

		/**
    	* Stores data as documents inside a collection.
    	*
    	* @param {array|object} data Data to be added the collection.
    	* @param {Object} [options]
    	* @param {Object} [options.additionalSearchFields] Search fields that are not part of the data passed.
    	* @param {boolean} [options.markDirty] Default value is true, determines if the data will be marked as dirty.
    	* @param {boolean} [options.push] Deprecated. Default value is true, determines if the data will be marked as needed to be pushed to an adapter.
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns the number of documents added.
    	*		Rejected when there is a failure.
    	*
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     add(data: Object[]|Object, options: Object): Promise;

		/**
    	* Returns the number of documents inside a collection.
    	*
    	* @param {Object} [query] Defines what to search for in the collection. If it is not passed, it will count everything in the collection.
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an integer.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     count(query: Object, options: Object): Promise;

		/**
    	* The enhance function allows developers to extend the core API to better fit their needs.
    	*
    	* @param {string} name Function name.
    	* @param {Function} fn Function to add to the JSONStoreInstance prototype for a specific collection.
    	*
    	* @return {number} 0 return code for success or an error code for failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     enhance(name: string, fn: Function): number;

		/**
    	* Locates a document inside a collection using a query.
    	*
    	* @param {array|Object} query Defines what to search for in the collection.
    	* @param {Object} [options]
    	* @param {boolean} [options.exact] Default is false and will do fuzzy searches, true will do exact searches.
    	* @param {integer} [options.limit] Maximum amount of documents to return, the default behavior is to return everything.
    	* @param {integer} [options.offset] Amount of documents to skip from the results, depends on the limit.
    	* @param {array} [options.filter] Return only the specified search fields, by default return _id and json.
    	* @param {array} [options.sort] Sort documents based on their search fields, either ascending or descending.
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an array of results.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     find(query: Object[]|Object, options: Object): Promise;

		/**
    	* Locates a document inside a collection by using query parts.
    	* @description
    	* The ability to search using between, inside, lessThan, greaterThan, etc. in your query search. Consider using the following helper
    	* WL.JSONStore.QueryPart.
    	*
    	* @param {array} query Defines what to search for in the collection.
    	* @param {Object} [options]
    	* @param {integer} [options.limit] Maximum number of documents to return, the default behavior is to return everything.
    	* @param {integer} [options.offset] Number of documents to skip from the results, depends on the limit.
    	* @param {array} [options.filter] Return only the specified search fields, by default return _id and json.
    	* @param {array} [options.sort] Sort documents based on their search fields, either ascending or descending.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an array of results.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     advancedFind(query: Object[], options: Object): Promise;

		/**
    	* Returns all of the documents stored in a collection.
    	*
    	* @param {Object} [options]
    	* @param {integer} [options.limit] Maximum amount of documents to return, the default behavior is to return everything.
    	* @param {integer} [options.offset] Amount of documents to skip from the results, depends on the limit.
    	* @param {array} [options.filter] Filter and select document's specified searchfields. If no filter array is passed, all searchfields are returned.
    	* @param {array} [options.sort] Sort documents based on their searchfields, either ascending or descending.
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an array of results.
    	*		Rejected when there is a failure.
    	*
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     findAll(options: Object): Promise;

		/**
    	* Returns one or more documents that match the _id that is supplied to the function.
    	*
    	* @param {array} data An array of _id 
    	* @param {Object} [options]
    	* @param {array} [options.filter] Return only the specified search fields, by default return _id and json.
    	* @param {array} [options.sort] Sort documents based on their search fields, either ascending or descending.
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an array of results.
    	*		Rejected when there is a failure.
    	*
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     findById(data: Object[], options: Object): Promise;

		/**
    	* Returns all documents that are marked dirty. This function was previously called JSONStoreIntance.getPushRequired.
    	*
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns array of documents.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     getAllDirty(options: Object): Promise;

		/**
    	* Returns a boolean that is true if the document is dirty, false otherwise.
    	* This function was previously called JSONStoreIntance.isPushRequired.
    	*
    	* @param {Object|number} doc JSONStore style document or _id
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, return a boolean.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     isDirty(doc: Object|number, options: Object): Promise;

		/**
    	* Gets data that is defined in the load portion of the adapter.
    	*
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns number of documents loaded.
    	*		Rejected when there is a failure.
    	*
    	*
    	* @deprecated Since IBM® Worklight® V6.2.0.
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     load(options: Object): Promise;

		/**
    	* Pushes documents inside the collection that have local-only changes to an IBM® MobileFirst® adapter
    	* that is linked during the init function.
    	*
    	* @param {array|Object|number} [options] Options object, array of documents, single document or an _id.
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an array.
    	*   Array returned is either empty (everything worked) or full of error responses.
    	*		Rejected when there is a failure.
    	*
    	* @deprecated Since IBM® Worklight® V6.2.0.
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     push(options: Object[]|Object|number): Promise;

		/**
    	* Returns the number of documents with local-only changes (that is, dirty documents).
    	* This function was previously called JSONStoreIntance.pushRequiredCount.
    	*
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an integer.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     countAllDirty(options: Object): Promise;

		/**
    	* Marks a document as deleted inside a collection.
    	*
    	* @param {array|object|integer} doc Document, array of documents, query object or _id.
    	* @param {Object} [options]
    	* @param {boolean} [options.markDirty] Default value is true, determines if the data will be marked as dirty.
    	* @param {boolean} [options.push] Deprecated. Default value is true, determines if the data will be marked as needed to be pushed to an adapter.
        * @param {boolean} [options.exact] Default is false and will do fuzzy searches, true will do exact searches.
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     remove(doc: Object[]|Object|number, options: Object): void;

		/**
    	* Deletes all the documents that are stored inside a collection.
    	*
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds.
    	*		Rejected when there is a failure.
    	*
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     removeCollection(options: Object): Promise;

		/**
    	* Clears a collection for reuse.
    	*
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds.
    	*		Rejected when there is a failure.
    	*
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     clear(options: Object): Promise;

		/**
    	* Marks an array of documents as clean. Takes input from JSONStoreIntance.getAllDirty,
    	* which returns documents that have: _operation, _dirty, _id,
    	* json, and _deleted.
    	*
    	* @param {array} docs array of documents
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns number of clean documents.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     markClean(docs: Object[], options: Object): Promise;

		/**
    	* Overwrites a document with a given document.
    	*
    	* @param {array|Object} doc Document or array of documents.
    	* @param {Object} [options]
    	* @param {boolean} [options.markDirty] Default value is true, determines if the data will be marked as dirty.
    	* @param {boolean} [options.push] Deprecated. Default value is true, determines if the data will be marked as needed to be pushed to an adapter.
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an integer.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     replace(doc: Object[]|Object, options: Object): Promise;

		/**
    	* Used to load data when existing data exists in the store. Internally it is an alias for a targeted replace and add.
    	*
    	* @param {array|object} doc Data to be added the collection.
    	* @param {Object} [options]
    	* @param {boolean} [options.addNew] Default value is false, determines if the data will added if data is not in collection.
    	* @param {boolean} [options.markDirty] Default value is false, determines if the data will be marked as dirty.
    	* @param {array} [options.replaceCriteria] Determines which documents will be replaced based on the given search field or search fields.
    	* If the parameter is not specified or is an empty array, then the data will not be replaced.
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns the number of documents replaced or added.
    	*		Rejected when there is a failure.
    	*
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     change(doc: Object[]|Object, options: Object): Promise;

		/**
    	* Prints the contents of the collection by using  WL.Logger.debug asynchronously.
    	*
    	* @param {number} [limit] Maximum amount of documents to show. Use 0 for no documents,
    	*	if limit is missing it will print up to the first 100 documents.
    	*	@param {number} [offset] Number of documents to skip. Requires a valid limit.
    	*
    	* @return {Promise} Resolved when the operation succeeds, returns an integer.
    	*		Rejected when there is a failure.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     toString(limit: number, offset: number): Promise;

		/**
    	* Pushes only the selected documents.
    	*
    	* @param {Object|array} doc Document or array of documents.
    	*
    	* @param {Object} [options]
    	* @param {function} [options.onSuccess] Deprecated. Success callback.
    	* @param {function} [options.onFailure] Deprecated. Failure callback.
    	*
    	* @return {Promise} Resolved when the operation succeeds.
    	*   Rejected when there is a failure.
    	*
    	* @deprecated Since IBM Worklight v5.0.6, it is no longer needed if you use WL.JSONStore.JSONStoreInstance.push.
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	*/
     pushSelected(doc: Object|Object[], options: Object): Promise;

		/**
    	* Deletes a document from the collection.
    	*
    	* @param {array|object|number} doc Document, array of documents, query object or _id.
    	* @param {Object} [options]
    	* @param {boolean} [options.push] Default value is false, determines if the data will be marked as needed to be pushed to an adapter.
    	* @param {function} [options.onSuccess] Success callback.
    	* @param {function} [options.onFailure] Failure callback.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	* @deprecated Since IBM® Worklight® V5.0.6, it is no longer needed if you use WL.JSONStore.JSONStoreInstance.remove
    	* with {push: false}.
    	*/
     erase(doc: Object[]|Object|number, options: Object): void;

		/**
    	* Writes data to a collection.
    	*
    	* @param {Object|array} docs Data to store in the collection.
    	* @param {Object} [options]
    	* @param {Object} [options.additionalSearchFields] Search fields that are not part of the data that is passed.
    	* @param {boolean} [options.push] Default value is false, determines if the data will be marked as needed to be pushed to an adapter.
    	* @param {function} [options.onSuccess] Success callback.
    	* @param {function} [options.onFailure] Failure callback.
    	*
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	* @deprecated Since IBM® Worklight® V5.0.6, it is no longer needed if you use WL.JSONStore.JSONStoreInstance.add
    	* with {push: false}.
    	*/
     store(doc: Object|Object[], options: Object): void;

		/**
    	* Replaces a document with another document.
    	*
    	* @param {array|object} doc Document or array of documents.
    	* @param {object} [options]
    	* @param {boolean} [options.push] Default value is false, determines if the data will be marked as needed to be pushed to an adapter.
    	* @param {function} [options.onSuccess] Success callback.
    	* @param {function} [options.onFailure] Failure callback.
    	*
    	* @methodOf WL.JSONStore.JSONStoreInstance#
    	* @deprecated Since IBM® Worklight® V5.0.6, it is no longer needed if you use WL.JSONStore.JSONStoreInstance.replace
    	* with {push: false}.
    	*/
     refresh(doc: Object[]|Object, options: Object): void;
}

      class _QueryPart {

		/**
    	* Add a like clause to a query for advanced find.
    	* @description
    	* Behaves like the fuzzy option in WL.JSONStore.JSONStoreInstance.find. See WL.JSONStore.JSONStoreInstance.find for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {string} value Determines what string value to use to compare in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().like('name', 'ca');
    	*	//arr = [{$like: [{ name : 'ca' }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     like(searchField: string, value: string): Object[];

		/**
    	* Add a not like clause to a query for advanced find.
    	* @description
    	* The negative of like. See WL.JSONStore.QueryPart.like for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {string} value Determines what string value to use to compare in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().notLike('name', 'ca');
    	*	//arr = [{$notLike: [{ name : 'ca' }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     notLike(searchField: string, value: string): Object[];

		/**
    	* Add a left clause to a query for advanced find.
    	* @description
    	* Similar to WL.JSONStore.QueryPart.like except only use input from the left.
    	* See WL.JSONStore.Query.like for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {string} value Determines what string value to use to compare in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().leftLike('name', 'ca');
    	*	//arr = [{$leftLike: [{ name : 'ca' }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     leftLike(searchField: string, value: string): Object[];

		/**
    	* Add a not left clause to a query for advanced find.
    	* @description
    	* The negative of left like. See WL.JSONStore.QueryPart.leftLike for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {string} value Determines what string value to use to compare in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().notLeftLike('name', 'ca');
    	*	//arr = [{$notLeftLike: [{ name : 'ca' }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     notLeftLike(searchField: string, value: string): Object[];

		/**
    	* Add a right clause to a query for advanced find.
    	* @description
    	* Similar to WL.JSONStore.QueryPart.like except only use input from the right.
    	* See WL.JSONStore.QueryPart.like for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {string} value Determines what string value to use to compare in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().rightLike('name', 'ca');
    	*	//arr = [{$rightLike: [{ name : 'ca' }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     rightLike(searchField: string, value: string): Object[];

		/**
    	* Add a not right clause to a query for advanced find.
    	* @description
    	* The negative of right like. See WL.JSONStore.QueryPart.rightLike for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {string} value Determines what string value to use to compares in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().notRightLike('name', 'ca');
    	*	//arr = [{$notRightLike: [{ name : 'ca' }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     notRightLike(searchField: string, value: string): Object[];

		/**
    	* Add an equal to clause to a query for advanced find.
    	* @description
    	* Behaves like the exact option in WL.JSONStore.JSONStoreInstance.find. See WL.JSONStore.JSONStoreInstance.find for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {string|integer|number} value Determines what value to use to compare in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().equal('age', 35);
    	*	//arr = [{$equal: [{ age : 35 }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     equal(searchField: string, value: string|number): Object[];

		/**
    	* Add a not equal to clause to a query for advanced find.
    	* @description
    	* The negative of equal. See WL.JSONStore.QueryPart.equal for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {string} value Determines what string value to use in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().notEqual('name', 'ca');
    	*	//arr = [{$notEqual: [{ name : 'ca' }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     notEqual(searchField: string, value: string): Object[];

		/**
    	* Add a less than clause to a query for advanced find.
    	* @description
    	* The less than clause will make comparisons between the query and the document in the collection and return document(s) if
    	* the selected search field or additional search field value are less than the value given by the query.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {integer|number} value Determines what value to use in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().lessThan('age', 40);
    	*	//arr = [{$lessThan: [{ age : 40 }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     lessThan(searchField: string, value: number): Object[];

		/**
    	* Add a less or equal than clause to a query for advanced find.
    	* @description
    	* The less than equal clause will make comparisons between the query and the document in the collection and return document(s) if
    	* the selected search field or additional search field value are less than or equal to the value given by the query.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {integer|number} value Determines what value to use in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().lessOrEqualThan('age', 40);
    	*	//arr = [{$lessOrEqualThan: [{ age : 40 }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     lessOrEqualThan(searchField: string, value: number): Object[];

		/**
    	* Add a greater than clause to a query for advanced find.
    	* @description
    	* The greater than clause will make comparisons between the query and the document in the collection and return document(s) if
    	* the selected search field or additional search field values are greater than the value given by the query.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {integer|number} value Determines what value to use in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().greaterThan('age', 40);
    	*	//arr = [{$greaterThan: [{ age : 40 }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     greaterThan(searchField: string, value: number): Object[];

		/**
    	* Add a greater or equal thanclause to a query for advanced find.
    	* @description
    	* The greater than equal clause will make comparisons between the query and the documents in the collection and return document(s) if
    	* the selected search field or additional search field values are greater than or equal to the value given by the query.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {integer|number} value Determines what value to use in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().greaterOrEqualThan('age', 40);
    	*	//arr = [{$greaterOrEqualThan: [{ age : 40 }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     greaterOrEqualThan(searchField: string, value: number): Object[];

		/**
    	* Add a between clause to a query for advanced find.
    	* @description
    	* The between clause will make comparisons between the query and the documents in the collection and return documents(s) if
    	* the selected search field or additional search field values are between the range given by the query.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {array} value The range of values, integer or number, to use in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().between('gpa', [3.0, 4.0]);
    	*	//arr = [{$between: [{ gpa : [3.0, 4.0] }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     between(searchField: string, value: Object[]): Object[];

		/**
    	* Add a not between clause to a query for advanced find.
    	* @description
    	* The negative of between. See WL.JSONStore.QueryPart.between for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {array} value The range of values, integer or number, to use in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().notBetween('gpa', [3.0, 4.0]);
    	*	//arr = [{$notBetween: [{ gpa : [3.0, 4.0] }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     notBetween(searchField: string, value: Object[]): Object[];

		/**
    	* Add an in clause to a query for advanced find.
    	* @description
    	* The in clause with make comparisons between the query and the documents in the collection and return document(s) if
    	* the selected search field or additional search field values given by the query are contained in the document.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {array} value The range of values to use in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().inside('gpa', [3.0, 4.0]);
    	*	//arr = [{$inside: [{ gpa : [3.0, 4.0] }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     inside(searchField: string, value: Object[]): Object[];

		/**
    	* Add a not in clause to a query for advanced find.
    	* @description
    	* The negative of in. See WL.JSONStore.QueryPart.inside for more information.
    	*
    	* @param {string} searchField Determines what search field or additional search field to use in the query.
    	* @param {array} value The range of values to use in the query.
    	*
    	* @return {array} Returns a formatted query array.
    	*
    	* @example
    	* var arr = WL.JSONStore.QueryPart().notBetween('gpa', [3.0, 4.0]);
    	*	//arr = [{$notBetween: [{ gpa : [3.0, 4.0] }]}]
    	*
    	* @methodOf WL.JSONStore.QueryPart#
    	*/
     notInside(searchField: string, value: Object[]): Object[];
}
    
}





/**
 * ================================================================= 
 * Source file taken from :: securityutils.d.ts
 * ================================================================= 
 */

declare module WL.SecurityUtils {

		/**
       * Generates a key by using the PBKDF2 algorithm.
       * 
       * @param {Object} options Required.
       * @param {string} options.password Required. Password that is used to generate the key.
       * @param {string} options.salt Required. Salt that is used to to generate the key.
       * @param {number} options.iterations Required. Number of iterations that is used for the key generation algorithm.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the hex encoded key.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function keygen(options: Object): Promise;

		/**
       * Encrypts text with a key.
       * 
       * @param {Object} options Required.
       * @param {string} options.key Required. Text to encrypt.
       * @param {string} options.text Required. Key that is used for encryption.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is an object which includes the cipher text.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function encrypt(options: Object): Promise;

		/**
       * Decryption function.
       * 
       * @param {Object} options Required.
       * @param {string} options.key Required. Key.
       * @param {string} options.ct Required. Cipher Text.
       * @param {string} options.iv Required. Initialization Vector.
       * @param {string} options.src Required. Source ('obj' = iOS, 'java' = Android, 'js' = Web).
       * @param {number} options.v Required. Version.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the decrypted text.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function decrypt(options: Object): Promise;

		/**
       * Generates a random hex string locally.
       * 
       * @param {number} [bytes] Optional. Number of bytes that is used to generate the string. Default is 32 bytes.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the random hex string.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function localRandomString(bytes?: number): Promise;

		/**
       * Encodes input as base64 string.
       * 
       * @param {string} input Required. Input string.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the input string encoded.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function base64Encode(input: string): Promise;

		/**
       * Decodes input base64 string to a non base64 encoded string.
       * 
       * @param {string} input Required. Input base64 encoded string.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the input string decoded.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function base64Decode(input: string): Promise;

		/**
      	 * ONLY FOR IOS
         * Choose wether internal/native or openssl basaed encryption will be applied.
         *
         * @param {boolean} enable Required. true native false openssl.
         *
         * @return {Promise} Resolved when the operation succeeds.
         *   Rejected when there is a failure.
         *
         * @methodOf WL.SecurityUtils#
         */
    function enableOSNativeEncryption(enable: boolean): Promise;
}


/**
 * ================================================================= 
 * Source file taken from :: userAuthentication.d.ts
 * ================================================================= 
 */


declare module WL.UserAuth {

		/**
       * 
       * @return {Promise} Resolved when the operation succeeds.
       *   Rejected when there is a failure.
	   * @methodOf WL.UserAuth#
	   * @name WL.UserAuth#init
       */
    function init(): Promise;
    
		/**
    	 * check whether the certificate exists.
         * @return {Promise} Resolved when the operation succeeds.
         *   Rejected when there is a failure.
    	 * @methodOf WL.UserAuth#
    	 * @name WL.UserAuth#isCertificateExists
    	 */
     function isCertificateExists(): Promise;


		/**
       * 
       * @param {Object} options
       * @param {Object} options.cert
       * @param {string} options.realm
       *
       * @return {Promise} Resolved when the operation succeeds.
       *   Rejected when there is a failure.
	   * @methodOf WL.UserAuth#
	   * @name WL.UserAuth#saveCertificate
       */
    function saveCertificate(options: Object): Promise;

		/**
       * 
       * @param {Object} options
       * @param {Object} options.csr
       *
       * @return {Promise} Resolved when the operation succeeds.
       *   Rejected when there is a failure.
	   * @methodOf WL.UserAuth#
	   * @name WL.UserAuth#signCsr
       */
    function signCsr(options: Object): Promise;

		/**
       * 
       * 
       * @param {Object} options
       * @param {string} options.url
       * @param {string} options.method
       * @param {Object} options.headers
       * @param {string} options.data
       * @param {boolean} options.validate
       * @param {Object[]} options.cookiesToRemove
       *
       * @return {Promise} Resolved when the operation succeeds.
       *   Rejected when there is a failure.
	   * @methodOf WL.UserAuth#
	   * @name WL.UserAuth#signedHttpRequest
       */
    function signedHttpRequest(options: Object): Promise;


		/**
    	 * Removes the user certificate installed by the user certificate authentication realm.
    	 *
    	 * @example
    	 * WL.UserAuth.deleteCertificate();
    	 *
    	 * @param {string} [provisioningEntity] name of the certificate provisioning entity, either 'application' or the group name under which 
    	 * the certificate was provisioned. By default it is 'application'.
    	 *
    	 * @returns {Promise} Resolved with no parameters, rejected with an error object.
    	 * @methodOf WL.UserAuth#
    	 * @name WL.UserAuth#deleteCertificate
    	 */
    function deleteCertificate(provisioningEntity: string): Promise;
    
    	/**
    	 * check whether the environment is supported.
         * @returns A boolean value, indicating whether the environment is supported.
    	 * @methodOf WL.UserAuth#
    	 * @name WL.UserAuth#isSupportedEnvironment
    	 */
    function isSupportedEnvironment(): boolean;
}

/**
 * ================================================================= 
 * Source file taken from :: wlapp.d.ts
 * ================================================================= 
 */


declare module WL.App {

		/**
    	 * @description Shows the default IBM MobileFirst splash screen on the activity that was passed as a parameter
    	 * @methodOf WL.App#
    	 * @name WL.App#showSplashScreen
    	 */
    function showSplashScreen(): void;

		/**
    	 * @description Hides the default IBM MobileFirst splash screen if it is shown, 
    	 * and does nothing if the default MobileFirst splash screen is already hidden
    	 * @methodOf WL.App#
    	 * @name WL.App#hideSplashScreen
    	 */
    function hideSplashScreen(): void;


		/**
    	 * This method is applicable to iOS, Android and WP8.
    	 * @description
    	 * Sets the MobileFirst server URL to the specified URL.
    	 *
    	 * Changes the MobileFirst server URL to the new URL, cleans the HTTP client context, and calls successCallback when finished.
    	 * After calling this method, the application is not logged in to any server.
    	 * If the specified URL is malformed, then failCallback is called and the MobileFirst server URL remains unchanged.
    	 *
    	 * Notes:
    	 * The responsibility for checking the validity of the URL is on the developer.
    	 * If the app uses push notification, it is the developer's responsibility to unsubscribe from the previous server and subscribe to the new server.
    	 * For more information on push notification, see {@link WL.Client.Push}.
    	 * When using this function you might want to perform additional clean-up, for example partial or full wipe of JSONStore or HTML5 LocalStorage. 
    	 * For more information on clean-up, see {@link WL.JSONStore}.
    	 * 
    	 * @example
    	 * WL.App.setServerUrl("http://9.148.23.88:10080/context", successCallback, failCallback);
    	 * 
    	 * @param {string} url Mandatory. The URL of the new server, including protocol, IP, port, and context.
    	 * @param successCallback Optional. The callback function that is called after the MobileFirst URL is set to the specified URL.
    	 * @param failCallback Optional. The callback function that is called if this method fails or is not supported.
    	 * @methodOf WL.App#
    	 */
    function setServerUrl(url: string, successCallback?: Function, failCallback?: Function ): void;

		/**
    	 * @description
    	 * Gets MobileFirst server URL.
    	 * This method is asynchronous, so the MobileFirst server URL is returned as an argument to the successCallback function.
    	 * 
    	 * @param successCallback Mandatory. The callback function that is called with the MobileFirst server URL as an argument.
    	 * @param failCallback Optional. The callback function that is called if this method fails.
    	 * @methodOf WL.App#
    	 */
    function getServerUrl(successCallback: Function , failCallback?: Function): void;

		/**
    	 * Extracts a string that contains an error message.
    	 * @description 
    	 * 
    	 * Extracts a string that contains the error message within the specified exception object. 
    	 * Use for exceptions that are thrown by the IBM MobileFirst client runtime framework.
    	 * @param {exception} exception Mandatory. The exception object from which the error string is extracted.
    	 * @methodOf WL.App#
    	 * @name WL.App#getErrorMessage
    	 */
    function getErrorMessage(exception: any): string;

		/**
         * @description Sends an action and optional data object to native action receivers. 
         * @note {Note} If there are no native action receivers registered, the action 
         * is queued until a native action receiver is registered. 
         * @param {String} action Custom string that represents an action. All receivers registered 
         * with the specified action receive the message.
         * @param data Optional parameter: custom JSON object containing key-value pairs.
         * @example
         * WL.App.sendActionToNative("doSomething");
         * WL.App.sendActionToNative("doSomething", { customData: 12345} );
         * @methodOf WL.App#
         * @name WL.App#sendActionToNative
         * 
         */
    function sendActionToNative(action: String, data?: Object): void;

		/**
         * @description Registers an action receiver. 
         * @note {Note} In JavaScript code, a receiver must be implemented as a callback that can
         * receive an object.
         * @param {string} id. A string parameter used to uniquely identify receiver function, to be able 
         * to remove it at later stages.
         * @param {Function} callback Mandatory. The JavaScript function that is called by the 
         * MobileFirst framework when an action is sent from native code to JavaScript code.
         * @example
         * WL.App.addActionReceiver("MyReceiver", function (receivedActon){
         *	// process receivedAction
         * });
         * @methodOf WL.App#
         * @name WL.App#addActionReceiver
         */
    function addActionReceiver(id: string, callback: Function): void;

		/** 
         * @description Removes a previously added receiver. After this API is called, the receiver identified 
         * by receiverId no longer receives actions.
         * @param {string} id. A string parameter used to uniquely identify a previously 
         * registered receiver function.
         * @example
         * WL.App.removeActionReceiver("MyReceiver");
         * @methodOf WL.App#
         * @name WL.App#removeActionReceiver
         */
    function removeActionReceiver(id: string): void;
}

declare module WL.NativePage {

		/**
     	 * Switches the currently displayed, web-based screen with a natively written page
    	 * @param className Mandatory. String. The name of the native class. For iOS, the name of the class (for example, BarCodeController). 
    	 * 		For Android, the complete name of the class and package (for example, com.neebula.barcode.Scanner). 
    	 * @param callback Mandatory. Function. A function object that is called when the native page switches back to the web view. 
    	 * 		This function is passed a single JSON object parameter when invoked.
    	 * @param data Optional. Object. A JSON object that is sent to the native class. For iOS, The data must be single string or a flat record of strings.
    	 *
    	 * @example
    	 * // Good
    	 * WL.NativePage.show("com.scan.BarCode", function(data){alert(data);}, {key1 : 'value1'});
    	 * WL.NativePage.show("com.scan.BarCode", function(data){alert(data);}, {key1 : 'value1', key2 : 'value2'});
    	 *
    	 * // Bad
    	 * WL.NativePage.show("com.scan.BarCode", function(data){alert(data);}, {key1 : 'value1', innerStruct : {innerKey1 : 'innervalue1'}});
     	 *
     	 * @methodOf WL.NativePage#
    	 * @name WL.NativePage#show
    	 */
    function show(className: string, callback: Function, data?: Object): void;
}


/**
 * ================================================================= 
 * Source file taken from :: wlauthorizationmanager.d.ts
 * ================================================================= 
 */

declare module WLAuthorizationManager {

		/**
    	 * @description Returns cached authorization header.
    	 * @returns A promise object that can be used to receive the header asynchronously. The header is sent as a string.
    	 * @example
    	 * WLAuthorizationHeader.getCachedAuthorizationHeader()
    	 * .then(
    	 *   function(response) {
    	 * 	   // success flow
    	 * 	 },
    	 * 	 function(error) {
    	 *     // error flow
    	 * 	 }
    	 * );
    	 * @methodOf WLAuthorizationManager#
    	 */
    function getCachedAuthorizationHeader(): Promise;

		/**
    	 * @description Determines whether authorization is required or not.
    	 * @param {number} responseStatus Mandatory. Specifies the response status code returned from the server.
    	 * @param {string} responseAuthenticationHeader Mandatory. Specifies a string containing an authorization header value (usually the value of header 'WWW-Authenticate'), 
    	 * returned with a response from the server.
    	 * @returns A boolean value, indicating whether authorization is required (true), or not (false).
    	 * @methodOf WLAuthorizationManager#
    	 */
    function isAuthorizationRequired(responseStatus: number, responseAuthenticationHeader: string): boolean;

		/**
    	 * @description Sets the authorization persistence policy, which defines how the authorization information is persisted on the device.
    	 * It can be set to one of the following values:
    	 * WLAuthorizarionManager.ALWAYS, which stores the authorization data on the device and the user is not required to
    	 * authenticate on subsequent application launches.
    	 * WLAuthorizarionManager.NEVER, which maintains the authorization data 
    	 * in the memory and the user will be authenticated on each application run.
    	 * 
    	 * @param authorizationPersistencePolicy Mandatory. Specifies the new policy to set.
    	 * @deprecated In MobileFirst Platform 7.1, persisting authorization headers on the client side has no effect, since the MobileFirst server persists the security data across sessions.
    	 * @returns A promise object, because this operation is asynchronous.
    	 * @methodOf WLAuthorizationManager#
    	 */
    function setAuthorizationPersistencePolicy(authorizationPersistencePolicy: string): Promise;

		/**
    	 * @description Parses the authentication header and retrieves the authorization scope.
    	 * @param {string} responseAuthenticationHeader Mandatory. Specifies a string containing an authorization header value (usually the value of header 'WWW-Authenticate'), 
    	 * returned with a response from the server.
    	 * @returns A string containing authorization scope.
    	 * 
    	 * @methodOf WLAuthorizationManager#
    	 */
    function getAuthorizationScope(responseAuthenticationHeader: string): string;

		/**
    	 * @description Obtains the authorization header for the specified scope. 
    	 * @param {string} scope Optional. Specifies the scope to obtain an authorization header for. 
    	 * @returns A promise object that can be used to receive the authorization header asynchronously. The header is sent as a string.
         * @example    
    	 * WLAuthorizationManager.obtainAuthorizationHeader(scope)
    	 * .then (
    	 *   function(header) {
    	 * 	   // success flow with the header
    	 *   },
    	 *   function(error) {
    	 *     // failure flow
    	 *   }
    	 * };
    	 * 
         * @methodOf WLAuthorizationManager#
    	 */
    function obtainAuthorizationHeader(scope: string): Promise;

		/**
    	 * Adds a cached authorization header to the request. As this function is asynchronous, you 
    	 * use the returned promise for completing the flow.
    	 * @param {Object} request Mandatory. A request object. This object should expose the setRequestHeader function.
    	 * @returns Promise object. 
    	 * @example
    	 * var xhr = new XMLHttpRequest();
    	 * WLAuthorizationManager.addCachedAuthorizationHeader(xhr)
    	 * .always(
    	 *   function(response) {
    	 * 	   // success or failure flow
    	 * 	 }
    	 * );
    	 * 
         * @methodOf WLAuthorizationManager#
    	 */
    function addCachedAuthorizationHeader(request: Object): Promise;

		/**
    	 * @description Obtains user identity. The identity is returned via deferred callback.
    	 * @returns Promise object. The methods calls either success or failure callbacks and passes the user identity as a string or error.
         * @example
    	 * WLAuthorizationManager.getUserIdentity()
    	 * .then(
    	 *   function(data) {
    	 * 	   // success flow with user identity
    	 * 	 },
    	 * 	 function(error) {
    	 * 	   // failure flow with error
    	 * 	 }
    	 * );
    	 * 
    	 * @methodOf WLAuthorizationManager#
    	 */
    function getUserIdentity(): Promise;

		/**
    	 * @description Obtains device identity. The identity is returned via deferred callback.
    	 * @returns Promise object. The methods calls either success or failure callbacks and passes the device identity as a string or error.
         * @example
    	 * WLAuthorizationManager.getDeviceIdentity()
    	 * .then(
    	 *   function(data) {
    	 * 	   // success flow with device identity
    	 * 	 },
    	 * 	 function(error) {
    	 * 	   // failure flow with error
    	 * 	 }
    	 * );
    	 * 
         * @methodOf WLAuthorizationManager#
    	 */
    function getDeviceIdentity(): Promise;

		/**
    	 * @description Obtains application identity. The identity is returned via deferred callback.
    	 * @returns Promise object. The methods calls either success or failure callbacks and passes the application identity as a string or error.
         * @example
    	 * WLAuthorizationManager.getAppIdentity()
    	 * .then(
    	 *   function(data) {
    	 * 	   // success flow with application identity
    	 * 	 },
    	 * 	 function(error) {
    	 * 	   // failure flow with error
    	 * 	 }
    	 * );
         * @methodOf WLAuthorizationManager#
    	 */
    function getAppIdentity(): Promise;
    
    var AuthorizationPersistencePolicy: {
    NEVER: string;
    ALWAYS: string;
    BIOMETRICS: string;
    };
}


/**
 * ================================================================= 
 * Source file taken from :: wlclient.d.ts
 * ================================================================= 
 */


declare module WL.Client {

		/**
        * Adds an HTTP header to be used in server requests issued by an IBM MobileFirst framework.
        * @description 
        * The HTTP header is used in all requests until removed by the WL.Client.removeGlobalHeader API call.
        * @example
        * WL.Client.addGlobalHeader("MyCustomHeader","abcdefgh");
        * @param headerName Mandatory. The name of the header to be added.
        * @param headerValue Mandatory. The value of the header to be added.
        * @methodOf WL.Client#
        */
    function addGlobalHeader(headerName: string, headerValue: string): void;

		/**
        * Identifies the type of environment in which the application is running. Such as iPhone, Android, or Windows.
        * @description 
        * @returns A constant that identifies the type of environment. The valid values are defined in the WL.Environment variable in the worklight.js file, and are as follows:
        * 
        * WL.Environment.ADOBE_AIR
        * WL.Environment.ANDROID
        * WL.Environment.IPAD
        * WL.Environment.IPHONE
        * WL.Environment.MOBILE_WEB
        * WL.Environment.PREVIEW (when the application runs in Preview mode)
        * WL.Environment.WINDOWS_PHONE_8
        * WL.Environment.WINDOWS8
        * WL.Environment.DESKTOPBROWSER
        * WL.Environment.BLACKBERRY10
        * 
        * When an app is running in Preview mode, this method returns WL.Environment.PREVIEW, regardless of the previewed environment. 
        * There are two reasons for this behavior:
        *
        * Environment - specific code can fail when invoked from the browser (because the environment might support features that are not available in the browser).
        *WL.Client behaves differently in different environments (for example, cookie management).
        * 
        *A good practice is to rely on the IBM MobileFirst UI optimization framework and separate environment-dependent JS to separate files rather than using the WL.Client.getEnvironment() function.
        * @methodOf WL.Client#
        */
    function getEnvironment(): string;


		/**
        * Initializes the WL.Client object. The options of this method reside in the initOptions.js file.
        * @description
        * @param options An optional options object augmented with the following additional optional properties:
        * 	
        * 		Timeout:
        * 		An integer value, denoting the timeout in milliseconds. 
        * 			The timeout affects all calls from the app to the MobileFirst Server. If not specified, a timeout of 30,000 milliseconds (30 seconds) is used.
        * 		
        * 		messages:
        * 			A dictionary object for localizing texts, located in the messages.js file. If not specified, the default object Messages (in the same file) is used.
        * 		
        * 		
        * 		heartBeatIntervalInSecs:
        * 			An integer value, denoting the interval in seconds between heartbeat messages automatically sent by WLClient to the MobileFirst Server. The default value is 420 (7 minutes).
        * 	
        * 		connectOnStartup:
        * 			Deprecated: The connectOnStartup init option is deprecated. MobileFirst applications by default are configured to not connect to the MobileFirst Server. If you would like your application to connect to the MobileFirst Server, use WL.Client.connect().
        * 	
        * 		onConnectionFailure:
        * 			A failure-handling function invoked when connection to the MobileFirst Server, performed on initialization by default, or if the connectOnStartup flag is true, fails.
        * 	
        * 		onUnsupportedVersion
        * 			A failure-handling function invoked when the current version of the application is no longer supported (a newer application has been deployed to the server). For more information about the signature of failure-handling functions, see The Options Object.
        * 		
        * 		onRequestTimeout
        * 			A failure-handling function invoked when the init() request times out. For more information about the signature of failure-handling functions, see The Options Object.
        * 	
        * 	
        * 		onUserInstanceAccessViolation:
        * 			A failure-handling function invoked when the user is trying to access an application that was provisioned to a different user. 
        * 			For more information about the signature of failure-handling functions, see The Options Object.
        * 	
        * 		onErrorRemoteDisableDenial:
        * 			A failure-handling function invoked when the server denies access to the application, according to rules defined in the IBM MobileFirst Console. 
        * 			If this function is not provided, the application opens a dialog box, which displays an error message defined in the IBM MobileFirst Console. 
        * 			When used, the function can provide an application-specific dialog box, or can be used to implement additional behavior in situations where the server denies access to the application. 
        * 			It is important to ensure that the application remains offline (not connected).
        *
        * 		Parameters:
        * 		message: This parameter contains the notification text that you defined in the MobileFirst Console, which indicates that an application is denied access to the MobileFirst Server.
        * 		downloadLink: This parameter contains the URL that you defined in the MobileFirst Console to download the new version of the application, that users can find in the appropriate application store.
        * 	
        * 		Example 
        * var wlInitOptions = {
        * 	connectOnStartup : true,
        * 	onErrorRemoteDisableDenial : function (message, downloadLink) {
        * 	WL.SimpleDialog.show(
        * 		"Application Disabled",
        * 		message,
        * 		[{text: "Close application", handler: function() {WL.App.close();}},
        * 		{text: "Download new version", handler: function() {WL.App.openURL(downloadLink, "_blank");}}]
        * 		);
        * 	}
        * };
        * 		
        * 		onErrorAppVersionAccessDenial:
        * 		A failure-handling function invoked when the server denies access to the application, according to rules defined in the IBM MobileFirst Console. 
        * 			If this function is used, the developer takes full ownership of the implementation and handling if Remote Disable took place. 
        * 			If the failure-handling function is not provided, the application opens a dialog box, which displays an error message defined in the IBM MobileFirst Console.
        * 			Note: onErrorAppVersionAccessDenial is deprecated since V5.0.6. Instead, use onErrorRemoteDisableDenial.	
        * 	
        * 		validateArguments:
        * 		A Boolean value, indicating whether the IBM MobileFirst Client runtime library validates the number and type of method parameters. The default is true.
        * 	
        * 		autoHideSplash:
        * 		A Boolean value, indicating whether the IBM MobileFirst splash-screen will be auto-hidden. To disable automatic hiding of the splash screen set this property to false. Default is true.
        * 		
        * 
        * @note {Note} The onSuccess function is used to initialize the application.
        * 	If an onFailure function is not passed, a default onFailure function is called. If onFailure is passed, it overrides any specific failure-handling function.
        * @methodOf WL.Client#
        * @name WL.Client#init
        */
    function init(initOptions?: Object): void;

    	/**
        * Invokes a procedure that is exposed by an IBM MobileFirst adapter. Prior to invoking a procedure, a connect request to the MobileFirst Server is first initiated.
        * @description
        * @param invocationData Mandatory. A JSON block of parameters. For a description of the structure of the parameter block.
        * The WL.Client invokeProcedure function accepts the following JSON block of parameters:
        * {
        * 	adapter : 'adapter-name',
        *	procedure : 'procedure-name',
        *	parameters : [],
        *	compressResponse : true/false
        * }
        * 	
        * 		adapter:
        * 		Mandatory. A string that contains the name of the adapter as specified when the adapter was defined.
        * 	
        * 		procedure:
        * 		Mandatory. A string that contains the name of the procedure as specified when the adapter was defined.
        * 	 	
        * 		parameters:
        * 		Optional. An array of parameters that is passed to the back-end procedure.
        * 	
        * 		compressResponse:
        * 		Optional. A string that requests the response from the server to be sent in a compressed format to
        *		reduce the amount of data that is transferred between MobileFirst Server and the device.
        *		The default value, if compressResponse is not specified, is false.
        *		Note: This option is applicable for Android, iOS, Windows Phone Silverlight 8, Windows 8 universal, BlackBerry 10, Mobile Web, and Adobe AIR.
        *		For Mobile Web applications, compression is supported only when the device browser can decompress GZIP data.
        *		If the size of the payload is larger than the compress.response.threshold property set on the server, this option is ignored.
        *		
        * @param options Optional. A standard options object, augmented with the following property:
        *  
        *   The success handler response object can contain the following properties:
		*    
        * 		    invocationContext:
        * 		    The invocationContext object that was originally passed to the MobileFirst Server in the callback object.
        * 	       
        *		      invocationResult:
        * 		    
        *           An object that contains the data that is returned by the invoked procedure, and the invocation status. Its format is as follows:
        * invocationResult = {
        * 	isSuccessful: Boolean,
        * 	errors : "Error Message"
        * 	// Procedure results go here
        * }
        * 
        * 		      Where: 
        * 			        isSuccessful – Contains true if the procedure invocation succeeded, false otherwise.
        * 			         If the invocation failed, the failure handler for the request is called.
        * 			        errors – An optional array of strings containing error messages.
        * 		  
        * 			  parameters:
        * 			  Optional. An array of parameters that is passed to the back-end procedure.
        *   
        *   timeout: Integer. Number of milliseconds to wait for the server response before failing with a request timeout. The default timeout value is 30000 milliseconds (30 seconds).
        *   
        *       The maximum timeout value in any Windows Phone environment is 60000 milliseconds (60 seconds).
        *   
        *   The failure handler of this call is called in two cases:
        *     
        *       The procedure was called but failed. In this case, the invocationResult property is added to the response received by the failure handler.
        *        This property has the same structure as the invocationResult property returned to the success handler,
        *        but the value of the isSuccessful attribute is false. For the structure of the invocationResult property, see invocationResult.
        *       A technical failure resulted in the procedure not being called. In this case, the failure handler receives a standard response object.   
        *
        * @return {Promise} Resolved when the operation is successful. Rejected when there is a failure.
        *
        * @methodOf WL.Client#
        */
    function invokeProcedure(invocationData: Object, options?: Object): Promise;




    	/**
    	* Pins the host X509 certificate public key to the client application.
    	* Secured calls to the pinned remote host will be checked for a public key match.
    	* Secured calls to other hosts containing other certificates will be rejected.
    	* Some mobile operating systems might cache the certificate validation check results.
    	* Your app must call the certificate pinning method before making a secured request.
    	* Calling this method a second time overrides any previous pinning operation.
		* @param certificateFilename -  the name of the certificate file that is located under
		* the certificate folder located in the application root 
		* @return {Promise} Resolved when the operation is successful and the certificate is pinned. Rejected if certificateFilename is undefined, not found or is not in DER format.
		* @methodOf WL.Client#
		*/
    function pinTrustedCertificatePublicKey(certificateFilename: string): Promise;

		/**
        * Reloads the application
        * @description It can be used to recover an application from errors. It is preferable to avoid using it and to use alternative error handling mechanisms instead. 
        *  		The method is mainly available for compatibility with earlier versions. 
        * @methodOf WL.Client#
        */
    function reloadApp(): void;

		/**
        * Removes the global HTTP header added by the WL.Client.addGlobalHeader API call
        * @description
        * @param headerName Mandatory. The name of the header to be removed.
        * @example
        * WL.Client.removeGlobalHeader("MyCustomHeader");
        * @methodOf WL.Client#
        */
    function removeGlobalHeader(headerName: string): void;

		/**
        * Sets the interval of the heartbeat signal.
        * @description Sets the interval of the heartbeat signal sent to the MobileFirst Server to the specified number of seconds. 
        * 		The heartbeat is used to ensure that the session with the server is kept alive when the app does not issue any call to the server (such as invokeProcedure).
        * @param interval Mandatory. An integer value, denoting the interval in seconds between heartbeat messages automatically sent by WLClient to the MobileFirst Server.
        * 			An interval value of -1 disables the heartbeat:
        * 			WL.Client.setHeartBeatInterval(-1)
        * @methodOf WL.Client#
        */
    function setHeartBeatInterval(interval: number): void;

		/**
    	 * Retrieves cookies from the native HTTP client.
    	 * @description This function is asynchronous and returns a promise.
    	 * 
    	 * The array of cookies will be passed as a parameter to resolve callback.
    	 * @example
    	 * WL.Client.getCookies().then(function(cookies){...})
    	 * @note {Note} HttpOnly and Secure cookies are not returned.
    	 * @returns Promise
    	 * @methodOf WL.Client#
    	 */
    function getCookies(): Promise;

		/**
    	 * Adds a cookie to the native HTTP client.
    	 * @description This function is asynchronous and returns a promise.
    	 * @example
    	 * WL.Client.setCookie(myCookie).then(successFlow);
    	 * @param cookie Mandatory. JSON object with required cookie properties: name, value, domain, path, expires
    	 * @returns Promise
    	 * @methodOf WL.Client#
    	 */
    function setCookie(cookie: Object): void;

		/**
    	 * Deletes a cookie from the native HTTP client cookie storage.
    	 * @description This function is asynchronous and returns a promise.
    	 * @example
    	 * WL.Client.deleteCookie(myCookie).then(successFlow);
    	 * @param name Mandatory. Cookie name.
    	 * @returns Promise
    	 * @methodOf WL.Client#
    	 */
    function deleteCookie(name: string): void;

		/**
        * Return the language code of the language being used.
        * @description  This method returns the language or dialect code of the language currently being used for the application.
        * @note {Note}  This method is not relevant for mobile operating systems. Use mobile locale methods instead.
        * @returns The language or dialect code of the currently set language, or NULL if no language is set. The language or dialect code has the format ll or ll-cc, 
        * 		where ll is a two-letter ISO 639-1 language code and cc is a two-letter ISO 3166-1-alpha-2 country or region code.
        * 
        * @methodOf WL.Client#
        */
    function getLanguage(): string;

		/**
        * Creates a challenge handler object.A realm name must be supplied as a parameter.
        * @param realmName The realm name representing the challange, in configuration file (authenticationConfig.xml)
        * @methodOf WL.Client#
        */
    function createChallengeHandler(realmName: string): Object;

		/**
       * Creates a challenge handler object to handle challenges that are sent by the MobileFirst Server.
       *  
       * A WLChallengeHandler works only with an authentication realm that is based on the MobileFirst authentication protocol, 
       * that is, for which the server side authenticator instance extends one of the MobileFirst provided authenticators, 
       * such as WorklightProtocolAuthenticator or UsernamePasswordAuthenticator, or directly 
       * implements the WorklightAuthenticator interface.  
       * There must be only one challenge handler per realm. To comply with the MobileFirst authentication protocol, 
       * the challenge that the challenge handler receives must be a JSON object.
       * 
       * When you create a WLChallengeHandler, you must implement the following methods:
       *  
       * handleChallenge() - This method is called when the MobileFirst Server returns a challenge for the realm.
       * processSuccess() - This method is called when the MobileFirst Server reports an authentication success.
       * handleFailure() - This method is called when the MobileFirst Server reports an authentication failure.
       * 
       * @param realmName Realm name that represents the challenge, 
       * in the authenticationConfig.xml configuration file. Use this name to identify the realm that requires authentication. 
       * Used to identify which realm requires authentication. 
       * 
       * @methodOf WL.Client#
       * 
       */
    function createWLChallengeHandler(realmName: string): WL.Client.AbstractChallengeHandler;


       class AbstractChallengeHandler {

		/**
        * If isCustomResponse returns TRUE, the MobileFirst framework calls handleChallenge(). This function is used to perform required actions, 
        * such as hiding the application screen, displaying the login screen, or other actions required to pass the challenge successfully.
        * @param challenge Challenge to handle
        * @methodOf WL.Client.AbstractChallengeHandler#
        * @name WL.Client.AbstractChallengeHandler#handleChallenge
        */
     handleChallenge(challenge: Object): void;

		/**
        * Used to send collected credentials to a specific adapter procedure. It has the same signature as the WL.Client.invokeProcedure() function.
        * @param invocationData
        *            Mandatory. A JSON block of parameters.
    	* {
    	* adapter : adapter-name.wlname,
    	* procedure : adapter-name.procedure-name.wlname,
    	* parameters : [],
    	* }
        * 
        * @param options
        *            Optional. Parameters hash.
        * @methodOf WL.Client.AbstractChallengeHandler#
        * @name WL.Client.AbstractChallengeHandler#submitAdapterAuthentication
        */
     submitAdapterAuthentication(invocationData: Object, options?: Object): void;

		/**
        * Used to send collected credentials to a specific URL. The developer can also specify request parameters, headers, and callback.
        * @param reqURL URL to send data to
        * @param options Other options like timeout, extra headers
        * @param submitLoginFormCallback Callback method when opration is done
        * @methodOf WL.Client.AbstractChallengeHandler#
        * @name WL.Client.AbstractChallengeHandler#submitLoginForm
        */
     submitLoginForm(reqURL: string, options: Object, submitLoginFormCallback: Function): void;

		/**
        * Used to notify the MobileFirst framework that the authentication successfully finished. 
        * 
        * The MobileFirst framework then automatically issues the original request that triggered the authentication.
        * @methodOf WL.Client.AbstractChallengeHandler#
        * @name WL.Client.AbstractChallengeHandler#submitSuccess
        */
     submitSuccess(): void;

		/**
        * Notifies the MobileFirst framework that the authentication process completed with failure. 
        * The MobileFirst framework then disposes of the original request that triggered the authentication.
        * @param err Error message if available
        * @methodOf WL.Client.AbstractChallengeHandler#
        * @name WL.Client.AbstractChallengeHandler#submitFailure
        */
     submitFailure(): void;

		/**
        * Called each time that a response is received from the server. 
        * It is used to detect whether the response contains data that is related to this challenge handler, and returns TRUE if so, and FALSE if not.
        * @param transport Response that arrived from the server
        * @return true if the response is a challange that this handler handles 
        * @methodOf WL.Client.AbstractChallengeHandler#
        * @name WL.Client.AbstractChallengeHandler#isCustomResponse
        */
     isCustomResponse(transport: Object): void;
} 
}

/**
 * ================================================================= 
 * Source file taken from :: wlgap.d.ts
 * ================================================================= 
 */


declare module WL.Client.Push {

var isTokeUpdatedOnServer: boolean;
var subscribedEventSources: Object;
var subscribedTags: Object;
var pendindPushEventsArray: Object[];
var registeredEventSources: Object;


var defaultSubscribeOptions: {
        alert : boolean,
        badge : boolean,
        sound : boolean,
        requestHeaders : Object,
        onFailure : Function,
        onSuccess : Function
};

var defaultTagSubscribeOptions: {
        alert : boolean,
        badge : boolean,
        sound : boolean,
        requestHeaders : Object,
        onFailure : Function,
        onSuccess : Function
};
    
var defaultUnsubscribeOptions: {
        requestHeaders : Object,
        onFailure : Function,
        onSuccess : Function
};

var defaultTagUnsubscribeOptions: {
        requestHeaders : Object,
        onFailure : Function,
        onSuccess : Function
};

    /**
    	 * Checks whether SMS push notifications are supported.
    	 * @description Returns true if the IBM MobileFirst JavaScript API supports SMS push notifications in the current environment.
    	 * 
    	 * @methodOf WL.Client.Push#
    	 */
    function isPushSMSSupported(): boolean;

    /**
    	 * Checks whether push notification is supported.
    	 * @description Returns true if the IBM MobileFirst JavaScript API supports push notifications in the current environment.
    	 * @methodOf WL.Client.Push#
    	 */
    function isPushSupported(): boolean;

    /**
    	 *Checks whether current user is subscribed to an SMS event source.
    	 * @description Returns whether the currently logged-in user is subscribed to the SMS event source alias
    	 * @param alias
    	 *           Mandatory string. The event source alias.
    	 * @methodOf WL.Client.Push#
    	 */
    function isSMSSubscribed(alias: string): boolean;

    /**
    	 * Checks whether current user is subscribed to an event source.
    	 * @description Returns whether the currently logged-in user is subscribed to the specified event source alias
    	 * @param alias
    	 *           Mandatory string. The event source alias.
    	 * @methodOf WL.Client.Push#
    	 */
    function isSubscribed(alias: string): boolean;

    /**
    	 * Checks whether the device is subscribed to a tag.
    	 * @description Returns whether the device is subscribed to a tag with the given tagName
    	 * @param tagName
    	 *           Mandatory string. The name of the tag.
    	 * @methodOf WL.Client.Push#
    	 */
    function isTagSubscribed(tagName: string): boolean;

    /**
    	 * @description A callback function to notify that a device is ready to subscribe to push notifications. You must declare it outside any function. 
    	 * @example
    	 * WL.Client.Push.onReadyToSubscribe= function () {
    	 * // You can enable the Subscribe button here or call WL.Client.Push.subscribe() or WL.Client.Push.subscribeTag()
    	 * // This callback is useful in case your app needs to call subscribe() upon startup.
    	 * WL.Client.Push.registerEventSourceCallback ('myAlias', 'myAdapter', 'myEventSource', notificationArrived);
    	 * }
    	 * 
    	 * function notificationArrived(props, payload){
    	 * alert("Provider notification data: " + Object.toJSON(props));
    	 * alert("Application notification data: " + Object.toJSON(payload));
    	 * }
    	 * @methodOf WL.Client.Push#
    	 */
    function onReadyToSubscribe(): void;

    /**
    	 * @description A callback function to notify that push notification is arrived. You must declare it outside any function. 
    	 * @param props A JSON block that contains the notifications properties of the platform.
         * @param payload A JSON block that contains other data that is sent from the IBM MobileFirst Server. It also contains the tag name for tag and broadcast notification. 
         * 				 The tag name appears in the "tag" element. For broadcast notification, default tag name is Push.ALL.
    	 * @example
    	 * WL.Client.Push.onMessage= function (props, payload) {
    	 * alert("Provider notification data: " + Object.toJSON(props));
    	 * alert("Application notification data: " + Object.toJSON(payload));
    	 * }
    	 * @methodOf WL.Client.Push#
    	 */
    function onMessage(props: Object, payload: Object): void;

    /**
    	 * @description A function to return the iOS8 Interactive push notification categories. 
    	 * @return A JSON Array block that contains the categories
         * 
    	 * @example
    	 * WL.Client.Push.getInteractivePushCategories = function(){
    	 * 		var categories = [
    	 *                          {
    	 *                             //Category identifier, this is used while sending the notification
    	 *                             id : "poll",
    	 *                             
    	 *                             //Optional array of actions to show the action buttons along with the message.
    	 *                             actions: [
    	 *                                        {
    	 *                                             //Action identifier
    	 *                                             id : "poll_ok",
    	 *                                             
    	 *                                             //Action title, to be displayed as part of the notification button  
    	 *                                             title : "OK",
    	 *                                             
    	 *                                             //Optional mode to run the action is foreground or background. 1-foreground. 0-background. 
    	 *                                             //Default is foreground.
    	 *                                             mode: 1,
    	 *                                             
    	 *                                             //Optional, To mark the action button in red color. Default is false
    	 *                                             destructive: false,
    	 *                                             
    	 *                                             //Optional, To set if authentication required or not before running the action.(Screen lock). 
    	 *                                             //For foreground this is always true.
    	 *                                             authenticationRequired: true 
    	 *                                          },
    	 *                                          {
    	 *                                           	id : "poll_nok",
    	 *                                              title : "NOK",
    	 *                                              mode: 1,
    	 *                                              destructive: false,
    	 *                                              authenticationRequired: true
    	 *                                          }
    	 *                                      ],
    	 *                              //Optional List of actions need to show in case alert. 
    	 *                              //If not specified then the first four actions will be shown
    	 *                              defaultContextActions: ['poll_ok','poll_nok'],
    	 *                              
    	 *                              //Optional List of actions need to show in the notification center, lock screen. 
    	 *                              //If not specified then the first two actions will be shown.
    	 *                              minimalContextActions: ['poll_ok','poll_nok'] 
    	 *                           }
    	 *                       ];
    	 *     return categories;
    	 * };
    	 * @methodOf WL.Client.Push#
    	 */
    function getInteractivePushCategories(): Object[];

    	/**
    	 * Registers a callback method that is called whenever a notification arrives from the specified event source.
    	 * @description 
    	 * 		
    	 *			iOS and Android
    	 * 			 	Registers a callback method that is called whenever a notification arrives from the specified event source. 
    	 * 				If the notification arrives while the application is not running, the mobile OS starts the application at the specified callback.
    	 * 			Windows Phone 8
    	 * 			 	Registers a callback method that is called whenever a raw notification or a toast notification arrives and the application is running. 
    	 * 				If the notification arrives when the application is not running, then the callback method is not called. 
    	 * 				This behavior is defined in the Microsoft OS and cannot be changed.
    	 * 			
    	 * @param alias Mandatory string. A short ID that is used to identify the event source when the push notification arrives. Because notification text is usually limited in length, 
    	 * 		providing a short alias, rather than the entire adapter and event source names, can free more space in the notification text.
    	 * @param adapter Mandatory string. The name of the adapter that contains the event source.
    	 * @param eventSource Mandatory string. The name of the event source.
    	 * @param callback Mandatory function. The function that is called if a notification arrives. The function receives two parameters when invoked:
    	 * 		
    	 * 			props: A JSON block, containing the notification properties from the platform.
    	 * 			payload: A JSON block, containing other data that is sent from the IBM MobileFirst Server.
    	 * 		
    	 * 		
    	 * 
    	 * @methodOf WL.Client.Push#
    	 */
    function registerEventSourceCallback(alias: string, adapter: string, eventSource: string, callback: Function): void;

    /**
    	 * Complete the background job after receving the silent notification. This API is applicable for iOS environment.
    	 * @description When the silent notification arrives and the background job is completed, need to call this method to notify that the background job is completed.
    	 * @param id
    	 *           Mandatory string. The callback-id received as part of notification properties.
    	 * @param result 
         *           Optional. The result of background activity. A negative number indicates failure, zero tells no data and positive number tells the data downloaded.
    	 * 
    	 * 	
    	 * @methodOf WL.Client.Push#
    	 */
    function backgroundJobDone(id: string, result?: number): void;

    /**
    	 * Subscribe to an event source.
    	 * @description Subscribes the user to the event source with the specified alias.
    	 * @param alias
    	 *           Mandatory string. The event source alias, as defined in the invocation of  WL.Client.Push.onReadyToSubscribe .
    	 * @param options Optional. A standard options object. Custom subscription parameters that are supported by the event source in the adapter can also be included in this options object.
    	 * 
    	 * @example
    	 * if (WL.Client.Push.isPushSupported()){ 
    	 * WL.Client.Push.subscribe( 'myAlias', {foo: 'bar', onFailure : notificationSubscriptionError});
    	 * }
    	 * 
    	 * function notificationSubscriptionError(response) {
    	 * alert("Error registering for push notifications. " + response.errorMsg);
    	 * }
    	 * @methodOf WL.Client.Push#
    	 */
    function subscribe(alias: string, options?: Object): void;

    /**
    	 * Subscribe to a tag.
    	 * @description Subscribes the device to a tag defined for the application.
    	 * @param tagName
    	 *           Mandatory string. The name of the tag, as defined in the invocation of  WL.Client.Push.onReadyToSubscribe .
    	 * @param options Optional. A standard options object.
    	 * 
    	 * @example 
    	 * if (WL.Client.Push.isPushSupported()){ 
    	 * WL.Client.Push.subscribeTag( 'Tag1', {onFailure : notificationSubscriptionError});
    	 * }
    	 * 
    	 * function notificationSubscriptionError(response) {
    	 * alert("Error registering for push notifications. " + response.errorMsg);
    	 * }
    	 * @methodOf WL.Client.Push#
    	 */
    function subscribeTag(tagName: string, options?: Object): void;

    /**
    	 * Subscribe to an SMS event source.
    	 * @description Subscribes the user to the SMS event source with the specified alias.
    	 * @param alias
    	 *           Mandatory string. A short ID defining the event source.
    	 * @param adapterName Mandatory String. The name of the adapter that sets up the event source and communicates with the MobileFirst server.
    	 * @param eventSource Mandatory String. The name of the event source.
    	 * @param phoneNumber Mandatory string. User phone number to which SMS notifications are sent. 
    	 * 		The phone number is provided by the user and can contain digits (0-9), plus sign (+), minus sign (-), and space ( ) characters only.
    	 * @param options Optional. A standard options object. Custom subscription parameters that are supported by the event source in the adapter can also be included in this options object.
    	 * 
    	 * @example
    	 * if (WL.Client.Push.isPushSMSSupported()){
    	 * 	WL.Client.Push.subscribeSMS( “myAlias”,”SMSAdapter”,”SMSEventSource”, “1234567890”,
    	 * 	{onSuccess: notificationSubscriptionSuccess, 
    	 * 	onFailure : notificationSubscriptionError
    	 * 	});
    	 * } 
    	 * 
    	 * function notificationSubscriptionSuccess(response){
    	 * 	alert(“Registered for SMS push notification”);
    	 * }
    	 * 
    	 * function notificationSubscriptionError(response) { 
    	 * 	alert("Error registering for SMS push notifications. " + response.errMsg); 
    	 * }
    	 * 				
    	 * @methodOf WL.Client.Push#
    	 */
    function subscribeSMS(alias: string, adapterName: string, eventSource: string, phoneNumber: string, options?: Object): void;

    /**
    	 * Unsubscribe from an event source.
    	 * @description Unsubscribes the user from the event source with the specified alias
    	 * @param alias
    	 *           Mandatory string. The event source alias, as defined in the invocation of  WL.Client.Push.onReadyToSubscribe .
    	 * @param options Optional. A standard options object. Custom subscription parameters that are supported by the event source in the adapter can also be included in this options object.
    	 * @methodOf WL.Client.Push#
    	 */
    function unsubscribe(alias: string, options?: Object): void;

    /**
    	 * Unsubscribe from a tag.
    	 * @description Unsubscribes the device from the specified tag
    	 * @param tagName
    	 *           Mandatory string. The name of the tag, as defined in the invocation of  WL.Client.Push.onReadyToSubscribe .
    	 * @param options Optional. A standard options object.
    	 * @methodOf WL.Client.Push#
    	 */
    function unsubscribeTag(tagName: string, options?: Object): void;

    /**
    	 * Unsubscribe from an SMS event source.
    	 * @description Unsubscribes the user from the SMS event source with the specified alias.
    	 * @param alias Mandatory string. The alias defined when subscribing.
    	 * @param options Optional. A standard options object. Custom subscription parameters that are supported by the event source in the adapter can also be included in this options object.
    	 * @methodOf WL.Client.Push#
    	 */
    function unsubscribeSMS(alias: string, options?: Object): void;
    
         /**
         *  Checks whether the device is able to suscribe.
         * 
    	 * @returns {boolean} true if device is able to suscribe, false otherwise
         */
    function isAbleToSubscribe(): boolean;

         /**
    	 *
         * @param {string} alias
         *
         */
    function removeOldSubscribedAliases(alias: string): void;

         /**
    	 *
         * @param {string} alias
         *
         */
    function deletePendingNotifications(alias: string): void;

         /**
    	 *
         * @param {string} alias
         * @returns {boolean}
         */
    function isAbleToSubscribeEventSource(alias: string): boolean;
    
        /**
    	 * supported only on iOS environment
         * @param {Object} alias
         *
         */   
        function checkTokenUpdatedAfterReinstall(deviceToken): void;
    
    /*
     * supported only on iOS environment
     */
    function setTokenUpdatedAfterReinstall(): void;
    
    /**
    * For Android, Windows Phone environments
    * @param {Object} serverToken
    * @param {Object} deviceToken
    * @param {Object} serverAppUserId
    * @param {Object} serverLoginUserId
    * @param {Object} appUserId
    */
    function updateTokenCallback(serverToken: Object, deviceToken: Object, serverAppUserId: Object, serverLoginUserId: Object, appUserId: Object): void;
    
    /**
    * For Windows environment 
    * @param {Object} serverToken
    * @param {Object} deviceToken
	*
    */
    function updateTokenCallback(serverToken: Object, deviceToken: Object): void;
}

declare module WL.App {

    /**
    * supported only on Android environment
    * returns the screen height
    * @returns {number} screen height
    */
    function getScreenHeight(): number;

    /**
    * supported only on Android environment
    * returns the screen width
    * @returns {number} screen width
    */
    function getScreenWidth(): number;

    /**
    * supported only on Android environment
    * retrieving screen size
    * @param {Function} callback Mandatory function. The callback function that is invoked when the size is received.
    */
    function getScreenSize(callback: Function): void;

    /**
    * supported only on Android, Windows Phone and iOS environments
    * reset server context
    */
    function resetServerContext(): void;

    /**
    * supported only on Android, Windows Phone and iOS environments
    * returns user preference value for the given key
    * @param {string} key
    * @param {Object} options
    * @param {Function} options.onSuccess
    * @param {Function} options.onFailure
    */
    function readUserPref(key: string, options: Object): void;

    /**
    * supported only on Android, Windows Phone and iOS environments
    * writes user preference with the give key,value pair
    * @param {string} key
    * @param {Object} value
    */
    function writeUserPref(key: string, value: Object): void;

    /**
    * supported only on Android, Windows Phone and iOS environments
    * get init parameters
    * @param {string} parameters
    * @param {Function} successCallback Mandatory function.
    * @param {Function} failCallback Mandatory function.
    */
    function getInitParameters(parameters: string, successCallback: Function, failCallback: Function): void;

    /**
     * supported only on Android, Windows Phone and iOS environments
     * Send an action to the native code. The action will be processed immediately, if the target receiver has been registered. 
     * Otherwise, the action will be stored in the cache and processed as soon as the target receiver becomes available (registered).
     * @param {string} action - a string that identifies target receivers; all receivers registered with the specified action will receive the message.
     * @param {Object} data - an optional data object to be passed to target receivers along with action; 
     * @param {string} tag  
     */
    function sendActionToNative(action: string, data: Object, tag: string): void;

    /**
     * supported only on Android, Windows Phone and iOS environments
     * Registers an action receiver. In JavaScript a receiver should be implemented as a callback that can receive an object.
     * @param {string} id - a string that identifies the receiver. This string will be specified in the native code when sending notifications to JavaScript.
     * @param {Function} callback - implementation of receiver. This callback will be called when an action identified by "id" is sent from the native code.
     * @param {string} tag
     */
    function addActionReceiver(id: string, callback: Function, tag: string): void;
    
    /**
    * supported only on Android, Windows Phone and iOS environments
 	* Removes (unregisters) an action receiver. All further messages addressed to this receiver will be placed to the cache. The pending
 	* messages will be delivered as soon as the receiver is registered again with the same id.
 	* @param id - a string that identifies the receiver to be unregistered.
 	*/
	function removeActionReceiver(id: string): void;
	
}



declare module WL.NativePage {

        /**
         * Supported only on Android, Windows Phone and iOS environments
         * Causes the entire application screen visible to the user, to be switched
         * by a native display.
         * 
         * @param {string} className
         *             - the name of the native class.
         * @param {Function} callback
         *            - a function object that will be called when the
         *            native page switches back to the WebView. This function will
         *            be passed a single object (JSON) parameter when invoked.
         * @param {Object} data
         *            (optional) - a JSON object that will be sent to the
         *            native class. The data must be single dimensioned
         */
    function show(className: string, callback:Function, data?: Object): void;
}

declare module WL.Device {



    /**
     * supported only on Windows environment
     * return the ID of the network adapter ID.
     * @returns {string} network adapter ID
     */
    function getHardwareIdentifier(): string;

    /**
     * Supported environments: Android, iOS, Windows Phone
     * @param {Function} callback
     */
    function getNetworkInfo(callback: Function): void;

    /** 
     * supported only on Android, Windows Phone and iOS environments
     * @param {string} friendlyName 
     * @param {Object} options
	 * @param {Function} [options.onSuccess] Success callback.
	 * @param {Function} [options.onFailure] Failure callback.
     */
    function setFriendlyName(friendlyName: string, options: Object): void;

    /**
     * supported only on Android, Windows Phone and iOS environments
     * @param {Object} options
	 * @param {Function} [options.onSuccess] Success callback.
	 * @param {Function} [options.onFailure] Failure callback.
     */
    function getFriendlyName(options: Object): void;

    /**
     * supported only on Android, Windows Phone and iOS environments
     * @param {Object} options
	 * @param {Function} [options.onSuccess] Success callback.
	 * @param {Function} [options.onFailure] Failure callback.
     */
    function getID(options: Object): void;
    
     /**
     * supported only on Windows Phone environment
     * @param {Object} options
     * @param {Function} options.onSuccess
     * @param {Function} options.onFailure
     */
    function getPublisherHostID(options: Object): void;
}

declare module WL.Client {

    /**
    * Reloads the application.
    */
    function reloadApp(): void;
}

declare module WL.Badge {

		/**
     	 * Sets the application badge to the number provided.
    	 * @description Sets the application badge to the number provided.
    	 * @note {Note} This object is only applicable to iOS and Windows Phone 8 applications.
    	 * 
    	 * 
    	 * @param number Mandatory. Integer. An integer that is displayed as a badge over the application icon. 
    	 * 		For iOS, a value lesser than or equal to 0 removes the application badge. Values that are too long (5 digits, or more) to be entirely  displayed in an iPhone device are truncated with ellipsis.
    	 *      For Windows Phone 8, a value lesser than or equal to 0 removes the application badge. A number greater than 99 sets the tile count to 99.
    	 * 
     	 * @methodOf WL.Badge#
    	 */
    function setNumber(num: number): void;
}

/**
 * ================================================================= 
 * Source file taken from :: wllogger.d.ts
 * ================================================================= 
 */


declare module WL.Logger {

		/**
    	 *
    	 * @deprecated since version 6.2. WL.Logger.on is now a no-op. WL.Logger is always enabled.
    	 *	Use WL.Logger.config with {'level': 'FATAL'} to reduce verbosity.
    	 * 
    	 * @returns {this} Returns the current instance.
    	 * 
    	 * @methodOf WL.Logger#
    	 */
    function on(options: Object): Object;

		/**
    	 *
    	 * Configures the logger globally.  This means every logger instance created using WL.Logger.create, all uses of the global
    	 * WL.Logger functions and any native API calls to the MobileFirst logger API are affected.
    	 *
    	 * @example
    	 * WL.Logger.config()
    	 *
    	 * Merge the passed object parameter with the current configuration, which can be retrieved using WL.Logger.status()
    	 *
    	 * @param {object} [options] Defines the logger's behavior.
    	 * @param {boolean} [options.stringify] Turns arguments to strings and concatenates them (true) or leaves arguments as an array (false). Default is true.
    	 * @param {boolean} [options.pretty] Turn JSON into a human readable format. Default is false. 
    	 * @param {boolean} [options.stacktrace] Enable/disable printing the stacktrace from an error message. Default is false.
    	 * @param {function} [options.callback] Called after a log message is sent to the console with the following parameters:
    	 * 		
    	 * 			message: (string or array) The log message. String if stringify is true, array otherwise.
    	 * 			level: (string) Log level.
    	 * 			package: (string) Package that is associated with the log or empty string.
    	 * 		
    	 * @param {string} [options.pkg] Associates log messages with a package. By default does not associate (includes an empty string).
    	 * @param {object} [options.tag] Contains keys: level and tag. 
    	 * @param {boolean} [options.tag.level] Appends log level tag to the string log message (true) or does nothing (false). Default is false.
    	 * @param {boolean} [options.tag.pkg] Appends package name string message (true) or does nothing (false). Default is false.
    	 * @param {string[]} [options.whitelist] List of packages from which to log messages. By default logs all messages (empty array).  DEPRECATED since V6.2; use filters instead.
    	 * @param {string[]} [options.blacklist] List of packages to ignore log messages from. By default does not ignore any packages (empty array).  DEPRECATED since V6.2; use filters instead.
    	 * @param {object} [options.filters] Object with key/value pairs like {'package': 'LEVEL'} for packages to log.  This is treated as a whitelist; only log
    	 *     calls for instances matching pkg will be logged.  Default is to log all messages (empty object).  Explicitly pass an empty object or null (not undefined) to remove filters.
    	 * @param {boolean} [options.capture] Turn log capture on or off.  This is meaningful in hybrid environments only.
    	 * @param {integer} [options.maxFileSize] Maximum amount of data (in bytes) to store in the file when capture is on.  This is meaningful in hybrid environments only.  Default is true.
    	 * @param {string[]|string|number} [options.level] A list of one or more of the following items:
    	 * 		
    	 * 			An array of the log levels to show.  In JavaScript, only log calls at the listed levels are shown.  In native code in a hybrid app, log output at and above the most verbose of the levels listed in the array are shown.
    	 * 			The name of the log level at which to set the logger.  Output will be printed for log API calls at and above the configured level.
    	 * 			The Numeric Priority Level at which to set the logger.  Output will be printed for log API calls at and above the configured level.
    	 * 		
    	 * 		Default: Show all logs at all levels (empty array).
    	 * 
    	 * @returns {this} Returns the current instance.
    	 * 							 
    	 * @methodOf WL.Logger#
    	 */
    function config(options: Object): Object;

		/**
    	 * @deprecated since version 6.2. WL.Logger.off is now a NOP. WL.Logger is always enabled.
    	 *	Use WL.Logger.config with {'level': 'FATAL'} to reduce verbosity.
    	 *
    	 * @returns {this} Returns the current instance.
    	 * 
    	 * @methodOf WL.Logger#
    	 */
    function off(): Object;

		/**
    	 * Shows the status (current configuration) of the logger.
    	 *
    	 * @example
    	 * WL.Logger.status()
    	 *
    	 * .then(function (state) {
    	 * //{ enabled : true, stringify: true, filters : {},
    	 * // level : 'info', pkg : '', tag: {level: false, pkg: true} }
    	 * })
    	 *
    	 * .fail(function (errMsg) {
    	 *   //errMsg = error message
    	 * });
    	 *
    	 * @returns {Promise} Resolved with current status, rejected with an error message.
    	 *
    	 * @methodOf WL.Logger#
    	 */
    function status(): Promise;

		/**
    	 * Updates the state (also called context or status) of the logger.
    	 *
    	 * @example
    	 * WL.Logger.debug('Hello world'); //No context passed
    	 * //Hello world
    	 *
    	 * WL.Logger.ctx({pkg: 'hello'}).debug('Hello world'); //Package name context passed
    	 * //[hello] Hello world
    	 *
    	 * Caution: filters, maxFileSize, capture, and level returned from this call may not accurately reflect the current behavior
    	 *    in hybrid applications if the native codebase has modified these settings in the native application layer.
    	 * 
    	 * @param {object} [options] See arguments defined for WL.Logger.config for information about the object that can be passed.
    	 * 
    	 * @returns {this} Returns the current instance.
    	 * 
    	 * @methodOf WL.Logger#
    	 */
    function ctx(options: Object): Object;

		/**
    	 * Prints arguments to the console. Has a priority of 600 and a level of TRACE.
    	 *
    	 * @example
    	 * WL.Logger.trace('Hello world');
    	 * //Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#trace
    	 */
    function trace(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 500 and a level of DEBUG.
    	 *
    	 * @example
    	 * WL.Logger.debug('Hello world');
    	 * //Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#debug
    	 */
    function debug(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 400 and a level of LOG.
    	 *
    	 * @example
    	 * WL.Logger.log('Hello world');
    	 * //Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#log
    	 */
    function log(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 300 and a level of INFO.
    	 *
    	 * @example
    	 * WL.Logger.info('Hello world');
    	 * //Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#info
    	 */
    function info(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 200 and a level of WARN.
    	 *
    	 * @example
    	 * WL.Logger.warn('Hello world');
    	 * //Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#warn
    	 */
    function warn(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 100 and a level of ERROR.
    	 *
    	 * @example
    	 * WL.Logger.error('Hello world');
    	 * //Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#error
    	 */
    function error(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 50 and a level of FATAL.
    	 *
    	 * @example
    	 * WL.Logger.fatal('Hello world');
    	 * //Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#fatal
    	 */
    function fatal(message: any): void;

		/**
    	 * Creates an instance of a logger with its own context (also called status or state).
    	 * 
    	 * @example
    	 * var logger = WL.Logger.create({pkg: 'mypackage'});
    	 *
    	 * logger.trace('Hello world');
    	 * //[mypackage] Hello world
    	 *
    	 * logger.debug('Hello world');
    	 * //[mypackage] Hello world
    	 *
    	 * logger.log('Hello world');
    	 * //[mypackage] Hello world
    	 *
    	 * logger.info('Hello world');
    	 * //[mypackage] Hello world
    	 *
    	 * logger.warn('Hello world');
    	 * //[mypackage] Hello world
    	 *
    	 * logger.error('Hello world');
    	 * //[mypackage] Hello world
    	 *
    	 * logger.fatal('Hello world');
    	 * //[mypackage] Hello world
    	 * 
    	 * @param {Object} [options] See arguments defined for WL.Logger.config for information about the object that can be passed.
    	 *
    	 * @returns {LogInstance} Has the following methods from WL.Logger: .trace, .debug, .log, 
    	 * .info, .warn, .error, and .fatal.
    	 * @methodOf WL.Logger#
    	 */
    function create(options: Object): WL.LogInstance;

		/**
    	 *
    	 * @deprecated since version 6.2.  Use WL.Logger.config instead.
    	 *
    	 * Sets options in native application layer (iOS and Android only)
    	 * 
    	 * @example
    	 * WL.Logger.setNativeOptions(
    	 *     {
    	 *         maxFileSize : 100000,              // allow persistent storage of up to 100k of log data
    	 *         level : 'debug',                   // at debug (and above) level
    	 *         capture : true,                    // capture data passed to log API calls into persistent storage
    	 *         filters : { jsonstore : 'debug' }  // establish whitelist filters at native
    	 *     }
    	 * );
    	 * 
    	 * @param {Object} [options] an object that optionally contains any of the following key/value pairs:
    	 * 
    	 * 
    	 *     maxFileSize: integer (minimum allowed is 10000 (in bytes))
    	 *     level: String (any of the following values: 'trace', debug', 'log', 'info', 'warn', 'error', 'fatal')
    	 *     capture: boolean
    	 *     
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#setNativeOptions
    	 */
    function setNativeOptions(options: Object): void;

		/**
    	 * Attach additional metadata to the next logger instance call.
    	 * 
    	 * @example
    	 * WL.Logger.metadata(
    	 *     {
    	 *         userRealName : 'Robert Paulson'
    	 *     }
    	 * );
    	 * 
    	 * @example
    	 * WL.Logger.metadata( { hi : 'world' } ).info('hello');
    	 * 
    	 * @param {Object} [options] an object to attach to the next logger instance call
    	 * 
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#metadata
    	 */
    function metadata(options: Object): Object;

		/**
    	 *
    	 * Send any logs collected up to this point to the IBM MobileFirst server.
    	 * 
    	 * @returns {Promise} Resolved with success status, rejected with an error message.
    	 * 
    	 * @methodOf WL.Logger#
    	 * @name WL.Logger#send
    	 */
    function send(): Promise;

		/**
    	 * Retrieves and applies any matching configuration profile from the IBM MobileFirst Server.
    	 * A matching configuration profile acts as an override of the local configuration.
    	 * Configuration profiles are defined by the IBM Worklight administrator in the MobileFirst
    	 * admin console.  Restores to original settings when the server indicates that no
    	 * matching configuration profile exists.
    	 *
    	 * This API call is only applicable in Android and IOS environments.  It is a safe, but no-op,
    	 * call in other environments.
    	 *
    	 * @methodOf WL.Logger#
    	 * @return promise
    	 */
    function updateConfigFromServer(): Promise;
}

declare module WL{
  class LogInstance {

		/**
    	 * Prints arguments to the console. Has a priority of 600 and a level of TRACE.
    	 *
    	 * @example
    	 * var logger = WL.Logger.create({pkg: 'myapp'});
    	 * logger.trace('Hello world');
    	 * //[myapp] Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf LogInstance#
    	 * @name LogInstance#trace
    	 */
     trace(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 500 and a level of DEBUG.
    	 *
    	 * @example
    	 * var logger = WL.Logger.create({pkg: 'myapp'});
    	 * logger.debug('Hello world');
    	 * //[myapp] Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf LogInstance#
    	 * @name LogInstance#debug
    	 */
     debug(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 400 and a level of LOG.
    	 *
    	 * @example
    	 * var logger = WL.Logger.create({pkg: 'myapp'});
    	 * logger.log('Hello world');
    	 * //[myapp] Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf LogInstance#
    	 */
     log(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 300 and a level of INFO.
    	 *
    	 * @example
    	 * var logger = WL.Logger.create({pkg: 'myapp'});
    	 * logger.info('Hello world');
    	 * //[myapp] Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf LogInstance#
    	 * @name LogInstance#info
    	 */
     info(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 200 and a level of WARN.
    	 *
    	 * @example
    	 * var logger = WL.Logger.create({pkg: 'myapp'});
    	 * logger.warn('Hello world');
    	 * //[myapp] Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf LogInstance#
    	 * @name LogInstance#warn
    	 */
     warn(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 100 and a level of ERROR.
    	 *
    	 * @example
    	 * var logger = WL.Logger.create({pkg: 'myapp'});
    	 * logger.error('Hello world');
    	 * //[myapp] Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf LogInstance#
    	 * @name LogInstance#error
    	 */
     error(message: any): void;

		/**
    	 * Prints arguments to the console. Has a priority of 50 and a level of FATAL.
    	 *
    	 * @example
    	 * var logger = WL.Logger.create({pkg: 'myapp'});
    	 * logger.fatal('Hello world');
    	 * //[myapp] Hello world
    	 *
    	 * @param message One or more messages of any data type.
    	 * 
    	 * @methodOf LogInstance#
    	 * @name LogInstance#fatal
    	 */
     fatal(message: any): void;
}
}

/**
 * ================================================================= 
 * Source file taken from :: wlproperties.d.ts
 * ================================================================= 
 */

declare module WL{

var AppProperty : {
  AIR_ICON_16x16_PATH: string,
  AIR_ICON_128x128_PATH: string,
  DOWNLOAD_APP_LINK: string,
  ENVIRONMENT: string,
  APP_DISPLAY_NAME: string,
  APP_LOGIN_TYPE: string,
  APP_VERSION: string,
  HEIGHT: string,
  IID: string,
  LATEST_VERSION: string,
  LOGIN_DISPLAY_TYPE: string,
  LOGIN_REALM: string,
  MAIN_FILE_PATH: string,
  SHOW_IN_TASKBAR: string,
  THUMBNAIL_IMAGE_URL: string,
  WELCOME_PAGE_URL: string,
  WIDTH: string,
  WORKLIGHT_ROOT_URL: string,
  WORKLIGHT_RELATIVE_URL: string,
  APP_SERVICES_URL: string,
  APP_SERVICES_RELATIVE_URL: string,
  WLCLIENT_TIMEOUT_IN_MILLIS: string
};

var AppLoginType : {
  LOGIN_ON_STARTUP: string,
  LOGIN_ON_DEMAND: string,
  NO_LOGIN: string
};

var UserInfo : {
  IS_USER_AUTHENTICATED: string,
  USER_NAME: string,
  LOGIN_NAME: string,
  USER_ID: string
};

var Orientation : {
  AUTO: number,
  LANDSCAPE: number,
  PORTRAIT: number
};

var FixedViewType : {
  TOP: string,
  BOTTOM: string
};

var Language : {
  DIRECTION_LTR: number,
  DIRECTION_RTL: number,
  LANGUAGES_RTL: string[]
};


var WLErrorCode : {
  UNEXPECTED_ERROR: string,
  API_INVOCATION_FAILURE: string,
  USER_INSTANCE_ACCESS_VIOLATION: string,
  AUTHENTICATION_REQUIRED: string,
  DOMAIN_ACCESS_FORBIDDEN: string,

  // Client Side Errors
  UNRESPONSIVE_HOST: string,
  LOGIN_FAILURE: string,
  REQUEST_TIMEOUT: string,
  PROCEDURE_ERROR: string,
  UNSUPPORTED_VERSION: string,
  UNSUPPORTED_BROWSER: string,
  DISABLED_COOKIES: string,
  CONNECTION_IN_PROGRESS: string,
  AUTHORIZATION_FAILURE: string,
  CHALLENGE_HANDLING_CANCELED: string
};

var FBRealmPopupOptions : {
  width: number,
  height: number
};

var EPField : {

  // NOTICE - value must be equal to the field name!!!
  SUPPORT_COOKIES: string,
  DESKTOP: string,
  WEB: string,
  MOBILE: string,
  USES_AUTHENTICATOR: string,
  SAVES_USERNAME: string,
  HAS_NATIVE_LOGGER: string,
  USES_NATIVE_TOOLBAR: string,
  USES_CORDOVA: string,
  SUPPORT_DIRECT_UPDATE_FROM_SERVER: string,
  SUPPORT_DIAGNOSTIC: string,
  ISIOS: string,
  SUPPORT_PUSH: string,
  SUPPORT_PUSH_SMS: string,
  WEB_BROWSER_ONLY: string,
  SUPPORT_CHALLENGE: string,
  SUPPORT_SHELL: string,
  SUPPORT_DEVICE_AUTH: string,
  SERVER_ADDRESS_CONFIGURABLE: string,
  SUPPORT_WL_USER_PREF: string,
  SUPPORT_WL_NATIVE_XHR: string,
  SUPPORT_WL_SERVER_CHANGE: string,
  SUPPORT_OAUTH: string
};


var BaseProfileData : {
  SUPPORT_COOKIES: boolean,
  SUPPORT_DIRECT_UPDATE_FROM_SERVER: boolean,
  SUPPORT_DIAGNOSTIC: boolean,
  SUPPORT_PUSH: boolean,
  SUPPORT_PUSH_SMS: boolean,
  SUPPORT_DEVICE_AUTH: boolean,
  SERVER_ADDRESS_CONFIGURABLE: boolean,
  SUPPORT_WL_USER_PREF: boolean
};

var WebProfileData : {
  WEB: boolean
};


var DesktopProfileData : {
  DESKTOP: boolean,
  USES_AUTHENTICATOR: boolean,
  SAVES_USERNAME: boolean
};

var MobileProfileData : {
  USES_AUTHENTICATOR: boolean,
  SAVES_USERNAME: boolean
};

}

/**
 * ================================================================= 
 * Source file taken from :: wlresourcerequest.d.ts
 * ================================================================= 
 */

declare class WLResourceRequest {
    
    /**
 	* @class
 	* The WLResourceRequest object is used to send a request to any protected or unprotected resource using an absolute or relative URL.
 	* It exposes a set of methods that allow you to set up and configure the requested object.
 	* 
 	* If a request is sent to a protected resource, the <code>WLResourceRequest object automatically handles the MobileFirst OAuth-based security model 
 	* protocol and invokes the required challenges.
 	* The WLAuthorizationManager and WLResourceRequest classes are supported for the following hybrid environments only: 
 	* Android, iOS, Windows Phone 8 and Window 8.
 	* 
 	* @param {string} url Mandatory. Specifies absolute or relative URL. If you send a request to an adapter, you must add the /adapters path element.
 	* For example: /adapters/myAdapterName/myMethodName
	* @param {string} method Mandatory. Request method, usually WLResourceRequest.GET or WLResourceRequest.POST
 	* @param {number} timeout Optional. Request timeout, in milliseconds.
 	* 
 	* @example
 	* var request = new WLResourceRequest('/adapters/sampleAdapter/multiplyNumbers', WLResourceRequest.GET);
 	* request.setQueryParameter('params', [5, 6]);
 	* request.send().then(
 	*      function(response) {
 	*          // success flow, the result can be found in response.responseJSON
 	*      },
 	*      function(error) {
 	*          // failure flow
 	*          // the error code and description can be found in error.errorCode and error.errorMsg fields respectively
 	*      }
 	* );
 	*
 	* @name WLResourceRequest
 	*/
    	constructor(_url: string, _method: string, _timeout: number);

		/**
         * @description Returns request URL. The URL must have been passed to the constructor.
         * @methodOf WLResourceRequest#
         */
		getUrl(): string;

		/**
         * @description Returns current request method. A valid request method must have been passed to constructor.
         * @methodOf WLResourceRequest#
         */
		getMethod(): string;

		/**
         * @description Returns query parameters as a JSON object with key-value pairs.
         * @methodOf WLResourceRequest#
         */
		getQueryParameters(): Object;

		/**
    	 * @description Sets query parameters.
    	 * @param {object} parameters Optional. A JSON object with key-value pairs. 
    	 * If this parameter is null, or undefined, the query parameters are cleared.
         * @methodOf WLResourceRequest#
    	 */
		setQueryParameters(parameters?: Object): void;

		/**
    	 * @description Sets a new query parameter. If a parameter with the same name already exists, it will be replaced.
    	 * @param {String} name Mandatory. Parameter name.
    	 * @param value Mandatory. Parameter value. Should be string, number or boolean.
         * @methodOf WLResourceRequest#
    	 */
		setQueryParameter(name: string, value: string|number|boolean): void;

		/**
    	 * @description Returns array of header values.
    	 * @param {string} name Optional. Header name. If header name is specified, this function returns an array of header values 
    	 * stored with this header, or undefined, if the specified header name is not found. If name is null, or undefined,
    	 * this function returns all headers.
         * @methodOf WLResourceRequest#
    	 */
		getHeaders(name?: string): Object[];

		/**
    	 * @description Returns array of header names. It can be empty, if no headers have been added.
         * @methodOf WLResourceRequest#
    	 */
		getHeaderNames(): string[];

		/**
    	 * @description Returns a first header value stored with the specified header name. The value is returned as a string. 
    	 * Can be undefined if a header with the specified name does not exist.
    	 * @param {String} name Mandatory. Header name.
         * @methodOf WLResourceRequest#
    	 */
		getHeader(name: string): string;

		/**
    	 * @description Sets request headers. The existing headers are replaced. 
    	 * @param {Object} requestHeaders Optional. JSON object with request headers. Each header value should be either string, or array of strings. This function 
    	 * throws an error if one of the specified header values is not valid. If this parameter is not specified, all headers will be removed.
         * @methodOf WLResourceRequest#
    	 */
		setHeaders(requestHeaders?: Object): void;

		/**
    	 * @description Sets a new header or replaces an existing header with the same name.
    	 * @param {String} name Mandatory. Header name.
    	 * @param value Mandatory. Header value. The value must be of a simple type (string, boolean or value).
         * @methodOf WLResourceRequest#
    	 */
		setHeader(name: string, value: string|number|boolean): void;

		/**
    	 * @description Adds a new header. If a header with the same name already exists, the header value will be added to the existing header. The name is 
    	 * case insensitive.
    	 * @param {String} name Mandatory. Header name.
    	 * @param value Mandatory. Header value. The value must be of a simple type (string, number or boolean).
         * @methodOf WLResourceRequest#
    	 */
		addHeader(name: string, value: string|number|boolean): void;

		/**
    	 * @description Returns request timeout, in milliseconds.
         * @methodOf WLResourceRequest# 
    	 */
		getTimeout(): number;

		/**
    	 * @description Sets request timeout. If timeout is not specified, then a default timeout will be used.
    	 * @param {Integer} requestTimeout Mandatory. Request timeout, in milliseconds.
         * @methodOf WLResourceRequest#
    	 */
		setTimeout(requestTimeout: number): void;

		/**
    	 * @description Sends the request to a server.
    	 * @param content Optional. Body content. It can be of a simple type (like string), object, or undefined.
    	 * @returns Promise
         * @example
    	 * var request = WLResourceRequest(url, method, timeout);
    	 * request.send(content).then(
    	 *   function(response) {
    	 *     // success flow
    	 *   },
    	 * 	 function(error) {
    	 *     // fail flow
    	 *   }
    	 * );
         *
         * @methodOf WLResourceRequest#
    	 */
		send(content: any): Promise;

		/**
    	 * @description Sends the request to a server with URL encoded form parameters.
    	 * @param {Object} json Mandatory. Body content as JSON object or string as form data. The JSON object values must be a simple type.
    	 * The content type will be set to application/x-www-form-urlencoded.
    	 * @returns Promise
         * @example
    	 * var request = WLResourceRequest(url, method, timeout);
    	 * request.send(json).then(
    	 *   function(response) {
    	 *     // success flow
    	 *   },
    	 *   function(error) {
    	 *     // fail flow
    	 *   }
    	 * );
    	 *
         * @methodOf WLResourceRequest#
    	 */
		sendFormParameters(json: Object): Promise;
    
    static GET: string;
	static POST: string;
	static PUT: string;
	static DELETE: string;
	static HEAD: string;
	static OPTIONS: string;
	static TRACE: string;
	static CONNECT: string;
}


/**
 * ================================================================= 
 * Source file taken from :: worklight.d.ts
 * ================================================================= 
 */

declare module WL.Events {
	var WORKLIGHT_IS_CONNECTED: string;
	var WORKLIGHT_IS_DISCONNECTED: string;
}	

declare module WL.Environment {
	var PREVIEW: string;
	var IPHONE: string;
	var IPAD: string;
	var DESKTOPBROWSER: string;
	var ADOBE_AIR: string;
	var ANDROID: string;
	var BLACKBERRY10: string;
	var WINDOWS_PHONE_8: string;
	var WINDOWS8: string;
	var MOBILE_WEB: string;
}
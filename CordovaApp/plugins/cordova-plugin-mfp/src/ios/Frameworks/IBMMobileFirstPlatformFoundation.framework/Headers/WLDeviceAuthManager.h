/**
	Licensed Materials - Property of IBM

	(C) Copyright 2015 IBM Corp.

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

//
//  WLDeviceAuthManager.h
//  WorklightStaticLibProject
//

#import <Foundation/Foundation.h>
//#import <CommonCrypto/CommonDigest.h>

// TO DO : check if this class should be visible or not
@interface WLDeviceAuthManager : NSObject

/*
 * Get the DeviceAuthManager singleton instance 
 */
+ (WLDeviceAuthManager *) sharedInstance;

/*
 * Get the alias used for client user x509 certificate.  Entity is currently not used.
 */
+ (NSString *) getAlias:(NSString *)entity;

/*
 * Get certififacte Label as used when saved in keychain.
 */
+ (NSData *) getCertificateIdentifierFromEntity:(NSString *)provisioningEntity;

/*
 * Get private/public key Label as used when saved in keychain.
 */
+ (NSData *) getKeyIdentifier:(BOOL)isPublic withEntity:(NSString *)provisioningEntity;

/*
 * This method signs on a given content according to JSW standard.
 * We'll using the public key
 * Sign the header and payload with SHA256 / RSA 512 
 * payloadJSON- NSMutableDictionary with the content sign on.
 * return - the signed string.
 */
+ (NSString *) signDeviceAuth:(NSDictionary *) payloadJSON entity:(NSString *) provisioningEntity isPEnabled:(BOOL) isProvisioningEnabled;

//Call this initializer only
-(WLDeviceAuthManager *) init;
-(NSString *) createUUID;
-(NSString *) getWLUniqueDeviceId;
-(NSDictionary *) getDeviceData;

/*
 * Cleans Device Provisioning Certificate from KeyChain
 */
+ (BOOL) clearDeviceCertCredentialsFromKeyChain:(NSString *)provisioningEntity;


@end


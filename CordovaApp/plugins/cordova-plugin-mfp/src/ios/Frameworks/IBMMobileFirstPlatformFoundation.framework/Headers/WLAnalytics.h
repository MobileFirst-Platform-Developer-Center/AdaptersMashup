/**
	Licensed Materials - Property of IBM

	(C) Copyright 2015 IBM Corp.

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

#import <Foundation/Foundation.h>
#import "WLDelegate.h"

/**
 Contains WLAnalytics methods that manage analytics logs.
 */
@interface WLAnalytics : NSObject

typedef NSString* DeviceEvent;
FOUNDATION_EXPORT DeviceEvent const LIFECYCLE;
FOUNDATION_EXPORT DeviceEvent const NETWORK;

@property (strong, nonatomic) NSMutableDictionary *config;

+ (WLAnalytics *) sharedInstance;

/**
 This method adds a DeviceEvent for Analytics to collect
 @param deviceEvent the DeviceEvent to collect
 */
- (void)addDeviceEventListener:(DeviceEvent)deviceEvent;

/**
 Disable analytics from collecting the specified DeviceEvent
 @param deviceEvent the DeviceEvent to remove
 */
- (void)removeDeviceEventListener:(DeviceEvent)deviceEvent;

/**
 This method enables capturing of analytics log data
 @since IBM Worklight V6.2.0
 */
- (void) enable;

/**
 This method disables capturing of analytics log data
 @since IBM Worklight V6.2.0
 */
- (void) disable;

/**
 This method sends the log file when the log buffer exists and is not empty.
 @since IBM Worklight V6.2.0
 */
- (void) send;

/**
 This method is the same as send, with the addition of a delegate that is notified when the send request succeeds or fails.
 @param userSendAnalyticsDelegate WLDelegate that handles the result of the send request with the onSuccess and onFailure methods.
 @see send
 @since IBM MobileFirst Platform V7.0.0
 */
- (void) sendWithDelegate:(id<WLDelegate>)userSendAnalyticsDelegate;

/**
 This method logs analytics data
 @param String message to be logged
 @param metadata Dictionary containing metadata to append to the log output
 @since Worklight V6.2.0
 */
- (void) log:(NSString*)message withMetadata:(NSDictionary*)metadata;

/**
 This is a convenience method to generate analytics metadata. Use this when you want to log network requests that are not using IBM MobileFirst network APIs.
 @param url Name of the URL that the network request is being sent to.
 @return metadata NSDictionary to be used in the log:withMetadata: method.
 @see generateNetworkResponseMetadataWithResponseData:andTrackingId:
 @since IBM MobileFirst Platform V7.0.0
 */
- (NSDictionary*) generateNetworkRequestMetadataWithURL:(NSString*)url;

/**
 This is a convenience method to generate analytics metadata. Use this when you want to log network responses that are not using IBM MobileFirst network APIs.
 @param data The response data returned from the network request. This parameter can be nil.
 @param trackingId The unique ID that matches this network response to its corresponding network request. This is given in the metadata returned from the WLAnalytics generateNetworkRequestMetadataWithURL:url method.
 @return metadata NSDictionary to be used in the log:withMetadata: method.
 @see generateNetworkRequestMetadataWithURL:
 @since IBM MobileFirst Platform V7.0.0
 */
- (NSDictionary*) generateNetworkResponseMetadataWithResponseData:(NSData*)data andTrackingId:(NSString*)trackingId;

/**
 This method will set the user context of the app. If collecting the USER DeviceEvent, this context change will be reported to Analytics.
 @param user the user name of the current user. This value will be hashed to provide anonimity.
 */
- (void)setUserContext:(NSString *)user;

/**
 Unset any user context previously set. Use this when user explicitly logs out or is no longer active.
 */
- (void)unsetUserContext;

- (void)logAppForeground;
- (void)logAppBackground;
- (void)logAppCrash;


@end

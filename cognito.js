var params = {
	IdentityPoolId: "Yus-east-2:bb28458e-d1f1-45b7-9a10-986617014c29"
};

// set the Amazon Cognito region
AWS.config.region = 'us-east-1';
// initialize the Credentials object with our parameters
AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

// We can set the get method of the Credentials object to retrieve
// the unique identifier for the end user (identityId) once the provider
// has refreshed itself
AWS.config.credentials.get(function(err) {
	if (err) {
		console.log("Error: "+err);
		return;
	}
	console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);

	// Other service clients will automatically use the Cognito Credentials provider
	// configured in the JavaScript SDK.
	var cognitoSyncClient = new AWS.CognitoSync();
	cognitoSyncClient.listDatasets({
		IdentityId: AWS.config.credentials.identityId,
		IdentityPoolId: "us-east-2:bb28458e-d1f1-45b7-9a10-986617014c29"
	}, function(err, data) {
		if ( !err ) {
			console.log(JSON.stringify(data));
		}
	});
});


import com.amazonaws.services.cognitoidentity.*;
import com.amazonaws.services.cognitoidentity.model.*;
import com.amazonaws.services.securitytoken.*;
import com.amazonaws.services.securitytoken.model.*;
import com.amazonaws.auth.*;

// initialize the Cognito identity client with a set
// of anonymous AWS credentials
AmazonCognitoIdentity identityClient = new AmazonCognitoIdentityClient(new AnonymousAWSCredentials());
			
// send a get id request. This only needs to be executed the first time
// and the result should be cached.
GetIdRequest idRequest = new GetIdRequest();
idRequest.setAccountId("703135309443");
idRequest.setIdentityPoolId("us-east-2:bb28458e-d1f1-45b7-9a10-986617014c29");
// If you are authenticating your users through an identity provider
// then you can set the Map of tokens in the request
// Map providerTokens = new HashMap();
// providerTokens.put("graph.facebook.com", "facebook session key");
// idRequest.setLogins(providerTokens);
			
GetIdResult idResp = identityClient.getId(idRequest);
			
String identityId = idResp.getIdentityId();

// TODO: At this point you should save this identifier so you won't
// have to make this call the next time a user connects



// Create the request object
GetOpenIdTokenRequest tokenRequest = new GetOpenIdTokenRequest();
tokenRequest.setIdentityId(identityId);
// If you are authenticating your users through an identity provider
// then you can set the Map of tokens in the request
// Map providerTokens = new HashMap();
// providerTokens.put("graph.facebook.com", "facebook session key");
// tokenRequest.setLogins(providerTokens);
			
GetOpenIdTokenResult tokenResp = identityClient.getOpenIdToken(tokenRequest);
// get the OpenID token from the response
String openIdToken = tokenResp.getToken();


AWSSecurityTokenService stsClient = new AWSSecurityTokenServiceClient(new AnonymousAWSCredentials());
AssumeRoleWithWebIdentityRequest stsReq = new AssumeRoleWithWebIdentityRequest();
stsReq.setRoleArn("arn:aws:iam::6157xxxxxxxx:role/a_valid_aws_role_arn");
stsReq.setWebIdentityToken(awsAccessToken);
stsReq.setRoleSessionName("AppTestSession");
			
AssumeRoleWithWebIdentityResult stsResp = stsClient.assumeRoleWithWebIdentity(stsReq);
Credentials stsCredentials = stsResp.getCredentials();

// Create the session credentials object
AWSSessionCredentials sessionCredentials = new BasicSessionCredentials(
	stsCredentials.getAccessKeyId(),
	stsCredentials.getSecretAccessKey(),
	stsCredentials.getSessionToken()
);
// save the timeout for these credentials 
Date sessionCredentialsExpiration = stsCredentials.getExpiration();

// these credentials can then be used to initialize other AWS clients,
// for example the Amazon Cognito Sync client
AmazonCognitoSync syncClient = new AmazonCognitoSyncClient(sessionCredentials);
ListDatasetsRequest syncRequest = new ListDatasetsRequest();
syncRequest.setIdentityId(idResp.getIdentityId());
syncRequest.setIdentityPoolId("us-east-2:bb28458e-d1f1-45b7-9a10-986617014c29");
ListDatasetsResult syncResp = syncClient.listDatasets(syncRequest);

import { Auth } from '@aws-amplify/auth';
import { API } from '@aws-amplify/api';
import { Amplify, Signer } from '@aws-amplify/core';

// Sign a request using Amplify Auth and Signer
async function signRequest(url, method, service, region) {
  try {
    const essentialCredentials = await Auth.essentialCredentials(Auth.currentCredentials());
    const params = { method, url };
    const credentials = {
      secret_key: essentialCredentials.secretAccessKey,
      access_key: essentialCredentials.accessKeyId,
      session_token: essentialCredentials.sessionToken,
    };
    const serviceInfo = { region, service };
    return Signer.sign(params, credentials, serviceInfo);
  } catch (error) {
    console.error("Error signing request:", error);
    throw error;  // Rethrow to handle the error upstream
  }
}

// Save configuration
async function saveConfig(config) {
  try {
    const apiName = 'config';
    const path = '/configuration';
    const url = await API.endpoint(apiName) + path;
    const signedRequest = await signRequest(url, 'POST', 'execute-api', 'ap-southeast-1');
    const request = {
      headers: signedRequest.headers,
      body: config,
    };

    const response = await API.post(apiName, path, request);
    console.log("Save Configuration Response:", response);
    return response;
  } catch (error) {
    console.error("Error saving configuration:", error);
    throw error;  // Rethrow to handle the error upstream
  }
}

// Get configuration data
async function getData() {
  try {
    const apiName = 'config';
    const path = '/configuration';
    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.idToken.jwtToken;
    const request = {
      headers: { Authorization: token },
    };

    const response = await API.get(apiName, path, request);
    console.log("Get Configuration Data Response:", response);
    return response;
  } catch (error) {
    console.error("Error retrieving configuration data:", error);
    throw error;  // Rethrow to handle the error upstream
  }
}

// Deploy configuration
async function deploy() {
  try {
    const apiName = 'deploy';
    const path = '/deploy';
    const url = await API.endpoint(apiName) + path;
    const signedRequest = await signRequest(url, 'GET', 'execute-api', 'ap-southeast-1');

    const request = { headers: signedRequest.headers };
    const response = await API.get(apiName, path, request);
    console.log("Deploy Configuration Response:", response);
    return response;
  } catch (error) {
    console.error("Error deploying configuration:", error);
    throw error;  // Rethrow to handle the error upstream
  }
}

export { getData, deploy, saveConfig };

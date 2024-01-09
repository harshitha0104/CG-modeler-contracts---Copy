"use strict";

///////////////////////////////////////////////////////////////////////////////////////////////
//                 IMPORTANT - DO NOT MODIFY AUTO-GENERATED CODE OR COMMENTS                 //
//Parts of this file are auto-generated and modifications to those sections will be          //
//overwritten. You are allowed to modify:                                                    //
// - the tags in the jsDoc as described in the corresponding section                         //
// - the function name and its parameters                                                    //
// - the function body between the insertion ranges                                          //
//         "Add your customizing javaScript code below / above"                              //
//                                                                                           //
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Use the following jsDoc tags to describe the BL function. Setting these tags will
 * change the runtime behavior in the mobile app. The values specified in the tags determine
 * the name of the contract file. The filename format is “@this . @function .bl.js”.
 * For example, LoVisit.BeforeLoadAsync.bl.js
 * -> function: Name of the businessLogic function.
 * -> this: The LO, BO, or LU object that this function belongs to (and it is part of the filename).
 * -> kind: Type of object this function belongs to. Most common value is "businessobject".
 * -> async: If declared as async then the function should return a promise.
 * -> param: List of parameters the function accepts. Make sure the parameters match the function signature.
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> extends: Base class of the LO, BO, and LU objects that this function belongs to.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function startMobileLinkTransition
 * @this LoSysMobileLink
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {String} card
 * @param {Object} schemeName
 * @param {Object} assetType
 * @param {Object} assetId
 * @param {Object} orgId
 * @param {Object} loginHost
 * @param {Object} dashboardState
 * @param {Object} accountNumber
 * @param {DomLongText} quickAccessURL
 * @param {Object} accountId
 * @returns promise
 */
function startMobileLinkTransition(card, schemeName, assetType, assetId, orgId, loginHost, dashboardState, accountNumber, quickAccessURL, accountId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//Note: Regex needed to replace mocros in URL. Might be that same macro is used several times in the URL.

var url;
var macroReplacedData;

if(card === "QuickAccess"){  
  macroReplacedData = quickAccessURL;
}
else{
  macroReplacedData = dashboardState;
}

macroReplacedData = macroReplacedData.replace(/\$EMPLOYEENUMBER\$/g, ApplicationContext.get('user').getEmployeeNumber()); 
macroReplacedData = macroReplacedData.replace(/\$SALESORG\$/g, ApplicationContext.get('user').getSalesOrg()); 
if(Utils.isDefined(accountNumber)) {
  macroReplacedData = macroReplacedData.replace(/\$ACCOUNTNUMBER\$/g, accountNumber);
}
if(Utils.isDefined(accountId)) {
  macroReplacedData = macroReplacedData.replace(/\$ACCOUNTID\$/g, accountId);
}

if(card === "QuickAccess"){  
  //Use the following format to make a request to external app.
  //<scheme_name>://<url>  
  url = schemeName + '://' + macroReplacedData;
}
else{
  macroReplacedData = SalesforceTools.encodeForSalesforceAnalytics(macroReplacedData);
  //Use the following format to make a request to an CRM Analytics app.
  //<scheme_name>://<assetType>/<assetID>?orgId=<orgId>&loginHost=<loginHost>&dashboardState=<url-encoded json>
  url = schemeName + '://' + assetType.toLowerCase() + '/' +  assetId + '?orgId=' + orgId + '&loginHost=' +loginHost + '&dashboardState=' + macroReplacedData;
}

/*Using URL scheme is a not secure transport layer, therefore no sensitive or personal identifiable information must be transferred via the channel.
    The core implementation is considering that, for customizations please reach out to your legal team and security lead.*/
var promise = Facade.startThirdPartyAsync(url,{});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
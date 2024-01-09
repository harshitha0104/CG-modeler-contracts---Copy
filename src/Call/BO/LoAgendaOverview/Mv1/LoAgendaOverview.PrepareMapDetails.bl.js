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
 * @function prepareMapDetails
 * @this LoAgendaOverview
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {Object} customers
 * @param {String} pKey
 * @param {DomDecimal} currentLatitude
 * @param {DomDecimal} currentLongitude
 * @returns promise
 */
function prepareMapDetails(customers, pKey, currentLatitude, currentLongitude){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var customerDetail = customers.getItemByPKey(pKey);
var mapDetail = BoFactory.instantiate("LuMapDetail");
var distanceUnit = ApplicationContext.get('user').getDistanceUnit();
var distance = 0;
var jsonParams = [];
var jsonQuery = {};
var visitDetail;
var promise = when.resolve();

// Reset isButtonVisible for previously selected map pin
var previouslySelectedCustomer = customers.getItemsByParam({"isButtonVisible": "1"});
if(previouslySelectedCustomer.length > 0) {
  previouslySelectedCustomer[0].setIsButtonVisible("0");
}

if(Utils.isDefined(pKey)) {
  if(!customerDetail) {
    visitDetail = me.getItemByPKey(pKey);
    mapDetail.setPKey(visitDetail.getBpaMainPKey());
    mapDetail.setName(visitDetail.getName());
    mapDetail.setMainAddress(visitDetail.getMainAddress());
  }
  else {
    mapDetail.setPKey(customerDetail.getPKey());
    mapDetail.setName(customerDetail.getName());
    mapDetail.setMainAddress(customerDetail.getMainAddress());
    customerDetail.setIsButtonVisible("1");
  }

  if (!(currentLatitude === 0 && currentLongitude === 0)) {
    if(!customerDetail){
      distance = Utils.distanceBetween(currentLatitude, currentLongitude, visitDetail.getLatitude(), visitDetail.getLongitude(), distanceUnit);
    }
    else{
      distance = Utils.distanceBetween(currentLatitude, currentLongitude, customerDetail.getLatitude(), customerDetail.getLongitude(), distanceUnit);
    }

    distance = Utils.round(distance, 2, 1) + " " + distanceUnit;
    mapDetail.setDistance(distance);
  }
  else {
    mapDetail.setDistance(" ");
  }

  var addCond = "AND SF_File.Usage__c = 'Icon' ";
  jsonParams.push({ "field": "referencePKey", "value": mapDetail.getPKey() });
  jsonParams.push({ "field": "addCond", "value": addCond });
  jsonQuery.params = jsonParams;

  promise = BoFactory.loadObjectByParamsAsync("LoBpaAttachment", jsonQuery).then(
    function (loBpaAttachment) {
      if (Utils.isDefined(loBpaAttachment)) {
        if (loBpaAttachment.getCount() > 0) {
          var attachment = loBpaAttachment.getAllItems()[0];
          mapDetail.setCustomerProfilePicture(attachment.getMediaPath());
          mapDetail.setCustomerPictureFileType(attachment.getType());
        }
      }
      return mapDetail;
    });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
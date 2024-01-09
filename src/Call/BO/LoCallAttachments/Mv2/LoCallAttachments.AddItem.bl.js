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
 * @function addItem
 * @this LoCallAttachments
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} mediaPath
 * @param {BoCall} boCall
 * @param {String} jDTPKey
 * @returns promise
 */
function addItem(mediaPath, boCall, jDTPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var positionPromise = when.resolve();
var type = Utils.getFileExtensionFromMediaPath(mediaPath);

var pKeyAttachment = PKey.next();
//to calculate the next number for the attachmentText
var loCallAttList = boCall.getLoCallAttachments().getAllItems();
var maxAttachmentNumber = 0;

for (var i in loCallAttList) {
  var currentAttachmentNumber;
  var currentFileName = loCallAttList[i].getFileName();
  
  if (Utils.isDefined(currentFileName)) {
    currentAttachmentNumber = currentFileName.split(".")[0];
  }
  
  if (!isNaN(currentAttachmentNumber)) {
    currentAttachmentNumber = parseInt(currentAttachmentNumber, 10);
    if (currentAttachmentNumber > maxAttachmentNumber){
      maxAttachmentNumber = currentAttachmentNumber;
    }
  }
}

//if maxAttachmentNumber is still zero that means there are no numbers in the list.
if (maxAttachmentNumber === 0) {
  maxAttachmentNumber = loCallAttList.length + 1;
} else {
  maxAttachmentNumber++;
}

//padding number with leading zeros
var fileName = "0000" + maxAttachmentNumber;
fileName = fileName.substr(fileName.length - 4);

//Get the Meta Lookup Object
var objMetaLookup = boCall.getLuCallMeta();

//default values
var creationDate;
var creationTime;
if (Utils.isSfBackend()) {
  creationDate = Utils.createAnsiDateToday();
  creationTime = Utils.createAnsiTimeNow();
}
else {
  creationDate = Utils.getMinDateAnsi();
  creationTime = Utils.convertTime2Ansi(Utils.convertAnsiDate2Date(Utils.getMinDateTimeAnsi()));
}
var currentLatitude = 0;
var currentLongitude = 0;
var customerLatitude = 0;
var customerLongitude = 0;
var deviation = 0;
var deviationThreshold = 0;
var locationDeviation = "Unknown";
var distanceUnit = " ";

if (objMetaLookup.getTagMediaDateTime() == "1") {
  creationDate = Utils.createAnsiDateToday();
  creationTime = Utils.createAnsiTimeNow();
}

if (objMetaLookup.getTagMediaGeoLocation() == "1") {
  positionPromise = Utils.getCurrentPosition();
}

var promise = positionPromise.then(function (currentPosition) {

  //Get the customer BpaAddress latitude and longitude to compare deviation.
  if (objMetaLookup.getTagMediaGeoLocation() == "1" && Utils.isDefined(currentPosition) && Utils.isDefined(currentPosition.latitude) && Utils.isDefined(currentPosition.longitude)) {

    currentLatitude = currentPosition.latitude;
    currentLongitude = currentPosition.longitude;

    customerLatitude = boCall.getLuCustomer().getLatitude();
    customerLongitude = boCall.getLuCustomer().getLongitude();

    //Get the Distance Unit to measure
    distanceUnit = ApplicationContext.get('user').getDistanceUnit();

    //Calculate the deviation in measured unit
    deviation = Utils.distanceBetween(currentLatitude, currentLongitude, customerLatitude, customerLongitude, distanceUnit);

    //get the Deviation Threshold from clbMeta
    deviationThreshold = objMetaLookup.getDeviationThreshold();

    //Sets the Location Deviation in Table.
    if (customerLatitude === 0 && customerLongitude === 0){
      locationDeviation = "UnknownCustomerLocation";
    }
    else if (currentLatitude === 0 && currentLongitude === 0){
      locationDeviation = "UnknownUserLocation";
    }
    else if (deviation < deviationThreshold){
      locationDeviation = "WithinThreshold";
    }
    else if (deviation > deviationThreshold){
      locationDeviation = "ExceedsThreshold";
    }
    else{
      locationDeviation = "Unknown";
    }
  }

  var attachmentData = {
    "pKey" : PKey.next(),
    "creationDate" : creationDate,
    "creationTime" : creationTime,
    "fileName" : fileName + '.' + type,
    "fileType" : type,
    "fileSize" : 0,
    "latitude" : currentLatitude,
    "longitude" : currentLongitude,
    "locationDeviation" : locationDeviation,
    "attachmentTextPKey" : PKey.next(),
    "attachmentText" : fileName,
    "attachmentBlobPKey" : PKey.next(),
    "attachmentBlob" : mediaPath,
    "objectStatus": STATE.NEW | STATE.DIRTY
  };

  if(Utils.isDefined(jDTPKey)){
    attachmentData.clbMainPKey = jDTPKey;
  } else{
    attachmentData.clbMainPKey = boCall.getPKey();
  }

  me.addListItems([attachmentData]);
  me.orderBy({
    "creationDate" : "DESC",
    "creationTime" : "DESC",
    "fileName" : "DESC"
  });
  return attachmentData;
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
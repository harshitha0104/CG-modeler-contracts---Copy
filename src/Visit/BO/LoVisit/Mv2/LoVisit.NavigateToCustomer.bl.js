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
 * @function navigateToCustomer
 * @this LoVisit
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {String} VisitPKey
 * @returns promise
 */
function navigateToCustomer(VisitPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/**
1. First Step: check retail store lat&long or address fields like ( city, street, zipcode)
2. Second Step: check Lat and long of Location
3. Final: check if visitor address if present or not ( only address fields not Lat&Long)
4. If it fails in all the steps then show pop up message.

**/

var currList = me.getItemByPKey(VisitPKey);

var latitude = currList.getRetailStoreLatitude();
var longitude = currList.getRetailStoreLongitude();
var street  = currList.getRetailStoreStreet();
var zipCode = currList.getRetailStorePostalCode();
var city = currList.getRetailStoreCity();


var destinationLongitude = 0, destinationLatitude = 0, destinationCity = '', destinationStreet = ' ', destinationZipCode = ' ';


var isLocationFound = false;


if( (latitude !== 0 && longitude !== 0) || ( !Utils.isEmptyString(street) || !Utils.isEmptyString(zipCode) || !Utils.isEmptyString(city))){
    
    destinationLongitude =  longitude;
    destinationLatitude = latitude;
    destinationCity  = city;
    destinationStreet = street;
    destinationZipCode = zipCode;
    isLocationFound = true;
}

if(!isLocationFound) {
  
  // check for  location Lat&Long.
  // if above lat& long are zero and below are non zero it means Location has Lat & Long. 
  longitude = currList.getLongitude();
  latitude =  currList.getLatitude();
  
  if(longitude !== 0 && latitude !== 0) {
    isLocationFound = true;
    destinationLongitude =  longitude;
    destinationLatitude = latitude;
  }
  
}

if(!isLocationFound) {
  // finally check if we have visitor address.
   street  = Utils.isDefined(currList.getVisitorStreet()) ? currList.getVisitorStreet() : ' ';
   city    = Utils.isDefined(currList.getVisitorCity()) ? currList.getVisitorCity() : ' ';
   zipCode = Utils.isDefined(currList.getVisitorPostalCode()) ? currList.getVisitorPostalCode() : ' ';
  
  if( !Utils.isEmptyString(street) ||  !Utils.isEmptyString(city) ||  !Utils.isEmptyString(zipCode)) {
     
    isLocationFound = true;
    destinationCity  = city;
    destinationStreet = street;
    destinationZipCode = zipCode;
  }
  
}
if(!isLocationFound) {
  var buttonValues = {};
  buttonValues[Localization.resolve("OK")] = "ok";
  promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Validation"), Localization.resolve("NoRouteFound"), buttonValues);

}
else
{
  promise = BoFactory.createObjectAsync("BoGeoHelper", {})
    .then(
    function(geoHelper)
    {
      return geoHelper.startNavigation(destinationLatitude, destinationLongitude, destinationStreet, "",  destinationZipCode, destinationCity);
    }
  );
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
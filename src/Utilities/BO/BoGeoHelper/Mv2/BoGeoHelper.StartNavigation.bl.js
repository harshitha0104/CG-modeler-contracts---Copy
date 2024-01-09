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
 * @function startNavigation
 * @this BoGeoHelper
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} latitude
 * @param {Object} longitude
 * @param {Object} street
 * @param {Object} housenumber
 * @param {Object} zipCode
 * @param {Object} city
 * @returns promise
 */
function startNavigation(latitude, longitude, street, housenumber, zipCode, city){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var concatUrlComponent = function (url, urlComponent)
{
  var concatenatedUrl = url;
  if (Utils.isDefined(urlComponent) && !Utils.isEmptyString(urlComponent))
  {
    var separator = url[url.length - 1] === '=' ? '' : '+';
    concatenatedUrl = url + separator + encodeURIComponent(urlComponent);
  }
  return concatenatedUrl;
};

var url = 'http://maps.google.com/maps?mode=d&daddr=';
// in order to use the apple maps and navigation app instead of google maps change the url to
//  'http://maps.apple.com?dirflg=d&saddr=Current+Location&daddr='
// in order to start the installed navigation app instead of google maps in the browser on windows mobile us efollowing url:
//  'ms-drive-to:?destination.latitude=' + latitude + '&destination.longitude=' + longitude + '&destination.name=' + street;   

if (Utils.isDefined(longitude) && !Utils.isEmptyString(longitude) && longitude !== 0 && Utils.isDefined(latitude) && !Utils.isEmptyString(latitude) && latitude !== 0)
{
  url = concatUrlComponent(url, latitude);
  url = concatUrlComponent(url, longitude);
}
else
{
  url = concatUrlComponent(url, street);
  url = concatUrlComponent(url, housenumber);
  url = concatUrlComponent(url, zipCode);
  url = concatUrlComponent(url, city);
}
var promise = Facade.startThirdPartyAsync(url,{});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
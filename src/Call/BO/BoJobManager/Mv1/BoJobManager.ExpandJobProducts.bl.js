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
 * @function expandJobProducts
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} posIds
 * @returns promise
 */
function expandJobProducts(posIds){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var deferreds = [];
var i;
var params;
var aPosIds;
var loPos;

// load LoSurveys first to get existing jobs (if not loaded already)
if (!Utils.isDefined(posIds) || posIds === "") {
  loPos = me.getLoPOS().getAllItems();
  for (i = 0; i < loPos.length; i++) {
    params = {
      "posId" : loPos[i].getPosId(),
      "boJobManager" : me,
      "pushToPOSListAfterLoad" : true
    };

    deferreds.push(BoFactory.loadLightweightListAsync("LoSurveys", Utils.convertDsParamsNewToOld(params)));
  }
} else {
  aPosIds = posIds.split(',');
  for (i = 0; i < aPosIds.length; i++) {
    var sPosId = aPosIds[i];
    var exstingPos = me.getLoPOS().getItemsByParam({"posId":sPosId});
    if(exstingPos.length > 0 && exstingPos[0].getProductsInitialized() !== "1"){
      params = {
        "posId" : sPosId,
        "boJobManager" : me,
        "pushToPOSListAfterLoad" : true
      };

      deferreds.push(BoFactory.loadLightweightListAsync("LoSurveys", Utils.convertDsParamsNewToOld(params)));
    }
  }
}

var promise = when.all(deferreds).then(
  function () {
    // then load JobProducts
    var deferreds2 = [];
    if (!Utils.isDefined(posIds) || posIds === "") {
      loPos = me.getLoPOS().getAllItems();

      for (i = 0; i < loPos.length; i++) {
        deferreds2.push(me.getJobProducts(loPos[i].getPosId()));
      }
    } else {
      aPosIds = posIds.split(',');
      for (var k = 0; k < aPosIds.length; k++) {
        deferreds2.push(me.getJobProducts(aPosIds[k]));
      }
    }

    return when.all(deferreds2);
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
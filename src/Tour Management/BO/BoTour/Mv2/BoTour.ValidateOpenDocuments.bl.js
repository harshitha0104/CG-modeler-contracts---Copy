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
 * @function validateOpenDocuments
 * @this BoTour
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} messageCollector
 * @returns promise
 */
function validateOpenDocuments(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;

//Check only required if status transition from running to completed
if(me.getTmgStatus()!== "Running") {
  promise = when.resolve();
} else {
  var jsonQuery = {};
  var jsonParams = [];
  var sdoMetaPkeys = [];

  jsonQuery.params = jsonParams;

  jsonParams.push({"field" : "tmgMainPKey", "value" : me.getPKey()});
  jsonParams.push({"field" : "tmgTourObjectRelUsage", "value" : "'SdoMeta.ProductCheckIn'"});

  if (Utils.isCasBackend()){
    jsonQuery.additionalCondition = "AND SdoMeta.PrdCheckInPolicy <> #prdCheckInPolicy#";
  }
  else{
    jsonQuery.additionalCondition = "AND Order_Template__c.Product_Check_in_Policy__c <> #prdCheckInPolicy#";
  }

  jsonParams.push({"field" : "prdCheckInPolicy", "value" : 'Optional'});

  promise = BoFactory.loadObjectByParamsAsync("LoTruckLoadTemplates", jsonQuery).then(
    function(result){

      if(Utils.isDefined(result)){
        if(result.getAllItems().length>0){
          for(var i = 0; i<result.getAllItems().length; i++){
            sdoMetaPkeys.push("'" + result.getAllItems()[i].getPKey() + "'"); 
          }
          sdoMetaPkeys=sdoMetaPkeys.join(",");
        }
      }

      return BoFactory.loadObjectByParamsAsync("LuTourOpenDocuments", {"TmgMainPKey" : me.getPKey(), "SdoMetaPKeys" : sdoMetaPkeys});
    }
  ).then(
    function(luTourOpenDocuments){
      if(Utils.isDefined(luTourOpenDocuments)) {
        var openRelatedDocuments=luTourOpenDocuments.getOpenRelatedDocuments();
        var doneCashCheckInDocuments=luTourOpenDocuments.getDoneCashCheckInDocuments();
        var doneProductCheckIns=luTourOpenDocuments.getDoneProductCheckIns();
        var openFakeInwardDocuments=luTourOpenDocuments.getOpenFakeInwardDocuments();
        var openFakeRejectedDocuments=luTourOpenDocuments.getOpenFakeRejectedDocuments();


        if(openRelatedDocuments > 0 || openFakeRejectedDocuments > 0 || openFakeInwardDocuments > 0){
          //If there is at least one open document document, the tour cannot be completed. The system displays a message.
          messageCollector.add({
            "level" : "error",
            "objectClass" : "BoTour",
            "messageID" : "CasTmgOpenDocuments"
          });
        }

        if(me.getCashCheckInRequired() === "Mandatory" && doneCashCheckInDocuments < 1){
          //If there is no closed cash check in document, the tour cannot be closed. The system displays a message.
          messageCollector.add({
            "level" : "error",
            "objectClass" : "BoTour",
            "messageID" : "CasTmgNoMandatoryCheckIn"
          });
        }

        if(sdoMetaPkeys.length > 0 && doneProductCheckIns<1){
          //If there is no closed product check in document for the document template in question, the tour cannot be closed. The system displays a message.
          messageCollector.add({
            "level" : "error",
            "objectClass" : "BoTour",
            "messageID" : "CasTmgNoMandatoryPrdCheckIn"
          });
        }
      }
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
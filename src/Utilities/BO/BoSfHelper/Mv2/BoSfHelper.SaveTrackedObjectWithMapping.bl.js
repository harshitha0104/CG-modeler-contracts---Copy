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
 * @function saveTrackedObjectWithMapping
 * @this BoSfHelper
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} bo
 * @param {Object} mapping
 * @param {Object} additionalMappings
 * @returns promise
 */
function saveTrackedObjectWithMapping(bo, mapping, additionalMappings){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var objectStatus = bo.getObjectStatus();

// prevent saving of new deleted objects because they are not in the DB
var stateNewDeleted = STATE.NEW | STATE.DELETED;
if ((objectStatus & stateNewDeleted) == stateNewDeleted) {
  bo.setObjectStatus(STATE.PERSISTED);
  promise = when.resolve(false);
}
else {
  // Determine type of change
  var changeType = "U";

  if ((objectStatus & STATE.DELETED) > 0) {
    changeType = "D";
  }
  else if ((objectStatus & STATE.NEW) > 0) {
    changeType = "N";
  }

  var properties = AppManager.getArtifact("BUSINESSOBJECT", bo.$type).SimpleProperties.SimpleProperty;
  var data =  bo.getData();

  for (var i = 0; i < additionalMappings.length; i++) {
    var additionalMapping = additionalMappings[i];
    data[additionalMapping.name] = additionalMapping.value;
    mapping.columnMapping[additionalMapping.name] = additionalMapping.dsColumn;
  }

  for (var j = 0; j < properties.length; j++) {
    var dateTimeProp = properties[j];
    if((dateTimeProp.type == "DomDate" || dateTimeProp.type == "DomDateTime") && (dateTimeProp.name in mapping.columnMapping)) {
      data[dateTimeProp.name] = Utils.unixepochToTicks(Utils.convertForDB(data[dateTimeProp.name], dateTimeProp.type));
    }
  }

  promise = Facade.putTrackedObjectInTransaction({
    name: mapping.tableName,
    idAttribute: mapping.idColumn,
    idProperty: mapping.idProperty,
    mapping: mapping.columnMapping,
    changeType: changeType,
    data: data
  }).then(function () {
    return when.resolve(true);
  });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
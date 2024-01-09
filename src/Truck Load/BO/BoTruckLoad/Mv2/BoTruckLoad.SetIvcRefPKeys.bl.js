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
 * @function setIvcRefPKeys
 * @this BoTruckLoad
 * @kind businessobject
 * @namespace CORE
 */
function setIvcRefPKeys(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//Get user from application context
var currentUsrPKey = ApplicationContext.get('user').getPKey();

//Determine Tour-Related PKeys


//Determine user for default user via IvcTAReceiver
var taReceiverUsrPKey = " ";

this.beginEdit();

if (this.getBoOrderMeta().getIvcTAReceiver() == "Initiator") {
  taReceiverUsrPKey = this.getInitiatorPKey();
} else {
  taReceiverUsrPKey = this.getOwnerPKey();
}


//Determine tour pkey and vehicle pkeys
var tmgTourPKey = this.getTmgMainPKey();

if(Utils.isDefined(ApplicationContext.get('currentTour'))){
  var defaultEtpVehiclePKey =  ApplicationContext.get('currentTour').getDefaultEtpVehicleTruckPKey();
  var etpVehiclePKey =ApplicationContext.get('currentTour').getEtpVehicleTruckPKey();


  // Set IvcRefPKeys

  if (this.getBoOrderMeta().getIvcRefPKey1Usage() == "DefaultUsr") {
    this.setIvcRef1PKey(taReceiverUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey1Usage() == "ActualUsr") {
    this.setIvcRef1PKey(currentUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey1Usage() == "Tour") {
    this.setIvcRef1PKey(tmgTourPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey1Usage() == "DefaultVehicle") {
    this.setIvcRef1PKey(defaultEtpVehiclePKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey1Usage() == "ActualVehicle") {
    this.setIvcRef1PKey(etpVehiclePKey);
  } else {
    //For NGM, all other values are not supported at the moment
    this.setIvcRef1PKey(" ");
  }

  if (this.getBoOrderMeta().getIvcRefPKey2Usage() == "DefaultUsr") {
    this.setIvcRef2PKey(taReceiverUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey2Usage() == "ActualUsr") {
    this.setIvcRef2PKey(currentUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey2Usage() == "Tour") {
    this.setIvcRef2PKey(tmgTourPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey2Usage() == "DefaultVehicle") {
    this.setIvcRef2PKey(defaultEtpVehiclePKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey2Usage() == "ActualVehicle") {
    this.setIvcRef2PKey(etpVehiclePKey);  
  } else {
    //For NGM, all other values are not supported at the moment
    this.setIvcRef2PKey(" ");
  }

  if (this.getBoOrderMeta().getIvcRefPKey3Usage() == "DefaultUsr") {
    this.setIvcRef3PKey(taReceiverUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey3Usage() == "ActualUsr") {
    this.setIvcRef3PKey(currentUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey3Usage() == "Tour") {
    this.setIvcRef3PKey(tmgTourPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey3Usage() == "DefaultVehicle") {
    this.setIvcRef3PKey(defaultEtpVehiclePKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey3Usage() == "ActualVehicle") {
    this.setIvcRef3PKey(etpVehiclePKey);  
  } else {
    //For NGM, all other values are not supported at the moment
    this.setIvcRef3PKey(" ");
  }

  if (this.getBoOrderMeta().getIvcRefPKey4Usage() == "DefaultUsr") {
    this.setIvcRef4PKey(taReceiverUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey4Usage() == "ActualUsr") {
    this.setIvcRef4PKey(currentUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey4Usage() == "Tour") {
    this.setIvcRef4PKey(tmgTourPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey4Usage() == "DefaultVehicle") {
    this.setIvcRef4PKey(defaultEtpVehiclePKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey4Usage() == "ActualVehicle") {
    this.setIvcRef4PKey(etpVehiclePKey);  
  } else {
    //For NGM, all other values are not supported at the moment
    this.setIvcRef4PKey(" ");
  }

  if (this.getBoOrderMeta().getIvcRefPKey5Usage() == "DefaultUsr") {
    this.setIvcRef5PKey(taReceiverUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey5Usage() == "ActualUsr") {
    this.setIvcRef5PKey(currentUsrPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey5Usage() == "Tour") {
    this.setIvcRef5PKey(tmgTourPKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey5Usage() == "DefaultVehicle") {
    this.setIvcRef5PKey(defaultEtpVehiclePKey);
  } else if (this.getBoOrderMeta().getIvcRefPKey5Usage() == "ActualVehicle") {
    this.setIvcRef5PKey(etpVehiclePKey);  
  } else {
    //For NGM, all other values are not supported at the moment
    this.setIvcRef5PKey(" ");
  }

}


this.endEdit();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
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
 * @function setIvcSearchKeysForItemMetas
 * @this BoOrderMeta
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomPKey} ordererPKey
 * @param {DomPKey} ivcRef1PKey
 * @param {DomPKey} ivcRef2PKey
 * @param {DomPKey} ivcRef3PKey
 * @param {DomPKey} ivcRef4PKey
 * @param {DomPKey} ivcRef5PKey
 */
function setIvcSearchKeysForItemMetas(ordererPKey, ivcRef1PKey, ivcRef2PKey, ivcRef3PKey, ivcRef4PKey, ivcRef5PKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var loInventoryByItemMeta = this.getLoInventoryMetaByItemMeta().getItemObjects();
    var liInventoryMetaByItemMeta;

    var actualUsrPKey = " ";
    var defaultUsrPKey = " ";
    var tmgTourPKey = " ";
    var defaultEtpVehiclePKey = " ";
	var actualEtpVehiclePKey = " ";

      for (var i = 0; i < loInventoryByItemMeta.length; i++) {
          liInventoryMetaByItemMeta = loInventoryByItemMeta[i];

          // Check reference PKey usage and use for this transaction template and collect relevant PKeys to set below
          if (!Utils.isEmptyString(this.getIvcRefPKey1Usage()) && (liInventoryMetaByItemMeta.getUseIvcRefPKey1() == "1")) {
              if (this.getIvcRefPKey1Usage() == "DefaultUsr") {
                  defaultUsrPKey = ivcRef1PKey;
              } else if (this.getIvcRefPKey1Usage() == "ActualUsr") {
                  actualUsrPKey = ivcRef1PKey;
              } else if (this.getIvcRefPKey1Usage() == "Tour") {
                tmgTourPKey = ivcRef1PKey;
              } else if (this.getIvcRefPKey1Usage() == "DefaultVehicle") {
                defaultEtpVehiclePKey = ivcRef1PKey;
              } else if (this.getIvcRefPKey1Usage() == "ActualVehicle") {
                actualEtpVehiclePKey = ivcRef1PKey;
              }
          }

          if (!Utils.isEmptyString(this.getIvcRefPKey2Usage()) && (liInventoryMetaByItemMeta.getUseIvcRefPKey2() == "1")) {
              if (this.getIvcRefPKey2Usage() == "DefaultUsr") {
                  defaultUsrPKey = ivcRef2PKey;
              } else if (this.getIvcRefPKey2Usage() == "ActualUsr") {
                  actualUsrPKey = ivcRef2PKey;
              } else if (this.getIvcRefPKey2Usage() == "Tour") {
                tmgTourPKey = ivcRef2PKey;
              } else if (this.getIvcRefPKey2Usage() == "DefaultVehicle") {
                defaultEtpVehiclePKey = ivcRef2PKey;
              } else if (this.getIvcRefPKey2Usage() == "ActualVehicle") {
                actualEtpVehiclePKey = ivcRef2PKey;                
              }
          }

          if (!Utils.isEmptyString(this.getIvcRefPKey3Usage()) && (liInventoryMetaByItemMeta.getUseIvcRefPKey3() == "1")) {
              if (this.getIvcRefPKey3Usage() == "DefaultUsr") {
                  defaultUsrPKey = ivcRef3PKey;
              } else if (this.getIvcRefPKey3Usage() == "ActualUsr") {
                  actualUsrPKey = ivcRef3PKey;
              } else if (this.getIvcRefPKey3Usage() == "Tour") {
                tmgTourPKey = ivcRef3PKey;
              } else if (this.getIvcRefPKey3Usage() == "DefaultVehicle") {
                defaultEtpVehiclePKey = ivcRef3PKey;
              } else if (this.getIvcRefPKey3Usage() == "ActualVehicle") {
                actualEtpVehiclePKey = ivcRef3PKey;
              }
          }

          if (!Utils.isEmptyString(this.getIvcRefPKey4Usage()) && (liInventoryMetaByItemMeta.getUseIvcRefPKey4() == "1")) {
              if (this.getIvcRefPKey4Usage() == "DefaultUsr") {
                  defaultUsrPKey = ivcRef4PKey;
              } else if (this.getIvcRefPKey4Usage() == "ActualUsr") {
                  actualUsrPKey = ivcRef4PKey;
              } else if (this.getIvcRefPKey4Usage() == "Tour") {
                tmgTourPKey = ivcRef4PKey;
              } else if (this.getIvcRefPKey4Usage() == "DefaultVehicle") {
                defaultEtpVehiclePKey = ivcRef4PKey;
              } else if (this.getIvcRefPKey4Usage() == "ActualVehicle") {
                actualEtpVehiclePKey = ivcRef4PKey;
              }
          }

          if (!Utils.isEmptyString(this.getIvcRefPKey5Usage()) && (liInventoryMetaByItemMeta.getUseIvcRefPKey5() == "1")) {
              if (this.getIvcRefPKey5Usage() == "DefaultUsr") {
                  defaultUsrPKey = ivcRef5PKey;
              } else if (this.getIvcRefPKey5Usage() == "ActualUsr") {
                  actualUsrPKey = ivcRef5PKey;
              } else if (this.getIvcRefPKey5Usage() == "Tour") {
                tmgTourPKey = ivcRef5PKey;
              } else if (this.getIvcRefPKey5Usage() == "DefaultVehicle") {
                defaultEtpVehiclePKey = ivcRef5PKey;
              } else if (this.getIvcRefPKey5Usage() == "ActualVehicle") {
                actualEtpVehiclePKey = ivcRef5PKey;
              }
          }
    
          // Set UsrMainPKey
          if (liInventoryMetaByItemMeta.getUsrPolicy() == "One") {
              if ((Utils.isEmptyString(defaultUsrPKey) && Utils.isEmptyString(actualUsrPKey)) || (!Utils.isEmptyString(defaultUsrPKey) && !Utils.isEmptyString(actualUsrPKey))) {
                  //Both references for UsrMainPKey are set and marked for usage. Throw error.
                  //TODO throw error "Template not configured correctly"
              } else {
                  if (!Utils.isEmptyString(defaultUsrPKey)) {
                      liInventoryMetaByItemMeta.setUsrMainPKey(defaultUsrPKey);
                  } else if (!Utils.isEmptyString(actualUsrPKey)) {
                      liInventoryMetaByItemMeta.setUsrMainPKey(actualUsrPKey);
                  }
              }
          }
        
          // Set EtpVehiclePKey
          if (liInventoryMetaByItemMeta.getVehiclePolicy() == "One") {
              if ((Utils.isEmptyString(defaultEtpVehiclePKey) && Utils.isEmptyString(actualEtpVehiclePKey)) || (!Utils.isEmptyString(defaultEtpVehiclePKey) && !Utils.isEmptyString(actualEtpVehiclePKey))) {
                  //Both references for EtpVehiclePKey are set and marked for usage. Throw error.
                  //TODO throw error "Template not configured correctly"
              } else {
                  if (!Utils.isEmptyString(defaultEtpVehiclePKey)) {
                      liInventoryMetaByItemMeta.setEtpVehiclePKey(defaultEtpVehiclePKey);
                  } else if (!Utils.isEmptyString(actualEtpVehiclePKey)) {
                      liInventoryMetaByItemMeta.setEtpVehiclePKey(actualEtpVehiclePKey);
                  }
              }
          }        

          // Set BpaMainPKey
          if (liInventoryMetaByItemMeta.getBpaPolicy() == "One") {
              liInventoryMetaByItemMeta.setBpaMainPKey(ordererPKey);
          }
        
          // Set TmgTourPKey
          if (liInventoryMetaByItemMeta.getTmgPolicy() == "One") {
              liInventoryMetaByItemMeta.setTmgTourPKey(tmgTourPKey);
          }
        
      }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
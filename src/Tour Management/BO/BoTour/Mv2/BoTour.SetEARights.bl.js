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
 * @function setEARights
 * @this BoTour
 * @kind businessobject
 * @namespace CORE
 */
function setEARights(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var acl = me.getACL();
var aclTruck;
var aclStartWarehouse;
var aclTrailer1;
var aclTrailer2;
var aclEndWarehouse;
var liTourCheckItems;
var liTourCheckItem;
var i;

if (me.getTmgStatus().toLowerCase() === "completed" || me.getTmgStatus().toLowerCase() === "canceled" ) {
  acl.removeRight(AclObjectType.OBJECT, "BoTour", AclPermission.EDIT);
}
else{
  if (me.getTmgStatus().toLowerCase() === "initial" || me.getTmgStatus().toLowerCase() === "open"){
    acl.addRight(AclObjectType.OBJECT, "BoTour", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"dateThru", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"timeThru", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"timeFrom", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"dateFrom", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"vehicleOKEnd", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"vehicleStatusEnd", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"mileageEnd", AclPermission.EDIT);
    acl.addRight(AclObjectType.PROPERTY,"mileageStart", AclPermission.EDIT);
    acl.addRight(AclObjectType.PROPERTY,"vehicleOKStart", AclPermission.EDIT);
    acl.addRight(AclObjectType.PROPERTY,"vehicleStatusStart", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY, "message", AclPermission.EDIT);

    aclTruck = me.getLuTruck().getACL();
    aclTruck.removeRight(AclObjectType.OBJECT,"luTruck", AclPermission.EDIT);

    if(me.getConsiderMileage().toLowerCase() === "no"){
      acl.removeRight(AclObjectType.PROPERTY,"mileageStart", AclPermission.EDIT);
    }
    if(me.getConsiderVehicleStatus().toLowerCase() === "no"){
      acl.removeRight(AclObjectType.PROPERTY,"vehicleOKStart", AclPermission.EDIT);
    }
    if(me.getConsiderVehicleStatus().toLowerCase() !== "statusreason" || me.getVehicleOKStart() == "1"){
      acl.removeRight(AclObjectType.PROPERTY,"vehicleStatusStart", AclPermission.EDIT);
    }

    aclStartWarehouse = me.getLuEtpWarehouse().getACL();
    aclStartWarehouse.addRight(AclObjectType.OBJECT,"luEtpWarehouse", AclPermission.EDIT);

    if(me.getConsiderVehicle().toLowerCase() !== "no"){
      aclTruck.addRight(AclObjectType.OBJECT,"luTruck", AclPermission.EDIT);
    }

    aclTrailer1 = me.getLuTrailer1().getACL();
    aclTrailer2 = me.getLuTrailer2().getACL();
    aclTrailer1.removeRight(AclObjectType.OBJECT,"luTrailer1", AclPermission.EDIT);
    aclTrailer2.removeRight(AclObjectType.OBJECT,"luTrailer2", AclPermission.EDIT);

    if(me.getConsiderVehicle().toLowerCase() === "trucktrailer" || me.getConsiderVehicle().toLowerCase() === "trucktrailers"){
      aclTrailer1.addRight(AclObjectType.OBJECT,"luTrailer1", AclPermission.EDIT);
      aclTrailer2.addRight(AclObjectType.OBJECT,"luTrailer2", AclPermission.EDIT);
    }

    aclEndWarehouse = me.getLuEndEtpWarehouse().getACL();
    aclEndWarehouse.removeRight(AclObjectType.OBJECT,"luEndEtpWarehouse", AclPermission.EDIT);

    //TourCheck List EA Rights.
    liTourCheckItems = me.getLoTourChecks().getAllItems();

    if(liTourCheckItems.length > 0){
      for (i = 0; i < liTourCheckItems.length; i++) {
        liTourCheckItem=liTourCheckItems[i];
        acl = liTourCheckItem.getACL();
        if(liTourCheckItem.getUsage() =="S"){
          acl.addRight(AclObjectType.PROPERTY, "value", AclPermission.EDIT);
        }
        else{
          acl.removeRight(AclObjectType.PROPERTY, "value", AclPermission.EDIT);
        }
      }
    }
  }

  if (me.getTmgStatus().toLowerCase() === "running") {
    acl.addRight(AclObjectType.OBJECT, "BoTour", AclPermission.EDIT);

    if(me.getBoTourMeta().getConsiderMultipleWarehouses() !== "1"){
      aclEndWarehouse = me.getLuEndEtpWarehouse().getACL();
      aclEndWarehouse.removeRight(AclObjectType.OBJECT,"luEndEtpWarehouse", AclPermission.EDIT);
    }

    aclStartWarehouse = me.getLuEtpWarehouse().getACL();
    aclStartWarehouse.removeRight(AclObjectType.OBJECT,"luEtpWarehouse", AclPermission.EDIT);

    aclTruck = me.getLuTruck().getACL();
    aclTruck.removeRight(AclObjectType.OBJECT,"luTruck", AclPermission.EDIT);

    aclTrailer1 = me.getLuTrailer1().getACL();
    aclTrailer2 = me.getLuTrailer2().getACL();

    aclTrailer1.removeRight(AclObjectType.OBJECT,"luTrailer1", AclPermission.EDIT);
    aclTrailer2.removeRight(AclObjectType.OBJECT,"luTrailer2", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"dateThru", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"timeThru", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"timeFrom", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"dateFrom", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"vehicleStatusStart", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"vehicleOKStart", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"mileageStart", AclPermission.EDIT);
    acl.addRight(AclObjectType.PROPERTY,"mileageEnd", AclPermission.EDIT);
    acl.addRight(AclObjectType.PROPERTY,"vehicleOKEnd", AclPermission.EDIT);
    acl.addRight(AclObjectType.PROPERTY,"vehicleStatusEnd", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY, "message", AclPermission.EDIT);

    if(me.getConsiderMileage().toLowerCase() === "no"){
      acl.removeRight(AclObjectType.PROPERTY,"mileageEnd", AclPermission.EDIT);
    }
    if(me.getConsiderVehicleStatus().toLowerCase() === "no"){
      acl.removeRight(AclObjectType.PROPERTY,"vehicleOKEnd", AclPermission.EDIT);
    }
    if(me.getConsiderVehicleStatus().toLowerCase() !== "statusreason" || me.getVehicleOKEnd() == "1"){
      acl.removeRight(AclObjectType.PROPERTY,"vehicleStatusEnd", AclPermission.EDIT);
    }

    //TourCheck List EA Rights.
    liTourCheckItems = me.getLoTourChecks().getAllItems();
    if(liTourCheckItems.length > 0){
      for (i = 0; i < liTourCheckItems.length; i++) {
        liTourCheckItem=liTourCheckItems[i];
        acl = liTourCheckItem.getACL();
        if(liTourCheckItem.getUsage() =="E"){
          acl.addRight(AclObjectType.PROPERTY, "value", AclPermission.EDIT);
        }
        else{
          acl.removeRight(AclObjectType.PROPERTY, "value", AclPermission.EDIT);
        }
      }
    }
  }

  if (Utils.isDefined(Framework.getProcessContext().navigationMode) &&
      Framework.getProcessContext().navigationMode === "StartOfDay" &&
      me.getTmgStatus().toLowerCase() === "running"){
    var loAcl = me.getLoTourDescription().getACL();
    loAcl.removeRight(AclObjectType.PROPERTY,"text", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY,"mileageEnd", AclPermission.EDIT);
  }
}
BindingUtils.refreshEARights();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
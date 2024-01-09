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
 * @function saveAsync
 * @this BoCustomer
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function saveAsync(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/***********************************************************************************************
*  2 CGCloud tables / 1 onPrem table                                                              *
*                                                                                              *
*  CGCloud:    -2 objects have to be stored (Account__c / Account_Extension__c)                   *
*  onPrem:  -Only one table for customer                                                       *
************************************************************************************************/
var promise;
var deferreds = [];

//Flag used to decide if  roles must be saved or not
//For records already saved on DB no need to save the roles because roles are read only
var isCustomerPersistedDirty = me.getObjectStatus() === (STATE.PERSISTED | STATE.DIRTY);

if (!Utils.isDefined(me.getDateClosure())) {
  me.setDateClosure(Utils.getMinDateTime());
}


// If the backend is SalesForce, then we need to store two objects for the BoCustomer
if (Utils.isSfBackend()) {

  //create operating hour if needed and not yet available
  var operatingHourPromise = when.resolve();
  if ((!Utils.isDefined(me.getOperatingHoursId()) || Utils.isEmptyString(me.getOperatingHoursId())) && 
      ( Utils.isDefined(me.getLoOpenHours()) && me.getLoOpenHours().getAllItems().length > 0)) {

    operatingHourPromise = BoFactory.createObjectAsync(BO_OPERATINGHOUR, {}).then(
      function (boOperatingHour) {
        boOperatingHour.setName(me.getName());
        me.setOperatingHoursId(boOperatingHour.getPKey());
        me.setBoOperatingHour(boOperatingHour);

        return me.getBoOperatingHour().saveAsync();
      });
  }


  promise = operatingHourPromise.then(
    function () {

      return BoFactory.createObjectAsync("BoSfHelper", {});
    }).then(function (helper) {
    // Store Account
    deferreds.push(helper.saveTrackedObject(me, [{name: "id", dsColumn: "Account_Number__c", value: me.getCustomerId() }]));
    var mapping = {
      "matchcode": "Match_Code__c",
      "priority": "Priority__c",
      "classOfTrade": "Class_Of_Trade__c",
      "companyType": "Company_Type__c",
      "orgLevel": "Org_Level__c",
      "phase": "Phase__c",
      "salesRelevant": "Sales_Relevant__c",
      "state": "State__c",
      "dateClosure": "Date_Closure__c",
      "accountExtensionId": "Id",
      "pKey": "Account__c",
      "accountDi": "Distribution_Issue__c",
      "accountOi": "OOS_Issue__c",
    };
    // Store Account_Extension__c
    deferreds.push(helper.saveTrackedObjectWithMapping(me, {
      tableName: "Account_Extension__c",
      idColumn: "Id",
      idProperty: "accountExtensionId",
      columnMapping: mapping,
    }, []));
    return when.all(deferreds);
  });
}
else {
  promise = Facade.saveObjectAsync(me);
}

promise = promise.then(
  function () {
    var account_extension_id = "";
    if (Utils.isSfBackend()) {
      account_extension_id = me.getAccountExtensionId();
    }
    // Save BpaSales
    if(Utils.isDefined(me.getBoBpaSales())) {
      if (Utils.isSfBackend()) {
        me.getBoBpaSales().setPKey(account_extension_id);
      }
      deferreds.push(me.getBoBpaSales().saveAsync());
    }  
    //Save LoContactPartner
    if(Utils.isDefined(me.getLoContactPartner())) {
      deferreds.push(me.getLoContactPartner().saveAsync());
    }
    /** Account Harmonization: obsolete
    //Save LoCustomerOpeningTimes
    if(Utils.isDefined(me.getLoCustomerOpeningTime())) {
      deferreds.push(me.getLoCustomerOpeningTime().saveAsync());
    }
Account Harmonization: obsolete */
    //Save LoCustomerAddress
    if(Utils.isDefined(me.getLoCustomerAddress())) {
      if (Utils.isSfBackend()) {
        var items = me.getLoCustomerAddress().getAllItems();
        if (items.length > 0) {
          items[0].setPKey(me.getPKey());
        }
      }
      deferreds.push(me.getLoCustomerAddress().saveAsync());
    }
    //Save LoCustomerPOSRelation
    if(Utils.isDefined(me.getLoCustomerPOSRelation())) {
      deferreds.push(me.getLoCustomerPOSRelation().saveAsync());
    }
    //Save LoBpaManagement
    if(Utils.isDefined(me.getLoBpaManagement())) {
      deferreds.push(me.getLoBpaManagement().saveAsync());
    }

    //Save LoListingClassification
    if(Utils.isSfBackend() && Utils.isDefined(me.getLoListingClassification())) {
      deferreds.push(me.getLoListingClassification().saveAsync());
    }

    //##################
    //### SAVE ROLES ###
    //##################
    //Save BO_ORDERROLE
    if(Utils.isDefined(me.getBoOrderRole()) && !isCustomerPersistedDirty) {
      // SF/CASDIF: General Dif
      if (Utils.isSfBackend()) {
        me.getBoOrderRole().setPKey(account_extension_id);
        me.getBoOrderRole().setCustomerPKey(me.getPKey());
      }
      deferreds.push(me.getBoOrderRole().saveAsync());
    }
    //Save BO_CUSTOMERROLE
    if(Utils.isDefined(me.getBoCustomerRole()) && !isCustomerPersistedDirty) {
      // SF/CASDIF: General Dif
      if (Utils.isSfBackend()) {
        me.getBoCustomerRole().setPKey(account_extension_id);
        me.getBoCustomerRole().setCustomerPKey(me.getPKey());
      }
      deferreds.push(me.getBoCustomerRole().saveAsync());
    }
    //Save BO_PAYERROLE
    if(Utils.isDefined(me.getBoPayerRole()) && !isCustomerPersistedDirty) {
      // SF/CASDIF: General Dif
      if (Utils.isSfBackend()) {
        me.getBoPayerRole().setPKey(account_extension_id);
        me.getBoPayerRole().setCustomerPKey(me.getPKey());
      }
      deferreds.push(me.getBoPayerRole().saveAsync());
    }
    //Save BO_DELIVERYROLE
    if(Utils.isDefined(me.getBoDeliveryRole()) && !isCustomerPersistedDirty) {
      // SF/CASDIF: General Dif
      if (Utils.isSfBackend()) {
        me.getBoDeliveryRole().setPKey(account_extension_id);
        me.getBoDeliveryRole().setCustomerPKey(me.getPKey());
      }
      deferreds.push(me.getBoDeliveryRole().saveAsync());
    }
    //Save BO_STOREROLE
    if(Utils.isDefined(me.getBoStoreRole()) && !isCustomerPersistedDirty) {
      // SF/CASDIF: General Dif
      if (Utils.isSfBackend()) {
        me.getBoStoreRole().setPKey(account_extension_id);
        me.getBoStoreRole().setCustomerPKey(me.getPKey());
      }
      deferreds.push(me.getBoStoreRole().saveAsync());
    }
    //Save LO_BpaRole
    if(Utils.isDefined(me.getLoBpaRole()) && !isCustomerPersistedDirty) {
      // SF/CASDIF: General Dif
      if (Utils.isSfBackend()) {
        var itemsLoBpaRole = me.getLoBpaRole().getAllItems();
        if (itemsLoBpaRole.length > 0) {
          itemsLoBpaRole[0].setPKey(account_extension_id);
        }
      }
      deferreds.push(me.getLoBpaRole().saveAsync());
    }


    //Update and Save Time Slots
    if( Utils.isDefined(me.getLoOpenHours()) && me.getLoOpenHours().getAllItems().length > 0){
      var timeSlots = me.getLoOpenHours().getAllItems();
      var timeSlotItem;

      //set operating hour id if there exist timeslots without operating hour id
      for(var i = 0; i < timeSlots.length; i++){

        timeSlotItem = timeSlots[i];

        if(Utils.isEmptyString(timeSlotItem.getOperatingHoursId())){
          timeSlotItem.setOperatingHoursId(me.getOperatingHoursId());  
        }

      }
      deferreds.push(me.getLoOpenHours().saveAsync());
    }


    //Reset object status for all to prevent multiple saves
    me.traverse(function(node){
      node.setObjectStatus(STATE.PERSISTED);
      if(node.isList) {
        node.getAllItems().forEach(function(item){
          item.setObjectStatus(STATE.PERSISTED);
        });
      }
    },function (a, b, c){});

    return when.all(deferreds);
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
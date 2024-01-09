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
 * @this BoPos
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
*  1 CGCloud table / 2 onPrem tables                                                              *
*                                                                                              *
*  CGCloud:    -no PosRelation table exists. Relation information is directly stored in POS__c.   *
*  onPrem:  -POS table and a separate table for the relation between customers on POS.         *
************************************************************************************************/
var deferreds = [];
var promise;

if(Utils.isSfBackend()) {
  var allItems = me.getLoPOSCustomerRelation().getAllItems();
  var additionalMappings = [{name: "name", dsColumn: "Description_" + ApplicationContext.get('user').sfLanguagePostfix + "__c", value: me.getName()}];
  // In CGCloud the LoPOSCustomerRelation can only have one item because the Account key is directly stores in POS__c. There is no Rel Table available
  // Because Facade.saveTrackedObject is already used it is possible to directly store the LoPOSCustomerRelation-Item with this Request
  if(allItems.length > 0) {
    additionalMappings.push({name: "customerPKey", dsColumn: "Account__c", value: allItems[0].customerPKey});
    additionalMappings.push({name: "salesOrg", dsColumn: "Sales_Org__c", value: allItems[0].salesOrg});
    additionalMappings.push({name: "validFrom", dsColumn: "Valid_From__c", value: Utils.unixepochToTicks(Utils.convertForDB(allItems[0].validFrom, "DomDate"))});
    additionalMappings.push({name: "validThru", dsColumn: "Valid_Thru__c", value: Utils.unixepochToTicks(Utils.convertForDB(allItems[0].validThru, "DomDate"))});
  }
  deferreds.push(BoFactory.createObjectAsync("BoSfHelper", {}).then(
    function (helper) {
      return helper.saveTrackedObject(me, additionalMappings);
    }));
}
else {
  deferreds.push(Facade.saveObjectAsync(me));
  var itemsForSave = [me.getBoBpaSales(), me.getLoPOSCustomerRelation(), me.getLoCustomerAddress()];
  itemsForSave.forEach(function (item) {
    if(Utils.isDefined(item)) {
      deferreds.push(item.saveAsync());
    }
  });
}

promise = when.all(deferreds).then(
  function() {
    if (Utils.isSfBackend()) {
      //Reset object status for all to prevent multiple saves
      me.traverse(function(node) {
        node.setObjectStatus(STATE.PERSISTED);
        if(node.isList) {
          node.getAllItems().forEach(function (item) {
            item.setObjectStatus(STATE.PERSISTED);
          });
        }
      },function(a, b, c){});
    }
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
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
 * @function beforeSave
 * @this LoOrderItems
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {Object} context
 */
function beforeSave(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var deletedFreeItems = this.getItemsByParam({"deletedFreeItem": "1"});
for (var j=0; j<deletedFreeItems.length; j++){

  if (deletedFreeItems[j].getObjectStatus()==deletedFreeItems[j].self.STATE_NEW_DIRTY){
    deletedFreeItems[j].setObjectStatus(deletedFreeItems[j].self.STATE_NEW);
  }
  if (deletedFreeItems[j].getObjectStatus()==deletedFreeItems[j].self.STATE_DIRTY){
    deletedFreeItems[j].setObjectStatus(deletedFreeItems[j].self.STATE_DELETED);
  }

}

var items = this.getAllItems();



/*If SdoItemMeta.SaveZeroQuantity = 'No' and SdoItem.Quantity = '0' and if SdoItem.TargetQuantity = '0' : the system removes this not longer ordered item from the disposal list (and thus from the data base).      
(Note: Items with TargetQuantity <> '0' represent items of a delivery document taken from the ERP system; TargetQuantity is the originally ordered quantity. 
The user or the pricing engine, respectively, must not remove these items after setting the Quantity = 0 in order to document that the item was not delivered. */

for (var i=0; i<items.length; i++){
  if ((items[i].getSaveZeroQuantity()== '0' && items[i].getTargetQuantity()== 0 && items[i].getQuantity() == 0)
      || (!Utils.isEmptyString(items[i].getPromotionPKey()) && items[i].getQuantity() == 0)) {
    if (items[i].getObjectStatus()==items[i].self.STATE_NEW_DIRTY){
      items[i].setObjectStatus(items[i].self.STATE_NEW);
    }
    if (items[i].getObjectStatus()==items[i].self.STATE_DIRTY){
      items[i].setObjectStatus(items[i].self.STATE_DELETED);
    }
  }
} //End For (items)

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
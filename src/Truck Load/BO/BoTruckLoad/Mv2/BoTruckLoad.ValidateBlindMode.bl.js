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
 * @function validateBlindMode
 * @this BoTruckLoad
 * @kind businessobject
 * @namespace CORE
 * @param {messageCollector} messageCollector
 */
function validateBlindMode(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if (this.getDocumentType() === "ProductCheckOut")
{
  if (!this.isEditable() || this.getReleaseIgnored() == "1")
  {
    return;
  }

  if (this.getValidateForBlindMode() !== "1")
  {
    if (this.getReleaseTriggered() == "1")
    {
      var itemPresettingPolicy = this.getBoOrderMeta().getItemPresettingPolicy();
      var itemInputRequired = this.getBoOrderMeta().getItemInputRequired();
      var actualPrdCheckOutType = this.getActualPrdCheckOutType();

      var items = this.getLoItems().getAllItems();

      if (actualPrdCheckOutType === "SKU" && (itemPresettingPolicy == "BlindMode" || itemPresettingPolicy == "NonBlindMode"))
      {
        if (itemInputRequired == "1")
        {
          //validate -any non edited items present in the list
          var nonEditedItems = this.getLoItems().getItemsByParam(
            {
              "edited" : "0"
            }
          );
          if (Utils.isDefined(nonEditedItems) && nonEditedItems.length > 0)
          {
            var newError =
                {
                  "level" : "error",
                  "objectClass" : "BoTruckLoad",
                  "messageID" : "CasSdoMainBlindModeItemsNotYetEdited"
                };
            messageCollector = this.addMessageToContainer(messageCollector, newError);
          }
        }
        else
        {
          var mainItem;
          for (var i = 0; i < items.length; i++)
          {
            mainItem = items[i];
            if (mainItem.getEdited() === "0")
            {
              mainItem.setQuantity("0");
            }

            mainItem.setEdited("1");
          }
        }
      }
      this.setValidateForBlindMode("1");
    }
  }

  if (this.getReleaseTriggered() == "1")
  {
    this.setReleaseTriggered("0");
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
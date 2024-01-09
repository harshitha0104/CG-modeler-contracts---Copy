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
 * @function cpGetRelevantOrderAttributes
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @returns orderAttributes
 */
function cpGetRelevantOrderAttributes(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var orderAttributes = [];

var attribute = {};
attribute.key = "Id";
attribute.value = this.getOrderId();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "CommitDate";
attribute.value = this.getCommitDate();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "Currency";
attribute.value = this.getCurrency();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "ResponsiblePKey";
attribute.value = this.getResponsiblePKey();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "HeaderDiscount";
attribute.value = this.getHeaderDiscount();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PayerCustomerPKey";
attribute.value = this.getPayerCustomerPKey();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "BillToCustomerPKey";
attribute.value = this.getBillToCustomerPKey();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "DeliveryRecipientPKey";
attribute.value = this.getDeliveryRecipientPKey();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo1";
attribute.value = this.getPricingInfo1();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo2";
attribute.value = this.getPricingInfo2();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo3";
attribute.value = this.getPricingInfo3();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo4";
attribute.value = this.getPricingInfo4();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo5";
attribute.value = this.getPricingInfo5();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo6";
attribute.value = this.getPricingInfo6();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo7";
attribute.value = this.getPricingInfo7();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo8";
attribute.value = this.getPricingInfo8();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo9";
attribute.value = this.getPricingInfo9();
orderAttributes.push(attribute);

attribute = {};
attribute.key = "PricingInfo10";
attribute.value = this.getPricingInfo10();
orderAttributes.push(attribute);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return orderAttributes;
}
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
 * @function esGetMainDocHeaderAttributes
 * @this BoOrder
 * @kind businessobject
 * @namespace CORE
 * @returns jsonQuery
 */
function esGetMainDocHeaderAttributes(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var mainDocData = me.getData();

var jsonQuery = {};
var jsonParams = [];

//simple properties alphabetically
jsonParams.push({"field" : "actualStatePKey","value" : mainDocData.actualStatePKey});
jsonParams.push({"field" : "asn","value" : mainDocData.asn});
jsonParams.push({"field" : "billToCustomerPKey","value" : mainDocData.billToCustomerPKey});
jsonParams.push({"field" : "brokerCustomerPKey","value" : mainDocData.brokerCustomerPKey});
jsonParams.push({"field" : "calculationStatus","value" : mainDocData.calculationStatus});
jsonParams.push({"field" : "calculationTime","value" : mainDocData.calculationTime});
jsonParams.push({"field" : "cancelReason","value" : mainDocData.cancelReason});
jsonParams.push({"field" : "clbMainPKey","value" : mainDocData.clbMainPKey});
jsonParams.push({"field" : "cndCpCalculationSchemaPKey","value" : mainDocData.cndCpCalculationSchemaPKey});
jsonParams.push({"field" : "commitDate","value" : mainDocData.commitDate});
jsonParams.push({"field" : "currency","value" : mainDocData.currency});
jsonParams.push({"field" : "customerOrderId","value" : mainDocData.customerOrderId});
jsonParams.push({"field" : "debitCredit","value" : mainDocData.debitCredit});
jsonParams.push({"field" : "deliveryDate","value" : mainDocData.deliveryDate});
jsonParams.push({"field" : "deliveryRecipientPKey","value" : mainDocData.deliveryRecipientPKey});
jsonParams.push({"field" : "distribChannel","value" : mainDocData.distribChannel});
jsonParams.push({"field" : "division","value" : mainDocData.division});
jsonParams.push({"field" : "docTaType","value" : mainDocData.docTaType});
jsonParams.push({"field" : "documentType","value" : mainDocData.documentType});
jsonParams.push({"field" : "headerDiscount","value" : mainDocData.headerDiscount});
jsonParams.push({"field" : "initiationDate","value" : mainDocData.initiationDate});
jsonParams.push({"field" : "initiatorPKey","value" : mainDocData.initiatorPKey});
jsonParams.push({"field" : "ivcRef1PKey","value" : mainDocData.ivcRef1PKey});
jsonParams.push({"field" : "ivcRef2PKey","value" : mainDocData.ivcRef2PKey});
jsonParams.push({"field" : "ivcRef3PKey","value" : mainDocData.ivcRef3PKey});
jsonParams.push({"field" : "ivcRef4PKey","value" : mainDocData.ivcRef4PKey});
jsonParams.push({"field" : "ivcRef5PKey","value" : mainDocData.ivcRef5PKey});
jsonParams.push({"field" : "message","value" : mainDocData.message});
jsonParams.push({"field" : "nextStatePKey","value" : mainDocData.nextStatePKey});
jsonParams.push({"field" : "ordererPKey","value" : mainDocData.ordererPKey});
jsonParams.push({"field" : "ownerPKey","value" : mainDocData.ownerPKey});
jsonParams.push({"field" : "payerCustomerPKey","value" : mainDocData.payerCustomerPKey});
jsonParams.push({"field" : "paymentMethod","value" : mainDocData.paymentMethod});
jsonParams.push({"field" : "paymentReason","value" : mainDocData.paymentReason});
jsonParams.push({"field" : "pricingDate","value" : mainDocData.pricingDate});
jsonParams.push({"field" : "releaseTime","value" : mainDocData.releaseTime});
jsonParams.push({"field" : "responsiblePKey","value" : mainDocData.responsiblePKey});
jsonParams.push({"field" : "salesOrg","value" : mainDocData.responsiblePKey});
jsonParams.push({"field" : "sdoMetaPKey","value" : mainDocData.sdoMetaPKey});
jsonParams.push({"field" : "tmgMainPKey","value" : mainDocData.tmgMainPKey});
jsonParams.push({"field" : "wfeWorkflowPKey","value" : mainDocData.wfeWorkflowPKey});

//Lo's and Lu's BOs
jsonParams.push({"field" : "luDeliveryRecipient","value" : mainDocData.luDeliveryRecipient});

//nested BOs
jsonParams.push({"field" : "boOrderMeta","value" : mainDocData.boOrderMeta});
jsonParams.push({"field" : "boWorkflow","value" : mainDocData.boWorkflow});

jsonQuery.params = jsonParams;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return jsonQuery;
}
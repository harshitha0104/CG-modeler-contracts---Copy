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
 * @function executeSplitting
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function executeSplitting(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var deferreds = [];

if (me.isSplittingEnabled()) {
  var itemSplittingData = me.esCreateItemSplittingData();

  //Input parameter format is wrong
  //var mainDocHeaderAttributeData = me.esGetMainDocHeaderAttributes();

  //############ start splitting function ############ 
  var createSplittingDoc = function (splittingGroup) {

    //Commented header discount and payment reason - <TBD>
    var splittingDoc = BoFactory.instantiate("BoOrder", {
      "asn" : me.getAsn(),
      "billToCustomerPKey": me.getBillToCustomerPKey(),
      "brokerCustomerPKey" :  me.getBrokerCustomerPKey(),
      "calculationStatus" :  me.getCalculationStatus(),
      "calculationTime" :  me.getCalculationTime(),
      "cancelReason" :  me.getCancelReason(),
      "clbMainPKey" :  me.getClbMainPKey(),
      "cndCpCalculationSchemaPKey" :  me.getCndCpCalculationSchemaPKey(),
      "commitDate" :  me.getCommitDate(),
      "currency" :  me.getCurrency(),
      "customerOrderId" :  me.getCustomerOrderId(),
      "debitCredit" :  me.getDebitCredit(),
      "deliveryRecipientPKey" :  me.getDeliveryRecipientPKey(),
      "distribChannel" :  me.getDistribChannel(),
      "division" :  me.getDivision(),
      "docTaType" :  me.getDocTaType(),
      "documentType" :  me.getDocumentType(),
      //"headerDiscount" :  me.getHeaderDiscount(),
      "initiationDate" :  me.getInitiationDate(),
      "initiatorPKey" :  me.getInitiatorPKey(),
      "ivcRef1PKey" :  me.getIvcRef1PKey(),
      "ivcRef2PKey" :  me.getIvcRef2PKey(),
      "ivcRef3PKey" :  me.getIvcRef3PKey(),
      "ivcRef4PKey" :  me.getIvcRef4PKey(),
      "ivcRef5PKey" :  me.getIvcRef5PKey(),
      "message" :  me.getMessage(),
      "ordererPKey" :  me.getOrdererPKey(),
      "ownerPKey" :  me.getOwnerPKey(),
      "payerCustomerPKey" :  me.getPayerCustomerPKey(),
      "paymentMethod" :  me.getPaymentMethod(),
      //"paymentReason" :  me.getPaymentReason(),
      "pricingDate" :  me.getPricingDate(),
      "releaseTime" :  me.getReleaseTime(),
      "responsiblePKey" :  me.getResponsiblePKey(),
      "salesOrg" :  me.getSalesOrg(),
      "sdoMetaPKey" :  me.getSdoMetaPKey(),
      "tmgMainPKey" :  me.getTmgMainPKey(),
      "wfeWorkflowPKey" :  me.getWfeWorkflowPKey()
    });

    //Lo's and Lu's BOs
    splittingDoc.setLuDeliveryRecipient(me.getLuDeliveryRecipient());
    //nested BOs
    splittingDoc.setBoOrderMeta(me.getBoOrderMeta());
    splittingDoc.setBoWorkflow(me.getBoWorkflow());

    //Set delivery date after meta object set
    splittingDoc.setDeliveryDate(me.getDeliveryDate());

    //Header Attributes and Pricing information
    return me.esSetHeaderAttributes(splittingDoc, splittingGroup)
      .then(function () {
        //check for missing inventories
        //Inventory is not required on main document. It is handled for each splitted document @line 123.
        /* return me.processInventoryActions();
      })
      .then(
      function()
      {*/

        //setting the items of the splitting document
        me.esCreateSplittingDocumentItems(splittingDoc, itemSplittingData.get(splittingGroup.getSplittingGroup()));

        //copy over the notes
        me.esCopyNotes(splittingDoc);
        //In CGCloud we create order Sdo Conditions in preparePrint method now. Thus this method is not ready to use when splitting order is enabled in CGCloud.
        //For a consistent behaviour as in Order this method needs an update. 
        return splittingDoc.cpCreateSdoConditions();
      })
      .then(function () {
        //Signature Attributes and Blobs
        return me.esSetSignatureAttributes(splittingDoc);
      })
      .then(function () {
        //Copy the signature images
        return me.esCopySignatures(splittingDoc);
      })
      .then(function () {
        //Before Release set phase to inital and next available phase to be released
        var wfeInitialStateJson = splittingDoc.getBoWorkflow().getInitialState();
        if (Utils.isDefined(wfeInitialStateJson)) {
          splittingDoc.setPhase('Initial');
          splittingDoc.setActualStatePKey(wfeInitialStateJson.toStatePKey);
          splittingDoc.setNextStatePKey(splittingDoc.getActualStatePKey());
          splittingDoc.setSetPhaseInBeforeSave("1");
        }
        //release the document
        return splittingDoc.release();
      })
      .then(function () {
        //create the inventories and ivc transactions
        return splittingDoc.processInventoryActions();
      })
      .then(function () {
        //save the document
        return splittingDoc.saveAsync();
      }); //last
  };
  //############ end splitting function ############ 

  var splittingGroups = me.getLoSplittingGroups().getAllItems();
  var documentIndex = 0;
  var currentDoc;

  //############ start handler function ############ 
  var handleSplitting = function()
  {
    var handlePromise;

    if (documentIndex < splittingGroups.length) {
      currentDoc = splittingGroups[documentIndex];
      handlePromise = createSplittingDoc(currentDoc)
        .then(function() {
          documentIndex++;
          return handleSplitting();
        }
      );
    } else {
      //Releasing documents when no "splittingGroups" available
      me.setSetPhaseInBeforeSave("1");
      handlePromise = when.resolve();
    }
    return handlePromise;
  };
  //############ end handler function ############ 

  //looping over splitting groups

  promise = me.esStoreParentSignatures()
    .then(function () {
      Facade.startTransaction();

      return handleSplitting();
    })
    .then(function () {

      //cancel parent/initial document
      if (splittingGroups.length !== 0) {
        me.cancel();
        me.setSetPhaseInBeforeSave("0");
      }


      deferreds = [];

      deferreds.push(Facade.saveObjectAsync(me));
      if (Utils.isDefined(me.getLoInventories())) {
        deferreds.push(me.getLoInventories().saveAsync());
      }

      return when.all(deferreds);
    })
    .then(function () {
      return Facade.commitTransaction();
    });
} else {
  promise = when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
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
 * @function mapSignatureInformationToRefObject
 * @this BoSysReleaseProcess
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function mapSignatureInformationToRefObject(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var refObject = this.getReferenceObject();
var promise = when.resolve();
var signatureBlobsAreEmpty = Utils.isEmptyString(me.signatureBlob1) && Utils.isEmptyString(me.signatureBlob2) && Utils.isEmptyString(me.signatureBlob3) && Utils.isEmptyString(me.signatureBlob4);
//create this stuff only if signature is required
if(!signatureBlobsAreEmpty) {
  promise = BoFactory.createListAsync("LoSysSignatureAttribute", {}).then(
    function (loSignatureAttribute) {
      // Set Lo for SysSignatureAttributes
      refObject.setLoSysSignatureAttribute(loSignatureAttribute);
      refObject.getLoSysSignatureAttribute().addObjectItems(me.getLoSysSignatureAttribute().getAllItems());
      if(Utils.isDefined(loSignatureAttribute)) {
        var itemsLoSignatureAttribute = loSignatureAttribute.getAllItems();
        length = itemsLoSignatureAttribute.length;
        for(var i = 0; i < length; i++) { 
          if(itemsLoSignatureAttribute[i].getAttribute()== "Time") {
            var time = Localization.localize(Utils.createDateNow(), "date", Localization.formats.DateFormats.Time);
            itemsLoSignatureAttribute[i].setValue(time);
            break;
          }   
        }
      }
      var items = refObject.getLoSysSignatureAttribute().getAllItems();
      for (var k = 0; k < items.length; k++) {
        items[k].setObjectStatus(this.self.STATE_NEW_DIRTY);
      }
      return BoFactory.createListAsync("LoSysSignatureBlob", {});  
    }).then(
    function (loSignatureBlob) {
      refObject.setLoSysSignatureBlob(loSignatureBlob);
      // Create list items for SysSignatureBlob	
      var stepItems = me.getLoSysReleaseProcessStep().getAllItems();
      var objectItems = [];
      var customerPKey = " ";
      if (Utils.isDefined(refObject.getDeliveryRecipientPKey)) {
        customerPKey = refObject.getDeliveryRecipientPKey();
      }
      var phase = " ";
      if(Utils.isDefined(refObject.getPhase)){
        phase = refObject.getPhase();
      }
      if(Utils.isDefined(refObject.getTmgStatus)){
        phase = refObject.getTmgStatus();
      }
      var referencepkey = "";
      for(var i = 1; i <= stepItems.length; i++) {
        var mediaPath = me.get("signatureBlob" + i);
        if (stepItems[i-1].getUsrRoleId() === "MobileDSDDriver" && Utils.isEmptyString(me.get("signatureName" + i))) {
          me.set("signatureName" + i,ApplicationContext.get('user').getName());
        }
        var liSysSignatureBlob = {
          "pKey" : me.get("attachmentBlobPKey" + i),
          "bpaCustomerPKey" : customerPKey,
          "name" : me.get("signatureName" + i),
          "referencePKey" : refObject.getPKey(),
          "referenceObjectPhase" : phase,
          "sysReleaseProcessStepPKey" : stepItems[i-1].getPKey(),
          "usrUserPKey" : ApplicationContext.get('user').getPKey(),
          "mediaPath" : mediaPath,
          "type" : Utils.getFileExtensionFromMediaPath(mediaPath),
          "sysReleaseStepText" : stepItems[i-1].getText(),
          "sysSort" : stepItems[i-1].getSort(),
          "objectStatus" : STATE.NEW | STATE.DIRTY,
          "signaturePKey": PKey.next()
        };
        //get the referencepkey for sysattributes
        if (i == 1) {
          referencepkey = liSysSignatureBlob.signaturePKey;
        }

        //avoid creation of signature object if there is no signature
        if(Utils.isDefined(liSysSignatureBlob.type)){
          objectItems.push(liSysSignatureBlob);
        }

      }
      if(Utils.isDefined(objectItems) && objectItems.length > 0){
        refObject.getLoSysSignatureBlob().addListItems(objectItems);
        //CGCloud Additional Workaround for signature reference   
        if (Utils.isSfBackend()){ 
          var items = refObject.getLoSysSignatureAttribute().getAllItems();
          for (var k = 0; k < items.length; k++) {
            items[k].setReferencePKey(referencepkey);
            items[k].setObjectStatus(this.self.STATE_NEW_DIRTY);
          }
        }
      }
    });
}
else {
  me.loSysSignatureAttribute.setObjectStatus(STATE.PERSISTED);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
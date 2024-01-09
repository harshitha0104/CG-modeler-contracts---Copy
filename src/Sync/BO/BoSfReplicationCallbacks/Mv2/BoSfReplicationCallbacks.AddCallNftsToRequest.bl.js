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
 * @function addCallNftsToRequest
 * @this BoSfReplicationCallbacks
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} request
 * @param {Object} customerIds
 * @returns promise
 */
function addCallNftsToRequest(request, customerIds){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/*At the time of application start the input paramter 'customerIds' consists of multiple customer pkeys in the form of array. 
When the same method is called on loading/creating a call, the input paramater 'customerIds' consist of a single customer pkey 
for which the call is being executed which is in string format like "001f200001ckbtuAAA". Thus, the string format is then converted to array ["001f200001ckbtuAAA"] */
if (typeof(customerIds) == 'string') {
  customerIds = [customerIds];
}

customerIds = Utils.uniq(me.removeLocalIDs(customerIds));
var customerIdListString = "'" + customerIds.join("','") + "'";

request.addRequest('NFT_Job_Definition_List', customerIds);
request.addRequest('NFT_Customer_Task', customerIds);
request.addRequest('NFT_Asset', customerIds);
request.addRequest('NFT_Customer_Contract', customerIds);
request.addRequest('NFT_Customer_Contract_Payment', customerIds);
request.addRequest('NFT_Account_Receivable', customerIds);

var attachmentIDs;

var promise = Facade.selectSQL("DsBoSfReplicationCallbacks", "CustomerSetsOfCustomers", { "accountId": customerIdListString })
.then(function (accountSetIDs) {
  if(accountSetIDs.length > 0){
    accountSetIDs = me.getPropertyValuesFromArray(accountSetIDs, "AccountSetID");
    request.addRequest('NFT_Job_Definition_List_Set', accountSetIDs);
  }
  return Facade.selectSQL("DsBoSfReplicationCallbacks", "ContactPartnerIds", { "accountId": customerIdListString })
    .then(
    function (contactPartnerIds) {
      attachmentIDs = contactPartnerIds;
      
      //load attachments related to visits and visit jobs
      return Facade.selectSQL("DsBoSfReplicationCallbacks", "VisitAttachments", { "accountId": customerIdListString })
        .then(
        function (visitAttachmentIDs) {

          attachmentIDs = attachmentIDs.concat(visitAttachmentIDs);

          if(attachmentIDs.length > 0){
            var finalAttachmentIDs =  me.removeLocalIDs(me.getPropertyValuesFromArray(attachmentIDs, "Id"));        
            request.addRequest('NFT_Attachment', finalAttachmentIDs);  
          }
          return me.addOrderNftsToRequest(request, customerIds);
        });
    });
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
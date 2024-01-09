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
 * @function requestOnDemandDataAsync
 * @this BoSfReplicationCallbacks
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} syncContext
 * @returns promise
 */
function requestOnDemandDataAsync(syncContext){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var idsOfCustomersWithCallsForSync = [];
var idsOfManagedCustomersFromSubstitution = [];
var idsOfCallsToday = [];
var idsOfAccountSalesFolderForSync = [];
var idsOfOrgUnitSalesFolderForSync = [];
var idsOfRelevantCustomersFromContracts = [];
var idsOfRelevantParentAccounts = [];
var userId = Facade.getSfUserId();
var sqlBulkJsonArray = [];
var request = new BatchNftRequest();
var dateFrom;
var dateThru;

var loadIdsOfCustomersWithCallsForSync = function (result) {   
  idsOfCustomersWithCallsForSync = me.removeLocalIDs(me.getPropertyValuesFromArray(result.CustomersWithCallsForSync, "AccountID"));
  idsOfCallsToday = me.removeLocalIDs(me.getPropertyValuesFromArray(result.CustomersWithCallsForSync, "Id"));
};

var loadIdsOfManagedCustomersFromSubstitution = function (result) {
  idsOfManagedCustomersFromSubstitution = me.removeLocalIDs(me.getPropertyValuesFromArray(result.ManagedCustomersFromSubstitution, "AccountID"));
};

var loadDependentCustomers = function (result) { 
  var accountIds = me.removeLocalIDs(me.getPropertyValuesFromArray(result.DependentCustomers.concat(result.Account_TradeOrgs),"AccountID"));
  if(accountIds.length > 0) {
    request.addRequest('NFT_Job_Definition_List', accountIds);
    request.addRequest('NFT_Account_Header', accountIds);
  }
};

var loadCallData = function (result) {
  if(idsOfCallsToday.length + idsOfCustomersWithCallsForSync.length + idsOfManagedCustomersFromSubstitution.length > 0) {
    return me.addCallNftsToRequest(request,  idsOfCustomersWithCallsForSync.concat(idsOfManagedCustomersFromSubstitution));     
  }
  return when.resolve();
};


var loadCustomerTaskAttachments = function (result) {  
  var idsOfCustomerTaskAttachments = me.removeLocalIDs(me.getPropertyValuesFromArray(result.CustomerTaskAttachments, "attachmentId"));
  if(idsOfCustomerTaskAttachments.length > 0) { 
    request.addRequest('NFT_Attachment', idsOfCustomerTaskAttachments);
  }
};

var loadAttachments = function (result) { 
  var parentEntityIds = me.removeLocalIDs(me.getPropertyValuesFromArray(result.ParentEntityIds, "parentId"));
  parentEntityIds = parentEntityIds.concat(me.removeLocalIDs(me.getPropertyValuesFromArray(result.ManagedCustomers, "AccountID")));
  if(parentEntityIds.length > 0) {
    request.addRequest('NFT_Attachment', parentEntityIds);
  }
};

var loadTourInventories = function (result) {
  var idsOfAssignedTours = me.removeLocalIDs(me.getPropertyValuesFromArray(result.AssignedTours, "TourID"));
  if(idsOfAssignedTours.length > 0) {
    request.addRequest('NFT_Tour_Inventory', idsOfAssignedTours);               
  }
};

var loadTripListsOfUsers = function (result) {
  return BoFactory.loadObjectByParamsAsync(LO_TEAMOFSUPERVISOR, me.getQueryBy("usrPKey", userId))
    .then(function (teamList) {  
    var userIds = teamList.getAllItems();
    var idsOfUsers = me.removeLocalIDs(me.getPropertyValuesFromArray(userIds, "usrPKey"));
    if (!idsOfUsers.includes(userId))
      idsOfUsers.push(userId);
    if(idsOfUsers.length > 0) {        
      request.addRequest('NFT_Trip_List', idsOfUsers);  
    }
    return when.resolve();
  });
};

var loadCustomerSalesFolder = function (result) {
  idsOfAccountSalesFolderForSync = me.removeLocalIDs(me.getPropertyValuesFromArray(result.AccountsSalesFolderForSync, "BpaMainPKey"));
  if (idsOfAccountSalesFolderForSync.length > 0) {       
    request.addRequest('NFT_Sales_Folder_Account', idsOfAccountSalesFolderForSync);        
  }
};

var loadOrgUnitSalesFolder = function (result) {
  idsOfOrgUnitSalesFolderForSync = me.removeLocalIDs(me.getPropertyValuesFromArray(result.OrgUnitSalesFolderForSync, "OrgUnitPKey"));
  if (idsOfOrgUnitSalesFolderForSync.length > 0) {
    request.addRequest('NFT_Sales_Folder_Org_Unit', idsOfOrgUnitSalesFolderForSync);  
  }
};

var loadRelevantCustomerContract = function (result) {
  idsOfRelevantCustomersFromContracts = me.removeLocalIDs(me.getPropertyValuesFromArray(result.RelevantCustomerContracts, "AccountId"));
  if (idsOfRelevantCustomersFromContracts.length > 0) {
    request.addRequest('NFT_Customer_Contract', idsOfRelevantCustomersFromContracts);  
  }
};

var loadParentAccounts = function (result) {
  idsOfRelevantParentAccounts = me.removeLocalIDs(me.getPropertyValuesFromArray(result.ParentAccounts, "AccountId"));
  if (idsOfRelevantParentAccounts.length > 0) {
    request.addRequest('NFT_Account_Header', idsOfRelevantParentAccounts);  
  }
};

var promise = when.resolve();
if(Utils.isSfBackend()) {

  promise = me.getWorkingDays().then(
    function (workingDayRange){
      sqlBulkJsonArray = [
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "CustomersWithCallsForSync",
          jsonParams       :  workingDayRange,
          uniqueReturnKey  : "CustomersWithCallsForSync"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "ManagedCustomersFromSubstitution",
          jsonParams       :  {},
          uniqueReturnKey  : "ManagedCustomersFromSubstitution"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "DependentCustomers",
          jsonParams       :  {},
          uniqueReturnKey  : "DependentCustomers"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "Account_TradeOrgs",
          jsonParams       :  {},
          uniqueReturnKey  : "Account_TradeOrgs"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "CustomerTaskAttachments",
          jsonParams       : { userId: Facade.getSfUserId() },
          uniqueReturnKey  : "CustomerTaskAttachments"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "ManagedCustomers",
          jsonParams       :  {},
          uniqueReturnKey  : "ManagedCustomers"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "AssignedTours",
          jsonParams       :  {},
          uniqueReturnKey  : "AssignedTours"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "AccountsSalesFolderForSync",
          jsonParams       : {userId: Facade.getSfUserId()},
          uniqueReturnKey  : "AccountsSalesFolderForSync"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "OrgUnitSalesFolderForSync",
          jsonParams       : {userId: Facade.getSfUserId()},
          uniqueReturnKey  : "OrgUnitSalesFolderForSync"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "AllAttachments",
          jsonParams       : {dateFrom : Utils.convertForDB(workingDayRange.previousDay, 'DomDate'), 
                              dateThru : Utils.convertForDB(workingDayRange.nextDay, 'DomDate'), 
                              cgVisitDateFrom: Utils.convertForDB(Utils.addDays2AnsiDate(Utils.createAnsiDateToday(), -7), 'DomDate'), 
                              cgVisitDateThru: Utils.convertForDB(Utils.addDays2AnsiDate(Utils.createAnsiDateToday(), 14), 'DomDate')},
          uniqueReturnKey  : "ParentEntityIds"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "RelevantCustomerContracts",
          jsonParams       : {userId: Facade.getSfUserId()},
          uniqueReturnKey  : "RelevantCustomerContracts"	
        },
        {
          dataSource       : "DsBoSfReplicationCallbacks",
          dataSourceMethod : "ParentAccounts",
          jsonParams       :  {},
          uniqueReturnKey  : "ParentAccounts"	
        }
      ];

      return me.executeRequestsAsync(sqlBulkJsonArray).then(
        function(result){

          var promises = [];
          loadIdsOfCustomersWithCallsForSync(result);
          loadIdsOfManagedCustomersFromSubstitution(result);
          loadDependentCustomers(result);  
          promises.push(loadCallData(result));    
          loadTourInventories(result);  
          loadCustomerTaskAttachments(result);    
          promises.push(loadTripListsOfUsers(result));    
          loadCustomerSalesFolder(result);
          loadOrgUnitSalesFolder(result);    
          loadAttachments(result);
          loadRelevantCustomerContract(result);
          loadParentAccounts(result);

          return when.all(promises)
            .then(function() {
            return Facade.requestBatchNftDataAndWait(request);       
          });
        }
      );      
    });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
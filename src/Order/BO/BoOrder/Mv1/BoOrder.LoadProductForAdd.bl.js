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
 * @function loadProductForAdd
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} sdoItemMetaPKey
 * @returns promise
 */
function loadProductForAdd(sdoItemMetaPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();

//List of products for add can be very big. Do not reload the list if it is already available !!!
if(!Utils.isDefined(me.getLoProductForAdd())){

  var useClosedListing = "0";
  var jsonQuery = {
    params : []
  };
  //Removed to get all the products which are part of LoProductForAdd - load 
  //BoFactory.loadObjectByParamsAsync(LO_PRODUCTFORADD,  me.getJsonQueryForProductForAdd())

  if (Utils.isSfBackend()) {
    jsonQuery = me.getJsonQueryForProductForAdd();
  }
  else {
    if (me.getBoOrderMeta().getItemListOption() == "Hierarchy") {
      jsonQuery.params.push( { "field" : "criterionAttribute", "value" : me.getBoOrderMeta().getCriterionAttributeForLevel(me.getBoOrderMeta().getNumberOfHierarchyLevels())});    
    }
    else {
      jsonQuery.params.push({ "field": "criterionAttribute", "value": me.getBoOrderMeta().getCriterionAttributeForFlatList()});
    }
    //Passing variable for closed listing filter
    jsonQuery.params.push({ "field": "listing", "value": me.getBoOrderMeta().getListing()});
    jsonQuery.params.push({ "field": "listingWithModules", "value": me.getBoOrderMeta().getListingWithModules()});
    jsonQuery.params.push({ "field": "hitClosedListing", "value": me.getLuOrderer().getHitClosedListing()});
    jsonQuery.params.push({ "field": "collectClosedListing", "value": me.getLuOrderer().getCollectClosedListing()});
    jsonQuery.params.push({ "field": "considerListing", "value" : me.getBoOrderMeta().getConsiderListing()});
    jsonQuery.params.push({ "field": "useConsiderModule" , "value": me.getLuOrderer().getConsiderModule()});
  }
  // handle the case that free item is generated for product that is not in the closed listing of the used order item template
  if ((!Utils.isDefined(sdoItemMetaPKey)) || (sdoItemMetaPKey === '0')) {
    if (!Utils.isDefined(me.getBoOrderMeta().getLoOrderItemMetas().getCurrent())) {
      if (Utils.isDefined(me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate())) {
        useClosedListing = me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate().getUseClosedListing();
        jsonQuery.params.push({ "field": "useClosedListing", "value" : useClosedListing});
      }
      else {
        useClosedListing = me.getBoOrderMeta().getLoOrderItemMetas().getFirstItem().getUseClosedListing();
        jsonQuery.params.push({ "field": "useClosedListing", "value" : useClosedListing});
      }
    }
    else {
      useClosedListing = me.getBoOrderMeta().getLoOrderItemMetas().getCurrent().getUseClosedListing();
      jsonQuery.params.push({ "field": "useClosedListing", "value" : useClosedListing});
    }
  }
  else {
    useClosedListing = me.getBoOrderMeta().getLoOrderItemMetas().getItemTemplateByPKey(sdoItemMetaPKey).getUseClosedListing();
    jsonQuery.params.push({ "field" : "useClosedListing" , "value" : useClosedListing});
  }

  if (Utils.isSfBackend()) {
    if(me.getBoOrderMeta().getConsiderListing() == 1 && useClosedListing == 1 && (me.getLuOrderer().getHitClosedListing() == 1 || me.getLuOrderer().getCollectClosedListing() == 1)) {
      jsonQuery.params.push({ "field" : "closedListingCondition" , "value" : " AND Listed = '1' "});
    }
  }

  promise = BoFactory.loadObjectByParamsAsync(LO_PRODUCTFORADD,  jsonQuery).then(
    function (lO_PRODUCTFORADD) {
      var products = lO_PRODUCTFORADD.getAllItems();
      me.setProductForAddDict(Utils.createDictionary());

      for (var i = 0; i < products.length; i++) {
        var currentItem = products[i];

        if (!Utils.isDefined(currentItem.getPKey()) || Utils.isEmptyString(currentItem.getPKey())) {
          currentItem.setPKey(PKey.next());
        }
        // create dictionary for LoProductForAdd
        me.getProductForAddDict().add(currentItem.getPrdMainPKey(), currentItem);
      }
      me.setLoProductForAdd(lO_PRODUCTFORADD);
    });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
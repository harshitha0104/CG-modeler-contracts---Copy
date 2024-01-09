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
 * @function prepareCategoryQuickFilterList
 * @this BoCall
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} load
 * @param {String} isPromotionFilterSet
 * @param {String} isDiscrepanciesFilterSet
 * @returns promise
 */
function prepareCategoryQuickFilterList(load, isPromotionFilterSet, isDiscrepanciesFilterSet){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var surveyItems;
var ifSelectedInList = false;
var ifSelectedInCache = false;
var selectedFilter;
var loCurrentSurveyProducts = me.getBoJobManager().getLoCurrentSurveyProducts();

if(Utils.isDefined(me.getLoProductQuickFilter())){
  ifSelectedInList = me.getLoProductQuickFilter().getItemsByParam({"isSelected": true}).length > 0;
}
if(Utils.isDefined(me.getGroupQuickFilterCache()) && !Utils.isEmptyString(me.getGroupQuickFilterCache())){
  ifSelectedInCache = Object.keys(me.getGroupQuickFilterCache()).length > 0;
}


//Creates list for all cases
var addItemsToLoProductQuickFilter = function (items){
  var loProductQuickFilter = me.getLoProductQuickFilter();
  var categoryExists;
  var item;

  for (var i=0; i<items.length; i++){
    categoryExists = loProductQuickFilter.getItemsByParam({"text": items[i].getCategory()});
    if (categoryExists.length === 0){
      item = {
        "pKey": PKey.next(),
        "text": items[i].getCategory(),
        "isSelected": false,
        "specialOption": ""
      };
      loProductQuickFilter.addListItems([item]);
    }
  }
  loProductQuickFilter.orderBy({"text": "ASC"});
};


//Reapply filter from either LoProductQuickFilter or QuickFilterCache
var applySelectedFilterToList = function (){
  var selectedFilterExistsInLo = me.getLoProductQuickFilter().getItemsByParam({"text": selectedFilter});

  if(selectedFilterExistsInLo.length > 0){
    selectedFilterExistsInLo[0].setIsSelected(true);
  }
};


if((ifSelectedInList || ifSelectedInCache) && load === "0"){
  //Create list when one of the quick filters is selected either in LoProductQuickFilter or QuickFilterCache
  var loProductQuickFilter = me.getLoProductQuickFilter();
  var filterArray = [];

  if(ifSelectedInList === true){
    selectedFilter = loProductQuickFilter.getItemsByParam({"isSelected": true})[0].text;
  } else{
    selectedFilter = me.getGroupQuickFilterCache();
  }

  loProductQuickFilter.removeAllItems();
  if(isPromotionFilterSet == "1"){
    filterArray.push({"planned": "1", "op": "EQ"});
  }
  if(isDiscrepanciesFilterSet == "1"){
    filterArray.push({"hasDiscrepance": "1", "op": "EQ"});
  }
  filterArray.push({"category": selectedFilter, "op": "EQ"});

  loCurrentSurveyProducts.resetFilter("category");
  promise = loProductQuickFilter.createAsync().then(
    function (){
      surveyItems = loCurrentSurveyProducts.getItems();
      loCurrentSurveyProducts.resetFilter("planned");
      loCurrentSurveyProducts.resetFilter("hasDiscrepance");
      loCurrentSurveyProducts.setFilterArray(filterArray);
      if(surveyItems.length > 0){
        addItemsToLoProductQuickFilter(surveyItems);
      }
      applySelectedFilterToList();
    });
} else{
  //Create new list when no quick filter is applied
  promise = BoFactory.createObjectAsync("LoProductQuickFilter", {}).then(
    function (quickFilterList){
      me.setLoProductQuickFilter(quickFilterList);

      if(load == "1"){
        //Reset QuickFilterCache on survey load
        me.setGroupQuickFilterCache(null);
      } else{
        var loProductQuickFilter = me.getLoProductQuickFilter();
        surveyItems = loCurrentSurveyProducts.getItems();
        if(surveyItems.length > 0){
          addItemsToLoProductQuickFilter(surveyItems);
        }
      }
    });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
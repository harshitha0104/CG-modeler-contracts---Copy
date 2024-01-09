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
 * @function addProduct
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {DomString} productPKey
 * @param {DomString} productId
 * @param {DomString} posId
 * @returns promise
 */
function addProduct(productPKey, productId, posId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;

// determine if product exists already
var loProducts = me.getLoCurrentSurveyProducts();
var existingProducts = loProducts.getItemsByParam({
  "prdMainPKey" : productPKey,
  "posId" : posId
});
var liProduct;
if (existingProducts.length > 0) {
  liProduct = existingProducts[0];
}

var loCurrentPOS = this.getLoPOS().getItemsByParam({"posId" : posId});
var liCurrentPOS;

if (loCurrentPOS.length > 0) {
  liCurrentPOS = loCurrentPOS[0];
}

var jDLQuery = {};

jDLQuery.params = [
  {"field" : "clbMainPKey","operator" : "EQ","value" : me.getClbMainPKey()},
  {"field" : "clbMetaPKey","operator" : "EQ","value" : me.getClbMetaPKey()},
  {"field" : "bpaMainPKey","operator" : "EQ","value" : me.getBpaMainPKey()},
  {"field" : "validFrom","operator" : "EQ","value" : me.getReferenceDate()},
  {"field" : "validThru","operator" : "EQ","value" : me.getReferenceDate()},
  {"field" : "responsiblePKey","operator" : "EQ","value" : me.getResponsiblePKey()},
  {"field" : "historicalProducts","operator" : "EQ","value" : me.getHistoricalProductConfig()},
  {"field" : "posPKey","operator" : "EQ","value" : Utils.isDefined(liCurrentPOS) ? liCurrentPOS.getBpaMainPKey() : ''},
];

if (!Utils.isDefined(liProduct)) {
  //add product
  var jsonQuery = {};
  var jsonParams = [];
  jsonParams.push({"field" : "pKey","operator" : "EQ","value" : productPKey});
  jsonQuery.params = jsonParams;

  promise = Facade.getObjectAsync("LuProduct", jsonQuery).then(
    function (lookup) {
      liProduct = {
        "pKey" : PKey.next(),
        "prdMainPKey" : productPKey,
        "text1" : lookup.text1,
        "shortText" : lookup.shortText,
        "prdGroupText" : lookup.groupShortText,
        "prdGroupId" : lookup.groupId,
        "eAN" : lookup.eAN,
        "prdId" : productId,
        "posId" : posId,
        "listedPlanned" : " ",
        "foreignProduct" : lookup.foreignProduct,
        "category" : lookup.category,
        "surveysInitialized" : "0",
        "manualProduct" : "1",
      };
      loProducts.addListItems([liProduct]);

      if (me.getHistoricalProductConfig() !== "No") {
        me.updateHistoricalProductsAsync("add", productPKey, posId);
      }

      return BoFactory.loadObjectByParamsAsync("LuJobDefinitionList", jDLQuery);
    }).then(
    function (jobDefinitionListLookup) {
      if (Utils.isDefined(jobDefinitionListLookup) && Utils.isDefined(jobDefinitionListLookup.getJDLPKeys())) {
        liProduct.jDLPKeys = jobDefinitionListLookup.getJDLPKeys();
      }
      liProduct.setIsProductAddedManually("1");
      liProduct.setIsSurveyInitializedByManualPrdAdd("0");
      loProducts.setCurrentByPKey(liProduct.getPKey());
    }
  );
}
else {
  var isSelectedPrdManuallyAdded = liProduct.getPrdMainPKey() === loProducts.getCurrent().getPrdMainPKey();

  if (isSelectedPrdManuallyAdded && liProduct.getIsProductAddedManually() === "0") {
    //User is trying to add the current product in focus manually again, so reload JDLPkeys and call GetSurveys & filterSurveysByProduct explicitly
    promise = BoFactory.loadObjectByParamsAsync("LuJobDefinitionList", jDLQuery).then(
      function (jobDefinitionListLookup) {
        if (Utils.isDefined(jobDefinitionListLookup) && Utils.isDefined(jobDefinitionListLookup.getJDLPKeys())) {
          liProduct.jDLPKeys = jobDefinitionListLookup.getJDLPKeys();
        }
        liProduct.setIsProductAddedManually("1");
        liProduct.setIsSurveyInitializedByManualPrdAdd("0");
        loProducts.setCurrentByPKey(liProduct.getPKey());
        return me.getSurveys(posId, productPKey, liProduct.getPKey());
      }).then(
      function() {
        me.filterSurveysByProduct(productPKey, posId);
      }
    );
  }
  else if (!isSelectedPrdManuallyAdded && liProduct.getIsProductAddedManually() === "0") {
    //User is trying to add an already available product  manually again, so jus reload JDLPkeys and setCurrentByPKey takes care of calling GetSurveys & filterSurveysByProduct.
    promise = BoFactory.loadObjectByParamsAsync("LuJobDefinitionList", jDLQuery).then(
      function (jobDefinitionListLookup) {
        if (Utils.isDefined(jobDefinitionListLookup) && Utils.isDefined(jobDefinitionListLookup.getJDLPKeys())) {
          liProduct.jDLPKeys = jobDefinitionListLookup.getJDLPKeys();
        }
        liProduct.setIsProductAddedManually("1");
        liProduct.setIsSurveyInitializedByManualPrdAdd("0");
        loProducts.setCurrentByPKey(liProduct.getPKey());
      }
    );
  }
  else {
    loProducts.setCurrentByPKey(liProduct.getPKey());
    promise = when.resolve();
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
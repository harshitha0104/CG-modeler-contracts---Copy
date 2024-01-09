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
 * @function updateHistoricalProductsAsync
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} action
 * @param {String} prdMainPKey
 * @param {String} posId
 * @returns promise
 */
function updateHistoricalProductsAsync(action, prdMainPKey, posId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;

// determine POSBpaMainPKEy (or blank if store)
var posPKey = posId;
if (posId !== " ") {
  var loCurrentPOS = this.getLoPOS().getItemsByParam({
    "posId" : posId
  });

  if (loCurrentPOS.length > 0) {
    posPKey = loCurrentPOS[0].getBpaMainPKey();
  }
}

var clbMetaPKey = " ";
if (me.getHistoricalProductConfig() === "SameMeta") {
  clbMetaPKey = me.getClbMetaPKey();
}

// Check the Survey Products List in dictionary
var dictProductList = me.getDictHistoricalProductsLoaded();
if (!Utils.isDefined(dictProductList)) {
  dictProductList = Utils.createDictionary();
  me.setDictHistoricalProductsLoaded(dictProductList);
}

// Check if the PrdMainPkey is already there in the dictionary
if (!dictProductList.containsKey(prdMainPKey)) {
  // Load the Products by calling Async method

  // Check the list which has already been loaded
  var jsonQueryHist = {};
  jsonQueryHist.params = [
    {
      "field" : "bpaCustomerPKey",
      "operator" : "EQ",
      "value" : me.getBpaMainPKey()
    },
    {
      "field" : "bpaCustomerPKeyComp",
      "operator" : "EQ",
      "value" : "EQ"
    },
    {
      "field" : "prdMainPKey",
      "operator" : "EQ",
      "value" : prdMainPKey
    },
    {
      "field" : "prdMainPKeyComp",
      "operator" : "EQ",
      "value" : "EQ"
    }
  ];

  if (me.getHistoricalProductConfig() === "SameMeta") {
    jsonQueryHist.params.push({
      "field" : "clbMetaPKey",
      "operator" : "EQ",
      "value" : me.getClbMetaPKey()
    });
    jsonQueryHist.params.push({
      "field" : "clbMetaPKeyComp",
      "operator" : "EQ",
      "value" : "EQ"
    });
  }

  if (!Utils.isDefined(me.getLoHistoricalProducts())){
    promise = BoFactory.loadListAsync("LoBpaHistSurveyProduct", jsonQueryHist).then(
      function (list) {
        me.setLoHistoricalProducts(list);
      }
    );
  } else {
    promise = when.resolve();
  }
} else {
  promise = when.resolve();
}

promise = promise.then(
  function () {
    // Add in the dictionary
    dictProductList.add(prdMainPKey, prdMainPKey);

    var loHistPrdForProduct = me.getLoHistoricalProducts().getItemsByParamArray([
      {
        "prdMainPKey" : prdMainPKey,
        "op" : "EQ"
      }, {
        "objectStatus" : this.self.STATE_DELETED,
        "op" : "NE"
      }
    ], [
      {
        "bpaPOSPKey" : "ASC"
      }
    ]);

    var loHistPrdForProductAndPos = me.getLoHistoricalProducts().getItemsByParamArray([
      {
        "prdMainPKey" : prdMainPKey,
        "op" : "EQ"
      }, {
        "bpaPOSPKey" : posPKey,
        "op" : "EQ"
      }, {
        "objectStatus" : this.self.STATE_DELETED,
        "op" : "NE"
      }
    ], []);

    var aCurrentPOSProduct;

    switch (action) {
      case "add":
        var bValidEntryExists = false;

        if ((posId === " " && loHistPrdForProduct.length > 0) || (posId !== " " && loHistPrdForProductAndPos.length > 0)) {
          bValidEntryExists = true;
        }

        if (!bValidEntryExists) {
          // create new entry
          me.getLoHistoricalProducts().addToHistory(prdMainPKey, posPKey, clbMetaPKey, me.getBpaMainPKey());

          // update already loadad survey products (store + selected POS)

          var aStorePOS = me.getLoPOS().getItemsByParamArray([{ "posId" : " ", "op" : "EQ" }]);
          if (aStorePOS.length > 0) {
            var aStoreJobProduct = aStorePOS[0].getSurveyProducts().getItemsByParamArray([
              { 
                "prdMainPKey" : prdMainPKey,
                "op" : "EQ"
              }, {
                "posId" : " ",
                "op" : "EQ"
              }
            ], []);

            if (aStoreJobProduct.length > 0) {
              aStoreJobProduct[0].setHistorical("1");
            }
          }

          aCurrentPOSProduct = me.getLoCurrentSurveyProducts().getItemsByParamArray([
            {
              "prdMainPKey" : prdMainPKey,
              "op" : "EQ"
            }
          ], []);

          if (aCurrentPOSProduct.length > 0) {
            aCurrentPOSProduct[0].setHistorical("1");
          }
        }

        break;

      case "delete":
        if (posId === " ") {
          // delete from store & POS
          me.getLoHistoricalProducts().deleteFromHistory(prdMainPKey, " ", clbMetaPKey, me.getBpaMainPKey());

          // update already loadad survey products (all of same product, independent of POS)
          var aPOS = me.getLoPOS().getAllItems();
          var idxPos;
          var aJobProductOfPOS;

          for (idxPos = 0; idxPos < aPOS.length; idxPos++) {
            if (aPOS[idxPos].getProductsInitialized() == "1") {
              var id = aPOS[idxPos].getPosId();

              aJobProductOfPOS = me.getLoCurrentSurveyProducts().getItemsByParamArray([
                {
                  "prdMainPKey" : prdMainPKey,
                  "op" : "EQ"
                }, {
                  "posId" : id,
                  "op" : "EQ"
                }
              ]);

              if (aJobProductOfPOS.length > 0) {
                aJobProductOfPOS[0].setHistorical("0");
              }
            }
          }

        } else {
          // delete from POS
          me.getLoHistoricalProducts().deleteFromHistory(prdMainPKey, posPKey, clbMetaPKey, me.getBpaMainPKey());

          // update already loadad POS product
          aCurrentPOSProduct = me.getLoCurrentSurveyProducts().getItemsByParamArray([
            {
              "prdMainPKey" : prdMainPKey,
              "op" : "EQ"
            }
          ], []);

          if (aCurrentPOSProduct.length > 0) {
            aCurrentPOSProduct[0].setHistorical("0");
          }
        }

        break;
    }
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
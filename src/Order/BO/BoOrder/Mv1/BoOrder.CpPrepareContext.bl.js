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
 * @function cpPrepareContext
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function cpPrepareContext(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/**
 This methods is reading/combining all needed data to build a JSON object which contains all data 
(except condition values) needed by the pricing engine to calculate the order price:

  Order Information
  Order Items
  Calculation Steps
  Key Types
  Item Meta Rules
  Customer Information
  Customer Hierarchy
  Customer Sets
  Promotions
  Rewards
  Product Information (including Unit Factors)
*/

var contextJSON = {};
var dicSearchStrategies = Utils.createDictionary();
var listSearchStrategies = [];
var dicItemMetaRules = Utils.createDictionary();
var listItemMetaRules = [];
var dicProductKeys = Utils.createDictionary();
var listProductKeys = [];

/**########################
# Configuration Data     #
#                        #
#  - Calculation Steps   #
########################*/
var configurationData = [
  {
    dataSource       : "DsComplexPricing",
    dataSourceMethod : "CndCpReadCalculationSteps",
    jsonParams       :  {CndCpCalculationSchemaPKey: me.getCndCpCalculationSchemaPKey()},
    uniqueReturnKey  : "CndCpReadCalculationSteps"	
  }
];

/**##############################
# Configuration Data (Level2)   #
#                               #
#  - Key Types                  #
#  - ItemMetaRules              #
###############################*/
var dsReadKeyTypes = {
  dataSource       : "DsComplexPricing",
  dataSourceMethod : "CndCpReadKeyTypes",
  jsonParams       : {SearchStrategyList: ''},
  uniqueReturnKey  : "CndCpReadKeyTypes"	
};

var dsReadItemMetaUsage =  {
  dataSource       : "DsComplexPricing",
  dataSourceMethod : "CndCpReadItemMetaUsage",
  jsonParams       : {CndCpItemMetaRulePKeyList: ''},
  uniqueReturnKey  : "CndCpReadItemMetaUsage"	
};

//adds params for configuration data (level 2) queries
//unique list of search strategy keys used by the calc steps
var getConfigurationDataLevel2 = function (calculationSteps) { 

  for (count = 0; count < calculationSteps.length; count++) {
    var currentStep = calculationSteps[count];

    //search strategies
    if(!dicSearchStrategies.containsKey(currentStep.CndCpSearchStrategyPKey) && !Utils.isEmptyString(currentStep.CndCpSearchStrategyPKey)){
      dicSearchStrategies.add(currentStep.CndCpSearchStrategyPKey, currentStep.CndCpSearchStrategyPKey);
      listSearchStrategies.push(currentStep.CndCpSearchStrategyPKey);
    }

    //item meta rules
    if(!dicItemMetaRules.containsKey(currentStep.CndCpItemMetaRulePKey) && !Utils.isEmptyString(currentStep.CndCpItemMetaRulePKey)){
      dicItemMetaRules.add(currentStep.CndCpItemMetaRulePKey, currentStep.CndCpItemMetaRulePKey);
      listItemMetaRules.push(currentStep.CndCpItemMetaRulePKey);
    }
  }

  var sqlBulkLevel2 = [];
  //if(listSearchStrategies.length > 0){
  dsReadKeyTypes.jsonParams.SearchStrategyList = listSearchStrategies;
  sqlBulkLevel2.push(dsReadKeyTypes);
  //}
  //if(listItemMetaRules.length > 0){
  dsReadItemMetaUsage.jsonParams.CndCpItemMetaRulePKeyList = listItemMetaRules;
  sqlBulkLevel2.push(dsReadItemMetaUsage);
  //}

  return sqlBulkLevel2;
};

/**###################################
# Contextual Data (Customer Related) #
#                                    #
#  - Customer Attributes             #
#  - Customer Hierarchy              #
#  - Customer Sets                   #
#  - Promotions                      #
#  - Rewards                         #
######################################*/
var contextualCustomerData = [
  {
    dataSource       : "DsComplexPricing",
    dataSourceMethod : "CndCpReadCustomerAttributes",
    jsonParams       : {BpaMainPKey: me.getOrdererPKey()},
    uniqueReturnKey  : "CndCpReadCustomerAttributes"	
  },
  {
    dataSource       : "DsComplexPricing",
    dataSourceMethod : "CndCpReadCustomerHierarchy",
    jsonParams       : {CustomerPKey: me.getOrdererPKey()},
    uniqueReturnKey  : "CndCpReadCustomerHierarchy"	
  },
  {
    dataSource       : "DsComplexPricing",
    dataSourceMethod : "CndCpReadBpaSets",
    jsonParams       : {CustomerPKey: me.getOrdererPKey(),
                        CalculationSchemaPKey:  me.getCndCpCalculationSchemaPKey()
                       },
    uniqueReturnKey  : "CndCpReadBpaSets"	
  },
  {
    dataSource       : "DsComplexPricing",
    dataSourceMethod : "CndCpReadPromotions",
    jsonParams       : {CustomerPKey: me.getOrdererPKey(),
                        CalculationSchemaPKey:  me.getCndCpCalculationSchemaPKey()
                       },
    uniqueReturnKey  : "CndCpReadPromotions"	
  },
  {
    dataSource       : "DsComplexPricing",
    dataSourceMethod : "CndCpReadRewards",
    jsonParams       : {CustomerPKey: me.getOrdererPKey(),
                        CalculationSchemaPKey:  me.getCndCpCalculationSchemaPKey()
                       },
    uniqueReturnKey  : "CndCpReadRewards"	
  }
];


/**###################################
# Contextual Data (Product Related)  #
#                                    #
#  - Product Information             #
#  - Unit Factors                    #
######################################*/
var dsReadProductAttributes = 
    {
      dataSource       : "DsComplexPricing",
      dataSourceMethod : "CndCpReadProductAttributes",
      jsonParams       : {PrdMainPKey: []},
      uniqueReturnKey  : "CndCpReadProductAttributes"	
    }
;
var dsReadProductUnitFactors = 
    {
      dataSource       : "DsComplexPricing",
      dataSourceMethod : "CpReadUnitFactorsForProductList",
      jsonParams       : {ProductList: []},
      uniqueReturnKey  : "CpReadUnitFactorsForProductList"	
    }
;

//build product information
//function combines product information and uinitFactorInformation
var getProductInformation = function (productInformationList, unitFactorList) { 

  var currentProduct;
  var currentUoM = [];
  var dicUoM = Utils.createDictionary();

  //create UoM dictionary
  for (var i = 0; i < unitFactorList.length; i++) {

    unitFactorItem = unitFactorList[i];

    if(currentProduct != unitFactorItem.ProductPKey){
      if(!dicUoM.containsKey(currentProduct)){
        dicUoM.add(currentProduct, currentUoM);
        currentUoM = [];
      }
      currentProduct = unitFactorItem.ProductPKey;
    }else{
      currentUoM.push(unitFactorItem);
    }

    if(i == unitFactorList.length - 1){
      if(!dicUoM.containsKey(currentProduct)){
        dicUoM.add(currentProduct, currentUoM);
      }
    }
  }

  //update product information
  var currentProductInformation;
  for (var j = 0; j < productInformationList.length; j++) {

    currentProductInformation = productInformationList[j];

    if(Utils.isDefined(dicUoM.get(currentProductInformation.PKey))){
      currentProductInformation.UoM = dicUoM.get(currentProductInformation.PKey);
    }
  }
  return productInformationList;
};


/**##########################
# Order Data                #
#                           #
#  - Order Information      #
#  - Order Items            #
#############################*/

//build order information data
//fixed order fields used by PPP engine 
// + Attributes defined in cpGetRelevantOrderAttributes 
// + VariantAttributes defined in cpGetVariantOrderVariables
var getOrderInformation = function () { 

  //Pricing Data logic
  if (me.getBoOrderMeta().getCpPricingDate() === "DeliveryDate") {
    me.setPricingDate(me.getDeliveryDate());
  }

  var orderInformation = {
    "Id":                me.getPKey(),
    "Meta":              me.getSdoMetaPKey(),
    "Orderer":           me.getOrdererPKey(),
    "PricingDate":       me.getPricingDate(),
    "Cur":               me.getCurrency(),
    "SchemaId":          me.getCndCpCalculationSchemaPKey(),
    "DiChnl":            me.getDistribChannel(),
    "Division":          me.getDivision(),
    "Log":               me.getBoOrderMeta().getGeneratePricingLog(),
    "Attributes":        me.cpGetRelevantOrderAttributes(),
    "VariantAttributes": me.cpGetVariantOrderVariables()
  };

  return orderInformation;
};


// build order items  data
// all order items with qty bigger 0 
//  + adding Variant Attributes
var getOrderItems = function () { 

  var items = me.createPricingInformationForList();
  var orderItemsBiggerZero = [];

  for (var i = 0; i < items.length; i++) {
    orderItem = items[i].getData();
    if (Utils.isDefined(orderItem.quantity) && orderItem.quantity > 0) {

      //create unique list of product keys (needed to load product information and UoM)
      if(!dicProductKeys.containsKey(orderItem.prdMainPKey) && !Utils.isEmptyString(orderItem.prdMainPKey)){
        dicProductKeys.add(orderItem.prdMainPKey, orderItem.prdMainPKey);
        listProductKeys.push(orderItem.prdMainPKey);
      }

      orderItem.VariantAttributes = me.cpGetVariantItemVariables(orderItem.pKey);
      orderItemsBiggerZero.push(orderItem);
    }
  }

  dsReadProductAttributes.jsonParams.PrdMainPKey = listProductKeys;
  dsReadProductUnitFactors.jsonParams.ProductList = listProductKeys;
  return orderItemsBiggerZero;
};

//order data
contextJSON.orderInformation = getOrderInformation();
contextJSON.orderItems = getOrderItems();

//build requests
var sqlBulkLevel1 = configurationData.concat(contextualCustomerData);
sqlBulkLevel1.push(dsReadProductAttributes);
sqlBulkLevel1.push(dsReadProductUnitFactors);

//execute requests
var promise = me.executeRequestsAsync(sqlBulkLevel1).then(
  function(result){

    var level2ConfigurationDataRequests;

    if(Utils.isDefined(result)){

      //configuration data 
      // - calculation steps
      if(Utils.isDefined(result.CndCpReadCalculationSteps)){
        contextJSON.calculationSteps = result.CndCpReadCalculationSteps;
        level2ConfigurationDataRequests = getConfigurationDataLevel2(contextJSON.calculationSteps);
      }

      //contextual data 
      if(Utils.isDefined(result.CndCpReadCustomerAttributes) && Utils.isDefined(result.CndCpReadCustomerAttributes[0])){contextJSON.customerAttributes = result.CndCpReadCustomerAttributes[0];}
      if(Utils.isDefined(result.CndCpReadCustomerHierarchy) && Utils.isDefined(result.CndCpReadCustomerHierarchy[0])){contextJSON.customerHierarchy = result.CndCpReadCustomerHierarchy[0];}
      if(Utils.isDefined(result.CndCpReadBpaSets)){contextJSON.customerSets = result.CndCpReadBpaSets;}
      if(Utils.isDefined(result.CndCpReadPromotions)){contextJSON.customerPromotions = result.CndCpReadPromotions;}
      if(Utils.isDefined(result.CndCpReadRewards)){contextJSON.customerRewards = result.CndCpReadRewards;}

      //product data
      if(Utils.isDefined(result.CndCpReadProductAttributes) && Utils.isDefined(result.CpReadUnitFactorsForProductList)){
        contextJSON.productInformation = getProductInformation(result.CndCpReadProductAttributes, result.CpReadUnitFactorsForProductList);
      }
    }

    return  me.executeRequestsAsync(level2ConfigurationDataRequests).then( function (result) {

      //configuration data (level 2)
      // - ItemMetaUsage
      // - Key Types
      if(Utils.isDefined(result.CndCpReadItemMetaUsage)){contextJSON.itemMetaRules = result.CndCpReadItemMetaUsage;}
      if(Utils.isDefined(result.CndCpReadKeyTypes)){contextJSON.keyTypes = result.CndCpReadKeyTypes;}


      return  CP.PricingHandler.getInstance().calculateOrderValueViaContext(contextJSON).then( function (result) {
        return contextJSON;
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
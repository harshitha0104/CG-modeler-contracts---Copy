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
 * @function createAuditTrailJSON
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function createAuditTrailJSON(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var i;
var promotion;
var rewardGroup;
//Creating Audit Trail
var json = {};

var reward = me.getHurdleEvaluationHelper().getLoRewards().getAllItems();
for (i = 0; i < reward.length; i++) {
  promotion = reward[i].getPromotionPKey();
  if (!(promotion in json)) {
    json[promotion] = [];
  }

  rewardGroup = reward[i].getRewardGroupId();
  if (json[promotion].filter(function (x) {
    return x.id == rewardGroup;
  }).length === 0) {
    json[promotion].push({
      id: rewardGroup,
      name: reward[i].getPromotionRewardGroupTitle(),
      hurdles: [],
      rewards: []
    });
  }

  var privateHurdle = {};
  if(!Utils.isEmptyString(reward[i].getHurdlePKey())){
    var hurdleItem = me.getHurdleEvaluationHelper().getLoHurdles().getItemByPKey(reward[i].getHurdlePKey());
    privateHurdle =
      {
      id: hurdleItem.getPKey(),
      name: hurdleItem.getHurdleTitle(),
      expressionFunction: hurdleItem.getExpressionFunction(),
      targetValue: reward[i].getTargetValue(),
      calculatedValue: reward[i].getCalculatedValue(),
      operator: hurdleItem.getOperator(),
      fulfilled: reward[i].getPerFactor() >= 1 ? "1" : "0"
    };
  }

  if (reward[i].getRewardType() === "FreeItem") {
    var invalidRewardProducts = [];

    var freeItems = me.getHurdleEvaluationHelper().getLoRewardProducts().getItemsByParamArray([{
      "isValidFreeItem": 0
    }, {
      "promotionReward": reward[i].getPKey()
    }]);

    if (freeItems.length > 0) {
      freeItems.forEach(function (freeItem) {
        invalidRewardProducts.push({
          id: freeItem.getPrdId(),
          name: freeItem.getProductName()
        });
      });
    }

    json[promotion].find(function (x) {
      return x.id == rewardGroup;
    }).rewards.push({
      id: reward[i].getPKey(),
      name: reward[i].getRewardTitle(),
      isApplicable: reward[i].getIsApplicable(),
      selected: reward[i].getSelected(),
      invalidRewardProducts: invalidRewardProducts,
      hurdle: privateHurdle
    });
  } else {
    var rewardDictionary = Utils.createDictionary();
    rewardDictionary.add("id", reward[i].getPKey());
    rewardDictionary.add("name", reward[i].getRewardTitle());
    rewardDictionary.add("isApplicable", reward[i].getIsApplicable());
    rewardDictionary.add("selected", reward[i].getSelected());
    rewardDictionary.add("hurdle", privateHurdle);

    if (reward[i].getRewardType() === "Special") {
      if(!Utils.isEmptyString(reward[i].getUserExitResult())) {
        rewardDictionary.add("userExitResult", reward[i].getUserExitResult());
      }
      else if(!Utils.isEmptyString(reward[i].getClassification())){
        rewardDictionary.add("classification", reward[i].getClassification());
      }
    }

    json[promotion].find(function (x) {
      return x.id == rewardGroup;
    }).rewards.push(rewardDictionary.data);
  }
}

var hurdle = me.getHurdleEvaluationHelper().getLoHurdles().getItemsByParamArray([{"hurdleType": "RewardSpecific", "op":"NE"}]);
for (i = 0; i < hurdle.length; i++) {
  promotion = hurdle[i].getPromotionPKey();
  if (!(promotion in json)) {
    json[promotion] = [];
  }

  rewardGroup = hurdle[i].getRewardGroupId();
  if (json[promotion].filter(function (x) {
    return x.id == rewardGroup;
  }).length === 0) {
    json[promotion].push({
      id: rewardGroup,
      name: hurdle[i].getPromotionRewardGroupTitle(),
      hurdles: []
    });
  }

  json[promotion].find(function (x) {
    return x.id == rewardGroup;
  }).hurdles.push({
    id: hurdle[i].getPKey(),
    name: hurdle[i].getHurdleTitle(),
    expressionFunction: hurdle[i].getExpressionFunction(),
    targetValue: hurdle[i].getTargetValue(),
    calculatedValue: hurdle[i].getCalculatedValue(),
    operator: hurdle[i].getOperator(),
    fulfilled: hurdle[i].getIsFulfilled(),
    operation: hurdle[i].getOperation()
  });
}

//Storing Audit Trail
if (Object.keys(json).length > 0){
  var fileType = 'zip';
  var compressed = true;
  var curDate = Utils.createDateNow();
  var dateExtension = "_" + (curDate.getUTCMonth() + 1) + "_" + curDate.getUTCDate() + "_" + curDate.getUTCFullYear();
  var loadLoAttachmentsPromise = when.resolve();

  if (!Utils.isDefined(me.getLoOrderAttachment())) {
    loadLoAttachmentsPromise = BoFactory.loadObjectByParamsAsync(LO_ORDERATTACHMENT, me.getQueryBy("sdoMainPKey", me.getPKey())).then(
      function (loAttachments) {
        me.setLoOrderAttachment(loAttachments);
      });
  }

  promise = loadLoAttachmentsPromise.then(
    function () {
      return Facade.saveJSONFileAsync(json, compressed).then(
        function (mediaPath) {

          var items = me.getLoOrderAttachment().getItemsByParam({
            "usage": "HurdleRewardLog"
          });

          if (items.length > 0) {
            items[0].setType(fileType);
            items[0].setMediapath(mediaPath);
            items[0].setCreationDate(Utils.convertDate2Ansi(Utils.createDateNow()));
            items[0].setFileName("Rewards_" + me.getPKey() + dateExtension + "." + fileType);
          } else {
            var liNewAttachment = {
              "pKey": PKey.next(),
              "sdoMainPKey": me.getPKey(),
              "attachmentBlobPKey": PKey.next(),
              "attachmentTextPKey": PKey.next(),
              "usage": "HurdleRewardLog",
              "attachmentText": "Audit Trail",
              "type": fileType,
              "fileName": "Rewards_" + me.getPKey() + dateExtension + "." + fileType,
              "mediapath": mediaPath,
              "creationDate": Utils.convertDate2Ansi(curDate),
              "objectStatus": STATE.NEW | STATE.DIRTY
            };
            me.getLoOrderAttachment().addListItems([liNewAttachment]);
          }
        });
    });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
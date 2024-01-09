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
 * @function afterLoadAsync
 * @this LoCheckInPaymentItems
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterLoadAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve(result);
var params = Utils.convertDsParamsOldToNew(context.jsonQuery);
var loPaymentMeta = params.loPaymentMeta.getAllItems();

if (loPaymentMeta.length !== 0) {
  var sdoMainPKey = params.sdoMainPKey;
  var phase = params.phase;
  var loPayments = params.loPayments;
  var insertionItem;
  var items = me.getAllItems();
  var masterItemPositions = Utils.createDictionary();
  var insertionIndex = 0;
  var insertionCorrection = 0;
  var runningMethod = "";
  var runningMethodText = "";
  var runningAmount = 0;
  var currentMethod = "";
  var currentMethodText = "";
  var currentAmount = 0;
  var currentItem;

  var i = 0;
  var length = items.length;

  //helper function for creating a new item
  var createNewItem = function (runningMethod, runningMethodText, runningAmount, insertPosition, masterItemPositions, loPaymentMeta, sdoMainPKey, loPayments, phase) {
    runningAmount = Math.round(runningAmount * 100) / 100;

    var masterItem = BoFactory.instantiate("LiCheckInPaymentItems", {});
    var foundItem;

    if (Utils.isDefined(loPayments)) {
      var payItems = loPayments.getAllItems();
      var loPaymentLength = payItems.length;
      var index = 0;
      for (; index < loPaymentLength; index++) {
        if (payItems[index].getPaymentMethod() == runningMethod) {
          foundItem = payItems[index];
          break;
        }
      }
    }

    if (Utils.isDefined(foundItem)) {
      masterItem.setPKey(foundItem.getPKey());
      masterItem.setSdoPaymentMetaPKey(foundItem.getSdoPaymentMetaPKey());
      masterItem.setInitiationDate(foundItem.getInitiationDate());
      masterItem.setEnteredAmount(foundItem.getAbsoluteAmount());
      masterItem.setAbsoluteAmount(foundItem.getAbsoluteAmount());
      masterItem.setModReason(foundItem.getModReason());

      //Set the amount with negation
      masterItem.setAmount(-1 * foundItem.getAmount());
      masterItem.setAmountReceipt(-1 * foundItem.getAmountReceipt());

      if (Utils.isDefined(phase) && phase == "Released") {
        masterItem.setCalcAmount(foundItem.getCalcAmount());
      } else {
        masterItem.setCalcAmount(runningAmount);
      }
    } else {
      var arrLength = loPaymentMeta.length;
      var sdoPaymentMetaPKey;
      for (var ind = 0; ind < arrLength; ind++) {
        var elem = loPaymentMeta[ind];
        if (elem.paymentMethod == runningMethod) {
          sdoPaymentMetaPKey = elem.getPKey();
          break;
        }
      }

      masterItem.setObjectStatus(STATE.NEW);
      masterItem.setPKey(PKey.next());
      masterItem.setSdoPaymentMetaPKey(sdoPaymentMetaPKey);
      masterItem.setInitiationDate(
        Utils.convertFullDate2Ansi(Utils.createDateToday())
      );
      masterItem.setEnteredAmount(runningAmount);
      masterItem.setAbsoluteAmount(Math.abs(runningAmount));

      masterItem.setAmount(runningAmount);
      masterItem.setAmountReceipt(runningAmount);

      masterItem.setCalcAmount(runningAmount);
    }

    masterItem.setSdoMainPKey(sdoMainPKey);
    masterItem.setPaymentMethod(runningMethod);
    masterItem.setLevel("main");

    masterItem.setDisplayExpectedAmount(
      Localization.localize(runningAmount.toFixed(2), "number") +
      " " +
      masterItem.getCurrency()
    );

    masterItem.setHierarchyIcon("ArrowExpandGrey24");
    masterItem.setDisplayId(runningMethodText);
    if (masterItem.getDisplayId() != "Expenses") {
      masterItem.setExpenseType(" ");
    }
    masterItem.setDataType("Decimal");
    masterItem.setUseStepper("1");
    masterItem.setStepSize("1");
    masterItem.setMinValue("0");
    masterItem.setMaxValue("99999");
    masterItem.setFormatType("0.2");

    masterItemPositions.add(insertPosition, masterItem);
  };

  //check phase
  //just display released payments
  if (Utils.isDefined(phase) && phase == "Released") {
    var oldItems = loPayments.getAllItems();
    var oldItemsLength = oldItems.length;

    for (var j = 0; j < oldItemsLength; j++) {
      var oldItem = oldItems[j];
      createNewItem(
        oldItem.paymentMethod,
        Utils.getToggleText("DomPaymentMethod", oldItem.paymentMethod),
        oldItem.getAbsoluteAmount(),
        j,
        masterItemPositions,
        loPaymentMeta,
        sdoMainPKey,
        loPayments,
        phase
      );
    }
  }
  //or compute them
  else {
    //running over all found payments
    for (; i < length; i++) {
      currentItem = items[i];

      currentItem.setHierarchyIcon("DotsSubGrey24");
      currentItem.setDisplayId(currentItem.getText());
      if (currentItem.getDisplayId() != "Expenses") {
        currentItem.setExpenseType(" ");
      }

      currentItem.setDataType("Decimal");
      currentItem.setUseStepper("0");
      currentItem.setStepSize("1");
      currentItem.setMinValue("0");
      currentItem.setMaxValue("99999");
      currentItem.setFormatType("0.2");

      currentMethod = currentItem.paymentMethod;
      currentMethodText = Utils.getToggleText(
        "DomPaymentMethod",
        currentItem.paymentMethod
      );
      currentAmount = currentItem.getAmount();

      currentAmount = Math.round(currentAmount * 100) / 100;

      currentItem.setDisplayExpectedAmount(
        Localization.localize(currentAmount.toFixed(2), "number") +
        " " +
        currentItem.getCurrency()
      );

      //reached a new payment method?
      if (
        Utils.isEmptyString(runningMethod) ||
        runningMethod != currentMethod
      ) {
        //store the data of the old payment method
        if (!Utils.isEmptyString(runningMethod)) {
          createNewItem(
            runningMethod,
            runningMethodText,
            runningAmount,
            insertionIndex + insertionCorrection,
            masterItemPositions,
            loPaymentMeta,
            sdoMainPKey,
            loPayments
          );
          insertionIndex = i;
          insertionCorrection++;
        }

        //reset running values
        runningAmount = 0;
        runningMethod = currentMethod;
        runningMethodText = currentMethodText;
      }

      runningAmount += currentAmount;

      //store last method
      if (i === length - 1) {
        createNewItem(
          runningMethod,
          runningMethodText,
          runningAmount,
          insertionIndex + insertionCorrection,
          masterItemPositions,
          loPaymentMeta,
          sdoMainPKey,
          loPayments
        );
      }
    }
  }

  length = masterItemPositions.keys().length;
  i = 0;

  //when released or canceled, discard all subitems
  if (Utils.isDefined(phase) && phase != "Initial") {
    items = [];
    for (; i < length; i++) {
      insertionIndex = masterItemPositions.keys()[i];
      insertionItem = masterItemPositions.get(insertionIndex);

      insertionItem.setHierarchyIcon("EmptyImage");
      insertionItem.setUseStepper("0");
      insertionItem.setDisplayExpectedAmount(
        Localization.localize(
          insertionItem.getCalcAmount().toFixed(2),
          "number"
        ) +
        " " +
        insertionItem.getCurrency()
      );
      items.push(insertionItem);
    }
  } else {
    for (; i < length; i++) {
      insertionIndex = masterItemPositions.keys()[i];
      insertionItem = masterItemPositions.get(insertionIndex);

      items.splice(insertionIndex, 0, insertionItem);
    }
  }

  me.removeAllItems();
  me.addObjectItems(items);

  //setting mainpkeys
  length = me.getAllItems().length;
  items = me.getAllItems();

  var currentMainPKey;
  for (i = 0; i < length; i++) {
    var currItem = items[i];
    if (currItem.getLevel() == "main") {
      currentMainPKey = currItem.getPKey();
    }

    currItem.setMainPKey(currentMainPKey);
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
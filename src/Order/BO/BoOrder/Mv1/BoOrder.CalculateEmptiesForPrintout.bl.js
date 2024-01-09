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
 * @function calculateEmptiesForPrintout
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function calculateEmptiesForPrintout(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var orderedProductsList = [];
var orderedEmptiesList = [];
var orderedProductListForDBSelect = "";
var orderedEmptiesListForDBSelect = "";
var emptiesInformationList;
var dicEmptiesInfo = Utils.createDictionary();
var emptyInfo; // object which holds all empty information for one product/unitType combination
var currentKey = ""; // current product/unitType combination
var emptiesList = []; // list with all empties of one product/unitType combination
var emptyListObject = {}; // object which holds empty item attributes (PrdKey, Qty, Description)
var dicEmptyCalculation = Utils.createDictionary();
var emptyDicKey = "";
var currentEmpty;
var directEmptyQty;
var productQty;
var movementDirection = "";
var emptyQty = 0;
var deliveredQty = 0;
var returnedQty = 0;
var keysDicEmptyCalculation;
var currentDicItem;
var emptyItemListForPrintout = [];
var emptyItemForPrintout;
var i;

//create LO for empties
var promise = BoFactory.createObjectAsync(LO_EMPTIESFORPRINTOUT, {}).then(
  function (loEmptiesForPrintout) {
    me.setLoEmptiesForPrintout(loEmptiesForPrintout);

    // #####################
    // ### Prepare lists ###
    // #####################
    var visibleOrderItemsList = me.getLoItems().getItemObjects();
    for (i = 0; i < visibleOrderItemsList.length; i++) {
      if (visibleOrderItemsList[i].getQuantity() > 0) {
        if (visibleOrderItemsList[i].getPrdType() == "Empty") {
          orderedEmptiesList.push(visibleOrderItemsList[i]);
        }
        else {
          orderedProductsList.push(visibleOrderItemsList[i]);
        }
      }
    }

    for (i = 0; i < orderedProductsList.length; i++) {
      if (Utils.isEmptyString(orderedProductListForDBSelect)) {
        orderedProductListForDBSelect += "'" + orderedProductsList[i].getPrdMainPKey() + "'";
      }
      else {
        orderedProductListForDBSelect += ",'" + orderedProductsList[i].getPrdMainPKey() + "'";
      }
    }

    for (i = 0; i < orderedEmptiesList.length; i++) {
      if (Utils.isEmptyString(orderedEmptiesListForDBSelect)) {
        orderedEmptiesListForDBSelect += "'" + orderedEmptiesList[i].getPrdMainPKey() + "'";
      }
      else {
        orderedEmptiesListForDBSelect += ",'" + orderedEmptiesList[i].getPrdMainPKey() + "'";
      }
    }

    return BoFactory.loadListAsync(LO_EMPTIESINFORMATION, {
      "productList" : orderedProductListForDBSelect
    });
  }).then(
  function (loEmptiesInformation) {
    // #######################################
    // ### Prepare empties info dictionary ###
    // #######################################
    emptiesInformationList = loEmptiesInformation.getAllItems();

    for (i = 0; i < emptiesInformationList.length; i++) {

      if (currentKey == emptiesInformationList[i].getPrdMainPKey() + emptiesInformationList[i].getUnitType()) {
        //Level 2 Empty out of BoM (PrdPartRel)
        if (Utils.isDefined(emptiesInformationList[i].getEmptyLevel2PKey()) && !Utils.isEmptyString(emptiesInformationList[i].getEmptyLevel2PKey())) {

          emptyInfo.DirectEmptyPKey = emptiesInformationList[i].getEmptyPKey();
          emptyInfo.DirectEmptyId = emptiesInformationList[i].getEmptyId();
          emptyInfo.DirectEmptyDescription = emptiesInformationList[i].getEmptyDescription();
          emptyInfo.DirectEmptyQuantity = emptiesInformationList[i].getEmptyQuantity();
          emptyInfo.DirectEmptyTaxClassification = emptiesInformationList[i].getEmptyTaxClassification();

          emptyListObject = {};
          emptyListObject.PrdMainPKey = emptiesInformationList[i].getEmptyLevel2PKey();
          emptyListObject.Id = emptiesInformationList[i].getEmptyLevel2Id();
          emptyListObject.Description = emptiesInformationList[i].getEmptyLevel2Description();
          emptyListObject.Quantity = emptiesInformationList[i].getEmptyLevel2Quantity();
          emptyListObject.TaxClassification = emptiesInformationList[i].getEmptyLevel2TaxClassification();
          emptiesList.push(emptyListObject);
        }
        else {
          //Level 1 Empty with no BoM information
          emptyInfo.DirectEmptyPKey = emptiesInformationList[i].getEmptyPKey();
          emptyInfo.DirectEmptyId = emptiesInformationList[i].getEmptyId();
          emptyInfo.DirectEmptyDescription = emptiesInformationList[i].getEmptyDescription();
          emptyInfo.DirectEmptyQuantity = emptiesInformationList[i].getEmptyQuantity();
          emptyInfo.DirectEmptyTaxClassification = emptiesInformationList[i].getEmptyTaxClassification();
        }
      }
      else {
        //if currentKey has changed write empty in dictionary
        if (!Utils.isEmptyString(currentKey)) {
          emptyInfo.Level2Empties = emptiesList;
          dicEmptiesInfo.add(currentKey, emptyInfo);
        }
        emptyInfo = {};
        emptiesList = [];
        currentKey = emptiesInformationList[i].getPrdMainPKey() + emptiesInformationList[i].getUnitType();

        //Level 2 Empty out of BoM (PrdPartRel)
        if (Utils.isDefined(emptiesInformationList[i].getEmptyLevel2PKey()) && !Utils.isEmptyString(emptiesInformationList[i].getEmptyLevel2PKey())) {

          emptyInfo.DirectEmptyPKey = emptiesInformationList[i].getEmptyPKey();
          emptyInfo.DirectEmptyId = emptiesInformationList[i].getEmptyId();
          emptyInfo.DirectEmptyDescription = emptiesInformationList[i].getEmptyDescription();
          emptyInfo.DirectEmptyQuantity = emptiesInformationList[i].getEmptyQuantity();
          emptyInfo.DirectEmptyTaxClassification = emptiesInformationList[i].getEmptyTaxClassification();

          emptyListObject = {};
          emptyListObject.PrdMainPKey = emptiesInformationList[i].getEmptyLevel2PKey();
          emptyListObject.Id = emptiesInformationList[i].getEmptyLevel2Id();
          emptyListObject.Description = emptiesInformationList[i].getEmptyLevel2Description();
          emptyListObject.Quantity = emptiesInformationList[i].getEmptyLevel2Quantity();
          emptyListObject.TaxClassification = emptiesInformationList[i].getEmptyLevel2TaxClassification();
          emptiesList.push(emptyListObject);
        }
        else {
          //Level 1 Empty with no BoM information
          emptyInfo.DirectEmptyPKey = emptiesInformationList[i].getEmptyPKey();
          emptyInfo.DirectEmptyId = emptiesInformationList[i].getEmptyId();
          emptyInfo.DirectEmptyDescription = emptiesInformationList[i].getEmptyDescription();
          emptyInfo.DirectEmptyQuantity = emptiesInformationList[i].getEmptyQuantity();
          emptyInfo.DirectEmptyTaxClassification = emptiesInformationList[i].getEmptyTaxClassification();
        }
      }
    }
    if (!Utils.isEmptyString(currentKey)) {
      emptyInfo.Level2Empties = emptiesList;
      dicEmptiesInfo.add(currentKey, emptyInfo);
    }

    // ##################################
    // ### calculate implicit empties ###
    // ##################################

    for (var j = 0; j < orderedProductsList.length; j++) {

      emptyDicKey = orderedProductsList[j].getPrdMainPKey() + orderedProductsList[j].getQuantityLogisticUnit();

      //check if empties are defined for product
      if (Utils.isDefined(dicEmptiesInfo.get(emptyDicKey))) {
        emptyInfo = dicEmptiesInfo.get(emptyDicKey);
        productQty = orderedProductsList[j].getQuantity();
        movementDirection = orderedProductsList[j].getMovementDirection();
        directEmptyQty = emptyInfo.DirectEmptyQuantity;

        //check if there exist level 2 empties
        if (emptyInfo.Level2Empties.length > 0) {

          // ######################################
          // ### indirect related empty via BoM ###
          // ######################################

          for (var k = 0; k < emptyInfo.Level2Empties.length; k++) {

            emptyQty = directEmptyQty * emptyInfo.Level2Empties[k].Quantity * productQty;

            //check if empty exists already
            if (Utils.isDefined(dicEmptyCalculation.get(emptyInfo.Level2Empties[k].PrdMainPKey))) {
              currentEmpty = dicEmptyCalculation.get(emptyInfo.Level2Empties[k].PrdMainPKey);
              dicEmptyCalculation.remove(emptyInfo.DirectEmptyPKey);

              if (movementDirection == "Out") {
                currentEmpty.delivered = currentEmpty.delivered + emptyQty;
              }
              else if (movementDirection == "In") {
                currentEmpty.returned = currentEmpty.returned + emptyQty;
              }

              dicEmptyCalculation.add(emptyInfo.Level2Empties[k].PrdMainPKey, currentEmpty);
            }
            else {
              if (movementDirection == "Out") {
                deliveredQty = emptyQty;
                returnedQty = 0;
              }
              else if (movementDirection == "In") {
                returnedQty = emptyQty;
                deliveredQty = 0;
              }

              dicEmptyCalculation.add(emptyInfo.Level2Empties[k].PrdMainPKey, {
                "description" : emptyInfo.Level2Empties[k].Description,
                "id" : emptyInfo.Level2Empties[k].Id,
                "delivered" : deliveredQty,
                "returned" : returnedQty,
                "taxClassification" : emptyInfo.Level2Empties[k].TaxClassification
              });
            } // end check if empty exists already
          } // end for all level 2 empties
        }
        else {
          // ############################
          // ### direct related empty ###
          // ############################

          emptyQty = directEmptyQty * productQty;

          //check if empty exists already
          if (Utils.isDefined(dicEmptyCalculation.get(emptyInfo.DirectEmptyPKey))) {
            currentEmpty = dicEmptyCalculation.get(emptyInfo.DirectEmptyPKey);
            dicEmptyCalculation.remove(emptyInfo.DirectEmptyPKey);

            if (movementDirection == "Out") {
              currentEmpty.delivered = currentEmpty.delivered + emptyQty;
            }
            else if (movementDirection == "In") {
              currentEmpty.returned = currentEmpty.returned + emptyQty;
            }
            dicEmptyCalculation.add(emptyInfo.DirectEmptyPKey, currentEmpty);
          }
          else {
            if (movementDirection == "Out") {
              deliveredQty = emptyQty;
              returnedQty = 0;
            }
            else if (movementDirection == "In") {
              returnedQty = emptyQty;
              deliveredQty = 0;
            }

            dicEmptyCalculation.add(emptyInfo.DirectEmptyPKey, {
              "description" : emptyInfo.DirectEmptyDescription,
              "id" : emptyInfo.DirectEmptyId,
              "delivered" : deliveredQty,
              "returned" : returnedQty,
              "taxClassification" : emptyInfo.DirectEmptyTaxClassification
            });
          } // end check if empty exists already
        } // end check if there exist level 2 empties
      } // check if empties are defined for product
    } // end for all products


    // ############################
    // ### add explicit empties ###
    // ############################

    if (orderedEmptiesList.length > 0) {
      return BoFactory.loadListAsync(LO_EMPTIESBOM, {
        "explicitEmptiesList" : orderedEmptiesListForDBSelect
      }).then(
        function (loExplicitEmptiesInformation) {
          var currentKey = "";
          var loExplicitEmptiesInformationList = loExplicitEmptiesInformation.getAllItems();
          var dicEmptiesBoMInfo = Utils.createDictionary();
          var emptiesList = []; // list with all empties of one product/unitType combination
          var emptyListObject = {}; // object which holds empty item attributes (PrdKey, Qty, Description)

          //create dic for explicit empties BoM
          for (i = 0; i < loExplicitEmptiesInformationList.length; i++) {
            if (loExplicitEmptiesInformationList[i].getParentEmptyPKey() == currentKey) {
              emptyListObject = {};
              emptyListObject.PrdMainPKey = loExplicitEmptiesInformationList[i].getChildPKey();
              emptyListObject.Id = loExplicitEmptiesInformationList[i].getChildId();
              emptyListObject.Description = loExplicitEmptiesInformationList[i].getChildDescription();
              emptyListObject.Quantity = loExplicitEmptiesInformationList[i].getQuantity();
              emptyListObject.ChildTaxClassification = loExplicitEmptiesInformationList[i].getChildTaxClassification();
              emptiesList.push(emptyListObject);
            }
            else {
              if (!Utils.isEmptyString(currentKey)) {
                dicEmptiesBoMInfo.add(currentKey, emptiesList);
              }

              currentKey = loExplicitEmptiesInformationList[i].getParentEmptyPKey();
              emptyInfo = {};
              emptiesList = [];
              emptyListObject = {};
              emptyListObject.PrdMainPKey = loExplicitEmptiesInformationList[i].getChildPKey();
              emptyListObject.Id = loExplicitEmptiesInformationList[i].getChildId();
              emptyListObject.Description = loExplicitEmptiesInformationList[i].getChildDescription();
              emptyListObject.Quantity = loExplicitEmptiesInformationList[i].getQuantity();
              emptyListObject.ChildTaxClassification = loExplicitEmptiesInformationList[i].getChildTaxClassification();
              emptiesList.push(emptyListObject);
            }
          }
          if (!Utils.isEmptyString(currentKey)) {
            dicEmptiesBoMInfo.add(currentKey, emptiesList);
          }

          var prdPKey = "";
          var emptyBoMList;
          var currentItem;

          for (var idxExplEmpties = 0; idxExplEmpties < orderedEmptiesList.length; idxExplEmpties++) {
            prdPKey = orderedEmptiesList[idxExplEmpties].getPrdMainPKey();
            productQty = orderedEmptiesList[idxExplEmpties].getQuantity();
            movementDirection = orderedEmptiesList[idxExplEmpties].getMovementDirection();

            //Check if empty has BoM
            if (Utils.isDefined(dicEmptiesBoMInfo.get(prdPKey))) {
              //#################################
              //### Explicit empties with BoM ###
              //#################################

              emptyBoMList = dicEmptiesBoMInfo.get(prdPKey);

              for (var idxBoM = 0; idxBoM < emptyBoMList.length; idxBoM++) {
                currentItem = emptyBoMList[idxBoM];
                emptyQty = productQty * currentItem.Quantity;

                //check if empty is already in the dic
                if (Utils.isDefined(dicEmptyCalculation.get(currentItem.PrdMainPKey))) {
                  currentEmpty = dicEmptyCalculation.get(currentItem.PrdMainPKey);
                  dicEmptyCalculation.remove(currentItem.PrdMainPKey);

                  if (movementDirection == "Out") {
                    currentEmpty.delivered = currentEmpty.delivered + emptyQty;
                  }
                  else if (movementDirection == "In") {
                    currentEmpty.returned = currentEmpty.returned + emptyQty;
                  }
                  dicEmptyCalculation.add(currentItem.PrdMainPKey, currentEmpty);
                }
                else {
                  if (movementDirection == "Out") {
                    deliveredQty = emptyQty;
                    returnedQty = 0;
                  }
                  else if (movementDirection == "In") {
                    returnedQty = emptyQty;
                    deliveredQty = 0;
                  }

                  dicEmptyCalculation.add(currentItem.PrdMainPKey, {
                    "description" : currentItem.Description,
                    "id" : currentItem.Id,
                    "delivered" : deliveredQty,
                    "returned" : returnedQty,
                    "taxClassification" : currentItem.ChildTaxClassification
                  });
                }
              } // end for all empty BoMs
            }
            else {
              //####################################
              //### Explicit empties without BoM ###
              //####################################

              //check if empty is already in the dic
              if (Utils.isDefined(dicEmptyCalculation.get(orderedEmptiesList[idxExplEmpties].getPrdMainPKey()))) {
                currentEmpty = dicEmptyCalculation.get(orderedEmptiesList[idxExplEmpties].getPrdMainPKey());
                dicEmptyCalculation.remove(orderedEmptiesList[idxExplEmpties].getPrdMainPKey());

                if (movementDirection == "Out") {
                  currentEmpty.delivered = currentEmpty.delivered + productQty;
                }
                else if (movementDirection == "In") {
                  currentEmpty.returned = currentEmpty.returned + productQty;
                }
                dicEmptyCalculation.add(orderedEmptiesList[idxExplEmpties].getPrdMainPKey(), currentEmpty);
              }
              else {
                if (movementDirection == "Out") {
                  deliveredQty = productQty;
                  returnedQty = 0;
                }
                else if (movementDirection == "In") {
                  returnedQty = productQty;
                  deliveredQty = 0;
                }

                dicEmptyCalculation.add(orderedEmptiesList[idxExplEmpties].getPrdMainPKey(), {
                  "description" : orderedEmptiesList[idxExplEmpties].getText1(),
                  "id" : orderedEmptiesList[idxExplEmpties].getPrdId(),
                  "delivered" : deliveredQty,
                  "returned" : returnedQty,
                  "taxClassification" : orderedEmptiesList[idxExplEmpties].getTaxClassification()
                });
              }
            }
          }

          //#################################################
          //### Implicit and explicit empties exist:      ###
          //### Insert all calculated empties in Print LO ###
          //#################################################
          keysDicEmptyCalculation = dicEmptyCalculation.keys();
          for (var idxEmpties = 0; idxEmpties < keysDicEmptyCalculation.length; idxEmpties++) {
            currentDicItem = dicEmptyCalculation.get(keysDicEmptyCalculation[idxEmpties]);

            if (Utils.isEmptyString(currentDicItem.delivered)) {
              currentDicItem.delivered = 0;
            }
            if (Utils.isEmptyString(currentDicItem.returned)) {
              currentDicItem.returned = 0;
            }

            emptyItemForPrintout = {
              "pKey" : PKey.next(),
              "prdMainPKey" : keysDicEmptyCalculation[idxEmpties],
              "prdId" : currentDicItem.id,
              "text1" : currentDicItem.description,
              "taxClassification" : currentDicItem.taxClassification,
              "quantityDelivered" : currentDicItem.delivered,
              "quantityReturned" : currentDicItem.returned,
              "totalQuantity" : currentDicItem.delivered - currentDicItem.returned
            };
            emptyItemListForPrintout.push(emptyItemForPrintout);
          }
          me.getLoEmptiesForPrintout().addListItems(emptyItemListForPrintout);
        });
    }
    else {
      //#################################################
      //### Only implicit empties exist:              ###
      //### Insert all calculated empties in Print LO ###
      //#################################################
      //ToDo: We have to distinguish between Deliverd and returned empties
      keysDicEmptyCalculation = dicEmptyCalculation.keys();
      for (var idxEmpties = 0; idxEmpties < keysDicEmptyCalculation.length; idxEmpties++) {
        currentDicItem = dicEmptyCalculation.get(keysDicEmptyCalculation[idxEmpties]);

        if (Utils.isEmptyString(currentDicItem.delivered)) {
          currentDicItem.delivered = 0;
        }
        if (Utils.isEmptyString(currentDicItem.returned)) {
          currentDicItem.returned = 0;
        }
        emptyItemForPrintout = {
          "pKey" : PKey.next(),
          "prdMainPKey" : keysDicEmptyCalculation[idxEmpties],
          "prdId" : currentDicItem.id,
          "text1" : currentDicItem.description,
          "taxClassification" : currentDicItem.taxClassification,
          "quantityDelivered" : currentDicItem.delivered,
          "quantityReturned" : currentDicItem.returned,
          "totalQuantity" : currentDicItem.delivered - currentDicItem.returned
        };
        emptyItemListForPrintout.push(emptyItemForPrintout);
      }
      me.getLoEmptiesForPrintout().addListItems(emptyItemListForPrintout);
    }
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
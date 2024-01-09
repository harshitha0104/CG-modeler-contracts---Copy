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
 * @function validateMandatorySurveys
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function validateMandatorySurveys(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var newError;
var messageCollector = new MessageCollector();
var storeSurveyQuestions=[];
var posSurveyQuestions=[];
var promise;

if ((me.getClbStatus()==="Completed" && me.getOriginalClbStatus()!=="Completed")) {
  //LoadProductList and prerequisites
  promise = me.getBoJobManager().loadAndSetPrerequisites("Surveys").then(
    function() {
      var boJobManager = me.getBoJobManager();
      var jobDefs =boJobManager.getLoJobDefinitions().getItemsByParamArray([{"jobActionSuccess": "None", "op":"NE"}, {"jobMetaId": "Survey"}]);

      if (jobDefs.length > 0) {
        var posIds = boJobManager.getLoPOS().getAllItems().map(function(pos){return pos.getPosId();}).join(",");
        return boJobManager.expandJobProducts(posIds).then(
          function() {
            jobDefs.sort(function(a,b){return (a.getJobDefListPKey() === b.getJobDefListPKey()) ? 0 : ((a.getJobDefListPKey() < b.getJobDefListPKey()) ? -1 : 1);});

            var idxJobDef;
            var liJobDef;
            var liPOS;
            var idxPOS;
            var products;
            var product;
            var idxProduct;
            var jdlProductCount;
            var surveyCount;
            var previousSurveyCount;
            var filteredPOS;
            var lastDemagnetizedJobListPKey = "";
            var iStoreQuestionIndex = 0;
            var iPOSQuestionIndex = 0;
            var loExistingJobListJobs = boJobManager.getLoExistingJobListJobs();
            var loPos = boJobManager.getLoPOS();
            var loMagnetizedJobList = boJobManager.getLoMagnetizedJobList();
            var length = jobDefs.length;

            for(idxJobDef = 0; idxJobDef < jobDefs.length; idxJobDef++) {
              liJobDef = jobDefs[idxJobDef];
              filteredPOS = loPos.getItemsByParam({"isPOS": liJobDef.getPOS()});
              var length2 = filteredPOS.length;
              for(idxPOS = 0; idxPOS < length2; idxPOS++) {
                surveyCount = 0;
                jdlProductCount = 0;
                liPOS = filteredPOS[idxPOS];
                products = liPOS.getSurveyProducts().getItemsByParam({"posId": liPOS.getPosId()});
                var length3 = products.length;
                for(idxProduct = 0; idxProduct < length3; idxProduct++) {
                  product = products[idxProduct];
                  if(product.getJDLPKeys().indexOf(liJobDef.getJobDefListPKey())!==-1) {
                    jdlProductCount++;
                  }
                }

                var sPosBpaMainPKey = liPOS.getPosId() === " " ? " " : liPOS.getBpaMainPKey();
                surveyCount = liPOS.getSurveys().getItemsByParam({"jobDefinitionPKey": liJobDef.getJobDefinitionPKey(), "done": "1"}).length;
                previousSurveyCount = loExistingJobListJobs.getItemsByParam({"posBpaMainPKey": sPosBpaMainPKey, "jobDefinitionPKey": liJobDef.getJobDefinitionPKey()}).length;

                if (surveyCount + previousSurveyCount < jdlProductCount) {
                  if(liJobDef.getJobActionSuccess()==="Validation") {
                    if(liPOS.getPosId() === " ") {
                      if (storeSurveyQuestions.indexOf(liJobDef.getJobDefinitionMetaText()) == -1) {
                        storeSurveyQuestions[iStoreQuestionIndex] = liJobDef.getJobDefinitionMetaText();
                        iStoreQuestionIndex++;
                      }
                    }
                    else {
                      if (posSurveyQuestions.indexOf(liJobDef.getJobDefinitionMetaText()) == -1) {
                        posSurveyQuestions[iPOSQuestionIndex] = liJobDef.getJobDefinitionMetaText();
                        iPOSQuestionIndex++;
                      }
                    }
                  }
                  else if(liJobDef.getJobActionSuccess()==="Detach" && liJobDef.getStandardJobs()=="0") {
                    //detach in magnetizejoblist
                    if (lastDemagnetizedJobListPKey !== liJobDef.getJobListPKey()) {
                      var loMagnetizedJobs = loMagnetizedJobList.getItemsByParam({"pKey": liJobDef.getJobListPKey()});
                      if(loMagnetizedJobs.length > 0) {
                        loMagnetizedJobs[0].setDemagnetizeOnSave("1");
                        lastDemagnetizedJobListPKey = liJobDef.getJobListPKey();
                      }
                    }
                  }
                }
              }
            }
            if (storeSurveyQuestions.length > 0) {
              newError = {"level": "error",
                          "objectClass": "BoCall",
                          "simpleProperty": " ",
                          "messageParams": {"questions": "\n" + storeSurveyQuestions.join("\n") + "\n"},
                          "messageID": "CasClbNotAllMandatoryStoreSurveysAnswered"
                         };
              messageCollector.add(newError);
            }
            if (posSurveyQuestions.length > 0) {
              newError = {"level": "error",
                          "objectClass": "BoCall",
                          "simpleProperty": " ",
                          "messageParams": {"questions": "\n" + posSurveyQuestions.join("\n") + "\n"},
                          "messageID": "CasClbNotAllMandatoryPOSSurveysAnswered"
                         };
              messageCollector.add(newError);
            }
            return messageCollector;
          });
      }
      else {
        return messageCollector;
      }
    });
}
else {
  promise = when.resolve(messageCollector);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
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
 * @function setGalleryIcon
 * @this BoCall
 * @kind businessobject
 * @namespace CORE
 * @param {String} jDTPKey
 * @param {String} showGalleryIcon
 */
function setGalleryIcon(jDTPKey, showGalleryIcon){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var questions = me.getBoJobManager().getLoQuestions();

if(Utils.isDefined(jDTPKey)){
  var currentJDT = questions.getItemByPKey(jDTPKey);
  if(showGalleryIcon === "true" && currentJDT.cameraIcon != "PictureDetailwithPictures"){
    currentJDT.cameraIcon = "PictureDetailwithPictures";
  }
  else if(!showGalleryIcon){
    currentJDT.cameraIcon = "TakePicture";
  }
} else{
  var attachmentIds;
  var hasAttachments;
  var noAttachments;
  var attachments = me.getLoCallAttachments().getItemsByParamArray([{"objectStatus" : me.self.STATE_DELETED + me.self.STATE_NEW, "op" : "NE"},
                                                                    {"objectStatus" : me.self.STATE_DELETED + me.self.STATE_UNMODIFIED, "op" : "NE"}]);

  var deletedAttachments = me.getLoCallAttachments().filter(function(attachment){
    return attachment.objectStatus === me.self.STATE_DELETED + me.self.STATE_NEW || attachment.objectStatus === me.self.STATE_DELETED + me.self.STATE_UNMODIFIED;
  });

  attachmentIds = attachments.map(function(attachment){return attachment.getClbMainPKey();});
  hasAttachments = questions.filter(function(question){return attachmentIds.find(function(id) {return id === question.getPKey();});});
  attachmentIds = deletedAttachments.map(function(attachment){return attachment.getClbMainPKey();});
  noAttachments = questions.filter(function(question){return attachmentIds.find(function(id) {return id === question.getPKey();});});

  noAttachments.forEach(function(attachment){
    attachment.cameraIcon = "TakePicture";
  });

  hasAttachments.forEach(function(attachment){
    attachment.cameraIcon = "PictureDetailwithPictures";
  });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
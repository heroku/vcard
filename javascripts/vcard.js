$(function() {

  // `Flip card
  $('.card').click(function(e) {
    if (!$(this).hasClass('create-card')) $(this).toggleClass('is-flipped');
  });

  // `Call to create card action
  $('#make-card').click(function(e) {
    e.preventDefault();
    $('#make').fadeOut('fast');
    $('#content').removeClass('is-ready').addClass('hide');
    $('#content-form').addClass('is-ready');
  });
  
  $("#createVcardForm").submit(function(e) {
    e.preventDefault();
    
    log('createVcardForm.submit();');
    
    $("#formBody p.error-message").remove();
    
    if ($("#ownerName").val() == "") {
      $("#formBody").prepend($("<p class='error-message'>").text("Full Name Required"));
      return;
    }

    if ($("#ownerEmail").val() == "") {
      $("#formBody").prepend($("<p class='error-message'>").text("Email Required"));
      return;
    }

    if (!email_regex.test(email_address)){
      $("#formBody").prepend($("<p class='error-message'>").text("Email Invalid"));
      return;
    }
    
    PUBNUB.uuid(function(uuid) {
      
      // required minimum params
      var data = {
        uuid: uuid,
        ownerName: $("#ownerName").val(),
        ownerEmail: $("#ownerEmail").val()
      };
      
      data.ownerEmailMD5 = $.md5($("#ownerEmail").val());
      data.ownerEmailRot13 = $("#ownerEmail").val().replace(/[a-zA-Z]/g, function(c) {
        return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);
      });
      
      // optional params only go in if non-null
      
      if ($("#ownerTitle").val() != "") {
        data.ownerTitle = $("#ownerTitle").val();
      }

      if ($("#companyName").val() != "") {
        data.companyName = $("#companyName").val();
      }

      if ($("#companyUrl").val() != "") {
        // todo: format with http if needed
        data.companyUrl = $("#companyUrl").val();
      }

      if ($("#companyAddress").val() != "") {
        // todo: verify proper breaking
        data.companyAddress = $("#companyAddress").val();
      }

      if ($("#twitterUsername").val() != "") {
        // todo: remove @ if there
        data.twitterUrl = "http://twitter.com/" + $("#twitterUsername").val();
      }

      if ($("#facebookUsername").val() != "") {
        data.facebookUrl = "http://facebook.com/" + $("#facebookUsername").val();
      }

      if ($("#linkedinUsername").val() != "") {
        data.linkedinUrl = "http://linkedin.com/in/" + $("#linkedinUsername").val();
      }

      if ($("#vimeoUsername").val() != "") {
        // todo: verify url
        data.vimeoUrl = "http://vimeo.com/" + $("#vimeoUsername").val();
      }

      if ($("#dribbleUsername").val() != "") {
        // todo: verify url
        data.dribbleUrl = "http://dribble.com/" + $("#dribbleUsername").val();
      }
      
      if ($("#pinterestUsername").val() != "") {
        // todo: verify url
        data.pinterestUrl = "http://pinterest.com/" + $("#pinterestUsername").val();
      }

      if ($("#githubUsername").val() != "") {
        data.githubUrl = "http://github.com/" + $("#githubUsername").val();
      }
      
      PUBNUB.subscribe({
        channel: uuid,
        callback: function(message) {
          log(message);
          if (typeof(message.result) != "undefined") {
            window.location = message.result + "#withInstructions";
          }
          else if (typeof(message.error) != "undefined") {
            $("#formBody").prepend($("<p class='error-message'>").text(message.error));
            resetFormButtons();
          }
        },
        error: function(e) {
          $("#formBody").prepend($("<p class='error-message'>").text(e));
          resetFormButtons();
        }
      });

      PUBNUB.publish({
        channel  : "create-vcard",
        message  : data,
        callback : function(info) {
          log(info);
        }
      });
      
      $("#submitCreateFieldset").children().fadeOut();
      
      // todo: show progress bar or something
        
    });
  });

  // `Cancel create vcard
  $('.cancel').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#formBody .error-message").remove();
    $('#make').fadeIn('slow');
    $('#content-form').removeClass('is-ready');
    $('#content').removeClass('hide').addClass('is-ready');
  });

  $('input, textarea').bind('focus blur', function () {
    $(this).prev('label').toggleClass('focused');
  });
  $('input[name=ownerTitle],input[name=ownerEmail],input[name=companyName],input[name=companyUrl],textarea[name=companyAddress]').bind('focus blur', function () {
    $('label[for=ownerName]').toggleClass('focused');
  });

  $("input[name=ownerEmail]").keyup(function() {
    email_address=$(this).val();
    var md5=$.md5(email_address);
    if(!email_regex.test(email_address)){
      valid = false;
      $('label[for=ownerName]').addClass('error');
      $(this).addClass('error');
    }else{
      $("form .avatar").removeClass('iconb').css("background-image", "url(http://www.gravatar.com/avatar/"+md5+"?s=160&d=404)");
      $('label[for=ownerName]').removeClass('error');
      $(this).removeClass('error');
    };
  });
  
  var withInstructionsIndex = window.location.href.indexOf("#withInstructions");
  if (withInstructionsIndex > 0) {
    var newUrl = window.location.href.substr(0, withInstructionsIndex + 1);
    window.location.href = newUrl;
    $("#instructions").show();
  }

});

var email_regex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

function resetFormButtons() {
  $("#submitCreateFieldset").children().fadeIn();
}

function log() {
  if (window.console) console.log.apply(console,arguments);
}
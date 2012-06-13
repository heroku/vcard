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
    
    PUBNUB.uuid(function(uuid) {
      var data = {
        uuid: uuid,
        ownerName: $("#ownerName").val(),
        ownerEmail: $("#ownerEmail").val(),
        ownerTitle: $("#ownerTitle").val(),
        companyName: $("#companyName").val(),
        companyUrl: $("#companyUrl").val(),
        companyAddress: $("#companyAddress").val(),
        twitterUrl: "http://twitter.com/" + $("#twitterUsername").val(), // todo: remove @ if there
        facebookUrl: "http://facebook.com/" + $("#facebookUsername").val(),
        linkedinUrl: "http://linkedin.com/in/" + $("#linkedinUsername").val(),
        flickrUrl: "http://flickr.com/" + $("#flickrUsername").val(),
        vimeoUrl: "http://vimeo.com/" + $("#vimeoUsername").val(),
        dribbleUrl: "http://dribble.com/" + $("#dribbleUsername").val(),
        pinterestUrl: "http://pinterest.com/" + $("#pinterestUsername").val(),
        githubUrl: "http://github.com/" + $("#githubUsername").val()
      };
      
      PUBNUB.subscribe({
        channel: uuid,
        callback: function(message) {
          console.log(message)
          if (typeof(message.result) != "undefined") {
            window.location = message.result + "#withInstructions";
          }
          else if (typeof(message.error) != "undefined") {
            window.alert(message.error);
          }
        },
        error: function(e) {
          window.alert(e);
        }
      });

      PUBNUB.publish({
        channel  : "create-vcard",
        message  : data,
        callback : function(info) {
          console.log(info);
        }
      });
    });
  });

  // `Cancel create vcard
  $('.cancel').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
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
    var email_regex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
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

});
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
  $('input[name=OWNER_TITLE],input[name=OWNER_EMAIL],input[name=COMPANY_NAME],input[name=COMPANY_URL],textarea[name=COMPANY_ADDRESS]').bind('focus blur', function () {
    $('label[for=OWNER_NAME]').toggleClass('focused');
  });

  $("input[name=OWNER_EMAIL]").keyup(function() {
    email_address=$(this).val();
    var md5=$.md5(email_address);
    var email_regex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if(!email_regex.test(email_address)){
      valid = false;
      $('label[for=OWNER_NAME]').addClass('error');
    }else{
      $("form .avatar").removeClass('iconb').css("background-image", "url(http://www.gravatar.com/avatar.php?gravatar_id="+md5+"?s=160&d=404)"); 
      $('label[for=OWNER_NAME]').removeClass('error');
    };
  });

});
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

  $("input[name=OWNER_EMAIL]").focus().keyup(function() {
    var email=$(this).val();
    var md5=$.md5(email);
    $("form .avatar").removeClass('iconb').css("background-image", "url(http://www.gravatar.com/avatar.php?gravatar_id="+md5+"?s=160)"); 
  });

});
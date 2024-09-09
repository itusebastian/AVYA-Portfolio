jQuery(document).ready( function() {
// --------------Contact Form Ajax request-----------------------

    jQuery('form#contactform').on('submit', function(event){
    event.preventDefault();

 
	var name = jQuery('#author').val();
	var email = jQuery('#email').val();
	var subject = jQuery('#subject').val();
	var message = jQuery('#message').val();
	var nonce = jQuery('#nonce').val();
	
	jQuery.ajax({
			type : 'post',
			dataType : "json",
			url : mamaContactAjax.ajaxurl,
			data : {action: "mama_contact_form_submit",
					name : name,
					email : email,
					subject : subject,
					message : message,
					nonce : nonce
	
			},
			async : false,
			success : function(data){
				jQuery('.contactform').fadeIn().delay(1000).fadeOut();
      }
    });
  });
  
})
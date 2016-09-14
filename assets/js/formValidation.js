function initContactForm(){
    if($('#contact-form').length > 0) {
        // Map the contact form on the page to a variable
        var contactForm = $('#contact-form');

        // Frontend validation of the form
        contactForm.validate({
            ignore:'', //do not ignore hidden elements
            errorClass: 'has-error',
            highlight: function(element) {
                var elementObj = $(element);
                elementObj.parent().addClass('has-error');
            },
            unhighlight: function(element) {
                var elementObj = $(element);
                elementObj.parent().removeClass('has-error');
            }
        });

        // Custom validator for letters only (non English characters too) (with capitals, spaces and .).
        $.validator.addMethod('lettersonly', function(value, element) {
            return this.optional(element) || /^[\u0000-~\u0080-þĀ-žƀ-Ɏ\u1680\u180eḀ-Ỿ\u2000-\u200a\u2028-\u2029\u202f\u205f\u3000]+$/.test(value);
        }, 'Only alphabetical characters (with capitals, spaces and .) .');

        $.validator.addMethod('alphanumeric', function(value, element) {
            return this.optional(element) || /^[a-z0-9.()\s]+$/i.test(value);
        }, 'Letters, numbers, spaces, dots and brackets only please. ');

        // Submit the form if it is valid
        contactForm.find('.js-btn-submit').on('click', function(e){
            e.preventDefault();

            if (!$('div.form-error-container').length){
                contactForm.prepend('<div class="form-error-container"></div>');
            }

            var formErrorContainer = contactForm.find('.form-error-container');
            var submitBtn = $(this);
            formErrorContainer.empty();

            //Language based mailer script
            var formUrl = 'mailSend.php';

            //Validation messages
            var formSendSuccessMsg = 'Success';
            var formSendErrorMsg = 'Ooops!';
            var formSendWarningMsgP1 = 'Warning!';
            var formSendWarningMsgP2 = 'Currently, there are problems with the server. Try again later.';
            var formValidationErrorMsgP1 = 'Ooops!';
            var formValidationErrorMsgP2 = 'Please fill in all the required fields';

            if(contactForm.valid()){

                //Serialize the form data
                var formData = contactForm.serialize();

                //Disable the submit button & show the loader
                submitBtn.attr('disabled', true);
                submitBtn.text('Sending...');

                $.ajax({
                    type: 'POST',
                    url: formUrl,
                    data: formData,
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        if(data.success == 'true') {
                            formErrorContainer.append('<div class="message message-success"><p><i class="fa fa-check-circle"></i><strong>'+formSendSuccessMsg+'</strong> '+data.message+'</p></div>');

                            //Enable the submit button & hide the loader
                            submitBtn.attr('disabled', false);
                            submitBtn.text('Send');

                            //Clear form data
                            contactForm[0].reset();

                        } else {
                            formErrorContainer.append('<div class="message message-error"><p><strong>'+formSendErrorMsg+'</strong> '+data.message+'</p></div>');
                        }

                    },
                    error: function() {
                        formErrorContainer.append('<div class="message message-warning"><p><i class="fa fa-exclamation-circle"></i><strong>'+formSendWarningMsgP1+'</strong> '+formSendWarningMsgP2+'</p></div>');

                        //Enable the submit button & hide the loader
                        submitBtn.attr('disabled', false);
                        submitBtn.text('Send');
                    }
                });

            } else {
                formErrorContainer.append('<div class="message message-error"><p><strong>'+formValidationErrorMsgP1+'</strong> '+formValidationErrorMsgP2+'</p></div>');
            }

        });

    }
}



$(document).ready(function() {

    'use strict';

    initContactForm();

});

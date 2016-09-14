<?php

require __DIR__ . '/vendor/autoload.php';

use Mailgun\Mailgun;

$mailgun_domain = "mg.happybits.co";
$mailgun_api_key = "key-0-j8uef1so9u70o2naqjp-mw7ss7kvs8";
$mail_to = "contact@getjoya.com";


if (!empty($_REQUEST['message']) && !empty($_REQUEST['email'])) {
    // instantiate mailgun
    $mg = new Mailgun($mailgun_api_key);
    
    // Now, compose and send your message.
    $result = $mg->sendMessage($mailgun_domain, 
                               array('from'    => $_REQUEST['email'], 
                                     'to'      => $mail_to, 
                                     'subject' => 'new message from ' . $_REQUEST['email'], 
                                     'text'    => $_REQUEST['message']));
                                    
    //var_dump($result);
    if( $result->http_response_code == 200 ){
        echo json_encode(array('status'=>'success', 'message'=>'email sent'));
    } else {
        echo json_encode(array('status'=>'error', 'message'=>'failed to deliver message'));
    }
    
} else {
    echo json_encode(array('status'=>'error', 'message'=>'please specify email and message'));
}

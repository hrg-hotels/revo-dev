<?php
if ( ! defined( 'ABSPATH' ) ) exit; 

if (!function_exists('wpae_get_blocked_integrations') || !in_array('wpforms', wpae_get_blocked_integrations())) :

	add_filter( 'wpforms_process_before', 'wpa_wpforms_extra_validation', 10, 2 );

	function wpa_wpforms_extra_validation($entry, $form_data){
		if (wpa_check_is_spam($_POST)){
			do_action('wpa_handle_spammers','wpforms', $_POST);
			wpforms()->process->errors[ $form_data['id'] ][ '0' ] = $GLOBALS['wpa_error_message'];
		}
	}

endif;
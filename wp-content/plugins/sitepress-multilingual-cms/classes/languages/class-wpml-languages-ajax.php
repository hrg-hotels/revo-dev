<?php

use WPML\API\Sanitize;

/**
 * @author OnTheGo Systems
 */
class WPML_Languages_AJAX {
	private $sitepress;
	private $default_language;

	/**
	 * WPML_Languages_AJAX constructor.
	 *
	 * @param SitePress $sitepress
	 */
	public function __construct( SitePress $sitepress ) {
		$this->sitepress        = $sitepress;
		$this->default_language = $this->sitepress->get_default_language();
	}

	public function ajax_hooks() {
		add_action( 'wp_ajax_wpml_set_active_languages', array( $this, 'set_active_languages_action' ) );
		add_action( 'wp_ajax_wpml_set_default_language', array( $this, 'set_default_language_action' ) );
	}

	private function validate_ajax_action() {
		$action = Sanitize::stringProp( 'action', $_POST );
		$nonce  = Sanitize::stringProp( 'nonce', $_POST );

		return $action && $nonce && wp_verify_nonce( $nonce, $action );
	}

	public function set_active_languages_action() {
		$failed = true;

		$response = array();
		if ( $this->validate_ajax_action() ) {
			$old_active_languages       = $this->sitepress->get_active_languages();
			$old_active_languages_count = count( (array) $old_active_languages );
			$lang_codes                 = filter_var( $_POST['languages'], FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_REQUIRE_ARRAY );
			$setup_instance             = wpml_get_setup_instance();
			if ( $lang_codes && $setup_instance->set_active_languages( $lang_codes ) ) {
				$response['enabledLanguages'] = $this->generate_language_options_html();

				$response['noLanguages'] = 1;
				if ( ( count( $lang_codes ) > 1 ) || ( $old_active_languages_count > 1 && count( $lang_codes ) < 2 ) ) {
					$response['noLanguages'] = 0;
				}
				$updated_active_languages = $this->sitepress->get_active_languages();
				if ( $updated_active_languages ) {
					$wpml_localization = new WPML_Download_Localization( $updated_active_languages, $this->default_language );
					$wpml_localization->download_language_packs();

					$wpml_languages_notices = new WPML_Languages_Notices( wpml_get_admin_notices() );
					$wpml_languages_notices->maybe_create_notice_missing_menu_items( count( $lang_codes ) );
					$wpml_languages_notices->missing_languages( $wpml_localization->get_not_founds() );

					if ( \WPML\Setup\Option::isTMAllowed() && $this->sitepress->is_setup_complete() ) {
						WPML_TM_Translation_Priorities::insert_missing_default_terms();
					}
				}
				$failed = false;
			}

			icl_cache_clear();

			/** @deprecated Use `wpml_update_active_languages` instead */
			do_action( 'icl_update_active_languages' );
			do_action( 'wpml_update_active_languages', $old_active_languages );
		}

		if ( $failed ) {
			wp_send_json_error( $response );
		} else {
			wp_send_json_success( $response );
		}
	}


	public function generate_language_options_html() {
		$hidden_languages = $this->sitepress->get_setting( 'hidden_languages' );
		$active_languages = $this->sitepress->get_active_languages();
		$output           = '';

		foreach ( (array) $active_languages as $lang ) {
			if ( ! empty( $hidden_languages ) && in_array( $lang['code'], $hidden_languages, true ) ) {
				$hidden = '&nbsp<strong style="color:#f00">(' . esc_html__( 'hidden', 'sitepress' ) . ')</strong>';
			} else {
				$hidden = '';
			}

			$is_default = ( $this->default_language === $lang['code'] );
			$output    .= '<li ';
			if ( $is_default ) {
				$output .= 'class="selected"';
			}
			$output .= '><label><input type="radio" name="default_language" value="' . $lang['code'] . '" ';
			if ( $is_default ) {
				$output .= 'checked="checked"';
			}
			$output .= '>' . $lang['display_name'] . $hidden;
			if ( $is_default ) {
				$output .= ' (' . __( 'default', 'sitepress' ) . ')';
			}
			$output .= '</label></li>';
		}

		return $output;
	}

	public function set_default_language_action() {
		$failed   = true;
		$response = array();

		if ( $this->validate_ajax_action() ) {
			$previous_default     = $this->default_language;
			$new_default_language = filter_var( $_POST['language'], FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_NULL_ON_FAILURE );

			$active_languages       = $this->sitepress->get_active_languages();
			$active_languages_codes = array_keys( $active_languages );

			if ( $new_default_language && in_array( $new_default_language, $active_languages_codes, true ) ) {
				$status = $this->sitepress->set_default_language( $new_default_language );
				if ( $status ) {
					$response['previousLanguage'] = $previous_default;
					$failed                       = false;
				}
				if ( 1 === $status ) {
					$response['message'] = __( 'WordPress language file (.mo) is missing. Keeping existing display language.', 'sitepress' );
				}
			}
		}

		if ( $failed ) {
			wp_send_json_error( $response );
		} else {
			wp_send_json_success( $response );
		}
	}
}

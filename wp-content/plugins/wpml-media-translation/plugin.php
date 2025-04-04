<?php
/**
 * Plugin Name: WPML Media Translation
 * Plugin URI: https://wpml.org/
 * Description: Show different images for content in different languages | <a href="https://wpml.org/documentation/getting-started-guide/media-translation/?utm_source=plugin&utm_medium=gui&utm_campaign=wpmlmedia">Documentation</a> | <a href="https://wpml.org/version/wpml-media-translation-2-7-7/">WPML Media Translation 2.7.7 release notes</a>
 * Author: OnTheGoSystems
 * Author URI: http://www.onthegosystems.com/
 * Version: 2.7.7
 * Plugin Slug: wpml-media-translation
 *
 * @package wpml/media
 */

if ( defined( 'WPML_MEDIA_VERSION' ) ) {
	return;
}

define( 'WPML_MEDIA_VERSION', '2.7.7' );
define( 'WPML_MEDIA_PATH', dirname( __FILE__ ) );

require_once WPML_MEDIA_PATH . '/vendor/autoload.php';

require WPML_MEDIA_PATH . '/inc/constants.inc';
require WPML_MEDIA_PATH . '/inc/wpml-media-dependencies.class.php';
require WPML_MEDIA_PATH . '/inc/wpml-media-upgrade.class.php';
if ( is_admin() ) {
	require_once ABSPATH . 'wp-admin/includes/image.php';
}

function wpml_media_remove_flag_notice() {
	$wpml_admin_notices = wpml_get_admin_notices();
	$wpml_admin_notices->remove_notice(
		WPML_Media_Posts_Media_Flag_Notice::NOTICE_GROUP,
		WPML_Media_Posts_Media_Flag_Notice::NOTICE_ID
	);
}

global $WPML_media, $wpdb, $sitepress, $iclTranslationManagement;

$media_dependencies = new WPML_Media_Dependencies();
if ( $media_dependencies->check() ) {

	add_action( 'plugins_loaded', 'wpml_media_core_action_filter_loader', 0 );
	function wpml_media_core_action_filter_loader() {

		$loaders = array(
			'WPML_Media_Factory',
			'WPML_Media_Save_Translation_Factory',
			'WPML_Media_Attachment_Image_Update_Factory',
			'WPML_Media_Screen_Options_Factory',
			'WPML_Media_Posts_Media_Flag_Notice_Factory',
			'WPML_Media_Set_Posts_Media_Flag_Factory',
			'WPML_Media_Set_Initial_Language_Factory',
			'WPML_Media_Post_Media_Usage_Factory',
			'WPML_Media_Privacy_Content_Factory',
			WPML\Media\Widgets\Block\DisplayTranslation::class,
		);

		$action_filter_loader = new WPML_Action_Filter_Loader();
		$action_filter_loader->load( $loaders );

	}

	add_action( 'wpml_loaded', 'wpml_media_load_components' );
	function wpml_media_load_components() {

		if ( class_exists( 'WPML_Current_Screen_Loader_Factory' ) ) {

			$loaders = array(
				'WPML_Media_Attachments_Query_Factory',
				'WPML_Media_Post_Images_Translation_Factory',
				'WPML_Media_Post_Batch_Url_Translation_Factory',
				'WPML_Media_Custom_Field_Images_Translation_Factory',
				'WPML_Media_Custom_Field_Batch_Url_Translation_Factory',
				'WPML_Media_Editor_Notices_Factory',
				'WPML_Media_Help_Tab_Factory',
			);

			$action_filter_loader = new WPML_Action_Filter_Loader();
			$action_filter_loader->load( $loaders );
		}
	}

	add_action( 'wpml_st_loaded', 'wpml_media_load_components_st' );
	function wpml_media_load_components_st() {

		$loaders = array(
			'WPML_Media_String_Images_Translation_Factory',
			'WPML_Media_String_Batch_Url_Translation_Factory',
		);

		$action_filter_loader = new WPML_Action_Filter_Loader();
		$action_filter_loader->load( $loaders );

	}

	add_action( 'wpml_after_tm_loaded', 'wpml_media_load_components_tm' );
	function wpml_media_load_components_tm() {

		$loaders = [
			WPML_Media_Populate_Media_Strings_Translations_Factory::class,
		];

		$action_filter_loader = new WPML_Action_Filter_Loader();
		$action_filter_loader->load( $loaders );

	}
}

add_action( 'deactivate_' . WPML_MEDIA_FOLDER . '/plugin.php', 'wpml_media_deactivation_actions' );
function wpml_media_deactivation_actions() {
	if ( defined( 'ICL_SITEPRESS_VERSION' ) ) {
		wpml_media_remove_flag_notice();
	}
}

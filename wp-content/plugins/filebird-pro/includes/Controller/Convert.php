<?php
namespace FileBird\Controller;

use FileBird\Classes\Helpers;
use FileBird\Model\SettingModel;

defined( 'ABSPATH' ) || exit;

/**
 * Helps to convert old-data (from filebird old version) to new data
 */

class Convert {
	private static $folder_table   = 'fbv';
	private static $relation_table = 'fbv_attachment_folder';
	public function __construct() {
	}

	public static function insertToNewTable( $folders = null ) {
		global $wpdb;
		if ( is_null( $folders ) ) {
			$folders = self::getOldFolders();
		}
		foreach ( $folders as $k => $folder ) {
			if ( is_array( $folder ) ) {
				$folder = json_decode( wp_json_encode( $folder ) );
			}

			$parent = $folder->parent;
			if ( $parent > 0 ) {
				$parent = get_term_meta( $parent, 'new_fbv_id', true );
			}
			$check     = self::detail( $folder->name, $parent, $folder->created_by );
			$insert_id = 0;
			if ( is_null( $check ) ) {
				$wpdb->insert(
					self::getTable( self::$folder_table ),
					array(
						'name'       => Helpers::sanitize_for_excel( $folder->name ),
						'parent'     => $parent,
						'created_by' => $folder->created_by,
						'type'       => 0,
					)
				);
				$insert_id = (int) $wpdb->insert_id;
			} else {
				$insert_id = (int) $check->id;
			}
			//attachments
			if ( isset( $folder->attachments ) ) {
				foreach ( $folder->attachments as $k2 => $attachment_id ) {
					$post = get_post( $attachment_id );
					if ( is_object( $post ) && $post->post_type == 'attachment' ) {
						self::setFolder( $attachment_id, $insert_id, false );
					}
				}
			}
			//update new_fbv_id for this term
			update_term_meta( $folder->id, 'new_fbv_id', $insert_id );
		}
	}

	private static function setFolder( $ids, $folder, $delete_first = false ) {
		global $wpdb;
		if ( is_numeric( $ids ) ) {
			$ids = array( $ids );
		}
		foreach ( $ids as $k => $v ) {
			if ( $delete_first ) {
				$wpdb->delete( self::getTable( self::$relation_table ), array( 'attachment_id' => $v ), array( '%d' ) );
			}
			if ( (int) $folder > 0 ) {
				$wpdb->insert(
					self::getTable( self::$relation_table ),
					array(
						'attachment_id' => (int) $v,
						'folder_id'     => (int) $folder,
					),
					array( '%d', '%d' )
				);
			}
		}
	}
	private static function detail( $name, $parent, $created_by = null ) {
		global $wpdb;

		if ( ! is_null( $created_by ) ) {
			$created = (int) $created_by;
		} else {
			$user_has_own_folder = SettingModel::getInstance()->get( 'user_mode' ) === '1';
			if ( $user_has_own_folder ) {
				$created = get_current_user_id();
			} else {
				$created = 0;
			}
		}
		$check = $wpdb->get_results( $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}fbv WHERE `name` = %s AND `parent` = %d AND `created_by` = %d", $name, $parent, $created ) );

		if ( $check != null && count( $check ) > 0 ) {
			return $check[0];
		} else {
			return null;
		}
	}
	private static function getTable( $table ) {
		global $wpdb;
		return $wpdb->prefix . $table;
	}

	public static function getOldFolders() {
		$folders = self::_getOldFolders( 0 );
		return $folders;
	}

	public static function countOldFolders() {
		global $wpdb;

		$oldFolders = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(t.term_id) FROM $wpdb->terms as t LEFT JOIN $wpdb->term_taxonomy as tt ON(t.term_id = tt.term_id) WHERE taxonomy = %s", 'nt_wmc_folder' ) );

		return intval( $oldFolders );
	}

	private static function _getOldFolders( $parent ) {
		global $wpdb;
		$folders = array();
		$folders = $wpdb->get_results( $wpdb->prepare( "SELECT t.term_id as id, t.name FROM $wpdb->terms as t LEFT JOIN $wpdb->term_taxonomy as tt ON (t.term_id = tt.term_id) WHERE parent = %d and taxonomy = 'nt_wmc_folder'", $parent ) );
		foreach ( $folders as $k => $v ) {
			$folders[ $k ]->parent      = $parent;
			$folders[ $k ]->created_by  = (int) $wpdb->get_var( $wpdb->prepare( "SELECT meta_value FROM {$wpdb->termmeta} WHERE meta_key = 'fb_created_by' AND term_id = %d", $v->id ) );
			$folders[ $k ]->attachments = self::_getAttachments( $v->id );
		}
		foreach ( $folders as $k => $v ) {
			$children = self::_getOldFolders( $v->id );
			foreach ( $children as $k2 => $v2 ) {
				$folders[] = $v2;
			}
		}
		return $folders;
	}
	private static function _getAttachments( $term_id ) {
		global $wpdb;
		$term_taxonomy_id = $wpdb->get_var( $wpdb->prepare( "SELECT term_taxonomy_id FROM $wpdb->term_taxonomy WHERE term_id = %d", $term_id ) );

		$_data = $wpdb->get_results( $wpdb->prepare( "SELECT object_id FROM $wpdb->term_relationships WHERE term_taxonomy_id = %d", $term_taxonomy_id ) );
		$ids   = array();
		foreach ( $_data as $k => $v ) {
			$ids[] = $v->object_id;
		}
		return $ids;
	}
}
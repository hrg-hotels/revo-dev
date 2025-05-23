<?php

class WPML_ST_Translations_File_Dictionary_Storage_Table implements WPML_ST_Translations_File_Dictionary_Storage {
	/** @var wpdb */
	private $wpdb;

	/** @var null|array */
	private $data;

	/** @var WPML_ST_Translations_File_Entry[] */
	private $new_data = array();

	/** @var WPML_ST_Translations_File_Entry[] */
	private $updated_data = array();

	/**
	 * @param wpdb $wpdb
	 */
	public function __construct( wpdb $wpdb ) {
		$this->wpdb = $wpdb;
	}

	public function add_hooks() {
		add_action( 'shutdown', array( $this, 'persist' ), 11, 0 );
	}

	public function save( WPML_ST_Translations_File_Entry $file ) {
		$this->load_data();

		$is_new                          = ! isset( $this->data[ $file->get_path() ] );
		$this->data[ $file->get_path() ] = $file;

		if ( $is_new ) {
			$this->new_data[] = $file;
		} else {
			$this->updated_data[] = $file;
		}
	}

	/**
	 * We have to postpone saving of real data because target table may not be created yet by migration process
	 */
	public function persist() {
		foreach ( $this->new_data as $file ) {
			$sql = "INSERT IGNORE INTO {$this->wpdb->prefix}icl_mo_files_domains ( file_path, file_path_md5, domain, status, num_of_strings, last_modified, component_type, component_id ) VALUES ( %s, %s, %s, %s, %d, %d, %s, %s )";
			$this->wpdb->query(
				$this->wpdb->prepare(
					$sql,
					array(
						$file->get_path(),
						$file->get_path_hash(),
						$file->get_domain(),
						$file->get_status(),
						$file->get_imported_strings_count(),
						$file->get_last_modified(),
						$file->get_component_type(),
						$file->get_component_id(),
					)
				)
			);
		}

		foreach ( $this->updated_data as $file ) {
			$this->wpdb->update(
				$this->wpdb->prefix . 'icl_mo_files_domains',
				$this->file_to_array( $file ),
				array(
					'file_path_md5' => $file->get_path_hash(),
				),
				array( '%s', '%s', '%d', '%d' )
			);
		}
	}

	/**
	 * @param WPML_ST_Translations_File_Entry $file
	 * @param array                           $data
	 *
	 * @return array
	 */
	private function file_to_array( WPML_ST_Translations_File_Entry $file, array $data = array() ) {
		$data['domain']         = $file->get_domain();
		$data['status']         = $file->get_status();
		$data['num_of_strings'] = $file->get_imported_strings_count();
		$data['last_modified']  = $file->get_last_modified();

		return $data;
	}

	public function find( $path = null, $status = null ) {
		$this->load_data();

		if ( null !== $path ) {
			return isset( $this->data[ $path ] ) ? array( $this->data[ $path ] ) : array();
		}

		if ( null === $status ) {
			return array_values( $this->data );
		}

		if ( ! is_array( $status ) ) {
			$status = array( $status );
		}

		$result = array();
		foreach ( $this->data as $file ) {
			if ( in_array( $file->get_status(), $status, true ) ) {
				$result[] = $file;
			}
		}

		return $result;
	}

	/**
	 * Checks if the given $path is on the wp_icl_mo_files_domains table.
	 * It's only there when ST has handled the file.
	 *
	 * @param string $path
	 * @param string $domain
	 *
	 * @return bool
	 */
	public function is_path_handled( $path, $domain ) {
		$file = new WPML_ST_Translations_File_Entry( $path, $domain );

		// phpcs:disable WordPress.WP.PreparedSQL.NotPrepared
		$id = $this->wpdb->get_var(
			$this->wpdb->prepare(
				"SELECT id
				FROM {$this->wpdb->prefix}icl_mo_files_domains
				WHERE file_path_md5 = %s
				LIMIT 1",
				$file->get_path_hash()
			)
		);
		// phpcs:enable WordPress.WP.PreparedSQL.NotPrepared

		return null !== $id;
	}

	private function load_data() {
		if ( null === $this->data ) {
			$this->data = array();
			$sql        = "SELECT * FROM {$this->wpdb->prefix}icl_mo_files_domains";
			$rowset     = $this->wpdb->get_results( $sql );

			foreach ( $rowset as $row ) {
				$file = new WPML_ST_Translations_File_Entry( $row->file_path, $row->domain, $row->status );
				$file->set_imported_strings_count( $row->num_of_strings );
				$file->set_last_modified( $row->last_modified );
				$file->set_component_type( $row->component_type );
				$file->set_component_id( $row->component_id );

				$this->data[ $file->get_path() ] = $file;
			}
		}
	}

	public function reset() {
		$this->data = null;
	}

	public function findAllUniqueComponentIds( string $componentType = null, array $fileExtensions = [] ): array {
		$sql = "SELECT DISTINCT(component_id) FROM {$this->wpdb->prefix}icl_mo_files_domains";

		$conditions = [];

		if ( $componentType !== null ) {
			$conditions[] = $this->wpdb->prepare( 'component_type = %s', $componentType );
		}

		if ( count( $fileExtensions ) > 0 ) {
			$likeConditions = [];
			foreach ( $fileExtensions as $fileExtension ) {
				$likeConditions[] = $this->wpdb->prepare( 'file_path LIKE %s', '%' . $this->wpdb->esc_like( '.' . $fileExtension ) );
			}
			$conditions[] = '(' . implode( ' OR ', $likeConditions ) . ')';
		}

		if ( ! empty( $conditions ) ) {
			$sql .= ' WHERE ' . implode( ' AND ', $conditions );
		}

		return $this->wpdb->get_col( $sql );
	}
}

<?php

/**
 * Class WPML_TF_Collection
 *
 * @author OnTheGoSystems
 */
class WPML_TF_Collection implements Iterator, Countable {

	/** @var array<\IWPML_TF_Data_Object> */
	protected $collection = array();

	/**
	 * @param \IWPML_TF_Data_Object $data_object
	 */
	public function add( IWPML_TF_Data_Object $data_object ) {
		$this->collection[ $data_object->get_id() ] = $data_object;
	}

	/**
	 * @return array
	 */
	public function get_ids() {
		return array_keys( $this->collection );
	}

	/**
	 * @param int $id
	 *
	 * @return IWPML_TF_Data_Object|null
	 */
	public function get( $id ) {
		return array_key_exists( $id, $this->collection ) ? $this->collection[ $id ] : null;
	}

	public function count(): int {
		return count( $this->collection );
	}

	public function rewind() {
		reset( $this->collection );
	}

	#[\ReturnTypeWillChange]
	public function current() {
		return current( $this->collection );
	}

	#[\ReturnTypeWillChange]
	public function key() {
		return key( $this->collection );
	}

	public function next() {
		next( $this->collection );
	}

	/**
	 * @return bool
	 */
	public function valid(): bool {
		return key( $this->collection ) !== null;
	}
}

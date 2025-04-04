<?php
/**
 * Plugin Name: Hotel Portfolio API
 * Description: A basic plugin that allows through a REST API, database transactions with db table wp_hotel_portfolio.
 * Version: 1.0
 * Author: Dimitrios Kitsikidis
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct access
}

include_once('functions.php');

// // Register the activation hook
// register_activation_hook(__FILE__, 'hotel_portfolio_api_plugin_activate');

// Register a simple API endpoint
add_action('rest_api_init', function () {
    register_rest_route('hotel-portfolio-api/v1', '/hello/', array(
        'methods' => 'GET',
        'callback' => 'return_hello_message',
        'permission_callback' => '__return_true', // No authentication required for now
    ));
});

function return_hello_message() {
    return new WP_REST_Response(['message' => 'Hello, World! Your API is working!'], 200);
}


function get_api_table_name() {
    global $wpdb;
    return $wpdb->prefix . 'hotel_portfolio_04';
}

/* READ ENDPOINTS */
/* READ ENDPOINTS */
/* READ ENDPOINTS */
/* READ ENDPOINTS */
/* READ ENDPOINTS */

// 1. Get all data from the table
add_action('rest_api_init', function () {
    register_rest_route('hotel-portfolio-api/v1', '/data/', array(
        'methods'             => 'GET',
        'callback'            => 'api_get_all_data',
        'permission_callback' => '__return_true',
    ));
});
function api_get_all_data() {
    global $wpdb;
    $table_name = get_api_table_name();
    $results    = $wpdb->get_results("SELECT * FROM $table_name", ARRAY_A);
    return new WP_REST_Response($results, 200);
}

// 2. Get data by ID (ID passed as a URL parameter)
add_action('rest_api_init', function () {
    register_rest_route('hotel-portfolio-api/v1', '/data/(?P<id>\d+)', array(
        'methods'             => 'GET',
        'callback'            => 'api_get_data_by_chronos_id',
        'permission_callback' => '__return_true',
    ));
});
function api_get_data_by_chronos_id(WP_REST_Request $request) {
    global $wpdb;
    $id         = intval($request['id']);
    $table_name = get_api_table_name();
    $results    = $wpdb->get_results(
        $wpdb->prepare("SELECT * FROM $table_name WHERE chronos_id = %d", $id),
        ARRAY_A
    );
    return new WP_REST_Response($results, 200);
}

/* WRITE ENDPOINTS */
/* WRITE ENDPOINTS */
/* WRITE ENDPOINTS */
/* WRITE ENDPOINTS */
/* WRITE ENDPOINTS */

// 3. Update data (expects an array of objects, each with 'updatedData' and 'updateCriteria')
add_action('rest_api_init', function () {
    register_rest_route('hotel-portfolio-api/v1', '/data/update', array(
        'methods'             => 'POST',
        'callback'            => 'api_update_data',
        'permission_callback' => '__return_true',
    ));
});
function api_update_data(WP_REST_Request $request) {
    global $wpdb;
    $table_name = get_api_table_name();
    $updates    = $request->get_json_params(); // should be an array of update objects

    if (!is_array($updates)) {
        return new WP_Error('invalid_data', 'Data must be an array of update objects', array('status' => 400));
    }

    $results = array();	
	
    foreach ($updates as $update) {
        if (!isset($update['updatedData']) || !isset($update['updateCriteria'])) {
            $results[] = array('status' => 'failed', 'message' => 'Missing updatedData or updateCriteria');
            continue;
        }
		
		
		
        $update_result = $wpdb->update($table_name, $update['updatedData'], $update['updateCriteria']);

        if ($update_result === false) {
            $results[] = array('status' => 'failed', 'message' => $wpdb->last_error);
        } else {
            $results[] = array('status' => 'success', 'rows_affected' => $update_result);
        }
    }

    return new WP_REST_Response($results, 200);
}

// 4. Insert data (expects an array of new row objects)
add_action('rest_api_init', function () {
    register_rest_route('hotel-portfolio-api/v1', '/data/insert', array(
        'methods'             => 'POST',
        'callback'            => 'api_insert_data',
        'permission_callback' => '__return_true',
    ));
});
function api_insert_data(WP_REST_Request $request) {
    global $wpdb;
    $table_name = get_api_table_name();
    $inserts    = $request->get_json_params(); // should be an array of insert objects

    if (!is_array($inserts)) {
        return new WP_Error('invalid_data', 'Data must be an array of insert objects', ['status' => 400]);
    }

    $results = [];

    foreach ($inserts as $insert) {
        $insert_result = $wpdb->insert($table_name, $insert);
        if ($insert_result === false) {
            $results[] = ['status' => 'failed', 'message' => $wpdb->last_error];
        } elseif ($insert_result === 0) {
            $results[] = ['status' => 'failed', 'message' => 'No rows inserted'];
        } else {
            $results[] = ['status' => 'success', 'insert_id' => $wpdb->insert_id];
        }
    }

    return new WP_REST_Response($results, 200);
}

// 5. Delete data (expects an array of criteria objects for the WHERE clause)
add_action('rest_api_init', function () {
    register_rest_route('hotel-portfolio-api/v1', '/data/delete', array(
        'methods'             => 'DELETE',
        'callback'            => 'api_delete_data',
        'permission_callback' => '__return_true',
    ));
});
function api_delete_data(WP_REST_Request $request) {
    global $wpdb;
    $table_name = get_api_table_name();
    $deletes    = $request->get_json_params(); // should be an array of delete criteria objects

    if (!is_array($deletes)) {
        return new WP_Error('invalid_data', 'Data must be an array of delete criteria objects', array('status' => 400));
    }

    $results = array();

    foreach ($deletes as $delete) {
        $delete_result = $wpdb->delete($table_name, $delete);
        if ($delete_result === false) {
            $results[] = array('status' => 'failed', 'message' => $wpdb->last_error);
        } else {
            $results[] = array('status' => 'success', 'rows_deleted' => $delete_result);
        }
    }

    return new WP_REST_Response($results, 200);
}

// 6. Get all data from the table setup-hotel-portfolio
add_action('rest_api_init', function () {
    register_rest_route('setup-hotel-portfolio-api/v1', '/data/', array(
        'methods'             => 'GET',
        'callback'            => 'api_get_all_data_setup_hotel_portfolio',
        'permission_callback' => '__return_true',
    ));
});
function api_get_all_data_setup_hotel_portfolio() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'setup_hotel_portfolio';
    $results    = $wpdb->get_results("SELECT * FROM $table_name", ARRAY_A);
    return new WP_REST_Response($results, 200);
}

// Disable caching for API responses
add_filter('rest_pre_serve_request', function ($value, $server, $request) {
    header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: Mon, 01 Jan 1990 00:00:00 GMT');
    header('X-Kinsta-Cache', 'MISS'); // Forces Kinsta to bypass cache
    header('X-Cache-Bypass', 'true'); // Extra cache bypass signal
    return $value;
}, 10, 3);
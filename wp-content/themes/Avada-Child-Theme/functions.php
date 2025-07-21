<?php

// Enqueue child theme stylesheet
function theme_enqueue_styles() {
    wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', [] );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles', 20 );

// Conditionally enqueue custom JS only on specific portfolio/brands-and-partners URLs
function childtheme_enqueue_custom_script() {
    // Only load on the brands-and-partners page (en + de)
    if (is_page(array('brands-and-partners', '/de/portfolio/hotelmarken-und-partner/'))) {
        wp_enqueue_script(
            'link-brand-to-portfolio',
            get_stylesheet_directory_uri() . '/link_brand_to_portfolio.js',
            array('jquery'),
            null,
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'childtheme_enqueue_custom_script' );


// Child theme language setup
function avada_lang_setup() {
    $lang = get_stylesheet_directory() . '/languages';
    load_child_theme_textdomain( 'Avada', $lang );
}
add_action( 'after_setup_theme', 'avada_lang_setup' );

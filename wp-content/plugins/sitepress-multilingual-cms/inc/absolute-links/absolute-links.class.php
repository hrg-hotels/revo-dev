<?php

use WPML\Core\Component\Translation\Domain\Links\CollectorInterface;
use WPML\FP\Lst;
use WPML\FP\Str;

class AbsoluteLinks {
	/** @var array */
	public $custom_post_query_vars = [];

	/** @var array */
	public $taxonomies_query_vars = [];

	/** @var array */
	private $active_languages;

	/** @var bool $query_vars_initialized */
	private $query_vars_initialized = false;

	public function init_query_vars() {
		global $wp_post_types, $wp_taxonomies;

		if ( $this->query_vars_initialized ) {
			return;
		}

		// Custom posts query vars.
		foreach ( $wp_post_types as $k => $v ) {
			if ( 'post' === $k || 'page' === $k ) {
				continue;
			}
			if ( $v->query_var ) {
				$this->custom_post_query_vars[ $k ] = $v->query_var;
			}
		}
		// Taxonomies query vars.
		foreach ( $wp_taxonomies as $k => $v ) {
			if ( 'category' === $k ) {
				continue;
			}
			if ( 'post_tag' === $k && ! $v->query_var ) {
				$tag_base     = get_option( 'tag_base', 'tag' );
				$v->query_var = $tag_base;
			}
			if ( $v->query_var ) {
				$this->taxonomies_query_vars[ $k ] = $v->query_var;
			}
		}

		$this->query_vars_initialized = true;
	}

	/**
	 * AbsoluteLinks only converts links in the html href="" attribute.
	 * See private function get_links( $text ).
	 *
	 * @param string $text
	 *
	 * @return bool
     */
	public static function has_href_attribute( $text ) {
		if ( is_null( $text ) ) {
			return false;
		}

		// > 1 because if the $text starts with a link there must be at least
		// '<a' before the ' href=', otherwise it's not a link.
		return strpos( $text, ' href=' ) > 1;
	}

	/**
	 * Check if there are href links outside blocks.
	 *
	 * @param string $text
	 */
	public static function has_href_attribute_outside_blocks( $text ) {
		// Do the very light check first.
		if ( ! self::has_href_attribute( $text ) ) {
			return false;
		}

		// There are href links... check if they are inside blocks.
		// A block always starts with <!-- so we can do a light check first.
		if ( strpos( $text, '<!-- ' ) === false ) {
			// No blocks at all, so the links are outside blocks.
			return true;
		}

		// There are blocks, so we need to check if the links are inside them.
		// Replace all blocks with a placeholder.
		$block_protector     = new \WPML\AbsoluteLinks\BlockProtector();
		$text_without_blocks = $block_protector->protect( $text );

		// Return result of having an href outside blocks.
		return self::has_href_attribute( $text_without_blocks );
	}

	public function _process_generic_text( $source_text, &$alp_broken_links, $ignore_blocks = true, CollectorInterface $collector = null ) {
		if ( ! self::has_href_attribute( $source_text ) ) {
			// Abort as early as possible if there are no links in the text.
			return $source_text;
		}

		global $wpdb, $wp_rewrite, $sitepress, $sitepress_settings;

		$this->init_query_vars();

		$sitepress_settings = $sitepress->get_settings();

		$default_language = $sitepress->get_default_language();
		$current_language = $sitepress->get_current_language();

		$cache_key_args = [
			$default_language,
			$current_language,
			md5( $source_text ),
			md5( implode( '', $alp_broken_links ) ),
		];
		$cache_key      = md5( (string) wp_json_encode( $cache_key_args ) );
		$cache_group    = '_process_generic_text';
		$found          = false;

		$text = WPML_Non_Persistent_Cache::get( $cache_key, $cache_group, $found );

		if ( $found ) {
			return $text;
		}

		$filtered_icl_post_language = filter_input( INPUT_POST, 'icl_post_language', FILTER_SANITIZE_FULL_SPECIAL_CHARS );

		if ( $ignore_blocks ) {
			$block_protector = new \WPML\AbsoluteLinks\BlockProtector();
			$text = $block_protector->protect( $source_text );

			// Do another check for href attribute after blocks were "erased".
			if ( ! self::has_href_attribute( $source_text ) ) {
				// Set the cache, so the next time the block protector will not be called.
				WPML_Non_Persistent_Cache::set( $cache_key, $source_text, $cache_group );

				// No links to handle, return the original text.
				return $source_text;
			}
		} else {
			$text = $source_text;
		}

		// We need to loop over each language so we create sticky links for all languages.
		$this->active_languages = array_keys( $sitepress->get_active_languages() );
		$current_language       = empty( $filtered_icl_post_language ) ? $current_language : $filtered_icl_post_language;
		if ( ! empty( $current_language ) ) {
			$key = array_search( $current_language, $this->active_languages, true );
			if ( false !== $key ) {
				unset( $this->active_languages[ $key ] );
			}
			array_unshift( $this->active_languages, $current_language );
		}

		$blacklist_requests = new WPML_Absolute_Links_Blacklist(
			apply_filters( 'wpml_sl_blacklist_requests', [], $sitepress )
		);

		foreach ( $this->active_languages as $test_language ) {
			$rewrite = $this->initialize_rewrite( $current_language, $default_language, $sitepress );

			$home_url = $sitepress->language_url( $test_language );

			if ( 3 === $sitepress_settings['language_negotiation_type'] ) {
				$home_url = preg_replace( '#\?lang=([a-z-]+)#i', '', $home_url );
			}
			$home_url = str_replace( '?', '\?', $home_url );

			if ( $sitepress_settings['urls']['directory_for_default_language'] && $test_language === $default_language ) {
				$home_url = str_replace( $default_language . '/', '', $home_url );
			}

			$int1 = preg_match_all( '@<a([^>]*)href="((' . rtrim( $home_url, '/' ) . ')?/([^"^>^\[^\]]+))"([^>]*)>@i', $text, $alp_matches1 );
			$int2 = preg_match_all( '@<a([^>]*)href=\'((' . rtrim( $home_url, '/' ) . ')?/([^\'^>^\[^\]]+))\'([^>]*)>@i', $text, $alp_matches2 );

			$alp_matches = [];
			for ( $i = 0; $i < 6; $i ++ ) {
				$alp_matches[ $i ] = array_merge( (array) $alp_matches1[ $i ], (array) $alp_matches2[ $i ] );
			}

			if ( $int1 || $int2 ) {
				$def_url           = [];
				$url_parts         = wp_parse_url( $this->get_home_url_with_no_lang_directory() );
				$url_parts['path'] = isset( $url_parts['path'] ) ? $url_parts['path'] : '';
				foreach ( $alp_matches[4] as $k => $dir_path ) {
					if ( 0 === strpos( $dir_path, WP_CONTENT_DIR ) ) {
						continue;
					}

					list( $lang, $dir_path ) = $this->extract_lang_from_path( $sitepress_settings, $default_language, $dir_path );

					$req_uri        = '/' . $dir_path;
					$req_uri_array  = explode( '?', $req_uri );
					$req_uri        = $req_uri_array[0];
					$req_uri_params = '';
					if ( isset( $req_uri_array[1] ) ) {
						$req_uri_params = $req_uri_array[1];
					}
					// Separate anchor.
					$req_uri_array = explode( '#', $req_uri );
					$req_uri       = $req_uri_array[0];

					$anchor_output = isset( $req_uri_array[1] ) ? '#' . $req_uri_array[1] : '';

					$home_path       = wp_parse_url( get_home_url(), PHP_URL_PATH );
					$home_path_regex = '';

					if ( is_string( $home_path ) && '' !== $home_path ) {
						$home_path       = trim( $home_path, '/' );
						$home_path_regex = sprintf( '|^%s|i', preg_quote( $home_path, '|' ) );
					}

					$pathinfo = isset( $_SERVER['PATH_INFO'] ) ? $_SERVER['PATH_INFO'] : '';
					list( $pathinfo ) = explode( '?', $pathinfo );
					$pathinfo = str_replace( '%', '%25', $pathinfo );

					$req_uri  = rawurldecode( str_replace( $pathinfo, '', $req_uri ) );
					$req_uri  = trim( $req_uri, '/' );
					$pathinfo = trim( $pathinfo, '/' );

					if ( ! empty( $home_path_regex ) ) {
						$req_uri  = preg_replace( $home_path_regex, '', $req_uri );
						$req_uri  = trim( $req_uri, '/' );
						$pathinfo = preg_replace( $home_path_regex, '', $pathinfo );
						$pathinfo = trim( $pathinfo, '/' );
					}

					if ( ! empty( $pathinfo ) && ! preg_match( '|^.*' . $wp_rewrite->index . '$|', $pathinfo ) ) {
						$request = $pathinfo;
					} else {
						// If the request uri is the index, blank it out so that we don't try to match it against a rule.
						if ( $req_uri === $wp_rewrite->index ) {
							$req_uri = '';
						}
						$request = $req_uri;
					}

					if ( ! $request || $blacklist_requests->is_blacklisted( $request ) ) {
						continue;
					}

					$request_match = $request;

					$permalink_query_vars = [];

					foreach ( (array) $rewrite as $match => $query ) {
						// If the requesting file is the anchor of the match, prepend it to the path info.
						if ( ( ! empty( $req_uri ) ) && ( strpos( $match, $req_uri ) === 0 ) && ( $req_uri !== $request ) ) {
							$request_match = $req_uri . '/' . $request;
						}

						if ( preg_match( "#^$match#", $request_match, $matches ) || preg_match( "#^$match#", urldecode( $request_match ), $matches ) ) {
							// Got a match.

							// Trim the query of everything up to the '?'.
							$query = preg_replace( '!^.+\?!', '', $query );

							// Substitute the substring matches into the query.
							$query = addslashes( WP_MatchesMapRegex::apply( $query, $matches ) );

							// Parse the query.
							parse_str( $query, $permalink_query_vars );

							break;
						}
					}

					$post_name     = false;
					$category_name = false;
					$tax_name      = false;

					if ( isset( $permalink_query_vars['pagename'] ) ) {
						$get_page_by_path = new WPML_Get_Page_By_Path( $wpdb, $sitepress, new WPML_Debug_BackTrace( null, 7 ) );
						$page_by_path     = $get_page_by_path->get( $permalink_query_vars['pagename'], $test_language );

						$post_name = $permalink_query_vars['pagename'];
						if ( ! empty( $page_by_path->post_type ) ) {
							$post_type = 'page';
						} else {
							$post_type = 'post';
						}
					} elseif ( isset( $permalink_query_vars['name'] ) ) {
						$post_name = $permalink_query_vars['name'];
						$post_type = 'post';
					} elseif ( isset( $permalink_query_vars['category_name'] ) ) {
						$category_name = $permalink_query_vars['category_name'];
					} elseif ( isset( $permalink_query_vars['p'] ) ) { // Case or /archives/%post_id.
						list( $post_type, $post_name ) = $wpdb->get_row(
							$wpdb->prepare( "SELECT post_type, post_name FROM {$wpdb->posts} WHERE id=%d", $permalink_query_vars['p'] ),
							ARRAY_N
						);
					} else {
						foreach ( $this->custom_post_query_vars as $query_vars_key => $query_vars_value ) {
							if ( isset( $permalink_query_vars[ $query_vars_value ] ) ) {
								$post_name = $permalink_query_vars[ $query_vars_value ];
								$post_type = $query_vars_key;
								break;
							}
						}
						foreach ( $this->taxonomies_query_vars as $query_vars_value ) {
							if ( isset( $permalink_query_vars[ $query_vars_value ] ) ) {
								$tax_name = $permalink_query_vars[ $query_vars_value ];
								$tax_type = $query_vars_value;
								break;
							}
						}
					}

					if ( $post_name && isset( $post_type ) ) {
						$get_page_by_path = new WPML_Get_Page_By_Path( $wpdb, $sitepress, new WPML_Debug_BackTrace( null, 7 ) );
						$p                = $get_page_by_path->get( $post_name, $test_language, OBJECT, $post_type );

						if ( empty( $p ) ) { // Fail safe.
							$switchLang = new WPML_Temporary_Switch_Language( $sitepress, $test_language );
							remove_filter( 'url_to_postid', array( $sitepress, 'url_to_postid' ) );
							$post_id = url_to_postid( $home_path . '/' . $post_name );
							add_filter( 'url_to_postid', array( $sitepress, 'url_to_postid' ) );
							$switchLang->restore_lang();

							if ( $post_id ) {
								$p = get_post( $post_id );
							}
						}

						if ( $p ) {
							$offsite_url = get_post_meta( $p->ID, '_cms_nav_offsite_url', true );
							if ( 'page' === $p->post_type && $offsite_url ) {
								$def_url = $this->get_regex_replacement_offline(
									$def_url,
									$offsite_url,
									$sitepress_settings['language_negotiation_type'],
									$lang,
									$dir_path,
									$home_url,
									$anchor_output
								);
							} elseif ( ! $this->is_pagination_in_post( $dir_path, $post_name ) ) {
								$collector
									? $collector->addItemByIdAndType( (int) $p->ID, 'post' )
									: null;
								$def_url = $this->get_regex_replacement(
									$def_url,
									'page' === $p->post_type ? 'page_id' : 'p',
									$p->ID,
									$sitepress_settings['language_negotiation_type'],
									$lang,
									$dir_path,
									$home_url,
									$url_parts,
									$req_uri_params,
									$anchor_output
								);
							}
						} else {
							$alp_broken_links[ $alp_matches[2][ $k ] ] = [];

							$name = wpml_like_escape( $post_name );
							$p    = $this->_get_ids_and_post_types( $name );
							if ( $p ) {
								foreach ( $p as $post_suggestion ) {
									if ( 'page' === $post_suggestion->post_type ) {
										$qvid = 'page_id';
									} else {
										$qvid = 'p';
									}
									$alp_broken_links[ $alp_matches[2][ $k ] ]['suggestions'][] = [
										'absolute' => '/' . ltrim( $url_parts['path'], '/' ) . '?' . $qvid . '=' . $post_suggestion->ID,
										'perma'    => '/' . ltrim( str_replace( site_url(), '', (string) get_permalink( $post_suggestion->ID ) ), '/' ),
									];
								}
							}
						}
					} elseif ( $category_name ) {
						if ( is_string( $category_name ) && false !== strpos( $category_name, '/' ) ) {
							$splits             = explode( '/', $category_name );
							$category_name      = array_pop( $splits );
							$category_parent    = array_pop( $splits );
							$category_parent_id = $wpdb->get_var( $wpdb->prepare( "SELECT term_id FROM {$wpdb->terms} WHERE slug=%s", $category_parent ) );
							$c                  = $wpdb->get_row( $wpdb->prepare( "SELECT t.term_id FROM {$wpdb->terms} t JOIN {$wpdb->term_taxonomy} x ON x.term_id=t.term_id AND x.taxonomy='category' AND x.parent=%d AND t.slug=%s", $category_parent_id, $category_name ) );
						} else {
							$c = $wpdb->get_row( $wpdb->prepare( "SELECT term_id FROM {$wpdb->terms} WHERE slug=%s", $category_name ) );
						}
						if ( $c ) {
							$collector
								? $collector->addItemByIdAndType( (int) $c->term_id, 'term' )
								: null;
							$def_url = $this->get_regex_replacement(
								$def_url,
								'cat_ID',
								$c->term_id,
								$sitepress_settings['language_negotiation_type'],
								$lang,
								$dir_path,
								$home_url,
								$url_parts,
								$req_uri_params,
								$anchor_output
							);
						} elseif ( isset( $name ) ) {
							$alp_broken_links[ $alp_matches[2][ $k ] ] = [];

							$c = $wpdb->get_results(
								$wpdb->prepare( "SELECT term_id FROM {$wpdb->terms} WHERE slug LIKE %s", [ $name . '%' ] )
							);
							if ( $c ) {
								foreach ( $c as $cat_suggestion ) {
									$perma = '/' . ltrim( str_replace( get_home_url(), '', get_category_link( $cat_suggestion->term_id ) ), '/' );

									$alp_broken_links[ $alp_matches[2][ $k ] ]['suggestions'][] = [
										'absolute' => '?cat_ID=' . $cat_suggestion->term_id,
										'perma'    => $perma,
									];
								}
							}
						}
					} elseif ( $tax_name && isset( $tax_type ) ) {
						$collector && is_string( $tax_name )
						? $collector->addItemByIdAndType(
							(int) $this->maybeStripParentTerm( $tax_name ),
							'term'
						)
						: null;
						$def_url = $this->get_regex_replacement(
							$def_url,
							$tax_type,
							$tax_name,
							$sitepress_settings['language_negotiation_type'],
							$lang,
							$dir_path,
							$home_url,
							$url_parts,
							$req_uri_params,
							$anchor_output
						);
					}
				}

				if ( ! empty( $def_url ) ) {
					$text = preg_replace( array_keys( $def_url ), array_values( $def_url ), $text );
				}

				$tx_qvs   = ! empty( $this->taxonomies_query_vars ) && is_array( $this->taxonomies_query_vars ) ? '|' . join( '|', $this->taxonomies_query_vars ) : '';
				$post_qvs = ! empty( $this->custom_posts_query_vars ) && is_array( $this->custom_posts_query_vars ) ? '|' . join( '|', $this->custom_posts_query_vars ) : '';
				$int      = preg_match_all( '@href=[\'"](' . rtrim( get_home_url(), '/' ) . '/?\?(p|page_id' . $tx_qvs . $post_qvs . ')=([0-9a-z-]+)(#.+)?)[\'"]@i', $text, $matches2 );
				if ( $int ) {
					$url_parts = wp_parse_url( rtrim( get_home_url(), '/' ) . '/' );
					$text      = preg_replace( '@href=[\'"](' . rtrim( get_home_url(), '/' ) . '/?\?(p|page_id' . $tx_qvs . $post_qvs . ')=([0-9a-z-]+)(#.+)?)[\'"]@i', 'href="/' . ltrim( $url_parts['path'], '/' ) . '?$2=$3$4"', $text );
				}
			}
		}

		if ( isset( $block_protector ) ) {
			$text = $block_protector->unProtect( $text );
		}

		WPML_Non_Persistent_Cache::set( $cache_key, $text, $cache_group );

		return $text;
	}

	private function get_home_url_with_no_lang_directory() {
		global $sitepress, $sitepress_settings;
		$sitepress_settings = $sitepress->get_settings();

		$home_url = rtrim( get_home_url(), '/' );
		if ( 1 === $sitepress_settings['language_negotiation_type'] ) {
			// Strip lang directory from end if it's there.
			$exp  = explode( '/', $home_url );
			$lang = end( $exp );

			if ( $this->does_lang_exist( $lang ) ) {
				$home_url = substr( $home_url, 0, strlen( $home_url ) - strlen( $lang ) );
			}
		}

		return $home_url;
	}

	private function does_lang_exist( $lang ) {
		return in_array( $lang, $this->active_languages, true );
	}

	public function _get_ids_and_post_types( $name ) {
		global $wpdb;
		static $cache = [];

		$name = rawurlencode( $name );
		if ( ! isset( $cache[ $name ] ) ) {
			$cache[ $name ] = $wpdb->get_results( $wpdb->prepare( "SELECT ID, post_type FROM {$wpdb->posts} WHERE post_name LIKE %s AND post_type IN('post','page')", $name . '%' ) );
		}

		return $cache[ $name ];
	}

	private function initialize_rewrite( $current_language, $default_language, $sitepress ) {
		global $wp_rewrite;

		$key     = $current_language . $default_language;
		$found   = false;
		$rewrite = WPML_Non_Persistent_Cache::get( $key, __CLASS__, $found );
		if ( $found ) {
			return $rewrite;
		}

		if ( ! isset( $wp_rewrite ) ) {
			require_once ABSPATH . WPINC . '/rewrite.php';
			// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			$wp_rewrite = new WP_Rewrite();
		}

		if ( $current_language === $default_language ) {
			$rewrite = $wp_rewrite->wp_rewrite_rules();
		} else {
			remove_filter( 'option_rewrite_rules', [ $sitepress, 'rewrite_rules_filter' ] );
			add_filter( 'wpml_st_disable_rewrite_rules', '__return_true' );

			$rewrite = $wp_rewrite->wp_rewrite_rules();

			remove_filter( 'wpml_st_disable_rewrite_rules', '__return_true' );
		}

		$rewrite = $this->all_rewrite_rules( $rewrite );
		WPML_Non_Persistent_Cache::set( $key, $rewrite, __CLASS__ );

		return $rewrite;
	}

	public function all_rewrite_rules( $rewrite ) {
		global $sitepress;

		if ( ! class_exists( 'WPML\ST\SlugTranslation\Hooks\Hooks' ) ) {
			return $rewrite;
		}

		$active_languages = $sitepress->get_active_languages();
		$current_language = $sitepress->get_current_language();
		$default_language = $sitepress->get_default_language();

		$cache_keys   = [ $current_language, $default_language ];
		$cache_keys[] = md5( (string) wp_json_encode( $active_languages ) );
		$cache_keys[] = md5( (string) wp_json_encode( $rewrite ) );
		$cache_key    = implode( ':', $cache_keys );
		$cache_group  = 'all_rewrite_rules';
		$cache_found  = false;

		$final_rules = WPML_Non_Persistent_Cache::get( $cache_key, $cache_group, $cache_found );

		if ( $cache_found ) {
			return $final_rules;
		}

		$final_rules = $rewrite;

		foreach ( $active_languages as $next_language ) {

			if ( $next_language['code'] === $default_language ) {
				continue;
			}

			$sitepress->switch_lang( $next_language['code'] );

			$translated_rules = ( new \WPML\ST\SlugTranslation\Hooks\HooksFactory() )->create()->filter( $final_rules );

			if ( is_array( $translated_rules ) && is_array( $final_rules ) ) {
				$new_rules = array_diff_assoc( $translated_rules, $final_rules );

				$final_rules = array_merge( $new_rules, $final_rules );
			}
		}

		$sitepress->switch_lang( $current_language );

		WPML_Non_Persistent_Cache::set( $cache_key, $final_rules, $cache_group );

		return $final_rules;

	}

	private function get_regex_replacement(
		$def_url,
		$type,
		$type_id,
		$lang_negotiation,
		$lang,
		$dir_path,
		$home_url,
		$url_parts,
		$req_uri_params,
		$anchor_output
	) {

		$type_id = $this->maybeStripParentTerm( $type_id );

		if ( 1 === $lang_negotiation && $lang ) {
			$langprefix = '/' . $lang;
		} else {
			$langprefix = '';
		}
		$perm_url = '(' . rtrim( $home_url, '/' ) . ')?' . $langprefix . '/' . str_replace( '?', '\?', $dir_path );
		$regk     = '@href=[\'"](' . self::escapePlusSign( $perm_url ) . ')[\'"]@i';
		$regv     = 'href="/' . ltrim( $url_parts['path'], '/' ) . '?' . $type . '=' . $type_id;
		if ( '' !== $req_uri_params ) {
			$regv .= '&' . $req_uri_params;
		}
		$regv .= $anchor_output . '"';

		$def_url[ $regk ] = $regv;

		return $def_url;
	}

	/**
	 * Split parent/child term slug and get only the last part.
	 *
	 * @see https://onthegosystems.myjetbrains.com/youtrack/issue/wpmlcore-7036
	 *
	 * If $typeId is a child term of some taxonomy, then it comes here as `parent/child'
	 * in next stages WordPress will use it in url like `?category=parent/child` and will try to resolve
	 * what category has slug `parent/child'. WordPress must actually try to find just `child` so the code
	 * below gets only last part of slash containing $typeId
	 *
	 * @param string $typeId Type slug.
	 *
	 * @return string
	 */
	private function maybeStripParentTerm( $typeId ) {
		return Lst::nth( -1, Str::split( '/', $typeId ) );
	}

	private function get_regex_replacement_offline(
		$def_url,
		$offsite_url,
		$lang_negotiation,
		$lang,
		$dir_path,
		$home_url,
		$anchor_output
	) {
		if ( 1 === $lang_negotiation && $lang ) {
			$langprefix = '/' . $lang;
		} else {
			$langprefix = '';
		}
		$perm_url = '(' . rtrim( $home_url, '/' ) . ')?' . $langprefix . '/' . str_replace( '?', '\?', $dir_path );
		$regk     = '@href=["\'](' . self::escapePlusSign( $perm_url ) . ')["\']@i';
		$regv     = 'href="' . $offsite_url . $anchor_output . '"';

		$def_url[ $regk ] = $regv;

		return $def_url;
	}

	/**
	 * @param string $url
	 *
	 * @return string
	 */
	private static function escapePlusSign( $url ) {
		return str_replace( '+', '\+', $url );
	}

	private function extract_lang_from_path( $sitepress_settings, $default_language, $dir_path ) {
		$lang = false;

		if ( 1 === $sitepress_settings['language_negotiation_type'] ) {
			$exp  = explode( '/', $dir_path, 2 );
			$lang = $exp[0];
			if ( $this->does_lang_exist( $lang ) ) {
				$dir_path = isset( $exp[1] ) ? $exp[1] : '';
			} else {
				$lang = false;
			}
		}

		return [ $lang, $dir_path ];
	}


	public function process_string( $st_id ) {
		global $wpdb;
		if ( $st_id ) {

			$table = $wpdb->prefix . 'icl_string_translations';

			$data         = $wpdb->get_row( $wpdb->prepare( "SELECT value, string_id, language FROM {$table} WHERE id=%d", $st_id ) );
			$string_value = $data->value;
			$string_type  = $wpdb->get_var( $wpdb->prepare( "SELECT type FROM {$wpdb->prefix}icl_strings WHERE id=%d", $data->string_id ) );

			if ( 'LINK' === $string_type ) {
				$string_value_up = $this->convert_url( $string_value, $data->language );
			} else {
				$string_value_up = $this->convert_text( $string_value );
			}

			if ( $string_value_up !== $string_value ) {
				$wpdb->update(
					$table,
					[
						'value'  => $string_value_up,
						'status' => ICL_STRING_TRANSLATION_COMPLETE,
					],
					[ 'id' => $st_id ]
				);
			}
		}
	}

	public function process_post( $post_id ) {
		global $wpdb, $sitepress;

		delete_post_meta( $post_id, '_alp_broken_links' );

		$post = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->posts} WHERE ID = %s", $post_id ) );

		$this_post_language = $sitepress->get_language_for_element( $post_id, 'post_' . $post->post_type );
		$current_language   = $sitepress->get_current_language();
		$sitepress->switch_lang( $this_post_language );

		$post_content = $this->convert_text( $post->post_content );

		$sitepress->switch_lang( $current_language );

		if ( $post_content !== $post->post_content ) {
			$wpdb->update( $wpdb->posts, [ 'post_content' => $post_content ], [ 'ID' => $post_id ] );
		}

		update_post_meta( $post_id, '_alp_processed', time() );
	}

	public function convert_text( $text, $ignore_blocks = true, CollectorInterface $collector = null ) {
		$alp_broken_links = [];

		return $this->_process_generic_text( $text, $alp_broken_links, $ignore_blocks, $collector );
	}

	public function convert_url( $url, $lang = null ) {
		global $sitepress;

		if ( $this->is_home( $url ) ) {
			$absolute_url = $sitepress->convert_url( $url, $lang );
		} else {

			$html         = '<a href="' . $url . '">removeit</a>';
			$html         = $this->convert_text( $html );
			$absolute_url = str_replace( [ '<a href="', '">removeit</a>' ], [ '', '' ], $html );
		}

		return $absolute_url;
	}

	public function is_home( $url ) {
		return untrailingslashit( get_home_url() ) === untrailingslashit( $url );
	}

	/**
	 * Check if the link is the pagination inside the post.
	 *
	 * @param string $url
	 * @param string $post_name
	 *
	 * @return bool
	 */
	private function is_pagination_in_post( $url, $post_name ) {
		$is_pagination_url_in_post = false !== mb_strpos( $url, $post_name . '/page/' );

		/**
		 * Check if the given URL is the pagination inside the post.
		 *
		 * @param bool $is_pagination_url_in_post
		 * @param string $url
		 * @param string $post_name
		 */
		return apply_filters( 'wpml_is_pagination_url_in_post', $is_pagination_url_in_post, $url, $post_name );
	}
}

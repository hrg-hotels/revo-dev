/* eslint no-useless-escape: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Vimeo Element View.
		FusionPageBuilder.fusion_youtube = FusionPageBuilder.ElementView.extend( {

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {

				this._refreshJs();
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values, atts.params );

				// Create attribute objects
				attributes.attr       = this.buildAttr( atts.values );

				// Any extras that need passed on.
				attributes.id              = atts.values.id;
				attributes.api_params      = atts.values.api_params;
				attributes.title_attribute = ! _.isEmpty( atts.values.title_attribute ) ? atts.values.title_attribute : 'YouTube video player ' + this.model.get( 'cid' );
				attributes.width           = atts.values.width;
				attributes.height          = atts.values.height;

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values, params ) {
				var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
					match;

				// Make videos 16:9 by default, values.width already set to params.width.
				if ( 'undefined' !== typeof params.width && '' !== params.width && ( 'undefined' === typeof params.height || '' === params.height ) ) {
					values.height = Math.round( params.width * 9 / 16 );
				}

				// values.height already set to params.height.
				if ( 'undefined' !== typeof params.height && '' !== params.height && ( 'undefined' === typeof params.width || '' === params.width ) ) {
					values.width = Math.round( params.height * 16 / 9 );
				}

				values.height = _.fusionValidateAttrValue( values.height, '' );
				values.width  = _.fusionValidateAttrValue( values.width, '' );

				// Make sure only the video ID is passed to the iFrame.
				match = values.id.match( regExp );
				if ( match && 11 === match[ 2 ].length ) {
					values.id = match[ 2 ];
				}

				if ( 'undefined' !== typeof values.loop && 'true' === values.loop ) {
					if ( -1 === values.api_params.indexOf( 'loop=1' ) ) {
						values.api_params += '&loop=1&playlist=' + values.id;
					}
				}

				if ( 'undefined' !== typeof values.controls && 'false' === values.controls ) {
					if ( -1 === values.api_params.indexOf( 'controls=0' ) ) {
						values.api_params += '&controls=0';
					}
				}

				if ( 'undefined' !== typeof values.start_time && '' !== values.start_time ) {
					if ( -1 === values.api_params.indexOf( 'start=' ) ) {
						values.api_params += '&start=' + values.start_time;
					}
				}

				if ( 'undefined' !== typeof values.end_time && '' !== values.end_time ) {
					if ( -1 === values.api_params.indexOf( 'end=' ) ) {
						values.api_params += '&end=' + values.end_time;
					}
				}

				values.margin_bottom = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_top    = _.fusionValidateAttrValue( values.margin_top, 'px' );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				// Attributes.
				var attrYoutube = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'fusion-video fusion-youtube',
					style: this.getStyleVars( values )
				} );

				if ( 'yes' === values.center ) {
					attrYoutube[ 'class' ] += ' center-video';
				}

				if ( '' !== values.alignment ) {
					attrYoutube[ 'class' ] += ' fusion-align' + values.alignment;
				}

				if ( 'true' == values.autoplay || 'yes' === values.autoplay ) {
					attrYoutube[ 'data-autoplay' ] = '1';
				}

				if ( values[ 'class' ] && '' !== values[ 'class' ] ) {
					attrYoutube[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.css_id ) {
					attrYoutube.id = values.css_id;
				}

				return attrYoutube;
			},

			getStyleVars: function( values ) {
				var cssVars,
					customCssVars = {};
				this.values = values;

				cssVars = [
					'margin_top',
					'margin_bottom'
				];

				if ( 'yes' !== values.center ) {
					customCssVars[ 'max-width' ]  = values.width + 'px';
					customCssVars[ 'max-height' ] = values.height + 'px';
				}

				if ( '' !== values.alignment ) {
					customCssVars.width = '100%';
				}

				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customCssVars );
			}
		} );
	} );
}( jQuery ) );

/**
 * Provides the behavior of all dropzone types.
 *
 * @author nmaerchy <nm@studer-raimann.ch>
 * @version 0.0.6
 */

var il = il || {};
il.UI = il.UI || {};
(function($, UI) {
	UI.dropzone = (function ($) {

		/**
		 * Contains all css classes used for dropzone manipulation.
		 * These classes MUST NOT have the . symbol at the beginning.
		 */
		var CSS = {
			"darkenedBackground": "modal-backdrop in", // <- bootstrap classes, should not be changed
			"darkenedDropzoneHighlight": "darkened-highlight",
			"defaultDropzoneHighlight": "default-highlight",
			"dropzoneDragHover": "drag-hover"
		};

		/**
		 * Contains all css selectors used for dropzone manipulation.
		 * Selectors MUST be declared like in css.
		 * e.g.
		 *  .this-is-a-class
		 *  #this-is-a-id
		 */
		var SELECTOR = {
			"darkenedBackground": "#il-dropzone-darkened",
			"dropzones": ".il-dropzone"
		};

		/**
		 * Contains all supported dropzone types.
		 * The type MUST be equal to the full qualified class name used in php.
		 * NOTE backslashes needs to be removed.
		 * e.g. ILIAS\UI\Component\Dropzone\Standard -> ILIASUIComponentDropzoneStandard
		 */
		var DROPZONE = {
			"standard": "ILIASUIComponentDropzoneStandard",
			"wrapper": "ILIASUIComponentDropzoneWrapper"
		};

		var _darkenedBackground = false;

		/**
		 * Initializes a dropzone depending on the passed in type with the passed in options.
		 *
		 * @param {string} type the type of the dropzone
		 *                      MUST be the full qualified class name.
		 * @param {Object} options possible settings for this dropzone
		 *                         Expected an object like this:
		 *                         {
		 *                             "id": ""
		 *                             "darkenedBackground": true
		 *                             "registeredSignals": [
		 *                                  "a_signal", "another_signal"
		 *                             ]
		 *                         }
		 */
		var initializeDropzone = function (type, options) {

			// disable default behavior of browsers for file drops
			$(document).on("dragenter dragstart dragend dragleave dragover drag drop", function (e) {
				e.preventDefault();
			});

			var settings = $.extend({
				// default settings
				registeredSignals: [],
				darkenedBackground: false
			}, options);

			if (settings.id === undefined) {
				throw new Error("Missing attribute id in parameter options: options.id not found");
			}

			_configureDarkenedBackground(settings.darkenedBackground);

			switch (type) {
				case DROPZONE.standard:
					_initStandardDropzone(settings);
					break;
				case DROPZONE.wrapper:
					break;
				default:
					throw new Error("Unsupported dropzone type found: " + type);
			}

		};

		/**
		 * Adds a html div to enable the darkened background, if the passed in argument is true.
		 * Sets the state of the darkened background availability to the value of the passed in argument.
		 *
		 * @param {boolean} darkenedBackground true, if the darkened background should be available
		 *
		 * @private
		 */
		var _configureDarkenedBackground = function (darkenedBackground) {

			_darkenedBackground = darkenedBackground;
			if (!$(SELECTOR.darkenedBackground).length && darkenedBackground) {
				$("body").prepend("<div id=" + SELECTOR.darkenedBackground.substring(1) + "></div>"); // <- str.substring(1) removes the # symbol used in css
			}
		};

		/**
		 * Enables the highlighting on all dropzones depending on the passed in argument.
		 * Does NOT affect the highlighting of a single dropzone on drag hover.
		 *
		 * @param {boolean} darkenedBackground true to use the darkened background for highlighting, otherwise false
		 *
		 * @private
		 */
		var _enableHighlighting = function (darkenedBackground) {

			if (darkenedBackground) {
				$(SELECTOR.darkenedBackground).addClass(CSS.darkenedBackground);
				$(SELECTOR.dropzones).addClass(CSS.darkenedDropzoneHighlight);
			} else {
				$(SELECTOR.dropzones).addClass(CSS.defaultDropzoneHighlight);
			}
		};

		/**
		 * Disables the highlighting of all dropzones.
		 * Does NOT affect the highlighting of a single dropzone on drag hover.
		 */
		var _disableHighlighting = function () {

			$(SELECTOR.darkenedBackground).removeClass(CSS.darkenedBackground);
			$(SELECTOR.dropzones).removeClass(CSS.darkenedDropzoneHighlight)
				.removeClass(CSS.defaultDropzoneHighlight);
		};

		/**
		 * Triggers all passed in signals with the passed in event.
		 *
		 * @param {Array} signalList all signals to trigger
		 * @param {Object} event the javascript event to trigger
		 *
		 * @private
		 */
		var _triggerSignals = function (signalList, event) {

			jQuery.each(signalList, function (signal) {
				$(this).trigger(signal, event);
			});
		};




		/*
		 * @private functions to initialize different types of dropzones -----------------------------------
		 *
		 * Every dropzone MUST have its own init function (improves code readability).
		 * The function for the appropriate dropzone is simply called in the switch statement
		 * from the {@link initializeDropzone} function.
		 */


		/**
		 *
		 * @param {Object} options possible settings for this dropzone
		 *                         @see {@link initializeDropzone}
		 *
		 * @private
		 */
		var _initStandardDropzone = function (options) {

			$("#" + options.id).dragster({

				enter: function (dragsterEvent, event) {
					$(this).addClass(CSS.dropzoneDragHover);
					_enableHighlighting(options.darkenedBackground);
				},
				leave: function (dragsterEvent, event) {
					$(this).removeClass(CSS.dropzoneDragHover);
					_disableHighlighting();
				},
				drop: function (dragsterEvent, event) {
					$(this).removeClass(CSS.dropzoneDragHover);
					_disableHighlighting();
					_triggerSignals(options.registeredSignals, event);
				}
			});
		};

		/**
		 *
		 * @param {Object} options possible settings for this dropzone
		 *                         @see {@link initializeDropzone}
		 *
		 * @private
		 */
		var _initWrapperDropzone = function (options) {



		};

		// --------------------------------------------------------------------------------------------------




		return {
			initializeDropzone: initializeDropzone
		};
	})($);
})($, il.UI);
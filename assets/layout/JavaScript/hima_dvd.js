
(function (window, document, $) {
	'use strict';

	/**
	 * Global variables
	 */
	var
		App,
		HIMABase,
		Accordion,
		SvgGraphics,
		Downloads,
		BrowserCheck,
		Ready;

	/**
	 * Document Ready Calls
	 */
	$(document).ready(function () {
		App.init();
	});

	$(window).load(function () {
		$(document).on('click', '.panel-heading', function (e) {
			$('.panel-group').removeClass('init');
			$('.panel').parent().removeClass('init');
		});
	});

	/**
	 * App: Base application which initializes all other stuff
	 * @type {Object}
	 */
	App = {
		init: function () {
			HIMABase.init();
			Accordion.init();
			Downloads.init();
			BrowserCheck.init();
			Ready.init();
		}
	};

	HIMABase = {
		init: function () {
		}
	};

	Ready = {
		init: function () {
			$('.dvd-page').addClass('ready');
			$('#downloadsDataTable').DataTable().columns.adjust().draw();
		}
	};

	Downloads = {
		init: function () {
			if (typeof srcData !== 'undefined') {
				var resourcesPath = 'assets/layout/';
				if(window.location.hostname){
					resourcesPath = '/typo3conf/ext/tsr_downloads2dvd/Resources/Public/DvdPage/';
				}

				var onlineBaseUrl = $('#onlineBaseUrl').data('url');
				var downloadsDataTable = $('#downloadsDataTable').DataTable( {
					data: srcData.response.docs,
					order: [[ 2, 'asc' ]],
					language: dataTablesLanguage,
					columns: [
						{
							name: "download",
							data: "dvd_path_stringS",
							defaultContent: "",
							width: "0px",
							orderable: false,
							render: function ( data, type, row ) {
								var offlineLink = '.' + data;
								var fileExtension = offlineLink.split('.').pop().toLowerCase();
								var downloadIcon = '<span class="icon pdf"> <a href="' + offlineLink + '" title="Download" target="_blank"><img loading="lazy" class="svg" src="' + resourcesPath + 'Images/icons/downloads/filetype_' + fileExtension + '.svg"></a></span>';
								return downloadIcon;
							}
						},
						{
							name: "download_online",
							data: "filePublicUrl",
							defaultContent: "",
							width: "0px",
							orderable: false,
							render: function ( data, type, row ) {
								var onlineLink = onlineBaseUrl +  data;
								var downloadIcon = '<span class="icon pdf"><a href="' + onlineLink + '" title="Download online" target="_blank"><img loading="lazy" class="svg" width="24" height="24" src="' + resourcesPath + 'Images/icons/downloads/hima_icon_download_extern_grey.svg"></a></span>';
								return downloadIcon;
							}
						},
						{
							name: "filetitle",
							data: "filetitle_stringS",
							defaultContent: "",
							render: function ( data, type, row ) {
								return data ? data : row.title;
							}
						},
						{
							name: "last_modified",
							data: "last_modified_intS",
							orderData: 3,
							width: "150px",
							defaultContent: "",
							render: function ( data, type, row ) {
								var tstamp = parseInt(data);
								var lastModifiedDate = '';
								if(tstamp > 0) {
									var date = new Date(tstamp * 1000);
									lastModifiedDate = (date.getDate() + 100).toString().substring(1,3) + '.' + (date.getMonth() + 101).toString().substring(1,3) + '.' + date.getFullYear();
								}
								return lastModifiedDate;
							}
						},
						{
							name: "last_modified_int",
							data: "last_modified_intS",
							defaultContent: "0",
							visible: false
						},
						{
							name: "category_product",
							data: "category_product_stringM",
							defaultContent: "",
							orderable: true,
							render: function ( data, type, row ) {
								return data ? data.join(', ') : '';
							},
							selectContainerSelector: '.category-product-selector'
						},
						{
							name: "category_language",
							data: "category_language_stringM",
							defaultContent: "",
							orderable: true,
							render: function ( data, type, row ) {
								return data ? data.join(', ') : '';
							}
						},
						{
							name: "category_type_of_documents",
							data: "category_type_of_documents_stringM",
							defaultContent: "",
							orderable: false,
							render: function ( data, type, row ) {
								return data ? data.join(', ') : '';
							},
							visible: false
						},
						{
							name: "category_industries",
							data: "category_industries_stringM",
							defaultContent: "",
							orderable: false,
							render: function ( data, type, row ) {
								return data ? data.join(', ') : '';
							},
							visible: false
						},
						{
							name: "category_solution",
							data: "category_solution_stringM",
							defaultContent: "",
							orderable: false,
							render: function ( data, type, row ) {
								return data ? data.join(', ') : '';
							},
							visible: false
						},
						{
							name: "content",
							data: "content",
							defaultContent: "",
							orderable: false,
							visible: false
						},
						{
							name: "title",
							data: "title",
							defaultContent: "",
							orderable: false,
							visible: false
						}
					],
					initComplete: function () {
						$('#filters').html('');
						this.api().columns([5,6,7,8,9]).every( function () {
							var column = this;
							var title = column.header().innerText;
							var select = $('<span class="filter"><h3>' + title + '</h3><select class="selectpicker" data-width="fit"></select></span>')
								.appendTo( $('#filters') )
								.find('select').on( 'change', function () {
									var val = $.fn.dataTable.util.escapeRegex(
										$(this).val()
									);

									column
										.search( val ? '(^|,| )'+val+'(,|$| )' : '', true, false )
										.draw();
								} );

							select.append( '<option value="">' + dataTablesLanguage.labels.all + '</option>' );

							var columnsData = column.data().unique().sort();
							var optionsData = [""];
							columnsData.each( function ( d, j ) {
								if(Array.isArray(d)) {
									$(d).each( function ( i, e ) {
										optionsData.push(e);
									});
								} else {
									optionsData.push(d);
								}
							});
							var uniqueOptions = optionsData.filter(function(elem, pos) {
								return optionsData.indexOf(elem) == pos;
							});
							uniqueOptions = uniqueOptions.sort();
							$(uniqueOptions).each( function ( i, e) {
								if(e) {
									select.append( '<option value="'+e+'">'+e+'</option>' )
								}
							} );
						} );

						$('.selectpicker').selectpicker(
							{
								noneSelectedText: dataTablesLanguage.labels.all
							}
						);
						$('[name="downloadsDataTable_length"]').selectpicker({});
					}
				});

				$('#downloadsSearchField').keyup(function(){
					downloadsDataTable.search($(this).val()).draw() ;
				});

				$('.downloads-form form').submit(function(e){
					e.preventDefault();
					downloadsDataTable.search($('#downloadsSearchField').val()).draw() ;
				});
			}
		}
	};

	Accordion = {
		init: function () {

			var accordionTab = $('.btn-accordion');

			if (accordionTab.length > 0) {
				var tabList = accordionTab.closest('[role="tablist"]');
				tabList.addClass('panel-group');
			}

			var accordion = $('.panel-group'),
				accordionPanel = accordion.find('.panel');

			if (!accordion.length && accordionPanel.length) {
				accordionPanel.parent().addClass('init');
			}

			accordionTab.removeClass('btn-default');

			if (accordionPanel.length > 0) {

				var $firstPanel = accordionPanel.eq(0);
				var $panelWrapper = $firstPanel.closest('.col-xs-12');
				if (!$panelWrapper.hasClass('push-xl-2')) {
					$panelWrapper.addClass('col-xl-8 push-xl-2');
				}

				accordionPanel.each(function (index, element) {
					var p = $(element).parent();
					var id = p.attr('id');
					if (id.startsWith('accordion-')) {
						p.addClass('init');
					}
					$(element).find('.panel-heading a').addClass('collapsed');
				});

				$('.panel-body .ce-textpic').each(function (index, element) {
					var pic = $(element).find('.ce-media');

					if (!pic.length) {
						$(element).removeClass('ce-left');
					}
					$(element).closest('.col-xs-12').removeClass('col-xl-8').removeClass('push-xl-2').addClass('p-t-1');
				});
			}

			var panelContent = accordion.find('.panel-collapse'),
				openPanel = accordion.find('.panel-collapse.in');

			if (openPanel.length > 0) {
				openPanel.prev('.panel-heading').addClass('active')
					.find('a').removeClass('collapsed').attr('aria-expanded', 'true');
				openPanel.closest('.panel-group').removeClass('init');
			}

			if (panelContent.length > 0) {
				panelContent.on('show.bs.collapse', function (e) {
					$('.collapse.in').each(function () {
						$(this).collapse('hide');
					});

					if ($('.tx-tsraccordioniconlisting').length > 0) {
						$('.tx-tsraccordioniconlisting .panel-heading').removeClass('active');
						$(this).prev('.panel').find('.panel-heading').addClass('active');
					}
					else if ($('#solr-accordion-downloads').length > 0) {
						$(this).prevAll("div.panel-heading:first").addClass('active');
					}
					else {
						$(this).siblings('.panel-heading').addClass('active');
					}

				});

				$('.panel-collapse').on('hide.bs.collapse', function () {
					$(this).siblings('.panel-heading').removeClass('active');
				});

				var $panelcollapse = $('.panel-collapse .wrapper .container .col-xs-12.col-xl-8.push-xl-2');
				if ($('.panel-collapse .tx-tsriconlisting').length) {
					$panelcollapse.removeClass('col-xl-8 push-xl-2');
					$panelcollapse.addClass('col-xl-10 push-xl-1');
				} else {
					$panelcollapse.removeClass('push-xl-2');
					$panelcollapse.addClass('push-xl-1');
				}
			}

			// active panel in viewport
			accordion.on('shown.bs.collapse', function () {
				var offset = $(this).find('.collapse.in').prev('.panel-heading');
				if (offset.length > 0) {
					$('html,body').animate({
						scrollTop: $(offset).offset().top - 200
					}, 200);
				}
			});
		}
	};

	SvgGraphics = {
		init: function () {
			/* Replace all SVG images with inline SVG */
			$('img.svg').each(function () {
				var $img = $(this),
					imgID = $img.attr('id'),
					imgClass = $img.attr('class'),
					imgURL = $img.attr('src');

				$.get(imgURL, function (data) {
					var $svg = $(data).find('svg');

					if (typeof imgID !== 'undefined') {
						$svg = $svg.attr('id', imgID);
					}
					if (typeof imgClass !== 'undefined') {
						$svg = $svg.attr('class', imgClass + ' replaced-svg');
					}
					$svg = $svg.removeAttr('xmlns:a');

					// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
					if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
						$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
					}
					$img.replaceWith($svg);
				}, 'xml');
			});
		}
	};

	BrowserCheck = {
		init: function () {
			// Opera 8.0+
			var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

			// Firefox 1.0+
			var isFirefox = typeof InstallTrigger !== 'undefined';

			// Safari 3.0+ "[object HTMLElementConstructor]"
			var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
				return p.toString() === "[object SafariRemoteNotification]";
			})(!window['safari'] || safari.pushNotification);

			// Internet Explorer 6-11
			var isIE = /*@cc_on!@*/false || !!document.documentMode;

			// Edge 20+
			var isEdge = !isIE && !!window.StyleMedia;

			// Chrome 1+
			var isChrome = !!window.chrome && !!window.chrome.webstore;

			// Blink engine detection
			var isBlink = (isChrome || isOpera) && !!window.CSS;

			var htmlElement = $('html');

			if (isOpera) {
				htmlElement.addClass('browser-opera');
			}
			if (isFirefox) {
				htmlElement.addClass('browser-firefox');
			}
			if (isSafari) {
				htmlElement.addClass('browser-safari');
			}
			if (isIE) {
				htmlElement.addClass('browser-ie');
			}
			if (isEdge) {
				htmlElement.addClass('browser-edge');
			}
			if (isChrome) {
				htmlElement.addClass('browser-chrome');
			}
			if (isBlink) {
				htmlElement.addClass('browser-blink');
			}
		}
	};

})(window, window.document, window.jQuery);

// Avoid `console` errors in browsers that lack a console.
(function () {
	var method;
	var noop = function () {
	};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

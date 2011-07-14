/*!
 * jQuery Gridy - A Grid Plugin - http://wbotelhos.com/gridy
 * ---------------------------------------------------------------------------------
 *
 * jQuery Gridy is a plugin that generates a highly customizable grid automatically.
 *
 * Licensed under The MIT License
 *
 * @version         0.2.0 beta
 * @since           06.03.2011
 * @author          Washington Botelho dos Santos
 * @documentation   wbotelhos.com/gridy
 * @twitter         twitter.com/wbotelhos
 * @license         opensource.org/licenses/mit-license.php MIT
 * @package         jQuery Plugins
 *
 * Usage with default values:
 * ---------------------------------------------------------------------------------
 * $('#gridy').gridy({ url: 'url/gridy' });
 *
 * <div id="gridy"></div>
 *
 * <script id="template" type="text/x-jquery-tmpl">
 *    <div>
 *       <div>${name}</div>
 *       <div>${email}</div>
 *
 *       <div class="button">
 *          <a href="#">like</a>
 *       </div>
 *    </div>
 * </script>
 *
 */

;(function($) {

	var methods = {
		init: function(settings) {
			
		}, getSize: function(size) {
			return (isNaN(parseInt(size))) ? size : size + 'px';
		}, getNumber: function(number) {
			return (number < 10) ? '0' + number : number;
		}, getError: function(xhr) {
			return (xhr.responseText) ? xhr.responseText.substring(xhr.responseText.indexOf('(') + 1, xhr.responseText.indexOf(')')) : xhr.statusText;
		}, getNumber: function(number) {
			return (number < 10) ? '0' + number : number;
		}, debug: function(message) {
			if (window.console && window.console.log) {
				window.console.log(message);
			}
		}
	};

	$.fn.gridy = function(settings) {

		if (this.length == 0) {
			methods.debug('Selector invalid or missing!');
			return;
		} else if (this.length > 1) {
			return this.each(function() {
				$.fn.gridy.apply($(this), [settings]);
			});
		}

		var opt					= $.extend({}, $.fn.gridy.defaults, settings),
			id					= this.attr('id'),
			$this				= $(this),
			$currentPage		= $('<input id="current-page" type="hidden" value="' + opt.page + '"/>').appendTo($this),
			$currentSortName	= $('<input id="current-sort-name" type="hidden" value="' + opt.sortName + '"/>').appendTo($this),
			$currentSortOrder	= $('<input id="current-sort-order" type="hidden" value="' + opt.sortOrder + '"/>').appendTo($this);

		if (id === undefined) {
			id = 'gridy-' + $this.index();
			$this.attr('id', id); 
		}

		$this.addClass(opt.templateStyle).data('options', opt);

		var $searchField	= null,
			$searchButton	= null;

		if (opt.searchOption) {
			var $searchWrapper = $('<div class="search"/>').appendTo($this);

			$searchField = $('<input id="key" type="text" size="35" maxlength="40" value="' + ((opt.search == '') ? opt.searchText : opt.search) + '" title="' + opt.searchText + '"/>').appendTo($searchWrapper);

			$searchField.blur(function() {
				if ($searchField.val() == '') {
					$searchField.removeClass('typed').val(opt.searchText);
				}
			}).focus(function() {
				if ($searchField.val() == opt.searchText) {
					$searchField.addClass('typed').val('');
				}
			}).keypress(function(evt) {
				if ((evt.keyCode ? evt.keyCode : evt.which) == 13) {
					listGridy(1, $currentSortName.val(), $currentSortOrder.val());
				}
			});

			$searchButton = $('<input type="button" value="search" title="consultar"/>').appendTo($searchWrapper);

			$searchButton.click(function() {
				listGridy(1, $currentSortName.val(), $currentSortOrder.val());
			});
		}

		var $sortBar		= null,
			$sorterItems	= null;

		if (opt.sortersName.length > 0) {
			var sortContent = '',
				sortItem	= '',
				sortLabel	= '';

			for (var i = 0; i < opt.sortersName.length; i++) {
				sortItem = opt.sortersName[i][0];
				sortLabel = opt.sortersName[i][1];

				sortContent +=
						'<div class="sorter-item">' +
							'<div class="' + opt.arrowNone + '"></div>' +
							'<a id="sort-by-' + sortItem + '" href="javascript:void(0);" name="' + sortItem + '" rel="desc">' + sortLabel + '</a>' +
						'</div>';
			}

			$sortBar = $('<div class="sorter-bar"/>').css('width', methods.getSize(opt.sorterWidth)).html(sortContent).appendTo($this);
			$sorterItems = $sortBar.children('div.sorter-item').delegate('a', 'click', sortGridyFunction);
		}

		function sortGridyFunction() {
			sortGridy($(this));
		};

		function changeSortIndicator(_sortLink, _sortOrder, _sortIcon, _isResetIcon) {
			var $sortWrapper	= _sortLink.parent().parent(),
				isHeader		= opt.headersName.length > 0 && $sortWrapper.attr('class') == 'header';

			if (_isResetIcon) {
				var $links = $sortWrapper.find('a.sorted').attr('rel', 'desc').removeClass('sorted');

				$links = (isHeader) ? $links.next('div') : $links.prev('div');

				$links.removeClass().addClass('arrow-none');
			}

			_sortLink.attr('rel', _sortOrder).addClass('sorted');

			var $sortIcon = (isHeader) ? _sortLink.next('div') : _sortLink.prev('div');

			$sortIcon.removeClass().addClass(_sortIcon);
		};

		function sortGridy(_clickedLink) {
			var sortName		= _clickedLink.attr('name'),
				sortOrder		= _clickedLink.attr('rel'),
				nextSortOrder	= (sortOrder == 'desc') ? 'asc' : 'desc',
				sortIcon		= (sortOrder == 'desc') ? 'arrow-up' : 'arrow-down',
				isResetIcon		= _clickedLink.parent().parent().find('a.sorted').length > 0;

			changeSortIndicator(_clickedLink, nextSortOrder, sortIcon, isResetIcon);

			listGridy($currentPage.val(), sortName, nextSortOrder);
		};

		if (opt.sortersName.length > 0) {
			var $sortInit = $('div.sorter-bar a#sort-by-' + opt.sortName);

			if (!$sortInit.length) {
				opt.sortName = opt.sortersName[0][0];
				$sortInit = $('div.sorter-bar a#sort-by-' + opt.sortName);
			}

			var sortIcon	= (opt.sortOrder == 'asc') ? 'arrow-up' : 'arrow-down',
				isResetIcon	= false;

			changeSortIndicator($sortInit, opt.sortOrder, sortIcon, isResetIcon);
		}

		var $loading = null;

		if (opt.loadingOption) {
			$loading = $('<div class="' + opt.loadingIcon + '"><div>' + opt.loadingText + '</div></div>').appendTo($this).children();
		}

		var $result = null;

		if (opt.resultOption) {
			$result = $('<div class="result"/>').appendTo($this);
		}

		var $header			= null,
			$headerItems	= null;

		if (opt.headersName.length > 0) {
			$header = $('<div class="header"/>').appendTo($this);

			var $head		= null,
				$sortLink	= null,
				sortName	= '',
				sortLabel	= '';

			if (opt.headersWidth.length <= 0) {
				if (opt.colsWidth.length > 0) {
					opt.headersWidth = opt.colsWidth;
				} else {
					methods.debug(id + ': headersWith and colsWidth attributes invalid or missing!');
					return;
				}
			}

			for (var i = 0; i < opt.headersName.length; i++) {
				sortName = opt.headersName[i][0];
				sortLabel = opt.headersName[i][1];

				$sortLink = $('<a/>', { href: 'javascript:void(0);', html: sortLabel });

				$head = $('<div class="head-item"/>');

				if (sortName) {
					$sortLink.attr({ id: 'sort-by-' + sortName, name: sortName, rel: 'desc' });

					var $sortIcon = $('<div/>', { 'class': opt.arrowNone });

					$head.append($sortLink, $sortIcon);
				} else {
					$sortLink.attr('class', 'no-sort');
					$head.append($sortLink);
				}

				if (opt.headersName[i][2]) {
					$head.addClass(opt.headersName[i][2]);
				}

				$head.css('width', opt.headersWidth[i]).appendTo($header);
			}

			$headerItems = $header.children().delegate('a:not(".no-sort")', 'click', sortGridyFunction);

			var $sortInit = $('div.header a#sort-by-' + opt.sortName);

			if (!$sortInit.length) {
				opt.sortName = opt.headersName[0][0];
				$sortInit = $('div.header a#sort-by-' + opt.sortName);
			}

			var sortIcon	= (opt.sortOrder == 'asc') ? 'arrow-up' : 'arrow-down',
				isResetIcon	= false;

			changeSortIndicator($sortInit, opt.sortOrder, sortIcon, isResetIcon);
		}

		var $content = $('<div class="content"/>').css({ 'height': methods.getSize(opt.height), 'width': methods.getSize(opt.width) }).appendTo($this);

		function startLoading(isStart) {
			if (opt.loadingOption) {
				if (isStart) {
					$loading.fadeIn('fast');
					$content.addClass('fade');
				} else {
					$loading.fadeOut();
					$content.removeClass('fade');
				}
			}
		};

		function showNoResult() {
			if (opt.noResultOption) {
				$content.html('<p class="no-result">' + opt.noResultText + '</p>');
	
				if (opt.resultOption) {
					$result.html($result.html().replace(/\d+/g, '--'));
				}
	
				if (opt.searchOption) {
					$searchField.focus().select();
				}
			}
		};

		var $footerBar = null;

		if (opt.findsName.length > 0 || opt.rowsName.length > 0  || opt.messageOption) {
			$footerBar = $('<div class="footer"/>').css('width', methods.getSize(opt.width)).appendTo($this);
		}

		var $findBox = null;

		if (opt.findsName.length > 0 || opt.headersName.length > 0 || opt.sortersName.length > 0) {
			$findBox = $('<div class="find-option"><select></select></div>').appendTo($footerBar).children();

			var hasItem		= false,
				options		= '',
				findItem	= '',
				findLabel	= '';

			if (opt.findsName.length == 0) {
				opt.findsName = (opt.headersName.length > 0) ? opt.headersName : opt.sortersName;
			}

			opt.find = opt.findsName[0][0];

			for (var i = 0; i < opt.findsName.length; i++) {
				findItem = opt.findsName[i][0];
				findLabel = opt.findsName[i][1];

				options += '<option value="' + findItem + '">' + findLabel + '</option>';

				if (findItem == opt.find) {
					hasItem = true;
				}
			}

			if (!hasItem) {
				$findBox.html('<option value="' + opt.find + '" checked="checked">' + opt.find + '</option>');
			}

			$findBox.append(options).val(opt.find).change().change(function(index, value) {
				if (opt.searchFocus) {
					$searchField.focus();
				}
			})
			.children('option[value="' + opt.find +  '"]').attr('checked', 'checked');
		} else {
			if (opt.find) {
				opt.findsName.push(opt.find);
			} else {
				methods.debug(id + ': find attribute invalid or missing!');
				return;
			}
		}

		var $rowBox = null;

		if (opt.rowsName.length > 0 ) {
			$rowBox = $('<div class="row-option"><select></select></div>').appendTo($footerBar).children();

			var rows		= (opt.rows < 1) ? 1 : opt.rows,
				hasNumber	= false,
				options		= '',
				number		= '';

			for (var i = 0; i < opt.rowsName.length; i++) {
				number = opt.rowsName[i];

				if (number == rows) {
					hasNumber = true;
				}

				options += '<option value="' + number + '">' + methods.getNumber(number) + '</option>';
			}

			if (!hasNumber) {
				$rowBox.html('<option value="' + rows + '" checked="checked">' + methods.getNumber(rows) + '</option>');
			}

			$rowBox.append(options).val(rows).change().change(function(index, value) {
				listGridy(1, $currentSortName.val(), $currentSortOrder.val());
			})
			.children('option[value="' + rows +  '"]').attr('checked', 'checked');
		}

		if (opt.searchTarget) {
			$searchField.parent().appendTo(opt.searchTarget);
		}

		if (opt.findTarget) {
			$findBox.parent().appendTo(opt.findTarget);
		}

		if (opt.rowsTarget) {
			$rowBox.parent().appendTo(opt.rowsTarget);
		}		

		var $buttons = null;
		
		if (opt.buttonOption) {
			$buttons = $('<div class="buttons"/>').css('width', methods.getSize(opt.buttonsWidth)).appendTo($this);
		}

		var $message = null;

		if (opt.messageOption) {
			$message = $('<div class="message"/>').appendTo($footerBar);
		}

		function showMessage(message) {
			if (opt.messageOption) {
				$message.html(message).show();

				setTimeout(function() {
					$message.fadeOut();
				}, opt.messageTimer);
			}
		};

		listGridy(opt.page, opt.sortName, opt.sortOrder);

		function enableGrid(isEnable) {
			if (isEnable) {
				if (opt.searchOption) {
					$searchField.removeAttr('readonly');
					$searchButton.removeAttr('disabled');
				}

				if (opt.sortersName.length > 0) {
					$sorterItems.delegate('a', 'click', sortGridyFunction);
					$headerItems.delegate('a:not(".no-sort")', 'click', sortGridyFunction);
				}

				if (opt.buttonOption) { $buttons.children().removeAttr('disabled'); }
				if (opt.findsName.length > 0) { $findBox.removeAttr('disabled'); }
				if (opt.rowsName.length > 0 ) { $rowBox.removeAttr('disabled'); }
			} else {
				if (opt.searchOption) {
					$searchField.attr('readonly', 'readonly');
					$searchButton.attr('disabled', 'disabled');
				}

				if (opt.sortersName.length > 0) {
					$sorterItems.undelegate('a', 'click');
					$headerItems.undelegate('a:not(".no-sort")', 'click');
				}

				if (opt.buttonOption) { $buttons.children().attr('disabled', 'disabled'); }
				if (opt.findsName.length > 0) { $findBox.attr('disabled', 'disabled'); }
				if (opt.rowsName.length > 0 ) { $rowBox.attr('disabled', 'disabled'); }
			}
		};

		function processCallback(wrapper, page, sortName, sortOrder, selectedRows) {
			if (typeof(wrapper) == 'string') {
				wrapper = $.parseJSON(wrapper);
			}

			if (opt.before) {
				var callback = opt.before.apply($this, [wrapper, page, sortName, sortOrder]);

				if (callback) {
					wrapper = callback;
				}
			}

			if (wrapper.total == 0) {
				showNoResult();
				enableGrid(true);
				return;
			} else {
				if (opt.sortersName.length > 0) {
					$sortBar.show();
				}
			}

			var entityList	= wrapper.entityList;

			$content.html($('#' + opt.template).tmpl(entityList));

			if (opt.colsWidth) {
				$content.children('div').addClass('row').each(function() {
					$(this).children('div').addClass('column').each(function(index) {
						$(this).width(opt.colsWidth[index]);
					});
				});
			}

			var rest		= wrapper.total % selectedRows,
				totalPage	= (wrapper.total - rest) / selectedRows;

			if (rest > 0) {
				totalPage++;
			};

			if (opt.resultOption) {
				var resultText = opt.resultText.replace(/{from}/, methods.getNumber(page)).replace(/{to}/, methods.getNumber(totalPage)).replace(/{total}/, methods.getNumber(wrapper.total));

				$result.html(resultText);
			}

			enableGrid(true);

			if (opt.buttonOption) {
				if (wrapper.total > selectedRows) {
					var buttons	= '',
						number	= 0;

					for (var i = 1; i <= totalPage; i++) {
						number = methods.getNumber(i);
						buttons += '<input type="button" value="' + number + '" alt="' + number + '" title="' + opt.buttonTitle + ' ' + number + '"/>&nbsp;';
					}

					$buttons.html(buttons).children().click(function() {
						listGridy(parseInt(this.alt, 10), $currentSortName.val(), $currentSortOrder.val());
					});
				} else {
					$buttons.empty();
				}

				$('input[value="' + methods.getNumber(page) + '"]').attr('disabled', 'disabled').addClass('active');
			}

			$currentPage.val(page);
			$currentSortName.val(sortName);
			$currentSortOrder.val(sortOrder);
		};

		function listGridy(page, sortName, sortOrder) {
			enableGrid(false);
			startLoading(true);

			var key				= opt.search,
				selectedRows	= (opt.rowsName.length > 0 ) ? $rowBox.val() : opt.rows,
				selectedFind	= (opt.findsName.length > 0) ? $findBox.val() : opt.find;

			if (opt.searchOption) {
				key = ($searchField.val() == opt.searchText) ? '' : $searchField.val();

				if (opt.searchFocus) {
					$searchField.focus();
				}
			}

			if (opt.data != null) {
				processCallback(opt.data, page, sortName, sortOrder);
				return;
			}

			if (opt.debug) {
				methods.debug('query string: key=' + key + '&page=' + page + '&sortName=' + sortName + '&sortOrder=' + sortOrder + '&find=' + selectedFind + '&rows=' + selectedRows + opt.params);
			}

			$.ajax({
				cache:			opt.cache,
				contentType:	opt.contentType,
				dataType:		opt.dataType,
				jsonp:			opt.jsonp,
				jsonpCallback:	opt.jsonpCallback,
				type:			opt.type,
				url:			opt.url,
				data:			'key=' + key + '&page=' + page + '&sortName=' + sortName + '&sortOrder=' + sortOrder + '&find=' + selectedFind + '&rows=' + selectedRows + opt.params,
				success: function(wrapper) {
					processCallback(wrapper, page, sortName, sortOrder, selectedRows);

					var scrollSufix = (opt.scroll) ? '-scroll' : '';

					if (opt.hoverFx) {
						$content.children().mouseenter(function() {
							$(this).addClass('item-hover' + scrollSufix);
						}).mouseleave(function() {
							$(this).removeClass('item-hover' + scrollSufix);
						});
					}

					if (opt.clickFx) {
						$content.children().click(function(evt) {
							var $this = $(this);

							if (!evt.shiftKey) {
								$this.parent().children('div.item-active' + scrollSufix).removeClass('item-active' + scrollSufix);
							}

							$this.toggleClass('item-active' + scrollSufix);
						});
					}

					if (opt.success) {
						opt.success();
					}
				}, error: function(xhr, status, error) {
					showMessage(methods.getError(xhr));

					if (opt.error) {
						opt.error();
					}
				}, complete: function() {
					startLoading(false);

					if (opt.scroll) {
						if (opt.height == 'auto') {
							methods.debug(id + ': height attribute missing!');
						}

						$content
						.css({ 'border': '1px solid #BBB', 'overflow': 'auto' })
							.children('div').addClass('scroll')
						.end()
							.children('div:last').css('border-bottom-color', '#FFF');
					}

					if (opt.complete) {
						opt.complete();
					}
				}
			});
		};

		return $this;
	};

	$.fn.gridy.defaults = {
		arrowDown:		'arrow-down',
		arrowNone:		'arrow-none',
		arrowUp:		'arrow-up',
		before:			null,
		buttonOption:	true,
		buttonTitle:	'page',
		buttonsWidth:	'auto',
		cache:			false,
		clickFx:		false,
		colsWidth:		[],
		complete:		null,
		contentType:	'application/x-www-form-urlencoded; charset=utf-8',
		dataType:		'json',
		debug:			false,
		error: 			null,
		find:			'',
		findsName:		[],
		findTarget:		null,
		headersName:	[],
		headersWidth:	[],
		height:			'auto',
		hoverFx:		false,
		jsonp:			false,
		jsonpCallback:	'callback',
		loadingIcon:	'loading',
		loadingOption:	true,
		loadingText:	'Loading...',
		messageOption:	true,
		messageTimer:	4000,
		noResultOption:	true,
		noResultText:	'No items found!',
		page:			1,
		params: 		'',
		resultOption:	true,
		resultText:		'Displaying {from} - {to} of {total} items',
		rows:			10,
		rowsName:		[5, 10, 25, 50, 100],
		rowsTarget:		null,
		search:			'',
		searchFocus:	true,
		searchOption:	true,
		searchTarget:	null,
		searchText:		'',
		scroll:			false,
		sortersName:	[],
		sorterWidth:	'auto',
		sortName:		'id',
		sortOrder:		'asc',
		success:		null,
		template:		'template',
		templateStyle:	'gridy-default',
		type:			'get',
		url:			'/gridy',
		width:			'auto'
	};

})(jQuery);
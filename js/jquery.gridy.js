/*!
 * jQuery Gridy - A Grid Plugin - http://wbotelhos.com/gridy
 * ---------------------------------------------------------------------------------
 *
 * jQuery Gridy is a plugin that generates a highly customizable grid automatically.
 *
 * Licensed under The MIT License
 *
 * @version         0.1.0
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

		var $sortBar	= null,
			$sortItems	= null;

		if (opt.sortOption && opt.sortList.length > 0) {
			var sortContent = '',
				sortItem	= '';

			for (var i = 0; i < opt.sortList.length; i++) {
				sortItem = opt.sortList[i];

				sortContent +=
						'<div class="sort-item">' +
							'<div class="' + opt.arrowNone + '"></div>' +
							'<a id="sort-by-' + sortItem + '" href="javascript:void(0);" name="' + sortItem + '" rel="desc">' + sortItem + '</a>' +
						'</div>';
			}

			$sortBar = $('<div class="sort-bar"/>').css('width', methods.getSize(opt.sortWidth)).html(sortContent).appendTo($this);
			$sortItems = $sortBar.children('div.sort-item');

			$sortItems.delegate('a', 'click', sortGridyFunction);
		}

		function sortGridyFunction() {
			sortGridy($(this));
		};

		function changeSortIndicator(_sortLink, _sortOrder, _sortIcon, _isClearIcon) {
			if (_isClearIcon) {
				$sortBar.find('a.sorted').attr('rel', 'desc').removeClass('sorted').prev('div').removeClass().addClass('arrow-none');
			}

			_sortLink.attr('rel', _sortOrder).addClass('sorted').prev('div').removeClass().addClass(_sortIcon);
		};

		function sortGridy(_clickedLink) {
			var sortName		= _clickedLink.attr('name'),
				sortOrder		= _clickedLink.attr('rel'),
				nextSortOrder	= (sortOrder == 'desc') ? 'asc' : 'desc',
				sortIcon		= (sortOrder == 'desc') ? 'arrow-up' : 'arrow-down',
				isClearIcon		= $sortBar.find('a.sorted').length > 0;

			changeSortIndicator(_clickedLink, nextSortOrder, sortIcon, isClearIcon);

			listGridy($currentPage.val(), sortName, nextSortOrder);
		};

		if (opt.sortOption && opt.sortList.length > 0) {
			var $sortInit = $('a#sort-by-' + opt.sortName);

			if (!$sortInit.length) {
				opt.sortName = opt.sortList[0];
				$sortInit = $('a#sort-by-' + opt.sortName);
			}

			var sortIcon	= (opt.sortOrder == 'asc') ? 'arrow-up' : 'arrow-down',
				isClearIcon	= false;

			changeSortIndicator($sortInit, opt.sortOrder, sortIcon, isClearIcon);
		}

		var $loading = null;

		if (opt.loadingOption) {
			$loading = $('<div class="' + opt.loadingIcon + '"><div>' + opt.loadingText + '</div></div>').appendTo($this).children();
		}

		var $result = null;

		if (opt.resultOption) {
			$result = $('<div class="result"/>').appendTo($this);
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

		if (opt.findOption || opt.rowsOption || opt.messageOption) {
			$footerBar = $('<div class="footer"/>').css('width', methods.getSize(opt.width)).appendTo($this);
		}

		var $findBox = null;

		if (opt.findOption) {
			$findBox = $('<div class="find-option"><select></select></div>').appendTo($footerBar).children();

			var hasName		= false,
				options		= '',
				name		= '';

			if (opt.findList.length == 0 && opt.sortList.length > 0) {
				opt.findList = opt.sortList;
				opt.find = opt.sortList[0];
			} else if (opt.findList.length > 0) {
				opt.find = opt.findList[0];
			}

			for (var i = 0; i < opt.findList.length; i++) {
				name = opt.findList[i];

				options += '<option value="' + name + '">' + name + '</option>';

				if (name == opt.find) {
					hasName = true;
				}
			}

			if (!hasName) {
				$findBox.html('<option value="' + opt.find + '" checked="checked">' + opt.find + '</option>');
			}

			$findBox.append(options).val(opt.find).change().change(function(index, value) {
				if (opt.searchFocus) {
					$searchField.focus();
				}
			})
			.children('option[value="' + opt.find +  '"]').attr('checked', 'checked');
		}

		var $rowBox = null;

		if (opt.rowsOption) {
			$rowBox = $('<div class="row-option"><select></select></div>').appendTo($footerBar).children();

			var rows		= (opt.rows < 1) ? 1 : opt.rows,
				hasNumber	= false,
				options		= '',
				number		= '';

			for (var i = 0; i < opt.rowsList.length; i++) {
				number = opt.rowsList[i];

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

		function prevent(evt) {
			console.log('sdfasdf');
			evt.preventDefault();
		};

		function enableGrid(isEnable) {
			if (isEnable) {
				if (opt.searchOption) {
					$searchField.removeAttr('readonly');
					$searchButton.removeAttr('disabled');
				}

				if (opt.sortOption) {
					$sortItems.delegate('a', 'click', sortGridyFunction);
				}

				if (opt.buttonOption) { $buttons.children().removeAttr('disabled'); }
				if (opt.findOption) { $findBox.removeAttr('disabled'); }
				if (opt.rowsOption) { $rowBox.removeAttr('disabled'); }
			} else {
				if (opt.searchOption) {
					$searchField.attr('readonly', 'readonly');
					$searchButton.attr('disabled', 'disabled');
				}

				if (opt.sortOption) { $sortItems.undelegate('a', 'click'); }
				if (opt.buttonOption) { $buttons.children().attr('disabled', 'disabled'); }
				if (opt.findOption) { $findBox.attr('disabled', 'disabled'); }
				if (opt.rowsOption) { $rowBox.attr('disabled', 'disabled'); }
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
				if (opt.sortOption && opt.sortList.length > 0) {
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
				selectedRows	= (opt.rowsOption) ? $rowBox.val() : opt.rows,
				selectedFind	= (opt.findOption) ? $findBox.val() : opt.find;

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
		find:			'id',
		findList:		[],
		findOption:		true,
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
		rowsList:		[5, 10, 25, 50, 100],
		rowsOption:		true,
		search:			'',
		searchFocus:	true,
		searchOption:	true,
		searchText:		'',
		scroll:			false,
		sortList:		[],
		sortName:		'id',
		sortOption:		true,
		sortOrder:		'asc',
		sortWidth:		'auto',
		success:		null,
		template:		'template',
		templateStyle:	'gridy-default',
		type:			'get',
		url:			'/gridy',
		width:			'auto'
	};

})(jQuery);
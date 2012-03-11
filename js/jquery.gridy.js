/*!
 * jQuery Gridy - A Grid Plugin - http://wbotelhos.com/gridy
 * -----------------------------------------------------------------------------------
 *
 * jQuery Gridy is a plugin that generates a highly customizable grid using templates.
 *
 * Licensed under The MIT License
 *
 * @version        0.3.0 (Development)
 * @since          2011.06.03
 * @author         Washington Botelho
 * @documentation  wbotelhos.com/gridy
 * @twitter        twitter.com/wbotelhos
 *
 * Usage with default values:
 * -----------------------------------------------------------------------------------
 * $('#grid').gridy({ url: '/gridy' });
 *
 * <div id="grid"></div>
 *
 * <script id="template" type="text/x-jquery-tmpl">
 *    <div>
 *       <div>${name}</div>
 *       <div>${email}</div>
 *    </div>
 * </script>
 *
 */

;(function($) {

	var methods = {
		init: function(settings) {
			return this.each(function() {

				var self	= this,
					$this	= $(self);

				self.opt = $.extend(true, {}, $.fn.gridy.defaults, settings);

				$this.empty().data('settings', self.opt);

				var id 					= $this.attr('id'),
					$this				= $this.width(methods.getSize.call(self, self.opt.width)).wrap('<div id="' + id + '-wrapper">'),
					$wrapper			= $this.parent().width(methods.getSize.call(self, self.opt.width)),
					$currentPage		= $('<input type="hidden" name="page" value="' + self.opt.page + '"/>').insertBefore($this),
					$currentSortName	= $('<input type="hidden" name="sortName" value="' + self.opt.sortName + '"/>').insertBefore($this),
					$currentSortOrder	= $('<input type="hidden" name="sortOrder" value="' + self.opt.sortOrder + '"/>').insertBefore($this);

				var isTable = self.opt.style == 'table';

				if (isTable) {
					$this.attr('cellspacing', 0).parent().addClass(self.opt.skin + '-table');
				} else {
					$this.parent().addClass(self.opt.skin);
				}

				var $search			= undefined,
					$searchField	= undefined,
					$searchButton	= undefined;

				if (self.opt.searchOption) {
					$search = $('<div class="gridy-search"><div class="gridy-search-content"></div></div>').insertBefore($this);

					if (self.opt.resize) {
						$search.width(methods.getSize.call(self, self.opt.width));
					}

					$searchField = $('<input type="text" name="search" value="' + ((self.opt.search == '') ? self.opt.searchText : self.opt.search) + '" title="' + self.opt.searchText + '" size="40" />').appendTo($search.children());

					$searchField.blur(function() {
						if ($searchField.val() == '') {
							$searchField.removeClass('gridy-typed').val(self.opt.searchText);
						}
					}).focus(function() {
						if ($searchField.val() == self.opt.searchText) {
							$searchField.addClass('gridy-typed').val('');
						}
					}).keypress(function(evt) {
						if ((evt.keyCode ? evt.keyCode : evt.which) == 13) {
							listGridy(1, $currentSortName.val(), $currentSortOrder.val(), $this);
						}
					});

					$searchButton = $('<input type="button" value="' + self.opt.searchButtonLabel + '" title="' + self.opt.searchButtonTitle + '"/>').appendTo($search.children());

					$searchButton.click(function() {
						listGridy(1, $currentSortName.val(), $currentSortOrder.val(), $this);
					});
				}

				var hasHeader = self.opt.headersName.length > 0;

				function changeSortIndicator(clickedLink, sortOrder, sortIcon, isResetIcon) {
					var $sortWrapper	= clickedLink.parent().parent(),
						isHeader		= hasHeader && $sortWrapper.attr('class') == 'gridy-header';

					if (isResetIcon) {
						var $sortedLink = $sortWrapper.find('a.gridy-sorted').attr('rel', 'desc').removeClass('gridy-sorted');

						$sortedLink = (isHeader) ? $sortedLink.next('div') : $sortedLink.prev('div');

						$sortedLink.removeClass().addClass(self.opt.arrowNone);
					}

					clickedLink.attr('rel', sortOrder).addClass('gridy-sorted');

					var $sortIcon = (isHeader) ? clickedLink.next('div') : clickedLink.prev('div');

					$sortIcon.removeClass().addClass(sortIcon);
				};

				var $sortBar		= undefined,
					$sorterItems	= undefined;

				if (self.opt.sortersName.length > 0) {
					var sorterContent	= '',
						sorterItem		= '',
						sorterLabel		= '';

					for (var i = 0; i < self.opt.sortersName.length; i++) {
						sorterItem = self.opt.sortersName[i][0];
						sorterLabel = self.opt.sortersName[i][1];

						sorterContent +=
								'<div class="gridy-sorter-item">' +
									'<div class="' + self.opt.arrowNone + '"></div>' +
									'<a id="sort-by-' + sorterItem + '" href="javascript:void(0);" name="' + sorterItem + '" rel="desc">' + sorterLabel + '</a>' +
								'</div>';
					}

					$sortBar = $('<div class="gridy-sorter-bar"/>').width(methods.getSize.call(self, self.opt.sorterWidth)).html(sorterContent).appendTo($this);

					$sorterItems = $sortBar.children().children('a').click(sortGridyFunction);

					var $sortInit = $sorterItems.find('a#sort-by-' + self.opt.sortName);

					if ($sortInit.length) {
						var sortIcon	= (self.opt.sortOrder == 'asc') ? self.opt.arrowUp : self.opt.arrowDown,
							isResetIcon	= false;
			
						changeSortIndicator($sortInit, self.opt.sortOrder, sortIcon, isResetIcon);
					}
				}

				function sortGridyFunction() {
					sortGridy($(this), $this);
				};

				function sortGridy(clickedLink, context) {
					var sortName		= clickedLink.attr('name'),
						sortOrder		= clickedLink.attr('rel'),
						nextSortOrder	= (sortOrder == 'desc') ? 'asc' : 'desc',
						sortIcon		= (sortOrder == 'desc') ? self.opt.arrowUp : self.opt.arrowDown,
						isResetIcon		= clickedLink.parent().parent().find('a.gridy-sorted').length > 0;

					changeSortIndicator(clickedLink, nextSortOrder, sortIcon, isResetIcon);

					listGridy($currentPage.val(), sortName, nextSortOrder, context);
				};

				var $status = undefined;

				if (self.opt.loadingOption || self.opt.resultOption) {
					$status = $('<div class="gridy-status"/>').insertBefore($this);

					if (self.opt.resize) {
						$status.width(methods.getSize.call(self, self.opt.width));
					}
				}

				var $loading = undefined;

				if (self.opt.loadingOption) {
					$loading = $('<div class="' + self.opt.loadingIcon + '"><div>' + self.opt.loadingText + '</div></div>').appendTo($status).children();
				}

				var $result = undefined;

				if (self.opt.resultOption) {
					$result = $('<div class="gridy-result"/>').appendTo($status);
				}

				var $header			= undefined,
					$headerItems	= undefined;

				if (hasHeader) {
					var $head		= undefined,
						$sortLink	= undefined,
						headName	= '',
						headLabel	= '';

					if (isTable) {
						$header = $('<thead class="gridy-header"/>').appendTo($this);
					} else {
						$header = $('<div class="gridy-header"/>').appendTo($this);

						if (self.opt.resize) {
							$header.width(methods.getSize.call(self, self.opt.width));
						}
					}

					if (self.opt.headersWidth.length <= 0) {
						if (self.opt.colsWidth.length > 0) {
							self.opt.headersWidth = self.opt.colsWidth;
						} else {
							$.error(id + ': headersWith and colsWidth options are invalid or missing!');
						}
					}

					for (var i = 0; i < self.opt.headersName.length; i++) {
						headName = self.opt.headersName[i][0];
						headLabel = self.opt.headersName[i][1];

						$sortLink = $('<a/>', { href: 'javascript:void(0);', html: headLabel });

						if (isTable) {
							$head = $('<th class="gridy-head-item"/>');
						} else {
							$head = $('<div class="gridy-head-item"/>');
						}

						if (headName) {
							$sortLink.attr({ id: 'sort-by-' + headName, name: headName });

							var $sortIcon = $('<div/>', { 'class': self.opt.arrowNone });

							$head.append($sortLink, $sortIcon);
						} else {
							$sortLink.attr('class', 'gridy-no-sort');
							$head.append($sortLink);
						}

						if (self.opt.headersName[i][2]) {
							$head.addClass(self.opt.headersName[i][2]);
						}

						if (isTable) {
							$head.attr('width', self.opt.headersWidth[i]);
						} else {
							$head.width(self.opt.headersWidth[i]);
						}

						$head.appendTo($header);
					}

					$headerItems = $header.children().children('a:not(".gridy-no-sort")').click(sortGridyFunction);

					var $sortInit = $header.find('#sort-by-' + self.opt.sortName);

					if ($sortInit.length) {
						var sortIcon	= (self.opt.sortOrder == 'asc') ? self.opt.arrowUp : self.opt.arrowDown,
							isResetIcon	= false;

						changeSortIndicator($sortInit, self.opt.sortOrder, sortIcon, isResetIcon);
					}
				}

				var $content = undefined;

				if (isTable) {
					$content = $('<tbody class="gridy-content"/>');
				} else {
					$content = $('<div class="gridy-content"/>').css({ 'height': methods.getSize.call(self, self.opt.height), 'width': methods.getSize.call(self, self.opt.width) });
				}

				$content.appendTo($this);

				function startLoading(isStart) {
					if (self.opt.loadingOption) {
						if (isStart) {
							$loading.fadeIn('fast');
							$content.addClass('gridy-fade');
						} else {
							$loading.fadeOut();
							$content.removeClass('gridy-fade');
						}
					}
				};

				function showNoResult() {
					if (self.opt.noResultOption) {
						$content.html('<p class="gridy-no-result">' + self.opt.noResultText + '</p>');
			
						if (self.opt.resultOption) {
							$result.html($result.html().replace(/\d+/g, '0'));
						}

						if (self.opt.searchOption) {
							$searchField.focus().select();
						}
					}
				};

				var $footer = undefined;

				if (self.opt.rowsNumber.length > 0  || self.opt.messageOption || (self.opt.findsName.length > 0 && !self.opt.searchOption)) {
					$footer = $('<div class="gridy-footer"/>').appendTo($wrapper);

					if (self.opt.resize) {
						$footer.width(methods.getSize.call(self, self.opt.width));
					}
				}

				var $findBox = undefined;

				if (self.opt.findsName.length > 0) {
					$findBox = $('<div class="gridy-find-option"><select></select></div>').appendTo((self.opt.searchOption) ? $search.children() : $footer).children();

					var hasItem		= false,
						options		= '',
						findItem	= '',
						findLabel	= '';

					for (var i = 0; i < self.opt.findsName.length; i++) {
						findItem = self.opt.findsName[i][0];
						findLabel = self.opt.findsName[i][1];

						options += '<option value="' + findItem + '">' + findLabel + '</option>';

						if (findItem == self.opt.find) {
							hasItem = true;
						}
					}

					if (!hasItem) {
						$findBox.html('<option value="' + self.opt.find + '" checked="checked">' + self.opt.find + '</option>');
					}

					$findBox.append(options).val(self.opt.find).change().change(function(index, value) {
						if (self.opt.searchOption && self.opt.searchFocus) {
							$searchField.focus();
						}
					})
					.children('option[value="' + self.opt.find +  '"]').attr('checked', 'checked');
				}

				var $rowsBox = undefined;

				if (self.opt.rowsNumber.length > 0 ) {
					$rowsBox = $('<div class="gridy-row-option"><select></select></div>').appendTo($footer).children();

					var rows		= (self.opt.rows < 1) ? 1 : self.opt.rows,
						hasNumber	= false,
						options		= '',
						number		= '';

					for (var i = 0; i < self.opt.rowsNumber.length; i++) {
						number = self.opt.rowsNumber[i];

						if (number == rows) {
							hasNumber = true;
						}

						options += '<option value="' + number + '">' + methods.getNumber.call(self, number) + '</option>';
					}

					if (!hasNumber) {
						$rowsBox.html('<option value="' + rows + '" checked="checked">' + methods.getNumber.call(self, rows) + '</option>');
					}

					$rowsBox.append(options).val(rows).change().change(function(index, value) {
						listGridy(1, $currentSortName.val(), $currentSortOrder.val(), $this);
					})
					.children('option[value="' + rows +  '"]').attr('checked', 'checked');
				}

				if (self.opt.searchTarget) {
					$search.appendTo(self.opt.searchTarget);
				}

				if (self.opt.findTarget) {
					if (self.opt.findsName.length <= 0) {
						$.error(id + ': you need set the \'findsName\' option for findOption box be created!');
					}

					$findBox.parent().appendTo(self.opt.findTarget);
				}

				if (self.opt.rowsTarget) {
					$rowsBox.parent().appendTo(self.opt.rowsTarget);
				}		

				var $buttons = undefined;

				if (self.opt.buttonOption) {
					$buttons = $('<div class="gridy-buttons"><div class="gridy-buttons-content"></div></div>').appendTo($wrapper);

					if (self.opt.resize) {
						$buttons.width(methods.getSize.call(self, self.opt.width));
					}

					$buttons = $buttons.children();
				}

				var $message = undefined;

				if (self.opt.messageOption) {
					$message = $('<div class="gridy-message"/>').appendTo($footer);
				}

				function showMessage(message) {
					if (self.opt.messageOption) {
						$message.html(message).show();

						setTimeout(function() {
							$message.fadeOut(function() {
								$message.empty().hide();
							});
						}, self.opt.messageTimer);
					}
				};

				listGridy(self.opt.page, self.opt.sortName, self.opt.sortOrder, $this);

				function enableGrid(isEnable) {
					if (isEnable) {
						if (self.opt.searchOption) {
							$searchField.removeAttr('readonly');
							$searchButton.removeAttr('disabled');
						}

						if (self.opt.sortersName.length > 0) {
							$sorterItems.children('a').click(sortGridyFunction);
							$headerItems.children('a:not(".gridy-no-sort")').click(sortGridyFunction);
						}

						if (self.opt.buttonOption) { $buttons.children(':not(".gridy-button-reticence")').removeAttr('disabled'); }
						if (self.opt.findsName.length > 0) { $findBox.removeAttr('disabled'); }
						if (self.opt.rowsNumber.length > 0 ) { $rowsBox.removeAttr('disabled'); }
					} else {
						if (self.opt.searchOption) {
							$searchField.attr('readonly', 'readonly');
							$searchButton.attr('disabled', 'disabled');
						}

						if (self.opt.sortersName.length > 0) {
							$sorterItems.children('a').die('click');
							$headerItems.children('a:not(".gridy-no-sort")').die('click');
						}

						if (self.opt.buttonOption) { $buttons.children().attr('disabled', 'disabled'); }
						if (self.opt.findsName.length > 0) { $findBox.attr('disabled', 'disabled'); }
						if (self.opt.rowsNumber.length > 0 ) { $rowsBox.attr('disabled', 'disabled'); }
					}
				};

				function processCallback(data, page, sortName, sortOrder, selectedRows) {
					if (typeof(data) == 'string') {
						data = $.parseJSON(data);
					}

					if (self.opt.before) {
						var callback = self.opt.before.call($this, data, page, sortName, sortOrder);

						if (callback) {
							data = callback;
						}
					}

					var total = eval('data.' + self.opt.totalPath);

					if (total == 0) {
						showNoResult();
						$buttons.empty();
						$rowsBox.hide();
						enableGrid(true);
						return;
					}
					
					if (self.opt.sortersName.length > 0) {
						$sortBar.show();
					}

					var list		= eval('data.' + self.opt.listPath),
						$rows		= undefined,
						$columns	= undefined;

					$content.html($('#' + self.opt.template).tmpl(list));

					if (self.opt.evenOdd) {
						$content
							.children(':even').addClass((self.opt.scroll) ? 'gridy-even-scroll' : 'gridy-even')
						.end()
							.children(':odd').addClass((self.opt.scroll) ? 'gridy-odd-scroll' : 'gridy-odd');
					}

					if (self.opt.colsWidth) {
						$rows = $content.children(); // div|tr

						if (!isTable) {
							$rows.addClass('gridy-row');
						}

						$rows.each(function() {
							$columns = $(this).children();

							if (!isTable) {
								$columns.addClass('gridy-column');
							}

							$columns.each(function(index) { // div|td
								if (isTable) {
									$(this).attr('width', self.opt.colsWidth[index]);
								} else {
									$(this).width(self.opt.colsWidth[index]);
								}
							});
						});
					}

					var rest		= total % selectedRows,
						totalPage	= (total - rest) / selectedRows;

					if (rest > 0) {
						totalPage++;
					}

					if (self.opt.resultOption) {
						var resultText = self.opt.resultText.replace('{from}', methods.getNumber.call(self, page)).replace('{to}', methods.getNumber.call(self, totalPage)).replace('{total}', methods.getNumber.call(self, total));

						$result.html(resultText);
					}

					if (self.opt.buttonOption) {
						if (total > selectedRows) {
							var buttonEmpty	= '<input type="button" value="..." disabled="disabled" class="gridy-button-reticence"/>&#160;',
								buttons		= '',
								number		= 0,
								rangePage	= undefined,
								start		= 1,
								buttonMax	= (self.opt.buttonPageNumber) ? self.opt.buttonMax : 0,
								isEven		= (self.opt.buttonMax % 2 == 0);

							if (buttonMax > totalPage) {
								buttonMax = totalPage;
							}

							if (isEven && self.opt.buttonPageNumber) {
								rangePage	= Math.ceil(buttonMax / 2);
								start		= page - rangePage + 1;
							} else {
								rangePage	= Math.floor(buttonMax / 2);
								start		= page - rangePage;
							}

							var end = parseInt(page, 10) + rangePage;

							if (start == 0) {
								end++;
								start = 1;
							}

							if (start < 0) {
								end += Math.abs(start) + 1; // + 1 is the button 0.
								start = 1;
							}

							if (end > totalPage) {
								if (start > 1) {
									if (start === (end - totalPage)) {
										start = 1;
									} else {
										start -= (end - totalPage);
									}
								} 

								end = totalPage;
							}

							var	hasExceeded			= totalPage > buttonMax,
								hasBackNavigation	= hasExceeded && page > ((isEven && self.opt.buttonPageNumber) ? rangePage : rangePage + 1),
								hasNextNavigation	= hasExceeded && page < (totalPage - rangePage);

							if (hasBackNavigation) {
								buttons = '<input type="button" value="&lsaquo;" alt="' + self.opt.buttonBackTitle + '" title="' + self.opt.buttonBackTitle + '" class="gridy-back"/>&#160;';
								
								if (self.opt.buttonPageNumber) {
									buttons += buttonEmpty;
								}
							}

							for (var i = start; i <= end; i++) {
								number = methods.getNumber.call(self, i);
								buttons += '<input type="button" value="' + number + '" alt="' + number + '" title="' + self.opt.buttonTitle + ' ' + number + '"/>&#160;';
							}

							if (hasNextNavigation) {
								if (self.opt.buttonPageNumber) {
									buttons += buttonEmpty;
								}

								buttons += '<input type="button" value="&rsaquo;" alt="' + self.opt.buttonNextTitle + '" title="' + self.opt.buttonNextTitle + '" class="gridy-next"/>&#160;';
							}

							$buttons.html(buttons);

							if (self.opt.buttonPageNumber) {
								$buttons.children(':not(".gridy-back, .gridy-reticence, .gridy-next")').click(function() {
									listGridy(parseInt(this.alt, 10), $currentSortName.val(), $currentSortOrder.val(), $this);
								});
							}

							if (hasBackNavigation) {
								$buttons.children('.gridy-back').click(function() {
									listGridy(page - 1, $currentSortName.val(), $currentSortOrder.val(), $this);
								});
							}

							if (hasNextNavigation) {
								$buttons.children('.gridy-next').click(function() {
									listGridy(page + 1, $currentSortName.val(), $currentSortOrder.val(), $this);
								});
							}
						} else {
							$buttons.empty();
						}

						$('input[value="' + methods.getNumber.call(self, page) + '"]').attr('disabled', 'disabled').addClass('gridy-button-active');
					}

					$currentPage.val(page);
					$currentSortName.val(sortName);
					$currentSortOrder.val(sortOrder);
				};

				function listGridy(page, sortName, sortOrder, context) {
					enableGrid(false);
					startLoading(true);

					var search			= self.opt.search,
						selectedRows	= (self.opt.rowsNumber.length > 0) ? $rowsBox.show().val() : self.opt.rows,
						selectedFind	= (self.opt.findsName.length > 0) ? $findBox.val() : self.opt.find;

					if (self.opt.searchOption) {
						search = ($searchField.val() == self.opt.searchText) ? '' : $searchField.val();

						if (self.opt.searchFocus) {
							$searchField.focus();
						}
					}

					if (self.opt.data) {
						processCallback(self.opt.data, page, sortName, sortOrder);
						return;
					}

					var data = {
						search:		search,
						page:		page,
						sortName: 	sortName,
						sortOrder:  sortOrder,
						find:		selectedFind,
						rows:		selectedRows
					};

					for (var prop in self.opt.params) {
						data[prop] = self.opt.params[prop];
				    }

					for (var prop in self.opt.paramsElements) {
						var elem = self.opt.paramsElements[prop];

						$(elem).each(function(i) {
							var $this = $(this);

							if ($this.is(':enabled') && !$this.is(':checkbox') || $this.is(':checked')) {

								if (elem.indexOf('.') == 0) {
									var param = data[this.name],
										items = [];

									if (param) {
										for (var i in param) {
											items.push(param[i]);
										}
									}

									items.push(this.value);

									data[this.name] = items;				
								} else {
									data[this.name] = this.value;
								}
							}
						});
					}

					if (self.opt.debug) {
						var queryString = '[debug] query string:\n\n',
							propSpace	,
							i			;

						for (var prop in data) {
							propSpace = prop;

							for (i = 0; i < (20 - prop.length); i++) {
								propSpace += ' ';
							}

							queryString += propSpace + ': \'' + data[prop] + '\'\n';
						}

						if (window.console && window.console.log) {
							window.console.log(queryString);
						}
					}

					$.ajax({
						cache			: self.opt.cache,
						contentType		: self.opt.contentType,
						dataType		: self.opt.dataType,
						jsonp			: self.opt.jsonp,
						jsonpCallback	: self.opt.jsonpCallback,
						type			: self.opt.type,
						url				: self.opt.url,
						data			: data,
						success			: function(data, textStatus, jqXHR) {
							processCallback(data, page, sortName, sortOrder, selectedRows);

							var scrollSufix = (self.opt.scroll) ? '-scroll' : '';

							if (self.opt.hoverFx) {
								$content.children().mouseenter(function() {
									$(this).addClass('gridy-row-hovered' + scrollSufix);
								}).mouseleave(function() {
									$(this).removeClass('gridy-row-hovered' + scrollSufix);
								});
							}

							if (self.opt.clickFx) {
								$content.children().click(function(evt) {
									var $this = $(this);

									if (!evt.shiftKey) {
										$this.parent().children('.gridy-row-selected' + scrollSufix).removeClass('gridy-row-selected' + scrollSufix);
									}

									$this.toggleClass('gridy-row-selected' + scrollSufix);
								});
							}

							if (self.opt.success) {
								self.opt.success.call(context, data, textStatus, jqXHR);
							}
						}, error: function(jqXHR, textStatus, errorThrown) {
							showMessage(methods.getError.call(self, jqXHR));

							if (self.opt.error) {
								self.opt.error.call(context, jqXHR, textStatus, errorThrown);
							}
						}, complete: function(jqXHR, textStatus) {
							startLoading(false);
							enableGrid(true);

							if (self.opt.scroll) {
								if (self.opt.height == 'auto') {
									throw id + ': height attribute missing!';
								}

								if (isTable) {
									var $this	= $content.parent(),
										width	= methods.getSize.call(self, self.opt.width + 15);

									$this.wrap('<div id="' + id + '-wrapper" />')
										.parent().addClass('gridy-scroll-wrapper').css({ 'height': methods.getSize.call(self, self.opt.height), 'width': width })
									.end()
									.clone(true).removeAttr('id').width(width) 
										.find('tbody').remove()
									.end()
									.insertBefore($this.parent());

									$this.children('thead').remove();
								} else {
									$content.addClass('gridy-scroll-wrapper').children().addClass('gridy-scroll');
								}
							} else {
								if (self.opt.separate) {
									var $firstLine = $content.children(':first').not('p');
			
									if (isTable) {
										$firstLine = $firstLine.children();
									}

									$firstLine.addClass('gridy-separate');
								}
							}

							if (isTable) {
								$content.children(':last').children().addClass('gridy-last-line');
							}

							if (self.opt.complete) {
								self.opt.complete.call(context, jqXHR, textStatus);
							}
						}
					});
				};
			});
		}, getSize: function(size) {
			return (isNaN(parseInt(size, 10))) ? size : size + 'px';
		}, getNumber: function(number) {
			return (number < 10) ? '0' + number : number;
		}, getError: function(xhr) {
			return (xhr.responseText) ? xhr.responseText.substring(xhr.responseText.indexOf('(') + 1, xhr.responseText.indexOf(')')) : xhr.statusText;
		}, getNumber: function(number) {
			return (number < 10) ? '0' + number : number;
		}, reload: function() {
			methods.set.call(this, {});
		}, set: function(settings) {
			return this.each(function() {
				var $this	= $(this),
					$parent = $this.parent();

				$this.insertBefore($parent);

				$parent.remove();

				$this.gridy($.extend(true, {}, $this.data('settings'), settings));
			});
		}
	};

	$.fn.gridy = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist!');
		}
	};

	$.fn.gridy.defaults = {
		arrowDown			: 'gridy-arrow-down',
		arrowNone			: 'gridy-arrow-none',
		arrowUp				: 'gridy-arrow-up',
		before				: undefined,
		buttonBackTitle		: '&lsaquo; Back',
		buttonMax			: 10,
		buttonNextTitle		: 'Next &rsaquo;',
		buttonOption		: true,
		buttonPageNumber	: true,
		buttonTitle			: 'page',
		cache				: undefined,
		clickFx				: false,
		colsWidth			: [],
		complete			: undefined,
		contentType			: undefined,
		dataType			: 'json',
		debug				: false,
		error				: undefined,
		evenOdd				: false,
		find				: '',
		findsName			: [],
		findTarget			: undefined,
		headersName			: [],
		headersWidth		: [],
		height				: 'auto',
		hoverFx				: false,
		jsonp				: undefined,
		jsonpCallback		: 'callback',
		listPath			: 'list',
		loadingIcon			: 'gridy-loading',
		loadingOption		: true,
		loadingText			: 'Loading...',
		messageOption		: true,
		messageTimer		: 4000,
		noResultOption		: true,
		noResultText		: 'No items found!',
		page				: 1,
		params				: {},
		paramsElements		: [],
		resize				: true,
		resultOption		: true,
		resultText			: 'Displaying {from} - {to} of {total} items',
		rows				: 10,
		rowsNumber			: [5, 10, 25, 50, 100],
		rowsTarget			: undefined,
		scroll				: false,
		search				: '',
		searchButtonLabel	: 'search',
		searchButtonTitle	: 'Start the search',
		searchFocus			: true,
		searchOption		: true,
		searchTarget		: undefined,
		searchText			: '',
		separate			: true,
		skin				: 'gridy-default',
		sortersName			: [],
		sorterWidth			: 'auto',
		sortName			: '',
		sortOrder			: 'asc',
		style				: 'table',
		success				: undefined,
		template			: 'template',
		totalPath			: 'total',
		type				: 'get',
		url					: '/gridy',
		width				: 'auto'
	};

})(jQuery);

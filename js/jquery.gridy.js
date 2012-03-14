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
 * <table id="grid"></table>
 *
 * <script id="template" type="text/x-jquery-tmpl">
 *    <tr>
 *       <td>${name}</td>
 *       <td>${email}</td>
 *    </tr>
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

				var $this = $this.width(methods.getSize.call(self, self.opt.width)).wrap('<div id="' + self.id + '-wrapper">');

				self.wrapper			= $this.parent().width(methods.getSize.call(self, self.opt.width));
				self.currentPage		= $('<input type="hidden" name="page" value="' + self.opt.page + '"/>').insertBefore($this);
				self.currentSortName	= $('<input type="hidden" name="sortName" value="' + self.opt.sortName + '"/>').insertBefore($this);
				self.currentSortOrder	= $('<input type="hidden" name="sortOrder" value="' + self.opt.sortOrder + '"/>').insertBefore($this);
				self.isTable			= self.opt.style == 'table';
				self.hasHeader			= self.opt.headersName.length > 0;
				self.hasFinds			= self.opt.findsName.length > 0;
				self.hasRows			= self.opt.rowsNumber.length > 0;

				if (self.isTable) {
					$this.attr('cellspacing', 0).parent().addClass(self.opt.skin + '-table');
				} else {
					$this.parent().addClass(self.opt.skin);
				}

				methods.buildSearcher.call(self);
				methods.buildStatus.call(self);
				methods.buildHeader.call(self);
				methods.buildContent.call(self);
				methods.buildFooter.call(self);
				methods.buildFinder.call(self);
				methods.buildRower.call(self);
				methods.buildRefresher.call(self);
				methods.buildPageButtons.call(self);
				methods.buildMessager.call(self);

				methods.data.call(self, self.opt.page, self.opt.sortName, self.opt.sortOrder);
			});
		}, buildContent: function() {
			var self = this;

			if (self.isTable) {
				self.content = $('<tbody class="gridy-content" />');
			} else {
				var width	= methods.getSize.call(self, self.opt.width),
					height	= methods.getSize.call(self, self.opt.height);

				self.content = $('<div class="gridy-content" />').css({ 'height': height, 'width': width });
			}

			$(self).append(self.content);
		}, buildFinder: function() {
			var self = this;

			if (self.hasFinds) {
				self.findBox =
				$('<div class="gridy-find-option"><select></select></div>').appendTo((self.opt.searchOption) ? self.search.children() : self.footer).children();

				var hasValue	= false,
					options		= '',
					value		,
					label		;

				for (var i in self.opt.findsName) {
					value = self.opt.findsName[i][0];
					label = self.opt.findsName[i][1];

					options += '<option value="' + value + '">' + label + '</option>';

					if (value == self.opt.find) {
						hasValue = true;
					}
				}

				if (!hasValue) {
					options = '<option value="' + self.opt.find + '" checked="checked">' + self.opt.find + '</option>' + options;
				}

				self.findBox.html(options).val(self.opt.find).change().change(function(index, value) {
					if (self.opt.searchOption && self.opt.searchFocus) {
						self.searchField.focus();
					}
				})
				.children('option[value="' + self.opt.find +  '"]').attr('checked', 'checked');
			}

			if (self.opt.findTarget) {
				if (!self.hasFinds) {
					$.error(self.id + ": you need set the 'findsName' option for find box be created!");
				}

				self.findBox.parent().appendTo(self.opt.findTarget);
			}
		}, buildFooter: function() {
			var self = this;

			if (self.hasRows || self.opt.messageOption || (!self.opt.searchOption && self.hasFinds)) {
				self.footer = $('<div class="gridy-footer" />').appendTo(self.wrapper);

				if (self.opt.resize) {
					self.footer.width(methods.getSize.call(self, self.opt.width));
				}
			}
		}, buildHeader: function() {
			var self = this;

			if (self.hasHeader) {
				if (self.opt.headersWidth.length <= 0) {
					if (self.opt.colsWidth.length <= 0) {
						$.error(self.id + ": 'headersWith' and 'colsWidth' options are invalid or missing!");
					}

					self.opt.headersWidth = self.opt.colsWidth;
				}

				if (self.isTable) {
					self.header = $('<thead class="gridy-header" />').appendTo(self);
				} else {
					self.header = $('<div class="gridy-header" />').appendTo(self);

					if (self.opt.resize) {
						self.header.width(methods.getSize.call(self, self.opt.width));
					}
				}

				var name, label, sortLink, head;

				for (var i in self.opt.headersName) {
					name = self.opt.headersName[i][0];
					label = self.opt.headersName[i][1];

					sortLink = $('<a />', { href: 'javascript:void(0);', html: label });

					if (self.isTable) {
						head = $('<th class="gridy-sorter" />');
					} else {
						head = $('<div class="gridy-sorter" />');
					}

					if (name) {
						sortLink.attr({ id: 'sort-by-' + name, name: name });

						var $sortIcon = $('<div />', { 'class': self.opt.arrowNone });

						head.append(sortLink, $sortIcon);
					} else {
						sortLink.attr('class', 'gridy-no-sort');
						head.append(sortLink);
					}

					if (self.opt.headersName[i][2]) {
						head.addClass(self.opt.headersName[i][2]);
					}

					if (self.isTable) {
						head.attr('width', self.opt.headersWidth[i]);
					} else {
						head.width(self.opt.headersWidth[i]);
					}

					head.appendTo(self.header);
				}

				self.sorters = self.header.children('.gridy-sorter').children('a').click(function() {
					methods.sort.call(self, $(this));
				});

				var initialSort = self.header.find('#sort-by-' + self.opt.sortName);

				if (initialSort.length) {
					methods.flick.call(self, initialSort, self.opt.sortOrder);
				}
			}
		}, buildMessager: function() {
			var self = this;

			if (self.opt.messageOption) {
				self.messageBox = $('<div class="gridy-message" />').appendTo(self.footer);
			}
		}, buildPageButtons: function() {
			var self = this;

			if (self.opt.buttonOption) {
				var wrapper = $('<div class="gridy-buttons"><div class="gridy-buttons-content"></div></div>').appendTo(self.wrapper);

				if (self.opt.resize) {
					wrapper.width(methods.getSize.call(self, self.opt.width));
				}

				self.pageButtons = wrapper.children();
			}
		}, buildRefresher: function() {
			var self = this;

			if (self.opt.refreshOption) {
				self.refresher = $('<input type="button" class="' + self.opt.refreshIcon + '" />').click(function() {
					methods.data.call(self, 1, self.currentSortName.val(), self.currentSortOrder.val());
				});
			}

			if (self.opt.refreshTarget) {
				if (!self.opt.refreshOption) {
					$.error(self.id + ": you must turn the 'refreshOption' to true to use 'refreshTarget'!");
				}

				self.refresher.appendTo(self.opt.refreshTarget);
			} else {
				self.refresher.appendTo(self.footer);
			}
		}, buildRower: function() {
			var self = this;

			if (self.hasRows) {
				self.rower = $('<div class="gridy-row-option"><select></select></div>').children();

				var rows		= (self.opt.rows < 1) ? 1 : self.opt.rows,
					hasNumber	= false,
					options		= '',
					number		;

				for (var i in self.opt.rowsNumber) {
					number = self.opt.rowsNumber[i];

					if (number == rows) {
						hasNumber = true;
					}

					options += '<option value="' + number + '">' + methods.getNumber.call(self, number) + '</option>';
				}

				if (!hasNumber) {
					options = '<option value="' + rows + '" checked="checked">' + methods.getNumber.call(self, rows) + '</option>' + options;
				}

				self.rower.html(options).val(rows).change().change(function(index, value) {
					methods.data.call(self, 1, self.currentSortName.val(), self.currentSortOrder.val(), $(self));
				})
				.children('option[value="' + rows +  '"]').attr('checked', 'checked');
			}

			if (self.opt.rowsTarget) {
				if (!self.hasRows) {
					$.error(self.id + ": you need set the 'rowsNumber' option for rows box be created!");
				}

				self.rower.parent().appendTo(self.opt.rowsTarget);
			} else {
				self.rower.parent().appendTo(self.footer);
			}
		}, buildSearcher: function() {
			var self = this;

			if (self.opt.searchOption) {
				self.search = $('<div class="gridy-search"><div class="gridy-search-content"></div></div>');

				if (self.opt.resize) {
					self.search.width(methods.getSize.call(self, self.opt.width));
				}

				var searchContent = self.search.children();

				self.searchField = $('<input type="text" name="search" value="' + ((self.opt.search == '') ? self.opt.searchText : self.opt.search) + '" title="' + self.opt.searchText + '" size="40" />').appendTo(searchContent);

				self.searchField.blur(function() {
					if (self.searchField.val() == '') {
						self.searchField.removeClass('gridy-typed').val(self.opt.searchText);
					}
				}).focus(function() {
					if (self.searchField.val() == self.opt.searchText) {
						self.searchField.addClass('gridy-typed').val('');
					}
				}).keypress(function(evt) {
					if ((evt.keyCode ? evt.keyCode : evt.which) == 13) {
						methods.data.call(self, 1, self.currentSortName.val(), self.currentSortOrder.val());
					}
				});

				self.searchButton = $('<input type="button" value="' + self.opt.searchButtonLabel + '" title="' + self.opt.searchButtonTitle + '" />');

				self.searchButton.click(function() {
					methods.data.call(self, 1, self.currentSortName.val(), self.currentSortOrder.val());
				}).appendTo(searchContent);

				if (self.opt.searchTarget) {
					self.search.appendTo(self.opt.searchTarget);
				} else {
					self.search.insertBefore($(self));
				}
			}
		}, buildStatus: function() {
			var self = this;

			if (self.opt.loadingOption || self.opt.resultOption) {
				self.statusBox = $('<div class="gridy-status" />').insertBefore($(self));

				if (self.opt.resize) {
					self.statusBox.width(methods.getSize.call(self, self.opt.width));
				}
			}

			if (self.opt.loadingOption) {
				self.loading = $('<div class="' + self.opt.loadingIcon + '"><div>' + self.opt.loadingText + '</div></div>').appendTo(self.statusBox).children();
			}

			if (self.opt.resultOption) {
				self.result = $('<div class="gridy-result" />').appendTo(self.statusBox);
			}
		}, data: function(page, sortName, sortOrder) {
			var self = this;

			methods.enableGrid.call(self, false);
			methods.loading.call(self, true);

			if (self.opt.before) {
				var result = self.opt.before.call(self, page, sortName, sortOrder);

				if (result) {
					if (result.page) {
						page = result.page;
					}
	
					if (result.sortName) {
						sortName = result.sortName;
					}
	
					if (result.sortOrder) {
						sortOrder = result.sortOrder;
					}
				}
			}

			var search			= self.opt.search,
				selectedRows	= (self.hasRows) ? self.rower.val() : self.opt.rows,
				selectedFind	= (self.hasFinds) ? self.findBox.val() : self.opt.find;

			if (self.opt.searchOption) {
				search = (self.searchField.val() == self.opt.searchText) ? '' : self.searchField.val();

				if (self.opt.searchFocus) {
					self.searchField.focus();
				}
			}

			if (self.opt.data) {
				methods.process.call(self, self.opt.data, page, sortName, sortOrder);
				return;
			}

			var data = {
				search		: search,
				page		: page,
				sortName	: sortName,
				sortOrder	: sortOrder,
				find		: selectedFind,
				rows		: selectedRows
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
					methods.process.call(self, data, page, sortName, sortOrder, selectedRows);

					var scrollSufix = (self.opt.scroll) ? '-scroll' : '';

					if (self.opt.hoverFx) {
						self.content.children().mouseenter(function() {
							$(this).addClass('gridy-row-hovered' + scrollSufix);
						}).mouseleave(function() {
							$(this).removeClass('gridy-row-hovered' + scrollSufix);
						});
					}

					if (self.opt.clickFx) {
						self.content.children().click(function(evt) {
							var $this = $(this);

							if (!evt.shiftKey) {
								$this.parent().children('.gridy-row-selected' + scrollSufix).removeClass('gridy-row-selected' + scrollSufix);
							}

							$this.toggleClass('gridy-row-selected' + scrollSufix);
						});
					}

					if (self.opt.success) {
						self.opt.success.call(self, data, textStatus, jqXHR);
					}
				}, error: function(jqXHR, textStatus, errorThrown) {
					methods.message.call(self, methods.getError.call(self, jqXHR));

					if (self.opt.error) {
						self.opt.error.call(self, jqXHR, textStatus, errorThrown);
					}
				}, complete: function(jqXHR, textStatus) {
					methods.loading.call(self, false);
					methods.enableGrid.call(self, true);

					if (self.opt.scroll) {
						if (self.opt.height == 'auto') {
							throw self.id + ': height attribute missing!';
						}

						if (self.isTable) {
							var $this	= self.content.parent(),
								width	= methods.getSize.call(self, self.opt.width + 15);

							$this.wrap('<div id="' + self.id + '-wrapper" />')
								.parent().addClass('gridy-scroll-wrapper').css({ 'height': methods.getSize.call(self, self.opt.height), 'width': width })
							.end()
							.clone(true).removeAttr('id').width(width) 
								.find('tbody').remove()
							.end()
							.insertBefore($this.parent());

							$this.children('thead').remove();
						} else {
							self.content.addClass('gridy-scroll-wrapper').children().addClass('gridy-scroll');
						}
					} else {
						if (self.opt.separate) {
							var $firstLine = self.content.children(':first').not('p');
	
							if (self.isTable) {
								$firstLine = $firstLine.children();
							}

							$firstLine.addClass('gridy-separate');
						}
					}

					if (self.isTable) {
						self.content.children(':last').children().addClass('gridy-last-line');
					}

					if (self.opt.complete) {
						self.opt.complete.call(self, jqXHR, textStatus);
					}
				}
			});
		}, enableGrid: function(isEnable) {
			var self = this;

			if (isEnable) {
				if (self.opt.searchOption) {
					self.searchField.removeAttr('readonly');
					self.searchButton.removeAttr('disabled');
				}

				if (self.hasHeader) {
					self.sorters.filter(':not(".gridy-no-sort")').click(function() {
						methods.sort.call(self, $(this));
					});
				}

				if (self.opt.buttonOption) {
					self.pageButtons.children(':not(".gridy-button-reticence")').removeAttr('disabled');
				}

				if (self.hasFinds) {
					self.findBox.removeAttr('disabled');
				}

				if (self.hasRows) {
					self.rower.removeAttr('disabled');
				}

				if (self.opt.refreshOption) {
					self.refresher.removeAttr('disabled');
				}
			} else {
				if (self.opt.searchOption) {
					self.searchField.attr('readonly', 'readonly');
					self.searchButton.attr('disabled', 'disabled');
				}

				if (self.hasHeader) {
					self.sorters.unbind('click');
				}

				if (self.opt.buttonOption) {
					self.pageButtons.attr('disabled', 'disabled');
				}

				if (self.hasFinds) {
					self.findBox.attr('disabled', 'disabled');
				}

				if (self.hasRows) {
					self.rower.attr('disabled', 'disabled');
				}

				if (self.opt.refreshOption) {
					self.refresher.attr('disabled', 'disabled');
				}
			}
		}, flick: function(sorter, sortOrder, currentSort) {
			var self		= this,
				sortIcon	= (self.opt.sortOrder == 'asc') ? self.opt.arrowUp : self.opt.arrowDown;

			if (currentSort) {
				currentSort.attr('rel', 'desc').removeClass('gridy-sorted').next('div').removeClass().addClass(self.opt.arrowNone);
			}

			sorter.attr('rel', sortOrder).addClass('gridy-sorted').next('div').removeClass().addClass(sortIcon);
		}, getError: function(xhr) {
			return (xhr.responseText) ? xhr.responseText.substring(xhr.responseText.indexOf('(') + 1, xhr.responseText.indexOf(')')) : xhr.statusText;
		}, getNumber: function(number) {
			return (number < 10) ? '0' + number : number;
		}, getSize: function(size) {
			return (isNaN(parseInt(size, 10))) ? size : size + 'px';
		}, loading: function(isStart) {
			var self = this;

			if (self.opt.loadingOption) {
				if (isStart) {
					self.loading.fadeIn('fast');
					self.content.addClass('gridy-fade');
				} else {
					self.loading.fadeOut();
					self.content.removeClass('gridy-fade');
				}
			}
		}, message: function(message) {
			var self = this;

			if (self.opt.messageOption) {
				self.messageBox.html(message).show();

				setTimeout(function() {
					self.messageBox.fadeOut(function() {
						self.messageBox.hide().empty();
					});
				}, self.opt.messageTimer);
			}
		}, noResult: function() {
			var self = this;

			if (self.opt.noResultOption) {
				self.content.html('<p class="gridy-no-result">' + self.opt.noResultText + '</p>');
	
				if (self.opt.resultOption) {
					self.result.html(self.result.html().replace(/\d+/g, '0'));
				}

				if (self.opt.searchOption) {
					self.searchField.focus().select();
				}
			}
		}, process: function(data, page, sortName, sortOrder, selectedRows) {
			var self = this;

			if (typeof(data) == 'string') {
				data = $.parseJSON(data);
			}

			if (self.opt.filter) {
				var callback = self.opt.filter.call(self, data, page, sortName, sortOrder);

				if (callback) {
					data = callback;

					if (typeof(data) == 'string') {
						data = $.parseJSON(data);
					}
				}
			}

			var totalVet	= self.opt.totalPath.split('.'),
				total		= 0,
				prop		;

			for (var i in totalVet) {
				prop = totalVet[i];
				total = (i == 0) ? data[prop] : total[prop]; 
			}

			if (total == 0) {
				methods.noResult.call(self);

				if (self.opt.buttonOption) {
					self.pageButtons.empty();
				}

				return;
			}

			var listVet	= self.opt.listPath.split('.'),
				list	= [];
	
			for (var i in listVet) {
				prop = listVet[i];
				list = (i == 0) ? data[prop] : list[prop]; 
			}

			self.content.html($('#' + self.opt.template).tmpl(list));

			var rows	= undefined,
				columns	= undefined;

			if (self.opt.evenOdd) {
				self.content
					.children(':even').addClass((self.opt.scroll) ? 'gridy-even-scroll' : 'gridy-even')
				.end()
					.children(':odd').addClass((self.opt.scroll) ? 'gridy-odd-scroll' : 'gridy-odd');
			}

			if (self.opt.colsWidth) {
				rows = self.content.children(); // div|tr

				if (!self.isTable) {
					rows.addClass('gridy-row');
				}

				rows.each(function() {
					columns = $(this).children();

					if (!self.isTable) {
						columns.addClass('gridy-column');
					}

					columns.each(function(index) { // div|td
						if (self.isTable) {
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

				self.result.html(resultText);
			}

			if (self.opt.buttonOption) {
				if (total > selectedRows) {
					var buttonEmpty	= '<input type="button" value="..." disabled="disabled" class="gridy-button-reticence"/>&#160;',
						buttons		= '',
						number		= 0,
						rangePage	= undefined,
						start		= 1,
						buttonMax	= self.opt.buttonMax,
						isEven		= (buttonMax % 2 == 0);

					if (buttonMax > totalPage) {
						buttonMax = totalPage;
					}

					if (isEven) {
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
						hasBackNavigation	= hasExceeded && page > ((isEven) ? rangePage : rangePage + 1),
						hasNextNavigation	= hasExceeded && page < (totalPage - rangePage);

					if (hasBackNavigation) {
						buttons = '<input type="button" value="&lsaquo;" alt="' + self.opt.buttonBackTitle + '" title="' + self.opt.buttonBackTitle + '" class="gridy-back"/>&#160;';
						buttons += buttonEmpty;
					}

					for (var i = start; i <= end; i++) {
						number = methods.getNumber.call(self, i);
						buttons += '<input type="button" value="' + number + '" alt="' + number + '" title="' + self.opt.buttonTitle + ' ' + number + '"/>&#160;';
					}

					if (hasNextNavigation) {
						buttons += buttonEmpty;
						buttons += '<input type="button" value="&rsaquo;" alt="' + self.opt.buttonNextTitle + '" title="' + self.opt.buttonNextTitle + '" class="gridy-next"/>&#160;';
					}

					self.pageButtons.html(buttons).children(':not(".gridy-back, .gridy-reticence, .gridy-next")').click(function() {
						methods.data.call(self, parseInt(this.alt, 10), self.currentSortName.val(), self.currentSortOrder.val());
					});

					if (hasBackNavigation) {
						self.pageButtons.children('.gridy-back').click(function() {
							methods.data.call(self, page - 1, self.currentSortName.val(), self.currentSortOrder.val());
						});
					}

					if (hasNextNavigation) {
						self.pageButtons.children('.gridy-next').click(function() {
							methods.data.call(self, page + 1, self.currentSortName.val(), self.currentSortOrder.val());
						});
					}
				} else {
					self.pageButtons.empty();
				}

				$('input[value="' + methods.getNumber.call(self, page) + '"]').attr('disabled', 'disabled').addClass('gridy-button-active');
			}

			self.currentPage.val(page);
			self.currentSortName.val(sortName);
			self.currentSortOrder.val(sortOrder);
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
		}, sort: function(sorter) {
			var self			= this,
				sortName		= sorter.attr('name'),
				sortOrder		= sorter.attr('rel'),
				nextSortOrder	= (sortOrder == 'desc') ? 'asc' : 'desc',
				currentSort		= self.sorters.filter('.gridy-sorted');

			methods.flick.call(self, sorter, nextSortOrder, currentSort);
			methods.data.call(self, self.currentPage.val(), sortName, nextSortOrder);
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
		buttonBackTitle		: '&lsaquo; Back',
		buttonMax			: 10,
		buttonNextTitle		: 'Next &rsaquo;',
		buttonOption		: true,
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
		filter				: undefined,
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
		refreshIcon			: 'gridy-button-refresh',
		refreshOption		: true,
		refreshTarget		: undefined,
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

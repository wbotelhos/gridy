/*!
 * jQuery Gridy - A Grid Plugin - http://wbotelhos.com/gridy
 * -----------------------------------------------------------------------------------
 *
 * jQuery Gridy is a plugin that generates a highly customizable grid using templates.
 *
 * Licensed under The MIT License
 *
 * @version        1.0.0
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
					$this	= $(self).empty();

				self.opt				= $.extend({}, $.fn.gridy.defaults, settings);
				self.wrapper			= $this.data('settings', self.opt).wrap('<div id="' + self.id + '-wrapper" />').parent();
				self.currentPage		= $('<input type="hidden" name="page" value="' + self.opt.page + '" />').insertBefore(self);
				self.currentSortName	= $('<input type="hidden" name="sortName" value="' + self.opt.sortName + '" />').insertBefore(self);
				self.currentSortOrder	= $('<input type="hidden" name="sortOrder" value="' + self.opt.sortOrder + '" />').insertBefore(self);
				self.isTable			= self.opt.style == 'table';
				self.hasColumns			= self.opt.columns.length > 0;
				self.hasHeaders			= self.opt.headers.length > 0 || self.hasColumns;
				self.hasFinds			= self.opt.finds.length > 0;
				self.hasRows			= self.opt.rowsNumber.length > 0;

				self.myWidth = methods.getSize.call(self, self.opt.width);
				self.myHeight = methods.getSize.call(self, self.opt.height);

				if (self.opt.width) {
					self.wrapper.width(self.myWidth);
				}

				if (self.opt.width) {
					$this.width(self.myWidth);
				}

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

				if (self.opt.firstQuery) {
					methods.data.call(self, self.opt.page, self.opt.sortName, self.opt.sortOrder);
				} else {
					methods.noResult.call(self, self.opt.noFirstQueryText);
				}
			});
		}, buildContent: function() {
			var self = this;

			if (self.isTable) {
				self.content = $('<tbody class="gridy-content" />');
			} else {
				self.content = $('<div class="gridy-content" />');

				if (self.opt.width) {
					self.content.width(self.myWidth);
				}

				if (self.opt.height) {
					self.content.height(self.myHeight);
				}
			}

			self.content.appendTo(self);

			if (self.opt.scroll) {
				if (!self.opt.height || self.opt.height == 'auto') {
					methods.error.call(self, self.id + ': height attribute missing!');
				}

				if (self.isTable) {
					var table	= self.content.parent('table'),
						scroll	= table.wrap('<div class="gridy-scroll" />').parent('div');
	
					if (self.opt.height) {
						scroll.height(self.myHeight);
					}
	
					if (self.opt.width) {
						scroll.width(methods.getSize.call(self, self.opt.width + 15));
					}
	
					var header = table.clone(true).removeAttr('id');
	
					header.children('tbody').remove();
	
					header.insertBefore(scroll);
	
					table.children('thead').remove();
				} else {
					self.content.addClass('gridy-scroll');
				}
			}
		}, buildFinder: function() {
			var self = this;

			if (self.hasFinds) {
				self.findBox =
				$('<div class="gridy-find-option"><select></select></div>').appendTo((self.opt.searchOption) ? self.search.children() : self.footer).children();

				var hasValue	= false,
					options		= '',
					name		,
					value		;

				for (var i in self.opt.finds) {
					name = self.opt.finds[i].name;
					value = self.opt.finds[i].value;

					if (!name) {
						methods.error.call(self, self.id + ': finds[' + i + '].name missing!');
					}

					if (!value) {
						methods.error.call(self, self.id + ': finds[' + i + '].value missing!');
					}

					options += '<option value="' + value + '">' + name + '</option>';

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
					methods.error.call(self, self.id + ": you need set the 'finds' option for find box be created!");
				}

				self.findBox.parent().appendTo(self.opt.findTarget);
			}
		}, buildFooter: function() {
			var self = this;

			if (self.hasRows || self.opt.messageOption || (!self.opt.searchOption && self.hasFinds)) {
				self.footer = $('<div class="gridy-footer" />').appendTo(self.wrapper);

				if (self.opt.resize && self.opt.width) {
					self.footer.width(self.myWidth);
				}
			}
		}, buildHeader: function() {
			var self = this;

			if (self.hasHeaders) {
				var header;

				if (self.isTable) {
					header = $('<thead class="gridy-header"><tr></tr></thead>').appendTo(self).children('tr');
				} else {
					header = $('<div class="gridy-header" />').appendTo(self);

					if (self.opt.resize && self.opt.width) {
						header.width(self.myWidth);
					}
				}

				if (self.opt.headers <= 0) {
					self.opt.headers = self.opt.columns;
				}

				var name, value, width, clazz, head, link, icon;

				for (var i in self.opt.headers) {
					name = self.opt.headers[i].name;
					value = self.opt.headers[i].value;
					width = self.opt.headers[i].width;
					clazz = self.opt.headers[i].clazz;

					link = $('<a />', { href: 'javascript:void(0);' });

					icon = $('<div />');

					if (name) {
						link.html(name);
					}

					if (value) {
						link.attr({ id: 'sort-by-' + value, name: value });

						if (name) {
							icon.addClass(self.opt.arrowNone);
						}
					} else {
						link.addClass('gridy-no-sort');
					}

					if (!name || !value) {
						icon.addClass('gridy-arrow-empty');
					}

					head = $((self.isTable) ? '<th />' : '<div />').append(link, icon);

					if (width) {
						if (self.isTable) {
							head.attr('width', width);
						} else {
							head.width(width);
						}
					}

					if (clazz) {
						head.addClass(clazz);
					}

					head.appendTo(header);
				}

				self.sorters = header.children().children('a').click(function() {
					methods.sort.call(self, $(this));
				});

				var sorter = self.sorters.filter('#sort-by-' + self.opt.sortName);

				if (sorter.length) {
					methods.flick.call(self, sorter, self.opt.sortOrder, undefined);
				}
			}
		}, buildMessager: function() {
			var self = this;

			if (self.opt.messageOption) {
				self.messager = $('<div class="gridy-message" />').appendTo(self.footer);
			}
		}, buildPageButtons: function() {
			var self = this;

			if (self.opt.buttonOption) {
				var wrapper = $('<div class="gridy-buttons"><div class="gridy-buttons-content"></div></div>').appendTo(self.wrapper);

				if (self.opt.resize && self.opt.width) {
					wrapper.width(self.myWidth);
				}

				self.pageButtons = wrapper.children();
			}
		}, buildRefresher: function() {
			var self = this;

			if (self.opt.refreshOption) {
				self.refresher = $('<input type="button" class="' + self.opt.refreshIcon + '" />').click(function() {
					methods.data.call(self, self.currentPage.val(), self.currentSortName.val(), self.currentSortOrder.val());
				});
			}

			if (self.opt.refreshTarget) {
				if (!self.opt.refreshOption) {
					methods.error.call(self, self.id + ": you must turn the 'refreshOption' to true to use 'refreshTarget'!");
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
					methods.error.call(self, self.id + ": you need set the 'rowsNumber' option for rows box be created!");
				}

				self.rower.parent().appendTo(self.opt.rowsTarget);
			} else {
				self.rower.parent().appendTo(self.footer);
			}
		}, buildSearcher: function() {
			var self = this;

			if (self.opt.searchOption) {
				self.search = $('<div class="gridy-search"><div class="gridy-search-content"></div></div>');

				if (self.opt.resize && self.opt.width) {
					self.search.width(self.myWidth);
				}

				var content = self.search.children();

				self.searchField = $('<input type="text" name="search" value="' + ((self.opt.search == '') ? self.opt.searchText : self.opt.search) + '" title="' + self.opt.searchText + '" size="40" />').appendTo(content);

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

				self.searchButton =
					$('<input type="button" value="' + self.opt.searchButtonLabel + '" title="' + self.opt.searchButtonTitle + '" />').click(function() {
						methods.data.call(self, 1, self.currentSortName.val(), self.currentSortOrder.val());
					}).appendTo(content);

				if (self.opt.searchTarget) {
					self.search.appendTo(self.opt.searchTarget);
				} else {
					self.search.insertBefore($(self));
				}
			}
		}, buildStatus: function() {
			var self = this;

			if (self.opt.loadingOption || self.opt.statusOption) {
				self.statusBox = $('<div class="gridy-status" />').insertBefore($(self));

				if (self.opt.resize && self.opt.width) {
					self.statusBox.width(self.myWidth);
				}
			}

			if (self.opt.loadingOption) {
				self.loading = $('<div class="' + self.opt.loadingIcon + '"><div>' + self.opt.loadingText + '</div></div>').appendTo(self.statusBox).children().hide();
			}

			if (self.opt.statusOption) {
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

			var search		= self.opt.search,
				rowNumber	= (self.hasRows) ? self.rower.val() : self.opt.rows,
				findName	= (self.hasFinds) ? self.findBox.val() : self.opt.find;

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
				find		: findName,
				rows		: rowNumber
			};

			for (var prop in self.opt.params) {
				data[prop] = self.opt.params[prop];
		    }

			for (var prop in self.opt.paramsElements) {
				var element = self.opt.paramsElements[prop];

				$(element).each(function(i) {
					var $this = $(this);

					if ($this.is(':enabled') && !$this.is(':checkbox') || $this.is(':checked')) {

						if (element.indexOf('.') == 0) {
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
				var query = '[debug] query string:\n\n';

				for (var prop in data) {
					query += prop;

					for (var i = 0; i < (20 - prop.length); i++) {
						query += ' ';
					}

					query += ': ' + (data[prop] || "''") + '\n';
				}

				if (window.console && window.console.log) {
					window.console.log(query);
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
					methods.process.call(self, data, page, sortName, sortOrder, rowNumber);

					if (self.opt.hoverFx) {
						self.content.children(':not("p")').mouseenter(function() {
							$(this).addClass('gridy-row-hovered');
						}).mouseleave(function() {
							$(this).removeClass('gridy-row-hovered');
						});
					}

					if (self.opt.clickFx) {
						self.content.children(':not("p")').click(function(evt) {
							var $this = $(this);

							if (!evt.ctrlKey && !evt.metaKey) {
								$this.parent().children('.gridy-row-selected').removeClass('gridy-row-selected');
							}

							$this.toggleClass('gridy-row-selected');
						});
					}

					if (self.opt.done) {
						self.opt.done.call(self, data, textStatus, jqXHR);
					}
				}, error: function(jqXHR, textStatus, errorThrown) {
					methods.message.call(self, methods.getError.call(self, jqXHR));

					if (self.opt.fail) {
						self.opt.fail.call(self, jqXHR, textStatus, errorThrown);
					}
				}, complete: function(jqXHR, textStatus) {
					methods.loading.call(self, false);
					methods.enableGrid.call(self, true);

					if (self.opt.scroll) {
						if (self.isTable) {
							self.content.children(':first').addClass('gridy-first-line');
						} else {
							self.content.children(':last').addClass('gridy-last-line');
						}
					} else {
						if (self.isTable) {
							self.content.children('tr:last').children('td').addClass('gridy-last-line');
						}

						if (self.opt.separate) {
							var firstLine = self.content.children(':first');

							if (self.isTable) {
								firstLine = firstLine.children('td');
							}

							firstLine.addClass('gridy-separate');
						}
					}

					if (self.opt.always) {
						self.opt.always.call(self, jqXHR, textStatus);
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

				if (self.hasHeaders) {
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

				if (self.hasHeaders) {
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
		}, error: function(message) {
			this.wrapper.html('<div class="gridy-error">' + message + '</div>');

			$.error(message);
		}, flick: function(sorter, nextOrder, currentSorter) {
			var self		= this,
				nextIcon	= (nextOrder == 'asc') ? self.opt.arrowUp : self.opt.arrowDown;

			if (currentSorter) {
				currentSorter.removeAttr('rel').removeClass('gridy-sorted').next('div').removeClass().addClass(self.opt.arrowNone);
			}

			sorter.attr('rel', nextOrder).addClass('gridy-sorted').next('div').removeClass().addClass(nextIcon);
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
					self.content.children().children().addClass('gridy-fade'); // 2 * children() for otimization.
				} else {
					self.loading.fadeOut();
					self.content.children().children().removeClass('gridy-fade'); // 2 * children() for otimization.
				}
			}
		}, message: function(message) {
			var self = this;

			if (self.opt.messageOption) {
				self.messager.html(message).show();

				setTimeout(function() {
					self.messager.fadeOut(function() {
						self.messager.hide().empty();
					});
				}, self.opt.messageTimer);
			}
		}, noResult: function(message) {
			var self = this;

			if (self.opt.resultOption) {
				self.content.html('<p class="gridy-no-result">' + (message || '') + '</p>');

				if (self.opt.statusOption) {
					self.result.html(self.result.html().replace(/\d+/g, '0'));
				}

				if (self.opt.searchOption) {
					self.searchField.focus().select();
				}
			}
		}, process: function(data, page, sortName, sortOrder, rowNumber) {
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
				methods.noResult.call(self, self.opt.noResultText);

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

			if (self.opt.evenOdd) {
				self.content
					.children(':even').addClass((self.opt.scroll) ? 'gridy-even' : 'gridy-even')
				.end()
					.children(':odd').addClass((self.opt.scroll) ? 'gridy-odd' : 'gridy-odd');
			}

			var width;

			self.content.children().each(function() { // div|tr
				$(this).children().each(function(index) { // div|td
					if (self.opt.columns[index]) {
						width = self.opt.columns[index].width;

						if (self.isTable) {
							$(this).attr('width', width);
						} else {
							$(this).width(width);
						}
					}
				});
			});

			var rest		= total % rowNumber,
				totalPage	= (total - rest) / rowNumber;

			if (rest > 0) {
				totalPage++;
			}

			if (self.opt.statusOption) {
				var statusText = self.opt.statusText.replace('{from}', methods.getNumber.call(self, page)).replace('{to}', methods.getNumber.call(self, totalPage)).replace('{total}', methods.getNumber.call(self, total));

				self.result.html(statusText);
			}

			if (self.opt.buttonOption) {
				if (total > rowNumber) {
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

					var pageButtons = self.pageButtons.html(buttons).children('input:button:not(".gridy-back, .gridy-reticence, .gridy-next")');

					pageButtons.click(function() {
						methods.data.call(self, parseInt(this.alt, 10), self.currentSortName.val(), self.currentSortOrder.val());
					})
					.filter('[value="' + methods.getNumber.call(self, page) + '"]').attr('disabled', 'disabled').addClass('gridy-button-active');

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
			}

			self.currentPage.val(page);
			self.currentSortName.val(sortName);
			self.currentSortOrder.val(sortOrder);
		}, reload: function() {
			methods.set.call(this, {});
		}, set: function(settings) {
			return this.each(function() {
				var $this		= $(this),
					actual		= $this.data('settings'),
					wrapper		= $this.parent();

				if (actual.scroll && actual.style == 'table') {
					wrapper = wrapper.parent();
				}

				$this.insertBefore(wrapper);

				wrapper.remove();

				$this.gridy($.extend({}, actual, settings));
			});
		}, sort: function(sorter) {
			var self			= this,
				sortName		= sorter.attr('name'),
				sortOrder		= sorter.attr('rel'),
				nextOrder		= (sortOrder && sortOrder == 'asc') ? 'desc' : 'asc',
				currentSorter	= self.sorters.filter('.gridy-sorted');

			methods.flick.call(self, sorter, nextOrder, currentSorter);
			methods.data.call(self, self.currentPage.val(), sortName, nextOrder);
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
		// ajax
		always				: undefined,
		cache				: undefined,
		contentType			: undefined,
		dataType			: 'json',
		done				: undefined,
		fail				: undefined,
		jsonp				: undefined,
		jsonpCallback		: undefined,
		page				: 1,
		params				: {},
		paramsElements		: [],
		sortName			: '',
		sortOrder			: 'asc',
		type				: 'get',
		url					: '/gridy',

		// callback
		before				: undefined,
		filter				: undefined,

		// content
		columns				: [],
		height				: undefined,
		scroll				: false,
		style				: 'table',
		width				: undefined,

		// design
		evenOdd				: false,
		resize				: true,
		separate			: true,
		skin				: 'gridy',

		// effect
		clickFx				: false,
		hoverFx				: false,

		// find
		find				: '',
		finds				: [],
		findTarget			: undefined,

		// header
		arrowDown			: 'gridy-arrow-down',
		arrowNone			: 'gridy-arrow-none',
		arrowUp				: 'gridy-arrow-up',
		headers				: [],

		// page
		buttonBackTitle		: '&lsaquo; Back',
		buttonMax			: 10,
		buttonNextTitle		: 'Next &rsaquo;',
		buttonOption		: true,
		buttonTitle			: 'Page',

		// json
		listPath			: 'list',
		totalPath			: 'total',
		template			: 'template',

		// loading
		loadingIcon			: 'gridy-loading',
		loadingOption		: true,
		loadingText			: 'Loading...',

		// message
		messageOption		: true,
		messageTimer		: 4000,

		// other
		debug				: false,

		// refresh
		refreshIcon			: 'gridy-button-refresh',
		refreshOption		: true,
		refreshTarget		: undefined,

		// result
		firstQuery			: true,
		noFirstQueryText	: 'No search was performed yet!',
		noResultText		: 'No item was found!',
		resultOption		: true,

		// row
		rows				: 10,
		rowsNumber			: [5, 10, 25, 50, 100],
		rowsTarget			: undefined,

		// seach
		search				: '',
		searchButtonLabel	: 'search',
		searchButtonTitle	: 'Start the search',
		searchFocus			: true,
		searchOption		: true,
		searchTarget		: undefined,
		searchText			: '',

		// status
		statusOption		: true,
		statusText			: 'Displaying {from} - {to} of {total} items'
	};

})(jQuery);

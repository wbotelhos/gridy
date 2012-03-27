describe('param settings', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('param receive default', function() {
		// given
		var $this = $('#grid');

		// then
		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.data.search).toEqual('');
			expect(params.data.page).toEqual(1);
			expect(params.data.sortName).toEqual('');
			expect(params.data.sortOrder).toEqual('asc');
			expect(params.data.find).toEqual('');
			expect(params.data.rows).toEqual('10');
		});

		// when
		$this.gridy({ url: '/gridy' });
	});

	it ('param receive custom', function() {
		// given
		var $this = $('#grid');

		// then
		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.data.search).toEqual('search');
			expect(params.data.page).toEqual(2);
			expect(params.data.sortName).toEqual('id');
			expect(params.data.sortOrder).toEqual('desc');
			expect(params.data.find).toEqual('find');
			expect(params.data.rows).toEqual('3');
		});

		// when
		$this.gridy({
			search:		'search',
			page:		2,
			sortName:	'id',
			sortOrder:	'desc',
			find:		'find',
			rows:		3,
			url:		'/gridy'
		});
	});

	it ('params should send custom parameters', function() {
		// given
		var $this = $('#grid');

		// then
		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.data.pa == 'pa').toBeTruthy();
			expect(params.data.rams == 'rams').toBeTruthy();
		});

		// when
		$this.gridy({
			url		: '/gridy',
			params	: { pa: 'pa', rams: 'rams'}
		});
	});

	it ('should capture paramsElements from many elements with class as array and other elements as simple text', function() {
		$('body')
		.append('<input id="single" type="text" name="single" value="singleValue" />')
		.append('<input type="checkbox" name="multiple" value="multipleValue1" checked="checked" class="multiple" />')
		.append('<input type="checkbox" name="multiple" value="multipleValue2" class="multiple" />')
		.append('<input type="checkbox" name="multiple" value="multipleValue2" disabled="disabled" class="multiple" />')
		.append('<input type="checkbox" name="multiple" value="multipleValue3" readonly="readonly" checked="checked" class="multiple" />')
		.append('<select id="selection" name="selection"><option value="selection1">selection1</selection><option value="selection2" checked="checked">selection2</selection></select>');

		$('#selection').val('selection2');

		// given
		var $this = $('#grid');

		// then
		spyOn($, 'ajax').andCallFake(function(params) {
			expect($.isArray(params.data.multiple)).toBeTruthy();
			expect($.isArray(params.data.single)).toBeFalsy();
			expect($.isArray(params.data.selection)).toBeFalsy();
		});

		// when
		$this.gridy({
			url				: '/gridy',
			paramsElements	: ['#single', '.multiple', '#selection']
		});

		$('#single').remove();
		$('.multiple').remove();
		$('#selection').remove();
	});

});

describe('global', function() {

	beforeEach(function() {
		$('body').append('<table id="grid"></table>');


		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete(xhr, 'status');
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('chain should be chainable', function() {
		// given
		var $this		= $('#grid'),
			className	= 'my-class';

		// when
		$this.gridy({ url: '/gridy' }).addClass(className);

		// then
	    expect($this).toHaveClass(className);
	});

	it ('hidden field should have custom IDs', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({ url: '/gridy' });

		var wrapper = $this.parent();

		// then
	    expect(wrapper.children('input[name="page"]')).toExist();
	    expect(wrapper.children('input[name="sortName"]')).toExist();
	    expect(wrapper.children('input[name="sortOrder"]')).toExist();
	});

	it ('hidden field should have default values', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({ url: '/gridy' });

		var $page		= $('input[name="page"]'),
			$sortName	= $('input[name="sortName"]'),
			$sortOrder	= $('input[name="sortOrder"]');

		// then
	    expect($page).toHaveValue('1');
	    expect($sortName).toHaveValue('');
	    expect($sortOrder).toHaveValue('asc');
	});

	it ('hidden field should have custom values', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			page:		2,
			sortName:	'id',
			sortOrder:	'desc',
			url:		'/gridy'
		});

		var $page		= $('input[name="page"]'),
			$sortName	= $('input[name="sortName"]'),
			$sortOrder	= $('input[name="sortOrder"]');
	
		// then
	    expect($page).toHaveValue('2');
	    expect($sortName).toHaveValue('id');
	    expect($sortOrder).toHaveValue('desc');
	});

	it ('template show be possible to change of template', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			template:	'template-custom',
			url:		'/gridy'
		});

		// then
	    expect($this.children().children().is('ul')).toBeTruthy();
	});

	it ('[global firstQuery] should not execute the first query', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			firstQuery	: false,
			url			: '/gridy'
		});

		// then
		var content = $this.children('tbody.gridy-content');
			rows	= content.children('tr'),
			message	= content.children('p');

		expect(rows.length).toEqual(0);
		expect(message).toHaveHtml('No search was performed yet!');
	});

	it ('[global noFirstQueryText] should be possible to change the "noFirstQueryText"', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns				: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			firstQuery			: false,
			noFirstQueryText	: 'Do a query!',
			url					: '/gridy'
		});

		// then
		var message = $this.children('tbody.gridy-content').children('p');

		expect(message).toHaveHtml('Do a query!');
	});

	it ('[global rowsNumber] should not duplicate the numbers', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			rowsNumber	: [10, 100, 1000, 10000],
			url			: '/gridy'
		});

		var options = $this.parent('div').children('.gridy-footer').children('.gridy-row-option').children('select').children('option');

		// then
		expect(options.length).toEqual(4);

		expect(options.eq(0)).toHaveValue('10');
		expect(options.eq(1)).toHaveValue('100');
		expect(options.eq(2)).toHaveValue('1000');
		expect(options.eq(3)).toHaveValue('10000');
		expect(options.eq(4)).not.toExist();
	});

});

describe('json format', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('total path should be possible change the path of the total', function() {
		// given
		var $this = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "count": {"total": 3}}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			totalPath:	'count.total'
		});

		var $result = $('.gridy-status').children('.gridy-result');

		expect($result).toHaveText('Displaying 01 - 01 of 03 items');
	});

	it ('searchButtonTitle have default value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'free',
			template:			'template-div',
			url:				'/gridy'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect(wrapper.children('input[type="button"]')).toHaveAttr('title', 'Start the search');
	});

	it ('[global listPath] should be possible change the path of the list node', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"data": {"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}]}, "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			listPath: 'data.list',
			url		: '/gridy'
		});

		// then
		var columns = $this.children('tbody.gridy-content').children('tr');

	    expect(columns.length == 3).toBeTruthy();
	});

	it ('should get the totalPath inside just one object', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"}], "totale": 1 }',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			rows		: 1,
			url			: '/gridy',
			totalPath	: 'totale'
		});

		// then
		expect($this.parent().find('.gridy-result')).toHaveHtml('Displaying 01 - 01 of 01 items');
	});

	it ('should get the totalPath inside a couple of objects', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"}], "total": { "subtotal": { "value": 1 } } }',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			rows		: 1,
			url			: '/gridy',
			totalPath	: 'total.subtotal.value'
		});

		// then
		expect($this.parent().find('.gridy-result')).toHaveHtml('Displaying 01 - 01 of 01 items');
	});

});

describe('free', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('wrapper should be set', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy'
		});

		// then
	    expect($this.parent()).toHaveClass('gridy');
	    expect($this.parent()).toHaveId('grid-wrapper');
	});

	it ('content should be created', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy'
		});

		// then
		expect($this.children('.gridy-content')).toExist();
	});

	it ('content should has height and width as auto', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy'
		});

		var $content = $this.children('.gridy-content');

		// then
	    expect($content).toHaveAttr('style', 'height: auto; width: auto;');
	});

	it ('column should have the right count', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style	: 'free',
			template: 'template-div',
			url		: '/gridy'
		});

		var columns = $this.children('.gridy-content').children('div:first').children('div');

		// then
	    expect(columns.length == 4).toBeTruthy();
	});

	it ('row should have the right count', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy'
		});

		var columns = $this.children('.gridy-content').children('div');

		// then
	    expect(columns.length == 3).toBeTruthy();
	});

	it ('row should have separate class on the first one', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy'
		});

		// then
		var columns = $this.children('.gridy-content').children();

	    expect(columns.eq(0)).toHaveClass('gridy-separate');
	});

	it ('width should set it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			width:		1000
		});

		// then
	    expect($this).toHaveAttr('style', 'width: 1000px;');
	});

	it ('skin should be possible to change', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			skin:		'skin'
		});

		// then
	    expect($this.parent()).toHaveClass('skin');
	});

	it ('[free columns] should create "headers" taking values from "columns"', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', value: 'id', width: 100, clazz: 'a' },
			    { name: 'Nick', value: 'username', width: 100, clazz: 'b' },
			    { name: 'Name', value: 'name', width: 100, clazz: 'c' }
			],
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy',
		});

		// then

		var header	= $this.children('div.gridy-header');
			headers	= header.children();

		expect(header).toExist();

		expect(headers.eq(0)).toExist();
		expect(headers.eq(0).children('a')).toHaveHtml('ID');
		expect(headers.eq(0)).toHaveClass('a');

		expect(headers.eq(1)).toExist();
		expect(headers.eq(1).children('a')).toHaveHtml('Nick');
		expect(headers.eq(1)).toHaveClass('b');

		expect(headers.eq(2)).toExist();
		expect(headers.eq(2).children('a')).toHaveHtml('Name');
		expect(headers.eq(2)).toHaveClass('c');
	});

	it ('[free headers] should gives preference for "headers" options instead for "columns"', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', value: 'id', width: 100, clazz: 'a' },
			    { name: 'Nick', value: 'username', width: 100, clazz: 'b' },
			    { name: 'Name', value: 'name', width: 100, clazz: 'c' }
			],
			headers		: [
	   		   { name: 'ID2', value: 'id2', width: 200, clazz: 'a2' },
	   		   { name: 'Nick2', value: 'username2', width: 200, clazz: 'b2' },
	   		   { name: 'Name2', value: 'name2', width: 200, clazz: 'c2' }
   		   ],
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy',
		});

		// then

		var header	= $this.children('div.gridy-header');
			headers	= header.children();

		expect(header).toExist();

		expect(headers.eq(0)).toExist();
		expect(headers.eq(0).children('a')).toHaveHtml('ID2');
		expect(headers.eq(0)).toHaveClass('a2');

		expect(headers.eq(1)).toExist();
		expect(headers.eq(1).children('a')).toHaveHtml('Nick2');
		expect(headers.eq(1)).toHaveClass('b2');

		expect(headers.eq(2)).toExist();
		expect(headers.eq(2).children('a')).toHaveHtml('Name2');
		expect(headers.eq(2)).toHaveClass('c2');
	});

	it ('[free columns] should keep your own width', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { width: 100 },
			    { width: 100 },
			    { width: 100 }
			],
			headers		: [
	   		   { width: 200 },
	   		   { width: 200 },
	   		   { width: 200 }
   		   ],
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy',
		});

		// then
		var rows = $this.children('div.gridy-content').children('div:first').children('div');
	
		// then
		expect(rows.eq(0)).toHaveAttr('style', 'width: 100px;');
		expect(rows.eq(1)).toHaveAttr('style', 'width: 100px;');
		expect(rows.eq(2)).toHaveAttr('style', 'width: 100px;');
	});

	it ('header should create the columns', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
						    { name: 'ID', value: 'id', width: 100 },
						    { name: 'Nick', value: 'nick', width: 100 },
						    { name: 'Name', value: 'name', width: 100 }
						]
		});

		var columns = $this.children('.gridy-header').children();

		// then
		expect(columns.length == 3).toBeTruthy();
	});

	it ('header column should have right width', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		var columnsHeader = $this.children('div.gridy-header').children('div');

		// then
		expect(columnsHeader.eq(0)).toHaveAttr('style', 'width: 100px;');
		expect(columnsHeader.eq(1)).toHaveAttr('style', 'width: 100px;');
		expect(columnsHeader.eq(2)).toHaveAttr('style', 'width: 100px;');
	});

	it ('header column should have the right disable icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		var columnsHeader = $this.children('div.gridy-header').children('div');

		// then
		expect(columnsHeader.eq(0).children('div')).toHaveClass('gridy-arrow-none');
		expect(columnsHeader.eq(1).children('div')).toHaveClass('gridy-arrow-none');
		expect(columnsHeader.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('header column should have the right link info', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
						    { name: 'ID', value: 'id', width: 100 },
						    { name: 'Nick', value: 'nick', width: 100 },
						    { name: 'Name', value: 'name', width: 100 }
						]
		});

		var columnsHeader	= $this.children('div.gridy-header').children('div'),
			$link1			= columnsHeader.eq(0).children('a'),
			$link2			= columnsHeader.eq(1).children('a'),
			$link3			= columnsHeader.eq(2).children('a');


		// then
		expect($link1).toHaveId('sort-by-id');
		expect($link1).toHaveAttr('href', 'javascript:void(0);');
		expect($link1).toHaveAttr('name', 'id');
		expect($link1).toHaveText('ID');
		expect($link1).not.toHaveAttr('rel');

		expect($link2).toHaveId('sort-by-nick');
		expect($link2).toHaveAttr('href', 'javascript:void(0);');
		expect($link2).toHaveAttr('name', 'nick');
		expect($link2).toHaveText('Nick');
		expect($link2).not.toHaveAttr('rel');

		expect($link3).toHaveId('sort-by-name');
		expect($link3).toHaveAttr('href', 'javascript:void(0);');
		expect($link3).toHaveAttr('name', 'name');
		expect($link3).toHaveText('Name');
		expect($link3).not.toHaveAttr('rel');
	});

	it ('header should not exist for default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy'
		});

		// then
		expect($this).not.toContain('div.gridy-header');
	});

	it ('gridy-status should exist for default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy'
		});

		var $status = $this.parent().children('div.gridy-status');

		// then
		expect($status).toExist();
	});

	it ('messageOption should exist for default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy'
		});

		var $status = $this.parent().children('div.gridy-status');

		// then
		expect($status.children('div.gridy-result')).toExist();
	});

	it ('statusText should have default mask', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy'
		});

		var $result = $this.parent().find('div.gridy-result');

		// then
		expect($result).toHaveHtml('Displaying 01 - 01 of 03 items');
	});

	it ('statusText should be turned off', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			statusOption:	false
		});

		var wrapper = $this.parent();

		// then
		expect(wrapper).not.toContain('div.gridy-result');
	});

	it ('statusText should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			statusText:		'Pagee {from} -- {to} off {total} itemss'
		});

		var $result = $this.parent().find('div.gridy-result');

		// then
		expect($result).toHaveHtml('Pagee 01 -- 01 off 03 itemss');
	});

	it ('loadingOption should be enabled for default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy'
		});

		var wrapper = $this.parent().children('div.gridy-status');

		// then
		expect(wrapper.children('div.gridy-loading')).toExist();
		expect(wrapper.children('div.gridy-loading').children('div')).toExist();
	});

	it ('loadingOption should be turned off', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			loadingOption:	false
		});

		var wrapper = $this.parent().children('div.gridy-status');

		// then
		expect(wrapper.children('div.gridy-loading')).not.toExist();
	});

	it ('loadingText should be the default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy'
		});

		var wrapper = $this.parent().find('div.gridy-loading');

		// then
		expect(wrapper).toHaveText('Loading...');
	});

	it ('loadingText should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			loadingText:	'Wait...'
		});

		var wrapper = $this.parent().find('div.gridy-loading');

		// then
		expect(wrapper).toHaveText('Wait...');
	});

	it ('searchOption should exist by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'free',
			template:			'template-div',
			url:				'/gridy'
		});

		var wrapper = $this.parent();

		// then
		expect(wrapper.children('div.gridy-search')).toExist();
		expect(wrapper.children('div.gridy-search').children('div.gridy-search-content').children('input[type="text"]')).toExist();
		expect(wrapper.children('div.gridy-search').children('div.gridy-search-content').children('input[type="button"]')).toExist();
	});

	it ('searchButtonLabel should have default value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'free',
			template:			'template-div',
			url:				'/gridy'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect(wrapper.children('input[type="button"]')).toHaveValue('search');
	});

	it ('searchButtonLabel should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'free',
			template:			'template-div',
			url:				'/gridy',
			searchButtonLabel:	'find'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect(wrapper.children('input[type="button"]')).toHaveValue('find');
	});

	it ('searchButtonTitle have default value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'free',
			template:			'template-div',
			url:				'/gridy'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect(wrapper.children('input[type="button"]')).toHaveAttr('title', 'Start the search');
	});

	it ('searchButtonTitle should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy',
			searchButtonTitle:	'type here...'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect(wrapper.children('input[type="button"]')).toHaveAttr('title', 'type here...');
	});

	it ('searchFocus have default value and focus it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'free',
			template:			'template-div',
			url:				'/gridy'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		//expect(wrapper.children('input[type="text"]')).toBeFocused();
		expect(wrapper.children('input[type="text"]')).toHaveClass('gridy-typed');
	});

	it ('searchTarget should put it on target', function() {
		$('body').append('<div id="target"></div>');

		// given
		var $this	= $('#grid'),
			$target	= $('#target');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			searchTarget:	'#target'
		});

		var wrapper = $this.parent();

		// then
		expect(wrapper.children('.gridy-search')).not.toExist();
		expect($target.children('.gridy-search')).toExist();

		$('#target').remove();
	});

	it ('gridy-footer should exists by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy'
		});

		var wrapper = $this.parent().children('div.gridy-footer');

		// then
		expect(wrapper).toExist();
	});

	it ('gridy-message should exists by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url: 		'/gridy'
		});

		var wrapper = $this.parent().children('.gridy-footer');

		// then
		expect(wrapper.children('div.gridy-message')).toExist();
	});

	it ('gridy-buttons should exists when has more then one page', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url: 		'/gridy',
			rows:		1
		});

		var $buttonsWrapper = $this.parent().children('.gridy-buttons'),
			$buttonsContent	= $buttonsWrapper.children('.gridy-buttons-content'),
			$buttons		= $buttonsContent.children('input[type="button"]');

		// then
		expect($buttonsWrapper).toExist();
		expect($buttonsContent).toExist();
		expect($buttons.length == 3).toBeTruthy();
		expect($buttons.eq(0)).toHaveClass('gridy-button-active');
		expect($buttons.eq(0)).toHaveAttr('title', 'Page 01');
		expect($buttons.eq(0)).toHaveAttr('alt', '01');
		expect($buttons.eq(0)).toHaveAttr('value', '01');
		expect($buttons.eq(1)).not.toHaveClass('gridy-button-active');
		expect($buttons.eq(1)).toHaveAttr('title', 'Page 02');
		expect($buttons.eq(1)).toHaveAttr('alt', '02');
		expect($buttons.eq(1)).toHaveAttr('value', '02');
		expect($buttons.eq(2)).not.toHaveClass('gridy-button-active');
		expect($buttons.eq(2)).toHaveAttr('title', 'Page 03');
		expect($buttons.eq(2)).toHaveAttr('alt', '03');
		expect($buttons.eq(2)).toHaveAttr('value', '03');
	});

	it ('resize should be on by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url: 		'/gridy',
			width:		100
		});

		var wrapper	= $this.parent(),
			$search		= wrapper.children('.gridy-search'),
			$status		= wrapper.children('.gridy-status'),
			$footer		= wrapper.children('.gridy-footer'),
			$buttons	= wrapper.children('.gridy-buttons');

		// then
		expect($search).toHaveAttr('style', 'width: 100px;');
		expect($status).toHaveAttr('style', 'width: 100px;');
		expect($this).toHaveAttr('style', 'width: 100px;');
		expect($footer).toHaveAttr('style', 'width: 100px;');
		expect($buttons).toHaveAttr('style', 'width: 100px;');
	});

	it ('resize should not resize', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url: 		'/gridy',
			resize:		false,
			width:		100
		});

		var wrapper	= $this.parent(),
			$search		= wrapper.children('.gridy-search'),
			$status		= wrapper.children('.gridy-status'),
			$footer		= wrapper.children('.gridy-footer'),
			$buttons	= wrapper.children('.gridy-buttons');

		// then
		expect($search).not.toHaveAttr('style');
		expect($status).not.toHaveAttr('style');
		expect($this).toHaveAttr('style', 'width: 100px;');
		expect($footer).not.toHaveAttr('style');
		expect($buttons).not.toHaveAttr('style');
	});

	it ('rowsNumber should come with default numbers', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url: 		'/gridy'
		});

		var $rowsNumber = $this.parent().children('.gridy-footer').find('select').children('option');

		// then
		expect($rowsNumber.eq(0)).toHaveValue('5');
		expect($rowsNumber.eq(0)).toHaveHtml('05');
		expect($rowsNumber.eq(1)).toHaveValue('10');
		expect($rowsNumber.eq(1)).toHaveHtml('10');
		expect($rowsNumber.eq(1)).toBeChecked();
		expect($rowsNumber.eq(2)).toHaveValue('25');
		expect($rowsNumber.eq(2)).toHaveHtml('25');
		expect($rowsNumber.eq(3)).toHaveValue('50');
		expect($rowsNumber.eq(3)).toHaveHtml('50');
		expect($rowsNumber.eq(4)).toHaveValue('100');
		expect($rowsNumber.eq(4)).toHaveHtml('100');
	});

	it ('rowsNumber should change the numbers', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url: 		'/gridy',
			rowsNumber:	[1, 10, 20]
		});

		var $rowsNumber = $this.parent().children('.gridy-footer').find('select').children('option');

		// then
		expect($rowsNumber.eq(0)).toHaveValue('1');
		expect($rowsNumber.eq(0)).toHaveHtml('01');
		expect($rowsNumber.eq(1)).toHaveValue('10');
		expect($rowsNumber.eq(1)).toHaveHtml('10');
		expect($rowsNumber.eq(1)).toBeChecked();
		expect($rowsNumber.eq(2)).toHaveValue('20');
		expect($rowsNumber.eq(2)).toHaveHtml('20');
	});

	it ('rowsTarget should put it on target', function() {
		$('body').append('<div id="target"></div>');

		// given
		var $this	= $('#grid'),
			$target	= $('#target');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			rowsTarget:	'#target'
		});

		var wrapper = $this.parent();

		// then
		expect(wrapper.children('.gridy-row-option')).not.toExist();
		expect($target.children('.gridy-row-option')).toExist();

		$('#target').remove();
	});

	it ('[free findTarget] should put it into target', function() {

		// given
		var $this	= $('#grid'),
			target	= $('<div id="target" />').appendTo('body');

		// when
		$this.gridy({
			find		: 'id',
			finds		: [ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
			findTarget	: '#target',
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy'
		});

		// then
		expect($this.parent('div.grid-wrapper').children('.gridy-search').find('.gridy-find-option')).not.toExist();
		expect(target.children('.gridy-find-option')).toExist();

		target.remove();
	});

	it ('finds should changes the finds name and add the default empty find', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			finds:		[ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
		});

		var $findOptions = $this.parent().find('.gridy-find-option').find('option');

		// then
		expect($findOptions).toExist();
		expect($findOptions.eq(0)).toHaveValue('');
		expect($findOptions.eq(0)).toHaveHtml('');
		expect($findOptions.eq(0)).toBeChecked();
		expect($findOptions.eq(1)).toHaveValue('id');
		expect($findOptions.eq(1)).toHaveHtml('ID');
		expect($findOptions.eq(2)).toHaveValue('nick');
		expect($findOptions.eq(2)).toHaveHtml('Nick');
		expect($findOptions.eq(3)).toHaveValue('name');
		expect($findOptions.eq(3)).toHaveHtml('Name');
	});

	it ('finds should select the default find value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			finds:		[ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
			find:		'nick'
		});

		var $findOptions = $this.parent().find('.gridy-find-option').find('option');

		// then
		expect($findOptions).toExist();
		expect($findOptions.eq(0)).toHaveValue('id');
		expect($findOptions.eq(0)).toHaveHtml('ID');
		expect($findOptions.eq(1)).toHaveValue('nick');
		expect($findOptions.eq(1)).toHaveHtml('Nick');
		expect($findOptions.eq(1)).toBeChecked();
		expect($findOptions.eq(2)).toHaveValue('name');
		expect($findOptions.eq(2)).toHaveHtml('Name');
	});

	it ('searchText should set a default text', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			searchText:	'Text here...'
		});

		var $field = $this.parent().find('.gridy-search').find('input[type="text"]');

		$field.blur();

		// then
		expect($field).toHaveAttr('title', 'Text here...');
		expect($field).toHaveValue('Text here...');
	});

	it ('hoverFx should not apply effect for default', function() {
		// given
		var $this	= $('#grid').gridy({
			style	: 'free',
			template: 'template-div',
			url		: '/gridy'
		}),
		$row		= $this.children('.gridy-content').children('div:first');

		// when
		$row.mouseover();

		// then
		expect($row).not.toHaveClass('gridy-row-hovered');
	});

	it ('hoverFx should apply effect', function() {
		// given
		var $this	= $('#grid').gridy({
			style	: 'free',
			template: 'template-div',
			url		: '/gridy',
			hoverFx	: true
		}),
		$row		= $this.children('.gridy-content').children('div:first');

		// when
		$row.mouseover();

		// then
		expect($row).toHaveClass('gridy-row-hovered');
	});

	it ('columns should set the name of the heads', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('a')).toHaveHtml('ID');
	    expect(headers.eq(1).children('a')).toHaveHtml('Nick');
	    expect(headers.eq(2).children('a')).toHaveHtml('Name');
	});

	it ('headersWith should set the width of the heads', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 110 },
			    { name: 'Name', value: 'name', width: 120 }
			]
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0)).toHaveAttr('style', 'width: 100px;');
	    expect(headers.eq(1)).toHaveAttr('style', 'width: 110px;');
	    expect(headers.eq(2)).toHaveAttr('style', 'width: 120px;');
	});

	it ('arrowNone should to use none arrow at first', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowNone should to change this icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			arrowNone:		'arrow-none'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('arrow-none');
	    expect(headers.eq(1).children('div')).toHaveClass('arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('arrow-none');
	});
	
	it ('arrowUp should to use it on asc sort', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			sortName:		'id'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-up');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowUp should to change this arrow', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			sortName:		'id',
			arrowUp:		'arrow-up'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('arrow-up');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowDown should to change this arrow', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			sortName:		'id',
			sortOrder:		'desc',
			arrowDown:		'arrow-down'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('arrow-down');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowDown should to use it on asc sort', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			sortName:		'id',
			sortOrder:		'desc'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-down');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('evenOdd should apply it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			evenOdd:	true
		});

		// then
		var $rows = $this.children('.gridy-content').children();

	    expect($rows.eq(0)).toHaveClass('gridy-even');
	    expect($rows.eq(1)).toHaveClass('gridy-odd');
	    expect($rows.eq(2)).toHaveClass('gridy-even');
	});

	it ('separate should not have separate class on the first one', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			separate:	false
		});

		var columns = $this.children('.gridy-content').children();

		// then
	    expect(columns.eq(0)).not.toHaveClass('gridy-separate');
	});

	it ('clickFx should enable it', function() {
		// given
		var $this = $('#grid').gridy({
			style	: 'free',
			template: 'template-div',
			url		: '/gridy',
			clickFx	: true
		});

		// when
		var row = $this.children('div.gridy-content').children('div:first').click();

		// then
		expect(row).toHaveClass('gridy-row-selected');
	});

	it ('clickFx should enable it', function() {
		// given
		var $this = $('#grid').gridy({
			style	: 'free',
			template: 'template-div',
			url		: '/gridy'
		});

		// when
		var row = $this.children('div.gridy-content').children('div:first').click();

		// then
		expect(row).not.toHaveClass('gridy-row-selected');
	});	

	it ('should create refresh button', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url: 		'/gridy'
		});

		var refresher = $this.parent().find('.gridy-button-refresh');

		// then
		expect(refresher).toExist();
	});

	it ('refreshTarget should put it on target', function() {
		$('body').append('<div id="target"></div>');

		// given
		var $this	= $('#grid'),
			$target	= $('#target');

		// when
		$this.gridy({
			style			: 'free',
			template		: 'template-div',
			url				: '/gridy',
			refreshTarget	: '#target'
		});

		var wrapper = $this.parent();

		// then
		expect(wrapper.children('.gridy-footer').children('.gridy-button-refresh')).not.toExist();
		expect($target.children('.gridy-button-refresh')).toExist();

		$('#target').remove();
	});

	it ('[free columns] should set the first column without label', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('a')).toHaveHtml('');
	    expect(headers.eq(1).children('a')).toHaveHtml('Nick');
	    expect(headers.eq(2).children('a')).toHaveHtml('Name');
	});

	it ('[free columns] should set the first column without value (read only)', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('a')).toHaveHtml('ID');
	    expect(headers.eq(0).children('a')).toHaveClass('gridy-no-sort');
	});

	it ('[free columns] should set the first column with no sort icon (empty) when there is no name and it is not sorted', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-empty');
	});

	it ('[free columns] should set the first column with no name but with sorted icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			style		: 'free',
			template	: 'template-div',
			sortName	: 'id',
			url			: '/gridy'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-up');
	});

	it ('[free columns] should set width on headers and the same o rows when it is table style', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', value: 'id', width: 10 },
			    { name: 'Nick', value: 'nick', width: 20 },
			    { name: 'Name', value: 'name', width: 30 }
			],
			sortName	: 'id',
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy'
		});

		// then
		var headers	= $this.children('div.gridy-header').children('div');
			rows	= $this.children('div.gridy-content').children('div:first').children('div');

		// then
		expect(headers.eq(0)).toHaveAttr('style', 'width: 10px;');
		expect(headers.eq(1)).toHaveAttr('style', 'width: 20px;');
		expect(headers.eq(2)).toHaveAttr('style', 'width: 30px;');

		expect(rows.eq(0)).toHaveAttr('style', 'width: 10px;');
		expect(rows.eq(1)).toHaveAttr('style', 'width: 20px;');
		expect(rows.eq(2)).toHaveAttr('style', 'width: 30px;');
	});

});

describe('table', function() {

	beforeEach(function() {
		$('body').append('<table id="grid"></table>');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('wrapper should be set', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:	'/gridy'
		});

		// then
	    expect($this.parent()).toHaveClass('gridy-table');
	    expect($this.parent()).toHaveId('grid-wrapper');
	});

	it ('content should be created', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:	'/gridy'
		});

		// then
		expect($this.children('tbody.gridy-content')).toExist();
	});

	it ('content should NOT has height and width as auto', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:	'/gridy'
		});

		var $content = $this.children('tbody.gridy-content');

		// then
	    expect($content).not.toHaveAttr('style', 'height: auto; width: auto;');
	});

	it ('row should have the right count', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:	'/gridy'
		});

		var $rows = $this.children('tbody.gridy-content').children('tr');

		// then
	    expect($rows.length == 3).toBeTruthy();
	});

	it ('column should have the right count', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:	'/gridy'
		});

		var columns = $this.children('tbody.gridy-content').children('tr:first').children('td');

		// then
	    expect(columns.length == 4).toBeTruthy();
	});

	it ('row should NOT set class but use CSS by tr identification', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:	'/gridy'
		});

		var $rows = $this.children('tbody.gridy-content').children();

		// then
	    expect($rows.eq(0)).not.toHaveAttr('class');
	    expect($rows.eq(1)).not.toHaveAttr('class');
	    expect($rows.eq(2)).not.toHaveAttr('class');
	});

	it ('row should have separate class on the first tds', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:	'/gridy'
		});

		var $row = $this.children('.gridy-content').children('tr:first');

		// then
	    expect($row.children('td')).toHaveClass('gridy-separate');
	});

	it ('width should set it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:		'/gridy',
			width:		1000
		});

		// then
	    expect($this).toHaveAttr('style', 'width: 1000px;');
	});

	it ('skin should be possible to change', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:	'/gridy',
			skin:	'skin'
		});

		// then
	    expect($this.parent()).toHaveClass('skin-table');
	});

	it ('header should create it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		// then
		expect($this.children('thead.gridy-header')).toExist();
	    expect($this.children().eq(0)).toHaveClass('gridy-header');
	});

	it ('header should create the columns', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		var columns = $this.children('.gridy-header').children();

		// then
		expect(columns.length == 3).toBeTruthy();
	});

	it ('header column should have right width', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		var columnsHeader = $this.children('thead.gridy-header').children('th');

		// then
		expect(columnsHeader.eq(0)).toHaveAttr('width', '100');
		expect(columnsHeader.eq(1)).toHaveAttr('width', '100');
		expect(columnsHeader.eq(2)).toHaveAttr('width', '100');
	});

	it ('header column should have the right disable icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		var columnsHeader = $this.children('thead.gridy-header').children('th');

		// then
		expect(columnsHeader.eq(0).children('div')).toHaveClass('gridy-arrow-none');
		expect(columnsHeader.eq(1).children('div')).toHaveClass('gridy-arrow-none');
		expect(columnsHeader.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('header column should have the right link info', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		var columnsHeader	= $this.children('thead.gridy-header').children('th'),
			$link1			= columnsHeader.eq(0).children('a'),
			$link2			= columnsHeader.eq(1).children('a'),
			$link3			= columnsHeader.eq(2).children('a');

		// then
		expect($link1).toHaveId('sort-by-id');
		expect($link1).toHaveAttr('href', 'javascript:void(0);');
		expect($link1).toHaveAttr('name', 'id');
		expect($link1).toHaveText('ID');
		expect($link1).not.toHaveAttr('rel');

		expect($link2).toHaveId('sort-by-nick');
		expect($link2).toHaveAttr('href', 'javascript:void(0);');
		expect($link2).toHaveAttr('name', 'nick');
		expect($link2).toHaveText('Nick');
		expect($link2).not.toHaveAttr('rel');

		expect($link3).toHaveId('sort-by-name');
		expect($link3).toHaveAttr('href', 'javascript:void(0);');
		expect($link3).toHaveAttr('name', 'name');
		expect($link3).toHaveText('Name');
		expect($link3).not.toHaveAttr('rel');
	});

	it ('header should not exist for default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({ url: '/gridy' });

		// then
		expect($this).not.toContain('thead.gridy-header');
	});

	it ('gridy-status should exist for default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({ url: '/gridy' });

		// then
		expect($this.parent().children('div.gridy-status')).toExist();
	});

	it ('messageOption should exist for default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy'
		});

		var $status = $this.parent().children('div.gridy-status');
		// then
		expect($status.children('div.gridy-result')).toExist();
	});

	it ('statusText should have default mask', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({ url: '/gridy' });

		var $result = $this.parent().find('div.gridy-result');

		// then
		expect($result).toHaveHtml('Displaying 01 - 01 of 03 items');
	});

	it ('statusText should be turned off', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url			: '/gridy',
			statusOption: false
		});

		var wrapper = $this.parent();

		// then
		expect(wrapper).not.toContain('div.gridy-result');
	});

	it ('statusText should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			statusText	: 'Pagee {from} -- {to} off {total} itemss',
			url			: '/gridy'
		});

		var $result = $this.parent().find('div.gridy-result');

		// then
		expect($result).toHaveHtml('Pagee 01 -- 01 off 03 itemss');
	});

	it ('loadingOption should be enabled for default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy'
		});

		var wrapper = $this.parent().children('div.gridy-status');

		// then
		expect(wrapper.children('div.gridy-loading')).toExist();
		expect(wrapper.children('div.gridy-loading').children('div')).toExist();
	});

	it ('loadingOption should be turned off', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			loadingOption:	false
		});

		var wrapper = $this.parent().children('div.gridy-status');

		// then
		expect(wrapper).not.toContain('div.gridy-loading');
	});

	it ('loadingText should be the default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy'
		});

		var wrapper = $this.parent().find('div.gridy-loading');

		// then
		expect(wrapper).toHaveText('Loading...');
	});

	it ('loadingText should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			loadingText:	'Wait...'
		});

		var wrapper = $this.parent().find('div.gridy-loading');

		// then
		expect(wrapper).toHaveText('Wait...');
	});

	it ('searchOption should exist by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy'
		});

		var wrapper = $this.parent();

		// then
		expect(wrapper.children('div.gridy-search')).toExist();
		expect(wrapper.children('div.gridy-search').children('div.gridy-search-content').children('input[type="text"]')).toExist();
		expect(wrapper.children('div.gridy-search').children('div.gridy-search-content').children('input[type="button"]')).toExist();
	});

	it ('searchButtonLabel should have default value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect(wrapper.children('input[type="button"]')).toHaveValue('search');
	});

	it ('searchButtonLabel should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy',
			searchButtonLabel:	'find'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect(wrapper.children('input[type="button"]')).toHaveValue('find');
	});

	it ('searchButtonTitle should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy',
			searchButtonTitle:	'type here...'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect(wrapper.children('input[type="button"]')).toHaveAttr('title', 'type here...');
	});

	it ('searchFocus have default value and focus it', function() {
		// given
		var $this = $('#grid').wrap('<div/>');

		// when
		$this.gridy({
			url: '/gridy'
		});

		var wrapper = $this.parent().find('.gridy-search-content');

		// then
		//expect(wrapper.children('input[type="text"]')).toBeFocused();
		expect(wrapper.children('input[type="text"]')).toHaveClass('gridy-typed');
	});

	it ('searchTarget should put it on target', function() {
		$('body').append('<div id="target"></div>');

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			searchTarget:	'#target'
		});

		var wrapper = $this.parent();

		// then
		expect(wrapper.children('.gridy-search')).not.toExist();
		expect($('#target').children('.gridy-search')).toExist();

		$('#target').remove();
	});

	it ('gridy-footer should exists by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url: '/gridy'
		});

		var wrapper = $this.parent().children('div.gridy-footer');

		// then
		expect(wrapper).toExist();
	});

	it ('gridy-message should exists by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url: '/gridy'
		});

		var wrapper = $this.parent().children('.gridy-footer');

		// then
		expect(wrapper.children('div.gridy-message')).toExist();
	});

	it ('gridy-buttons should exists when has more then one page', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url: 		'/gridy',
			rows:		1
		});

		var $buttonsWrapper = $this.parent().children('.gridy-buttons'),
			$buttonsContent	= $buttonsWrapper.children('.gridy-buttons-content'),
			$buttons		= $buttonsContent.children('input[type="button"]');

		// then
		expect($buttonsWrapper).toExist();
		expect($buttonsContent).toExist();
		expect($buttons.length == 3).toBeTruthy();
		expect($buttons.eq(0)).toHaveClass('gridy-button-active');
		expect($buttons.eq(0)).toHaveAttr('title', 'Page 01');
		expect($buttons.eq(0)).toHaveAttr('alt', '01');
		expect($buttons.eq(0)).toHaveAttr('value', '01');
		expect($buttons.eq(1)).not.toHaveClass('gridy-button-active');
		expect($buttons.eq(1)).toHaveAttr('title', 'Page 02');
		expect($buttons.eq(1)).toHaveAttr('alt', '02');
		expect($buttons.eq(1)).toHaveAttr('value', '02');
		expect($buttons.eq(2)).not.toHaveClass('gridy-button-active');
		expect($buttons.eq(2)).toHaveAttr('title', 'Page 03');
		expect($buttons.eq(2)).toHaveAttr('alt', '03');
		expect($buttons.eq(2)).toHaveAttr('value', '03');
	});

	it ('resize should be on by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url: 		'/gridy',
			width:		100
		});

		var wrapper	= $this.parent(),
			$search		= wrapper.children('.gridy-search'),
			$status		= wrapper.children('.gridy-status'),
			$footer		= wrapper.children('.gridy-footer'),
			$buttons	= wrapper.children('.gridy-buttons');

		// then
		expect($search).toHaveAttr('style', 'width: 100px;');
		expect($status).toHaveAttr('style', 'width: 100px;');
		expect($this).toHaveAttr('style', 'width: 100px;');
		expect($footer).toHaveAttr('style', 'width: 100px;');
		expect($buttons).toHaveAttr('style', 'width: 100px;');
	});

	it ('resize should not resize', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url: 		'/gridy',
			resize:		false,
			width:		100
		});

		var wrapper	= $this.parent(),
			$search		= wrapper.children('.gridy-search'),
			$status		= wrapper.children('.gridy-status'),
			$footer		= wrapper.children('.gridy-footer'),
			$buttons	= wrapper.children('.gridy-buttons');

		// then
		expect($search).not.toHaveAttr('style');
		expect($status).not.toHaveAttr('style');
		expect($this).toHaveAttr('style', 'width: 100px;');
		expect($footer).not.toHaveAttr('style');
		expect($buttons).not.toHaveAttr('style');
	});

	it ('rowsNumber should come with default numbers', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({ url: '/gridy' });

		var $rowsNumber = $this.parent().children('.gridy-footer').find('select').children('option');

		// then
		expect($rowsNumber.eq(0)).toHaveValue('5');
		expect($rowsNumber.eq(0)).toHaveHtml('05');
		expect($rowsNumber.eq(1)).toHaveValue('10');
		expect($rowsNumber.eq(1)).toHaveHtml('10');
		expect($rowsNumber.eq(1)).toBeChecked();
		expect($rowsNumber.eq(2)).toHaveValue('25');
		expect($rowsNumber.eq(2)).toHaveHtml('25');
		expect($rowsNumber.eq(3)).toHaveValue('50');
		expect($rowsNumber.eq(3)).toHaveHtml('50');
		expect($rowsNumber.eq(4)).toHaveValue('100');
		expect($rowsNumber.eq(4)).toHaveHtml('100');
	});

	it ('rowsNumber should change the numbers', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url: 		'/gridy',
			rowsNumber:	[1, 10, 20]
		});

		var $rowsNumber = $this.parent().children('.gridy-footer').find('select').children('option');

		// then
		expect($rowsNumber.eq(0)).toHaveValue('1');
		expect($rowsNumber.eq(0)).toHaveHtml('01');
		expect($rowsNumber.eq(1)).toHaveValue('10');
		expect($rowsNumber.eq(1)).toHaveHtml('10');
		expect($rowsNumber.eq(1)).toBeChecked();
		expect($rowsNumber.eq(2)).toHaveValue('20');
		expect($rowsNumber.eq(2)).toHaveHtml('20');
	});

	it ('rowsTarget should put it on target', function() {
		$('body').append('<div id="target"></div>');

		// given
		var $this	= $('#grid'),
			$target	= $('#target');

		// when
		$this.gridy({
			url:		'/gridy',
			rowsTarget:	'#target'
		});

		var wrapper = $this.parent();

		// then
		expect(wrapper.children('.gridy-row-option')).not.toExist();
		expect($target.children('.gridy-row-option')).toExist();

		$('#target').remove();
	});

	it ('[table findTarget] should put it into target', function() {

		// given
		var $this	= $('#grid'),
			target	= $('<div id="target" />').appendTo('body');

		// when
		$this.gridy({
			find		: 'id',
			finds		: [ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
			findTarget	: '#target',
			url			: '/gridy'
		});

		// then
		expect($this.parent('div.grid-wrapper').children('div.gridy-search').children('div.gridy-find-option')).not.toExist();
		expect(target.children('div.gridy-find-option')).toExist();

		target.remove();
	});

	it ('finds should changes the finds name and add the default empty find', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:		'/gridy',
			finds:		[ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
		});

		var $findOptions = $this.parent().find('.gridy-find-option').find('option');

		// then
		expect($findOptions).toExist();
		expect($findOptions.eq(0)).toHaveValue('');
		expect($findOptions.eq(0)).toHaveHtml('');
		expect($findOptions.eq(0)).toBeChecked();
		expect($findOptions.eq(1)).toHaveValue('id');
		expect($findOptions.eq(1)).toHaveHtml('ID');
		expect($findOptions.eq(2)).toHaveValue('nick');
		expect($findOptions.eq(2)).toHaveHtml('Nick');
		expect($findOptions.eq(3)).toHaveValue('name');
		expect($findOptions.eq(3)).toHaveHtml('Name');
	});

	it ('finds should select the default find value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			finds:		[ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
			find:		'nick'
		});

		var $findOptions = $this.parent().find('.gridy-find-option').find('option');

		// then
		expect($findOptions).toExist();
		expect($findOptions.eq(0)).toHaveValue('id');
		expect($findOptions.eq(0)).toHaveHtml('ID');
		expect($findOptions.eq(1)).toHaveValue('nick');
		expect($findOptions.eq(1)).toHaveHtml('Nick');
		expect($findOptions.eq(1)).toBeChecked();
		expect($findOptions.eq(2)).toHaveValue('name');
		expect($findOptions.eq(2)).toHaveHtml('Name');
	});

	it ('searchText should set a default text', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:		'/gridy',
			searchText:	'Text here...'
		});

		var $field = $this.parent().find('.gridy-search').find('input[type="text"]');

		$field.blur();

		// then
		expect($field).toHaveAttr('title', 'Text here...');
		expect($field).toHaveValue('Text here...');
	});

	it ('hoverFx should not apply effect for default', function() {
		// given
		var $this	= $('#grid').gridy({ url: '/gridy' }),
			$row	= $this.find('tr:first');

		// when
		$row.children(':first').mouseover();

		// then
		expect($row).not.toHaveClass('gridy-row-hovered');
	});

	it ('hoverFx should apply effect', function() {
		// given
		var $this = $('#grid').gridy({
			url:		'/gridy',
			hoverFx:	true
		}),

		$row = $this.find('tr:first');

		// when
		$row.children(':first').mouseover();

		// then
		expect($row).toHaveClass('gridy-row-hovered');
	});	

	it ('columns should set the name of the heads', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url			: '/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('a')).toHaveHtml('ID');
	    expect(headers.eq(1).children('a')).toHaveHtml('Nick');
	    expect(headers.eq(2).children('a')).toHaveHtml('Name');
	});

	it ('headersWith should set the width of the heads', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url			: '/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 110 },
			    { name: 'Name', value: 'name', width: 120 }
			]
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0)).toHaveAttr('width', '100');
	    expect(headers.eq(1)).toHaveAttr('width', '110');
	    expect(headers.eq(2)).toHaveAttr('width', '120');
	});

	it ('arrowNone should to use none arrow at first', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			]
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	
	it ('arrowNone should to change this icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			arrowNone:		'arrow-none'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('arrow-none');
	    expect(headers.eq(1).children('div')).toHaveClass('arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('arrow-none');
	});

	it ('arrowUp should to use it on asc sort', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			sortName:		'id'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-up');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowUp should to change this arrow', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			sortName:		'id',
			arrowUp:		'arrow-up'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('arrow-up');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowDown should to change this arrow', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			sortName:		'id',
			sortOrder:		'desc',
			arrowDown:		'arrow-down'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('arrow-down');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowDown should to use it on asc sort', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			sortName:		'id',
			sortOrder:		'desc'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-down');
	    expect(headers.eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect(headers.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('evenOdd should apply it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:		'/gridy',
			evenOdd:	true
		});

		// then
		var $rows = $this.find('tr');

	    expect($rows.eq(0)).toHaveAttr('class', 'gridy-even');
	    expect($rows.eq(1)).toHaveAttr('class', 'gridy-odd');
	    expect($rows.eq(2)).toHaveAttr('class', 'gridy-even');
	});

	it ('separate should not have separate class on the first one', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			separate:	false
		});

		var columns = $this.children('.gridy-content').children();

		// then
	    expect(columns.eq(0)).not.toHaveClass('gridy-separate');
	});

	it ('clickFx should enable it', function() {
		// given
		var $this = $('#grid').gridy({
			url:		'/gridy',
			clickFx:	true
		});

		var row = $this.find('tr:first');

		// when
		row.click();

		// then
		expect(row).toHaveClass('gridy-row-selected');
	});

	it ('clickFx should not be enabled by default', function() {
		// given
		var $this = $('#grid').gridy({
			url:		'/gridy',
			clickFx:	true
		});

		// when
		var row = $this.find('.gridy-row:first').click();

		// then
		expect(row).not.toHaveClass('gridy-row-selected');
	});

	it ('should create refresh button', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			template:	'template-div',
			url: 		'/gridy'
		});

		var refresher = $this.parent().find('.gridy-button-refresh');

		// then
		expect(refresher).toExist();
	});

	it ('[table columns] should set the first column with no label', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns	: [
			    { value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			url		: '/gridy'
		});

		// then
		var headers = $this.children('thead.gridy-header').children('th');

	    expect(headers.eq(0).children('a')).toHaveHtml('');
	    expect(headers.eq(1).children('a')).toHaveHtml('Nick');
	    expect(headers.eq(2).children('a')).toHaveHtml('Name');
	});

	it ('[table columns] should set the first column with no value (read only)', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			url			: '/gridy'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('a')).toHaveHtml('ID');
	    expect(headers.eq(0).children('a')).toHaveClass('gridy-no-sort');
	});

	it ('[table columns] should set the first column with no sort icon (empty) when there is no name and it is not sorted', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-empty');
	});

	it ('[table columns] should set the first column with no name but with sorted icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			sortName	: 'id',
			style		: 'free',
			template	: 'template-div',
			url			: '/gridy'
		});

		// then
		var headers = $this.children('.gridy-header').children();

	    expect(headers.eq(0).children('div')).toHaveClass('gridy-arrow-up');
	});

	it ('[table columns] should set width just on "headers" when it is table style', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', value: 'id', width: 10 },
			    { name: 'Nick', value: 'nick', width: 20 },
			    { name: 'Name', value: 'name', width: 30 }
			],
			sortName	: 'id',
			url			: '/gridy'
		});

		// then
		var headers	= $this.children('thead.gridy-header').children('th');
			rows	= $this.children('tbody.gridy-content').children('tr');

		// then
		expect(headers.eq(0)).toHaveAttr('width', '10');
		expect(headers.eq(1)).toHaveAttr('width', '20');
		expect(headers.eq(2)).toHaveAttr('width', '30');

		expect(rows.eq(0)).not.toHaveAttr('width');
		expect(rows.eq(1)).not.toHaveAttr('width');
		expect(rows.eq(2)).not.toHaveAttr('width');
	});

});

describe('style table with no result', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [], "total": 0}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete(xhr, 'status');
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('resultOption should be enabled by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:		'/gridy',
			finds:		[ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
		});

		var noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect(noResult).toExist();
		expect(noResult).toHaveHtml('No item was found!');
	});

	it ('resultOption should be disabled', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			finds			: [
			    { name: 'ID', value: 'id' },
			    { name: 'Nick', value: 'nick' },
			    { name: 'Name', value: 'name' }
			],
			resultOption	: false,
			url				: '/gridy'
		});

		var noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect(noResult).not.toExist();
	});

	it ('noResultText should change the text', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			finds:		[ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
			noResultText:	'No results!'
		});

		var noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect(noResult).toHaveHtml('No results!');
	});

});

describe('style div with no result', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [], "total": 0}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete(xhr, 'status');
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('resultOption should be enabled by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'free',
			template:	'template-div',
			url:		'/gridy',
			finds:		[ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
		});

		var noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect(noResult).toExist();
		expect(noResult).toHaveHtml('No item was found!');
	});

	it ('resultOption should be disabled', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			finds:		[ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
			resultOption: false
		});

		var noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect(noResult).not.toExist();
	});

	it ('noResultText should change the text', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'free',
			template:		'template-div',
			url:			'/gridy',
			finds:		[ { name: 'ID', value: 'id' }, { name: 'Nick', value: 'nick' }, { name: 'Name', value: 'name' } ],
			noResultText:	'No results!'
		});

		var noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect(noResult).toHaveHtml('No results!');
	});

});

describe('error settings', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('message should be displayed with responseText error', function() {
		// given
		var $this	= $('#grid'),
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.error(xhr, 'status', 'error');
		});

		// when
		$this.gridy({ url: '/gridy' });

		var message = $this.parent().find('.gridy-message');

		// then
		expect(message).toBeVisible(); 
		expect(message).toHaveText('responseText'); 
	});

	it ('message should be displayed with full statusText error when there is no responseText', function() {
		// given
		var $this	= $('#grid'),
			xhr		= { statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.error(xhr);
		});

		// when
		$this.gridy({ url: '/gridy' });

		var message = $this.parent().find('.gridy-message');

		// then
		expect(message).toBeVisible(); 
		expect(message).toHaveText('statusText'); 
	});

});

describe('ajax settings', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('cache should be changed', function() {
		// given
		var $this = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.cache).toBeTruthy();
		});

		// when
		$this.gridy({
			cache:	true,
			url:	'/gridy'
		});

		// then check spyOn
	});

	it ('contentType should be changed', function() {
		// given
		var $this = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.contentType == 'application/pdf').toBeTruthy();
		});

		// when
		$this.gridy({
			contentType:	'application/pdf',
			url:			'/gridy'
		});

		// then check spyOn
	});

	it ('dataType should be changed', function() {
		// given
		var $this = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.dataType == 'jsonp').toBeTruthy();
		});

		// when
		$this.gridy({
			dataType:	'jsonp',
			url:		'/gridy'
		});

		// then check spyOn
	});

	it ('jsonpCallback should be changed', function() {
		// given
		var $this = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.jsonpCallback == 'myCallback').toBeTruthy();
		});

		// when
		$this.gridy({
			jsonpCallback:	'myCallback',
			url:			'/gridy'
		});

		// then check spyOn
	});

	it ('type should be changed', function() {
		// given
		var $this = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.type == 'post').toBeTruthy();
		});

		// when
		$this.gridy({
			type:	'post',
			url:	'/gridy'
		});

		// then check spyOn
	});

	it ('url should be changed', function() {
		// given
		var $this = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.url == '/gridy').toBeTruthy();
		});

		// when
		$this.gridy({
			url:	'/gridy'
		});

		// then check spyOn
	});

	it ('always should to execute with right args', function() {
		// given
		var $this	= $('#grid'),
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.complete.call($this, xhr, 'status');
		});
		// when
		$this.gridy({
			always: function(xhr, status) {
				$(this).data('xhr', xhr).data('status', status);
			}
		});

		// then
		expect($this).toHaveData('xhr', xhr);
		expect($this).toHaveData('status', 'status');
	});

	it ('error should to execute with right args', function() {
		// given
		var $this	= $('#grid'),
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.error.call($this, xhr, 'status', 'fail');
		});
		
		// when
		$this.gridy({
			fail: function(xhr, status, error) {
				$(this).data('xhr', xhr).data('status', status).data('fail', error);
			}
		});

		// then
		expect($this).toHaveData('xhr', xhr);
		expect($this).toHaveData('status', 'status');
		expect($this).toHaveData('fail', 'fail');
	});

	it ('done should to execute with right args', function() {
		// given
		var $this	= $('#grid'),
			data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };
	
		spyOn($, 'ajax').andCallFake(function(params) {
			params.success.call($this, data, 'status', xhr);
		});

		// when
		$this.gridy({
			done: function(data, status, xhr) {
				$(this).data('data', data).data('xhr', xhr).data('status', status);
			}
		});

		// then
		expect($this).toHaveData('data', data);
		expect($this).toHaveData('xhr', xhr);
		expect($this).toHaveData('status', 'status');
	});

});

describe('buttons', function() {

	beforeEach(function() {
		$('body').append('<table id="grid"></table>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('buttonMax should restrict the number of buttons with one visible and reticence on right', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url: 		'/gridy',
			rows:		1,
			buttonMax:	1
		});

		var $buttons = $this.parent().find('.gridy-buttons-content').children('input[type="button"]');

		// then
		expect($buttons.eq(0)).toHaveClass('gridy-button-active');
		expect($buttons.eq(0)).toHaveAttr('title', 'Page 01');
		expect($buttons.eq(0)).toHaveAttr('alt', '01');
		expect($buttons.eq(0)).toHaveAttr('value', '01');

		expect($buttons.eq(1)).toHaveClass('gridy-button-reticence');
		expect($buttons.eq(1)).toBeDisabled();
		expect($buttons.eq(1)).toHaveAttr('value', '...');

		expect($buttons.eq(2)).toHaveClass('gridy-next');
		expect($buttons.eq(2).attr('title').indexOf('Next') >= 0).toBeTruthy();
		expect($buttons.eq(2).attr('alt').indexOf('Next') >= 0).toBeTruthy();
	});

	it ('buttonMax should restrict the number of buttons with one visible and reticence on right and left', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url: 		'/gridy',
			rows:		1,
			buttonMax:	1,
			page:		2
		});

		var $buttons = $this.parent().find('.gridy-buttons-content').children('input[type="button"]');

		// then
		expect($buttons.eq(0)).toHaveClass('gridy-back');
		expect($buttons.eq(0).attr('title').indexOf('Back') >= 0).toBeTruthy();
		expect($buttons.eq(0).attr('alt').indexOf('Back') >= 0).toBeTruthy();

		expect($buttons.eq(1)).toHaveClass('gridy-button-reticence');
		expect($buttons.eq(1)).toBeDisabled();
		expect($buttons.eq(1)).toHaveAttr('value', '...');

		expect($buttons.eq(2)).toHaveClass('gridy-button-active');
		expect($buttons.eq(2)).toHaveAttr('title', 'Page 02');
		expect($buttons.eq(2)).toHaveAttr('alt', '02');
		expect($buttons.eq(2)).toHaveAttr('value', '02');

		expect($buttons.eq(3)).toHaveClass('gridy-button-reticence');
		expect($buttons.eq(3)).toBeDisabled();
		expect($buttons.eq(3)).toHaveAttr('value', '...');

		expect($buttons.eq(4)).toHaveClass('gridy-next');
		expect($buttons.eq(4).attr('title').indexOf('Next') >= 0).toBeTruthy();
		expect($buttons.eq(4).attr('alt').indexOf('Next') >= 0).toBeTruthy();
	});

	it ('should disable paging buttons', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url				: '/gridy',
			rows			: 1,
			buttonMax		: 1,
			page			: 2,
			buttonOption	: false
		});

		var $buttons = $this.parent().find('.gridy-buttons-content');

		// then
		expect($buttons).not.toExist();
	});

	it ('should change the title of next button', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url				: '/gridy',
			rows			: 1,
			buttonMax		: 1,
			page			: 2,
			buttonNextTitle	: 'god'
		});

		var $buttons = $this.parent().find('.gridy-buttons-content').children('input[type="button"]');

		// then
		expect($buttons.eq(4).attr('title').indexOf('god') >= 0).toBeTruthy();
		expect($buttons.eq(4).attr('alt').indexOf('god') >= 0).toBeTruthy();
	});

	it ('should change the title of back button', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url				: '/gridy',
			rows			: 1,
			buttonMax		: 1,
			page			: 2,
			buttonBackTitle	: 'god'
		});

		var $buttons = $this.parent().find('.gridy-buttons-content').children('input[type="button"]');

		// then
		expect($buttons.eq(0).attr('title').indexOf('god') >= 0).toBeTruthy();
		expect($buttons.eq(0).attr('alt').indexOf('god') >= 0).toBeTruthy();
	});

});

describe('callback', function() {

	beforeEach(function() {
		$('body').append('<table id="grid"></table>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('should call "filter" callback', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"},{"id": 3, "nick": "c", "name": "C"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url		: '/gridy',
			filter	: function() {
				$(this).addClass('my-class');
			}
		});

		// then
		expect($this).toHaveClass('my-class');
	});

	it ('[callback filter] should set json from return of "filter" callback', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"}], "total": 1}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			columns		: [
			    { name: 'ID', value: 'id', width: 100 },
			    { name: 'Nick', value: 'nick', width: 100 },
			    { name: 'Name', value: 'name', width: 100 }
			],
			rows	: 1,
			url		: '/gridy',
			filter	: function() {
				return '{"list": [{"id": 2, "nick": "b", "name": "B"}], "total": 1}';
			}
		});

		// then
		var rows = $this.children('tbody.gridy-content').children('tr').children('td');

		expect(rows.eq(0)).toHaveHtml('2');
		expect(rows.eq(1)).toHaveHtml('b');
		expect(rows.eq(2)).toHaveHtml('B');
	});

	it ('should get the listPath inside a couple of objects', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"collection": { "subCollection": { "value": [{"id": 1, "nick": "a", "name": "A"}] } }, "total": 1 }',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			rows		: 1,
			url			: '/gridy',
			listPath	: 'collection.subCollection.value'
		});

		// then
		var rows = $this.find('td');

		expect(rows.eq(0)).toHaveHtml('1');
		expect(rows.eq(1)).toHaveHtml('a');
		expect(rows.eq(2)).toHaveHtml('A');
	});

	it ('should get the listPath inside a single object', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"collection": [{"id": 1, "nick": "a", "name": "A"}], "total": 1 }',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			rows		: 1,
			url			: '/gridy',
			listPath	: 'collection'
		});

		// then
		var rows = $this.find('td');

		expect(rows.eq(0)).toHaveHtml('1');
		expect(rows.eq(1)).toHaveHtml('a');
		expect(rows.eq(2)).toHaveHtml('A');
	});

	it ('should call "before" callback before load the grid', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"collection": [{"id": 1, "nick": "a", "name": "A"}], "total": 1 }',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			rows	: 1,
			url		: '/gridy',
			before	: function() {
				$(this).addClass('called');

				// then
				expect($this.parent().find('.gridy-loading').children()).toBeVisible();
				expect($this.parent().find('.gridy-content').children().length == 0).toEqual(true);
			}
		});

		expect($this).toHaveClass('called');
	});

	it ('should call "before" callback and override the page number, sortName and sortOrder', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"collection": [{"id": 1, "nick": "a", "name": "A"}], "total": 1 }',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');

			// then
			expect(params.data.page).toEqual(2);
			expect(params.data.sortName).toEqual('sortName');
			expect(params.data.sortOrder).toEqual('sortOrder');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			rows	: 1,
			url		: '/gridy',
			before	: function() {
				return { page: 2, sortName: 'sortName', sortOrder: 'sortOrder' };
			}
		});
	});

	it ('should call "before" callback and NOT override the page number, sortName and sortOrder', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"collection": [{"id": 1, "nick": "a", "name": "A"}], "total": 1 }',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');

			// then
			expect(params.data.page).toEqual(1);
			expect(params.data.sortName).toEqual('');
			expect(params.data.sortOrder).toEqual('asc');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			rows	: 1,
			url		: '/gridy',
			before	: function() { }
		});
	});

});

describe('functions', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('should set without searchOption and on page 2', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"}], "total": 2}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid').gridy({
			rows	: 1,
			url		: '/gridy'
		});

		// when
		$this.gridy('set', { page: 2, searchOption: false });

		// then
		expect($this.parent().find('.gridy-search')).not.toExist();
		expect($this.parent().find('.gridy-button-active')).toHaveValue('02');
	});

	it ('should reload with the same filter', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"}], "total": 2}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid').gridy({
			page	: 2,
			rows	: 1,
			url		: '/gridy'
		});

		// when
		$this.gridy('reload');

		// then
		expect($this.parent().find('.gridy-button-active')).toHaveValue('02');
	});

});

describe('scroll', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "nick": "a", "name": "A"},{"id": 2, "nick": "b", "name": "B"}], "total": 2}',
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };
			
			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('[free scroll] should have scroll class', function() {

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			height	: 100,
			scroll	: true,
			style	: 'free',
			template: 'template-div',
			url		: '/gridy'
		});

		// then
		expect($this.children('.gridy-content')).toHaveClass('gridy-scroll');
	});

	it ('[free scroll] should set the last line class', function() {

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			height	: 100,
			scroll	: true,
			style	: 'free',
			template: 'template-div',
			url		: '/gridy'
		});

		// then
		expect($this.children('.gridy-content').children(':last')).toHaveClass('gridy-last-line-scroll');
	});

});

// TODO click one time and check arrow up.
// TODO click two time and check arrow down.
// TODO click three time and check arrow none.
// TODO for loading timer fadeout.
// TODO for message timer fadeout.
// TODO for search with click button.
// TODO for search with enter key press.
// TODO for messageTimer.
// TODO for loadingIcon "background".
// TODO click on button to change the page.
// TODO click on back button to change the page.
// TODO click on next button to change the page.
// TODO scroll div.
// TODO scroll table.
// TODO click on refresh button and keep the same filter.
// TODO test message error skipping the $.erro() as a fail spec.

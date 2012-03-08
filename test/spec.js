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
			expect(params.data.search == '').toBeTruthy();
			expect(params.data.page == 1).toBeTruthy();
			expect(params.data.sortName == '').toBeTruthy();
			expect(params.data.sortOrder == 'asc').toBeTruthy();
			expect(params.data.find == '').toBeTruthy();
			expect(params.data.rows == 10).toBeTruthy();
		});

		// when
		$this.gridy({ url: '/gridy' });
	});

	it ('param receive custom', function() {
		// given
		var $this = $('#grid');

		// then
		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.data.search == 'search').toBeTruthy();
			expect(params.data.page == 2).toBeTruthy();
			expect(params.data.sortName == 'id').toBeTruthy();
			expect(params.data.sortOrder == 'desc').toBeTruthy();
			expect(params.data.find == 'find').toBeTruthy();
			expect(params.data.rows == 3).toBeTruthy();
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
			url:	'/gridy',
			params:	{ pa: 'pa', rams: 'rams'}
		});
	});

	it ('paramsElements should send params taked from elements', function() {
		$('body').append('<input id="params-elements" type="text" name="paramsElements" value="params-elements" />');

		// given
		var $this = $('#grid');

		// then
		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.data.paramsElements == 'params-elements').toBeTruthy();
		});

		// when
		$this.gridy({
			url:			'/gridy',
			paramsElements:	['#params-elements']
		});

		$('#params-elements').remove();
	});

});

describe('global settings', function() {

	beforeEach(function() {
		$('body').append('<table id="grid"></table>');


		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
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

		var $wrapper = $this.parent();

		// then
	    expect($wrapper.children('input[name="page"]')).toExist();
	    expect($wrapper.children('input[name="sortName"]')).toExist();
	    expect($wrapper.children('input[name="sortOrder"]')).toExist();
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
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "count": {"total": 3}}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// when
		$this.gridy({
			style:		'div',
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
			style:				'div',
			template:			'template-div',
			url:				'/gridy'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect($wrapper.children('input[type="button"]')).toHaveAttr('title', 'Start the search');
	});

	it ('list path should be possible change the path of the list', function() {
		// given
		var $this = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"data": {"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}]}, "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// when
		$this.gridy({
			template:	'template-div',
			url:		'/gridy',
			listPath:	'data.list'
		});

		var $columns = $this.children('.gridy-content').children('div');

		// then
	    expect($columns.length == 3).toBeTruthy();
	});

});

describe('style div', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
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
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		// then
	    expect($this.parent()).toHaveClass('gridy-default');
	    expect($this.parent()).toHaveId('grid-wrapper');
	});

	it ('content should be created', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
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
			style:		'div',
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
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $this.children('.gridy-content').children('div:first').children('div');

		// then
	    expect($columns.length == 4).toBeTruthy();
	});

	it ('row should have the right count', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $this.children('.gridy-content').children('div');

		// then
	    expect($columns.length == 3).toBeTruthy();
	});

	it ('row should have right class', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $this.children('.gridy-content').children();

		// then
	    expect($columns.eq(0)).toHaveClass('gridy-row');
	    expect($columns.eq(1)).toHaveClass('gridy-row');
	    expect($columns.eq(2)).toHaveClass('gridy-row');
	});

	it ('row should have separate class on the first one', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $this.children('.gridy-content').children();

		// then
	    expect($columns.eq(0)).toHaveClass('gridy-separate');
	});

	it ('width should set it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
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
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			skin:		'skin'
		});

		// then
	    expect($this.parent()).toHaveClass('skin');
	});

	it ('header should create it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		// then
		expect($this.children('div.gridy-header')).toExist();
	    expect($this.children().eq(0)).toHaveClass('gridy-header');
	});

	it ('header should create the columns', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columns = $this.children('.gridy-header').children();

		// then
		expect($columns.length == 3).toBeTruthy();
	});

	it ('header column should have right width', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader = $this.children('div.gridy-header').children('div');

		// then
		expect($columnsHeader.eq(0)).toHaveAttr('style', 'width: 100px;');
		expect($columnsHeader.eq(1)).toHaveAttr('style', 'width: 100px;');
		expect($columnsHeader.eq(2)).toHaveAttr('style', 'width: 100px;');
	});

	it ('header column should have the right disable icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader = $this.children('div.gridy-header').children('div');

		// then
		expect($columnsHeader.eq(0).children('div')).toHaveClass('gridy-arrow-none');
		expect($columnsHeader.eq(1).children('div')).toHaveClass('gridy-arrow-none');
		expect($columnsHeader.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('header column should have the right link info', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader	= $this.children('div.gridy-header').children('div'),
			$link1			= $columnsHeader.eq(0).children('a'),
			$link2			= $columnsHeader.eq(1).children('a'),
			$link3			= $columnsHeader.eq(2).children('a');


		// then
		expect($link1).toHaveId('sort-by-id');
		expect($link1).toHaveAttr('href', 'javascript:void(0);');
		expect($link1).toHaveAttr('name', 'id');
		expect($link1).toHaveText('ID');
		expect($link1).not.toHaveAttr('rel');

		expect($link2).toHaveId('sort-by-username');
		expect($link2).toHaveAttr('href', 'javascript:void(0);');
		expect($link2).toHaveAttr('name', 'username');
		expect($link2).toHaveText('Username');
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
			style:			'div',
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
			style:			'div',
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
			style:			'div',
			template:		'template-div',
			url:			'/gridy'
		});

		var $status = $this.parent().children('div.gridy-status');

		// then
		expect($status.children('div.gridy-result')).toExist();
	});

	it ('resultText should have default mask', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy'
		});

		var $result = $this.parent().find('div.gridy-result');

		// then
		expect($result).toHaveHtml('Displaying 01 - 01 of 03 items');
	});

	it ('resultText should be turned off', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			resultOption:	false
		});

		var $wrapper = $this.parent();

		// then
		expect($wrapper).not.toContain('div.gridy-result');
	});

	it ('resultText should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			resultText:		'Pagee {from} -- {to} off {total} itemss'
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
			style:			'div',
			template:		'template-div',
			url:			'/gridy'
		});

		var $wrapper = $this.parent().children('div.gridy-status');

		// then
		expect($wrapper.children('div.gridy-loading')).toExist();
		expect($wrapper.children('div.gridy-loading').children('div')).toExist();
	});

	it ('loadingOption should be turned off', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			loadingOption:	false
		});

		var $wrapper = $this.parent().children('div.gridy-status');

		// then
		expect($wrapper.children('div.gridy-loading')).not.toExist();
	});

	it ('loadingText should be the default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy'
		});

		var $wrapper = $this.parent().find('div.gridy-loading');

		// then
		expect($wrapper).toHaveText('Loading...');
	});

	it ('loadingText should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			loadingText:	'Wait...'
		});

		var $wrapper = $this.parent().find('div.gridy-loading');

		// then
		expect($wrapper).toHaveText('Wait...');
	});

	it ('searchOption should exist by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'div',
			template:			'template-div',
			url:				'/gridy'
		});

		var $wrapper = $this.parent();

		// then
		expect($wrapper.children('div.gridy-search')).toExist();
		expect($wrapper.children('div.gridy-search').children('div.gridy-search-content').children('input[type="text"]')).toExist();
		expect($wrapper.children('div.gridy-search').children('div.gridy-search-content').children('input[type="button"]')).toExist();
	});

	it ('searchButtonLabel should have default value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'div',
			template:			'template-div',
			url:				'/gridy'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect($wrapper.children('input[type="button"]')).toHaveValue('search');
	});

	it ('searchButtonLabel should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'div',
			template:			'template-div',
			url:				'/gridy',
			searchButtonLabel:	'find'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect($wrapper.children('input[type="button"]')).toHaveValue('find');
	});

	it ('searchButtonTitle have default value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'div',
			template:			'template-div',
			url:				'/gridy'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect($wrapper.children('input[type="button"]')).toHaveAttr('title', 'Start the search');
	});

	it ('searchButtonTitle should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy',
			searchButtonTitle:	'type here...'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect($wrapper.children('input[type="button"]')).toHaveAttr('title', 'type here...');
	});

	it ('searchFocus have default value and focus it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:				'div',
			template:			'template-div',
			url:				'/gridy'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		//expect($wrapper.children('input[type="text"]')).toBeFocused();
		expect($wrapper.children('input[type="text"]')).toHaveClass('gridy-typed');
	});

	it ('searchTarget should put it on target', function() {
		$('body').append('<div id="target"></div>');

		// given
		var $this	= $('#grid'),
			$target	= $('#target');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			searchTarget:	'#target'
		});

		var $wrapper = $this.parent();

		// then
		expect($wrapper.children('.gridy-search')).not.toExist();
		expect($target.children('.gridy-search')).toExist();

		$target.remove();
	});

	it ('gridy-footer should exists by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $wrapper = $this.parent().children('div.gridy-footer');

		// then
		expect($wrapper).toExist();
	});

	it ('gridy-message should exists by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url: 		'/gridy'
		});

		var $wrapper = $this.parent().children('.gridy-footer');

		// then
		expect($wrapper.children('div.gridy-message')).toExist();
	});

	it ('gridy-buttons should exists when has more then one page', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
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
		expect($buttons.eq(0)).toHaveAttr('title', 'page 01');
		expect($buttons.eq(0)).toHaveAttr('alt', '01');
		expect($buttons.eq(0)).toHaveAttr('value', '01');
		expect($buttons.eq(1)).not.toHaveClass('gridy-button-active');
		expect($buttons.eq(1)).toHaveAttr('title', 'page 02');
		expect($buttons.eq(1)).toHaveAttr('alt', '02');
		expect($buttons.eq(1)).toHaveAttr('value', '02');
		expect($buttons.eq(2)).not.toHaveClass('gridy-button-active');
		expect($buttons.eq(2)).toHaveAttr('title', 'page 03');
		expect($buttons.eq(2)).toHaveAttr('alt', '03');
		expect($buttons.eq(2)).toHaveAttr('value', '03');
	});

	it ('resize should be on by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url: 		'/gridy',
			width:		100
		});

		var $wrapper	= $this.parent(),
			$search		= $wrapper.children('.gridy-search'),
			$status		= $wrapper.children('.gridy-status'),
			$footer		= $wrapper.children('.gridy-footer'),
			$buttons	= $wrapper.children('.gridy-buttons');

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
			style:		'div',
			template:	'template-div',
			url: 		'/gridy',
			resize:		false,
			width:		100
		});

		var $wrapper	= $this.parent(),
			$search		= $wrapper.children('.gridy-search'),
			$status		= $wrapper.children('.gridy-status'),
			$footer		= $wrapper.children('.gridy-footer'),
			$buttons	= $wrapper.children('.gridy-buttons');

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
			style:		'div',
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
			style:		'div',
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
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			rowsTarget:	'#target'
		});

		var $wrapper = $this.parent();

		// then
		expect($wrapper.children('.gridy-row-option')).not.toExist();
		expect($target.children('.gridy-row-option')).toExist();

		$target.remove();
	});

	it ('findTarget should put it on target', function() {
		$('body').append('<div id="target"></div>');

		// given
		var $this	= $('#grid'),
			$target	= $('#target');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			findTarget:	'#target',
			findsName:	'username'
		});

		var $wrapper = $this.parent();

		// then
		expect($wrapper.children('.gridy-search').find('.gridy-find-option')).not.toExist();
		expect($target.children('.gridy-find-option')).toExist();

		$target.remove();
	});

	it ('findsName should changes the finds name and add the default empty find', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			findsName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']]
		});

		var $findOptions = $this.parent().find('.gridy-find-option').find('option');

		// then
		expect($findOptions).toExist();
		expect($findOptions.eq(0)).toHaveValue('');
		expect($findOptions.eq(0)).toHaveHtml('');
		expect($findOptions.eq(0)).toBeChecked();
		expect($findOptions.eq(1)).toHaveValue('id');
		expect($findOptions.eq(1)).toHaveHtml('ID');
		expect($findOptions.eq(2)).toHaveValue('username');
		expect($findOptions.eq(2)).toHaveHtml('Username');
		expect($findOptions.eq(3)).toHaveValue('name');
		expect($findOptions.eq(3)).toHaveHtml('Name');
	});

	it ('findsName should select the default find value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			findsName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			find:		'username'
		});

		var $findOptions = $this.parent().find('.gridy-find-option').find('option');

		// then
		expect($findOptions).toExist();
		expect($findOptions.eq(0)).toHaveValue('id');
		expect($findOptions.eq(0)).toHaveHtml('ID');
		expect($findOptions.eq(1)).toHaveValue('username');
		expect($findOptions.eq(1)).toHaveHtml('Username');
		expect($findOptions.eq(1)).toBeChecked();
		expect($findOptions.eq(2)).toHaveValue('name');
		expect($findOptions.eq(2)).toHaveHtml('Name');
	});

	it ('searchText should set a default text', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
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
		var $this = $('#grid').gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		}),

		$row = $this.find('.gridy-row:first');

		// when
		$row.children().eq(0).mouseover();

		// then
		expect($row).not.toHaveClass('gridy-row-hovered');
	});

	it ('hoverFx should apply effect', function() {
		// given
		var $this = $('#grid').gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			hoverFx:	true
		}),

		$row = $this.find('.gridy-row:first');

		// when
		$row.children().eq(0).mouseover();

		// then
		expect($row).toHaveClass('gridy-row-hovered');
	});

	it ('headersName should set the name of the heads', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('a')).toHaveHtml('ID');
	    expect($header.children().eq(1).children('a')).toHaveHtml('Username');
	    expect($header.children().eq(2).children('a')).toHaveHtml('Name');
	});

	it ('headersWith should set the width of the heads', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 110, 120]
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0)).toHaveAttr('style', 'width: 100px;');
	    expect($header.children().eq(1)).toHaveAttr('style', 'width: 110px;');
	    expect($header.children().eq(2)).toHaveAttr('style', 'width: 120px;');
	});

	it ('arrowNone should to use none arrow at first', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowNone should to change this icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			arrowNone:		'arrow-none'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('arrow-none');
	    expect($header.children().eq(1).children('div')).toHaveClass('arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('arrow-none');
	});
	
	it ('arrowUp should to use it on asc sort', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			sortName:		'id'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('gridy-arrow-up');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowUp should to change this arrow', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			sortName:		'id',
			arrowUp:		'arrow-up'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('arrow-up');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowDown should to change this arrow', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			sortName:		'id',
			sortOrder:		'desc',
			arrowDown:		'arrow-down'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('arrow-down');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowDown should to use it on asc sort', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			sortName:		'id',
			sortOrder:		'desc'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('gridy-arrow-down');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('evenOdd should apply it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
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

	it ('colsWidth should change it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			colsWidth:	[100, 110, 120, 130]
		});

		// then
		var $columns = $this.children('.gridy-content').children(':first').children('.gridy-column');

	    expect($columns.eq(0)).toHaveAttr('style', 'width: 100px;');
	    expect($columns.eq(1)).toHaveAttr('style', 'width: 110px;');
	    expect($columns.eq(2)).toHaveAttr('style', 'width: 120px;');
	    expect($columns.eq(3)).toHaveAttr('style', 'width: 130px;');
	});

	it ('colsWidth should change it', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:		'/gridy',
			colsWidth:	[100, 110, 120, 130]
		});

		// then
		var $columns = $this.find('tr:first').children();

	    expect($columns.eq(0)).toHaveAttr('width', '100');
	    expect($columns.eq(1)).toHaveAttr('width', '110');
	    expect($columns.eq(2)).toHaveAttr('width', '120');
	    expect($columns.eq(3)).toHaveAttr('width', '130');
	});

	it ('separate should not have separate class on the first one', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			separate:	false
		});

		var $columns = $this.children('.gridy-content').children();

		// then
	    expect($columns.eq(0)).not.toHaveClass('gridy-separate');
	});

	it ('clickFx should enable it', function() {
		// given
		var $this = $('#grid').gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			clickFx:	true
		});

		// when
		var $firstRow = $this.find('.gridy-row:first').click();

		// then
		expect($firstRow).toHaveClass('gridy-row-selected');
	});

	it ('clickFx should not be enabled by default', function() {
		// given
		var $this = $('#grid').gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		// when
		var $firstRow = $this.find('.gridy-row:first').click();

		// then
		expect($firstRow).not.toHaveClass('gridy-row-selected');
	});

});

describe('style table', function() {

	beforeEach(function() {
		$('body').append('<table id="grid"></table>');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
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
	    expect($this.parent()).toHaveClass('gridy-default-table');
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

		var $columns = $this.children('tbody.gridy-content').children('tr:first').children('td');

		// then
	    expect($columns.length == 4).toBeTruthy();
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
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
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
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columns = $this.children('.gridy-header').children();

		// then
		expect($columns.length == 3).toBeTruthy();
	});

	it ('header column should have right width', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader = $this.children('thead.gridy-header').children('th');

		// then
		expect($columnsHeader.eq(0)).toHaveAttr('width', '100');
		expect($columnsHeader.eq(1)).toHaveAttr('width', '100');
		expect($columnsHeader.eq(2)).toHaveAttr('width', '100');
	});

	it ('header column should have the right disable icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader = $this.children('thead.gridy-header').children('th');

		// then
		expect($columnsHeader.eq(0).children('div')).toHaveClass('gridy-arrow-none');
		expect($columnsHeader.eq(1).children('div')).toHaveClass('gridy-arrow-none');
		expect($columnsHeader.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('header column should have the right link info', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader	= $this.children('thead.gridy-header').children('th'),
			$link1			= $columnsHeader.eq(0).children('a'),
			$link2			= $columnsHeader.eq(1).children('a'),
			$link3			= $columnsHeader.eq(2).children('a');

		// then
		expect($link1).toHaveId('sort-by-id');
		expect($link1).toHaveAttr('href', 'javascript:void(0);');
		expect($link1).toHaveAttr('name', 'id');
		expect($link1).toHaveText('ID');
		expect($link1).not.toHaveAttr('rel');

		expect($link2).toHaveId('sort-by-username');
		expect($link2).toHaveAttr('href', 'javascript:void(0);');
		expect($link2).toHaveAttr('name', 'username');
		expect($link2).toHaveText('Username');
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

	it ('resultText should have default mask', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({ url: '/gridy' });

		var $result = $this.parent().find('div.gridy-result');

		// then
		expect($result).toHaveHtml('Displaying 01 - 01 of 03 items');
	});

	it ('resultText should be turned off', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			resultOption:	false
		});

		var $wrapper = $this.parent();

		// then
		expect($wrapper).not.toContain('div.gridy-result');
	});

	it ('resultText should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			resultText:		'Pagee {from} -- {to} off {total} itemss'
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

		var $wrapper = $this.parent().children('div.gridy-status');

		// then
		expect($wrapper.children('div.gridy-loading')).toExist();
		expect($wrapper.children('div.gridy-loading').children('div')).toExist();
	});

	it ('loadingOption should be turned off', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			loadingOption:	false
		});

		var $wrapper = $this.parent().children('div.gridy-status');

		// then
		expect($wrapper).not.toContain('div.gridy-loading');
	});

	it ('loadingText should be the default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy'
		});

		var $wrapper = $this.parent().find('div.gridy-loading');

		// then
		expect($wrapper).toHaveText('Loading...');
	});

	it ('loadingText should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			loadingText:	'Wait...'
		});

		var $wrapper = $this.parent().find('div.gridy-loading');

		// then
		expect($wrapper).toHaveText('Wait...');
	});

	it ('searchOption should exist by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy'
		});

		var $wrapper = $this.parent();

		// then
		expect($wrapper.children('div.gridy-search')).toExist();
		expect($wrapper.children('div.gridy-search').children('div.gridy-search-content').children('input[type="text"]')).toExist();
		expect($wrapper.children('div.gridy-search').children('div.gridy-search-content').children('input[type="button"]')).toExist();
	});

	it ('searchButtonLabel should have default value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect($wrapper.children('input[type="button"]')).toHaveValue('search');
	});

	it ('searchButtonLabel should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy',
			searchButtonLabel:	'find'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect($wrapper.children('input[type="button"]')).toHaveValue('find');
	});

	it ('searchButtonTitle should be changed', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:				'/gridy',
			searchButtonTitle:	'type here...'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		expect($wrapper.children('input[type="button"]')).toHaveAttr('title', 'type here...');
	});

	it ('searchFocus have default value and focus it', function() {
		// given
		var $this = $('#grid').wrap('<div/>');

		// when
		$this.gridy({
			url: '/gridy'
		});

		var $wrapper = $this.parent().find('.gridy-search-content');

		// then
		//expect($wrapper.children('input[type="text"]')).toBeFocused();
		expect($wrapper.children('input[type="text"]')).toHaveClass('gridy-typed');
	});

	it ('searchTarget should put it on target', function() {
		$('body').append('<div id="target"></div>');

		// given
		var $this	= $('#grid'),
			$target	= $('#target');

		// when
		$this.gridy({
			url:			'/gridy',
			searchTarget:	'#target'
		});

		var $wrapper = $this.parent();

		// then
		expect($wrapper.children('.gridy-search')).not.toExist();
		expect($target.children('.gridy-search')).toExist();

		$target.remove();
	});

	it ('gridy-footer should exists by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url: '/gridy'
		});

		var $wrapper = $this.parent().children('div.gridy-footer');

		// then
		expect($wrapper).toExist();
	});

	it ('gridy-message should exists by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url: '/gridy'
		});

		var $wrapper = $this.parent().children('.gridy-footer');

		// then
		expect($wrapper.children('div.gridy-message')).toExist();
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
		expect($buttons.eq(0)).toHaveAttr('title', 'page 01');
		expect($buttons.eq(0)).toHaveAttr('alt', '01');
		expect($buttons.eq(0)).toHaveAttr('value', '01');
		expect($buttons.eq(1)).not.toHaveClass('gridy-button-active');
		expect($buttons.eq(1)).toHaveAttr('title', 'page 02');
		expect($buttons.eq(1)).toHaveAttr('alt', '02');
		expect($buttons.eq(1)).toHaveAttr('value', '02');
		expect($buttons.eq(2)).not.toHaveClass('gridy-button-active');
		expect($buttons.eq(2)).toHaveAttr('title', 'page 03');
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

		var $wrapper	= $this.parent(),
			$search		= $wrapper.children('.gridy-search'),
			$status		= $wrapper.children('.gridy-status'),
			$footer		= $wrapper.children('.gridy-footer'),
			$buttons	= $wrapper.children('.gridy-buttons');

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

		var $wrapper	= $this.parent(),
			$search		= $wrapper.children('.gridy-search'),
			$status		= $wrapper.children('.gridy-status'),
			$footer		= $wrapper.children('.gridy-footer'),
			$buttons	= $wrapper.children('.gridy-buttons');

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
			style:		'div',
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

		var $wrapper = $this.parent();

		// then
		expect($wrapper.children('.gridy-row-option')).not.toExist();
		expect($target.children('.gridy-row-option')).toExist();

		$target.remove();
	});

	it ('findTarget should put it on target', function() {
		$('body').append('<div id="target"></div>');

		// given
		var $this	= $('#grid'),
			$target	= $('#target');

		// when
		$this.gridy({
			url:		'/gridy',
			findTarget:	'#target',
			findsName:	'username'
		});

		var $wrapper = $this.parent();

		// then
		expect($wrapper.children('.gridy-search').find('.gridy-find-option')).not.toExist();
		expect($target.children('.gridy-find-option')).toExist();

		$target.remove();
	});

	it ('findsName should changes the finds name and add the default empty find', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:		'/gridy',
			findsName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']]
		});

		var $findOptions = $this.parent().find('.gridy-find-option').find('option');

		// then
		expect($findOptions).toExist();
		expect($findOptions.eq(0)).toHaveValue('');
		expect($findOptions.eq(0)).toHaveHtml('');
		expect($findOptions.eq(0)).toBeChecked();
		expect($findOptions.eq(1)).toHaveValue('id');
		expect($findOptions.eq(1)).toHaveHtml('ID');
		expect($findOptions.eq(2)).toHaveValue('username');
		expect($findOptions.eq(2)).toHaveHtml('Username');
		expect($findOptions.eq(3)).toHaveValue('name');
		expect($findOptions.eq(3)).toHaveHtml('Name');
	});

	it ('findsName should select the default find value', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			findsName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			find:		'username'
		});

		var $findOptions = $this.parent().find('.gridy-find-option').find('option');

		// then
		expect($findOptions).toExist();
		expect($findOptions.eq(0)).toHaveValue('id');
		expect($findOptions.eq(0)).toHaveHtml('ID');
		expect($findOptions.eq(1)).toHaveValue('username');
		expect($findOptions.eq(1)).toHaveHtml('Username');
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

	it ('headersName should set the name of the heads', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('a')).toHaveHtml('ID');
	    expect($header.children().eq(1).children('a')).toHaveHtml('Username');
	    expect($header.children().eq(2).children('a')).toHaveHtml('Name');
	});

	it ('headersWith should set the width of the heads', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 110, 120]
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0)).toHaveAttr('width', '100');
	    expect($header.children().eq(1)).toHaveAttr('width', '110');
	    expect($header.children().eq(2)).toHaveAttr('width', '120');
	});

	it ('arrowNone should to use none arrow at first', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowNone should to change this icon', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			arrowNone:		'arrow-none'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('arrow-none');
	    expect($header.children().eq(1).children('div')).toHaveClass('arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('arrow-none');
	});

	it ('arrowUp should to use it on asc sort', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			sortName:		'id'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('gridy-arrow-up');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowUp should to change this arrow', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			sortName:		'id',
			arrowUp:		'arrow-up'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('arrow-up');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowDown should to change this arrow', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			sortName:		'id',
			sortOrder:		'desc',
			arrowDown:		'arrow-down'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('arrow-down');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('arrowDown should to use it on asc sort', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100],
			sortName:		'id',
			sortOrder:		'desc'
		});

		// then
		var $header = $this.children('.gridy-header');

	    expect($header.children().eq(0).children('div')).toHaveClass('gridy-arrow-down');
	    expect($header.children().eq(1).children('div')).toHaveClass('gridy-arrow-none');
	    expect($header.children().eq(2).children('div')).toHaveClass('gridy-arrow-none');
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
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			separate:	false
		});

		var $columns = $this.children('.gridy-content').children();

		// then
	    expect($columns.eq(0)).not.toHaveClass('gridy-separate');
	});

	it ('clickFx should enable it', function() {
		// given
		var $this = $('#grid').gridy({
			url:		'/gridy',
			clickFx:	true
		});

		var $firstRow = $this.find('tr:first');

		// when
		$firstRow.click();

		// then
		expect($firstRow).toHaveClass('gridy-row-selected');
	});

	it ('clickFx should not be enabled by default', function() {
		// given
		var $this = $('#grid').gridy({
			url:		'/gridy',
			clickFx:	true
		});

		// when
		var $firstRow = $this.find('.gridy-row:first').click();

		// then
		expect($firstRow).not.toHaveClass('gridy-row-selected');
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

	it ('noResultOption should be enabled by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:		'/gridy',
			findsName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']]
		});

		var $noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect($noResult).toExist();
		expect($noResult).toHaveHtml('No items found!');
	});

	it ('noResultOption should be disabled', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			findsName:		[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			noResultOption: false
		});

		var $noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect($noResult).not.toExist();
	});

	it ('noResultText should change the text', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url:			'/gridy',
			findsName:		[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			noResultText:	'No results!'
		});

		var $noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect($noResult).toHaveHtml('No results!');
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

	it ('noResultOption should be enabled by default', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			findsName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']]
		});

		var $noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect($noResult).toExist();
		expect($noResult).toHaveHtml('No items found!');
	});

	it ('noResultOption should be disabled', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			findsName:		[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			noResultOption: false
		});

		var $noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect($noResult).not.toExist();
	});

	it ('noResultText should change the text', function() {
		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			findsName:		[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			noResultText:	'No results!'
		});

		var $noResult = $this.children('.gridy-content').children('.gridy-no-result');

		// then
		expect($noResult).toHaveHtml('No results!');
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

		var $message = $this.parent().find('.gridy-message');

		// then
		expect($message).toBeVisible(); 
		expect($message).toHaveText('responseText'); 
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

		var $message = $this.parent().find('.gridy-message');

		// then
		expect($message).toBeVisible(); 
		expect($message).toHaveText('statusText'); 
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

	it ('complete should to execute with right args', function() {
		// given
		var $this	= $('#grid'),
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.complete.call($this, xhr, 'status');
		});
		// when
		$this.gridy({
			complete: function(xhr, status) {
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
			params.error.call($this, xhr, 'status', 'error');
		});
		
		// when
		$this.gridy({
			error: function(xhr, status, error) {
				$(this).data('xhr', xhr).data('status', status).data('error', error);
			}
		});

		// then
		expect($this).toHaveData('xhr', xhr);
		expect($this).toHaveData('status', 'status');
		expect($this).toHaveData('error', 'error');
	});

	it ('success should to execute with right args', function() {
		// given
		var $this	= $('#grid'),
			data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };
	
		spyOn($, 'ajax').andCallFake(function(params) {
			params.success.call($this, data, 'status', xhr);
		});

		// when
		$this.gridy({
			success: function(data, status, xhr) {
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
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
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
		expect($buttons.eq(0)).toHaveAttr('title', 'page 01');
		expect($buttons.eq(0)).toHaveAttr('alt', '01');
		expect($buttons.eq(0)).toHaveAttr('value', '01');

		expect($buttons.eq(1)).toHaveClass('gridy-button-reticence');
		expect($buttons.eq(1)).toBeDisabled();
		expect($buttons.eq(1)).toHaveAttr('value', '...');

		expect($buttons.eq(2)).toHaveClass('gridy-button-next');
		expect($buttons.eq(2).attr('title').indexOf('Next') >= 0).toBeTruthy();
		expect($buttons.eq(2).attr('alt').indexOf('Next') >= 0).toBeTruthy();
	});

	it ('buttonMax should restrict the number of buttons with one visible and reticence on right and left', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
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
		expect($buttons.eq(2)).toHaveAttr('title', 'page 02');
		expect($buttons.eq(2)).toHaveAttr('alt', '02');
		expect($buttons.eq(2)).toHaveAttr('value', '02');

		expect($buttons.eq(3)).toHaveClass('gridy-button-reticence');
		expect($buttons.eq(3)).toBeDisabled();
		expect($buttons.eq(3)).toHaveAttr('value', '...');

		expect($buttons.eq(4)).toHaveClass('gridy-button-next');
		expect($buttons.eq(4).attr('title').indexOf('Next') >= 0).toBeTruthy();
		expect($buttons.eq(4).attr('alt').indexOf('Next') >= 0).toBeTruthy();
	});

	it ('should disable paging buttons', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
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
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
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
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
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

describe('callbacks', function() {

	beforeEach(function() {
		$('body').append('<table id="grid"></table>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('should call "before" callback', function() {
		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= '{"list": [{"id": 1, "username": "ajose", "name": "Arlindo José"},{"id": 2, "username": "wbotelhos", "name": "Washington Botelho"},{"id": 3, "username": "zbotelho", "name": "Zilda Botelho"}], "total": 3}',
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// given
		var $this = $('#grid');

		// when
		$this.gridy({
			url		: '/gridy',
			before	: function() {
				$(this).addClass('my-class');
			}
		});

		// then
		expect($this).toHaveClass('my-class');
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
// TODO sorterWidth
// TODO sortersName
// TODO scroll
// TODO before

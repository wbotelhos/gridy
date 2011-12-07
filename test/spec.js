describe('param settings', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('param receive default', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.data.search == '').toBeTruthy();
			expect(params.data.page == 1).toBeTruthy();
			expect(params.data.sortName == '').toBeTruthy();
			expect(params.data.sortOrder == 'asc').toBeTruthy();
			expect(params.data.find == '').toBeTruthy();
			expect(params.data.rows == 10).toBeTruthy();
		});

		// when
		$grid.gridy({ url: '/gridy' });

		// then check spyOn
		
	});

	it ('param receive custom', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.data.search == 'search').toBeTruthy();
			expect(params.data.page == 2).toBeTruthy();
			expect(params.data.sortName == 'id').toBeTruthy();
			expect(params.data.sortOrder == 'desc').toBeTruthy();
			expect(params.data.find == 'find').toBeTruthy();
			expect(params.data.rows == 3).toBeTruthy();
		});

		// when
		$grid.gridy({
			search:		'search',
			page:		2,
			sortName:	'id',
			sortOrder:	'desc',
			find:		'find',
			rows:		3,
			url:		'/gridy'
		});

		// then check spyOn
		
	});

});

describe('global settings', function() {

	beforeEach(function() {
		$('body').append('<table id="grid"></table>');


		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"total\": 3}",
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
		var $grid		= $('#grid'),
			className	= 'my-class';

		// when
		$grid.gridy({ url: '/gridy' }).addClass(className);

		// then
	    expect($grid).toHaveClass(className);
	});

	it ('hidden field should have custom IDs', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({ url: '/gridy' });

		var $wrapper = $grid.parent();

		// then
	    expect($wrapper).toContain('input#grid-current-page');
	    expect($wrapper).toContain('input#grid-current-sort-name');
	    expect($wrapper).toContain('input#grid-current-sort-order');
	});

	it ('hidden field should have default values', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({ url: '/gridy' });

		var $page		= $('#grid-current-page'),
			$sortName	= $('#grid-current-sort-name'),
			$sortOrder	= $('#grid-current-sort-order');

		// then
	    expect($page).toHaveValue('1');
	    expect($sortName).toHaveValue('');
	    expect($sortOrder).toHaveValue('asc');
	});

	it ('hidden field should have custom values', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			page:		2,
			sortName:	'id',
			sortOrder:	'desc',
			url: '/gridy'
		});

		var $page		= $('#grid-current-page'),
			$sortName	= $('#grid-current-sort-name'),
			$sortOrder	= $('#grid-current-sort-order');
	
		// then
	    expect($page).toHaveValue('2');
	    expect($sortName).toHaveValue('id');
	    expect($sortOrder).toHaveValue('desc');
	});

	it ('template show be possible to change of template', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			template:	'template-custom',
			url:		'/gridy'
		});

		// then
	    expect($grid.children().children().is('ul')).toBeTruthy();
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
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"count\": {\"total\": 3}}",
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			totalPath:	'count.total'
		});

		var $result = $('.gridy-status').children('.gridy-result');

		expect($result).toHaveText('Displaying 01 - 01 of 03 items');
	});

	it ('list path should be possible change the path of the list', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= "{\"data\": {\"list\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}]}, \"total\": 3}",
				xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

			params.success(data, 'status', xhr);
			params.complete('xhr', 'status');
		});

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			listPath:	'data.list'
		});

		var $columns = $grid.children('.gridy-content').children('div');

		// then
	    expect($columns.length == 3).toBeTruthy();
	});

});

describe('style div', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"total\": 3}",
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
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		// then
	    expect($grid.parent()).toHaveClass('gridy-default');
	    expect($grid.parent()).toHaveId('grid-wrapper');
	});

	it ('content should be created', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		// then
		expect($grid).toContain('.gridy-content');
	});

	it ('content should has height and width as auto', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $content = $grid.children('.gridy-content');

		// then
	    expect($content).toHaveAttr('style', 'height: auto; width: auto;');
	});

	it ('column should have the right count', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $grid.children('.gridy-content').children('div:first').children('div');

		// then
	    expect($columns.length == 4).toBeTruthy();
	});

	it ('row should have the right count', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $grid.children('.gridy-content').children('div');

		// then
	    expect($columns.length == 3).toBeTruthy();
	});

	it ('row should have right class', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $grid.children('.gridy-content').children();

		// then
	    expect($columns.eq(0)).toHaveClass('gridy-row');
	    expect($columns.eq(1)).toHaveClass('gridy-row');
	    expect($columns.eq(2)).toHaveClass('gridy-row');
	});

	it ('row should have separate class on the first one', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $grid.children('.gridy-content').children();

		// then
	    expect($columns.eq(0)).toHaveClass('gridy-separate');
	});

	it ('width should set it', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			width:		1000
		});

		// then
	    expect($grid).toHaveAttr('style', 'width: 1000px;');
	});

	it ('skin should be possible to change', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy',
			skin:		'skin'
		});

		// then
	    expect($grid.parent()).toHaveClass('skin');
	});

	it ('header should create it', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		// then
		expect($grid).toContain('div.gridy-header');
	    expect($grid.children().eq(0)).toHaveClass('gridy-header');
	});

	it ('header should create the columns', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columns = $grid.children('.gridy-header').children();

		// then
		expect($columns.length == 3).toBeTruthy();
	});

	it ('header column should have right width', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader = $grid.children('div.gridy-header').children('div');

		// then
		expect($columnsHeader.eq(0)).toHaveAttr('style', 'width: 100px;');
		expect($columnsHeader.eq(1)).toHaveAttr('style', 'width: 100px;');
		expect($columnsHeader.eq(2)).toHaveAttr('style', 'width: 100px;');
	});

	it ('header column should have the right disable icon', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader = $grid.children('div.gridy-header').children('div');

		// then
		expect($columnsHeader.eq(0).children('div')).toHaveClass('gridy-arrow-none');
		expect($columnsHeader.eq(1).children('div')).toHaveClass('gridy-arrow-none');
		expect($columnsHeader.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('header column should have the right link info', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:			'div',
			template:		'template-div',
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader	= $grid.children('div.gridy-header').children('div'),
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

});

describe('style table', function() {

	beforeEach(function() {
		$('body').append('<table id="grid"></table>');

		spyOn($, 'ajax').andCallFake(function(params) {
			var data	= "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"total\": 3}",
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
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		// then
	    expect($grid.parent()).toHaveClass('gridy-default-table');
	    expect($grid.parent()).toHaveId('grid-wrapper');
	});

	it ('content should be created', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		// then
		expect($grid).toContain('tbody.gridy-content');
	});

	it ('content should NOT has height and width as auto', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $content = $grid.children('tbody.gridy-content');

		// then
	    expect($content).not.toHaveAttr('style', 'height: auto; width: auto;');
	});

	it ('row should have the right count', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $rows = $grid.children('tbody.gridy-content').children('tr');

		// then
	    expect($rows.length == 3).toBeTruthy();
	});

	it ('column should have the right count', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $columns = $grid.children('tbody.gridy-content').children('tr:first').children('td');

		// then
	    expect($columns.length == 4).toBeTruthy();
	});

	it ('row should NOT set class but use CSS by tr identification', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $rows = $grid.children('tbody.gridy-content').children();

		// then
	    expect($rows.eq(0)).not.toHaveAttr('class');
	    expect($rows.eq(1)).not.toHaveAttr('class');
	    expect($rows.eq(2)).not.toHaveAttr('class');
	});

	it ('row should have separate class on the first tds', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $row = $grid.children('.gridy-content').children('tr:first');

		// then
	    expect($row.children('td')).toHaveClass('gridy-separate');
	});

	it ('width should set it', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:		'/gridy',
			width:		1000
		});

		// then
	    expect($grid).toHaveAttr('style', 'width: 1000px;');
	});

	it ('skin should be possible to change', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy',
			skin:	'skin'
		});

		// then
	    expect($grid.parent()).toHaveClass('skin-table');
	});

	it ('header should create it', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		// then
		expect($grid).toContain('thead.gridy-header');
	    expect($grid.children().eq(0)).toHaveClass('gridy-header');
	});

	it ('header should create the columns', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columns = $grid.children('.gridy-header').children();

		// then
		expect($columns.length == 3).toBeTruthy();
	});

	it ('header column should have right width', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader = $grid.children('thead.gridy-header').children('th');

		// then
		expect($columnsHeader.eq(0)).toHaveAttr('width', '100');
		expect($columnsHeader.eq(1)).toHaveAttr('width', '100');
		expect($columnsHeader.eq(2)).toHaveAttr('width', '100');
	});

	it ('header column should have the right disable icon', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader = $grid.children('thead.gridy-header').children('th');

		// then
		expect($columnsHeader.eq(0).children('div')).toHaveClass('gridy-arrow-none');
		expect($columnsHeader.eq(1).children('div')).toHaveClass('gridy-arrow-none');
		expect($columnsHeader.eq(2).children('div')).toHaveClass('gridy-arrow-none');
	});

	it ('header column should have the right link info', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:			'/gridy',
			headersName:	[['id', 'ID'], ['username', 'Username'], ['name', 'Name']],
			headersWidth:	[100, 100, 100]
		});

		var $columnsHeader	= $grid.children('thead.gridy-header').children('th'),
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

});


// TODO for message timer fadeout

describe('error settings', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('message should be displayed with responseText error', function() {
		// given
		var $grid	= $('#grid'),
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.error(xhr, 'status', 'error');
		});

		// when
		$grid.gridy({ url: '/gridy' });

		var $message = $grid.parent().find('.gridy-message');

		// then
		expect($message).toBeVisible(); 
		expect($message).toHaveText('responseText'); 
	});

	it ('message should be displayed with full statusText error when there is no responseText', function() {
		// given
		var $grid	= $('#grid'),
			xhr		= { statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.error(xhr);
		});

		// when
		$grid.gridy({ url: '/gridy' });

		var $message = $grid.parent().find('.gridy-message');

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
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.cache).toBeTruthy();
		});

		// when
		$grid.gridy({
			cache:	true,
			url:	'/gridy'
		});

		// then check spyOn
	});

	it ('contentType should be changed', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.contentType == 'application/pdf').toBeTruthy();
		});

		// when
		$grid.gridy({
			contentType:	'application/pdf',
			url:			'/gridy'
		});

		// then check spyOn
	});

	it ('dataType should be changed', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.dataType == 'jsonp').toBeTruthy();
		});

		// when
		$grid.gridy({
			dataType:	'jsonp',
			url:		'/gridy'
		});

		// then check spyOn
	});

	it ('jsonpCallback should be changed', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.jsonpCallback == 'myCallback').toBeTruthy();
		});

		// when
		$grid.gridy({
			jsonpCallback:	'myCallback',
			url:			'/gridy'
		});

		// then check spyOn
	});

	it ('type should be changed', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.type == 'post').toBeTruthy();
		});

		// when
		$grid.gridy({
			type:	'post',
			url:	'/gridy'
		});

		// then check spyOn
	});

	it ('url should be changed', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.url == '/gridy').toBeTruthy();
		});

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		// then check spyOn
	});

	it ('complete should to execute with right args', function() {
		// given
		var $grid	= $('#grid'),
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.complete.call($grid, xhr, 'status');
		});
		// when
		$grid.gridy({
			complete: function(xhr, status) {
				$(this).data('xhr', xhr).data('status', status);
			}
		});

		// then
		expect($grid).toHaveData('xhr', xhr);
		expect($grid).toHaveData('status', 'status');
	});

	it ('error should to execute with right args', function() {
		// given
		var $grid	= $('#grid'),
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.error.call($grid, xhr, 'status', 'error');
		});
		
		// when
		$grid.gridy({
			error: function(xhr, status, error) {
				$(this).data('xhr', xhr).data('status', status).data('error', error);
			}
		});

		// then
		expect($grid).toHaveData('xhr', xhr);
		expect($grid).toHaveData('status', 'status');
		expect($grid).toHaveData('error', 'error');
	});

	it ('success should to execute with right args', function() {
		// given
		var $grid	= $('#grid'),
			data	= "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"total\": 3}",
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };
	
		spyOn($, 'ajax').andCallFake(function(params) {
			params.success.call($grid, data, 'status', xhr);
		});

		// when
		$grid.gridy({
			success: function(data, status, xhr) {
				$(this).data('data', data).data('xhr', xhr).data('status', status);
			}
		});

		// then
		expect($grid).toHaveData('data', data);
		expect($grid).toHaveData('xhr', xhr);
		expect($grid).toHaveData('status', 'status');
	});

});

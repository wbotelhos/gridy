describe('Using ID with table', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		var data = "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"total\": 3}";

		spyOn($, 'ajax').andCallFake(function(params) {
			params.success(data);
		});
	});

	afterEach(function() {
		$('#grid').remove();
	});

	it('should chainable', function() {
		// given
		var $grid		= $('#grid'),
			className	= 'my-class';

		// when
		$grid.gridy({
			find:			'username',
			sortName:		'username',
			url:			'/gridy'
		}).addClass(className);

		// then
	    expect($grid).toHaveClass(className);
	});

});

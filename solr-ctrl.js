app.controller('solrCtrl', function($scope, solrService, rx) {

	var totalRecords;
	var start = 0;

	$scope.autocomplete = '';
	$scope.results = [];

	function search(term) {
		var queryParams = {
			q: term,
			start: '0',
			rows: '10',
			wt: 'json'
		};

		return solrService.search(queryParams);
	}

	function moreResults(term) {
		var queryParams = {
			q: term,
			start: '0',
			rows: '10',
			wt: 'json'
		};
	}

	function suggest(term) {
		var queryParams = {
			q: term,
			wt: 'json',
			indent: true,
			debugQuery: true
		};

		return solrService.suggest(queryParams);
	}
	
	$scope
		.$toObservable('autocomplete')
		.debounce(300)
		.map(function(data) { return data.newValue; })
		.distinctUntilChanged()
		.flatMapLatest(function(term) { return suggest(term); })	
		.subscribe(function(val) { 
			$scope.suggestions = val; 
			$scope.$apply();
		});

	$scope
		.$createObservableFunction('clickSearch')
		.map(function(term) { return term.trim(); })
		.map(function(term) { return term.replace(/"/g,''); })
		.flatMapLatest(search)
		.subscribe(function(results) {
			$scope.results = $scope.results.concat(results);
			$scope.$apply();
		});

	$scope.
		.$createObservableFunction('moreResults')
});

app.service('solrService', ['$http','$sce', 'rx', function($http, $sce, rx) {
	var suggestURL = $sce.trustAsResourceUrl('http://10.0.1.22:8983/solr/coreTest/suggest?');
	var searchURL = $sce.trustAsResourceUrl('http://10.0.1.22:8983/solr/coreTest/select?');

	return {
		search: function(params) {
				return rx.Observable
					.fromPromise($http({
						method: 'GET',
						url: searchURL,
						params: params
					}))
					.map(function(response) { 
						return {
							docs: response.data.response.docs,
							numFound: response.data.response.numFound
						}; 
					});
		},
		suggest: function(params) {
			return $http({
					method: 'GET',
					url: suggestURL,
					params: params
				})
				.then(function(response) { 
					return response.data.suggest.mySuggester[params.q].suggestions;
				});
				//.map(function(response) { return response.data.suggest.mySuggester[params.q]; })
				//.map(function(suggestion) { return suggestion.suggestions; });
		}
	}
}]);
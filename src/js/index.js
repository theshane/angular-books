var myApp = angular.module('AngularBook', []);

/**
 * @ngdoc service
 * @name AngularBook.service:BookApiService
 * @function
 * @description
 * # BookApiService
 */
myApp
    .service('BookApiService', function ($http,$rootScope) {
        this.search = function(searchTerm){
            $http.get('https://www.googleapis.com/books/v1/volumes?q='+searchTerm).then(function(resp){
                $rootScope.$broadcast('book-results-ready', resp.data);
            });
        }
    });

/**
 * @ngdoc directive
 * @name AngularBook.directive:sideBar
 * @function
 * @description
 * # sideBar
 */
myApp
    .directive('sideBar', function() {
        return {
            restrict: 'AE',
            templateUrl: 'src/partials/sidebar.html'
         }
    });

    /**
     * @ngdoc controller
     * @name AngularBook.controller:searchDirectiveController
     * @function
     * @description
     * # searchDirectiveController
     */
myApp
        .controller('searchDirectiveController', function ($scope, BookApiService) {
         var vm = this;
         vm.form = {
             searchTerm: '',
         }
         vm.search = function() {
            BookApiService.search(vm.form.searchTerm);
         };

        });
/**
 * @ngdoc controller
 * @name AngularBook.controller:resultsController
 * @function
 * @description
 * # resultsController
 */
myApp
    .controller('resultsController', function ($scope, BookApiService) {
        var vm = this;
        vm.data = {
            books: []
        }
        $scope.$on('book-results-ready', function(event, data){
          vm.data.books = data.items;
          console.log(vm.data.books);
        });
    });

/**
 * @ngdoc directive
 * @name AngularBook.directive:bookCard
 * @function
 * @description
 * # bookCard
 */
myApp
.directive('bookCard', function() {
    return {
        restrict: 'AE',
        templateUrl: 'src/partials/bookcard.html'
     }
});

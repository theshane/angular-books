var myApp = angular.module('AngularBook', []);

/**
 * @ngdoc service
 * @name AngularBook.service:BookApiService
 * @function
 * @description
 * # BookApiService
 */
myApp
    .service('BookApiService', function ($http, $rootScope) {
        this.search = function (opts) {
            $http.get('https://www.googleapis.com/books/v1/volumes?q=' + opts.searchTerm + '&startIndex=' + opts.startIndex).then(function (resp) {
                $rootScope.$broadcast('book-results-ready', {
                    bookData: resp.data,
                    searchTerm: opts.searchTerm
                });
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
    .directive('sideBar', function () {
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
        vm.search = function () {
            BookApiService.search({
                searchTerm: vm.form.searchTerm,
                startIndex: 0
            });
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
        };

        vm.state = {
            rowCount: 10,
            lastIndex: 10,
            currentPage: 1
        };

        vm.searchTerm = '';

        $scope.$on('book-results-ready', function (event, data) {
            vm.data.books = data.bookData.items;
            vm.searchTerm = data.searchTerm;
        });

        vm.nextPage = function () {
            vm.state.currentPage++;
            vm.state.lastIndex = ((vm.state.rowCount * vm.state.currentPage) - vm.state.rowCount);
            vm.changePage();
        }

        vm.lastPage = function () {
            vm.state.currentPage--;
            vm.state.lastIndex = ((vm.state.rowCount * vm.state.currentPage) - vm.state.rowCount);
            vm.changePage();
        }

        vm.changePage = function(){
            BookApiService.search({
                searchTerm: vm.searchTerm,
                startIndex: vm.state.lastIndex
            });
        }

    });

/**
 * @ngdoc directive
 * @name AngularBook.directive:bookCard
 * @function
 * @description
 * # bookCard
 */
myApp
    .directive('bookCard', function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/partials/bookcard.html',
            controller: function ($scope, $attrs) {
                $scope.starClasses = [];
                var averageRating = $scope.book.volumeInfo.averageRating || 0;
                if (averageRating == 0) $scope.starClasses.push('fa-star-o');
                for (var i = averageRating; i > 0; i--) {
                    if (i >= 1) {
                        $scope.starClasses.push('fa-star');
                    } else {
                        $scope.starClasses.push('fa-star-half-o');
                    }
                }
            }
        }
    });

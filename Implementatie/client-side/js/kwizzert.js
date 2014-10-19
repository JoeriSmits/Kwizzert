/**
 * Created by Israpil on 16.10.2014.
 */

var theApp = angular.module("kwizzertApp", ['ngRoute', 'colorpicker.module']).
    config(['$routeProvider',
        function($routeProvider){
            $routeProvider.
                when("/speler", {
                    templateUrl: "templates/speler-start.html",
                }).
                when("/speler-vraag", {
                    templateUrl: "templates/speler-vraag.html",
                }).
                when("/meester", {
                    templateUrl: "templates/meester-start.html"
                }).
                when("/meester-auth" , {
                    templateUrl: "templates/meester-auth.html"
                }).
                when("/meester-catg" , {
                    templateUrl: "templates/meester-catg.html"
                }).
                when("/meester-vraag" , {
                    templateUrl: "templates/meester-vraag.html"
                }).
                when("/meester-antw" , {
                    templateUrl: "templates/meester-antw.html"
                }).
                when("/beamer", {
                    templateUrl: "templates/beamer.html"
                }).
                when("/beamer-antw", {
                    templateUrl: "templates/beamer-antw.html"
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);

theApp.controller("kwizzertController", function($scope, $location){
    $scope.isActive = function (viewLocation) {
        var s = false;
        if($location.path().indexOf(viewLocation) != -1){
            s = true;
        }
        return s;
    };

    $scope.go = function ( path ) {
        $location.path( path );
    };
});
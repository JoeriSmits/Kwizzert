/**
 * Created by Israpil on 16.10.2014.
 */

var theApp = angular.module("kwizzertApp", ['ngRoute', 'colorpicker.module']).
    config(['$routeProvider',
        function($routeProvider){
            $routeProvider.
                when("/home", {
                    templateUrl: "templates/home.html"
                }).
                when("/speler", {
                    templateUrl: "templates/speler-auth.html"
                }).
                when("/speler-start", {
                    templateUrl: "templates/speler-start.html"
                }).
                when("/speler-vraag", {
                    templateUrl: "templates/speler-vraag.html"
                }).
                when("/meester", {
                    templateUrl: "templates/meester.html",
                    controller: "kwizzMeester"
                }).
                when("/beamer", {
                    templateUrl: "templates/beamer.html",
                    controller: "kwizzBeamer"
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);

theApp.controller("kwizzertController", function($scope){
    $scope.isActive = function (viewLocation) {
        var s = false;
        if($location.path().indexOf(viewLocation) != -1){
            s = true;
        }
        return s;
    };
});

theApp.controller("kwizzMeester", function ($scope, $http) {
    $scope.screen = "start";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    function generateRandomCode () {
        var code = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            code += possible.charAt(Math.floor(Math.random() * possible.length));

        return code;
    }

    $scope.saveKwizzUitvoering = function () {
        var kwizzUitvoering = {
            teams: [],
            password: generateRandomCode()
        };

        $http.post("/api/kwizzUitvoering", kwizzUitvoering)
            .error(function(data,status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering",status,data);
            });
        $scope.screen = "auth";
    }
});

theApp.controller("kwizzBeamer", function ($scope) {
    $scope.screen = "start";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };
});
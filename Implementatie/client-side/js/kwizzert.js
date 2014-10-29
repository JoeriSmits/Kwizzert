/**
 * Created by Israpil on 16.10.2014.
 */

var theApp = angular.module("kwizzertApp", ['ngRoute', 'colorpicker.module']).
    config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when("/home", {
                    templateUrl: "templates/home.html"
                }).
                when("/speler", {
                    templateUrl: "templates/speler.html",
                    controller: "kwizzSpeler"
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

theApp.controller("kwizzertController", function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        var s = false;
        if ($location.path().indexOf(viewLocation) != -1) {
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

    function generateRandomCode() {
        var code = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            code += possible.charAt(Math.floor(Math.random() * possible.length));

        return code;
    }

    $scope.saveKwizzUitvoering = function () {
        var kwizzUitvoering = {
            teams: [],
            password: generateRandomCode()
        };

        $http.post("/api/kwizzUitvoeringen", kwizzUitvoering)
            .success(function () {
                //Get all the teams for the kwizzUitvoering
                $http.get("/api/teams/" + kwizzUitvoering.password)
                    .success(function (data) {
                        $scope.teams = data.doc.teams;
                    });
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
        $scope.myCode = kwizzUitvoering.password;
        $scope.screen = "auth";
    };

    $scope.deleteTeam = function (teamName) {
        $http.delete("/api/kwizzUitvoeringen/" + $scope.myCode + "/teams/" + teamName)
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
    }
});

theApp.controller("kwizzBeamer", function ($scope) {
    $scope.screen = "start";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };
});

theApp.controller("kwizzSpeler", function ($scope, $http) {
    $scope.screen = "auth";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    $scope.authPwd = function () {

        console.log('Button click!');

        $http.get("/api/kwizzUitvoering/")      //GET alle kwizz uitvoeringen
            .success( function() {
                console.log("SUCCESS");

            })
            .error( function(data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: kwizzSpeler Error", status, data);
            });

    }
});
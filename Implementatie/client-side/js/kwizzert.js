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

theApp.factory('socketIO', function ($rootScope) {
    var socket = io();
    socket.on("connect", function () {
        console.log("connected", socket.io.engine.id);
    });
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
        id: function () {
            return socket.io.engine.id
        }
    };
});


theApp.controller("kwizzertController", function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        var s = false;
        if ($location.path().indexOf(viewLocation) != -1) {
            s = true;
        }
        return s;
    };
});

theApp.controller("kwizzMeester", function ($scope, $http, socketIO) {
    $scope.screen = "start";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    // Generating an code to link everyone to the right kwizzUitvoering
    function generateRandomCode(number) {
        var code = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < number; i++)
            code += possible.charAt(Math.floor(Math.random() * possible.length));

        return code;
    }

    // Saving a new kwizzUitvoering
    $scope.saveKwizzUitvoering = function () {
        var kwizzUitvoering = {
            teams: [],
            password: generateRandomCode(10)
        };

        $http.post("/api/kwizzUitvoeringen", kwizzUitvoering)
            .success(function () {
                //Get all the teams for the kwizzUitvoering
                $http.get("/api/teams/" + kwizzUitvoering.password)
                    .success(function (data) {
                        $scope.teams = data.doc.teams;
                        socketIO.on('newTeamRegistered', function (team) {
                            if (team.uitvoering === $scope.myCode) {
                                $scope.teams.push(team);
                            }
                        })
                    });
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
        $scope.myCode = kwizzUitvoering.password;
        $scope.screen = "auth";
    };

    // delete a team in the authentication screen
    $scope.deleteTeam = function (teamName) {
        $http.delete("/api/kwizzUitvoeringen/" + $scope.myCode + "/teams/" + teamName)
            .success(function () {
                //Get all the teams for the kwizzUitvoering
                $http.get("/api/teams/" + $scope.myCode)
                    .success(function (data) {
                        $scope.teams = data.doc.teams;
                    });
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
    };

    // Check if the team amount is between 2 and 6
    $scope.checkTeams = function (password) {
        $http.get("/api/teams/" + password)
            .success(function (data) {
                $scope.teams = data.doc.teams;
                if ($scope.teams.length >= 2 && $scope.teams.length <= 6) {
                    $scope.setScreen('catg');
                }
                else {
                    $scope.showError = true;
                }
            });
    };

    // Getting all the individual categories
    $http.get("/api/vragen")
        .success(function (data) {
            var buffer, i;
            var categorieArray = [];
            buffer = data.doc[0].categorie;
            for (i = 0; i < data.doc.length; i = i + 1) {
                if (buffer !== data.doc[i].categorie) {
                    categorieArray.push(data.doc[i].categorie);
                }
                buffer = data.doc[i].categorie;
            }
            $scope.categories = categorieArray;
        });

    $scope.rondeCategorieen = [];

    // Adding new categories to the round with a max of 3
    $scope.addRondeCategorie = function (categorie) {
        if ($scope.rondeCategorieen.length < 3) {
            $scope.rondeCategorieen.push(categorie);
            $scope.categories.splice($scope.categories.indexOf(categorie), 1);
        }
    };

    // Deleting categories and add them to the general list.
    $scope.removeRondeCategorie = function (categorie) {
        $scope.categories.push(categorie);
        $scope.rondeCategorieen.splice($scope.rondeCategorieen.indexOf(categorie), 1);
    };

    $scope.startRonde = function () {
        if($scope.rondeCategorieen.length == 3) {

            var ronde = {
                linkHash: generateRandomCode(25),
                categorieen: $scope.rondeCategorieen,
                status: false
            };

            $scope.linkHash = ronde.linkHash;

            $http.post("/api/ronden/" + $scope.myCode, ronde)
                .success(function () {
                    $scope.setScreen('vraag');
                    socketIO.emit("startRonde", $scope.myCode);
                });

            $scope.rondeVragen = [];
            var i;
            for(i = 0; i < 3; i = i + 1) {
                $http.get('/api/vragen/' + $scope.rondeCategorieen[i])
                    .success(function (data) {
                        var j, arrayRandoms, arrayFull;
                        arrayRandoms = [];

                        // Getting an array of random unique positions
                        while(!arrayFull) {
                            var random = Math.floor((Math.random() * data.doc.length));
                            if(random === data.doc.length) {
                                random = random - 1;
                            }
                            if(arrayRandoms.indexOf(random) === -1) {
                                arrayRandoms.push(random);
                            }
                            if(arrayRandoms.length === 4) {
                                arrayFull = true;
                            }
                        }

                        // Getting the questions related with the random numbers
                        for(j = 0; j < 4; j = j + 1) {
                            $scope.rondeVragen.push(data.doc[arrayRandoms[j]]);
                        }
                    })
            }
        }
    };

    $scope.selectQuestion = function (question) {
        var i;
        // If the kwizzMeester selects a question it will be saved and deleted from the view array.
        for(i = 0; i < $scope.rondeVragen.length; i = i + 1) {
            if ($scope.rondeVragen[i]._id === question) {
                $http.put('api/ronden/' + $scope.linkHash, $scope.rondeVragen[i])
                    .success(function (data) {
                        $scope.myObj = {
                            vraag: data,
                            uitvoeringCode: $scope.myCode
                        };
                        socketIO.emit("nieuweVraag", $scope.myObj);
                    });
                $scope.rondeVragen.splice(i , 1);
            }
        }
        $scope.setScreen('antw');
    };

});

theApp.controller("kwizzBeamer", function ($scope, $http) {
    $scope.screen = "start";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    $scope.authBeamer = function (beamerPassword) {
        $scope.beamerPassword = beamerPassword;

        $http.get("/api/kwizzUitvoeringen/")
            .success(function (data) {
                var i, passwordExist;
                // GET password from database
                for (i = 0; i < data.doc.length; i = i + 1) {
                    if (data.doc[i].password === $scope.beamerPassword) {
                        $scope.screen = "main";
                        passwordExist = true;
                    }
                }
                if (!passwordExist) {
                    alert("Code is fout.")
                }
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: kwizzBeamer Error", status, data);
            })
    }

});

theApp.controller("kwizzSpeler", function ($scope, $http, socketIO) {
    $scope.screen = "auth";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    // Making a link with the right kwizzUitvoering
    $scope.authPwd = function (kwizzListPassword) {
        $scope.kwizzListPassword = kwizzListPassword;

        $http.get("/api/kwizzUitvoeringen/")
            .success(function (data) {
                var i, codeExist;
                // Check if the code exist in the database and if so, continue
                for (i = 0; i < data.doc.length; i = i + 1) {
                    if (data.doc[i].password === $scope.kwizzListPassword) {
                        $scope.screen = "start";
                        codeExist = true;
                    }
                }
                // If not show an error
                if (!codeExist) {
                    alert("code is fout");
                }
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: kwizzSpeler Error", status, data);
            });
    };

    // Saving a team in the database with a reference to the right kwizzUitvoering
    $scope.teamRegister = function (teamInfo) {
        var Team = {
            name: teamInfo.name,
            teamColor: teamInfo.color
        };
        var TeamSocket = {
            name: teamInfo.name,
            teamColor: teamInfo.color,
            uitvoering: $scope.kwizzListPassword
        };

        if(teamInfo.name !== null) {
            $http.get("api/teams/" + $scope.kwizzListPassword)
                .success(function (data) {
                    // Checking if the team name is already in use
                    var i, alreadyInUse;
                    for (i = 0; i < data.doc.teams.length; i = i + 1) {
                        if (Team.name === data.doc.teams[i].name) {
                            alreadyInUse = true;
                        }
                    }
                    // If not then continue with team registration
                    if (!alreadyInUse) {
                        $http.post("api/teams/" + $scope.kwizzListPassword, Team)
                            .success(function () {
                                socketIO.emit('newTeam', TeamSocket);
                                $scope.setScreen('waiting');

                                // Check if the screen is waiting and if event pull it out of waiting modus.
                                socketIO.on('startRonde', function (uitvoeringCode) {
                                    if (uitvoeringCode === $scope.kwizzListPassword) {
                                        $scope.screen = 'vraag';
                                    }
                                })
                            })
                    }
                    // Otherwise show an error
                    else {
                        alert("Team name is already in use. Please try again");
                    }
                })
                .error(function (data, status) {
                    alert("AJAX ERROR");
                    console.log("ERROR: submit kwizzUitvoering", status, data);
                });
        }
        else {
            alert("Team naam kan niet leeg zijn");
        }
    };

    // Question screen
    socketIO.on("nieuweVraag", function (object) {
        if(object.uitvoeringCode === $scope.kwizzListPassword) {
            $scope.question = object.vraag.doc.vraagTekst[object.vraag.doc.vraagTekst.length - 1];
        }
    });

    $scope.submitAnswer = function (answer) {
        if($scope.question !== undefined) {
            console.log("Hey");
        }
    }
});
/**
 * Created by Israpil on 16.10.2014.
 */
/*jslint node:true*/
/*jslint nomen: true*/
/*global angular:true */
/*global io:true */
/*global alert:true */
/*global document:true*/
"use strict";
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
            });
        },
        id: function () {
            return socket.io.engine.id;
        }
    };
});


theApp.controller("kwizzertController", function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        var s = false;
        if ($location.path().indexOf(viewLocation) !== -1) {
            s = true;
        }
        return s;
    };
});

theApp.controller("kwizzMeester", function ($scope, $http, socketIO, $location) {
    $scope.screen = "start";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    // Generating an code to link everyone to the right kwizzUitvoering
    function generateRandomCode(number) {
        var code = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            i;
        for (i = 0; i < number; i = i + 1) {
            code += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return code;
    }

    // Saving a new kwizzUitvoering
    $scope.saveKwizzUitvoering = function () {
        var kwizzUitvoering = {
            teams: [],
            password: generateRandomCode(10),
            status: false
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
                        });
                    });
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
        $scope.myCode = kwizzUitvoering.password;
        $scope.screen = "auth";
    };

    // Delete a team in the authentication screen
    $scope.deleteTeam = function (teamName) {
        $http.delete("/api/kwizzUitvoeringen/" + $scope.myCode + "/teams/" + teamName)
            .success(function () {
                //Get all the teams for the kwizzUitvoering
                $http.get("/api/teams/" + $scope.myCode)
                    .success(function (data) {
                        $scope.teams = data.doc.teams;
                        var myObj = {
                            team: teamName,
                            uitvoering: $scope.myCode
                        };
                        socketIO.emit('teamDeleted', myObj);
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

                // Update status of kwizzUitvoering when a round has started.
                var kwizzUitvoering = {
                    status: true
                };

                $http.put("/api/kwizzUitvoeringen/" + $scope.myCode, kwizzUitvoering)
                    .success(function (data) {
                    })
                    .error(function (data, status) {
                        alert("AJAX ERROR");
                        console.log("ERROR: submit kwizzUitvoering", status, data);
                    });

                $scope.teams = data.doc.teams;
                if ($scope.teams.length >= 1 && $scope.teams.length <= 6) {
                    $scope.setScreen('catg');
                    socketIO.emit("choosingCategories", $scope.myCode);
                } else {
                    $scope.showError = true;
                }
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
    };

    // Getting all the individual categories
    $http.get("/api/vragen")
        .success(function (data) {
            var buffer,
                i,
                categorieArray = [];
            buffer = data.doc[0].categorie;
            for (i = 0; i < data.doc.length; i = i + 1) {
                if (buffer !== data.doc[i].categorie) {
                    categorieArray.push(data.doc[i].categorie);
                }
                buffer = data.doc[i].categorie;
            }
            $scope.categories = categorieArray;
        })
        .error(function (data, status) {
            alert("AJAX ERROR");
            console.log("ERROR: submit kwizzUitvoering", status, data);
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
        if ($scope.rondeCategorieen.length === 3) {
            var ronde = {
                    linkHash: generateRandomCode(25),
                    categorieen: $scope.rondeCategorieen,
                    status: false
                },
                i;

            $scope.selectCatgError = false;
            $scope.linkHash = ronde.linkHash;

            $http.post("/api/ronden/" + $scope.myCode, ronde)
                .success(function () {
                    $scope.setScreen('vraag');
                    socketIO.emit("startRonde", $scope.myCode);
                })
                .error(function (data, status) {
                    alert("AJAX ERROR");
                    console.log("ERROR: submit kwizzUitvoering", status, data);
                });

            $scope.rondeVragen = [];
            for (i = 0; i < 3; i = i + 1) {
                $http.get('/api/vragen/' + $scope.rondeCategorieen[i])
                    .success(function (data) {
                        var j,
                            arrayRandoms,
                            arrayFull,
                            random;
                        arrayRandoms = [];

                        // Getting an array of random unique positions
                        while (!arrayFull) {
                            random = Math.floor((Math.random() * data.doc.length));
                            if (random === data.doc.length) {
                                random = random - 1;
                            }
                            if (arrayRandoms.indexOf(random) === -1) {
                                arrayRandoms.push(random);
                            }
                            if (arrayRandoms.length === 4) {
                                arrayFull = true;
                            }
                        }

                        // Getting the questions related with the random numbers
                        for (j = 0; j < 4; j = j + 1) {
                            $scope.rondeVragen.push(data.doc[arrayRandoms[j]]);
                        }
                    })
                    .error(function (data, status) {
                        alert("AJAX ERROR");
                        console.log("ERROR: submit kwizzUitvoering", status, data);
                    });
            }
        } else {
            $scope.selectCatgError = true;
        }
    };

    $scope.selectQuestion = function (question) {
        $http.delete("/api/antwoorden/" + $scope.linkHash)
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
        var i;
        // If the kwizzMeester selects a question it will be saved and deleted from the view array.
        for (i = 0; i < $scope.rondeVragen.length; i = i + 1) {
            if ($scope.rondeVragen[i]._id === question) {
                $http.put('api/ronden/' + $scope.linkHash, $scope.rondeVragen[i])
                    .success(function (data) {
                        $scope.myObj = {
                            vraag: data,
                            uitvoeringCode: $scope.myCode
                        };
                        socketIO.emit("nieuweVraag", $scope.myObj);
                        $http.get('/api/antwoorden/' + $scope.linkHash)
                            .success(function (data) {
                                $scope.answers = data.doc.ingezonden;
                                var i = 0;
                                socketIO.on('answerSend', function (object) {
                                    i = i + 1;
                                    console.log(i);
                                    if(object.uitvoering === $scope.myCode) {
                                        $scope.answers.push(object.answer);
                                        console.log("***", object);
                                    }
                                })
                            });
                    });
                $scope.choosedQuestion = $scope.rondeVragen[i];
                $scope.rondeVragen.splice(i, 1);
            }
        }
        $scope.setScreen('antw');
    };

    /*$scope.selectedCategory = function (category) {
     var i;
     for (i = 0; i < $scope.rondeCategorieen.length; i = i + 1) {
     console.log("test1: " + $scope.rondeCategorieen.length);
     if ($scope.rondeCategorieen[i]._id === category) {
     console.log("test2: " + $scope.rondeCategorieen[i]._id);
     $http.put('api/ronden/' + $scope.linkHash, $scope.rondeCategorieen[i])
     .success(function (data) {
     console.log("test3: " + $scope.rondeCategorieen[i]);
     $scope.myCatgObj = {
     categorie: data,
     uitvoeringCode: $scope.myCode
     };
     console.log("test4: " + $scope.myCatgObj);
     socketIO.emit("nieuweCategorie", $scope.myCatgObj);
     })
     .error(function (data, status) {
     alert("AJAX ERROR");
     console.log("ERROR: submit kwizzUitvoering", status, data);
     });
     }
     }
     };*/

    // Give points to the team with the correct answer
    $scope.givePoints = function (teamNaam, index) {
        $http.put("api/kwizzUitvoeringen/" + $scope.myCode + "/teams/" + teamNaam)
            .success(function () {
                var myBtn = document.getElementById("button" + index),
                    myRow = document.getElementById("row" + index);
                myBtn.innerHTML = "Punten zijn gegeven aan team " + teamNaam;
                myBtn.setAttribute("class", "btn btn-danger");
                myBtn.removeAttribute("ng-click");
                myBtn.setAttribute("disabled", "true");
                myRow.setAttribute("class", "success");
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
    };

    $scope.closeQuestion = function () {
        $scope.setScreen('vraag');
        var myObj = {
            answer: $scope.choosedQuestion.antwoord,
            linkHash: $scope.linkHash,
            uitvoering: $scope.myCode
        };
        socketIO.emit('choosingQuestion', myObj);
    };

    $scope.newRound = function () {
        $scope.rondeCategorieen = [];
        $scope.setScreen('catg');

        socketIO.emit('endRound', $scope.myCode);
    };

    $scope.closeUitvoering = function () {
        $location.path('/home');
        socketIO.emit('endUitvoering', $scope.myCode);
    };

});

theApp.controller("kwizzBeamer", function ($scope, $http, socketIO) {
    $scope.screen = "start";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    $scope.authBeamer = function (beamerPassword) {

        $scope.beamerPassword = beamerPassword;
        $scope.waitingText = "Gebruik de code: " + $scope.beamerPassword + " om u aan te melden bij deze kwizz."

        $http.get("/api/kwizzUitvoeringen/")
            .success(function (data) {
                var i,
                    passwordExist = false;
                // GET password from database and check if password exists in database
                for (i = 0; i < data.doc.length; i = i + 1) {
                    if (data.doc[i].password === $scope.beamerPassword) {
                        passwordExist = true;
                        $scope.setScreen('main');
                        // Show all the teams on the beamer page
                        $http.get("/api/teams/" + $scope.beamerPassword)
                            .success(function (data) {
                                $scope.uitvoering = data.doc;
                                $scope.gridWidth = Math.floor(12 / $scope.uitvoering.teams.length);
                            })
                            .error(function (data, status) {
                                alert("AJAX ERROR");
                                console.log("ERROR: submit kwizzUitvoering", status, data);
                            });
                    }
                }
                if (!passwordExist) {
                    $scope.beamerAuthError = true;
                }
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: kwizzBeamer Error", status, data);
            });
    };

    // New team registered and will be displayed on the beamer
    socketIO.on("newTeamRegistered", function (teamInfo) {
        if (teamInfo.uitvoering === $scope.beamerPassword) {
            $scope.uitvoering.teams.push(teamInfo);
            console.log("***", teamInfo);
            $scope.gridWidth = Math.floor(12 / $scope.uitvoering.teams.length);
        }
    });
    // kwizz-meester is choosing his categories for the round.
    socketIO.on("choosingCategories", function (uitvoeringCode) {
        if (uitvoeringCode === $scope.beamerPassword) {
            $scope.waitingText = "Wachten op de kwizz-meester om de ronde te starten. U kunt zich niet meer aanmelden als team.";
        }
    });
    
    socketIO.on("answerSend", function (object) {
    if (object.uitvoering === $scope.beamerPassword) {
        var teamWell = document.getElementById(object.answer.teamNaam);
        teamWell.setAttribute('style', 'background-color: green');
    }
    });
    socketIO.on("choosingQuestion", function (object) {
        if (object.uitvoering === $scope.beamerPassword) {
            $scope.answer = object.answer;
            console.log($scope.answer);
            $http.get('api/antwoorden/' + object.linkHash)
                .success(function (data) {
                    $scope.teamAnswers = data.doc.ingezonden;
                    console.log($scope.teamAnswers);
                });
        }
    });
    socketIO.on("nieuweCategorie", function (object) {
        if (object.uitvoeringCode === $scope.beamerPassword) {
            $scope.category = object.categorie.doc;
        }
    });
    // Question screen for beamer
    socketIO.on("nieuweVraag", function (object) {
        if (object.uitvoeringCode === $scope.beamerPassword) {
            // Update question
            $scope.question = object.vraag.doc;
            // Clear the answer
            $scope.answer = "";
            // Clear the team answers
            $scope.teamAnswers = [];
        }
    });
});

theApp.controller("kwizzSpeler", function ($scope, $http, socketIO, $location) {
    $scope.screen = "auth";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    // Making a link with the right kwizzUitvoering
    $scope.authPwd = function (kwizzListPassword) {
        $scope.kwizzListPassword = kwizzListPassword;

        $http.get("/api/kwizzUitvoeringen/")
            .success(function (data) {
                var i, j, codeExist;
                // Check if the code exist in the database and if so, continue
                for (i = 0; i < data.doc.length; i = i + 1) {
                    if (data.doc[i].password === $scope.kwizzListPassword) {
                        codeExist = true;
                        $http.get("/api/kwizzUitvoeringen/")
                            .success(function (data) {
                                for (j = 0; j < data.doc.length; j = j + 1) {
                                    if (data.doc[j].status == false) {          // If the kwizz hasn't started, teams can access Start page
                                        $scope.screen = "start";
                                    } else if (data.doc[j].status == true) {    // Else display this error
                                        $scope.roundStartError = true;
                                    }
                                }
                            });
                    }
                    // If not show an error
                    if (!codeExist) {
                        $scope.authCodeError = true;
                    }
                }
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: kwizzSpeler Error", status, data);
            });
    };

    // Saving a team in the database with a reference to the right kwizzUitvoering
    $scope.teamRegister = function (teamInfo) {
        $scope.Team = {
            name: teamInfo.name,
            teamColor: teamInfo.color,
            score: 0
        };
        var TeamSocket = {
            name: teamInfo.name,
            teamColor: teamInfo.color,
            score: 0,
            uitvoering: $scope.kwizzListPassword
        };

        if (teamInfo.name) {
            $http.get("api/teams/" + $scope.kwizzListPassword)
                .success(function (data) {
                    // Checking if the team name is already in use
                    var i, alreadyInUse;
                    for (i = 0; i < data.doc.teams.length; i = i + 1) {
                        if ($scope.Team.name === data.doc.teams[i].name) {
                            alreadyInUse = true;
                        }
                    }
                    // If not then continue with team registration
                    if (!alreadyInUse) {
                        $http.post("api/teams/" + $scope.kwizzListPassword, $scope.Team)
                            .success(function () {
                                socketIO.emit('newTeam', TeamSocket);
                                $scope.setScreen('waiting');

                                // Check if the screen is waiting and if event pull it out of waiting modus.
                                socketIO.on('startRonde', function (uitvoeringCode) {
                                    if (uitvoeringCode === $scope.kwizzListPassword) {
                                        $scope.setScreen('vraag');
                                    }
                                });
                            })
                            .error(function (data, status) {
                                alert("AJAX ERROR");
                                console.log("ERROR: submit kwizzUitvoering", status, data);
                            });
                    } else {
                        $scope.teamNameError = true;
                    }
                })
                .error(function (data, status) {
                    alert("AJAX ERROR");
                    console.log("ERROR: submit kwizzUitvoering", status, data);
                });
        } else {
            $scope.teamInputError = true;
        }
    };

    // If the team gets deleted then it will be redirected to the home page
    socketIO.on('teamDeleted', function (object) {
        if ($scope.kwizzListPassword === object.uitvoering && object.team === $scope.Team.name) {
            alert("U bent afgewezen door de kwizz-meester.");
            $location.path('/home');
        }
    });

    // Question screen
    socketIO.on("nieuweVraag", function (object) {
        if (object.uitvoeringCode === $scope.kwizzListPassword) {
            $scope.question = object.vraag.doc;
            $scope.setScreen('vraag');
        }
    });

    // Post an answer in the database
    $scope.submitAnswer = function (answer) {
        var answerObj = {
            teamNaam: $scope.Team.name,
            antwoordTekst: answer
        };
        $http.post('/api/antwoorden/' + $scope.question._id, answerObj)
            .success(function () {
                $scope.setScreen('questionSend');
                var myObj = {
                    answer: answerObj,
                    uitvoering: $scope.kwizzListPassword
                };
                socketIO.emit('answerSend', myObj);
                console.log("IK MAG MAAR 1 KEER");
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
    };

    socketIO.on('choosingQuestion', function (object) {
        if (object.uitvoering === $scope.kwizzListPassword) {
            $scope.setScreen('questionSend');
        }
    });

    socketIO.on('endRound', function (uitvoeringCode) {
        if (uitvoeringCode === $scope.kwizzListPassword) {
            $scope.setScreen('waiting');
        }
    });

    socketIO.on('endUitvoering', function (uitvoeringCode) {
        if (uitvoeringCode === $scope.kwizzListPassword) {
            $location.path('/home');
        }
    });
});
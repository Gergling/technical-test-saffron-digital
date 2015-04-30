angular.module('application').controller("application.controller.index", [

    "$rootScope",
    "application.service.window",

    function ($scope, windows) {

        "use strict";

        var field = function (name) {
                return {
                    name: name,
                    label: angular.uppercase(name.charAt(0)) + name.substring(1)
                };
            },
            maxDays = 0,
            Win = function (data) {
                var style = { },
                    start,
                    end,
                    diff = 0,
                    colourCode = 0,
                    red = 0,
                    green = 0,
                    blue = 0;

                var channels = [ ];
                for (var i = 0; i < 3; i += 1) {
                    channels.push(Math.floor(Math.random() * 256));
                }
                style['background-color'] = 'rgb(' + channels.join(",") + ')';

                this.data = data;
                this.remove = function () { };
                this.style = function () {
                    return angular.extend({
                        width: (diff * 100 / maxDays) + '%'
                    }, style);
                };
                this.getDiff = function () {return diff; };
                this.update = function () {
                    if (data.start && data.end) {
                        start = new Date(data.start);
                        end = new Date(data.end);
                        diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24;
                    }
                };
                this.update();
            };

        // Directive properties
        $scope.fields = [
            field("name"),
            field("start"),
            field("end")
        ];

        $scope.windows = [ ];

        // Directive functions
        $scope.addWindow = function () {$scope.windows.push(new Win({ }))};
        $scope.update = function () {
            maxDays = 0;
            $scope.windows.forEach(function (win) {
                maxDays = Math.max(win.getDiff(), maxDays);
            });
        };
        $scope.getData = function () {
            console.log(JSON.stringify($scope.windows));
        };

        // Load the windows
        windows.list().then(function (response) {
            response.forEach(function (win) {
                $scope.windows.push(new Win(win));
            });
            $scope.update();
        });
    }
]);

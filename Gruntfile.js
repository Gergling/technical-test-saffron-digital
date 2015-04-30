module.exports = function (grunt) {

    'use strict';

    var banner = '/* Greg Davies Technical Test */\n'
            + '/* <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        paths = {
            home: process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'],
            css: grunt.file.expand([
                'src/public/vendor/bootstrap/dist/css/bootstrap.css',
                'src/public/module/**/*.css'
            ]),
            js: grunt.file.expand([
                'src/public/vendor/jquery/dist/jquery.js',
                'src/public/vendor/angular/angular.js',
                'src/public/vendor/angular-route/angular-route.js',
                'src/public/vendor/bootstrap/dist/js/bootstrap.js',
                'src/public/module/*/module.js',
                'src/public/module/**/*.js'
            ])
        };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/public/',
                        src: ['windows.json'],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'src/public/vendor/bootstrap/dist/fonts/',
                        src: ['**'],
                        dest: 'dist/fonts/'
                    }
                ]
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: banner
                },
                files: {
                    'dist/css/min.css': paths.css
                }
            }
        },
        jslint: {
            client: {
                src: [ 'src/public/module/**/*.js' ],
                directives: {
                    browser: true,
                    predef: [
                        "angular",
                        "console"
                    ]
                }
            },
            grunt: {
                src: [ 'Gruntfile.js', 'src/template/data/*.js', 'src/template/data/**/*.js' ],
                directives: { node: true }
            }
        },
        ngtemplates: {
            application: {
                cwd:    'src/public',
                src:    'module/**/*.html',
                dest:   'dist/min.js',
                options:  {
                    append: true,
                    htmlmin: {
                        collapseBooleanAttributes:      true,
                        collapseWhitespace:             true,
                        removeAttributeQuotes:          true,
                        removeComments:                 true, // Only if you don't use comment directives! 
                        removeEmptyAttributes:          true,
                        removeRedundantAttributes:      true,
                        removeScriptTypeAttributes:     true,
                        removeStyleLinkTypeAttributes:  true
                    }
                }
            }
        },
        template: {
            dev: {
                options: {
                    data: {
                        prefix: 'src/public/',
                        paths: paths
                    }
                },
                files: {
                    'src/public/index.html': ['src/template/index.html.tpl']
                }
            },
            dist: {
                options: {
                    data: {
                        prefix: 'dist/',
                        paths: {
                            css: [ 'dist/css/min.css' ],
                            js: [ 'dist/min.js' ]
                        }
                    }
                },
                files: {
                    'dist/index.html': ['src/template/index.html.tpl']
                }
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            dist: {
                files: {
                    'dist/min.js': paths.js
                }
            }
        },
        watch: {
            bootstrap: {
                files: '<%= jslint.client.src %>',
                tasks: [ 'template:dev', 'jslint:client' ]
            },
            bower: {
                files: [ 'bower.json' ],
                tasks: [ 'bower' ]
            },
            gruntfile: {
                files: '<%= jslint.grunt.src %>',
                tasks: [ 'jslint:grunt' ]
            }
        }
    });

    grunt.registerTask('data', "Generate JSON File", function () {
        var window = function (name, start, end) {
            return {
                name: name,
                start: start,
                end: end
            };
        };

        grunt.file.write("src/public/windows.json", JSON.stringify([
            window("Foo", "2015-04-01", "2015-04-10"),
            window("Bar", "2015-04-03", "2015-04-11"),
            window("Baz", "2015-04-10", "2015-04-12")
        ]));
    });

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-template');

    // By default, generate dev template
    grunt.registerTask('default', [ 'template:dev' ]);

    // Distribution code generation
    grunt.registerTask('dist', [
        'jslint',
        'copy:dist',
        'uglify',
        'ngtemplates:application',
        'cssmin',
        'template:dist'
    ]);

    // Deploys dist code to Google Drive
    grunt.registerTask('deploy', [ 'copy:deploy' ]);
};

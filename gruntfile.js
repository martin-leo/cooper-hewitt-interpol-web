/*

  Ce fichier regroupe les différentes tâches grunt :

  A. init (Initialisation) :
    But : à ne lancer qu'une fois en début de projet, cette tâche créé la structure de projet à l'aide de grunt-mkdir
    1. création de la structure de fichier (grunt-mkdir)
  B. default (Développement)
    But : Gère l'ensemble des tâches lors de la phase de développement
    1. jshint : vérification du JavaScript
    2. concaténation des fichiers html/js (grunt-contrib-concat)
    3. compilation JavaScript
    4. copie des fichiers html (grunt-contrib-copy)
    5. compilation du SCSS (grunt-contrib-sass)
    6. linting du CSS (grunt-contrib-csslint)
    7. préfixage du CSS (grunt-autoprefixer)
    8. suppression des commentaires dans le HTML (grunt-stripcomments)
    9. linting HTML (grunt-htmllint-http)
    10. vérification WCAG AAA (grunt-accessibility)
    11. suivi des modifications (grunt-contrib-watch)
  C. prod (Production)
    But : Génère la version de production. Identique à B. avec les paramètres de production et l'absence de suivi des modifications

*/
module.exports = function (grunt) {

  // require
  require('google-closure-compiler').grunt(grunt);

  // init
  grunt.initConfig({

   /*----------------------*
    | Création de dossiers |
    *----------------------*

    Création de la structure de sortie :

    site/
    |
    |- assets/
    |   |- css/
    |   |- fonts/
    |   |- image/
    |   |- js/

  */
    mkdir: {
      init: {
        options: {
          create: [
            'site/assets/css',
            'site/assets/fonts',
            'site/assets/image',
            'site/assets/js',
          ],
        },
      },
    },

   /*--------*
    | JShint |
    *--------*

    Vérifie le JS à l'aide de JShint

   */

    jshint: {
      all: [
        'src/js/*.js',
      ],
    },

   /*---------------*
    | Concaténation |
    *---------------*

    Concatène tous les fichiers de /src/js/ en un seul fichier site/assets/js/s.js

   */
    concat: {
      dist: {
        src: [
          'src/js/*.js',
        ],
        dest: 'site/assets/js/s.js',
      },
    },

   /*------------------*
    | Closure compiler |
    *------------------*

    Compile le JavaScript à l'aide du Google Closure Compiler.

   */
    'closure-compiler': {
      prod: {
        files: {
          'site/assets/js/s.js': 'site/assets/js/s.js',
        },
        options: {
          compilation_level: 'ADVANCED',
          language_in: 'ECMASCRIPT5_STRICT',
        },
      },
    },

   /*-------------------*
    | Copie de fichiers |
    *-------------------*

    Copie de fichiers source dans la structure de sortie.

   */
    copy: {
      main: {
        expand: false,
        src: 'src/html/index.html',
        dest: 'site/index.html',
      },
    },

   /*-------------------------*
    | Compilation SASS -> CSS |
    *-------------------------*

    Compile les fichiers SASS vers un CSS

    */
    sass: {
      dev: {
        options: {
          style: 'nested',
        },
        files: {
          'site/assets/css/styles.css': 'src/scss/main.scss',
        }
      },
      prod: {
        options: {
          style: 'compressed',
        },
        files: {
          'site/assets/css/styles.css': 'src/scss/main.scss',
        }
      },
    },

   /*-----------------------*
    | Préfixage automatique |
    *-----------------------*

    Préfixe automatiquement le CSS d'après les paramètres renseignés dans le fichier browserlist.

    */
    autoprefixer: {
      prod: {
        src: 'site/assets/css/styles.css',
      },
    },

   /*----------------*
    | validation CSS |
    *----------------*

    Vérifie le CSS.

    */
    csslint: {
      strict: {
        options: {
          import: 2, // false: règle ignorée, 2 : renvoie une erreur plutôt qu'un warning
        },
        src: [
          'site/assets/css/styles.css',
        ],
      },
    },

   /*------------------------------*
    | Suppression des commentaires |
    *------------------------------*

    Supprime les commentaires /* & // dans le HTML

    */
    comments: {
      traitement: {
        options: {
            singleline: true,
            multiline: true,
        },
        src: [
          'site/index.html',
        ],
      },
    },

   /*-----------------*
    | validation HTML |
    *-----------------*

    Valide le HTML avec about.validator.nu

    */
    'htmllint-http': {
      dist: {
        urls: [
          'http://localhost/cooper-hewitt-interpol-web/site/index.html',
        ],
      },
    },


    /*--------------------*
    | validation WCAG2AAA |
    *---------------------*

    Valide le HTML comme conforme à la norme WCAG2AAA.

    */
    accessibility: {
      options: {
        accessibilityLevel: 'WCAG2AAA'
      },
      test: {
        options: {
          urls: [
            'http://localhost/cooper-hewitt-interpol-web/site/index.html',
          ],
        },
      }
    },

   /*---------------------*
    | Suivi en temps réel |
    *---------------------*

    Relance la compilation du site lors de toute modification du code source.

    */
    watch: {
      options: {
        spawn: false,
        livereload: true,
      },
      script: {
        files: [
          'src/**/*',
        ],
        tasks: [
          'jshint',
          'concat',
          'copy',
          'sass',
          'csslint',
          'autoprefixer',
          'comments',
          'htmllint-http',
          'accessibility',
        ],
      },
    },
  });

 /*-----------------------*
  | Chargement des tâches |
  *-----------------------*/

  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-stripcomments');
  grunt.loadNpmTasks('grunt-htmllint-http');
  grunt.loadNpmTasks('grunt-accessibility');
  grunt.loadNpmTasks('grunt-contrib-watch');

  /*--------------------------*
  | Enregistrement des tâches |
  *---------------------------*/

  // initialisation
  grunt.registerTask('init', [
                                'mkdir',
                             ]);

  // développement
  grunt.registerTask('default', [
                                  'jshint',
                                  'concat',
                                  'copy',
                                  'sass:dev',
                                  'csslint',
                                  'autoprefixer',
                                  'comments',
                                  'htmllint-http',
                                  "accessibility",
                                  'watch',
                                ]);

  // production
  grunt.registerTask('prod', [
                              'jshint',
                              'concat',
                              'closure-compiler',
                              'copy',
                              'sass:prod',
                              'csslint',
                              'autoprefixer',
                              'comments',
                              'htmllint-http',
                              "accessibility",
                            ]);
};

angular
    .module
        ('cibcharts',
            ['ui.router',
             'toastr',
             'ngResource',
             'ngAnimate',
             'ncy-angular-breadcrumb'
            ]
        )
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode({enabled: false, requireBase: false, rewriteLinks: false});

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: 'assets/app/views/home.html',
                controller: 'home.controller',
                ncyBreadcrumb: {
                    label: 'Dashboard'
                },
                activetab: 'home'
            })
            .state('monitoramento-colombari', {
                  url: "/propriedades/colombari",
                  templateUrl: 'assets/app/views/colombari/chart.html',
                  controller: 'colombari.controller',
                    ncyBreadcrumb: {
                        label: 'Colombari'
                    },
                  activetab: 'monitoramento-colombari',
                  params: {
                      obj: null
                  }
              })
            .state('monitoramento-haacke', {
                url: "/propriedades/haacke",
                templateUrl: 'assets/app/views/haacke/chart.html',
                controller: 'haacke.controller',
                ncyBreadcrumb: {
                    label: 'Haacke'
                },
                activetab: 'monitoramento-haacke',
                params: {
                    obj: null
                }
            })
            .state('monitoramento-itaipu', {
                url: "/propriedades/itaipu",
                templateUrl: 'assets/app/views/itaipu/chart.html',
                controller: 'itaipu.controller',
                ncyBreadcrumb: {
                    label: 'Itaipu'
                },
                activetab: 'monitoramento-itaipu',
                params: {
                    obj: null
                }
            })
            .state('monitoramento-starmilk', {
                url: "/propriedades/starmilk",
                templateUrl: 'assets/app/views/starmilk/chart.html',
                controller: 'starmilk.controller',
                ncyBreadcrumb: {
                    label: 'Starmilk'
                },
                activetab: 'monitoramento-starmilk',
                params: {
                    obj: null
                }
            })
            .state('monitoramento-stein', {
                url: "/propriedades/stein",
                templateUrl: 'assets/app/views/stein/chart.html',
                controller: 'stein.controller',
                ncyBreadcrumb: {
                    label: 'Stein'
                },
                activetab: 'monitoramento-stein',
                params: {
                    obj: null
                }
            })
            .state('agil-indicadoranual', {
                url: "/agil/indicadoranual",
                templateUrl: 'assets/app/views/indicadoranual/chart.html',
                /*Necessario se a pagina tem apenas uma controller*/
                //controller: 'indicadoranual.controller',
                ncyBreadcrumb: {
                    label: 'Indicador Anual'
                },
                activetab: 'agil-indicadoranual',
                params: {
                    obj: null
                }
            })
            .state('agil-indicadormensal', {
                url: "/agil/indicadormensal",
                templateUrl: 'assets/app/views/indicadormensal/chart.html',
                //controller: 'indicadormensal.controller',
                ncyBreadcrumb: {
                    label: 'Indicador Mensal'
                },
                activetab: 'agil-indicadormensal',
                params: {
                    obj: null
                }
            })
            .state('agil-dashboard', {
                url: "/agil/dashboard",
                templateUrl: 'assets/app/views/agil-dashboard/dashboard.html',
                //controller: 'indicadormensal.controller',
                ncyBreadcrumb: {
                    label: 'Indicador Mensal'
                },
                activetab: 'agil-dashboard',
                params: {
                    obj: null
                }
            })
            .state('enermac', {
                  url: "/enermac",
                  templateUrl: 'assets/app/views/enermac/chart.html',
                  controller: 'enermac.controller',
                    ncyBreadcrumb: {
                        label: 'Enermac'
                    },
                  activetab: 'enermac',
                  params: {
                      obj: null
                  }
              })

    })
    /*Para carregar o breacrumb*/
    .config(function($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            template: '<li><span ng-repeat="step in steps">{{step.ncyBreadcrumbLabel}}</span></li>'
        });
    /*Responsavel por ativar os itens da barra lateral*/
    }).run(function($rootScope, $state) {
        $rootScope.$state = $state;
    /*Configuracao das torradas*/
    }).config(function(toastrConfig) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-right',
            allowHtml: false,
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            extendedTimeOut: 2000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            messageClass: 'toast-message',
            onHidden: null,
            onShown: null,
            onTap: null,
            progressBar: false,
            tapToDismiss: true,
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 7000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    })
    /*Configuracao de loading dos graficos*/
    .config(function($provide) {
        $provide.decorator('$q', ['$delegate', '$rootScope', function($delegate, $rootScope) {
            var pendingPromisses = 0;
            $rootScope.$watch(
                function() { return pendingPromisses > 0; },
                function(loading) { $rootScope.loading = loading; }
            );
            var $q = $delegate;
            var origDefer = $q.defer;
            $q.defer = function() {
                var defer = origDefer();
                pendingPromisses++;
                defer.promise.finally(function() {
                    pendingPromisses--;
                });
                return defer;
            };
            return $q;
        }]);
    });
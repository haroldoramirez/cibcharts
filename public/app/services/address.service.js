angular.module('cibcharts')
    /*Servicos - Usuario*/
    .service('Usuario',['$resource',
    function($resource){
        return $resource('usuario/:id', {}, {
            cadastrar: {method: 'POST', url: 'usuario/cadastrar', isArray: false},
            update: {method: 'PUT', url: 'usuario/:id', isArray: false},
            getAll: {method: 'GET', url: 'usuarios', isArray: true},
            reset: {method: 'POST', url: 'reset/senha', isArray: false},
            getFiltroUsuarios: {method: 'GET', url: 'usuarios/filtro/:filtro', isArray: true},
            getAutenticado: {method: 'GET', url: 'current', isArray: false}
        });
    }])
    /*Servicos - Propriedades*/
    .service('Propriedade',['$resource',
    function($resource){
        return $resource('monitoramento/propriedade/:id', {}, {
           getAll: {method: 'GET', url: 'monitoramento/propriedades', isArray: true}
        });
    }])
    /*Servicos - Base Total*/
    .service('BaseTotal',['$resource',
        function($resource){
            return $resource('monitoramento/basetotal/:id', {}, {
                getBaseYears: {method: 'GET', url: 'monitoramento/basetotal/anos', isArray: true},
                getBaseFiltered: {method: 'GET', url: 'monitoramento/basetotal/filtro/:ano/:mes', isArray: true},
                getIndicatorYear: {method: 'GET', url: 'monitoramento/basetotal/indicador/:ano', isArray: false},
                getBaseFilteredByPropertyAndYear: {method: 'GET', url: 'monitoramento/basetotal/propriedade/:propriedade/:ano', isArray: true}
            });
    }])
    /*Servicos - Base Calculada Dia*/
    .service('BaseCalculadaDia',['$resource',
        function($resource){
            return $resource('monitoramento/basecalculadadia/:id', {}, {
                getBaseDayFilteredByPropertyAndYear: {method: 'GET', url: 'monitoramento/basecalculadadia/propriedade/:propriedade/:ano/:mes', isArray: true}
            });
    }])
    /*Servicos - Base de Pings*/
    .service('BasePing',['$resource',
        function($resource){
            return $resource('monitoramento/baseping/:id', {}, {
                getBasePingFilteredByPropertyYearMonth: {method: 'GET', url: 'monitoramento/baseping/propriedade/:propriedade/:ano/:mes', isArray: true}
            });
    }])
    /*Servicos - Enermac*/
   .service('EnermacMonitoramento',['$resource',
       function($resource){
           return $resource('enermac/:id', {}, {
               getAll: {method: 'GET', url: 'enermac/monitoramento', isArray: true},
               getLast: {method: 'GET', url: 'enermac/monitoramento/last', isArray: false}
           });
   }])
   /*Servicos - Enermac - Estatistica*/
  .service('EnermacEstatistica',['$resource',
      function($resource){
          return $resource('enermac/estatisticas/:id', {}, {
              cadastrar: {method: 'POST', url: 'enermac/estatisticas', isArray: false},
              getAll: {method: 'GET', url: 'enermac/estatisticas/lista/todos', isArray: true},
              getLastEstatistica: {method: 'GET', url: 'enermac/estatistica/last', isArray: false}
          });
  }]);

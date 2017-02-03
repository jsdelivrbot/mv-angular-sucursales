(function () {
    'use strict';

    angular.module('acSucursalesAdministracion', [])
        .component('acSucursalesAdministracion', acSucursalesAdministracion());

    function acSucursalesAdministracion() {
        return {
            bindings: {
                searchFunction: '&'
            },
            templateUrl: window.installPath + '/mv-angular-sucursales/ac-sucursales-administracion.html',
            controller: AcSucursalController
        }
    }

    AcSucursalController.$inject = ["SucursalesVars", 'SucursalesService', "AcUtils"];
    /**
     * @param AcUsuarios
     * @constructor
     */
    function AcSucursalController(SucursalesVars, SucursalesService, AcUtils) {
        var vm = this;

        vm.sucursales = [];
        vm.sucursal = {};
        vm.detailsOpen = false;

        vm.save = save;
        vm.cancel = cancel;
        vm.setData = setData;
        vm.loadSucursales = loadSucursales;
        vm.remove = remove;

        loadSucursales();

        function loadSucursales() {
            SucursalesService.get().then(function (data) {
                setData(data);
            });
        }

        function save() {
            //console.log(vm.sucursal);

            if(vm.sucursal.telefono != undefined && vm.sucursal.telefono.length > 0) {
                if(!AcUtils.validaTelefono(vm.sucursal.telefono)) {
                    AcUtils.showMessage('error', 'El formato del teléfono no es correcto.');
                    return;
                }
            }

            if(vm.sucursal.nombre === undefined || vm.sucursal.direccion === undefined) {
                AcUtils.showMessage('error', 'El nombre y la dirección no pueden ser vacio');
                return;
            } else {
                SucursalesService.save(vm.sucursal).then(function (data) {
                    vm.sucursal = {};
                    vm.detailsOpen = (data === undefined || data < 0) ? true : false;
                    loadSucursales();
                    if(data === undefined)
                        AcUtils.showMessage('error', 'Error actualizando el dato');
                    else
                        AcUtils.showMessage('success', 'La operación se realizó satisfactoriamente');
                }).catch(function (data) {
                    vm.sucursal = {};
                    vm.detailsOpen = true;
                });
            }

        }

        function setData(data) {
            vm.sucursales = data;
            vm.paginas = SucursalesVars.paginas;
        }

        function remove() {
            if(vm.sucursal.sucursal_id == undefined) {
                alert('Debe seleccionar una sucursal');
            } else {
                var result = confirm('¿Esta seguro que desea eliminar la sucursal seleccionada?');
                if(result) {
                    SucursalesService.remove(vm.sucursal.sucursal_id, function(data){
                        vm.sucursal = {};
                        vm.detailsOpen = false;
                        loadSucursales();
                        AcUtils.showMessage('success', 'La registro se borro satisfactoriamente');
                    });
                }
            }
        }


        function cancel() {
            vm.sucursales = [];
            vm.sucursal={};
            vm.detailsOpen=false;
            SucursalesVars.clearCache = true;
            loadSucursales();
        }


        // Implementación de la paginación
        vm.start = 0;
        vm.limit = SucursalesVars.paginacion;
        vm.pagina = SucursalesVars.pagina;
        vm.paginas = SucursalesVars.paginas;

        function paginar(vars) {
            if (vars == {}) {
                return;
            }
            vm.start = vars.start;
            vm.pagina = vars.pagina;
        }

        vm.next = function () {
            paginar(AcUtils.next(SucursalesVars));
        };
        vm.prev = function () {
            paginar(AcUtils.prev(SucursalesVars));
        };
        vm.first = function () {
            paginar(AcUtils.first(SucursalesVars));
        };
        vm.last = function () {
            paginar(AcUtils.last(SucursalesVars));
        };

        vm.goToPagina = function () {
            paginar(AcUtils.goToPagina(vm.pagina, SucursalesVars));
        }

    }


})();

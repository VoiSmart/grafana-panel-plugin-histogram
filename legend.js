define([
  'angular',
  'lodash',
  'app/app',
  'jquery',
  'jquery.flot',
  'jquery.flot.time',
],
function (angular, _, app, $) {
  'use strict';

  var module = angular.module('grafana.panels.histogram', []);
  app.useModule(module);

  module.directive('histogramLegend', function(popoverSrv) {

    return {
      link: function(scope, elem) {
        var $container = $('<section class="graph-legend"></section>');
        var firstRender = true;
        var panel = scope.panel;
        var data;
        var seriesList;
        var i;

        scope.$on('render', function() {
          data = scope.seriesList;
          if (data) {
            render();
          }
        });

        function getSeriesIndexForElement(el) {
          return el.parents('[data-series-index]').data('series-index');
        }

        function openColorSelector(e) {
          // if we clicked inside poup container ignore click
          if ($(e.target).parents('.popover').length) {
            return;
          }

          var el = $(e.currentTarget).find('.fa-minus');
          var index = getSeriesIndexForElement(el);
          var seriesInfo = seriesList[index];
          var popoverScope = scope.$new();
          popoverScope.series = seriesInfo;
        }

        function render() {
          if (firstRender) {
            elem.append($container);
            $container.on('click', '.graph-legend-icon', openColorSelector);
            firstRender = false;
          }

          seriesList = data;

          $container.empty();

          for (i = 0; i < seriesList.length; i++) {
            var series = seriesList[i];

            // ignore empty series
            if (panel.legend.hideEmpty && series.allIsNull) {
              continue;
            }
            // ignore series excluded via override
            if (!series.legend) {
              continue;
            }
            // ignore zero series
            if (panel.legend.hideZero && series.allIsZero) {
              continue;
            }

            var html = '<div class="graph-legend-series';
            if (series.yaxis === 2) { html += ' pull-right'; }
            if (scope.hiddenSeries[series.alias]) { html += ' graph-legend-series-hidden'; }
            html += '" data-series-index="' + i + '">';
            html += '<div class="graph-legend-icon">';
            html += '<i class="fa fa-minus pointer" style="color:' + series.color + '"></i>';
            html += '</div>';

            html += '<div class="graph-legend-alias">';
            html += '<a>' + _.escape(series.label) + '</a>';
            html += '</div>';

            html += '</div>';
            $container.append($(html));
          }
        }
      }
    };
  });

});

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

          if (panel.legend.sort) {
            seriesList = _.sortBy(seriesList, function(series) {
              return series.stats[panel.legend.sort];
            });
            if (panel.legend.sortDesc) {
              seriesList = seriesList.reverse();
            }
          }

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

            if (panel.legend.values) {
              var avg = series.formatValue(series.stats.avg);
              var current = series.formatValue(series.stats.current);
              var min = series.formatValue(series.stats.min);
              var max = series.formatValue(series.stats.max);
              var total = series.formatValue(series.stats.total);

              if (panel.legend.min) { html += '<div class="graph-legend-value min">' + min + '</div>'; }
              if (panel.legend.max) { html += '<div class="graph-legend-value max">' + max + '</div>'; }
              if (panel.legend.avg) { html += '<div class="graph-legend-value avg">' + avg + '</div>'; }
              if (panel.legend.current) { html += '<div class="graph-legend-value current">' + current + '</div>'; }
              if (panel.legend.total) { html += '<div class="graph-legend-value total">' + total + '</div>'; }
            }

            html += '</div>';
            $container.append($(html));
          }
        }
      }
    };
  });

});

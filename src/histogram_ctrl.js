import {MetricsPanelCtrl} from 'app/plugins/sdk';
import {GraphCtrl} from 'app/plugins/panel/graph/module';
import template from './template';

export class HistogramCtrl extends GraphCtrl {

  onInitEditMode() {
    super.onInitEditMode();
    this.addEditorTab('Histogram Options', 'public/plugins/grafana-histogram-panel/tab_options.html');
  }
}

HistogramCtrl.template = template;

function GraphMaker(dom_id, raw_data, iterations_used, bins){
  this.dom_id = dom_id;
  this.dom_ctx = document.getElementById(dom_id).getContext('2d');
  this.options = build_options();

  function build_options(){
    let hist = get_hist_data();
    return {
      type: 'line',
      data: {
        labels: hist[0],
        datasets: [{
          data: hist[1],
          backgroundColor: '#9b59b6',
    			borderColor: '#9b59b6',
          pointBackgroundColor: '#8e44ad',
          pointHoverBackgroundColor: '#511659',
          pointRadius: 1,
          pointHitRadius: 10,
          pointHoverRadius: 10
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Probability of getting all cards'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Number of packs opened'
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 7,
              maxRotation: 0,
              minRotation: 0
            }
          }]
        }
      }
    };
  }

  function get_hist_data(){
    let histogram = [];
    let histogram_labels = [];
    let hist_bins = bins;
    let hist_min = Math.min(...raw_data);
    let hist_max = Math.max(...raw_data);
    let hist_step = (hist_max - hist_min) / hist_bins;
    for(let i = 1; i <= hist_bins; i++){
      histogram.push(0);
      histogram_labels.push(Math.round(hist_min + hist_step * i));
    }

    raw_data.forEach(function(item){
      let hist_index = Math.trunc((item - hist_min) / hist_step);
      histogram[hist_index]++;
    });

    let cumm_hist = [histogram[0]];
    for(let i = 1; i < hist_bins; i++){
      let item = cumm_hist[cumm_hist.length - 1] + histogram[i];
      cumm_hist.push(item);
    }

    cumm_hist.forEach(function(item, index){
      cumm_hist[index] /= iterations_used;
      cumm_hist[index] = cumm_hist[index].toFixed(2);
    });

    return [histogram_labels, cumm_hist];
  }
}

GraphMaker.prototype.reset_context = function(id){
  $('#' + id).remove();

  let graph_height = window.innerHeight > window.innerWidth ? 200 : 100;
  $('#graph-container').append('<canvas id="cumulative" height="' + graph_height + '"></canvas>');
  return document.querySelector('#' + id).getContext('2d');
}

GraphMaker.prototype.build_graph = function(){
  return new Chart(this.reset_context(this.dom_id), this.options);
}

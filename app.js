"use strict";

var kosovo = void 0;
var lastDay = void 0;

var lastWeekCases = [];
var lastWeekDeaths = [];

var lastMonthCases = [];
var lastMonthDeaths = [];

axios({
  method: "get",
  url: "https://pomber.github.io/covid19/timeseries.json"
}).then(function (res) {
  let data = res.data;
  kosovo = data["Kosovo"];
  setLastDay(kosovo);
  renderTable(lastDay);
  renderLastWeek();
  renderLastMonth();
  renderLastWeekDeaths();
  renderLastMonthDeaths();
  });

function renderChart(labels, cases, chartEl, label, chartType, labelsdata, borderWidth) {
  var ctx = document.querySelector(chartEl).getContext("2d"); //

  var delayed = void 0;

  //Gradient Fill
  var gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(58, 123, 231, 1)");
  gradient.addColorStop(1, "rgba(0, 210, 255 , 0.7)");

  var data = {
    labels: labels,
    datasets: [{
      data: cases,
      label: label, //
      fill: false,
      backgroundColor: gradient,
      borderColor: "rgb(75, 192, 192)",
      datalabels: {},
      borderWidth: borderWidth,
      // pointBackgroundColor: "rgba(189, 195, 199, 0.4)",
      tension: 0.2
    }]
  };

  var config = {
    type: chartType,
    data: data,
    plugins: [ChartDataLabels],
    options: {
      // clip: {left: 0, top: 0, right: 0, bottom: 0},
      radius: 2,
      hitRadius: 20,
      responsive: true,
      animation: {
        onComplete: function onComplete() {
          delayed = true;
        },
        delay: function delay(context) {
          var delay = 0;
          if (context.type === "data" && context.mode === "default" && !delayed) {
            delay = context.dataIndex * 200 + context.datasetIndex * 100;
          }
          return delay;
        }
      },
      hoverRadius: 10,
      scales: {
        y: {
          ticks: {
            callback: function callback(value) {
              // return "$" + value + "m";
              return value;
            }
          }
        }
      }

    }
  };

  if (labelsdata) {
    data.datasets[0].datalabels = {
      color: 'rgb(75, 192, 192)',
      anchor: 'end',
      align: 'top',
      font: {
        weight: 'bold'
      }
    };
    config.plugins = [ChartDataLabels];
  } else {
    data.datasets[0].datalabels = {};
    config.plugins = [];
  }

  var myChart = new Chart(ctx, config);
}

function getLabels(numDays) {
  return kosovo.slice(kosovo.length - numDays).map(function (item) {
    if (item.date.length < 9) {
      return "0" + item.date.slice(item.date.length - 1) + "/" + "0" + item.date.slice(item.date.length - 3, item.date.length - 2);
    } else if (item.date.length < 10) {
      return item.date.slice(item.date.length - 2) + "/" + "0" + item.date.slice(item.date.length - 4, item.date.length - 3);
    }
  });
}

// Last Week Chart
function renderLastWeek() {
  getLastWeekConfirmed();
  renderChart(getLabels(7), lastWeekCases, "#lastWeekChart", "Rastet e konfirmuara", 'bar', true, 0);
}

function getLastWeekConfirmed() {
  var last7 = kosovo.slice(kosovo.length - 8);
  for (var i = 1; i < last7.length; i++) {
    lastWeekCases.push(last7[i].confirmed - last7[i - 1].confirmed);
  }
}

function getLastWeekDeaths() {
  var last7 = kosovo.slice(kosovo.length - 8);
  for (var i = 1; i < last7.length; i++) {
    lastWeekDeaths.push(last7[i].deaths - last7[i - 1].deaths);
  }
}

function renderLastWeekDeaths() {
  getLastWeekDeaths();
  renderChart(getLabels(7), lastWeekDeaths, "#lastWeekDeathsChart", "Vdekjet", 'bar', true, 0);
}

function renderLastMonth() {
  getLastMonthConfirmed();
  renderChart(getLabels(30), lastMonthCases, "#lastMonthChart", "Rastet e konfirmuara", 'line', false, 5);
}

function renderLastMonthDeaths() {
  getLastMonthDeaths();
  renderChart(getLabels(30), lastMonthDeaths, "#lastMonthDeathsChart", "Vdekjet", 'line', false, 5);
}

function getLastMonthConfirmed() {
  var last30 = kosovo.slice(kosovo.length - 31);
  for (var i = 1; i < last30.length; i++) {
    lastMonthCases.push(last30[i].confirmed - last30[i - 1].confirmed);
  }
}

function getLastMonthDeaths() {
  var last30 = kosovo.slice(kosovo.length - 31);
  for (var i = 1; i < last30.length; i++) {
    lastMonthDeaths.push(last30[i].deaths - last30[i - 1].deaths);
  }
}

function setLastDay(data) {
  lastDay = {
    date: data[data.length - 1].date,
    confirmed: data[data.length - 1].confirmed - data[data.length - 2].confirmed,
    deaths: data[data.length - 1].deaths - data[data.length - 2].deaths
  };
}

function renderTable(data) {
  var dateEl = document.querySelector('p#date');
  var casesEl = document.querySelector('p#cases');
  var deathsEl = document.querySelector('p#deaths');

  dateEl.textContent = renderDate(data.date);
  casesEl.textContent = data.confirmed;
  deathsEl.textContent = data.deaths;
}

function renderDate(date) {
  var myDate = new Date(date);
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(myDate);
}
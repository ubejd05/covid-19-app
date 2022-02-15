let kosovo;
let lastDay;

let lastWeekCases = [];
let lastWeekDeaths = [];

let lastMonthCases = [];
let lastMonthDeaths = [];


fetch("https://pomber.github.io/covid19/timeseries.json")
  .then((response) => response.json())
  .then((data) => {
    kosovo = data["Kosovo"];
    setLastDay(kosovo);
    renderTable(lastDay);
    renderLastWeek();
    renderLastMonth();
    renderLastWeekDeaths();
    renderLastMonthDeaths();
  });


function renderChart(labels, cases, chartEl, label, chartType, labelsdata) {
  const ctx = document.querySelector(chartEl).getContext("2d"); //

  let delayed;

  //Gradient Fill
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(58, 123, 231, 1)");
  gradient.addColorStop(1, "rgba(0, 210, 255 , 0.3)");

  const data = {
    labels,
    datasets: [
      {
        data: cases,
        label: label, //
        fill: false,
        backgroundColor: gradient,
        borderColor: "rgb(75, 192, 192)",
        datalabels: {},
        // pointBackgroundColor: "rgba(189, 195, 199, 0.4)",
        tension: 0.2,
      },
    ],
  };


  const config = {
    type: chartType,
    data: data,
    plugins: [ChartDataLabels],
    options: {
      // clip: {left: 0, top: 0, right: 0, bottom: 0},
      radius: 3,
      hitRadius: 20,
      responsive: true,
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === "data" && context.mode === "default" && !delayed) {
            delay = context.dataIndex * 200 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      hoverRadius: 10,
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              // return "$" + value + "m";
              return value;
            },
          },
        },
      },
      
      // plugins: {
      //   tooltip: {
      //     enabled: true, //this is by default true
      //     interaction: {
      //       intersect: true,
      //     }
      //   }
      // },
    },
  };

  
  if (labelsdata) {
    data.datasets[0].datalabels = {
      color: 'rgb(75, 192, 192)',
      anchor: 'end',
      align: 'top',
      font: {
        weight: 'bold'
      }
    }
    config.plugins = [ChartDataLabels];
  } else {
    data.datasets[0].datalabels = {};
    config.plugins = [];

  }

  const myChart = new Chart(ctx, config);
}

function getLabels(numDays) {
  return kosovo.slice(kosovo.length - numDays).map((item) => {
    if (item.date.length < 9) {
      return (
        "0" +
        item.date.slice(item.date.length - 1) +
        "/" +
        "0" +
        item.date.slice(item.date.length - 3, item.date.length - 2)
      );
    } else if (item.date.length < 10) {
      return (
        item.date.slice(item.date.length - 2) +
        "/" +
        "0" +
        item.date.slice(item.date.length - 4, item.date.length - 3)
      );
    }
  });
}


// Last Week Chart
function renderLastWeek() {
  getLastWeekConfirmed();
  renderChart(getLabels(7), lastWeekCases, "#lastWeekChart", "Rastet e konfirmuara", 'bar', true);
}

function getLastWeekConfirmed() {
  const last7 = kosovo.slice(kosovo.length - 8);
  for (let i = 1; i < last7.length; i++) {
    lastWeekCases.push(last7[i].confirmed - last7[i - 1].confirmed);
  }
}

function getLastWeekDeaths() {
  const last7 = kosovo.slice(kosovo.length - 8);
  for (let i = 1; i < last7.length; i++) {
    lastWeekDeaths.push(last7[i].deaths - last7[i - 1].deaths);
  }
}

function renderLastWeekDeaths() {
  getLastWeekDeaths()
  renderChart(getLabels(7), lastWeekDeaths, "#lastWeekDeathsChart", "Vdekjet", 'bar', true);
}



function renderLastMonth() {
  getLastMonthConfirmed();
  renderChart(
    getLabels(30),
    lastMonthCases,
    "#lastMonthChart",
    "Rastet e konfirmuara",
    'line',
    false
  );
}

function renderLastMonthDeaths() {
  getLastMonthDeaths();
  renderChart(
    getLabels(30),
    lastMonthDeaths,
    "#lastMonthDeathsChart",
    "Vdekjet",
    'line',
    false
  );
}

function getLastMonthConfirmed() {
  const last30 = kosovo.slice(kosovo.length - 31);
  for (let i = 1; i < last30.length; i++) {
    lastMonthCases.push(last30[i].confirmed - last30[i - 1].confirmed);
  }
}

function getLastMonthDeaths() {
  const last30 = kosovo.slice(kosovo.length - 31);
  for (let i = 1; i < last30.length; i++) {
    lastMonthDeaths.push(last30[i].deaths - last30[i - 1].deaths);
  }
}

function setLastDay(data) {
  lastDay = {
    date: data[data.length - 1].date,
    confirmed: data[data.length - 1].confirmed - data[data.length - 2].confirmed,
    deaths: data[data.length - 1].deaths - data[data.length - 2].deaths,
  }
}

function renderTable(data) {
  const tableSection = document.querySelector('#table-section');
  tableSection.innerHTML = `
    <div class="card">
      <div class="color" style="background-color: lightgray;"></div>
      <h3>Data e përditësimit</h3>
      <p>${data.date}</p>
    </div>
    <div class="card">
      <div class="color" style="background-color: skyblue;"></div>
      <h3>Rastet e reja</h3>
      <p>${data.confirmed}</p>
    </div>
    <div class="card">
      <div class="color" style="background-color: lightcoral;"></div>
      <h3>Vdekjet</h3>
      <p>${data.deaths}</p>
    </div>
  `;
}

function renderDate(date) {
  
}
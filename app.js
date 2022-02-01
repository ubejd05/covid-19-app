let kosovo;

let lastWeek = [];
let lastWeekCases = [];

let lastMonth = [];
let lastMonthCases = [];


fetch("https://pomber.github.io/covid19/timeseries.json")
  .then((response) => response.json())
  .then((data) => {
    kosovo = data["Kosovo"];
    console.log(kosovo);
    renderLastWeek();
    renderLastMonth();
  });


function renderChart(labels, cases, chartEl, label) {
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
        fill: true,
        backgroundColor: gradient,
        borderColor: "rgba(189, 195, 199, 0.4)",
        pointBackgroundColor: "rgba(189, 195, 199, 0.4)",
        // tension: 0.5,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      radius: 5,
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
      hoverRadius: 12,
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
    },
  };

  const myChart = new Chart(ctx, config);
}

// '2022-1-1'
// '2022-1-24'

// Last Week Chart
function renderLastWeek() {
  lastWeek = kosovo.slice(kosovo.length - 7).map((item) => {
    return (
      item.date.slice(item.date.length - 2) +
      "/" +
      item.date.slice(item.date.length - 4, item.date.length - 3)
    );
  });
  console.log(lastWeek);
  getLastWeekConfirmed();
  renderChart(lastWeek, lastWeekCases, "#lastWeekChart", "7 Ditët e fundit");
}

function getLastWeekConfirmed() {
  const last7 = kosovo.slice(kosovo.length - 8);
  for (let i = 1; i < last7.length; i++) {
    lastWeekCases.push(last7[i].confirmed - last7[i - 1].confirmed);
  }
}

// Last Month Chart
function lastMonthDates() {
  lastMonth = kosovo.slice(kosovo.length - 30).map((item) => {
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

  return lastMonth;
}

function renderLastMonth() {
  lastMonthDates();
  getLastMonthConfirmed();
  renderChart(
    lastMonthDates(),
    lastMonthCases,
    "#lastMonthChart",
    "30 Ditët e fundit"
  );
}

function getLastMonthConfirmed() {
  const last30 = kosovo.slice(kosovo.length - 31);
  for (let i = 1; i < last30.length; i++) {
    lastMonthCases.push(last30[i].confirmed - last30[i - 1].confirmed);
  }
}

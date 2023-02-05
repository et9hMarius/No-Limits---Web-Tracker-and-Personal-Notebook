/*global chrome*/
import "./Tracker.scss";
import DonutChart from "react-donut-chart";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const colors = [
  "#7FC7FF",
  "#5FB0FF",
  "#3F9BFF",
  "#1F86FF",
  "#0071FF",
  "#0057CC",
  "#003D99",
  "#002466",
  "#000B33",
  "#000000",
];

export default function Tracker() {
  const [totalTime, setTotalTime] = useState(0);

  //get current date in YYYY-MM-DD format
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  //get current date in DD-mmmm-YY format, month in letters
  let today2 = new Date();
  let dd2 = String(today2.getDate()).padStart(2, "0");

  let yyyy2 = String(today2.getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let mm2 = monthNames[today2.getMonth()];
  today2 = dd2 + " " + mm2 + " " + yyyy2;

  const [dayTitle, setDayTitle] = useState(today2);
  const [currentDay, setCurrentDay] = useState(today);
  const [data, setData] = useState([]);

  const updateContent = () => {
    try {
      // Fetch the current website trackers from the storage
      chrome.storage.local.get("websiteTrackers", (data) => {
        let websiteTrackers = data.websiteTrackers;
        if (!websiteTrackers) {
          setData([]);
          return;
        }
        websiteTrackers = websiteTrackers[currentDay];
        if (!websiteTrackers) {
          setData([]);
          return;
        }
        let content = "";
        var temp_data = [];
        for (let tracker in websiteTrackers) {
          temp_data.push({
            label: tracker,
            value: websiteTrackers[tracker].duration,
          });
        }
        //sort by value descending
        temp_data.sort((a, b) => b.value - a.value);
        setData(temp_data);
        let total = 1;
        temp_data.forEach((item) => {
          total += item.value;
        });
        setTotalTime(total);
      });
    } catch (err) {
      console.log(err);
      var sample_data_json =
        '{"2023-02-05":{"chat.openai.com":{"duration":6},"localhost:3000":{"duration":132},"www.google.com":{"duration":18},"www.npmjs.com":{"duration":19},"www.react-google-charts.com":{"duration":16},"www.youtube.com":{"duration":1}}}';
      // convert json string to object
      var sample_data = JSON.parse(sample_data_json);
      var websiteTrackers = sample_data["2023-02-05"];
      var temp_data = [];
      for (let tracker in websiteTrackers) {
        temp_data.push({
          label: tracker,
          value: websiteTrackers[tracker].duration,
        });
      }
      /**
       * temp_data.sort((a, b) => b.value - a.value);
      setData(temp_data);

      let total = 1;
      temp_data.forEach((item) => {
        total += item.value;
      });
      setTotalTime(total);
       */
      setData([]);
    }
  };

  useEffect(() => {
    updateContent();
  }, []);

  useEffect(() => {
    updateContent();
  }, [currentDay]);

  return (
    <div className="Tracker">
      <div className="container">
        <div className="header">
          <div
            className="header__left unselectable"
            style={{ transform: "rotate(180deg)" }}
            onClick={() => {
              let newDate = new Date(currentDay);
              newDate.setDate(newDate.getDate() - 1);
              let dd = String(newDate.getDate()).padStart(2, "0");
              let mm = String(newDate.getMonth() + 1).padStart(2, "0"); //January is 0!
              let yyyy = newDate.getFullYear();
              let newDay = yyyy + "-" + mm + "-" + dd;
              setCurrentDay(newDay);
              let dd2 = String(newDate.getDate()).padStart(2, "0");
              let yyyy2 = String(newDate.getFullYear());
              let mm2 = monthNames[newDate.getMonth()];
              let newDay2 = dd2 + " " + mm2 + " " + yyyy2;
              setDayTitle(newDay2);
            }}
          >
            {"⮞"}
          </div>
          <div className="title">
            <h1>
              <DatePicker
                selected={new Date(currentDay)}
                onChange={(date) => {
                  let dd = String(date.getDate()).padStart(2, "0");
                  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
                  let yyyy = date.getFullYear();
                  let newDay = yyyy + "-" + mm + "-" + dd;
                  setCurrentDay(newDay);
                  let dd2 = String(date.getDate()).padStart(2, "0");
                  let yyyy2 = String(date.getFullYear());
                  let mm2 = monthNames[date.getMonth()];
                  let newDay2 = dd2 + " " + mm2 + " " + yyyy2;
                  setDayTitle(newDay2);
                }}
                value={dayTitle}
              />
            </h1>
          </div>
          <div
            className="header__right unselectable"
            onClick={() => {
              let newDate = new Date(currentDay);
              newDate.setDate(newDate.getDate() + 1);
              let dd = String(newDate.getDate()).padStart(2, "0");
              let mm = String(newDate.getMonth() + 1).padStart(2, "0"); //January is 0!
              let yyyy = newDate.getFullYear();
              let newDay = yyyy + "-" + mm + "-" + dd;
              setCurrentDay(newDay);
              let dd2 = String(newDate.getDate()).padStart(2, "0");
              let yyyy2 = String(newDate.getFullYear());
              let mm2 = monthNames[newDate.getMonth()];
              let newDay2 = dd2 + " " + mm2 + " " + yyyy2;
              setDayTitle(newDay2);
            }}
          >
            {"⮞"}
          </div>
        </div>

        {data.length > 0 ? (
          <>
            <div className="piechart">
              <div className="piechart__container">
                <DonutChart
                  data={data.slice(0, 9)}
                  colors={colors}
                  legend={false}
                  height={300}
                  width={300}
                  innerRadius={0.5}
                  clickToggle={false}
                />
                <div className="legend">
                  {data.slice(0, 9).map((item, index) => (
                    <div
                      key={index}
                      style={{
                        color: colors[index],
                      }}
                    >
                      <div className="legend__text">• {item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="table">
              <table>
                <thead>
                  <tr style={{ backgroundColor: "rgb(234 241 255)" }}>
                    <th>#</th>
                    <th>Website</th>
                    <th>Time Spent</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      // if index is odd, make the row grey, and text color black
                      style={{
                        backgroundColor:
                          index % 2 ? "rgb(234 241 255)" : "white",
                        color: colors[index],
                      }}
                    >
                      <td>
                        <div>{index + 1}.</div>
                      </td>
                      <td>{item.label}</td>
                      <td>
                        {item.value < 60
                          ? item.value + "s"
                          : item.value < 3600
                          ? (item.value / 60).toFixed(0) + "m"
                          : (item.value / 3600).toFixed(0) + "h"}
                      </td>
                      <td>
                        {String((item.value / totalTime) * 100).slice(0, 4)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="no_content">
            <h1>No data for this day</h1>
          </div>
        )}
      </div>
    </div>
  );
}

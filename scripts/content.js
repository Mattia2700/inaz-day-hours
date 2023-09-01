// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const WeekString = {
  '1': 'L',
  '2': 'M',
  '3': 'M',
  '4': 'G',
  '5': 'V',
}
const MS_TO_SEC = 1000;
const TIMEOUT = 5 * MS_TO_SEC;
const TEST = false;

function timeDifference(e, u) {
  const e_time = e.split(':');
  const u_time = u.split(':');
  const e_hours = parseInt(e_time[0]);
  const e_minutes = parseInt(e_time[1]);
  const u_hours = parseInt(u_time[0]);
  const u_minutes = parseInt(u_time[1]);

  let minutesDifference = u_minutes - e_minutes;
  let hoursDifference = u_hours - e_hours;

  if (minutesDifference < 0) {
    minutesDifference += 60;
    hoursDifference -= 1;
  }

  return `${String(hoursDifference).padStart(2,'0')}:${String(minutesDifference).padStart(2,'0')}`;
}

function timeSum(times){
  if (times.length == 0){
    return '00:00';
  } else if (times.length == 1){
    return times[0];
  } else {
    const first_time = times[0].split(':');
    let totalHours = parseInt(first_time[0])
    let totalMinutes = parseInt(first_time[1])
    for (let i = 1; i < times.length; i++){
      const time = times[i].split(':');
      totalHours += parseInt(time[0]);
      totalMinutes += parseInt(time[1]);
      if (totalMinutes > 60){
        totalHours += 1;
        totalMinutes -= 60;
      }
    }
    return `${String(totalHours).padStart(2,'0')}:${String(totalMinutes).padStart(2,'0')}`;
  }
}


let day = new Date().getDate();
if (day < 10) {
  day = '0' + day;
}
const weekDay = new Date().getDay();
let month = new Date().getMonth() + 1;
// pad month with 0
if (month < 10) {
  month = '0' + month;
}
const year = new Date().getFullYear();
const date = `${day}/${month}/${year}`;
const row_title = WeekString[weekDay] + ' ' + date;
const text = '[title="' + row_title + '"]';
const test_text = '[id="1167576"]'


function getRow(){
  const iframe = document.querySelector('#WizFrame1');
  if (!iframe) {
    return;
  }
  const form = iframe.contentWindow.document.body.querySelector('form')
  if (!form) {
    return;
  }
  const table = form.querySelector('#ContDiv > table > tbody > #centerTlb > td > div > div > div > #gview_TblCart > .ui-jqgrid-bdiv > div > table> tbody')
  if (!table) {
    return;
  }
  let row = null;
  if (TEST) {
    row = table.querySelector(test_text)
  } else {
    row = table.querySelector(text).parentElement;
  }
  if (!row) {
    return;
  }
  return row;
}

function getDiff(row){
  let diff = [];
  const e1 = row.querySelector('td:nth-child(4) > div');
  const u1 = row.querySelector('td:nth-child(5) > div');
  const e2 = row.querySelector('td:nth-child(6) > div');
  const u2 = row.querySelector('td:nth-child(7) > div');
  const e3 = row.querySelector('td:nth-child(8) > div');
  const u3 = row.querySelector('td:nth-child(9) > div');
  if (e1 != null && u1 != null){
    diff.push(timeDifference(e1.textContent, u1.textContent));
  }
  if (e2 != null && u2 != null){
    diff.push(timeDifference(e2.textContent, u2.textContent));
  }
  if (e3 != null && u3 != null){
    diff.push(timeDifference(e3.textContent, u3.textContent));
  }
  return diff;
}

function showTime(row, totalTime){
  if (totalTime != '00:00'){
    const cell = row.querySelector('td:nth-child(18)');
    const div = document.createElement('div');
    div.innerHTML = '<i><b>Totale: </b>' + totalTime +'</i>';
    cell.appendChild(div);
  }
}

function checkRow() {
  const row = getRow();
  if (!row) {
    setTimeout(checkRow, TIMEOUT);
    return;
  }
  const diff = getDiff(row);
  const sum = timeSum(diff);
  showTime(row, sum);
}


setTimeout(checkRow, TIMEOUT);

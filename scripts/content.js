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
const TIMEOUT = 10 * MS_TO_SEC;

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
  let rows = table.querySelectorAll('tr:nth-child(n + 2)');
  if (!rows) {
    return;
  }
  return rows;
}

function getDayHours(rows){
  let diffTotal = [];
  for(let i = 0; i < rows.length; i++){
    let diff = [];
    // select all from 4 to 9
    const x = rows[i].querySelectorAll('td:nth-child(n + 4):nth-child(-n + 9) > div');
    for (let i = 0; i < x.length-1; i+=2){
      if (x[i] != null && x[i+1] != null){
        diff.push(timeDifference(x[i].textContent, x[i+1].textContent));
      }
    }
    diffTotal.push(timeSum(diff));
  }
  return diffTotal;
}

function showTime(rows, totalTime){
  for (let i = 0; i < rows.length; i++){
    if (totalTime[i] != '00:00'){
      const cell = rows[i].querySelector('td:nth-child(18)');
      const divExists = cell.querySelector('div');
      if (!divExists) {
        const div = document.createElement('div');
        div.innerHTML = '<i><b>Totale:</b> ' + totalTime[i] +'</i>';
        cell.appendChild(div);
      }
    }
  }
}

function checkRow() {
  const rows = getRow();
  setTimeout(checkRow, TIMEOUT);
  const days = getDayHours(rows);
  showTime(rows, days);
}

checkRow();

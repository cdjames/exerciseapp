/*
	** Author: Collin James, CS 290
	** Date: 5/28/16
	** Description: Activity: Final Project - Database Interactions and UI, interaction code
*/

/* configure forms */
document.addEventListener('DOMContentLoaded', function () {
	configForms({years: "DOByears", months: "DOBmonths", days: "DOBdays", reps: "reps", weight: "weight"});
	configForms({years: "up_DOByears", months: "up_DOBmonths", days: "up_DOBdays", reps: "up_reps", weight: "up_weight"});
});

document.addEventListener('DOMContentLoaded', bindClicks);

/* Global variables */
var YEARS = 5,
	CUR_DATE = new Date();
	CUR_YEAR = CUR_DATE.getFullYear(),
	OLDEST_USER = 0,
	MONTHS = {January: {val: '01', days: 31}, February: {val: '02', days: 29}, 
		March: {val: '03', days: 31}, April: {val: '04', days: 30}, May: {val: '05', days: 31}, 
		June: {val: '06', days: 30}, July: {val: '07', days: 31}, August: {val: '08', days: 31}, 
		September: {val: '09', days: 30}, October: {val: '10', days: 31}, 
		November: {val: '11', days: 30}, December: {val: '12', days: 31}},
	REPS = 100,
	WEIGHT = 300;

/* configure forms. pass in object with date ids: 
   {years: 'yearid', months: 'monthid', days: 'daysid} */
function configForms (ids) {

	/* add year options */
	var years = document.getElementById(ids.years),
		yroption;
	for (var i = 0; i < YEARS; i++) {
		yroption = document.createElement('option');
		yroption.textContent = CUR_YEAR - OLDEST_USER - i;
		years.appendChild(yroption);
	}

	/* add month options */
	var months = document.getElementById(ids.months),
		themonths = Object.keys(MONTHS),
		mooption;
	for (var i = 0; i < themonths.length; i++) {
		var thismonth = themonths[i];
		mooption = document.createElement('option');
		mooption.textContent = themonths[i];
		mooption.setAttribute('data-name', themonths[i]);
		mooption.value = MONTHS[thismonth].val;
		months.appendChild(mooption);
	}

	/* select current month */
	addMonthListener(months, ids.days);
	var cur_mnth = getTwoDigitNum(CUR_DATE.getMonth() + 1);
	months.value = cur_mnth;
	// change days for current month
	simulateListener("change", ids.months);

	/* set current day */
	var days = document.getElementById(ids.days),
		cur_day = getTwoDigitNum(CUR_DATE.getDate());
	days.value = cur_day;

	/* add rep options */
	var reps = document.getElementById(ids.reps),
		repoption;
	for (var i = 0; i < REPS+1; i++) {
		repoption = document.createElement('option');
		repoption.textContent = i;
		reps.appendChild(repoption);
	}

	/* add rep options */
	var weight = document.getElementById(ids.weight),
		wtoption;
	for (var i = 0; i < WEIGHT+1; i++) {
		wtoption = document.createElement('option');
		wtoption.textContent = i;
		weight.appendChild(wtoption);
	}
}

/** helpers for configForms **/

function addMonthListener(element, id) {
  element.addEventListener('change', function (event) {
	var selDay = document.getElementById(id).value,
		ndays = MONTHS[event.target.selectedOptions[0].getAttribute('data-name')].days;
	
	addDays(ndays, id);
	/* update day selection to previous selection */
	document.getElementById(id).value = (selDay <= ndays) ? selDay : ndays;	
	});
}

/* simulate events (clicks, changes, etc.) */
function simulateListener(type, id) {
  var event = new MouseEvent(type, {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  var cb = document.getElementById(id); 
  // console.log(cb);
  var canceled = !cb.dispatchEvent(event);
  if (canceled) {
    // A handler called preventDefault.
    console.log(type + " simulateion canceled");
  } else {
    // None of the handlers called preventDefault.
    console.log(type + " simulated on " + id);
  }
}

function addDays (ndays, id) {	
	var days = document.getElementById(id),
		numdays = ndays,
		daoption;
		// console.log(numdays);
	days.textContent=''; // clear the options
	for (var i = 1; i <= numdays; i++) {
		daoption = document.createElement('option');
		daoption.textContent = i;
		daoption.value = (i < 10) ? '0'+i : i;
		days.appendChild(daoption);
	}
}

/** end form helpers **/

/* function to use for update button listener */
function updateListener (element) {
	element.addEventListener('click', function (event) {
		var tr_id = event.target.getAttribute('data-id');
		// console.log(tr_id);

		var ajax = new XMLHttpRequest();
		var data = {id: tr_id};
		ajax.open("POST", "/select_row", true); // true for async

		ajax.setRequestHeader('Content-Type', 'application/json');
		
		ajax.addEventListener('load', function () {
			if(ajax.status >= 200 && ajax.status < 400){
				var response = JSON.parse(ajax.responseText)[0];
				// console.log(response);
				/* put values in update fields */
				var up_id = document.getElementById('up_id');
				up_id.setAttribute('data-id', response.id);
				var up_name = document.getElementById('up_name');
				up_name.value = response.name;
				// save original name in data-name
				up_name.setAttribute('data-name', response.name);
				var up_reps = document.getElementById('up_reps');
				up_reps.value = response.reps;
				var up_weight = document.getElementById('up_weight');
				up_weight.value = response.weight;
				var up_lbs = document.getElementById('up_lbs');
				up_lbs.value = response.lbs;
				var up_DOByears = document.getElementById('up_DOByears');
				up_DOByears.value = response.year;
				var up_DOBmonths = document.getElementById('up_DOBmonths');
				up_DOBmonths.value = response.month;
				var up_DOBdays = document.getElementById('up_DOBdays');
				up_DOBdays.value = response.day;
				showHide(document.getElementById('upd_outer'));
			} else {
				console.log("Whoops, something went wrong. Maybe: ", ajax.statusText);
			}
		});
			
		ajax.send(JSON.stringify(data));
		event.preventDefault();
	});
}

/* function to use for delete button listener */
function deleteListener (element) {
	element.addEventListener('click', function (event) {
		var tbody = document.getElementById('ex_table_body'),
			tr_id = event.target.getAttribute('data-id'),
			tr = document.getElementById(tr_id);
		// console.log("tr-id="+tr_id);

		var ajax = new XMLHttpRequest();
		var data = {id: tr_id};
		ajax.open("POST", "/delete", true); // true for async

		ajax.setRequestHeader('Content-Type', 'application/json');
		
		ajax.addEventListener('load', function () {
			if(ajax.status >= 200 && ajax.status < 400){
				tbody.removeChild(tr);
				// console.log(ajax.responseText);
			} else {
				console.log("Whoops, something went wrong. Maybe: ", ajax.statusText);
			}
		});
		ajax.send(JSON.stringify(data));
		event.preventDefault();
	});
}

/* handle clicks on all buttons and forms */
function bindClicks () {
	var update = document.getElementsByClassName('update'),
		remove = document.getElementsByClassName('delete'),
		add = document.getElementById('addexercise'),
		cancel_update = document.getElementById('cancel_update'),
		do_update = document.getElementById('updateexercise');

	for (var i = 0; i < update.length; i++) {
		updateListener(update[i]);
	}

	for (var i = 0; i < remove.length; i++) {
		deleteListener(remove[i]);
	};

	/* bind post action to do_update button */
	do_update.addEventListener('submit', function (event) {
		event.preventDefault();
		var ajax = new XMLHttpRequest();
		/* manually create form (couldn't get FormData object to work) */
		var formData = {};
		formData.id = parseInt(document.getElementById('up_id').getAttribute('data-id'));
		/* if name is blank, get the saved name in data-name */
		formData.name = document.getElementById('up_name').value || document.getElementById('up_name').getAttribute('data-name');
		formData.reps = parseInt(document.getElementById('up_reps').value);
		formData.weight = parseInt(document.getElementById('up_weight').value);
		formData.year = document.getElementById('up_DOByears').value;
		formData.month = document.getElementById('up_DOBmonths').value;
		formData.day = document.getElementById('up_DOBdays').value;
		formData.lbs = parseInt(document.getElementById('up_lbs').value);
		// console.log(formData);

		ajax.open("POST", "/update", true); // true for async

		ajax.setRequestHeader('Content-Type', 'application/json');
		
		ajax.addEventListener('load', function () {
			if(ajax.status >= 200 && ajax.status < 400){
				var response = JSON.parse(ajax.responseText)[0];
				// var response = ajax.responseText;
				// console.log(response);
				if(response){
					// put data back in row
					/* create new row to put in table */
					var new_tr = document.createElement('tr');
					new_tr.id = response.id;
					new_tr = createNAppend(new_tr, "td", response.name, ["ex_data"]);
					new_tr = createNAppend(new_tr, "td", response.reps, ["ex_data"]);
					var wgt_content;
					if(response.weight){
						wgt_content = response.weight;
						if(response.lbs)
							wgt_content += " lbs";
						else
							wgt_content +=" kg";
					} else {
						wgt_content = 'N/A';
					}
					new_tr = createNAppend(new_tr, "td", wgt_content, ["ex_data"]);
					new_tr = createNAppend(new_tr, "td", response.date, ["ex_data"]);
					/* create and append buttons */
					var upd_btn = document.createElement('button'),
						new_btn_class = 'new_btn' + response.id;
					upd_btn.setAttribute('class', 'update '+ new_btn_class);
					upd_btn.setAttribute('data-id', response.id);
					upd_btn.textContent = 'edit';
					new_tr = createNAppend(new_tr, "td", upd_btn.outerHTML, ["ex_btn"]);
					/* delete button */
					var del_btn = document.createElement('button'),
						new_del_class = new_btn_class + '_del';
					del_btn.setAttribute('class', 'delete ' + new_del_class);
					del_btn.setAttribute('data-id', response.id);
					del_btn.textContent = 'delete';
					new_tr = createNAppend(new_tr, "td", del_btn.outerHTML, ["ex_btn"]);
					/* append to the tbody */
					document.getElementById(response.id).innerHTML = new_tr.innerHTML;
					/* add event listener for buttons */
					updateListener(document.getElementsByClassName(new_btn_class)[0]);
					deleteListener(document.getElementsByClassName(new_del_class)[0]);
					
					showHide(document.getElementById('upd_outer'));
				}
			} else {
				console.log("Whoops, something went wrong. Maybe: ", ajax.statusText);
			}
		});

		ajax.send(JSON.stringify(formData));
	});
	
	/* bind post action to cancel button*/
	cancel_update.addEventListener('click', function (event) {
		event.preventDefault();
		showHide(document.getElementById('upd_outer'));
	});
	
	/* bind post action to add exercise button */
	add.addEventListener('submit', function (event) {
		event.preventDefault();
		var ajax = new XMLHttpRequest();
		/* manually create form (couldn't get FormData object to work) */
		var formData = {};
		formData.name = document.getElementById('name').value;
		if (!formData.name) {
			alert('whoops, need a name!');
			return;
		}
		formData.reps = parseInt(document.getElementById('reps').value);
		formData.weight = parseInt(document.getElementById('weight').value);
		formData.year = document.getElementById('DOByears').value;
		formData.month = document.getElementById('DOBmonths').value;
		formData.day = document.getElementById('DOBdays').value;
		formData.lbs = parseInt(document.getElementById('lbs').value);
		// console.log(formData);

		ajax.open("POST", "/", true); // true for async

		ajax.setRequestHeader('Content-Type', 'application/json');
		
		ajax.addEventListener('load', function () {
			if(ajax.status >= 200 && ajax.status < 400){ // check for valid request
				var response = JSON.parse(ajax.responseText)[0];
				// console.log(response);
				/* create new row to put in table */
				var new_tr = document.createElement('tr');
				new_tr.id = response.id;
				new_tr = createNAppend(new_tr, "td", response.name, ["ex_data"]);
				new_tr = createNAppend(new_tr, "td", response.reps, ["ex_data"]);
				var wgt_content;
				if(response.weight){
					wgt_content = response.weight;
					if(response.lbs)
						wgt_content += " lbs";
					else
						wgt_content +=" kg";
				} else {
					wgt_content = 'N/A';
				}
				new_tr = createNAppend(new_tr, "td", wgt_content, ["ex_data"]);
				new_tr = createNAppend(new_tr, "td", response.date, ["ex_data"]);
				/* create and append buttons */
				var upd_btn = document.createElement('button'),
					new_btn_class = 'new_btn' + response.id;
				upd_btn.setAttribute('class', 'update '+ new_btn_class);
				upd_btn.setAttribute('data-id', response.id);
				upd_btn.textContent = 'edit';
				new_tr = createNAppend(new_tr, "td", upd_btn.outerHTML, ["ex_btn"]);
				/* delete button */
				var del_btn = document.createElement('button'),
					new_del_class = new_btn_class + '_del';
				del_btn.setAttribute('class', 'delete ' + new_del_class);
				del_btn.setAttribute('data-id', response.id);
				del_btn.textContent = 'delete';
				new_tr = createNAppend(new_tr, "td", del_btn.outerHTML, ["ex_btn"]);
				/* append to the tbody */
				document.getElementById('ex_table_body').appendChild(new_tr);
				/* add event listener for update button */
				updateListener(document.getElementsByClassName(new_btn_class)[0]);
				deleteListener(document.getElementsByClassName(new_del_class)[0]);
			} else {
				console.log("Whoops, something went wrong. Maybe: ", ajax.statusText);
			}

			
		});

		ajax.send(JSON.stringify(formData));
		
	});
}

/** a few more helpers **/

/* create a new element and append to passed element 
	classes is an array */
function createNAppend (appendObj, type, content, classes)
{
	var new_el = document.createElement(type);
	for (var i = 0; i < classes.length; i++) {
		new_el.setAttribute('class', classes[i]);
	}
	new_el.innerHTML=content;
	appendObj.appendChild(new_el);
	return appendObj;
}

function showHide(element, dispType){
	if(element.style.display === "" || element.style.display === "none")
		element.style.display = dispType || 'block';
	else
		element.style.display = 'none';
}

function getTwoDigitNum (number) {
	(number < 10) ? number = "0" + number : number.toString();
	return number; // this is a string
}
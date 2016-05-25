/*
	** Author: Collin James, CS 290
	** Date: 5/18/16
	** Description: Activity: How-to Guide, interaction code
*/
document.addEventListener('DOMContentLoaded', configForm);
document.addEventListener('DOMContentLoaded', configUpdateForm);
document.addEventListener('DOMContentLoaded', bindClicks);
// document.addEventListener('DateOMContentLoaded', makeNav);

var USERID = 52119028,
	CLIENTID = '1306a99549a44496515f2e61993af805';

var YEARS = 5,
	CUR_YEAR = new Date().getFullYear(),
	OLDEST_USER = 0,
	MONTHS = {January: {val: '01', days: 31}, February: {val: '02', days: 29}, 
		March: {val: '03', days: 31}, April: {val: '04', days: 30}, May: {val: '05', days: 31}, 
		June: {val: '06', days: 30}, July: {val: '07', days: 31}, August: {val: '08', days: 31}, 
		September: {val: '09', days: 30}, October: {val: '10', days: 31}, 
		November: {val: '11', days: 30}, December: {val: '12', days: 31}},
	REPS = 100,
	WEIGHT = 300;

function configForm () {
	/* add year options */
	var years = document.getElementById('DOByears'),
		yroption;
	for (var i = 0; i < YEARS; i++) {
		yroption = document.createElement('option');
		yroption.textContent = CUR_YEAR - OLDEST_USER - i;
		years.appendChild(yroption);
	}
	/* add month options */
	var months = document.getElementById('DOBmonths'),
		themonths = Object.keys(MONTHS),
		mooption;
	for (var i = 0; i < themonths.length; i++) {
		var thismonth = themonths[i];
		// console.log(thismonth);
		mooption = document.createElement('option');
		mooption.textContent = themonths[i];
		mooption.setAttribute('data-name', themonths[i]);
		// console.log(MONTHS[thismonth].val);
		mooption.value = MONTHS[thismonth].val;
		months.appendChild(mooption);
	}

	addDays(31, 'DOBdays'); // for January
	/* change days when months changed */
	months.addEventListener('change', function (event) {
		// console.log(event.target.selectedOptions[0].getAttribute('data-name'));
		var selDay = document.getElementById('DOBdays').value,
			ndays = MONTHS[event.target.selectedOptions[0].getAttribute('data-name')].days;
		
		addDays(ndays, 'DOBdays');
		/* update day selection to previous selection */
		document.getElementById('DOBdays').value = (selDay <= ndays) ? selDay : ndays;	
	});

	/* add rep options */
	var reps = document.getElementById('reps'),
		repoption;
	for (var i = 0; i < REPS+1; i++) {
		repoption = document.createElement('option');
		repoption.textContent = i;
		reps.appendChild(repoption);
	}

	/* add rep options */
	var weight = document.getElementById('weight'),
		wtoption;
	for (var i = 0; i < WEIGHT+1; i++) {
		wtoption = document.createElement('option');
		wtoption.textContent = i;
		weight.appendChild(wtoption);
	}
}

function configUpdateForm () {
	/* add year options */
	var years = document.getElementById('up_DOByears'),
		yroption;
	for (var i = 0; i < YEARS; i++) {
		yroption = document.createElement('option');
		yroption.textContent = CUR_YEAR - OLDEST_USER - i;
		years.appendChild(yroption);
	}
	/* add month options */
	var months = document.getElementById('up_DOBmonths'),
		themonths = Object.keys(MONTHS),
		mooption;
	for (var i = 0; i < themonths.length; i++) {
		var thismonth = themonths[i];
		// console.log(thismonth);
		mooption = document.createElement('option');
		mooption.textContent = themonths[i];
		mooption.setAttribute('data-name', themonths[i]);
		// console.log(MONTHS[thismonth].val);
		mooption.value = MONTHS[thismonth].val;
		months.appendChild(mooption);
	}

	addDays(31, 'up_DOBdays'); // for January
	/* change days when months changed */
	months.addEventListener('change', function (event) {
		// console.log(event.target.selectedOptions[0].getAttribute('data-name'));
		var selDay = document.getElementById('up_DOBdays').value,
			ndays = MONTHS[event.target.selectedOptions[0].getAttribute('data-name')].days;
		
		addDays(ndays, 'up_DOBdays');
		/* update day selection to previous selection */
		document.getElementById('up_DOBdays').value = (selDay <= ndays) ? selDay : ndays;	
	});

	/* add rep options */
	var reps = document.getElementById('up_reps'),
		repoption;
	for (var i = 0; i < REPS+1; i++) {
		repoption = document.createElement('option');
		repoption.textContent = i;
		reps.appendChild(repoption);
	}

	/* add rep options */
	var weight = document.getElementById('up_weight'),
		wtoption;
	for (var i = 0; i < WEIGHT+1; i++) {
		wtoption = document.createElement('option');
		wtoption.textContent = i;
		weight.appendChild(wtoption);
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
		daoption.value = '0'+i;
		days.appendChild(daoption);
	}
}

function bindMenuClicks () {
	
	var html = document.getElementsByTagName('html')[0];
		contents = document.getElementById('contents'),
		dropdown = document.getElementById('dropdown'),
		drpdwnLi = dropdown.children;
	// console.log(html);
	html.addEventListener('click', function (event) {
		dropdown.style.visibility = 'hidden';
		// event.preventDefault();
	});
	
	contents.addEventListener('click', function (event) {
		hideEl(dropdown);
		event.stopPropagation();
	});

	for (var i = 0; i < drpdwnLi.length; i++) {
		drpdwnLi[i].firstElementChild.addEventListener('click', function (event) {
			hideEl(dropdown);
			// event.preventDefault();
		});
	};
	
}

function bindClicks () {
	var update = document.getElementsByClassName('update'),
		remove = document.getElementsByClassName('delete'),
		add = document.getElementById('addexercise');

	for (var i = 0; i < update.length; i++) {
		update[i].addEventListener('click', function (event) {
			console.log('clicked update');
			var tr_id = event.target.getAttribute('data-id'),
				this_tr = document.getElementById(tr_id),
				tr_chldrn = this_tr.children;
			for (var i = 0; i < tr_chldrn.length; i++) {
				if(tr_chldrn[i].className === "ex_data")
					console.log(tr_chldrn[i]);
			};
			event.preventDefault();
			/* upon pushing update, a copy of the add form for should be displayed over the page
			but with its data pre-populated and an extra "cancel" button. */
		});
	};
	// update.addEventListener('click', function (event) {
	// 	console.log('clicked update');
	// 	event.preventDefault();
	// });

	// remove.addEventListener('click', function (event) {
	// 	console.log('clicked delete');
	// 	event.preventDefault();
	// });
	add.addEventListener('submit', function (event) {
		var ajax = new XMLHttpRequest();
		/* manually create form (couldn't get FormData object to work) */
		var formData = {};
		formData.name = document.getElementById('name').value;
		formData.reps = parseInt(document.getElementById('reps').value);
		formData.weight = parseInt(document.getElementById('weight').value);
		formData.year = document.getElementById('DOByears').value;
		formData.month = document.getElementById('DOBmonths').value;
		formData.day = document.getElementById('DOBdays').value;
		formData.lbs = parseInt(document.getElementById('lbs').value);
		console.log(formData);

		ajax.open("POST", "/", true); // true for async

		ajax.setRequestHeader('Content-Type', 'application/json');
		
		ajax.addEventListener('load', function () {
			if(ajax.status >= 200 && ajax.status < 400){ // check for valid request
				var response = JSON.parse(ajax.responseText)[0];
				console.log(response);
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
				var upd_btn = document.createElement('button');
				upd_btn.class = 'update';
				upd_btn.setAttribute('data-id', response.id);
				upd_btn.textContent = 'update';
				new_tr = createNAppend(new_tr, "td", upd_btn.outerHTML, ["ex_btn"]);
				var del_btn = document.createElement('button');
				del_btn.class = 'delete';
				del_btn.setAttribute('data-id', response.id);
				del_btn.textContent = 'delete';
				new_tr = createNAppend(new_tr, "td", del_btn.outerHTML, ["ex_btn"]);
				/* append to the tbody */
				document.getElementById('ex_table_body').appendChild(new_tr);
			} else {
				console.log("Whoops, something went wrong. Maybe: ", ajax.statusText);
			}

			function createNAppend (appendObj, type, content, classes)
			{
				var new_td = document.createElement(type);
				for (var i = 0; i < classes.length; i++) {
					new_td.setAttribute('class', classes[i]);
				}
				new_td.innerHTML=content;
				appendObj.appendChild(new_td);
				return appendObj;
			}
		});

		ajax.send(JSON.stringify(formData));
		event.preventDefault();
	});
}

function makeNav () {
	var next_page = document.getElementById('next_page'),
		prev_page = document.getElementById('prev_page'),
		curr = document.getElementById('curr_page').textContent, // get curr_page button and textContent
		curr_item = document.getElementById(curr), // find the item in the header
		prev_item = curr_item.previousElementSibling; // get its previous item and append the value to prev button
		next_item = curr_item.nextElementSibling; // get its next item and append the value to next button
	
	if(prev_item) {
		prev_page.setAttribute("href", "/?topic="+prev_item.id);
		prev_page.setAttribute("title", prev_item.textContent);
	} else {
		prev_page.style.display = "none";
	}
	
	if(next_item){
		next_page.setAttribute("href", "/?topic="+next_item.id);
		next_page.setAttribute("title", next_item.textContent);
	} else {
		next_page.style.display = "none";
	}
}

function hideEl (element) {
	element.style.visibility = (element.style.visibility != 'visible') ? 'visible' : 'hidden';
}

function buildTable (data, headers, keys) {
	var table = document.createElement("table"), // the table element
		tr; // hold rows before appending

	/* build headers*/
	tr = buildRow(headers, "th");
	table.appendChild(tr);

	/* build rows */
	data.forEach(function (object, index) {
		var values = []
			track_id = object.id;
		/* make an array of values */
		for (var i = 0; i < keys.length; i++) {
			if(keys[i] != "")
				values.push(object[keys[i]]);
			else
				values.push("");
		};
	
		/* add a row */
		tr = buildRow(values, "td", track_id);
		table.appendChild(tr);
	})

	/* */
	function buildRow (array, type, track_id) { // an array of 
		var thisTr = document.createElement("tr"),
			column;
		/* create <td> or <th> elements */
		array.forEach(function (content) {
			column = document.createElement(type);
			/* for non-header items */
			column.textContent = content;
			/* add content and style */
			// column.style.border = "solid 1px black";
			thisTr.id = track_id;
			thisTr.appendChild(column);
		});
		return thisTr;
	}

	table.style.borderCollapse = "collapse";
	// console.log(table);
	return table;
}
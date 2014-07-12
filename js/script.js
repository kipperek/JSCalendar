String.prototype.template = function(data){
	var pat = /\{.*?\}/;
	var mat, text = this;
	while(mat = pat.exec(text)){
		var name = mat[0].replace(/[}{]/g,"");
		text = text.replace(mat[0], data[name]);
	}

	return text;
};

var isToday = function(today, year, month, day){
	if(today.getMonth() === month && today.getDate() === day && today.getFullYear() === year)
		return "today";
	else
		return "";
};

var calendar = function(year, month, element,head, today,data){
	var cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];
	var cal_days_in_month = [31, today.getFullYear()%4===0 ? 29 : 28 , 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var startDate = new Date(year,month,1);
	var startDateDay = startDate.getDay() > 0 ? startDate.getDay() : 7;

	var week = "<tr class='weekWraper'>{days}</tr>";
	var day = "<td class='dayWraper {dayClass}'>{day}{meetings}</td>"

	var weeks = Math.ceil((cal_days_in_month[startDate.getMonth()]+startDateDay) / 7);

	head.html("<a href='#' id='leftMonth'><-</a> {month} {year} <a href='#' id='rightMonth'><img alt='' src='graph/right.png'/></a>".template({month: cal_months_labels[month], year: year}));
	element.html("");
	
	for(var i=0;i<weeks;i++){
		var days = "";
		for(var j=1; j<= 7; j++){
			var currentDay = i*7+j-startDateDay+1;
			var dayData = { day: "", meetings: "", dayClass: ""};

			if(currentDay >= 1 && currentDay <= cal_days_in_month[startDate.getMonth()]){
				dayData.day = "<div class='day {isToday}'>{day}</div>".template({day: currentDay, isToday: isToday(today, year, month, currentDay)});
				dayData.meetings = "<div>{meeting}</div>".template({meeting: ""});
				dayData.dayClass = "monthDay";
			}
			days += day.template(dayData);
			
		}

		element.append(week.template({"days": days}));
	}

	$('.monthDay').hover(function(){
		var wdth = $(this).width();
		$(this).stop().animate({ boxShadow: '0 0 15px rgba(0,0,0,0.3)'},200);
		$( this ).children( 'div:last-child' ).stop().animate({ backgroundColor: '#F8F8F8'},200);
	},function(){
		$(this).stop().animate({ boxShadow: '0 0 15px rgba(0,0,0,0)'},200);
		$( this ).children( 'div:last-child' ).stop().animate({ backgroundColor: '#DDD'},200);
	});

	$('#leftMonth').click(function(e){
		e.preventDefault();
		if(month>0)
			calendar(year, month-1, element, head, today,data);
		else
			calendar(year-1, 11, element, head, today,data);
	});

	$('#rightMonth').click(function(e){
		e.preventDefault();
		if(month<11)
			calendar(year, month+1, element, head, today,data);
		else
			calendar(year+1, 0, element, head, today,data);
	});

};

$(document).ready(function(){
	var today = new Date();
	calendar(today.getFullYear(), today.getMonth(), $('#calendar table tbody'),$('#tableHead'), today);
});
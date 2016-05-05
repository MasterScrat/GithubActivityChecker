ACTIVITY_WINDOW_WEEKS = 4;
TIME_RETRY_STATS_MS = 250;

loadActivity = function() {
	$.ajax({
		dataType: 'json',
		url: 'https://api.github.com/repos'+getProjectPath()+'/stats/commit_activity',
		statusCode: {
			200: function(data) {
				var activity = computeActivity(data);
				var activityLabel = getActivityLabel(activity);
				displayActivity(activityLabel, activity);
			},
			202: function() {
				// github processing the data
				setTimeout(loadActivity, TIME_RETRY_STATS_MS)
			},
			403: function() {
				console.warn('GitHub API limit reached!');
			},
			404: function() {
				console.log('Private repository, wont get activity.');
			}

		}
	});
}

displayActivity = function(label, number) {
	var hint = number + ' commits in the past ' + ACTIVITY_WINDOW_WEEKS + ' weeks';

	if(!$('.activity').size()) {
		var html = '<li class="activity"><a data-pjax="" href="' + getProjectPath() + '/graphs/commit-activity" title="' + hint + '">';
		html += '<svg aria-hidden="true" class="octicon octicon-pulse" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M11.5 8L8.8 5.4 6.6 8.5 5.5 1.6 2.38 8H0V10h3.6L4.5 8.2l0.9 5.4L9 8.5l1.6 1.5H14V8H11.5z"></path></svg>';
		html += ' <span class="num text-emphasized">' + label + '</span> activity</a></li>';

		$('.numbers-summary').append(html);

	} else {
		$('.activity .num').text(label);
		$('.activity a').attr('title', hint)
	}
}

computeActivity = function(data) {
	return _(data)
		.mapValues(function(week) {return week.total})
		.values()
		.slice(52 - ACTIVITY_WINDOW_WEEKS)
		.reduce(function(a, b) {return a + b}, 0);
}

getActivityLabel = function(total) {
	if(total === 0)		return 'no';
	if(total < 10) 		return 'low';
	if(total < 100) 	return 'medium';
	if(total < 1000) 	return 'high';
	return 'incredible';
}

getProjectPath = function() {
	return window.location.pathname;
}

displayActivity('-', 0);
loadActivity();

// Google Universal Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-36471625-5', 'auto');
ga('set', 'checkProtocolTask', function(){});
ga('require', 'displayfeatures');
ga('send', 'pageview', 'started');
function phNest(){
    $(function () {
		getChartOptions = function(data){
		
		var d = new Date();
		d.setMonth(d.getMonth() - 1);
		d = d.getTime();

        var options = {
			chart: {
				renderTo: 'chartcontainer',
				defaultSeriesType: 'column'
			},
			scrollbar: {
				enabled: true
			},
            title: {
                text: null
            },
            credits:{
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0.5
				}
			},
            xAxis: {
                tickmarkPlacement: 'on',
                labels: {
                    enabled: true,
					formatter: function () {
						var day = new Date(this.value);
						day = day.toDateString().split(" ").slice(1);
						return day.join(" ");
					}
                },
                minorTickLength: 0,
                tickLength: 0,
                gridLineWidth: 0,
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
				min: d
            },
            yAxis: {
                labels: {
                    enabled: false
                },
                min: 0,
				title: {
					text: 'Total hunts / day'
				},
                gridLineWidth: 0
            }, 
			
			
            series: [{
				data: data,
                cursor: 'pointer',
                events: {
                    click: function(event) {
						var day = new Date(event.point.x * 1);
						day = day.getFullYear() + "-" + padDigits((parseInt(day.getMonth()) + 1), 2) + "-" + padDigits(day.getDate(), 2);
						$.getJSON('hunts/' + day + '.json', function(jsonpost) {
							
                            $('.content').empty();
                            $('.content').packery({
                                gutter: 0
                            });
                            drawCards(event.point.x, jsonpost);
                        }).error(function() {console.log('error');}); 
                    }
                },
                allowPointSelect: true,

                    states: {
                        select: {
                            color: '#da552f',
                            lineWidth: 0
                        }
                    }

            }],
            tooltip: {
                style: {
                    fontSize: '28px'
                },
                formatter: function() {
                    var rawday = new Date(this.x);
                    var day = rawday.toDateString();
                    return '<strong>' + this.y + '</strong> hunts on <b>' + day + '</b>';
                },
                positioner: function () {
                    return { x: 20, y: 20 };
                },
                borderWidth: 0,
                shadow: 0
            }
        };
		return options;
		};

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

        $.getJSON('hunts/meta.json', function(json) {
            json.sort(sortdata);
            var data = [];
			
			for(eachobj in json){
				data.push([[json[eachobj].day][0] * 1, [json[eachobj].hunts][0] * 1]);
            }
			
			var options = getChartOptions(data);
			var chart = new Highcharts.Chart(options);
			
			
            chart.series[0].data[json.length-1].select();
			
			var day = new Date([json[eachobj].day][0] * 1);
			day = day.getFullYear() + "-" + padDigits((parseInt(day.getMonth()) + 1), 2) + "-" + padDigits(day.getDate(), 2);
	
            $.getJSON('hunts/' + day + '.json', function(jsonpost) {
                $('.content').empty();
                $('.content').packery({
                    gutter: 0
                });
				drawCards(json[json.length-1].day, jsonpost);
            }).error(function() {console.log('error');});
        }).error(function() {console.log('error');});
        function sortdata(a,b) {
            if (a.day < b.day)
                return -1;
            if (a.day > b.day)
                return 1;
            return 0;
        }

        $('.content').packery({
            gutter: 0
        });


    });

    function drawCards(pDay, pPosts){
        $('#progress').css('width', '3%');
        $('#progress').css('display', 'block');
        var day = new Date(pDay * 1);
        //day = "On " + day.getDate() + ", " +  day.getMonth() + " " + day.getYear();

        day =  day.toDateString();
        day = '<strong>' + (pPosts.length) + '</strong> hunts on <b>' + day + '</b>'

        $("#selected-day").html(day);

        var postperc = 100;

        if(pPosts.length){
             postperc = 100/pPosts.length;
        }
        $.each(pPosts,function(index,post){
            var card = $('#template .namecard').clone();
            card.find('.votes-count').text(post.post.votes);
            card.find('.post-name').attr('href', post.post.link).text(post.post.name);
            card.find('.post-tagline').text(post.post.tagline);
            //card.find('.post-comments a').attr('href', "http://www.producthunt.co/" + post.post.ph_url).text(post.post.comments + " comments");

			/*
            card.find('.ph-user').attr("href", "http://www.producthunt.co/" + post.user.id);
            card.find('.user-image').attr('src', post.user.image);
            card.find('.user-name').text(post.user.name);
            card.find('.user-tagline').text(post.user.tagline);
            card.find('.user-twitter a').attr('href', "https://twitter.com/" + post.user.twitter).text("@" + post.user.twitter);
			*/

            card.appendTo('.content');
            $('.content').packery('appended',card);
            $('#progress').css('width',postperc * (index + 1) + '%');
        });

        setTimeout(function(){
            $('#progress').css('display', 'none');
        },1000);
    }

    // hide #back-top first
    $("#back-top").hide();

    // fade in #back-top
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });

        // scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 400);
            return false;
        });
    });

}

 var cities = [];
 var date = new Date();
 var year = date.getFullYear();
 var month = date.getMonth()+1;
 var day = date.getDate();
 var week = date.getDay();
 var Time = year  + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day;
 var cityList = $("#city-list");

//store searching city to localStorage
function storeCity(){
    localStorage.setItem("city",JSON.stringify(cities));
}

// function add searching city to list
function addcitylist(){
    cityList.empty();
    for (let i = 0; i <=cities.length; i++){
        var city = cities[i];

        var li = $("<li>").text(city);
        li.attr("id","listC");
        li.attr("data-city", city);
        li.attr("class", "list-group-item");
        console.log(li);
        cityList.prepend(li);
    }
}

//add click event for searching city
$("#add-city").on("click",function(event){
   event.preventDefault();
   var city = $("#cityname").val().trim();
  
   if (city === ""){
       return;
   }
//    cities.push(city);
//  storeCity();
 getWeather(city);
//  addcitylist();
})


function getWeather(city){
    $(".current").attr("style","border-style:solid");
    $(".current").attr("style","background-color:white");
    $("#now1").empty();
    $("#icon").empty();


    //get lat and lon by city
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=7a312f4732439c26eeb132518aa25ce3")
    .then(function(response){
        return response.json();
    })
    .then(function(response){
    //add conditons that if enter a invalid city name
        if(response.cod === "404"){
            $("#now1").append($("<h2>").text("Not a Valid City"));
        }
        else{
        // console.log(response[0].lat)
        // console.log(response[0].lon)
        var lat = response[0].lat;
        var lon = response[0].lon; 
        cities.push(city);
        cities = unique(cities);
        storeCity();
        addcitylist()



            // get weather by lat and lon for current
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon=" + lon + "&units=imperial&appid=7a312f4732439c26eeb132518aa25ce3")
            .then(function(response){
                return response.json();
            })
            .then(function(response){
                console.log(response);
                console.log(response.current.weather[0].icon);
                var icon = response.current.weather[0].icon;
                var iconlink =  "https://openweathermap.org/img/wn/"+ icon + "@2x.png";
                console.log(iconlink);
                var imgEl = $("<img>").attr("src", iconlink);
                var cityhead = $("<h2>").text(city.toUpperCase() + " "+ "( " + Time + " )");
                var currentWeather = response.current.weather[0].main;
                var cWEl = $("<p>").text("Weather :  " + currentWeather);
                var temp = $("<p>").text("Temperature :  "+ response.current.temp + " °F");
                var humidity = $("<p>").text("Humidity :  "+ response.current.humidity + " %");
                var emptyline = $("<p>").text("");
                $("#now1").append(cityhead);
                $("#now1").append(emptyline);
                $("#now1").append(cWEl);
                $("#now1").append(temp);
                $("#now1").append(humidity);
                $("#icon").append(imgEl);
        
            })
        // get next week weather
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon=" + lon + "&units=imperial&appid=7a312f4732439c26eeb132518aa25ce3")
            .then(function(response){
                return response.json();
            })
            .then(function(response){
                var weeks = response.daily;
                $("#5days").empty();
                for (let i = 0; i<=5 ;i++ ){
                var weekDiv = [];
                var tempweek = [];
                var weatherweek = [];
                var iconweek = [];
                var ids = [];
                var week1 =[];
                var days = [];
                var iconlinks = [];
                weekDiv[i] = $("<div>");
                weekDiv[i].attr("class","days");
                weekDiv[i].attr("id",ids)
    
                tempweek[i] = weeks[i].temp.day;
                weatherweek[i] = weeks[i].weather[0].main;
                iconweek[i] = weeks[i].weather[0].icon;
                ids[i] = "#d"+ i;
                days[i] = date.getDate() + i;
                week1[i] = year  + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + days[i];
                iconlinks[i] = "https://openweathermap.org/img/wn/"+ iconweek[i] + "@2x.png";            
                // $(ids[i]).empty();
                weekDiv[i].append($("<p>").text("Date : "+ week1[i]));
                weekDiv[i].append($("<img>").attr("src", iconlinks[i]));
                weekDiv[i].append($("<p>").text("Weather : "+ weatherweek[i]));
                weekDiv[i].append($("<p>").text("Temperature : "+ tempweek[i]));
                $("#5days").append(weekDiv[i]);
                }
    
    
            })
        }


    
    })

}


//remove duplicated city search
function unique(arr) {
    return arr.filter(function(item, index, arr) {
      return arr.indexOf(item, 0) === index;
    });
  }

//add click event for history list
$(document).on("click", "#listC", function() {
    var thisCity = $(this).attr("data-city");
    getWeather(thisCity);
  });


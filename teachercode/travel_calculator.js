// travel_calculator.js

//Common Cost Variables (these are GLOBAL!)

var pay_rate = 0, travelers = 0, food_cost = 0,
    audio_users = 0, audio_rate = 0, video_users = 0, video_rate = 0,
    plan_data = 0, plan_overage = 0,
    audio_user_daily_data = 0, video_user_daily_data = 0,
    total_user_daily_data = 0;

$(document).ready(function(){
  $( "#results" ).click(function() {
    $( this ).fadeOut("slow");
  });
  const ESCAPE_KEY = 27;
  $( document ).keyup(function(evt) {
    if ( evt.which == ESCAPE_KEY ) { $("#results").fadeOut("slow"); }
  });
  $("#update_button").focus();
});


function updateResults() {
    getCommonCosts();
    checkTravelers(); //make certain that number of streams is reasonable!
    const car_costs = getCarCosts() || 0; //calculate the total car costs
    const flight_costs = getFlightCosts() || 0; // calculate total flight costs
    showResult(car_costs,flight_costs); //show the actual result of car or flight
}

function getCommonCosts() {
  //function reads values from the "common costs" area of the form
  //returns the total cost calculated based on fields and static values

  //---- FORM VALUES ----

  //average pay rate per user in dollars
  pay_rate = Number($("#pay_rate").val());
  console.log("pay_rate " + pay_rate);

  //total number of travelers
  travelers = Number($("#travelers").val());
  console.log("travelers " + travelers);

  //base food cost per traveler
  //food_cost = Number(getRadioValue('food_cost')) || 0;
  food_cost = Number($("input[name=food_cost]:checked").val()) || 0;
  console.log("food_cost " + food_cost);

  //number of audio stream users
  audio_users = Number($("#audio_users").val());
  console.log("audio_users " + audio_users);

  //audio rate in Megabits per second
  audio_rate = Number($("#audio_rate").val());
  console.log("audio_rate " + audio_rate);

  //number of video stream users
  video_users = Number($("#video_users").val());
  console.log("video_users " + video_users);

  //video rate in Megabits per second
  video_rate = Number($("#video_rate").val());
  console.log("video_rate " + video_rate);

  //cell plan data cap
  plan_data = Number($("#plan_data").val());
  console.log("plan_data " + plan_data);

  //cell plan cost per Gigabyte (oer month) over data cap
  plan_overage = Number($("input[name=plan_overage]:checked").val()) || 0;
  console.log("plan_overage " + plan_overage);

  //calculate audio users daily data
  audio_user_daily_data = audio_users * MbpsToGBpd(audio_rate);
  console.log("audio_user_daily_data " + audio_user_daily_data);

  //calculate video users daily data
  video_user_daily_data = video_users * MbpsToGBpd(video_rate);
  console.log("video_user_daily_data " + video_user_daily_data);

  //add audio and video together for total daily data
  total_daily_data = audio_user_daily_data + video_user_daily_data;
  console.log("total_user_daily_data " + total_user_daily_data);
}

function getCarCosts() {
    //function reads values from the "car related costs" area of the form
    //returns the total cost calculated based on fields and static values

    //---- FORM VALUES ----

    //total number of CAR DRIVING miles
    const miles_driving = Number($("#miles_driving").val());
    console.log("miles_driving " + miles_driving);

    //maximum number of miles our group will drive per day
    const maximum_daily_miles = Number($("#maximum_daily_miles").val());
    console.log("maximum_daily_miles " + maximum_daily_miles);

    //estimated wear and tear cost PER MILE
    const wear_per_mile = Number($("#wear_per_mile").val());
    console.log("wear_per_mile " + wear_per_mile);

    //average MPG rate
    const average_miles_per_gallon = Number($("#average_miles_per_gallon").val());
    console.log("average_miles_per_gallon " + average_miles_per_gallon);

    //average cost of gas per gallon
    const cost_per_gallon = Number($("#cost_per_gallon").val());
    console.log("cost_per_gallon " + cost_per_gallon);

    //estimated cost of hotel per night
    const hotel_cost_per_night = Number($("#hotel_cost_per_night").val());
    console.log("hotel_cost_per_night " + hotel_cost_per_night);

    //a "fudge factor" to add-in unaccounted for discounts for driving
    const car_discount = Number($("#car_discount").val());
    console.log("car_discount " + car_discount);

    //average cost PER DAY to park
    const parking_cost_per_day = Number($("#parking_cost_per_day").val());
    console.log("parking_cost_per_day " + parking_cost_per_day);

    //---- CALCULATED VALUES ----

    //calculate total number of gallons of gas used on trip
    const number_of_gallons = miles_driving / average_miles_per_gallon;
    console.log("number_of_gallons " + number_of_gallons);

    //calculate total cost of gas for trip
    const total_mileage_cost = number_of_gallons * cost_per_gallon;
    console.log("total_mileage_cost " + total_mileage_cost);

    //calculate food cost rounded up to nearest day
    const number_of_days_by_car = Math.ceil( miles_driving / maximum_daily_miles);
    console.log("number_of_days_by_car " + number_of_days_by_car);

    //calculate per day food cost
    const per_day_food_cost = travelers * food_cost;
    console.log("per_day_food_cost " + per_day_food_cost);

    //calculate total trip food cost
    const total_car_food_cost = per_day_food_cost * number_of_days_by_car;
    console.log("total_car_food_cost " + total_car_food_cost);

    //calculate total usage for the whole trip
    const total_car_data = total_daily_data * number_of_days_by_car;
    console.log("total_car_data " + total_car_data);

    //Uses Math.ceil() to round up to nearest full Gigabyte
    const adjusted_total_car_data = Math.ceil(total_car_data - plan_data);
    console.log("adjusted_total_car_data " + adjusted_total_car_data);

    //Uses Conditional operator to multiply the rate * the overage amount or zero if there is no overage
    const total_car_data_cost = (adjusted_total_car_data > 0) ? (plan_overage * adjusted_total_car_data) : 0;
    console.log("total_car_data_cost " + total_car_data_cost);

    //Round the number of days down to get nights. If it's less than a day, no hotel needed
    const total_hotel_cost = Math.floor(number_of_days_by_car) * hotel_cost_per_night;
    console.log("total_hotel_cost " + total_hotel_cost);

    //Calculate the total car wear and tear for the trip
    const total_car_wear = miles_driving * wear_per_mile;
    console.log("total_car_wear " + total_car_wear);

    //Calculate the total cost of parking for the trip
    const total_car_parking_cost = number_of_days_by_car * parking_cost_per_day;
    console.log("total_car_parking_cost " + total_car_parking_cost);

    //Round the number of days UP, then multiple by 8 to get hours per day
    const car_payrate = Math.ceil(number_of_days_by_car) *
    8 * pay_rate * travelers;
    console.log("car_payrate " + car_payrate);

    const total_car_cost = total_car_food_cost + total_mileage_cost +
    total_car_data_cost + total_hotel_cost +
    total_car_parking_cost + total_car_wear
    - car_discount + car_payrate;
    console.log("total_car_cost " + total_car_cost);

    return total_car_cost;
}

function getFlightCosts() {
  //function reads values from the "flight related costs" area of the form
  //returns the total cost calculated based on fields and static values

  //---- FORM VALUES ----


  const cost_per_bag = Number($("#cost_per_bag").val());
	console.log("cost_per_bag " + cost_per_bag);


  const flight_speed = Number($("#flight_speed").val());
	console.log("flight_speed " + flight_speed);


  const airport_hours = Number($("#airport_hours").val());
	console.log("airport_hours " + airport_hours);


  const miles_flying = Number($("#miles_flying").val());
	console.log("miles_flying " + miles_flying);


  const flight_cost = Number($("#flight_cost").val());
	console.log("flight_cost " + flight_cost);


  const flight_transit_cost = Number($("#flight_transit_cost").val());
	console.log("flight_transit_cost " + flight_transit_cost);


  const flight_discount = Number($("#flight_discount").val());
	console.log("flight_discount " + flight_discount);


  const flight_amenities = Number(addCheckboxValues("flight_amenities")) || 0;
	console.log("flight_amenities " + flight_amenities);


  const checked_bags_per_traveler = Number($("#checked_bags_per_traveler").val());
	console.log("checked_bags_per_traveler " + checked_bags_per_traveler);


  const in_flight_amenities = Number(addCheckboxValues("in_flight_amenities")) || 0;
	console.log("in_flight_amenities " + in_flight_amenities);


  //---- CALCULATED VALUES ----

  // calculate flight_food_cost as one meal per traveler
  const total_flight_food_cost = travelers * food_cost;
  console.log("total_flight_food_cost " + total_flight_food_cost);

  // calculate total usage at both airports since total_daily_data is DAILY,
  // we need to divide by 24 to get hourly
  const total_flight_data = total_daily_data * airport_hours / 24;
  console.log("total_flight_data " + total_flight_data);

  // Uses Math.ceil() to round up to nearest full Gigabyte
  const adjusted_total_flight_data = Math.ceil(total_flight_data - plan_data);
  console.log("adjusted_total_flight_data " + adjusted_total_flight_data);

  // Uses Conditional operator to multiply the rate * the overage amount or zero if there is no overage
  const total_flight_data_cost = (adjusted_total_flight_data > 0) ? (plan_overage * adjusted_total_flight_data) : 0;
  console.log("total_flight_data_cost " + total_flight_data_cost);

	const total_traveler_flight_cost = flight_cost * travelers;
	console.log("total_traveler_flight_cost " + total_traveler_flight_cost);

	const time_of_flight = miles_flying / flight_speed;
	console.log("time_of_flight " + time_of_flight);
	const total_amenities = (flight_amenities + in_flight_amenities ) * travelers;
	console.log("total_amenities " + total_amenities);

	const total_payrate_cost = pay_rate * ( ( time_of_flight * 2 ) + airport_hours )
													 * travelers;
	console.log("total_payrate_cost " + total_payrate_cost);

	const total_flight_checked_bags_cost = (checked_bags_per_traveler * cost_per_bag) * travelers;
	console.log("total_flight_checked_bags_cost " + total_flight_checked_bags_cost);
	const total_flight_cost = total_traveler_flight_cost + total_amenities +
													total_flight_checked_bags_cost - flight_discount +
													total_flight_food_cost + total_flight_data_cost +
                          total_payrate_cost;
	console.log("total_flight_cost " + total_flight_cost);

	return total_flight_cost;
}

function oldshowResult(cost1, cost2) {
    if (cost1 < cost2) {
        createImage('pexels-photo-car.jpg', 'results');
    } else {
        createImage('pexels-photo-airplane.jpg', 'results');
    }
}

function showResult(cost1, cost2) {
    if (cost1 < cost2) {
        $("#results").html($("<img>").attr("src","images/car.jpeg")).fadeIn("slow");
    } 
	else{
        $("#results").html($("<img>").attr("src","images/plane.jpeg")).fadeIn("slow");
    }
}

function addCheckboxValues(groupName) {
    // This checks all of the checkboxes in a group
    // and adds up the total!

    // elements is an array of all the checkbox field elements
    const elements = document.getElementsByName(groupName);

    // total: the cumulative total, starts out at zero.
    // i: the "index" variable - starts at ZERO for the first one
    // l: the total number of elements in the array
    //
    // this loop goes through all elements and adds them
    // NOTE: element[0] is the FIRST item
    //       element[l-1] is the LAST item

    for (var i = 0, l = elements.length, total = 0; i < l; i++) {
        if (elements[i].checked) {
            total += Number(elements[i].value);
        }
    }
    return total;
}

function MbpsToGBpd(Mbps) {
    // This converts Megabits per second items into Gigabytes per day
    // This is used when calculating data service overages
    const MbToMBRatio = 8; //r atio of Megabits per Megabyte
    const MBToGBRatio = 1024; // ratio of Megabytes per Gigabyte
    const secPerDay = 24*60*60; // number of seconds in a day 24h * 60m/h * 60s/m
    var MBps = Mbps / MbToMBRatio; // calculate Megabytes per Second
    var GBps = MBps / MBToGBRatio; // calculate Gigabytes per Second
    var GBpd = GBps * secPerDay; // calculate Gigabytes per Day
    return GBpd;
}

function checkTravelers() {
    // Get the values of travelers, audio streamers, and video streamers
    // Number of audio streams can't be greater than total travelers
    // Number of video streams can't be greater than total travelers - 1
    // NOTE: someone can watch video with a different audio stream
    //
    // For example, a Lynda.com video + some streaming music

    var checkTravelers = Number($("#travelers").val());
    var checkAudio = Number($("#audio_users").val());
    var checkVideo = Number($("#video_users").val());

    // more people can't stream video than total travelers
    // NOTE: we take care of the fact that drivers can't watch video by
    // subtracting one
    if (checkVideo > checkTravelers - 1) {
        //reset number of video streams
        $("#video_users").val() = checkTravelers - 1;
    }
    // more people can't stream audio than total travelers
    if (checkAudio > checkTravelers) {
        //reset number of video streams
        $("#audio_users").val() = checkTravelers;
    }
}

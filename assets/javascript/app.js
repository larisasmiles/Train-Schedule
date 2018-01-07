
   // Initialize Firebase
   var config = {
    apiKey: "AIzaSyDOyn-8cOFuuyKmSLocXroZR1fkRujMaRs",
    authDomain: "train-schedule-c956d.firebaseapp.com",
    databaseURL: "https://train-schedule-c956d.firebaseio.com",
    projectId: "train-schedule-c956d",
    storageBucket: "",
    messagingSenderId: "1041967114641"
  };
  firebase.initializeApp(config);

let database = firebase.database();

let trainName = "";
let destination = "";
let frequency = "";
let nextArrival = "";


function update() {
  $('#currentTime').html(moment().format(' H:mm:ss'));
};

setInterval(update, 1000);

$("#submitBtn").on("click", function() {
    // Don't refresh the page!
    event.preventDefault();

    trainName = $('#trainName').val().trim();
    destination = $('#destination').val().trim();
    frequency = $('#frequency').val().trim();
    nextArrival = $('#nextArrival').val().trim();

    let trainInfo={
        trainName :trainName,
        destination : destination,
        frequency : frequency,
        nextArrival :nextArrival
    
    };

     // Uploads employee data to the database
    database.ref().push(trainInfo);

    $('#trainName').val('');
    $('#destination').val('');
    $('#frequency').val('');
    $('#nextArrival').val('');
});


database.ref().on('child_added', function(childSnapshot, prevChildName) {
    // do something with the child
    let trainName = childSnapshot.val().trainName;
    let destination = childSnapshot.val().destination;
    let frequency = childSnapshot.val().frequency;
    let nextArrival = childSnapshot.val().nextArrival;
    
    let firstTimeConverted = moment(nextArrival, "hh:mm").subtract(1, "years");
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    let trainRemainder = diffTime % frequency;
    let minAway = frequency - trainRemainder;
    let arrival = moment().add(minAway, "minutes");
    let arrivalFormat = moment(arrival).format("hh:mm");
    let minAwayFormat = moment(minAway).format("hh:mm");
   
 
        $("#rowSpace").append(`<tr><td> ${trainName} </td>
                        <td> ${destination} </td>
                        <td> ${frequency} </td>
                        <td> ${nextArrival} </td>
                        <td id='minAway'> ${minAway} </td>
                        
                       </tr>`);

  });

  function autoRefresh1()
  {
         window.location.reload();
       
  }
   
   setInterval('autoRefresh1()', 30000);

   $("#deleteBtn").click(function(){
    let trainToDelete = $('#trainToDelete').val().trim();
    console.log(trainToDelete);
 
    firebase.database().ref().child(trainToDelete).remove();
    // window.location.reload();
   });
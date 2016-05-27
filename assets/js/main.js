document.addEventListener('DOMContentLoaded', function() {
  //AddScript('dist/js/jquery.min.js');
  init();
}, false);
window.onload = function() {
  addEventHandlers();
  createValidator();
}
var database, birthday, isAuth, startDate, endDate, uid, username;

function logout() {
  firebase.auth().signOut();
  location.replace('index.html');
}
'use strict';

function init() {
  // Initialize Firebase and bootstrap js
  //var bootstrap = $.getScript('dist/js/bootstrap.min.js');
  var fbs = $.getScript('https://www.gstatic.com/firebasejs/live/3.0/firebase.js');
  fbs.then(function() {
    var config = {
      apiKey: "AIzaSyBjbc5fbEm8EFhOSBwWQUJMod-g8g5Yjdc",
      authDomain: "shindig-91a8e.firebaseapp.com",
      databaseURL: "https://shindig-91a8e.firebaseio.com",
      storageBucket: ""
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        uid = user.uid;
        firebase.database().ref('users/' + user.uid).on('value', function(snapshot) {
          username = snapshot.val().displayName;
        });
        getEvents();
        $('#login_link').hide();
        $('#sign_up_button').hide();
        $('#logout_button').show();
        $('#create_event_alert').hide();
      } else {
        $('#login_link').show();
        $('#sign_up_button').show();
        $('#logout_button').hide();
        $('#create_event_alert').show();
        console.log("Not currently logged in");
      }
    });
    database = firebase.database();
  });
}
// function for dynamically loading js scripts
// NOTE may be unneed due to $.getScript performing essentially the same function

function AddScript(url) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  document.body.appendChild(script);
  document.body.removeChild(document.body.lastChild);
}
'use strict';

function addEventHandlers() {
  $('#login_button').click(function(e) {
    login();
  });
  $('#logout_button').click(function(e) {
    logout();
  });
  $('#register_submit').click(function(e) {
    register();
  });
  $('#new_event').click(function(e) {
    location.replace("create_event.html");
  });
  $('#register_birthday').change(function(e) {
    birthday = prettyDate(false, '$(register_birthday).val()', null);
  });
  $('#event_start_date').change(function(e) {
    startDate = prettyDate(true, '$(event_start_date).val()', $('#event_start_time').val());
  });
  $('#event_start_time').change(function(e) {
    startDate = prettyDate(true, '$(event_start_date).val()', $('#event_start_time').val());
  });
  $('#event_end_date').change(function(e) {
    endDate = prettyDate(true, '$(event_end_date).val()', $('#event_end_time').val());
  });
  $('#event_end_time').change(function(e) {
    startDate = prettyDate(true, '$(event_end_date).val()', $('#event_end_time').val());
  });
  $('#create_event_submit_button').click(function(e) {
    createEvent();
  });
  $('#event_type li').on('click', function() {
    $('#event_type_span').text($(this).text());
  });
}
// Make the dates conform!

function prettyDate(nullTime, old_date, time) {
  var formattedDate = new Date(old_date);
  if (nullTime) {
    time = time.split(':');
    formattedDate.setHours(time[0]);
    formattedDate.setMinutes(time[1]);
  } else {
    formattedDate.setHours(24);
  }
  var day = formattedDate.getDay();
  var date = formattedDate.getDate();
  var mon = formattedDate.getMonth();
  var year = formattedDate.getFullYear();
  var hours = formattedDate.getHours();
  var minutes = formattedDate.getMinutes();
  var dd = "AM";
  if (hours >= 12) {
    hours -= 12;
    dd = "PM";
  }
  if (hours === 0) {
    hours = 12;
  }
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var returnDate = (weekday[day] + ", " + month[mon] + " " + date + " " + year + " - " + hours + ":" + minutes + " " + dd);
  return returnDate;
}
// Creates the validation methods for registration forms

function createValidator() {
  $.validator.addMethod("email", function(value) {
    return (/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i).test(value);
  });
  $.validator.addMethod("pwcheckupper", function(value) {
    return (/[A-Z]/).test(value); // has an uppercase letter
  });
  $.validator.addMethod("pwcheckspecial", function(value) {
    return (/[!@#$%^&*-]/).test(value); // contains a special character
  });
  $.validator.addMethod("pwchecklower", function(value) {
    return (/[a-z]/).test(value); // has a lowercase letter
  });
  $.validator.addMethod("pwcheckdigit", function(value) {
    return (/\d{2}/).test(value); // has two digits
  });
  //Add event handler for from validation
  $('#register_form').validate({
    focusInvalid: true,
    focusCleanup: true,
    rules: {
      fname: {
        required: true,
        minlength: 2
      },
      email: {
        required: true,
        email: true
      },
      password_one: {
        required: true,
        pwcheckupper: true,
        pwcheckspecial: true,
        pwchecklower: true,
        pwcheckdigit: true,
        minlength: 8,
        maxlength: 100,
      },
      password_two: {
        equalTo: "#register_password",
      }
    },
    messages: {
      password_one: {
        required: "This field is required",
        pwcheckupper: "Password must contain at least one uppercase letter",
        pwcheckspecial: "Password must contain at least one special character",
        pwchecklower: "Password must contain at least one lowercase letter",
        pwcheckdigit: "Password must contain at least two numerical values (0-9)",
        minlength: "your password must contain at least 8 characters",
        maxlength: "your password cannot contain more than 100 characters"
      },
      password_two: {
        required: "This field is required",
        equalTo: "the passwords do not match"
      }
    }
  });
}

function register() {
  var name = $('#register_name').val(),
    email = $('#register_email').val(),
    pass1 = $('#register_password').val(),
    pass2 = $('#register_password_2').val(),
    options = {
      employer: $('#register_employer').val(),
      jobtitle: $('#register_job_title').val(),
      birthday: birthday
    },
    password, register_user;
  if ($('#register_form').valid()) {
    password = pass1;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        $('#register_alert').show();
        $('.alert-text').text(error.message);
      } else if (errorCode == 'auth/email-already-in-use') {
        $('#register_alert').show();
        $('.alert-text').text(error.message);
      } else {
        console.error(error);
      }
    }).then(function(e) {
      register_user = new User(e.uid, name, email, password, options);
      writeUserData(register_user);
      login(email, password);
    });
  }
}

function login(email, password) {
  var login_form_email = $('#login_email').val();
  var login_form_password = $('#login_password').val();
  if (login_form_email !== null || login_form_password !== null) {
    email = login_form_email;
    password = login_form_password;
  }
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    // TODO add error handles
  }).then(function(e) {
    location.replace('index.html');
  });
}

function User(id, name, email, password, options) {
  this.id = id;
  this.email = email;
  this.name = name;
  this.password = password;
  this.info = options;
}

function writeUserData(register_user) {
  firebase.database().ref('users/' + register_user.id).set({
    displayName: register_user.name,
    email: register_user.email,
    info: register_user.info,
  });
}

function getEvents() {
  firebase.database().ref('users/' + uid + '/events').once('value', function(snapshot) {
    for (var snap in snapshot.val()) {
      var evt = snapshot.val()[snap].event;
      var event_container = $('<div class="col-md-4 col-sm-6 col-xs-12">');
      var event = $('<div class="card">');
      var event_content = $('<div class="card-content">');
      var event_type = $('<span class="text-muted">').text(" - " + evt.event_type);
      event_content.append($('<h2 class="text-left">').text(evt.event_name_header + " ").append(event_type));
      event_content.append($('<h5 class="text-left">').text("Hosted by " + evt.event_host));
      event_content.append($('<p class="lead">').text(evt.event_message));
      var event_action = $('<div class="card-action">');
      var collapse_container = $('<div>');
      var collapse_body = $('<div class="collapse text-left">').attr('id', evt.collapse_id);
      collapse_body.append($('<span class="label label-success">').text('Starts'));
      var std = prettyDate(true, evt.start_date, evt.start_time);
      collapse_body.append($('<p class="lead">').text(std));
      var etd = prettyDate(true, evt.end_date, evt.end_time);
      collapse_body.append($('<span class="label label-danger">').text('Ends'));
      collapse_body.append($('<p class="lead">').text(etd));
      var collapse_button = $('<a class="btn btn-default btn-collapse" data-toggle="collapse" aria-expanded="false" aria-controls="' + evt.collapse_id + '" role="button">').attr("href", "#" + evt.collapse_id).text('Read More');
      event_action.append(collapse_container.append(collapse_button, collapse_body));
      event.append(event_content);
      event.append(event_action);
      event_container.append(event);
      $('#events_container').prepend(event_container);
    }
  });
}

function createEvent() {
  var random = (Math.random() + "").split(".")[1];
  console.log(random);
  var event = {
    event_name_header: $('#event_name_header').val(),
    event_type: $('#event_type_span').text(),
    event_host: username,
    // TODO add input and if null use username
    start_date: $('#event_start_date').val(),
    start_time: $('#event_start_time').val(),
    end_date: $('#event_end_date').val(),
    end_time: $('#event_end_time').val(),
    collapse_id: "event_" + random
  }
  var isValid = false,
    keyTracker;
  for (var key in event) {
    if (event[key].length < 1) {
      isValid = false;
      keyTracker = key;
      console.log(keyTracker);
      break;
    } else {
      isValid = true;
    }
  }
  if (isValid) {
    writeNewEvent(event);
  } else {
    var elem = $('#' + keyTracker)[0];
  }
}

function writeNewEvent(event) {
  firebase.database().ref('users/' + uid + '/events').push({
    event: event
  });
}

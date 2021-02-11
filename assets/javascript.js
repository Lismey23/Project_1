//initial google sheet api function call to display the content held in the associated google sheet

getGoogleSheetData();

function getGoogleSheetData(){

//google sheets API request call
var urlSheet = "https://sheets.googleapis.com/v4/spreadsheets/10KzkFG-9gv5m5-PrkunguT3BvJwU8kA01Vi0WOovg_8/values/FormResponse1!A2:Q1000?key="
var apiKeySheet = atob("QUl6YVN5RHJqdEFXdzRRZ2JlNWl0WHpWTUZLTGhmYW1ia3M0NEpv")


var settings = {
  "method": "GET",
  "timeout": 0,
};
settings.url = urlSheet + apiKeySheet

  console.log(settings);
  $.ajax(settings).done(function (response) {
    console.log(response);
    //this for() loop runs the function loopSheet() however many times there are items in the google sheet api call's object array
    for(var index = 0; index < response.values.length; index ++){
      loopSheet(response.values[index]);
    }
  });
}


//github api call
var url = "https://api.github.com/users/";
  var githubApiKey = atob("M2IzY2Y0NzE3Mzk4ZWQ5OGFjMzYzYzc3NDI2NDc3ZDlkZTI5YWMyNg==")
  
  var settings = {
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": "Bearer "+ githubApiKey,
      },
    };
  
$("#submit").click(function(){
        callGithub2();
});


//this function calls the gitHub api and passes the gitHubUsername variable as a parameter 
function callGithub2(gitHubUsername){
  
  settings.url = url+gitHubUsername ; 
    $.ajax(settings).done(function (response) {
        console.log(response);

        //select element by name inputted
        $("#github-img-"+gitHubUsername).attr("src",response.avatar_url);
      });
}

//this function builds the cards that will hold the content of the (currentRow) of the data object retrieved from the googleSheet API
function loopSheet(currentRow){
  var nameContent = currentRow[1];
  var locationContent = currentRow[2]
  var thingsToDo = currentRow[3]
  var funFact = currentRow[4]
  var gitHubUsername = currentRow[5]
  
  
  var card = $("<div>").addClass("card col-3").css("width","18rem");
  var image = $("<img>").attr("id", "github-img-"+gitHubUsername).attr("src","").addClass("card-img-top");
  var cardBody = $("<div>").addClass("card-body");
  var cardTitle = $("<h5>").addClass("card-title");
  var cardText = $("<p>").addClass("card-text");
  var ul = $("<ul>").addClass("list-group list-group-flush");
  // var li = $("<li>").addClass("list-group-item");
  var footer = $("<div>").addClass("card-body");
  

 
  //this appends the different elements to the cardBody variable
  cardBody.append(cardTitle);
  cardBody.append(cardText);
  card.append(image);
  card.append(cardBody);
    
  //these variables append the different form elements that are at different locations of the main object as list items
  var liNameContent = $("<li>").addClass("list-group-item");
  liNameContent.append("My name is " + nameContent);
  
  var liLocationContent = $("<li>").addClass("list-group-item");
  liLocationContent.append("I live in " + locationContent);

  var liThingsToDoContent = $("<li>").addClass("list-group-item");
  liThingsToDoContent.append("I like to " + thingsToDo);

  var liFunFact = $("<li>").addClass("list-group-item");
  liFunFact.append("Fun fact : " + funFact);
  
  //this appends the different li objects to the unordered list variable
  ul.append(liNameContent);
  ul.append(liLocationContent);
  ul.append(liThingsToDoContent);
  ul.append(liFunFact);
  card.append(cardBody)
  card.append(ul)
  card.append(footer);
  $(".cardContainer").append(card)
  
  //this calls the callGitHub function for gitHubUsername to populate the card with the image of the user's profile picture
  callGithub2(gitHubUsername);
  
  
}


//this is the full form submission that sends the data to the googleSheet without forcing the user to leave the site and view the standard googleForm submission landing page
$('#form').submit(function(e){
  e.preventDefault();
  $.ajax({
      url: "https://cors-anywhere.herokuapp.com/https://docs.google.com/forms/u/0/d/e/1FAIpQLScC3qPLfNkJvxhWkrJDsTiaRgpATq9puTLT_5AU0RtvVVywYw/formResponse",
      data: $(this).serialize(),
      type: "POST",
      dataType: "html",

      success: function(data) {
          console.log('Submission successful');
          //this empties the card container so that duplicate data is not appended upon submission
          $(".cardContainer").empty();
          //upon sumbission recall the updated data pushed to the google sheet
          getGoogleSheetData();
      },
      error: function(xhr, status, error) {
          console.log('Submission failed: ' + error);
      }
  });
})




function parseEmails(string){
  var json = JSON.parse(string);
  var emails = [];

  // search for all unique emails
  json.forEach(function(element){
    var payload = element.payload;
    if(payload.commits){
      payload.commits.forEach(function(commit){
        var email = commit.author.email;
        if(emails.indexOf(email) == -1) emails.push(email);
      });
    }
  });
  return emails;
}

function insertEmails(emails){
  var detailContainer = document.querySelector('.vcard-details');

  emails.forEach(function(email){

    var emailLink = document.createElement('li');
    emailLink.className = "vcard-detail py-1 css-truncate css-truncate-target";

    // Github original svg for email
    emailLink.innerHTML = '<svg aria-hidden="true" class="octicon octicon-mail" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14"><path d="M0 4v8c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V4c0-0.55-0.45-1-1-1H1c-0.55 0-1 0.45-1 1z m13 0L7 9 1 4h12zM1 5.5l4 3L1 11.5V5.5z m1 6.5l3.5-3 1.5 1.5 1.5-1.5 3.5 3H2z m11-0.5L9 8.5l4-3v6z"></path></svg>';
    emailLink.innerHTML += "<a href='mailto:" + email + "'>" + email + "</a>";

    detailContainer.appendChild(emailLink);
  });

}

// Manual ajax request
function makeRequest(url, callback) {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest)  return false;

  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        callback(httpRequest.responseText);
      } else {
        throw "Request error"
      }
    }
  };

  httpRequest.open('GET', url);
  httpRequest.send();
}

function getPublicElements(){
  var url = "https://api.github.com/users{}/events/public".replace('{}', window.location.pathname);

  makeRequest(url, function(text){

    insertEmails(parseEmails(text));

  });
}

getPublicElements();

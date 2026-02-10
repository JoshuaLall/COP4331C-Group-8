const urlBase = '/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	let resultDiv = document.getElementById("loginResult");
	
	resultDiv.innerHTML = "";
	resultDiv.className = "message-area";
	
	if (!login || !password) {
		resultDiv.innerHTML = "Please enter both username and password";
		resultDiv.classList.add("error");
		return;
	}

	let tmp = {login:login, password:password};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
		
				if(userId < 1)
				{		
					resultDiv.innerHTML = "Invalid username or password";
					resultDiv.classList.add("error");
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html"; //changed from contacts.html to color.html
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		resultDiv.innerHTML = "Connection error. Please try again.";
		resultDiv.classList.add("error");
	}
}

function doRegister()
{
	let box = document.getElementById("registerBox");
	if(box)
	{
		box.scrollIntoView({ behavior: "smooth", block: "start" });
	}
}

function registerUser()
{
	let first = document.getElementById("registerFirstName").value.trim();
	let last  = document.getElementById("registerLastName").value.trim();
	let login = document.getElementById("registerLogin").value.trim();
	let pass  = document.getElementById("registerPassword").value;

	let resultDiv = document.getElementById("registerResult");
	resultDiv.innerHTML = "";
	resultDiv.className = "message-area";

	if(!first || !last || !login || !pass)
	{
		resultDiv.innerHTML = "Please fill out all fields";
		resultDiv.classList.add("error");
		return;
	}

	let tmp = { firstName: first, lastName: last, login: login, password: pass };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4)
			{
				if (this.status != 200)
				{
					resultDiv.innerHTML = "Server error. Please try again.";
					resultDiv.classList.add("error");
					return;
				}

				let jsonObject;
				try {
					jsonObject = JSON.parse(xhr.responseText);
				} catch(e) {
					resultDiv.innerHTML = "Invalid server response";
					resultDiv.classList.add("error");
					return;
				}

				if(jsonObject.error && jsonObject.error.length > 0)
				{
					resultDiv.innerHTML = jsonObject.error;
					resultDiv.classList.add("error");
					return;
				}

				// Auto-login after register (same behavior style as your login)
				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName  = jsonObject.lastName;

				saveCookie();
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		resultDiv.innerHTML = "Connection error. Please try again.";
		resultDiv.classList.add("error");
	}
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

// function readCookie()
// {
// 	userId = -1;
// 	let data = document.cookie;
// 	let splits = data.split(",");
	
// 	for(var i = 0; i < splits.length; i++) 
// 	{
// 		let thisOne = splits[i].trim();
// 		let tokens = thisOne.split("=");
		
// 		if(tokens[0] == "firstName")
// 		{
// 			firstName = tokens[1];
// 		}
// 		else if(tokens[0] == "lastName")
// 		{
// 			lastName = tokens[1];
// 		}
// 		else if(tokens[0] == "userId")
// 		{
// 			userId = parseInt(tokens[1].trim());
// 		}
// 	}
	
// 	if(userId < 0)
// 	{
// 		window.location.href = "index.html";
// 	}
// 	else
// 	{
// 		let userNameElement = document.getElementById("userName");
// 		if(userNameElement)
// 		{
// 			userNameElement.innerHTML = firstName + " " + lastName;
// 		}
// 	}
// }

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
  let first = document.getElementById("contactName").value.trim();
  let last  = document.getElementById("contactLastName").value.trim();
  let phone = document.getElementById("contactPhone").value.trim();
  let email = document.getElementById("contactEmail").value.trim();

  let resultDiv = document.getElementById("contactAddResult");
  resultDiv.innerHTML = "";
  resultDiv.className = "message-area";

  if(!first)
  {
    resultDiv.innerHTML = "Please enter a first name";
    resultDiv.classList.add("error");
    return;
  }

  let tmp = { firstName: first, lastName: last, phone: phone, email: email, userId: userId };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/AddContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try
  {
    xhr.onreadystatechange = function()
    {
      if (this.readyState == 4 && this.status == 200)
      {
        let resp = JSON.parse(xhr.responseText);

        if(resp.error && resp.error.length > 0)
        {
          resultDiv.innerHTML = resp.error;
          resultDiv.classList.add("error");
          return;
        }

        resultDiv.innerHTML = "Contact added successfully";
        resultDiv.classList.add("success");

        document.getElementById("contactName").value = "";
        document.getElementById("contactLastName").value = "";
        document.getElementById("contactPhone").value = "";
        document.getElementById("contactEmail").value = "";

        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  }
  catch(err)
  {
    resultDiv.innerHTML = "Error adding contact. Please try again.";
    resultDiv.classList.add("error");
  }
}


function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	let resultDiv = document.getElementById("contactSearchResult");
	resultDiv.innerHTML = "";
	resultDiv.className = "message-area";
	let contactList = "";
	let tmp = {search:srch, userId:userId};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/SearchContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				
				if(jsonObject.results && jsonObject.results.length > 0)
				{
					contactList = "";
					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let c = jsonObject.results[i];

						contactList += `
							<div class="contact-row" id="contact-row-${c.ID}">
							<div class="contact-text">
							${c.FirstName} ${c.LastName} | ${c.Phone} | ${c.Email}
							</div>

							<div class="contact-actions contact-actions-inline">
							<button type="button" class="buttons contact-btn contact-btn-sm" onclick="deleteContact(${c.ID});">Delete</button>
							<button type="button" class="buttons contact-btn contact-btn-sm"
							onclick='toggleUpdateForm(${c.ID}, ${JSON.stringify(c.FirstName || "")}, ${JSON.stringify(c.LastName || "")}, ${JSON.stringify(c.Phone || "")}, ${JSON.stringify(c.Email || "")});'>
							Update
							</button>
							</div>
							<div class="contact-update" id="update-form-${c.ID}" style="display:none;"></div>
							</div>
							`;
						}

					let resultContainer = document.getElementById("contactsList");
					if(resultContainer)
					{
						resultContainer.innerHTML = contactList;
					}

					resultDiv.innerHTML = jsonObject.results.length + " contact(s) found";
					resultDiv.classList.add("success");
				}
				else
				{
					resultDiv.innerHTML = "No contacts found";
					let resultContainer = document.getElementById("contactsList");
					if(resultContainer)
					{
						resultContainer.innerHTML = "";
					}
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		resultDiv.innerHTML = "Error searching contacts. Please try again.";
		resultDiv.classList.add("error");
	}
}


function deleteContact(contactId)
{
	if(!confirm("Are you sure you want to delete this contact?"))
	{
		return;
	}

	let tmp = {contactId: contactId, userId: userId};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/DeleteContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let resp = JSON.parse(xhr.responseText);
				if(resp.error && resp.error.length > 0)
				{
					alert(resp.error);
					return;
				}
				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert("Error deleting contact. Please try again.");
	}
}

function escapeAttr(value)
{
	if (value === null || value === undefined) return "";
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function toggleUpdateForm(contactId, first, last, phone, email)
{
	let container = document.getElementById("update-form-" + contactId);
	if(!container) return;
	if(container.style.display === "block")
	{
		container.style.display = "none";
		container.innerHTML = "";
		return;
	}

	container.innerHTML = `
		<input type="text" id="updateFirst-${contactId}" placeholder="First Name" value="${escapeAttr(first)}" />
		<input type="text" id="updateLast-${contactId}" placeholder="Last Name" value="${escapeAttr(last)}" />
		<input type="text" id="updatePhone-${contactId}" placeholder="Phone" value="${escapeAttr(phone)}" />
		<input type="text" id="updateEmail-${contactId}" placeholder="Email" value="${escapeAttr(email)}" />

		<div class="contact-actions">
			<button type="button" class="buttons contact-btn" onclick="updateContact(${contactId});">Save Update</button>
			<button type="button" class="buttons contact-btn" onclick="cancelUpdate(${contactId});">Cancel</button>
		</div>

		<span class="message-area" id="updateResult-${contactId}"></span>
	`;
	container.style.display = "block";
}

function cancelUpdate(contactId)
{
	let container = document.getElementById("update-form-" + contactId);
	if(container)
	{
		container.style.display = "none";
		container.innerHTML = "";
	}
}

function updateContact(contactId)
{
	let first = document.getElementById("updateFirst-" + contactId).value.trim();
	let last  = document.getElementById("updateLast-" + contactId).value.trim();
	let phone = document.getElementById("updatePhone-" + contactId).value.trim();
	let email = document.getElementById("updateEmail-" + contactId).value.trim();
	let resultDiv = document.getElementById("updateResult-" + contactId);
	resultDiv.innerHTML = "";
	resultDiv.className = "message-area";
	let tmp = { contactId: contactId, userId: userId };
	if(first.length > 0) tmp.firstName = first;
	if(last.length > 0)  tmp.lastName = last;
	if(phone.length > 0) tmp.phone = phone;
	if(email.length > 0) tmp.email = email;

	if(!tmp.firstName && !tmp.lastName && !tmp.phone && !tmp.email)
{
	resultDiv.innerHTML = "Enter at least one field to update";
	resultDiv.classList.add("error");
	return;
}

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/UpdateContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let resp = JSON.parse(xhr.responseText);

				if(resp.error && resp.error.length > 0)
				{
					resultDiv.innerHTML = resp.error;
					resultDiv.classList.add("error");
					return;
				}

				resultDiv.innerHTML = "Contact updated successfully";
				resultDiv.classList.add("success");

				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		resultDiv.innerHTML = "Error updating contact. Please try again.";
		resultDiv.classList.add("error");
	}
}

document.addEventListener('DOMContentLoaded', function() {
	let loginForm = document.getElementById('loginForm');
	if(loginForm)
	{
		loginForm.addEventListener('submit', function(e) {
			e.preventDefault();
			doLogin();
		});
	}
});
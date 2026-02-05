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
	
				window.location.href = "contacts.html"; //changed from contacts.html to color.html
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
	window.location.href = "register.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		
		if(tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if(tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if(tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}
	
	if(userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		let userNameElement = document.getElementById("userName");
		if(userNameElement)
		{
			userNameElement.innerHTML = firstName + " " + lastName;
		}
	}
}

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
	let contactName = document.getElementById("contactName").value;
	let contactPhone = document.getElementById("contactPhone").value;
	let contactEmail = document.getElementById("contactEmail").value;
	let resultDiv = document.getElementById("contactAddResult");
	
	resultDiv.innerHTML = "";
	resultDiv.className = "message-area";
	
	if(!contactName)
	{
		resultDiv.innerHTML = "Please enter a contact name";
		resultDiv.classList.add("error");
		return;
	}

	let tmp = {name:contactName, phone:contactPhone, email:contactEmail, userId:userId};
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
				resultDiv.innerHTML = "Contact added successfully";
				resultDiv.classList.add("success");
				document.getElementById("contactName").value = "";
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

	let url = urlBase + '/SearchContacts.' + extension;
	
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
					for(let i=0; i<jsonObject.results.length; i++)
					{
						contactList += jsonObject.results[i];
						if(i < jsonObject.results.length - 1)
						{
							contactList += "<br />\r\n";
						}
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

	let tmp = {id:contactId, userId:userId};
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
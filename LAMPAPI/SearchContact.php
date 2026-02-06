<?php
	// debug
	ini_set('display_errors', 1);
	error_reporting(E_ALL);

	// read JSON input
	$inData = getRequestInfo();
	
	// get userID from request (from login response)
	$userId = $inData["userId"];

	// get raw string from search (gets rid of leading/trailing spaces)
	$raw = trim($inData["search"]);

	// collapses multiple spaces inside the string into one
	$raw = preg_replace('/\s+/', ' ', $raw);

	// find position of first space (if it exists)
	$spacePos = strpos($raw, ' ');

	// connect to mySQL
	$conn = new mysqli("localhost", "admin", "12345", "COP4331");
	
	// if connection fail -> return error JSON
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}

	// CASE 1: Only first name (accepting prefixes)
	if($spacePos === false)
	{
		// build prefix
		$firstPrefix = $raw . "%";

		// search through first names
		$stmt = $conn->prepare(
			"SELECT ID, FirstName, LastName, Phone, Email
			FROM Contacts
			WHERE UserID=? AND FirstName LIKE ?"
		);

		// bind parameters
		$stmt->bind_param("is", $userId, $firstPrefix);

	}
	else
	{
		// CASE 2: User typed first + last name (prefix accepted)

		// extract first name from input
		$first = substr($raw,0,$spacePos);

		// extract last name
		$last = trim(substr($raw,$spacePos + 1));

		// build prefix match for first and last
		$firstPrefix = $first . "%";
		$lastPrefix = $last . "%";

		// prepare SQL for search
		$stmt = $conn->prepare(
			"SELECT ID, FirstName, LastName, Phone, Email
			FROM Contacts
			WHERE UserID=? AND FirstName LIKE ? AND LastName LIKE ?"
		);

		// Bind parameters: i=int userId, s=first prefix, s=last prefix
		$stmt->bind_param("iss", $userId,$firstPrefix, $lastPrefix);
	}

	// execute query
	$stmt->execute();

	//get query results
	$result = $stmt->get_result();

	// results put into array
	$contacts = [];
	while ($row = $result->fetch_assoc())
	{
		$contacts[] = $row;
	}

	//clean up
	$stmt->close();
	$conn->close();

	//return results as JSON
	echo json_encode([
		"results" => $contacts,
		"error" => ""
	]);

	// ---------- Helper Functions ----------

	// read JSON request body into an associative array
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// return consistent error JSON
	function returnWithError($err)
	{
		echo json_encode([
			"results" => [],
			"error" => $err
		]);
		exit();
	}
	
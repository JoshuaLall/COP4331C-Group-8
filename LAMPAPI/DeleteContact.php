<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // read JSON body into associative array
    $inData = getRequestInfo();

    if ($inData == null) {
    returnWithError("Invalid JSON");
    }
    if (!isset($inData["contactId"], $inData["userId"])) {
        returnWithError("Missing contactId or userId");
    }

    // pull fields from JSON
    $contactId = $inData["contactId"];
	$userId    = $inData["userId"];

    //Connect to mySQL
    $conn = new mysqli("142.93.73.245", "admin", "12345678Ab", "COP4331");

    // if DB connection fails, return error JSON and stop
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}

    // delete only where (ID matches) AND (UserID matches).
	$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");

    // bind params: "ii" = integer contactId, integer userId
	$stmt->bind_param("ii", $contactId, $userId);

	// execute delete
	$stmt->execute();

	// If no rows affected, contact not found
	if ($stmt->affected_rows == 0)
	{
		$stmt->close();
		$conn->close();
		returnWithError("No contact deleted (not found)");
	}

	// cleanup
	$stmt->close();
	$conn->close();

	// success
	returnWithError("");

	// ------------ Helpers ------------ 

	// read JSON request body
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// send JSON with Content-Type header
	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	// return consistent error response
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
		exit();
	}

<?php
	ini_set('display_errors', 1);
	error_reporting(E_ALL);
	
	// read JSON body
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email     = $inData["email"];
	$userId    = $inData["userId"];

	$conn = new mysqli("localhost", "admin", "12345", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts(FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
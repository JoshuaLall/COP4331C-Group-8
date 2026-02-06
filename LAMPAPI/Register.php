<?php
    // debug
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    // read JSON input
    $inData = getRequestInfo();

    // pull fields from request JSON
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    // connect to mySQL
    $conn = new mysqli("localhost", "admin", "12345", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }

    // 1) check login already exists
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
    $stmt->bind_param("s",$login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->fetch_assoc())
    {
        //login taken
        $stmt->close();
        $conn->close();
        returnWithError("Login already exists");
    }

    // cleanup after check
    $stmt->close();

    // 2) insert the new user
    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");
    $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
    $stmt->execute();

    // grab the new user id
    $newId = $conn->insert_id;

    // cleanup
    $stmt->close();
    $conn->close();

    // return success info
    returnWithInfo($firstName, $lastName, $newId);

    // --------- Helper Functions ---------

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
        exit();
    }

    function returnWithInfo($firstName, $lastName, $id)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson($retValue);
        exit();
    }


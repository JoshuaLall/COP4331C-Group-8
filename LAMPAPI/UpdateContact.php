<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();
if ($inData == null) returnWithError("Invalid JSON");
if (!isset($inData["contactId"], $inData["userId"])) returnWithError("Missing contactId or userId");

$contactId = (int)$inData["contactId"];
$userId    = (int)$inData["userId"];

// optional fields
$fields = [];
$params = [];
$types  = "";

// helper to add field if present (even if empty string)
function addField(&$fields, &$params, &$types, $inData, $key, $sqlCol, $typeChar)
{
    if (array_key_exists($key, $inData)) {
        $fields[] = "$sqlCol=?";
        $params[] = $inData[$key];
        $types   .= $typeChar;
    }
}

addField($fields, $params, $types, $inData, "firstName", "FirstName", "s");
addField($fields, $params, $types, $inData, "lastName",  "LastName",  "s");
addField($fields, $params, $types, $inData, "phone",     "Phone",     "s");
addField($fields, $params, $types, $inData, "email",     "Email",     "s");

if (count($fields) == 0) returnWithError("No fields to update");

$conn = new mysqli("142.93.73.245", "admin", "12345678Ab", "COP4331");
if ($conn->connect_error) returnWithError($conn->connect_error);

$sql = "UPDATE Contacts SET " . implode(", ", $fields) . " WHERE ID=? AND UserID=?";
$stmt = $conn->prepare($sql);
if (!$stmt) returnWithError($conn->error);

// add WHERE params
$params[] = $contactId;
$params[] = $userId;
$types   .= "ii";

// bind dynamically
$stmt->bind_param($types, ...$params);

$stmt->execute();

if ($stmt->affected_rows == 0) {
    $stmt->close();
    $conn->close();
    returnWithError("No contact updated (not found or no changes)");
}

$stmt->close();
$conn->close();
sendResultInfoAsJson('{"error":""}');

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
    sendResultInfoAsJson('{"error":"' . $err . '"}');
    exit();
}
?>

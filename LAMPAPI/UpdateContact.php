<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-type: application/json');
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);


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
        $types .= $typeChar;
    }
}

addField($fields, $params, $types, $inData, "firstName", "FirstName", "s");
addField($fields, $params, $types, $inData, "lastName",  "LastName",  "s");
addField($fields, $params, $types, $inData, "phone",     "Phone",     "s");
addField($fields, $params, $types, $inData, "email",     "Email",     "s");

if (count($fields) == 0) returnWithError("No fields to update");

try
{
    $conn = new mysqli("localhost", "admin", "12345", "COP4331");
    $conn->set_charset("utf8mb4");

    // add WHERE params
    $params[] = $contactId;
    $params[] = $userId;
    $types   .= "ii";

    $sql = "UPDATE Contacts SET " . implode(", ", $fields) . " WHERE ID=? AND UserID=?";
    $stmt = $conn->prepare($sql);

    // bind dynamically (must be references)
    $bindNames = [];
    $bindNames[] = $types;
    for ($i = 0; $i < count($params); $i++)
    {
        $bindNames[] = &$params[$i];
    }
    call_user_func_array([$stmt, 'bind_param'], $bindNames);

    $stmt->execute();

    $stmt->close();
    $conn->close();

    sendResultInfoAsJson('{"error":""}');
    exit();
}
catch (Throwable $e)
{
    returnWithError($e->getMessage());
}


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

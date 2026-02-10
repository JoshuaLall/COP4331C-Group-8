<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json');
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$inData = getRequestInfo();
if ($inData == null) returnWithError("Invalid JSON");
if (!isset($inData["contactId"], $inData["userId"])) returnWithError("Missing contactId or userId");

$contactId = (int)$inData["contactId"];
$userId    = (int)$inData["userId"];

try
{
    $conn = new mysqli("localhost", "admin", "12345", "COP4331");
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
    $stmt->bind_param("ii", $contactId, $userId);
    $stmt->execute();

    if ($stmt->affected_rows == 0)
    {
        $stmt->close();
        $conn->close();
        returnWithError("No contact deleted (not found)");
    }

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

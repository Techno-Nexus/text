<?php
session_start();

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "food_app_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn && $conn->connect_error) {
    $conn = null;
}
?>
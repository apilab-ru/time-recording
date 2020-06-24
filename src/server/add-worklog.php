<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, POST, GET, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: *");

$data = file_get_contents('php://input');
if ($data) {
  $data = json_decode($data, 1);
}

$send = $data['send'];
$task = $data['task'];
$cred = $data['cred'];

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => $cred['domain'] . "/rest/api/2/issue/". $task ."/worklog?adjustEstimate=AUTO",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode($send),
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Authorization: Basic " . base64_encode($cred['login'] . ":" . $cred['password']),
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;

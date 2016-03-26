<?php

$post = json_decode(file_get_contents('php://input'), true);
//die(print_r($post));
$db = new SQLite3('DB.sqlite3');
$db->exec('begin');
$success = true;

foreach($post as $q){
	$stmt = $db->prepare($q['query']);
	
	foreach($q['params'] as $p){
		$stmt->bindValue(
			':'.$p['key'], 
			$p['value']
			//$p['type'] == '' ? SQLITE3_STRING : $p['type']
		);
	}
	$result = $stmt->execute();
	$errorCode = $db->lastErrorCode();
	$errorMsg = $db->lastErrorMsg();
	if($errorCode > 0 && $errorCode < 100){
		$success = false;
		$db.exec('rollback');
		break;
	}
}

$success && $db->exec('commit');

$res = array();
while($row = $result->fetchArray(SQLITE3_ASSOC)){
	$res[] = $row;
}


$resp = array(
	'errorCode' => $errorCode,
	'errorText'  => $errorMsg,
	'changes' => $db->changes(),
	'lastInsertId' => $db->lastInsertRowID(),
	'result' => $res
);


echo json_encode($resp);

$db->close();

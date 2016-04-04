<?php
error_reporting(E_NOTICE);

if(empty($_POST)){
	// workaround angulars odd post header
	$post = json_decode(file_get_contents('php://input'), true);
}else{
	$post = $_POST;
}
//echo json_encode($post);
$db = new SQLite3('DB.sqlite3');

$db->exec('begin');

$success = true;

$types = array(
	'' => SQLITE3_TEXT,			// default
	'string' => SQLITE3_TEXT,
	'float' => SQLITE3_FLOAT,
	'int' => SQLITE3_INTEGER,
	//'real' => SQLITE3_REAL,
	'null' => SQLITE3_NULL
);

foreach($post as $q){
	
	//$stmt = $db->prepare("select * from projects where id=:id;");
	//$stmt->bindValue(':id', 1);
	
	$stmt = $db->prepare($q['query']);
	
	foreach($q['params'] as $p){
		$stmt->bindValue(
			':'.$p['key'], 
			$p['value'],
			isset($types[$p['type']]) ? $types[$p['type']] : SQLITE3_STRING
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
	'error' => $errorCode,
	'errorText'  => $errorMsg,
	'changes' => $db->changes(),
	'lastInsertId' => $db->lastInsertRowID(),
	'result' => $res
);

echo json_encode($resp);

$db->close();

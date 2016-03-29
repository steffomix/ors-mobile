<?php
if(empty($_POST)){
	// workaround angulars odd post header
	$post = json_decode(file_get_contents('php://input'), true);
}else{
	$post = $_POST;
}

$db = new PDO('sqlite:DB.sqlite3');
$db->exec('begin');

$success = true;


$types = array(
	'' => SQLITE3_TEXT,			// default
	'string' => SQLITE3_TEXT,
	'float' => SQLITE3_FLOAT,
	'int' => SQLITE3_INT,
	'real' => SQLITE3_REAL,
	'null' => SQLITE3_NULL
);

foreach($post as $q){
	$stmt = $db->prepare($q['query']);
	
	foreach($q['params'] as $p){
		$stmt->bindParam(
			':'.$p['key'], 
			$p['value']//,
			//isset($types[$p['type']]) ? $types[$p['type']] : SQLITE3_STRING
		);
	}
	$result = $stmt->execute();
	
	$errorCode = 0;//$db->lastErrorCode();
	$errorMsg = 0;//$db->lastErrorMsg();
	if($errorCode > 0 /*&& $errorCode < 100*/){
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
	'errors' => $errorCode,
	'errorText'  => $errorMsg,
	'warnings' => $warnings,
	'changes' => $db->changes(),
	'lastInsertId' => $db->lastInsertRowID(),
	'result' => $res
);

echo json_encode($resp);

$db->close();

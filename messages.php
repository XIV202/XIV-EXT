<?php

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $messages = file_get_contents('messages.txt');
    header('Content-Type: application/json');
    echo $messages;
} elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
    $data = file_get_contents('php://input');
    $newMessage = json_decode($data, true)['message'];
    
    $currentMessages = file_get_contents('messages.txt');
    $messagesArray = json_decode($currentMessages, true);
    
    if($messagesArray === null){
        $messagesArray = [];
    }
    
    $messagesArray[] = $newMessage;
    
    file_put_contents('messages.txt', json_encode($messagesArray));
    echo "Сообщение сохранено успешно";
}

?>

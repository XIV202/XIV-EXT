<?php

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $messages = file_get_contents('messages.txt');
    header('Content-Type: application/json');
    echo $messages;
} elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
    $newMessage = $_POST['message'] . PHP_EOL; // Добавляем PHP_EOL для переноса строки
    
    file_put_contents('messages.txt', $newMessage, FILE_APPEND); // Записываем новое сообщение
    
    echo "Сообщение сохранено успешно";
}

?>

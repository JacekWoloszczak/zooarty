
<?php
header('Content-Type: application/json');

// 1. Dane z formularza
$name    = $_POST['name']    ?? '';
$email   = $_POST['email']   ?? '';
$message = $_POST['message'] ?? '';



// 2. Sprawdzenie pustych pól
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(["status" => "error", "message" => "Wszystkie pola są wymagane."]);
    exit;
}



// 3. Sprawdzenie wyniku

    // 5. Wyślij e-mail
    $to = "zooart24@protonmail.com";
    $subject = "Nowa wiadomość z formularza kontaktowego";
    $body = "Imię: $name\nE-mail: $email\nWiadomość:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["status" => "success", "message" => "Wiadomość została wysłana pomyślnie."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Błąd podczas wysyłania wiadomości."]);
    }

?>
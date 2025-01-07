<?php
$filePath = './views/assets/api_ip.txt';

if (file_exists($filePath)) {
    $clave = file_get_contents($filePath);
    echo $clave;
} else {
    echo 'El archivo no se encuentra disponible';
}

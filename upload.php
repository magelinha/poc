<?php 
	$pasta = "img/background-image/";
	$extensoes = array(".jpg",".jpeg",".png");

	if(isset($_GET['arquivo'])) {
		foreach ($_FILES as $item) {
			$nome_imagem = $item['name'];
			/* pega a extensão do arquivo */ 
			$ext = strtolower(strrchr($nome_imagem,".")); 

			if(in_array($ext, $extensoes)){
				
				if(move_uploaded_file($item['tmp_name'], $pasta.'poc-background-image'.$ext)){
					echo json_encode(array('success' => true, 'imagem' => $pasta.'poc-background-image'.$ext, 'mensagem' => 'ok'));
				}else{
					echo json_encode(array('success' => false, 'imagem' => '', 'mensagem' => 'Erro ao fazer upload.'));
				}
			}else echo json_encode(array('success' => false, 'imagem' => '', 'mensagem' => 'Extensões permitidas são PNG e JPG.')); 	
		}
		
	} else echo json_encode(array('success' => false, 'imagem' => '', 'mensagem' => 'Selecione uma imagem'));

?>
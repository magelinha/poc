<?php 
	
	$pasta = "img/miniaturas/";;
	$extensoes = array(".jpg",".jpeg",".png");
	$excluiu = "";
	$imagens = array();

	if(isset($_GET['arquivo'])) {
		foreach ($_FILES as $item) {
			$nome_imagem = $item['name'];
			/* pega a extensão do arquivo */ 
			$ext = strtolower(strrchr($nome_imagem,".")); 

			if(in_array($ext, $extensoes)){
				
				if(move_uploaded_file($item['tmp_name'], $pasta.$nome_imagem)){
					array_push($imagens, $pasta.$nome_imagem);
				}else{
					echo json_encode(array('success' => false, 'imagem' => '', 'mensagem' => 'Erro ao fazer upload.'));
					return;
				}
			}else {
				echo json_encode(array('success' => false, 'imagem' => '', 'mensagem' => 'Extensões permitidas são PNG e JPG.')); 
				return;
			}
		}

		echo json_encode(array('success' => true, 'imagem' => $imagens, 'mensagem' => 'ok'));
		return;
		
	} else echo json_encode(array('success' => false, 'imagem' => '', 'mensagem' => 'Selecione uma imagem'));	


?>
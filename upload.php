<?php 
	
	
	$pasta = "img/background-image/";
	$extensoes = array(".jpg",".jpeg",".png");
	$excluiu = "";


	if(isset($_GET['arquivo'])) {
		foreach ($_FILES as $item) {
			$nome_imagem = $item['name'];
			/* pega a extensão do arquivo */ 
			$ext = strtolower(strrchr($nome_imagem,".")); 

			if(in_array($ext, $extensoes)){
				$atual = "page";
				
				//exclui antes de copiar, para que nao tenha page.png e page.jpg
				if(file_exists($pasta.$atual.".png") && unlink($pasta.$atual.".png")) $excluiu = $pasta.$atual.".png";
				if(file_exists($pasta.$atual.".jpg") && unlink($pasta.$atual.".jpg")) $excluiu = $pasta.$atual.".jpg";
				if(file_exists($pasta.$atual.".jpeg")&& unlink($pasta.$atual.".jpeg"))$excluiu = $pasta.$atual.".jpeg";

				clearstatcache();  //exclui o cache


				if(move_uploaded_file($item['tmp_name'], $pasta.$atual.$ext)){
					echo json_encode(array('success' => true, 'imagem' => $pasta.$atual.$ext, 'mensagem' => 'ok', 'excluiu' => $excluiu));
				}else{
					echo json_encode(array('success' => false, 'imagem' => '', 'mensagem' => 'Erro ao fazer upload.', 'excluiu' => $excluiu));
				}
			}else echo json_encode(array('success' => false, 'imagem' => '', 'mensagem' => 'Extensões permitidas são PNG e JPG.', 'excluiu' => $excluiu)); 	
		}
		
	} else echo json_encode(array('success' => false, 'imagem' => '', 'mensagem' => 'Selecione uma imagem', 'excluiu' => $excluiu));


?>
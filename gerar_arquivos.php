<?php 
	function criarArquivosHtml($paginas, $base){
		foreach ($paginas as $pagina) {
			//se for um link com filhos, cria-se uma pasta com seu nome
			if($pagina['isLink'] == 'true' && !empty($pagina['children'])){
				mkdir($base.'/'.$pagina['nome'], 0777, true);
				criarArquivosHtml($pagina['children'], $base.'/'.$pagina['nome']);
			}else if($pagina['isLink'] == 'false'){
				$file = fopen($base.'/'.$pagina['nome'].'.html', 'w'); //cria o novo arquivo
				fwrite($file, $pagina['html']); //coloca o html no arquivo
				fclose($file); //fecha o arquivo
			}
		}
	}

	/*
		$source = Local onde estão os arquivos a serem copiados
		$dest = Local onde os arquivos serão inseridos
	*/
	function copiarImagens($source, $dest){
		$dir = opendir($source);

		while(false !== ($file == readdir($dir))){
			echo $file;
			//se não for um acesso a diretorios acima, copia o arquivo
			if(($file != '.') && ($file != '..')){

				copy($source.'/'.$file, $dest.'/'.$file);
			}
		}

		closedir($dir);
	}

	$css = $_POST['css'];
	$arquivos = $_POST['arquivos'];

	//cria as pastas
	if(!file_exists('build/css')) mkdir('build/css', 0777, true);
	if(!file_exists('build/js')) mkdir('build/js', 0777, true);
	if(!file_exists('build/img')) mkdir('build/img', 0777, true);
	if(!file_exists('build/img/texturas')) mkdir('build/img/texturas', 0777, true);

	//faz a cópia das imagens que estão na biblioteca
	copiarImagens('img/biblioteca', 'build/img');
	copiarImagens('img/texturas', 'build/img/texturas');

	//faz a cópia dos arquivos necessários para o funcionando do js e css
	copy('img/logolinked.png', 'build/img/logolinked.png'); 
	copy('base.css', 'build/css/base.css'); //css básico das páginas
	copy('js/jquery.zaccordion.min.js', 'build/js/jquery.zaccordion.min.js'); //slideshow com zaccordion
	copy('js/ekko-lightbox.min.js', 'build/js/ekko-lightbox.min.js'); //galeria de imagens com ekko lightbox

	//escrevo no arquivo css
	$conteudo_css = file_get_contents('build/css/base.css');
	$css .= $conteudo_css;
	file_put_contents('build/css/base.css', $css);

	criarArquivosHtml($arquivos, 'build');
	echo json_encode('ok');

?>
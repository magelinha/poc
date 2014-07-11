<?php 
	function criarArquivosXML($paginas, $base){
		foreach ($paginas as $pagina) {
			//se for um link com filhos, cria-se uma pasta com seu nome
			if($pagina['isLink'] == 'true' && !empty($pagina['children'])){
				mkdir($base.'/'.$pagina['nome'], 0777, true);
				criarArquivosXML($pagina['children'], $base.'/'.$pagina['nome']);
			}else if($pagina['isLink'] == 'false'){
				$file = fopen($base.'/'.$pagina['nome'], 'w'); //cria o novo arquivo
				fwrite($file, $pagina['html']); //coloca o html no arquivo
				fclose($file); //fecha o arquivo
			}
		}
	}

	$css = $_POST['css'];
	$arquivos = $_POST['arquivos'];

	//cria as pastas
	if(!file_exists('build/css')) mkdir('build/css', 0777, true);
	if(!file_exists('build/js')) mkdir('build/js', 0777, true);

	//faz a cópia dos arquivos necessários para o funcionando do js e css
	copy('base.css', 'build/css/base.css'); //css básico das páginas
	copy('js/jquery.zaccordion.min.js', 'build/js/jquery.zaccordion.min.js'); //slideshow com zaccordion
	copy('js/ekko-lightbox.min.js', 'build/js/ekko-lightbox.min.js'); //galeria de imagens com ekko lightbox

	//escrevo no arquivo css
	$conteudo_css = file_get_contents('build/css/base.css');
	$css .= $conteudo_css;
	file_put_contents('build/css/base.css', $css);

	criarArquivosXML($arquivos, 'build');
	echo json_encode('ok');

?>
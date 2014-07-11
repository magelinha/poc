<?php 
	
	$css = $_POST['css'];
	$pagina = $_POST['pagina'];

	//cria as pastas
	if(!file_exists('build/css')) mkdir('build/css', 0777, true);
	if(!file_exists('build/js')) mkdir('build/js', 0777, true);

	//faz a cópia dos arquivos necessários para o funcionando do js e css
	copy('base.css', 'build/css/base.css'); //css básico das páginas
	copy('css/ekko-lightbox.min.css', 'build/css/ekko-lightbox.min.css'); //css do lightbox
	
	copy('js/jquery.zaccordion.min.js', 'build/js/jquery.zaccordion.min.js'); //slideshow com zaccordion
	copy('js/ekko-lightbox.min.js', 'build/js/ekko-lightbox.min.js'); //galeria de imagens com ekko lightbox
	copy('js/classie.js', 'build/js/classie.js');
	copy('js/cbpAnimatedHeader.js', 'build/js/cbpAnimatedHeader.js');
	copy('base.js', 'build/js/base.js');

	//escrevo no arquivo css
	$conteudo_css = file_get_contents('build/css/base.css');
	$css .= $conteudo_css;
	file_put_contents('build/css/base.css', $css);

	$file = fopen('build/index.html', 'w'); //cria o novo arquivo
	fwrite($file, $pagina['html']); //coloca o html no arquivo
	fclose($file); //fecha o arquivo

	echo json_encode('ok');

?>
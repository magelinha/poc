/** VARIAVEIS GLOBAIS **/ 
var componentes_basicos = []; //componentes da ferramenta
var componentes = []; //todos os componentes que forem adicionados ficarão nesse local
var layouts = []; //layout disponíveis, caso a escolha seja estilo livre
var paginas = []; //paginas criadas pelo usuário, incluindo a Home
var formularios = [];
var headerStyle = [];
var pageStyle = [];
var tipoAccount = [];
var formPopover = [];

var lastId = 1;
var elementoAtual;
var objetoAtual;
var botaoAtual;
var template = 0;
var tipoPagina = 0;

var paginaAtual = new Object();
var opcaoAtual;

var componentes_fixos = new Object();
var background = {
	/*
		tipo de plano de fundo:
		0 = cor
		1 = textura
		2 = imagem
	*/
	tipo: 0,
	valor: "#fff" //padrão é branco;
}

var alterarPagina = 0;
var summernote;
var listaMapas = [];
var listaSlideshow = [];

var alterarGaleria = false;
var idGaleria = -1;
var onePage = false; //verifica se a página é do estilo página única 
//array com as fontes importadas do google, ou as mais usadas no windows
var fonts = [
	{nome: 'Source Sans Pro',		familia: "'Source Sans Pro', sans-serif"},
	{nome: 'Droid Sans',			familia: "'Droid Sans', sans-serif"},
	{nome: 'Lato',					familia: "'Lato', sans-serif"},
	{nome: 'PT Sans',				familia: "'PT Sans', sans-serif"},
	{nome: 'Ubuntu',				familia: "'Ubuntu', sans-serif"},
	{nome: 'Open Sans',				familia: "'Open Sans', sans-serif"},
	{nome: 'Roboto',				familia: "'Roboto', sans-serif"},
	{nome: 'Oswald',				familia: "'Oswald', sans-serif"},
	{nome: 'Open Sans Condensed',	familia: "'Open Sans Condensed', sans-serif"},
	{nome: 'Roboto Condensed',		familia: "'Roboto Condensed', sans-serif"},
	{nome: 'Montserrat',			familia: "'Montserrat', sans-serif"},
	{nome: 'Arial',					familia: "'Arial', sans-serif"},
	{nome: 'Tahoma',				familia: "'Tahoma', sans-serif"},
	{nome: 'Verdana',				familia: "'Verdana', sans-serif"}
];

var larguraColunas = [
	[
		'6-6',
		'10-2',
		'2-10',
		'8-4',
		'4-8',
		'3-9',
		'9-3'
	],

	[
		'4-4-4',
		'8-2-2',
		'2-8-2',
		'2-2-8',
		'2-5-5',
		'5-2-5',
		'5-5-2'
	],

	[
		'3-3-3-3',
		'6-2-2-2',
		'2-6-2-2',
		'2-2-6-2',
		'2-2-2-6',
		'4-4-2-2',
		'4-2-4-2',
		'4-2-2-4',
		'2-4-4-2',
		'2-4-2-4',
		'2-2-4-4'
	]
];

/** FIM VARIAVEIS GLOBAIS **/

/** CARREGAMENTOS OS XMLS **/

/** adiciona o eventos de arrastar à todos os componentes **/ 
function getComponent(nome){
	for(i=0; i<componentes_basicos.length; i++){
		if(componentes_basicos[i].nome === nome) return componentes_basicos[i].html;
	}

	return "";
}


/* pega o formulario de propriedades de todos os componentes*/ 
function getFormulario(nome){
	for(i=0; i<formularios.length; i++){
		if(formularios[i].nome === nome) return formularios[i].html;
	}

	return "";
}

/* pega o estilo para o cabeçalho*/ 
function getHeaderStyle(nome){
	for(i=0; i<headerStyle.length; i++){
		if(headerStyle[i].nome === nome) return headerStyle[i].html;
	}

	return "";
}

function getPageStyle(nome){
	for(i=0; i<pageStyle.length; i++){
		if(pageStyle[i].nome === nome) return pageStyle[i].html;
	}

	return "";
}

function getFormPopover(nome){
	for(i=0; i<formPopover.length; i++){
		if(formPopover[i].nome === nome) return formPopover[i].html;
	}

	return "";
}

/** Faz a leitura de todos os componentes contidos no arquivo xml **/
function readXml(){
	
	$.ajax({
		type: "GET",
		url: "componentes_basicos.xml",
		dataType: "xml",
		success: function(xml){
			$(xml).find("componente").each(function(){
				var obj = new Object();
				obj.nome = $(this).find("nome").text();
				obj.html = $(this).find("html").text();

				componentes_basicos.push(obj);
			});
		}

	});

	$.ajax({
		type: "GET",
		url: "layouts.xml",
		dataType: "xml",
		success: function(xml){
			$(xml).find("layout").each(function(){
				var obj = new Object();
				obj.nome = $(this).find("nome").text();
				obj.html = $(this).find("html").text();

				layouts.push(obj);
			});
		}

	});

	$.ajax({
		type: "GET",
		url: "formularios.xml",
		dataType: "xml",
		success: function(xml){
			$(xml).find("formulario").each(function(){
				var obj = new Object();
				obj.nome = $(this).find("nome").text();
				obj.html = $(this).find("html").text();

				formularios.push(obj);
			});
		}

	});

	$.ajax({
		type: "GET",
		url: "header_styles.xml",
		dataType: "xml",
		success: function(xml){
			$(xml).find("headerStyle").each(function(){
				var obj = new Object();
				obj.nome = $(this).find("nome").text();
				obj.html = $(this).find("html").text();

				headerStyle.push(obj);
			});
		}

	});

	$.ajax({
		type: "GET",
		url: "account.xml",
		dataType: "xml",
		success: function(xml){
			$(xml).find("tipo").each(function(){
				var obj = new Object();
				obj.nome = $(this).find("nome").text();
				obj.html = $(this).find("html").text();

				tipoAccount.push(obj);
			});
		}

	});

	$.ajax({
		type: "GET",
		url: "content_styles.xml",
		dataType: "xml",
		success: function(xml){
			$(xml).find("contentStyle").each(function(){
				var obj = new Object();
				obj.nome = $(this).find("nome").text();
				obj.html = $(this).find("html").text();

				pageStyle.push(obj);
			});
		}

	});

	$.ajax({
		type: "GET",
		url: "formulario-popover.xml",
		dataType: "xml",
		success: function(xml){
			$(xml).find("formulario").each(function(){
				var obj = new Object();
				obj.nome = $(this).find("nome").text();
				obj.html = $(this).find("html").text();

				formPopover.push(obj);
			});
		}

	});
}
/** FIM CARREGAMENTO DOS XMLS **/


/** CONFIGURAÇÕES INICIAIS DA FERRAMENTA DE PROTOTIPAÇÃO **/

//upload de imagens
$(document).on('click', '.poc-btn-confirmar-upload', function(e){
	e.preventDefault();
	var botao = $(this);
	var campoFile = botao.parents('.form-group').find('input[type="file"]'); //pega o botão que contem os arquivos;
	var selectImagens = botao.parents('.modal-body').find('#poc-lista-imagens-biblioteca'); //select com a lista de imagens
	var imagensSelecionadas = campoFile[0].files;
	console.log(imagensSelecionadas);

	//verifica se tem algum arquivo selecionado
	if(campoFile.val() == ''){
		alert('Nenhuma imagem selecionada');
		return false;
	}

	var valor = new FormData();
	$.each(imagensSelecionadas, function(chave, item){
		valor.append(chave, item);
	});
	
	$.ajax({
		url: 'upload.php',
		type: 'POST',
		dataType: 'JSON',
		data: valor,
		processData: false,
		contentType: false,
		cache: false,

		success: function(data){

			if(data.success){
				preencherSelectBiblioteca(selectImagens);
			}else{
				alert('ERRO: ' + data.mensagem);
			}
		}
	});
});

//remove a função de arrastar dos links de propriedades
$(document).on('dragstart', function(e){
	if(e.target.tagName.toLowerCase() === "a") return false;
})


/** pega todos os itens do menu que são arrastáveis e insere o efeito de arraste (drag)**/
function addDraggableToComponents(){
	$(".componente-arrastavel").each(function(index, value){
		var data = componentes_basicos[index].html;
		var iframe = '';
		if(index < 4){
			$(this).draggable({
				revert: 'invalid',
				cursor: "move",
				iframeFix: true,
				connectToSortable: "#poc-header,#poc-content,#poc-footer,.poc-content, .poc-header-centralizado, .poc-content-centralizado, .poc-footer-centralizado",
				cursorAt: {left: 40, top: 25},
				helper: function(event){
					return $(data).css('width', '800px').css('min-height', '300px');
				}

			}).disableSelection();
		}else{
			if($(data).find('iframe').length > 0) iframe = '<img src="http://img.youtube.com/vi/g8PLcfyjaZw/0.jpg" alt="Linked EJ">';
			$(this).draggable({
				revert: function(receive){
					if(receive === false){
						alert('Os componentes estáticos, dinâmicos e API das Redes Sociais só podem ser arrastados para blocos.');
						return true;
					}

					return false;
				},
				cursor: "move",
				iframeFix: true,
				connectToSortable: '.coluna',
				cursorAt: {left: 40, top: 25},
				helper: function(event){
					if(iframe.length > 0) return $(iframe).css('width', '800px').css('min-height', '300px');
					return $(data).css('width', '800px').css('min-height', '300px');
				}
			}).disableSelection();
		}
	});
	
}

function addSortableToComponents(){
	//indica que os itens em poc-page podem ser ordenados, mas unico item arrastavel é #poc-menu. (ok)
	$('#poc-page').sortable({
		revert: true,
		helper: 'clone',
		handle: '.mover-componente',
		connectWith: '.coluna',
		cursorAt: {top: 3, left:3},
		placeholder: 'poc-placeholder',
		
		start: function(event, ui){
			ui.item.toggleClass('poc-placeholder');
		},

		stop: function(event,ui){
			ui.item.toggleClass('poc-placeholder');
			salvarAlteracoesSite();
		}
	});

	//os itens dentro de uma coluna podem ser ordenados, mas so podem ser enviados para a mesma coluna ou outra coluna
	$('.coluna').sortable({
		revert: true,
		helper: 'clone',
		handle: '.mover-componente',
		connectWith: '.coluna, #poc-page',
		items: '.previa, .poc-componente, #poc-menu',
		cursorAt: {top: 3, left:3},
		placeholder: 'poc-placeholder',

		start: function(e, ui){
			ui.item.toggleClass('poc-placeholder');	
			var item = ui.item[0].classList;

			for(var i=0; i<item.length; i++) {
				if(item[i] === 'link-propriedades') return;
			}

			//pega o nome da penultima classe do objeto
			var nome = item[item.length-3];
			
			elementoAtual = getComponent(nome);
			//if(!elementoAtual) elementoAtual = ui.helper[0].outerHTML.toString();

		},

		stop: function(event, ui){
			ui.item.toggleClass('poc-placeholder');
			if(elementoAtual.length > 0){
				ui.item.replaceWith(elementoAtual).removeAttr('style');
			
				//addDraggableToComponents();
				addSortableToComponents(); //informa quais elementos podem receber outros elementos
				addSidrToComponents(); //adciona os formularios de propriedades	
				criarMapa();

				FB.XFBML.parse();
				twttr.widgets.load();
			}
			
			salvarAlteracoesSite();

		}
	});


	//
	$('#poc-header, #poc-content, .poc-content, #poc-footer, .poc-header-centralizado, .poc-content-centralizado, .poc-footer-centralizado').sortable({
		revert: true,
		helper: 'clone',
		handle: '.mover-componente',
		items: '.previa',
		placeholder: 'poc-placeholder',

		start: function(e, ui){
			ui.item.toggleClass('poc-placeholder');

			var item = ui.item[0].classList;

			for(var i=0; i<item.length; i++) {
				if(item[i] === 'link-propriedades') return;
			}

			//pega o nome da penultima classe do objeto
			var nome = item[item.length-3];
			
			elementoAtual = getComponent(nome);
			//if(!elementoAtual) elementoAtual = ui.helper[0].outerHTML.toString();

		},

		stop: function(event, ui){
			ui.item.toggleClass('poc-placeholder');
			if(elementoAtual.length > 0){
				ui.item.replaceWith(elementoAtual).removeAttr('style');
			
				//addDraggableToComponents();
				addSortableToComponents(); //informa quais elementos podem receber outros elementos
				addSidrToComponents(); //adciona os formularios de propriedades	
				criarMapa();
			}
			
			salvarAlteracoesSite();
		}

	});

}

function removeStyle(el){	
	el.removeAttr('style');
}

function startCarousel(){
	$(".carousel").carousel({
		interval: 3000,
		wrap: true
	});
}

function addColorPicker(){
	$("#background-color").minicolors({
		defaultValue: "#ffffff",
		position: 'bottom right',
		change: function(hex, opacity){
			objetoAtual.css('background', hex);
			background.valor = hex;
		},

		theme: 'bootstrap'

	});

	$("#menu-background-color").minicolors({
		defaultValue: '#f8f8f8',
		position: 'bottom right',
		change: function(hex, opacity){
			$('.poc-navbar').css('background', hex);
			background.valor = hex;
		},

		theme: 'bootstrap'
	});

	$("#menu-font-color").minicolors({
		defaultValue: '#777',
		position: 'bottom right',
		change: function(hex, opacity){
			$('.poc-navbar a').css('color', hex);
			background.valor = hex;
		},

		theme: 'bootstrap'
	});

	$('#poc-form-propriedades-categoria-blog #poc-categoria-blog-cor-titulos').minicolors({
		defaultValue: $(".poc-navbar").css('color'),
		position: 'bottom right',
		change: function(hex, opacity){
			objetoAtual.find('h4').css('color', hex);
		},

		theme: 'bootstrap'
	});

	$('#poc-form-propriedades-titulo #poc-titulo-cor').minicolors({
		defaultValue: '#000',
		position: 'bottom right',
		change: function(hex, opacity){
			objetoAtual.find('.poc-titulo').css('color', hex);
		},

		theme: 'bootstrap'
	});

	$('#poc-header-border-color, #poc-conteudo-border-color, #poc-rodape-border-color').minicolors({
		defaultValue: '#000000',
		position: 'bottom right',
		change: function(hex, opacity){
			$('#poc-form-propriedades-header #poc-cabecalho-border-style').change();
		},

		theme: 'bootstrap'
	});
}

function startwysiwyg(){
	$("#poc-alterar-texto").summernote({
		Height: 600,
		minHeight: 600,
		maxheight: 600,  
		lang: 'pt-BR',
		focus: true, 
	});

	objetoAtual.find('.poc-texto').each(function(){
		summernote = $(this).html();
	});
}

function addSidrToComponents(){
	$(".link-propriedades").each(function(i, el){
		
		var prop = $(el).data('prop');

		//if($("#sidr-propriedade-" + prop).length == 0){
			$(el).sidr({
				name: "sidr-propriedade" + "-" + prop,
				side: 'right',
				source: function(name){
					//caso o formulário já exista, não faz 'nada'
					var form = $('#sidr-propriedade-'+prop);
					if(form.html().trim() != '') return //form.html();

					//pega o formulário do xml
					return "<h1>Propriedades</h1>" + getFormulario(prop);
				},
				renaming: true

			});		
		//}
	});

	addColorPicker();
	addFontsToSelect(); //adiciona as possíveis fontes ao formulario
	addBoxTexturas();
}


function addBotaoPropriedade(content, id){
	//#prop-'+id+'

	var html = '<a id="prop-'+id+'" data-prop="'+id+'" href="#" class="btn btn-primary btn-xs link-propriedades link-propriedades-'+id+'">' +
					'<span class="glyphicon glyphicon-cog"></span>'+
				'</a>';
	var botoes = $('<div />').addClass('col-md-12 grupo-btn-propriedades').append(html);
	var linha = '<div class="row poc-linha"></div>';
	$(content).prepend(linha).prepend(botoes);

}


function addBotaoPropriedadeSection(){
	html = '<a id="prop-onepage" data-prop="onepage" href="#" class="btn btn-primary btn-xs link-propriedades link-propriedades-onepage">' +
				'<span class="glyphicon glyphicon-cog"></span>'+
			'</a>'+
			'<a href="#" class="btn btn-danger btn-xs remover-componente"><span class="glyphicon glyphicon-remove"></span></a>';
	var botoes = $('<div />').addClass('col-md-12 grupo-btn-propriedades').append(html);

	return botoes;

}

//sempre que clicar em um botão 
$(document).on('click', '.link-propriedades', function(el){
	$(this).toggleClass('btn-primary btn-success');
	if(typeof(botaoAtual) !== 'undefined' && botaoAtual.attr('class').toString() !== $(this).attr('class'))
		botaoAtual.removeClass().addClass('btn btn-primary btn-xs');

	el.preventDefault(); //como são todos links, tira o efeito de ir pra outra página

	if($(this).hasClass('link-propriedades-menu')) objetoAtual = $('#poc-menu'); //se conter a classe link-propriedades-menu, então o objeto atual é o menu
	else {
		objetoAtual = $(this).parent().parent(); //o objeto atual vai ser o pai do link clicado
		if($(this).hasClass('link-propriedades-bloco')) onOpenBloco(); //se for o botão de propriedade do bloco, então preenche o select
	}
	
	botaoAtual = $(this);

	objetoAtual.find('.poc-texto').each(function(){
		$('#poc-form-propriedades-texto #propriedade-texto').val($(this).text().trim());
		summernote = $(this).html();
	});
});

$(document).on('click', '.clear-input', function(){
	var campo = $($(this).data("input"));
	campo.prop("value", "");
	campo.change();
	//adiciona a cor de fundo 
});

/** FIM CONFIGURAÇÕES INICIAIS **/



/** JS PARA PROPRIEDADE PLANO DE FUNDO **/
$(document).on('click','.radio-item-textura', function(){
	//caso a posicao da imagem seja menor que 10, deve-se inserir o 0 na frente. Ex.: 9 = 09
	var posicao = $(this)[0].id.split("-");
	if(parseInt(posicao[1]) < 10){
		posicao[1] = "0" + posicao[1].toString();
	}

	var imagem = posicao[0] + posicao[1] + ".png"; //o nome da imagem será textura-posicao[1].png
	var propriedade = 'url(img/texturas/'+imagem+') repeat';
	
	objetoAtual.css('background', propriedade);
	background.valor = propriedade;
});

function addBoxTexturas(){
	//carrega todas as texturas que estão contidas na pasta img/textura
	if($('.box-texturas').find('li').length == 0){
		var html = '<ul class="lista-texturas">';
		var caminho = 'img/texturas';
		var extensao = '.png';

		$.ajax({
			url: caminho,
			success: function(data){
				$(data).find("a:contains(" + extensao + ")").each(function(indice, valor){
					var arquivo = this.href.replace(window.location.host, "").replace("http:///", "");
					html += '<li class="item-textura textura-'+(indice+1)+'">' + 
								'<input class="radio-item-textura" name="radio-textura" type="radio" id="textura-' + (indice+1) + '">' +
								'<label class="label-textura" for="textura-' + (indice+1) + '">'+arquivo+'</label>' +
							'</li>'; 
				});

				html += '</ul>';

				$('.box-texturas').html(html);
			}
		});
	}
}

$(document).on('change', "#repeticao", function(){
	var repeticao = $("#repeticao").val();
	var url = $('#modalFundoSite #poc-imagem-selecionar').val();

	//se não tiver selecionado alguma imagem, dá o alerta e não faz nada
	if(url.trim() == '') {
		alert('Seleciona uma imagem!');
		return false;
	}

	if(repeticao == 'no-repeat'){
		//background full size
		objetoAtual.css({
			'background' : 'url('+ url +') no-repeat center center fixed',
			'-webkit-background-size' : 'cover',
			'-moz-background-size' : 'cover',
			'-o-background-size' : 'cover',
			'background-size' : 'cover'
		});	
	}else {
		objetoAtual.css('background', 'url('+ url +') ' + repeticao);
	}
});


$(document).on("hide.bs.modal", "#modalFundoSite", function(){
	var local = objetoAtual[0].id.split("-")[1]; //verifica se o objetoAtual é a página, menu, cabeçalho ou rodapé
	if(local == 'page') local = 'pagina';
	
	
	$('#poc-form-propriedades-'+local+' #'+local+'-background').val('Personalizado');
	
});

function configurarModalFundoSite(){
	var cor = $('.background-color'), 
		textura = $('.background_texture'), 
		imagem = $('.background-image'),
		repeticao = $('.background-repeat');

	cor.hide(); textura.hide(); imagem.hide(); repeticao.hide();


	$("#tipo_fundo option[value='"+background.tipo+"']").prop('selected', true);
	switch(parseInt(background.tipo)){
		case 0: 
			textura.hide(); imagem.hide(); repeticao.hide();
			cor.show();
			$('#background-color').val(objetoAtual.css('background-color'));
			break;

		case 1:
			cor.hide(); imagem.hide(); repeticao.hide();
			textura.show();
			break;

		case 2:
			textura.hide(); cor.hide();
			imagem.show(); repeticao.show();
			break;
	}
}

$(document).on('change', '#tipo_fundo', function(){
	background.tipo = $("#tipo_fundo").val();
	configurarModalFundoSite();

});


/** FIM JS PARA PROPRIEDADE PLANO DE FUNDO **/

/** PROPRIEDADES NO MODAL **/

$(document).on('click', '.btn-open-fundo-site', function(e){
	e.preventDefault();
})

$(document).on('hidden.bs.modal', '#selecionarLayout', function (e) {
	
	template = $('input[name=layout]:checked', '#formLayout').val();
	
	//se o layout escolhido for o 5, então há a necessidade da importação de um arquivo css específico
	if(template == 5){
		$('head').append('<link rel="stylesheet" type="text/css" href="css/layout5.css">');
	}
	$(".conteudo-gerado").append(layouts[template-1].html); //insere o layout escolhido na tela

	componentes_fixos.cabecalho = $("#poc-header");
	componentes_fixos.menuPrincipal = $("#poc-menu");
	componentes_fixos.menuEsquerdo = $("#poc-menu-left");
	componentes_fixos.menuMenuDireito = $("#poc-menu-right");
	componentes_fixos.rodape = $("#poc-footer");

	var home = {
		id: 			1,
		nome: 			"Home",
		isHome: 		true,
		isLink: 		false, 
		descricao: 		"Página Inicial do Seu Projeto",
		children: 		[],
		pai: 			0,
		url: 			"#", 
		conteudo: 		$('#poc-content').html(),
	};

	paginas.push(home);
	openPage(home);

	$('#lista-paginas').empty();
	$('.poc-nav-pages').empty();
	paginaAtual = home;

	redefinirMenu(paginas, 0);
	redefinirMenuHtml(paginas, 0, '.poc-nav-pages', onePage);
	
	//depois que for escolhido o tipo de layout, insere as funcionalidades para os componentes
	addDraggableToComponents();//capacidade de arrastar
	addSortableToComponents(); //elementos que vão receber os conteúdos arrastaveis
	startCarousel();

	addBotaoPropriedade("#poc-page", "pagina");
	addBotaoPropriedade("#poc-header", "cabecalho");
	addBotaoPropriedade("#poc-content", "conteudo");
	addBotaoPropriedade("#poc-footer", "rodape");

	addSidrToComponents(); //exibição das propriedades ao clicar no componente

});

$(document).on('change', '#select-tipo-site', function(){
	
	var selecionado = $(this).val();
	
	//insere os tooltips
	var infoEstiloLivre = "<p>Um site com estilo livre gera um protótipo em branco para que o usuário possa moldar o site a sua maneira, "+
	"começando do zero.</p><p><a href='#'>Exemplo</a></p>";

	var infoOnePage = "<p>Em um site com única página, sub-páginas são exibidas em sessões.</p><p><a href='#'>Exemplo</a></p>";
	var infoAdministrativo = "<p>Site pre-preparado com login e área de controle.</p><p><a href='#'>Exemplo</a></p>";

	$(".tooltip-tipo-site").popover('destroy').popover({
		content: function(){ return  definirTooltip(selecionado, infoEstiloLivre, infoOnePage, infoAdministrativo) },
		trigger: 'click',
		title: 'Ajuda',
		html: true,
		placement: 'left'
	});
});

$(document).on('hide.bs.modal', '#selecionarTipoSite', function(e){
	var selecionado = $('#select-tipo-site').val();

	switch(parseInt(selecionado)){
		case 1: abrirModalSelecionarLayout(); break;
		case 2: onePage = true; tipoOnePage(); break;
	}

});

//quando o modal fundo site for aberto, paga-se o valor contido no campo texto
$(document).on('show.bs.modal', '#modalFundoSite', function(e){
	configurarModalFundoSite();
});

//quando o modal para adiocionar um nova página surgir
$(document).on('show.bs.modal','#add-page', function(e){
	$('#pai').empty();
	$('#pai').append('<option value="0">Nenhum</option>')

	addPaiSelect(paginas, 0);
	$('#pai').change();

});

//caso seja escolhido estilo livre, deve-se escolher a estrutura do site
function abrirModalSelecionarLayout(){
	//abre o modal para selecionar o layout
	$('#selecionarLayout').modal({
		keyboard: false,
		show: true,
		backdrop: 'static'
	});
}

function carregarModalInicial(){
	//carrega os modais
	$("#content-modal").load("modal.html", function(){
		initDraggableForm();

		//insere os tooltips
		var infoEstiloLivre = "<p>Um site com estilo livre gera um protótipo em branco para que o usuário possa moldar o site a sua maneira, "+
		"começando do 0</p><p><a href='#'>Exemplo</a></p>";

		$(".tooltip-tipo-site").popover({
			content: infoEstiloLivre,
			trigger: 'click',
			title: 'Ajuda',
			html: true,
			placement: 'left'
			
		});


		//abre o modal para selecionar o layout
		$('#selecionarTipoSite').modal({
			keyboard: false,
			show: true,
			backdrop: 'static'
		});
	});
}


//quando alterar o valor do select para o tipo de site, deve-se alterar o conteúdo do popover
function definirTooltip(selecionado, livre, onepage, administrativo){
	var retorno;
	switch(parseInt(selecionado)){
		case 1: retorno = livre; break;
		case 2: retorno = onepage; break;
		case 3: retorno = administrativo; break;
		default: retorno = livre;
	}

	return retorno;
}



//deve ser feito uma função para upload de imagem para a biblioteca

//propriedade referente a escolha de uma imagem da biblioteca
$(document).on('shown.bs.modal', '#modalSelecionarImagem', function(e){
	var el = $('#modalSelecionarImagem #poc-lista-imagens-biblioteca');
	preencherSelectBiblioteca(el);
})

$(document).on('click', '#modalSelecionarImagem #btn-selecionar-imagem', function(){
	if(objetoAtual.hasClass('componente-imagem')){
		//console.log('ta aqui');
		//coloca a url da imagem no campo do formulario
		var campo = $('#poc-form-propriedades-imagem #poc-imagem-selecionar');
		campo.val($('#modalSelecionarImagem select').val());
		campo.change();
	}else {
		var campo = $('#modalFundoSite #poc-imagem-selecionar');
		campo.val($('#modalSelecionarImagem select').val());
		objetoAtual.css('background', 'url('+campo.val()+')');
	}
})



/** FIM PROPRIEDADES NO MODAL **/


/** PROPRIEDADES DA PÁGINA **/
$(document).on('click', '#prop-pagina', function(){
	/*
	var retorno = definirElementosVisivies();
	if($(".grupo_visiveis").length > 0){
		for(var i=0; i<retorno.itens.length; i++){
			$("#v_"+retorno.itens[i].item).prop('checked', retorno.itens[i].marcado);
		}
	}else $("#poc-form-propriedades-pagina").append(retorno.html);
	*/
});


/*incluir no formulario as opções de visibilidade */
function definirElementosVisivies(){
	var itens = [];
	var cabecalho = $("#poc-header");
	var rodape = $("#poc-footer");
	var menuPrincipal = $("#poc-menu");
	var menuEsquerdo = $("#poc-menu-left");
	var menuDireito = $("#poc-menu-right");

	if(cabecalho.length > 0){
		if(cabecalho.is(":visible")) itens.push({nome: "Cabeçalho", marcado: true, item: 'cabecalho'});
		else itens.push({nome: "Cabeçalho", marcado: false, item: 'cabecalho'});
	}

	if(menuPrincipal.length > 0){
		if(menuPrincipal.is(":visible")) itens.push({nome: "Menu Principal", marcado: true, item: 'menuPrincipal'});
		else itens.push({nome: "Menu Principal", marcado: false, item: 'menuPrincipal'});
	}

	if(menuEsquerdo.length > 0){
		if(menuEsquerdo.is(":visible")) itens.push({nome: "Menu Esquerdo", marcado: true, item: 'menuEsquerdo'});
		else itens.push({nome: "Menu Esquerdo", marcado: false, item: 'menuEsquerdo'});
	}

	if(menuDireito.length > 0){
		if(menuDireito.is(":visible")) itens.push({nome: "Menu Direito", marcado: true, item: 'menuDireito'});
		else itens.push({nome: "Menu Direito", marcado: false, item: 'menuDireito'});
	}

	if(rodape.length > 0){
		if(rodape.is(":visible")) itens.push({nome: "Rodapé", marcado: true, item: 'rodape'});
		else itens.push({nome: "Rodapé", marcado: false, item: 'rodape'});
	}

	//insere o html no formulario
	var html = '<div class="form-group grupo_visiveis">' + 
					'<label for="itens_visiveis">Itens visíveis</label>';

	for(var i=0; i<itens.length; i++){
		var nome = itens[i].nome;
		var item = itens[i].item;
		var marcado = ''; 
		itens[i].marcado ? marcado = 'checked' : marcado = '';

		html += '<div class="checkbox">'+
  					'<label><input class="definir_visivel" type="checkbox" value="'+item+'" '+marcado+' id="v_'+item+'">'+nome+'</label>'+
  				'</div>';
	}

	html +='</div>';

	return {itens: itens, html: html};
}

function addFontsToSelect(){
	//ordena o vetor pelo nome da fonte
	fonts.sort(function (a, b){
		if(a.nome > b.nome) return 1;
		if(a.nome < b.nome) return -1;
		return 0;
	});

	for(var i=0; i<fonts.length; i++){
		$("#fonte").append('<option value="' + fonts[i].familia + '" style="font-family: ' + fonts[i].familia + '">' + fonts[i].nome + '</option>');	
	}
}

//funções que serão chamadas quando alguma coisa mudar nos formularios
$(document).on('change', '#poc-form-propriedades-pagina #site-centralizado', function(){
	var valor = parseInt($(this).val());
	var pagina = $('#poc-page');

	//se o valor de site centrazalido for "não", remove a div com class container
	if(valor == 1){
		//insere o conteúdo numa div centralizada
		var conteudo = pagina.html();
		pagina.html('<div class="container poc-pagina-centralizada">' + conteudo + '</div>');
		pagina.find('.grupo-btn-propriedades:first').prependTo('#poc-page');
		addSidrToComponents();
		botaoAtual = pagina.find('.link-propriedades-pagina');
		objetoAtual = $('#poc-page');
		$('#poc-form-propriedades-pagina #site-centralizado').val('1');
		addDraggableToComponents();
		addSortableToComponents();
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-pagina-centralizada').length > 0){
			var conteudo_centralizado = $('.poc-pagina-centralizada').html();
			$('.poc-pagina-centralizada').remove();
			pagina.append(conteudo_centralizado);
		}
	}
})

$(document).on('click', '.btn-fundo-transparente', function(e){
	e.preventDefault();

	objetoAtual.css('background', 'transparent none');
	$(this).parents('.form-group').find('input[type="text"]').val('Padrão');
})

$(document).on('change', '#poc-form-propriedades-pagina #fonte', function(){
	$('#poc-page').css('font-family', $(this).val());
})

$(document).on('change', '#poc-form-propriedades-pagina #tamanho_fonte', function(){
	$('#poc-page').css('font-size', $(this).val());
})

/** FIM PROPRIEDADES DA PÁGINA **/

/**PROPRIEDADES DO BLOCO **/
function onOpenBloco(){
	var qtdColunas = objetoAtual.children('.coluna').length; //pega a quantidade de div com a a classe .coluna dentro do bloco

	var select = $('#largura-colunas');
	select.empty();
	

	if(qtdColunas == 1) {
		select.append('<option value="12">12</option>');
		return;
	}

	for(var i=0; i<larguraColunas[qtdColunas-2].length; i++){
		select.append('<option value="'+larguraColunas[qtdColunas-2][i]+'">'+ larguraColunas[qtdColunas-2][i] + '</option>');
	}
}


$(document).on('change', '#largura-colunas', function(e){
	var valores = $(this).val().split('-'); //pega o largura de cada coluna do bloco
	objetoAtual.children('.coluna').each(function(i,el){
		var coluna = $(this);
		coluna.removeClass().addClass('col-md-'+valores[i]+' coluna ui-sortable') //insere a classe col-md-largura.
	});
})


/**FIM DAS PROPRIEDADES DO BLOCO **/

/** PROPRIEDADES DO CABEÇALHO **/
$(document).on('change', '#poc-form-propriedades-header #poc-header-centralizado', function(){
	
	var cabecalho = $('#poc-header');
	var valor = parseInt($(this).val());


	if(valor == 1){
		//insere o conteúdo numa div centralizada
		var conteudo = cabecalho.html();
		cabecalho.html('<div class="container poc-header-centralizado">' + conteudo + '</div>');
		cabecalho.find('.grupo-btn-propriedades:first').prependTo('#poc-header');
		cabecalho.find('.poc-linha:first').remove();
		addSidrToComponents();
		botaoAtual = cabecalho.find('.link-propriedades-cabecalho');
		$('#poc-form-propriedades-header #poc-header-centralizado').val('1');
		addDraggableToComponents();
		addSortableToComponents();
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-header-centralizado').length > 0){
			var conteudo_centralizado = $('.poc-header-centralizado').html();
			$('.poc-header-centralizado').remove();
			cabecalho.append(conteudo_centralizado);
		}
	}
});

$(document).on('change', '#poc-form-propriedades-header #poc-container-header', function(){
	
	var cabecalho = $('#poc-header');
	var valor = parseInt($(this).val());


	if(valor == 1){
		//insere o conteúdo numa div centralizada
		var container = $('<div />').addClass('container poc-container-header');
		container.append($('#poc-header').clone(true));
		$('#poc-header').replaceWith(container);

		
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-container-header').length > 0){
			$('.poc-container-header').replaceWith($('#poc-header'));
		}
	}
});

//alteração no tamanho mínimo
$(document).on('change paste keyup', '.tamanho-minimo', function(){
	var valor = parseInt($(this).val());
	
	if(valor === NaN || (valor.toString().length > 2 && valor < 200)){
		$(this).val('200');
		$(this).change();
	}else if(valor.toString().length > 2 && valor > 199){
		objetoAtual.css('min-height', valor+'px');
	}

	componentes_fixos.cabecalho = objetoAtual;
})

//quando clicar no botão de aumentar, incrementa
$(document).on('click','.header-btn-up', function(){
	var header = $("#header-tamanho-minimo");
	var valor = parseInt(header.val());

	if(valor === NaN || valor < 200) valor = 200;

	header.val(valor+1);
	header.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.header-btn-down', function(){
	var header = $("#header-tamanho-minimo");
	var atual = parseInt(header.val());

	if(atual === NaN || ((atual-1) < 200)) atual = 200;
	else atual = atual-1;

	header.val(atual);
	header.change();
})


//alteração na borda
$(document).on('change', '#poc-form-propriedades-header #poc-cabecalho-border-style', function(){
	var grupo = $('#poc-form-propriedades-header .group-border');
	var valor = $(this).val();
	var borderSize = $('#poc-form-propriedades-header #poc-header-border-size').val();
	var borderRadius = $('#poc-form-propriedades-header #poc-header-border-radius').val();
	var borderColor = $('#poc-form-propriedades-header #poc-header-border-color').val();

	if(valor == 'none'){
		grupo.prop('disabled', true);
		objetoAtual.css('border', valor);
	}else{
		grupo.prop('disabled', false);
		objetoAtual.css('border', borderSize + 'px ' + valor + ' ' + borderColor);
		objetoAtual.css('border-radius', borderRadius+'px')
	}
})

$(document).on('change paste keyup', '#poc-form-propriedades-header #poc-header-border-size', function(){
	var valor = parseInt($(this).val());
	
	if(valor === NaN || valor < 1 || valor > 15){
		$(this).val('1');
		$(this).change();
	}else $('#poc-form-propriedades-header #poc-cabecalho-border-style').change();
})

//quando clicar no botão de aumentar, incrementa
$(document).on('click','.border-size-header-btn-up', function(){
	var header = $("#poc-header-border-size");
	var valor = parseInt(header.val());

	if(valor === NaN || valor > 15) valor = 14;

	header.val(valor+1);
	header.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.border-size-header-btn-down', function(){
	var header = $("#poc-header-border-size");
	var atual = parseInt(header.val());

	if(atual === NaN || ((atual-1) < 1)) atual = 1;
	else atual = atual-1;

	header.val(atual);
	header.change();
})

//border radius - cabeçalho
$(document).on('change paste keyup', '#poc-form-propriedades-header #poc-header-border-radius', function(){
	var valor = parseInt($(this).val());
	
	if(valor === NaN || valor < 0 || valor > 25){
		$(this).val('0');
		$(this).change();
	}else $('#poc-form-propriedades-header #poc-cabecalho-border-style').change();
})

//quando clicar no botão de aumentar, incrementa
$(document).on('click','.border-radius-header-btn-up', function(){
	var header = $("#poc-header-border-radius");
	var valor = parseInt(header.val());

	if(valor === NaN || valor > 25) valor = 24;

	header.val(valor+1);
	header.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.border-radius-header-btn-down', function(){
	var header = $("#poc-header-border-radius");
	var atual = parseInt(header.val());

	if(atual === NaN || ((atual-1) < 0)) atual = 0;
	else atual = atual-1;

	header.val(atual);
	header.change();
})


/** FIM PROPRIEDADES DO CABEÇALHO **/

/** PROPRIEDADE DO MENU **/

$(document).on('change', '#poc-menu-fixo', function(){
	console.log(objetoAtual);
	var valor = $(this).val();
	objetoAtual.removeClass('navbar-static-top navbar-fixed-top'); //remove as classes que deixam o menu no topo
	switch(valor){
		case '0':
			objetoAtual.find('.mover-componente').prop('disabled', false); 
			break;

		case '1':
			objetoAtual.find('.mover-componente').prop('disabled', true); 
			objetoAtual.addClass('navbar-static-top');
			break;
		case '2':
			objetoAtual.find('.mover-componente').prop('disabled', true); 
			objetoAtual.addClass('navbar-fixed-top');
			break;
	}
})

$(document).on('change', '#poc-border-menu', function(){
	var valor = parseInt($(this).val());
	var menu = $('.poc-navbar');
	var radius = $('.poc-group-border-radius');
	
	//não
	if(valor == 0){
		menu.css('border', '0px');
		menu.css('border-radius', '0px');
		radius.hide();
	}else{
		menu.css('border', '1px solid');
		menu.css('border-radius', radius.val());
		radius.show();
	}
})

//quando tiver alguma alteração no campo borda arredondada.
$(document).on('change paste keyup', '#poc-border-radius-menu', function(){
	var valor = parseInt($(this).val());
	var menu = $('.poc-navbar');
	
	if(valor === NaN || valor < 0){
		$(this).val('0');
		$(this).change();
	}else {
		menu.css('border-radius', valor+'px');
	}
})

//quando clicar no botão de aumentar, incrementa
$(document).on('click','.menu-btn-up', function(){
	var menu = $("#poc-border-radius-menu");
	var valor = parseInt(menu.val());

	if(valor === NaN || valor < 0) valor = 0;

	menu.val(valor+1);
	menu.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.menu-btn-down', function(){
	var menu = $("#poc-border-radius-menu");
	var atual = parseInt(menu.val());

	if(atual === NaN || ((atual-1) < 0)) atual = 200;
	else atual = atual-1;

	menu.val(atual);
	menu.change();
})

//exibe ou não o campo de pesquisa no menu
$(document).on('change', '#poc-menu-search', function(){
	var valor = parseInt($(this).val());
	var search = $('.poc-navbar-search');
	
	if(valor == 0) search.hide();
	else search.show();
});


//ativa ou não o campo de login/dados.
$(document).on('change', '#poc-menu-login', function(){
	var dropdown = $('.poc-menu-account');
	var grupoTipoLogin = $('.group-tipo-login');
	var tipoLogin = parseInt($('#poc-menu-tipo-login').val());
	var valor = parseInt($(this).val());

	if(valor == 0){
		grupoTipoLogin.hide();
		dropdown.hide();
	}else{
		grupoTipoLogin.show();
		dropdown.html(tipoAccount[tipoLogin].html);
		dropdown.show();
	}
})

$(document).on('change', '#poc-menu-tipo-login', function(){
	var dropdown = $('.poc-menu-account');
	var tipoLogin = parseInt($(this).val());
	dropdown.html(tipoAccount[tipoLogin].html);
})
/** FIM PROPRIEDADE DO MENU **/ 

/** PROPRIEDADE DO CONTEÚDO **/
$(document).on('change', '#poc-content-centralizado', function(){
	var conteudo = $('#poc-content');
	var valor = parseInt($(this).val());


	if(valor == 1){
		//insere o conteúdo numa div centralizada
		var aux = conteudo.html();
		conteudo.html('<div class="container poc-content-centralizado">' + aux + '</div>');
		conteudo.find('.grupo-btn-propriedades:first').prependTo('#poc-content');
		addSidrToComponents();
		botaoAtual = pagina.find('.link-propriedades-conteudo');
		$(this).val('1');
		addDraggableToComponents();
		addSortableToComponents();

	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-content-centralizado').length > 0){
			var conteudo_centralizado = $('.poc-content-centralizado').html();
			$('.poc-content-centralizado').remove();
			conteudo.append(conteudo_centralizado);
		}
	}
});

$(document).on('change', '#poc-form-propriedades-content #poc-container-content', function(){
	
	var valor = parseInt($(this).val());


	if(valor == 1){
		//insere o conteúdo numa div centralizada
		var container = $('<div />').addClass('container poc-container-content');
		container.append($('#poc-content').clone(true));
		$('#poc-content').replaceWith(container);

		
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-container-content').length > 0){
			$('.poc-container-content').replaceWith($('#poc-content'));
		}
	}
});


//quando clicar no botão de aumentar, incrementa
$(document).on('click','.content-btn-up', function(){
	var conteudo = $("#content-tamanho-minimo");
	var valor = parseInt(conteudo.val());

	if(valor === NaN || valor < 200) valor = 200;

	conteudo.val(valor+1);
	conteudo.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.content-btn-down', function(){
	var conteudo = $("#content-tamanho-minimo");
	var atual = parseInt(conteudo.val());

	if(atual === NaN || ((atual-1) < 200)) atual = 200;
	else atual = atual-1;

	conteudo.val(atual);
	conteudo.change();
})

$(document).on('change', '#poc-form-propriedades-content #poc-conteudo-border-style', function(){
	var grupo = $('#poc-form-propriedades-content .group-border');
	var valor = $(this).val();
	var borderSize = $('#poc-form-propriedades-content #poc-conteudo-border-size').val();
	var borderRadius = $('#poc-form-propriedades-content #poc-conteudo-border-radius').val();
	var borderColor = $('#poc-form-propriedades-content #poc-conteudo-border-color').val();

	if(valor == 'none'){
		grupo.prop('disabled', true);
		objetoAtual.css('border', valor);
	}else{
		grupo.prop('disabled', false);
		objetoAtual.css('border', borderSize + 'px ' + valor + ' ' + borderColor);
		objetoAtual.css('border-radius', borderRadius+'px')
	}
})

$(document).on('change paste keyup', '#poc-form-propriedades-content #poc-conteudo-border-size', function(){
	var valor = parseInt($(this).val());
	
	if(valor === NaN || valor < 1 || valor > 15){
		$(this).val('1');
		$(this).change();
	}else $('#poc-form-propriedades-content #poc-conteudo-border-style').change();
})

//quando clicar no botão de aumentar, incrementa
$(document).on('click','.border-size-conteudo-btn-up', function(){
	var conteudo = $("#poc-conteudo-border-size");
	var valor = parseInt(header.val());

	if(valor === NaN || valor > 15) valor = 14;

	conteudo.val(valor+1);
	conteudo.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.border-size-conteudo-btn-down', function(){
	var conteudo = $("#poc-conteudo-border-size");
	var atual = parseInt(header.val());

	if(atual === NaN || ((atual-1) < 1)) atual = 1;
	else atual = atual-1;

	conteudo.val(atual);
	conteudo.change();
})

//border radius - cabeçalho
$(document).on('change paste keyup', '#poc-form-propriedades-content #poc-conteudo-border-radius', function(){
	var valor = parseInt($(this).val());
	
	if(valor === NaN || valor < 0 || valor > 25){
		$(this).val('0');
		$(this).change();
	}else $('#poc-form-propriedades-content #poc-conteudo-border-style').change();
})

//quando clicar no botão de aumentar, incrementa
$(document).on('click','.border-radius-conteudo-btn-up', function(){
	var conteudo = $("#poc-conteudo-border-radius");
	var valor = parseInt(header.val());

	if(valor === NaN || valor > 25) valor = 24;

	conteudo.val(valor+1);
	conteudo.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.border-radius-conteudo-btn-down', function(){
	var conteudo = $("#poc-conteudo-border-radius");
	var atual = parseInt(header.val());

	if(atual === NaN || ((atual-1) < 0)) atual = 0;
	else atual = atual-1;

	conteudo.val(atual);
	conteudo.change();
})
/** FIM PROPRIEDADE DO CONTEÚDO **/

/** PROPRIEDADES DO RODAPÉ **/
$(document).on('change', '#poc-footer-centralizado', function(){
	var rodape = $('#poc-footer');
	var valor = parseInt($(this).val());


	if(valor == 1){
		//insere o conteúdo numa div centralizada
		var conteudo = rodape.html();
		rodape.html('<div class="container poc-footer-centralizado">' + conteudo + '</div>');

		rodape.find('.grupo-btn-propriedades:first').prependTo('#poc-footer');
		addSidrToComponents();
		botaoAtual = pagina.find('.link-propriedades-pagina');
		$(this).val('1');
		addDraggableToComponents();
		addSortableToComponents();
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-footer-centralizado').length > 0){
			var conteudo_centralizado = $('.poc-footer-centralizado').html();
			$('.poc-footer-centralizado').remove();
			rodape.html(conteudo_centralizado);
		}
	}
})

$(document).on('change', '#poc-form-propriedades-footer #poc-container-footer', function(){
	var valor = parseInt($(this).val());

	if(valor == 1){
		//insere o conteúdo numa div centralizada
		var container = $('<div />').addClass('container poc-container-footer');
		container.append($('#poc-footer').clone(true));
		$('#poc-footer').replaceWith(container);

		
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-container-footer').length > 0){
			$('.poc-container-footer').replaceWith($('#poc-footer'));
		}
	}
});

//quando clicar no botão de aumentar, incrementa
$(document).on('click','.footer-btn-up', function(){
	var footer = $("#footer-tamanho-minimo");
	var valor = parseInt(footer.val());

	if(valor === NaN || valor < 200) valor = 200;

	footer.val(valor+1);
	footer.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.footer-btn-down', function(){
	var footer = $("#footer-tamanho-minimo");
	var atual = parseInt(footer.val());

	if(atual === NaN || ((atual-1) < 200)) atual = 200;
	else atual = atual-1;

	footer.val(atual);
	footer.change();
})

$(document).on('change', '#poc-form-propriedades-footer #poc-rodape-border-style', function(){
	var grupo = $('#poc-form-propriedades-footer .group-border');
	var valor = $(this).val();
	var borderSize = $('#poc-form-propriedades-footer #poc-rodape-border-size').val();
	var borderRadius = $('#poc-form-propriedades-footer #poc-rodape-border-radius').val();
	var borderColor = $('#poc-form-propriedades-footer #poc-rodape-border-color').val();

	if(valor == 'none'){
		grupo.prop('disabled', true);
		objetoAtual.css('border', valor);
	}else{
		grupo.prop('disabled', false);
		objetoAtual.css('border', borderSize + 'px ' + valor + ' ' + borderColor);
		objetoAtual.css('border-radius', borderRadius+'px')
	}
})

$(document).on('change paste keyup', '#poc-form-propriedades-footer #poc-rodape-border-size', function(){
	var valor = parseInt($(this).val());
	
	if(valor === NaN || valor < 1 || valor > 15){
		$(this).val('1');
		$(this).change();
	}else $('#poc-form-propriedades-footer #poc-rodape-border-style').change();
})

//quando clicar no botão de aumentar, incrementa
$(document).on('click','.border-size-rodape-btn-up', function(){
	var rodape = $("#poc-rodape-border-size");
	var valor = parseInt(header.val());

	if(valor === NaN || valor > 15) valor = 14;

	rodape.val(valor+1);
	rodape.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.border-size-rodape-btn-down', function(){
	var rodape = $("#poc-rodape-border-size");
	var atual = parseInt(header.val());

	if(atual === NaN || ((atual-1) < 1)) atual = 1;
	else atual = atual-1;

	rodape.val(atual);
	rodape.change();
})

//border radius - cabeçalho
$(document).on('change paste keyup', '#poc-form-propriedades-footer #poc-rodape-border-radius', function(){
	var valor = parseInt($(this).val());
	
	if(valor === NaN || valor < 0 || valor > 25){
		$(this).val('0');
		$(this).change();
	}else $('#poc-form-propriedades-content #poc-rodape-border-style').change();
})

//quando clicar no botão de aumentar, incrementa
$(document).on('click','.border-radius-rodape-btn-up', function(){
	var rodape = $("#poc-rodape-border-radius");
	var valor = parseInt(header.val());

	if(valor === NaN || valor > 25) valor = 24;

	rodape.val(valor+1);
	rodape.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','.border-radius-rodape-btn-down', function(){
	var rodape = $("#poc-rodape-border-radius");
	var atual = parseInt(header.val());

	if(atual === NaN || ((atual-1) < 0)) atual = 0;
	else atual = atual-1;

	rodape.val(atual);
	rodape.change();
})

/** FIM PROPRIEDADES DO RODAPÉ **/

/** ADICIONAR PÁGINA **/

function limparFormlarioAddPage(){
	$("#poc-form-add-page #tipo-item").val('0');
	$("#poc-form-add-page #tipo-item").change();
	$("#poc-form-add-page #link").val('');
	$("#poc-form-add-page #nome").val('');
	$("#poc-form-add-page #isHome").val('0');
	$("#poc-form-add-page #tipo-style-content").val('0');
	$("#poc-form-add-page #descricao").val('');

	$('#poc-form-add-page #pai').empty();
	$('#poc-form-add-page #pai').append('<option value="0">Nenhum</option>')

	addPaiSelect(paginas, 0);
	$('#pai').change();
}



$("#btn-add-page").click(function(){
	limparFormlarioAddPage();

	if(onePage) $('#poc-form-add-page .group-normal').hide();
	else $('#poc-form-add-page .group-normal').show();

});



//adiciona possíveis pais para serem escolhidos
function addPaiSelect(itens, nivel){
	//nível máximo é 3
	if(nivel > 2) return;

	var lista = $('#pai');
	for(var i=0; i<itens.length; i++){
		if(!itens[i].isLink) continue;
		//adiciona o nome da página na lista
		lista.append("<option value='" + itens[i].id + "'>" + addTabulacao(nivel) + " " + itens[i].nome + "</option>");

		//se essa página tem filhos, então faz a busca nesses filhos
		if(itens[i].children.length > 0) addPaiSelect(itens[i].children, nivel+1);
	}
}

//percorre todos as páginas para verificar se algum deles é o item selecionado como pai
function getPai(itens, nome){
	var add;

	alterarPagina > 0 ? add = 0 : add = 1;

	for(var i=0; i<itens.length; i++){
		if(itens[i].nome == nome){
			for(var j=0; j<itens[i].children.length+add; j++){
				$("#posicao").append("<option value='" + (j+1) + "'>" + (j+1) + "</option>");
			}

		} else if(itens[i].children.length > 0) getPai(itens[i].children, nome);
	}
}

//para facilitar a visualização dos níveis de menu, são colocados traços
function addTabulacao(nivel){
	if(nivel == 0) return "-";

	var retorno = "-";
	for(var i=0; i<nivel; i++){
		retorno += "-";
	}

	return retorno;
}

//troca a propriedade isHome de todas as páginas para false
function setIsHomeFalse(itens){
	for(posicao in itens){
		itens[posicao].isHome = false;

		if(itens[posicao].children.length > 0) setIsHomeFalse(itens[posicao].children);
	}
}

function setPai(itens, idPage, page, position){
	for(posicao in itens){
		if(itens[posicao].id == idPage) {
			if(itens[posicao].children.length <= position)itens[posicao].children.push(page); //se a posição escolhida for a ultima, adiciona com o push	
			else itens[posicao].children.splice(position, 0, page); //se for alguma posição antes da ultima, adiciona com o splice

		}else if(itens[posicao].children.length > 0) setPai(itens[posicao].children, idPage, page, position); //busca pela página nos filhos de uma determinada página
	}
}


function redefinirMenu(lista, nivel){
	var menu = $('#lista-paginas');
	var classe = '';
	for(posicao in lista){
		paginaAtual.id == lista[posicao].id ? classe = 'bg-primary' : classe = 'bg-info'; 
		html = '<li class="'+classe+'" data-id="'+lista[posicao].id + '"><a href="#">' + addTabulacao(nivel) + ' ' + lista[posicao].nome + '</a>';
		
		if(lista[posicao].conteudo !== ""){
			html += '<div class="pull-right">'+
						'<button class="btn btn-warning btn-xs btn-opcoes-paginas btn-editar-pagina"><span class="glyphicon glyphicon-pencil"></span></button>' + 
						'<button class="btn btn-success btn-xs btn-opcoes-paginas btn-visualizar-pagina"><span class="glyphicon glyphicon-eye-open"></span></button>' + 
						'<button class="btn btn-danger btn-xs btn-opcoes-paginas btn-remover-pagina"><span class="glyphicon glyphicon-remove"></span></button>'+
					'</div></li>';
		}else {
			html += '<div class="pull-right">'+
						'<button class="btn btn-warning btn-xs btn-opcoes-paginas btn-editar-pagina"><span class="glyphicon glyphicon-pencil"></span></button>' + 
						'<button class="btn btn-danger btn-xs btn-opcoes-paginas btn-remover-pagina"><span class="glyphicon glyphicon-remove"></span></button>'+
					'</div></li>';
		}

		menu.append(html);

		if(lista[posicao].children.length > 0) redefinirMenu(lista[posicao].children, nivel+1);
	}
}

function redefinirMenuHtml(lista, nivel, pai, isOnePage){
	var pai = $(pai);
	var id = pai.data('id');
	var classe = '';

	if(typeof(isOnePage) !== 'undefined') classe = 'page-scroll';
	
	switch(nivel){
		case 0:
			for(i in lista){
				if(lista[i].children.length == 0) pai.append('<li data-id="'+lista[i].id+'" class="item-'+lista[i].id+' '+classe+'"><a href="'+lista[i].url+'">'+lista[i].nome+'</a></li>');
				else{
					pai.append('<li data-id="'+lista[i].id+'" class="item-'+lista[i].id+'"><a class="dropdown-toggle" data-toggle="dropdown" href="'+lista[i].url+'">'+lista[i].nome+'<b class="caret"></b></a></li>');	
					redefinirMenuHtml(lista[i].children, nivel+1, '.item-'+lista[i].id, isOnePage);
				}	
			}
			
			break;

		case 1:
			pai.append('<ul class="dropdown-menu multi-level submenu-item-'+id+'" ><ul/>');
			var filho =	$('.submenu-item-'+id);
			for(i in lista){
				if(lista[i].children.length == 0) filho.append('<li data-id="'+lista[i].id+'" class="item-'+lista[i].id+'"><a href="'+lista[i].url+'">'+lista[i].nome+'</a></li>');
				else{
					filho.append('<li data-id="'+lista[i].id+'" class="dropdown-submenu item-'+lista[i].id+'"><a class="dropdown-toggle" data-toggle="dropdown" href="'+lista[i].url+'">'+lista[i].nome+'</a></li>');	
					redefinirMenuHtml(lista[i].children, nivel+1, '.item-'+id, isOnePage);
				}
			}

			break;

		case 2:
			pai.append('<ul class="dropdown-menu submenu-item'+id+'"><ul/>');
			var filho =	$('.submenu-item-'+id);
			for(i in lista) filho.append('<li data-id="'+lista[i].id+'" class="item-'+lista[i].id+'"><a href="'+lista[i].url+'">'+lista[i].nome+'</a></li>');

			break;

		default: return;

	}
	
}


function openPage(pagina, isOnePage){
	paginaAtual = pagina;

	$(".conteudo-gerado").attr('data-content', 'Página - ' + pagina.nome);
	//$("#poc-header").replaceWith(componentes_fixos.cabecalho);
	//$("#poc-menu").replaceWith(componentes_fixos.menuPrincipal);
	//$("#poc-menu-left").replaceWith(componentes_fixos.menuEsquerdo);
	//$("#poc-menu-right").replaceWith(componentes_fixos.menuDireito);
	$("#poc-content").html(pagina.conteudo);
	//$("#poc-footer").replaceWith(componentes_fixos.rodape);
	addSidrToComponents();
}

//adiciona as opções de posição de acordo com o pai selecionado.
$(document).on('change', '#pai', function(){
	var selecionado = $(this).val();
	var nomePagina = $('#pai option:selected').text().replace('-', '').trim();
	var add;

	alterarPagina > 0 ? add = 0 : add = 1;


	$('#posicao').empty(); //limpa o select

	if(selecionado == '0'){
		//selecionado == 0 indica que foi selecionado a opção Nenhum
		for(var i=0; i<paginas.length+add; i++){
			$("#posicao").append("<option value='" + (i+1) + "'>" + (i+1) + "</option>");
		}
	}else{
		//caso contrario, é necessário procurar 
		getPai(paginas, nomePagina);
	}

});


$(document).on('change', '#tipo-item', function(){
	var valor = parseInt($(this).val());
	
	if(valor == 0) {
		$('#poc-form-add-page .form-group').show();
		$('.grupo-link').hide();
	}else{
		$('#poc-form-add-page .form-group').show();
		$('.grupo-is-home, .grupo-tipo-pagina').hide();
	}
});

$(document).on('click', '#btn-salvar-nova-pagina', function(){
	var dados = $('#poc-form-add-page').serializeArray(); //pega os dados do formulário
	
	var pagina = new Object();
	//processo de validação

	//nome
	var nome = $.trim(dados[1].value);
	var isHome = false;
	var pai = parseInt(dados[6].value);
	var posicao = parseInt(dados[7].value);
	var url = "#"; dados[2].value.length == 0 ? url = "#" : url = dados[2].value;

	if(nome.trim().length == 0) alert('Dê um nome para o item!')
	else {

		if(dados[0].value == '0'){

			var conteudo = "";
			//se não for onePage limpa o conteúdo e insere o estilo desejado
			if(!onePage){
				//atualiza a pagina atual para criar um nova
				paginaAtual.conteudo = $('#poc-content').html();
				salvarAlteracoes(paginas, paginaAtual);
				
				//cria-se um novo conteúdo
				conteudo = $('#poc-content');
				conteudo.empty(); //esvazia o conteudo
				addBotaoPropriedade("#poc-content", "conteudo"); //adiciona o botão de propriedade
				conteudo.append(getPageStyle(dados[4].value));
				url = "#";
			}else {
				salvarAlteracoesOnePage();
				var linha = $('<div />').addClass('row poc-linha');
				url = "#"+removerAcentosEspacos(nome);
				conteudo = $('<section />').prop('id', removerAcentosEspacos(nome)).append(addBotaoPropriedadeSection()).append(linha);
			}
			
			if(dados[3].value == '1'){
				isHome = true;
				setIsHomeFalse(paginas);
			}

			pagina = {
				id: 			(lastId + 1),
				nome: 			nome,
				isLink: 		false, 
				isHome: 		isHome,
				descricao: 		dados[5].value,
				children: 		[],
				pai: 			pai,
				url: 			url, 
				conteudo: 		$('#poc-content').html()
			};

		}else{
			pagina = {
				id: 			(lastId + 1),
				nome: 			nome,
				isHome: 		false,
				isLink: 		true,
				descricao: 		dados[5].value,
				children: 		[],
				pai: 			pai,
				url: 			url, 
				conteudo: 		""
			};
		}

		if(alterarPagina > 0){
			var paginaTemp = getPagina(paginas, alterarPagina);
			paginaTemp.nome = pagina.nome;
			paginaTemp.isLink = pagina.isLink;
			paginaTemp.isHome = pagina.isHome;
			paginaTemp.descricao = pagina.descricao;
			paginaTemp.pai = pagina.pai;

			//se for onePage, o href é o id da section
			//caso contrário é apenas "#"
			if(onePage)paginaTemp.url = "#" + removerAcentosEspacos(paginaTemp.nome);

			removePageChild(paginas, paginaTemp);

			//Quando o pai for 0, indica que não há pai. Caso contrário, temos que inserir a nova página criada como filha do pai informado
			if(pai != 0)setPai(paginas, pai, paginaTemp, (posicao + 1));
			else{
				if(paginas.length <= posicao) paginas.push(paginaTemp);
				else paginas.splice(posicao-1, 0, paginaTemp);
			}

			$('#lista-paginas').empty();
			$('.poc-nav-pages').empty();


			if(!paginaTemp.isLink) openPage(paginaTemp);
			redefinirMenu(paginas,0);
			redefinirMenuHtml(paginas, 0, '.poc-nav-pages', onePage);

			alterarPagina = 0;
			return;
		}
		

		//Quando o pai for 0, indica que não há pai. Caso contrário, temos que inserir a nova página criada como filha do pai informado
		if(pai != 0)setPai(paginas, pai, pagina, (posicao + 1));
		else{
			if(paginas.length <= posicao) paginas.push(pagina);
			else paginas.splice(posicao-1, 0, pagina);
		}


		lastId = lastId + 1;

		$('#lista-paginas').empty();
		$('.poc-nav-pages').empty();


		if(dados[0].value == '0' && !onePage) openPage(pagina);
		redefinirMenu(paginas,0);
		redefinirMenuHtml(paginas, 0, '.poc-nav-pages', onePage);

		if(onePage) abrirPaginasOnePage();
		
	}
})

function removePageChild(lista, pagina){
	if(pagina.pai != 0){
		for(i in lista){
			if(lista[i].id == pagina.pai){
				for(j in lista[i].children){
					if(lista[i].children[j].id == pagina.id) {
						lista[i].children.splice(j, 1);
						break;
					}

				}
			}
			else if(lista[i].children.length > 0) {
				removePageChild(lista[i].children, pagina);
			}
		}
	}else{
		for(i in lista){
			if(lista[i].id == pagina.id) {
				lista.splice(parseInt(i), 1);
				break;
			}
		}
	}

	
}

function getPagina(lista, idPage){
	var retorno = "";
	for(i in lista){
		if(lista[i].id == idPage) return lista[i];
		else if(lista[i].children.length > 0) {
			retorno = getPagina(lista[i].children, idPage);

			if(retorno.length > 0) return retorno; 
		}
	}

	return retorno;
}


//faz com que a pagina atual sobreponha a página na lista
function salvarAlteracoes(lista, pagina){
	for(i in lista){
		if(lista[i].id == pagina.id) lista[i] = pagina
		else if(lista[i].children.length > 0) salvarAlteracoes(lista[i].children, pagina);
	}
}


function preencherModal(pagina){
	var isHome = '0'; pagina.isHome ? isHome = '1' : isHome = '0';
	$("#poc-form-add-page .grupo-tipo-pagina").hide();

	if(pagina.isLink){
		$("#poc-form-add-page #tipo-item").val('1');
		$("#poc-form-add-page #link").val(pagina.url);

	}else{
		$("#poc-form-add-page #tipo-item").val('0');
	}

	$("#poc-form-add-page #nome").val(pagina.nome);
	$("#poc-form-add-page #isHome").val(isHome);
	$("#poc-form-add-page #tipo-style-content").val('0');
	$("#poc-form-add-page #descricao").val(pagina.descricao);
	
	var pai = getPagina(paginas, pagina.pai);

	$("#poc-form-add-page #pai").find(':contains('+pai.nome+')').prop('selected', true);
	$("#poc-form-add-page #pai").change();

	var posicao = getPosicao(paginas, pagina);
	$("#poc-form-add-page #posicao").val(posicao.toString());
}

function getPosicao(lista, pagina){
	var retorno;

	if(pagina.pai == 0){
		for(i in lista) if(lista[i].id = pagina.id) return (i+1);
	}


	for(i in lista){
		if(lista[i].id = pagina.pai){
			for(j in lista[i].children){
				if(lista[i].children[j] == pagina.id) return (j+1);
			}
		}else if(lista[i].children.length > 0){
			retorno = getPosicao(lista[i].children, pagina);
		}
	}

	return retorno;

}


//verifica na lista, quantos itens são de fato páginas
function getNumberPages(lista){
	var retorno = 0;

	for(i in lista){
		if(!lista[i].isLink) retorno = retorno + 1;
		else if(lista[i].children.length > 0){
			retorno = retorno + getNumberPages(lista[i].children);
		}
	}

	return retorno;
}

function redirecionarFilhos(lista, pagina){
	if(pagina.pai == 0 && pagina.children.length > 0){
		paginas.push(pagina.children);
		return;
	}

	for(i in lista){
		if(lista[i].id == pagina.pai){
			lista[i].children.push(pagina.children);
			break;
		}else if(lista[i].children.length > 0){
			redirecionarFilhos(lista[i].children, pagina);
		}
	}
}

function removerPagina(lista, pagina){
	for(i in lista){
		if(lista[i].id == pagina.id){
			lista.splice(parseInt(i), 1);
			break;
		}else if(lista[i].children.length > 0){
			removerPagina(lista[i].children, pagina);
		}
	}
}



$(document).on('click', '.btn-editar-pagina', function(){
	alterarPagina = true;
	var id = parseInt($(this).parent().parent().data('id'));
	var pagina = getPagina(paginas, id);

	preencherModal(pagina);
	$('#add-page').modal('show');
})

$(document).on('click', '.btn-visualizar-pagina', function(){
	//salva as alterações da página atual e faz com que a página atual seja a do item clicado no menu
	salvarAlteracoes(paginas, paginaAtual);

	var id = parseInt($(this).parent().parent().data('id'));
	var pagina = getPagina(paginas, id);

	openPage(pagina);

	$('#lista-paginas').empty();
	$('.poc-nav-pages').empty();
	redefinirMenu(paginas,0);
	redefinirMenuHtml(paginas, 0, '.poc-nav-pages', onePage);
})

$(document).on('click', '.btn-remover-pagina', function(){
	var qtdPages = getNumberPages(paginas);

	if(qtdPages < 2) {
		alert('Não é possível excluir essa página! Motivo: Existe apenas este item como página e o número mínimo de páginas no projeto é 1.');
		return;
	}

	var confirma = window.confirm('Deseja realmente excluir esse item?');
	if(confirma == false) return;

	

	var id = parseInt($(this).parent().parent().data('id'));
	var pagina = getPagina(paginas, id);

	//passa o filhos do item a ser removido para o pai do mesmo
	if(pagina.children > 0) redirecionarFilhos(paginas, pagina);
	removerPagina(paginas, pagina); //remove a página 


	//abre a primeira página na lista
	for(i in paginas){

		if(!paginas[i].isLink) {
			if(pagina.isHome){
				setIsHomeFalse(paginas);
				paginas[i].isHome = true;
			}

			openPage(paginas[i]);

			break;
		}
	}


	//redefine os menus
	$('#lista-paginas').empty();
	$('.poc-nav-pages').empty();
	redefinirMenu(paginas,0);
	redefinirMenuHtml(paginas, 0, '.poc-nav-pages', onePage);
})


//define a ação de acordo com o item selecionado no select para tipo de site
function definarAcaoTipoSite(selecionado){

}

/* PROPRIEDADE COMPONENTES */

/* propriedades gerais  - texto */
$(document).on('shown.bs.modal', '#modalEditarTexto', function(){
	//insere o texto no formulário. Isso será executado em componentes que utilizam texto
	startwysiwyg();

	$('#poc-alterar-texto').code(summernote);	
})

$(document).on('click', '#btn-editar-texto-confirmar', function(){
	objetoAtual.find('.poc-texto').each(function(){
		$(this).html($('#poc-alterar-texto').code());
	});

	$('#poc-alterar-texto').destroy();
})

$(document).on('click', '#btn-editar-texto-cancelar', function(){
	$('#poc-alterar-texto').destroy();
})

/* fim das propriedades gerais  - texto */

/* PROPRIEDADES DO TÍTULO */

//altera o texto do título quando o usuário digitar ou colar algo no campo
$(document).on('change paste keyup', '#poc-form-propriedades-titulo #poc-titulo-texto', function(){
	var valor = $(this).val();
	
	objetoAtual.find('.poc-titulo').children().text(valor);
})

//insere a classe de alinhamento na div que circunda o titulo
$(document).on('change', '#poc-form-propriedades-titulo #poc-titulo-alinhamento', function(){
	var valor = $(this).val();

	objetoAtual.find('.poc-titulo').removeClass('text-center text-left text-right').addClass(valor);
})

//pega o texto do titulo e insere em uma nova tag <hx>
$(document).on('change', '#poc-form-propriedades-titulo #poc-titulo-tamanho', function(){
	var valor = $(this).val();
	var antigo = objetoAtual.find('.poc-titulo').children().text();
	var novo = $('<'+ valor + '/>').text(antigo);

	objetoAtual.find('.poc-titulo').html(novo);
})

/* FIM DAS PROPRIEDADES DO TÍTULO */

/*PROPRIEDADES DA IMAGEM*/
$(document).on('change', '#poc-form-propriedades-imagem #poc-imagem-selecionar', function(){
	objetoAtual.find('img').attr('src', $(this).val());
})

$(document).on('change', '#poc-form-propriedades-imagem #poc-imagem-estilo', function(){
	objetoAtual.find('img').removeClass('img-rounded img-circle img-thumbnail').addClass($(this).val());
})
/*FIM DAS PROPRIEDADES DA IMAGEM*/

/*PROPRIEDADES DA TABELA*/

function preencherTabela(){
	var titulos = []
	 $('#poc-form-propriedades-tabela #poc-tabela-titulos tbody tr').each(function(i,e){
	 	var titulo = $(this).first('td').text();
	 	titulos.push(titulo);
	 });

	var tabela = objetoAtual.find('table');

	//remove todo o conteúdo da tabela
	var corpoTabela = tabela.find('tbody');
	corpoTabela.empty();

	var cabecalhoTabela = tabela.find('thead');
	cabecalhoTabela.empty();

	//insere os títulos
	var temp = $('<tr />');
	for(var i=0; i<titulos.length; i++)temp.append('<th>'+titulos[i]+'</th>');
	cabecalhoTabela.append(temp);

	//insere o novo conteúdo com 3 linhas de exemplo
	for(var i=0; i<3; i++){
		var linha = $('<tr />');
		for(var j=0; j<titulos.length; j++){
			linha.append('<td>Conteúdo ' + (j+1) + '</td>');
		}
		corpoTabela.append(linha);
	}
}

//adiciona um novo título à tabela
$(document).on('click', '#poc-form-propriedades-tabela #btn-tabela-add-titulo', function(){
	var tabela = $('#poc-form-propriedades-tabela #poc-tabela-titulos');
	var valor = $('#poc-form-propriedades-tabela #poc-tabela-add-titulo');

	if(valor.val().trim() == ''){
		alert('Digite o título a ser inserido');
		return false;
	}


	var html = '<tr>\
					<td>'+valor.val()+'</td>\
					<td class="text-center">\
						<button class="btn btn-danger remover-titulo"><span class="glyphicon glyphicon-trash"></span></button>\
					</td>\
				</tr>'; 
	tabela.find('tbody').append(html);
	preencherTabela();
	valor.val('');

})

//remover um título
$(document).on('click', '#poc-form-propriedades-tabela .remover-titulo', function(e){
	e.preventDefault();

	var qtdLinhas = $(this).parents('tbody').find('tr').length;

	if(qtdLinhas > 1){
		$(this).parents('tr').remove();
		preencherTabela();	
	}
	
})

/*FIM DAS PROPRIEDADES DA TABELA*/



/* PROPRIEDADES DAS MINIATURAS */
$(document).on('change', '#poc-form-propriedades-miniaturas #poc-upload-miniaturas', function(e){
	uploadMiniaturas(e);
})


//upload de imagens
function uploadMiniaturas(e){
	var arquivo = e.target.files; 
	var url = 'upload_miniaturas.php?arquivo';

	var valor = new FormData();
	$.each(arquivo, function(chave, item){
		valor.append(chave, item);
	});
	
	
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'JSON',
		data: valor,
		processData: false,
		contentType: false,
		cache: false,

		success: function(data){

			if(data.success){
				var largura = $("#poc-form-propriedades-miniaturas #poc-miniaturas-largura");
				var valor = parseInt(largura.val());
				var divisao  = Math.round(12/valor);;
				
				var grupo;
				objetoAtual.find('.group-thumbnails').each(function(){
					grupo = $(this);
				});
				
				grupo.empty();

				for(i in data.imagem){
					//insere a pr

					var html = '<div class="col-md-'+divisao+'">' + 
									'<a href="#" class="thumbnail poc-single-miniatura">' + 
										'<img src="'+data.imagem[i]+'" alt="preview miniaturas" class="poc-previa-miniaturas" />' +
									'</a>' + 
								'</div>';

					grupo.append(html);

				}
			}else{
				alert('ERRO: ' + data.mensagem);
			}
		}
	});
}

$(document).on('change', '#poc-form-propriedades-miniaturas #poc-miniaturas-escala-cinza', function(){
	var valor = parseInt($(this).val());
	var add = false; valor == 0 ? add = false : add = true;

	objetoAtual.find('.group-thumbnails .poc-single-miniatura img').each(function(){
		$(this).toggleClass('item-gray', add);
	})

});

$(document).on('click','#poc-form-propriedades-miniaturas .miniaturas-largura-btn-up', function(){
	var miniaturas = $("#poc-form-propriedades-miniaturas #poc-miniaturas-largura");
	var valor = parseInt(miniaturas.val());

	if(valor === NaN || valor > 6) valor = 6;
	else valor = valor+1;

	miniaturas.val(valor);
	miniaturas.change();
})

//quando clicar no botão de diminuir, decrementa
$(document).on('click','#poc-form-propriedades-miniaturas .miniaturas-largura-btn-down', function(){
	var miniaturas = $("#poc-form-propriedades-miniaturas #poc-miniaturas-largura");
	var atual = parseInt(miniaturas.val());

	if(atual === NaN || ((atual-1) < 1)) atual = 1;
	else atual = atual-1;

	miniaturas.val(atual);
	miniaturas.change();
})

$(document).on('change paste keyup', '#poc-miniaturas-largura', function(){
	var valor = parseInt($(this).val());
	var grupo;
	var imagens = [];

	objetoAtual.find('.group-thumbnails').each(function(){
		grupo = $(this);
	});

	objetoAtual.find('.group-thumbnails .poc-single-miniatura img').each(function(){
		imagens.push($(this).prop('src'));
	})

	if(valor === NaN || valor < 1){
		$(this).val('1');
		$(this).change();
	} else if(valor > 6){
		$(this).val('6');
		$(this).change();
	}else {
		grupo.empty();
		var divisao = Math.round(12/valor);

		for(i in imagens){
			var html = '<div class="col-md-'+divisao+'">' + 
							'<a href="#" class="thumbnail poc-single-miniatura">' + 
								'<img src="'+imagens[i]+'" alt="preview miniaturas" class="poc-previa-miniaturas" />' +
							'</a>' + 
						'</div>';

			grupo.append(html);
		}


	}
})
/* FIM DAS PROPRIEDADES DAS MINIATURAS */

/* PROPRIEDADES DOS FORMULÁRIOS */
function setHelper(prop,form){
	var html="";
	switch(prop){
		case 'text':
			if(form == 'horizontal'){
				html = '<div class="form-group group-text">'+
	  						'<label class="col-sm-2 control-label" for="textinput">Rótulo</label> '+ 
	  						'<div class="col-sm-10"> '+
	  							'<input id="textinput" name="textinput" placeholder="placeholder" class="form-control" type="text"> '+
	  						'</div>'+
						'</div>';
			}else {
				html = '<div class="form-group group-text">'+
	  						'<label for="textinput">Text Input</label>'+
	  						'<input id="textinput" name="textinput" placeholder="placeholder" class="form-control" type="text"> '+
						'</div>';
			}

			return html;

		case 'password':
			if(form == 'horizontal'){
				html = '<div class="form-group group-password">'+
	  						'<label class="col-sm-2 control-label" for="passwordinput">Senha</label> '+ 
	  						'<div class="col-sm-10">'+
	  							'<input id="passwordinput" name="passwordinput" placeholder="placeholder" class="form-control" type="text">'+
	  						'</div>'+
						'</div>';
			}else {
				html = '<div class="form-group group-password">'+
	  						'<label for="passwordinput">Text Input</label>'+
	  						'<input id="passwordinput" name="passwordinput" placeholder="placeholder" class="form-control" type="text">'+
						'</div>';
			}

			return html;

		case 'textarea':
			if(form == 'horizontal'){
				html = '<div class="form-group group-textarea">'+
							'<label class="col-sm-2 control-label" for="textarea">Text Area</label>'+
							'<div class="col-sm-10">'+                     
								'<textarea class="form-control" id="textarea" name="textarea"></textarea>'+
							'</div>'+
						'</div>';

			}else {
				html = '<div class="form-group group-textarea">'+
							'<label for="textarea">Text Area</label>'+
							'<textarea class="form-control" id="textarea" name="textarea"></textarea>'+
						'</div>';
			}

			return html;

		case 'select':
			if(form == 'horizontal'){
				html = '<div class="form-group group-select">'+
							'<label class="col-sm-2 control-label" for="selectbasic">Select Basic</label>'+
							'<div class="col-sm-10">'+
								'<select id="selectbasic" name="selectbasic" class="form-control">'+
									'<option value="1">Option one</option>'+
									'<option value="2">Option two</option>'+
								'</select>'+
							'</div>'+
						'</div>';	
			}else{
				html = '<div class="form-group group-select">'+
							'<labelfor="selectbasic">Select Basic</label>'+
							'<select id="selectbasic" name="selectbasic" class="form-control">'+
								'<option value="1">Option one</option>'+
								'<option value="2">Option two</option>'+
							'</select>'+
						'</div>';
			}

			return html;

		case 'radio':
			if(form == 'horizontal'){
				html = '<div class="form-group group-radio">'+
							'<label class="col-sm-2 control-label" for="radios">Multiple Radios</label>'+
							'<div class="col-sm-10">'+
								'<div class="radio">'+
									'<label for="radios-0">'+
										'<input name="radios" id="radios-0" value="1" checked="checked" type="radio">Option one'+
									'</label>'+
								'</div>'+
								
								'<div class="radio">'+
									'<label for="radios-1">'+
										'<input name="radios" id="radios-1" value="2" type="radio">Option two'+
									'</label>'+
								'</div>'+
							'</div>'+
						'</div>';
			} else{
				html = '<div class="form-group group-radio">'+
							'<labelfor="radios">Multiple Radios</label>'+
							'<div class="radio">'+
								'<label for="radios-0">'+
									'<input name="radios" id="radios-0" value="1" checked="checked" type="radio">Option one'+
								'</label>'+
							'</div>'+
								
							'<div class="radio">'+
								'<label for="radios-1">'+
									'<input name="radios" id="radios-1" value="2" type="radio">Option two'+
								'</label>'+
							'</div>'+
						'</div>';
			}

			return html;

		case 'checkbox':
			if(form == 'horizontal'){
				html = '<div class="form-group group-checkbox">'+
							'<label class="col-sm-2 control-label" for="checkboxes">Multiple Checkboxes</label>'+
							'<div class="col-sm-10">'+
								'<div class="checkbox">'+
									'<label for="checkboxes-0">'+
										'<input name="checkboxes" id="checkboxes-0" value="1" type="checkbox">Option one'+
									'</label>'+
								'</div>'+
								'<div class="checkbox">'+
									'<label for="checkboxes-1">'+
										'<input name="checkboxes" id="checkboxes-1" value="2" type="checkbox">Option two'+
									'</label>'+
								'</div>'+
							'</div>'+
						'</div>';
			} else{
				html = '<div class="form-group group-checkbox">'+
							'<label for="checkboxes">Multiple Checkboxes</label>'+
							'<div class="checkbox">'+
								'<label for="checkboxes-0">'+
									'<input name="checkboxes" id="checkboxes-0" value="1" type="checkbox">Option one'+
								'</label>'+
							'</div>'+
							'<div class="checkbox">'+
								'<label for="checkboxes-1">'+
									'<input name="checkboxes" id="checkboxes-1" value="2" type="checkbox">Option two'+
								'</label>'+
							'</div>'+
						'</div>';
			}

			return html;

		case 'file':
			if(form=='horizontal'){
				html = '<div class="form-group group-file">'+
							'<label class="col-sm-2 control-label" for="filebutton">File Button</label>'+
							'<div class="col-sm-2">'+
								'<input id="filebutton" name="filebutton" class="input-file" type="file">'+
							'</div>'+
						'</div>';
			}else{
				html = '<div class="form-group group-file">'+
							'<label for="filebutton">File Button</label>'+
							'<input id="filebutton" name="filebutton" class="input-file" type="file">'+
						'</div>';
			}

			return html;

		case 'button':
			if(form=='horizontal'){
				html = '<div class="form-group group-button">'+
							'<label class="col-sm-2 control-label" for="singlebutton">Single Button</label>'+
							'<div class="col-sm-10">'+
								'<button id="singlebutton" name="singlebutton" class="btn btn-primary">Button</button>'+
							'</div>'+
						'</div>';
			}else {
				html = '<div class="form-group">'+
							'<button id="singlebutton" name="singlebutton" class="btn btn-primary">Button</button>'+
						'</div>';
			}

			return html;
	}

	return html;
}

function initDraggableForm(){
	
	var elemento = "";
	$('#modalAddItemFormulario #lista-input li').draggable({
		connectToSortable: '#poc-form-add-item-formulario',
		cancel: null,

		helper: function(){
			var data = $(this).data('prop');
			var objeto = setHelper(data, 'horizontal');

			return $(objeto);
		},

		revert: 'invalid',

	}).disableSelection();
	
	$('#modalAddItemFormulario #poc-form-add-item-formulario').sortable({
		revert: true,
		items: '.form-group',
		helper: 'clone',

		start: function(el, ui){
			elemento = setHelper($(ui.item).data('prop'), 'horizontal');
		},

		stop: function(el, ui){
			if(elemento.length > 0) $(ui.item).replaceWith(elemento);
			createPopoverForm();
		}
	});
}

//define o conteúdo do popover
function contentPopover(grupo){
	
	switch(grupo){
		case 'group-text': return getFormPopover('text');
		case 'group-password': return getFormPopover('text');
		case 'group-textarea': return getFormPopover('text');

		case 'group-radio': return getFormPopover('radio');
		case 'group-checkbox': return getFormPopover('radio');

		case 'group-select': return getFormPopover('select');
		case 'group-file': return getFormPopover('file');
		case 'group-button': return getFormPopover('button');

	}
	
	return "";
}

//define o conteúdo do popover
function getTypeForm(grupo){
	
	switch(grupo){
		case 'group-text': return 'text';
		case 'group-password': return 'text';
		case 'group-textarea': return 'text';

		case 'group-radio': return 'radio';
		case 'group-checkbox': return 'radio';

		case 'group-select': return 'select';
		case 'group-file': return 'file';
		case 'group-button': return 'button';

	}
	
	return "";
}

//inicializa o popover
function createPopoverForm(){
	var popover = $('#poc-form-add-item-formulario .form-group').popover({
		html: true,
		placement: 'right',
		content: 'body',
		content: function(){
			var classes = $(this).attr("class").split(/\s/);
			var last = classes[classes.length-1];
			return contentPopover(last);
		}
	}).on('shown.bs.popover', function(){
		var classes = $(this).attr("class").split(/\s/);
		var last = classes[classes.length-1];
		var el = $(this);
		var form = $(this).data('bs.popover').tip().find('.popover-content form');

		preencherForm(el, form, getTypeForm(last));

		form.find('#poc-form-popover-remover').click(function(){
			popover.popover('destroy');
			el.remove();
		});

		form.find('#poc-form-popover-confirmar').click(function(){
			refreshForm(el, form, getTypeForm(last));

			popover.popover('hide');	
		});

		form.find('#poc-form-popover-cancelar').click(function(){
			popover.popover('hide');
		});

	});
}

function removerAcentosEspacos( newStringComAcento ) {
	

	var string = newStringComAcento;

	string = string.replace(" ", '_'); //remove espaçoes em branco da string
	var mapaAcentosHex = {
		a : /[\xE0-\xE6]/g,
		e : /[\xE8-\xEB]/g,
		i : /[\xEC-\xEF]/g,
		o : /[\xF2-\xF6]/g,
		u : /[\xF9-\xFC]/g,
		c : /\xE7/g,
		n : /\xF1/g
	};
	 
	for ( var letra in mapaAcentosHex ) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace( expressaoRegular, letra );
	}
 
	return string.toLowerCase();
}


function preencherForm(el, form, tipo){
	switch(tipo){
		case 'text':
			form.find('#poc-form-popover-id').val(el.find('label').prop('for')); //identificador
			form.find('#poc-form-popover-label').val(el.find('label').text()); //rótulo
			form.find('#poc-form-popover-placeholder').val(el.find('input, textarea').prop('placeholder')); //pré-texto

			break;

		case 'radio':
			var opcoes = "";
			var valores = "";
			el.find('input').each(function(){
				opcoes = opcoes + $(this).parent().text() + '\n';
				valores = valores + $(this).val() + '\n';
			});

			form.find('#poc-form-popover-grupo').val(el.find('input').prop('name'));
			form.find('#poc-form-popover-label').val(el.find('label:first').text());
			form.find('#poc-form-popover-options').val(opcoes);
			form.find('#poc-form-popover-values').val(valores);

			el.find('.inline').length > 0 ? form.find('#poc-form-popover-format').val('1') : form.find('#poc-form-popover-format').val('0');

			break;

		case 'select':
			form.find('#poc-form-popover-id').val(el.find('label').prop('for')); //identificador
			form.find('#poc-form-popover-label').val(el.find('label').text()); //rótulo
			
			var opcoes = "";
			var valores = "";
			el.find('option').each(function(){
				opcoes = opcoes + $(this).text() + '\n';
				valores = valores + $(this).val() + '\n';
			});

			form.find('#poc-form-popover-options').val(opcoes);
			form.find('#poc-form-popover-values').val(valores);

			el.find('select:not([multiple])').length == 0 ? form.find('#poc-form-popover-format').val('1') : form.find('#poc-form-popover-format').val('0');

			break;

		case 'file':
			form.find('#poc-form-popover-id').val(el.find('label').prop('for')); //identificador
			form.find('#poc-form-popover-label').val(el.find('button').text()); //rótulo
			
			break;

		case 'button':
			form.find('#poc-form-popover-id').val(el.find('label').prop('for')); //identificador
			form.find('#poc-form-popover-label').val(el.find('button').text()); //rótulo
			form.find('#poc-form-popover-class').val(el.find('button').classList.toString());

			break;
	}
}


function refreshForm(el, form, tipo){
	switch(tipo){
		case 'text':

			var id = removerAcentosEspacos(form.find('#poc-form-popover-id').val());
			el.find('label').prop('for', id);
			el.find('input, textarea').prop('id', id).prop('name', id);

			el.find('label').html(form.find('#poc-form-popover-label').val());
			el.find('input, textarea').prop('placeholder', form.find('#poc-form-popover-placeholder').val());

			break;


		case 'radio':
			var html = ""; //conteudo com as opções
			
			//define se é radiobutton ou checkbox
			var tipo = 'radio'; 
			if(el.find('input[type="checkbox"]').length > 0) tipo = 'checkbox';

			//name do grupo
			var nome = removerAcentosEspacos(form.find('#poc-form-popover-grupo').val());
			
			//split com as opções e seus valores
			var opcoes = "";
			var valores = "";

			opcoes = form.find('#poc-form-popover-options').val().trim().split('\n');
			valores = form.find('#poc-form-popover-values').val().trim().split('\n');

			if(opcoes.length == 0) break;

			
			el.find('label:first').html(form.find('#poc-form-popover-label').val()); //altera a label
			var label = el.find('label:first');

			
			for(var i in opcoes){

				var valor = "";

				try{
					valor = valores[i];
				}catch(erro){
					valor ="";
				}

				if(form.find('#poc-form-popover-format').val() == '1'){
					html = html + '<label class="'+tipo+'-inline"><input type="'+tipo+'" value="'+valor+'" name="'+nome+'">'+opcoes[i]+'</label>';
				}else{
					html = html + '<div class="'+tipo+'"><label><input type="'+tipo+'" name="'+nome+'" value="'+valor+'">'+opcoes[i]+'</label></div>';
				}
			}

			el.empty();
			el.append(label);

			if($("#poc-form-propriedades-formularios #poc-formato-formulario").val() == 'horizontal')$('<div/>').addClass('col-md-9').append(html).appendTo(el);
			else el.append(html);
			
			break;
			

		case 'select':
			el.find('label').prop('for', form.find('#poc-form-popover-id').val());
			el.find('select').prop('id', form.find('#poc-form-popover-id').val()).prop('name', form.find('#poc-form-popover-id').val());
			
			el.find('label').html(form.find('#poc-form-popover-label').val());

			var opcoes = "";
			var valores = "";
			opcoes = form.find('#poc-form-popover-options').val().trim().split('\n');
			valores = form.find('#poc-form-popover-values').val().trim().split('\n');

			for(var i in opcoes){

				var valor = "";

				try{
					valor = valores[i];
				}catch(erro){
					valor ="";
				}

				html = html + '<option value="'+valor+'">'+opcoes[i]+'</option>';
			}

			el.find('select').html(html);
			form.find('#poc-form-popover-format').val() == '1' ? el.find('select').prop('multiple', 'multiple') : el.find('select').prop('multiple', '');

			break;

		case 'file':

			el.find('label').prop('for', form.find('#poc-form-popover-id').val());
			el.find('input').prop('id', form.find('#poc-form-popover-id').val()).prop('name', form.find('#poc-form-popover-id').val());
			el.find('label').html(form.find('#poc-form-popover-label').val());
			
			break;

		case 'button':
			el.find('button').prop('id', form.find('#poc-form-popover-id')
				.val()).html(form.find('#poc-form-popover-label').val());
			el.find('button').classList = form.find('#poc-form-popover-class').val();
			break;
	}
}

$(document).on('click', '#poc-form-add-item-formulario select, #poc-form-add-item-formulario input, #poc-form-add-item-formulario textarea, #poc-form-add-item-formulario button', function(e){
	e.preventDefault();
});

$(document).on('click', '#btn-confirmar-add-item-formulario', function(){
	objetoAtual.find('form').html($('#poc-form-add-item-formulario').html());
});


function addElementForm(form, lista, valor){
	form.empty();

	var grupo = $('<div/>').addClass('form-group');
	if(valor == 'normal') {
		lista.each(function(i,el){
			
			var elemento = $(this);
			if(elemento.is('label')) elemento.removeClass('control-label col-sm-2');

			grupo.append(elemento);

			
			if(i%2 != 0){
				form.append(grupo);
				grupo = $('<div/>').addClass('form-group');
				
			}
		})
	}
	else if(valor == 'inline'){
		lista.each(function(i, el){
			var elemento = $(this);
			if(elemento.is('label')) elemento.addClass('sr-only').removeClass('col-sm-2 control-label');
			
			grupo.append(elemento);

			if(i%2 != 0){
				form.append(grupo);
				grupo = $('<div/>').addClass('form-group');
				cont = 0;
			}
		});
	}else if(valor == 'horizontal'){
		lista.each(function(i,el){
			var elemento = $(this);
			if(elemento.is('label')) {
				elemento.classList = 'col-sm-2 control-label';
				grupo.append(elemento);
			}else $('<div/>').addClass('col-sm-10').append(elemento).appendTo(grupo); //cria uma div e adiciona no formulario
			

			if(i%2 != 0){
				form.append(grupo);
				grupo = $('<div/>').addClass('form-group');
				cont = 0;
			}
		});
	}
}

$(document).on('change', '#poc-form-propriedades-formularios #poc-formato-formulario', function(){
	var form = objetoAtual.find('form');
	var valor = $(this).val();

	//define a classe do formulario
	if(valor == 'normal')form.removeClass('form-horizontal form-inline');
	else if(valor == 'inline') form.removeClass('form-horizontal').addClass('form-inline');
	else if(valor == 'horizontal') form.removeClass('form-inline').addClass('form-horizontal');

	//lista com todos os itens do formulário
	var lista = objetoAtual.find('form')
	.find('label[for],input,textarea,select,button,div.checkbox,div.radio')
	.not(':input[type=checkbox], :input[type=radio]');

	addElementForm(form, lista, valor);

	//se o modal estiver aberto, então ele é refeito de acordo com o item selecionado
	if($('#modalAddItemFormulario').is(':visible')){
		var modalForm = $('#modalAddItemFormulario form');
		var listaModal = $('#modalAddItemFormulario form')
		.find('label[for],input,textarea,select,button,div.checkbox,div.radio')
		.not(':input[type=checkbox], :input[type=radio]');

		addElementForm(modalForm, listaModal, valor); 
	}
});

$(document).on('shown.bs.modal', '#modalAddItemFormulario', function(){
	$(this).find('form').html(objetoAtual.find('form').html());
	createPopoverForm();
})

/* FIM DAS PROPRIEDADES DOS FORMULÁRIOS */

/*PROPRIEDADES DAS REDES SOCIAIS - MINIATURAS */

$(document).on('click', '.componente-redes-sociais .group-thumbnails a', function(e){
	e.preventDefault();
})

//escala de cinza
$(document).on('change', '#poc-form-propriedades-redes-sociais #poc-social-medias-escala-cinza', function(){
	var valor = parseInt($(this).val());
	var add = false; valor == 0 ? add = false : add = true;

	objetoAtual.find('.group-thumbnails img').each(function(){
		$(this).toggleClass('item-gray', add);
	})

});


//toda vez que selecionar
$(document).on('change', '#poc-form-propriedades-redes-sociais input[type=checkbox]', function(){
	var selecionados = $('#poc-form-propriedades-redes-sociais input[type=checkbox]:checked'); //seleciona todos os inputs marcados
	
	if(selecionados.length == 0) {
		alert("Selecione pelo menos uma rede social");
		return false;
	}

	var grupo = objetoAtual.find('.group-thumbnails');
	grupo.empty(); //zera o box

	var pacote = $('#poc-form-propriedades-redes-sociais #poc-social-medias-pacote').val();
	var tamanho = $('#poc-form-propriedades-redes-sociais #poc-social-medias-tamanho').val();

	selecionados.each(function(i,e){
		var social = $(this).val();
		var link = $(this).parent().parent().find('input[type=text]').val().trim();

		if(link.length == 0) link = "#"; //se o link estiver vazio, coloca "#" no lugar
		var html = '<a href="'+link+'" data-prop="'+social+'">' +
						'<img src="img/social/'+pacote+'/'+tamanho+'/'+social+'.png" alt="'+social+'">'+
					'</a>';

		grupo.append(html);

	});

	$(this).parent().parent().find('input[type=text]').prop('disabled', !$(this).is(':checked')); //ativa ou não o campo de texto
	$('#poc-form-propriedades-redes-sociais #poc-social-medias-escala-cinza').change(); //insere ou não a escala em cinza
})

$(document).on('change paste keyup', '#poc-form-propriedades-redes-sociais input[type=text]', function(){
	var social = $(this).data('social');
	var link = $(this).val();

	if(link.length == 0) link = '#';

	objetoAtual.find('a[data-social="'+social+'"]').attr('href', link);
})

$(document).on('change','#poc-form-propriedades-redes-sociais #poc-social-medias-pacote', function(){
	var pasta = $(this).val();
	var select = $('#poc-form-propriedades-redes-sociais #poc-social-medias-tamanho');
	var tamanhos = [];

	var url = 'img/social/' + pasta;
	$.ajax({
		url: url,

		success: function(data){
			select.empty();
			//pega todas as pastas, excluindo o link Parent Folder
			$(data).find('a').each(function(indice, valor){
				if(indice > 0){
					var tamanho = this.href.replace(window.location.host, "").replace("http:///", "").trim().split('/');
					tamanhos.push(tamanho[tamanho.length-2]);
				}
			});

			tamanhos.sort(function(a,b){
				return (a.length - b.length);
			});

			for(var i=0; i< tamanhos.length; i++){
				select.append('<option value="'+tamanhos[i]+'">'+tamanhos[i] + 'x' + tamanhos[i] +'</option>');	
			}

			$('#poc-form-propriedades-redes-sociais input[type=checkbox]').change();

		}
	});
})

$(document).on('change', '#poc-form-propriedades-redes-sociais #poc-social-medias-tamanho', function(){
	$('#poc-form-propriedades-redes-sociais input[type=checkbox]').change();
});
/* FIM DAS PROPRIEDADES DAS REDES SOCIAIS - MINIATURAS */

/* PROPRIEDADE DO PAINEL - ESTÁTICO */

$(document).on('keyup change paste', '#poc-form-propriedades-painel-estatico #poc-prop-painel-estatico-titulo', function(){
	if($(this).val().length > 0){
		var tamanho = $('#poc-form-propriedades-painel-estatico #poc-prop-painel-estatico-tamanho');
		var titulo = $(tamanho.val()); //pega o <h$>
		titulo.html($(this).val());
		objetoAtual.find('.panel-heading').html(titulo);
		$('#poc-form-propriedades-painel-estatico #poc-prop-painel-estatico-centralizado').change();
	}
})

$(document).on('change', '#poc-form-propriedades-painel-estatico #poc-prop-painel-estatico-tamanho', function(){
	var tituloAtual = objetoAtual.find('.panel-heading').children().text();
	
	var titulo = $($(this).val()); //pega o <h$>
	titulo.html(tituloAtual);
	objetoAtual.find('.panel-heading').html(titulo);
	$('#poc-form-propriedades-painel-estatico #poc-prop-painel-estatico-centralizado').change();
})

$(document).on('change', '#poc-form-propriedades-painel-estatico #poc-prop-painel-estatico-centralizado', function(){
	var add = false;

	if($(this).val() == '1') add = true;

	objetoAtual.find('.panel-heading').children().toggleClass('text-center', add);
})

$(document).on('change', '#poc-form-propriedades-painel-estatico #poc-prop-painel-estatico-estilo', function(){
	objetoAtual.find('.panel').removeClass().addClass($(this).val());
})
/* FIM DAS PROPRIEDADES DO PAINEL */

/* PROPRIEDADE DO MAPA - LOCALIZAÇÃO */
function criarMapa(){
	var divMapa = $('.componente-mapa-google');
	//google maps
	if(divMapa.length > 0 && divMapa.find('#poc-mapa-google').data('mapa-id') == ""){
		var dados = new Object();
		dados.mapa = '';
		dados.localizacao = '';
		
		listaMapas.push(dados);
		
		inicializarMapa(listaMapas.length-1, divMapa.find('#poc-mapa-google'));
		divMapa.find('#poc-mapa-google').attr('data-mapa-id', listaMapas.length-1);
	}
}


//el é um objeto jQuery. Para inicializar o mapa é necessário um DOM. 
function inicializarMapa(posicao, el){
	listaMapas[posicao].localizacao = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(-21.2384544, -44.2790787);
 	
    var options = {
        zoom: 10,
        center: latlng
    };
 
    listaMapas[posicao].mapa = new google.maps.Map(el[0], options);
}


function codeAddress(posicao, endereco) {

	listaMapas[posicao].localizacao.geocode({'address': endereco}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			listaMapas[posicao].mapa.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: listaMapas[posicao].mapa,
				position: results[0].geometry.location
			});
		} else {
			alert('Erro ao localizar o endereço desejado.');
		}
	});
}

$(document).on('click', '#poc-form-propriedades-mapa-google #btn-confirmar-endereco', function(){
	var posicao = parseInt(objetoAtual.find('#poc-mapa-google').attr('data-mapa-id'));
	var endereco = $(this).parent().parent().find('input[type=text]').val();

	codeAddress(posicao, endereco);
});

/*FIM DAS PROPRIEDADES DO MAPA - GOOGLE */

/*PROPRIEDADES DOS VÍDEOS */
function getIdVideo(linkVideo){
	var id = linkVideo.split('v=');

	if(id.length < 2) return false;

	id = id[1];

	var sublink = id.indexOf('&');
	if(sublink != -1){
		id = id.substring(0, sublink);
	}

	return id;
}

$(document).on('click', '#poc-form-propriedades-video #btn-confirmar-link', function(){
	var link = $('#poc-form-propriedades-video #poc-video-link').val().trim();

	var idVideo = getIdVideo(link);

	if(!idVideo) alert('Link informado é inválido!');
	else{
		objetoAtual.find('iframe').prop('src', '//www.youtube.com/embed/' + idVideo)
		$('#poc-form-propriedades-video #poc-video-tamanho').change();
	}
});

$(document).on('change', '#poc-form-propriedades-video #poc-video-tamanho', function(){
	var dados = $(this).val().trim().split(' ');
	var largura = dados[0], altura = dados[1];

	objetoAtual.find('iframe').prop('width', largura).prop('heigth', altura);
});
/*FIM DAS PROPRIEDADES DOS VÍDEOS*/

/* PROPRIEDADES DA CATEGORIA DE BLOG */
$('#poc-form-propriedades-categoria-blog #btn-limpar-campo').click(function(){
	$('#poc-form-propriedades-categoria-blog #poc-categoria-blog-cor-titulos').val('#000000');
})

$(document).on('click', '.pagination a', function(e){
	e.preventDefault();
});

$(document).on('change', '#poc-form-propriedades-categoria-blog #poc-categoria-blog-alinhamento', function(){
	var valor = $(this).val().split(' ');

	var html = '';
	for(var i=0; i<6; i++){
		html = html + 
			'<li class="media">'+
				'<a class="'+valor[i%valor.length]+'" href="#">'+
					'<img class="media-object" src="img/logolinked.png" alt="miniatura">'+
				'</a>'+
				'<div class="media-body">'+
					'<h4 class="media-heading">Título do Item</h4>'+
					'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam'+
				'</div>'+
			'</li>';
	}

	objetoAtual.find('.media-list').html(html);
})

$(document).on('change', '#poc-form-propriedades-categoria-blog #poc-categoria-blog-tipo-paginacao', function(){
	var valor = parseInt($(this).val());

	var pager = '<ul class="pager">'+
					'<li class="previous"><a href="#">&larr; Anterior</a></li>'+
					'<li class="next"><a href="#">Próximo &rarr;</a></li>'+
				'</ul>';

	var padrao =  '<ul class="pagination">' +
					'<li class="disabled"><a href="#">&laquo;</a></li>'+
					'<li class="active"><a href="#">1</a></li>'+
					'<li><a href="#">2</a></li>'+
					'<li><a href="#">3</a></li>'+
					'<li><a href="#">4</a></li>'+
					'<li><a href="#">5</a></li>'+
					'<li><a href="#">&raquo;</a></li>'+
				'</ul>';

	switch(valor){
		case 0:
			objetoAtual.find('.poc-content-pagination').html(padrao);
			break;
		case 1:
			objetoAtual.find('.poc-content-pagination').html(pager);
			break;
	}
})

$(document).on('change', '#poc-form-propriedades-categoria-blog #poc-categoria-blog-tamanho-paginacao', function(){
	var valor = $(this).val();

	objetoAtual.find('.pagination').removeClass().addClass(valor);
})
/* FIM DAS PROPRIEDADES DA CATEGORIA DE BLOG */

/* PROPRIEDADES DO SLIDESHOW */

$(document).on('change', '#poc-form-propriedades-slideshow #poc-tipo-slideshow', function(){
	var valor = $(this).val();

	if(valor == '0') {
		$('#poc-form-propriedades-slideshow .grupo-slideshow').show();
		objetoAtual.find('#poc-carousel-example').show();
		objetoAtual.find('#poc-accordion-example').hide();
	} else {
		$('#poc-form-propriedades-slideshow .grupo-slideshow').hide();
		objetoAtual.find('#poc-carousel-example').hide();
		objetoAtual.find('#poc-accordion-example').show();
		startAccordion();
	}
});

$(document).on('change', '#poc-form-propriedades-slideshow #poc-upload-slideshow', function(e){
	uploadImagensSlides(e);
});

function criarSlideShow(data){
	var lista = '', item = '', classe = '';
	for(var i=0; i<data.imagem.length; i++){
		(i == 0) ? classe = 'active' : classe = '';
		lista = lista + '<li data-target="#poc-carousel-example" data-slide-to="0" class="'+classe+'"></li>';
		item = item + 
		'<div class="item '+classe+'">' + 
			'<img src="'+data.imagem[i]+'" alt="slideshow">'+
			'<div class="container">'
				'<div class="carousel-caption">'
					'<h1>Example headline.</h1>'+
					'<p>Note: If you\'re viewing this page via a <code>file://</code> URL, the "next" and "previous" Glyphicon buttons on the left and right might not load/display properly due to web browser security rules.</p>'+
					'<p><a class="btn btn-lg btn-primary" href="#" role="button">Sign up today</a></p>'+
				'</div>'+
			'</div>'+
		'</div>';
	}

	objetoAtual.find('ol').html(lista);
	objetoAtual.find('.carousel-inner').html(item);
	
}

function startAccordion(){
	var altura = parseInt($('#poc-form-propriedades-slideshow #poc-altura-slideshow').val());
	var largura = parseInt(objetoAtual.css('width').replace('px',''))-33;
	

	objetoAtual.find('#poc-accordion').zAccordion({
		tabWidth: 100,
		speed: 650,
		slideClass: 'slider',
		animationStart: function () {
			objetoAtual.find('#poc-accordion li.slider-open div').css('display', 'none');
			objetoAtual.find('#poc-accordion li.slider-previous div').css('display', 'none');
		},
		animationComplete: function () {
			objetoAtual.find('#poc-accordion li div').fadeIn(600);
		},

		width: largura,
		height: altura
	});
}

function criarAccordion(data){
	var html = '';

	for(var i=0; i<data.imagem.length; i++){
		html = html +
		'<li>'+
			'<img src="'+data.imagem[i]+'" alt="slideshow">'+
			'<div>'+
				'<strong>Titulo '+(i+1)+'</strong>'+
				'<p>Exemplo de conteúdo com um pouco mais de texto</p>'+
			'</div>'+
  		'</li>';
	}

	objetoAtual.find('#poc-accordion').html(html);
}

//upload de imagens
function uploadImagensSlides(e){
	var arquivo = e.target.files; 
	console.log(arquivo);
	var url = 'upload_slideshow.php?arquivo';

	var valor = new FormData();
	$.each(arquivo, function(chave, item){
		valor.append(chave, item);
	});
	
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'JSON',
		data: valor,
		processData: false,
		contentType: false,
		cache: false,

		success: function(data){

			if(data.success){
				//refaz o slideshow
				criarSlideShow(data);
				criarAccordion(data);
				$('#poc-form-propriedades-slideshow #poc-tipo-slideshow').change();
			}else{
				alert('ERRO: ' + data.mensagem);
			}
		}
	});
}

//alteração da altura do slideshow
$(document).on('click','#poc-form-propriedades-slideshow .poc-altura-slideshow-btn-up', function(){
	var slideshow = $("#poc-form-propriedades-slideshow #poc-altura-slideshow");
	var valor = parseInt(slideshow.val());

	if(valor === NaN || valor > 1500) valor = 1500;
	else valor = valor+1;

	slideshow.val(valor);
	slideshow.change();
})


$(document).on('click','#poc-form-propriedades-slideshow .poc-altura-slideshow-btn-down', function(){
	var slideshow = $("#poc-form-propriedades-slideshow #poc-altura-slideshow");
	var atual = parseInt(slideshow.val());

	if(atual === NaN || ((atual-1) < 500)) atual = 500;
	else atual = atual-1;

	slideshow.val(atual);
	slideshow.change();
})

function alterarAlturaSlideshow(valor){
	objetoAtual.find('.carousel-inner, .item, .item img, .carousel-control, .carousel').css('cssText','height: ' + valor + 'px !important');
	objetoAtual.find('ol').css('bottom', 0);
}

$(document).on('change paste keyup', '#poc-form-propriedades-slideshow #poc-altura-slideshow', function(){
	//aumentar a altura do slideshow, chamar novamente o zAccordion com a altura atual e chamar o change
	alterarAlturaSlideshow($(this).val());
	$('#poc-form-propriedades-slideshow #poc-tipo-slideshow').change();
})
//fim da alteração da altura do slideshow


//alteração do left do caption
$(document).on('click','#poc-form-propriedades-slideshow .poc-left-slideshow-btn-up', function(){
	var slideshow = $("#poc-form-propriedades-slideshow #poc-left-slideshow");
	var valor = parseInt(slideshow.val());

	if(valor === NaN || valor > 100) valor = 100;
	else valor = valor+1;

	slideshow.val(valor);
	slideshow.change();
})


$(document).on('click','#poc-form-propriedades-slideshow .poc-left-slideshow-btn-down', function(){
	var slideshow = $("#poc-form-propriedades-slideshow #poc-left-slideshow");
	var atual = parseInt(slideshow.val());

	if(atual === NaN || ((atual-1) < 0)) atual = 0;
	else atual = atual-1;

	slideshow.val(atual);
	slideshow.change();
})

$(document).on('change paste keyup', '#poc-form-propriedades-slideshow #poc-left-slideshow', function(){
	objetoAtual.find('.carousel-caption').css('left', $(this).val()+'%');
	$('#poc-form-propriedades-slideshow #poc-tipo-slideshow').change();
})
//fim da alteração do left

//alteração do right do caption
$(document).on('click','#poc-form-propriedades-slideshow .poc-right-slideshow-btn-up', function(){
	var slideshow = $("#poc-form-propriedades-slideshow #poc-right-slideshow");
	var valor = parseInt(slideshow.val());

	if(valor === NaN || valor > 100) valor = 100;
	else valor = valor+1;

	slideshow.val(valor);
	slideshow.change();
})

$(document).on('click','#poc-form-propriedades-slideshow .poc-right-slideshow-btn-down', function(){
	var slideshow = $("#poc-form-propriedades-slideshow #poc-right-slideshow");
	var atual = parseInt(slideshow.val());

	if(atual === NaN || ((atual-1) < 0)) atual = 0;
	else atual = atual-1;

	slideshow.val(atual);
	slideshow.change();
})

$(document).on('change paste keyup', '#poc-form-propriedades-slideshow #poc-right-slideshow', function(){
	objetoAtual.find('.carousel-caption').css('right', $(this).val()+'%');
	$('#poc-form-propriedades-slideshow #poc-tipo-slideshow').change();
})
//fim da alteração do right

//alteração do top do caption
$(document).on('click','#poc-form-propriedades-slideshow .poc-top-slideshow-btn-up', function(){
	var slideshow = $("#poc-form-propriedades-slideshow #poc-top-slideshow");
	var valor = parseInt(slideshow.val());

	if(valor === NaN || valor > 2048) valor = 2048;
	else valor = valor+1;

	slideshow.val(valor);
	slideshow.change();
})


$(document).on('click','#poc-form-propriedades-slideshow .poc-top-slideshow-btn-down', function(){
	var slideshow = $("#poc-form-propriedades-slideshow #poc-top-slideshow");
	var atual = parseInt(slideshow.val());

	if(atual === NaN || ((atual-1) < 0)) atual = 0;
	else atual = atual-1;

	slideshow.val(atual);
	slideshow.change();
})

$(document).on('change paste keyup', '#poc-form-propriedades-slideshow #poc-top-slideshow', function(){
	objetoAtual.find('.carousel-caption').css('top', $(this).val()+'px');
	$('#poc-form-propriedades-slideshow #poc-tipo-slideshow').change();
})
//fim do top

//alinhamento
$(document).on('change', '#poc-form-propriedades-slideshow #poc-alinhamento-caption-slideshow', function(){
	objetoAtual.find('.carousel-caption').css('text-align', $(this).val());
})

function preencherForm(form){
	objetoAtual.find('.carousel-inner .item').each(function(i,e){
		form.find('#title'+i).val($(this).find('h1').html());
		form.find('#texto'+i).val($(this).find('.content').text().trim());
	})
}

function criarForm(){
	var qtd = objetoAtual.find('.carousel-inner img').length;
	var form = $('#modalTitulosSlideshow #poc-form-slideshow');
	var html = '';

	for(var i=0; i<qtd; i++){
		html = html+
		'<div class="form-group">' +
			'<label for="title'+i+'">Título '+(i+1)+'</label>'+
			'<input type="text" id="title'+i+'" name="title'+i+'" class="form-control">'+
		'</div>'+

		'<div class="form-group">' +
			'<label for="texto'+i+'">Conteúdo '+(i+1)+'</label>'+
			'<textarea id="texto'+i+'" name="texto'+i+'" class="form-control"></textarea>'+
		'</div>';
	}

	form.html(html);
	preencherForm(form);
}

$(document).on('shown.bs.modal', '#modalTitulosSlideshow', function(){
	criarForm();
})

$(document).on('hide.bs.modal', '#modalTitulosSlideshow', function(){
	var valores = $('#modalTitulosSlideshow form').find('input, textarea');

	preencherCaptionSlideshow(valores);
	preencherCaptionAccordion(valores);
});

function preencherCaptionSlideshow(valores){
	objetoAtual.find('.carousel-inner .item').each(function(i, e){
		$(this).find('h1').html(valores[i*2].value);

		$(this).find('.content').empty();
		$('<p />').append(valores[(i*2) + 1].value).appendTo($(this).find('.content'));
	});
}

function preencherCaptionAccordion(valores){
	objetoAtual.find('#poc-accordion li').each(function(i, e){
		var div = $(this).find('div');

		//se existir a div, limpa e insere novamente o <strong>, representando o titulo e <p> representando o subtítulo
		if(div.length > 0){
			div.empty();

			$('<strong />').append(valores[i*2].value).appendTo(div);
			$('<p />').append(valores[(i*2) +1].value).appendTo(div);
		}else{
			//cria a div com o novo conteúdo e insere no li
			div = $('<div />');
			$('<strong />').append(valores[i*2].value).appendTo(div);
			$('<p />').append(valores[(i*2) +1].value).appendTo(div);

			div.appendTo($(this));
		}
	});
}
/* FIM DAS PROPRIEDADES DO SLIDESHOW */

/* PROPRIEDADE DAS GALERIAS DE IMAGEM */

//inicializa o lightbox
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) { event.preventDefault(); $(this).ekkoLightbox(); }); 

//ao clicar no botão para criar uma nova galeria, preenche-se o select com todos as imagens da biblioteca do usuário.
function preencherSelectBiblioteca(el, selecionadas, capa){
	var html = '';
	var caminho = 'img/biblioteca/';
	var extensao = '.png';
	var capa = $('#modalCriarGaleria #poc-capa-galeria');
	$.ajax({
		url: caminho,
		success: function(data){
			$(data).find("a:contains(.png), a:contains(.jpg)").each(function(indice, valor){
				var link = $(this).attr('href');
				html += '<option data-img-src="'+caminho+link+'" value="'+caminho+link+'">';
			});

			el.html(html);

			if(typeof(selecionados) !== "undefined" && typeof(capa) !== 'undefined'){
				el.val(selecionados); //seleciona as fotos desejadas

				//preenche o select e seleciona a capa
				capa.empty();
				for(var i=0; i<selecionados.length; i++)capa.append('<option data-img-src="'+selecionados[i]+'" value="'+selecionados[i]+'">');
				capa.val(capa);
				capa.imagepicker();
			}

			el.imagepicker();
			$('input[type=file]').bootstrapFileInput();
		}
	});	
}

$(document).on('change', '#modalCriarGaleria #poc-lista-imagens-biblioteca', function(){
	var capa = $('#modalCriarGaleria #poc-capa-galeria');
	var html = '';
	var selecionados = $(this).val();

	for(var i=0; i<selecionados.length; i++) html += '<option data-img-src="'+selecionados[i]+'" value="'+selecionados[i]+'">';

	capa.html(html);
	capa.imagepicker();
})

$(document).on('click', '#btnAddGaleria', function(){
	var el = $("#modalCriarGaleria #poc-lista-imagens-biblioteca");
	preencherSelectBiblioteca(el);
})


function criarGaleriaExpandida(titulo, fotos, capa, atualizar){
	var html = '<div class="row">';

	var galeria = removerAcentosEspacos(titulo);
	var isCapa = 'false';

	for(var i=0; i<fotos.length; i++){
		fotos[i] == capa ? isCapa = 'true' : 'false';
		html += '<a class="col-md-3 col-sm-4 col-xs-6" data-toggle="lightbox" data-gallery="'+galeria+'" href="'+fotos[i]+'" data-capa="'+isCapa+'">'+
					'<img class="img-responsive" src="'+fotos[i]+'" alt="'+galeria+'">'+
				'</a>';
	}

	html += '</div>';

	if(atualizar){
		objetoAtual.find('.poc-galeria-imagens-expandido .row').each(function(i,e){
			if(i == idGaleria) {
				$(this).parent().parent().find('h1').html(titulo);
				$(this).replaceWith(html);
				return false;
			}
		})

		return;		
	}

	//string que representa um panel vazio
	var temp = '<div class="panel panel-primary">'+
					'<div class="panel-heading"><h1 class="panel-title">'+titulo+'</h1></div>'+
						'<div class="panel-body"></div>'+
					'</div>'+
				'</div>';

	var panel = $(temp);

	panel.find('.panel-body').html(html); //insere a galeria no painel


	//insere o painel no componente
	if($('#poc-form-propriedades-galeria-imagens table tbody tr').length < 2) objetoAtual.find('.poc-galeria-imagens-expandido').html(panel);
	else objetoAtual.find('.poc-galeria-imagens-expandido').append(panel);
}

function criarGaleriaReduzida(titulo, fotos, capa, atualizar){
	var html = '<div class="col-xs-12 col-sm-6 col-md-3 item-reduzido">' + 
					'<div class="panel panel-default">'+
						'<div class="panel-body">';
	var galeria = removerAcentosEspacos(titulo);
	var classe = "";
	var isCapa = 'false';
	for(var i=0; i<fotos.length; i++){
		if(fotos[i] == capa){
			classe = ''; isCapa = 'true';
		}else{
			classe = 'oculta'; isCapa = 'false';
		}

		html += 			'<a href="'+fotos[i]+'" class="zoom '+classe+'" data-toggle="lightbox" data-gallery="'+galeria+'" >'+
								'<img class="img-responsive" src="'+fotos[i]+'" alt="'+titulo+'" />'+
								'<span class="overlay"><i class="glyphicon glyphicon-fullscreen"></i></span>'+
							'</a>';
	}

	html += 			'</div>'+
						'<div class="panel-footer">'+
							'<h4>'+titulo+'</h4>'+
						'</div>' + 
					'</div>'+
				'</div>';

	if(atualizar){
		objetoAtual.find('.poc-galeria-imagens-reduzido .item-reduzido').each(function(i,e){
			if(i == idGaleria) {
				$(this).replaceWith(html);
				return false;
			}
		})

		return;		
	}

	if($('#poc-form-propriedades-galeria-imagens table tbody tr').length < 2) objetoAtual.find('.poc-galeria-imagens-reduzido').html(html);
	else objetoAtual.find('.poc-galeria-imagens-reduzido').append(html);

}

$(document).on('click', '#modalCriarGaleria #btn-confirmar-add-galeria', function(){
	
	var titulo = $("#modalCriarGaleria #poc-galeria-titulo").val();
	var fotos = $("#modalCriarGaleria #poc-lista-imagens-biblioteca").val();
	var capa = $("#modalCriarGaleria #poc-capa-galeria").val();


	console.log(alterarGaleria);
	if(alterarGaleria){
		criarGaleriaExpandida(titulo, fotos, capa, true);
		criarGaleriaReduzida(titulo, fotos, capa, true);
		idGaleria = -1; alterarGaleria = false;
		return false;
	}

	var qtd = $('#poc-form-propriedades-galeria-imagens table tbody').find('tr').length;

	/* Titulo
		1 - insere a galeria na tabela
		2 - preenche o componente com a nova galeria nos dois formataos
		3 - exibe o formato selecionado pelo usuário
	*/

	var linha = '<tr data-id="'+qtd+'">' +
					'<td><a href="#" data-toggle="modal" data-target="#modalCriarGaleria" class="poc-alterar-galeria">' + titulo + '</a></td>' + 
					'<td>'+
					'<a href="#" class="poc-remover-galeria"><span class="glyphicon glyphicon-remove"></span></a>'+
					'</td>'+
				'</tr>';
	$('#poc-form-propriedades-galeria-imagens table tbody').append(linha);

	criarGaleriaExpandida(titulo, fotos, capa, false);
	criarGaleriaReduzida(titulo, fotos, capa, false);

	$('#poc-form-propriedades-galeria-imagens #poc-tipo-galeria-imagens').change();
})

$(document).on('change', '#poc-form-propriedades-galeria-imagens #poc-tipo-galeria-imagens', function(){
	var valor = $(this).val();

	if(valor == '0'){
		objetoAtual.find('.poc-galeria-imagens-reduzido').hide();
		objetoAtual.find('.poc-galeria-imagens-expandido').show();
	}else{
		objetoAtual.find('.poc-galeria-imagens-reduzido').show();
		objetoAtual.find('.poc-galeria-imagens-expandido').hide();
	}
})

$(document).on('click', '#poc-form-propriedades-galeria-imagens .poc-remover-galeria', function(){
	var posicao = parseInt($(this).parent().parent().data('id')); //o data-id representa a posição da galeria, iniciando de 0
	console.log(posicao);
	if($('#poc-form-propriedades-galeria-imagens table tbody tr').length == 1){
		alert('Não é possivel excluir está galeria, pois não existem outras cadastradas');
		return false;
	}

	objetoAtual.find('.poc-galeria-imagens-expandido .panel').each(function(i,e){
		if(i == posicao) {
			$(e).remove();
			return false;
		}
	});


	objetoAtual.find('.poc-galeria-imagens-reduzido .item-reduzido').each(function(i,e){
		if(i == posicao) {
			$(e).remove();
			return false;
		}
	});

	$(this).parent().parent().remove();

	$('#poc-form-propriedades-galeria-imagens table tbody tr').each(function(i,e){
		$(e).attr('data-id', i.toString());
	})
})

$(document).on('click', '#poc-form-propriedades-galeria-imagens .poc-alterar-galeria', function(){
	idGaleria = parseInt($(this).parent().parent().data('id')); //o data-id representa a posição da galeria, iniciando de 0
	alterarGaleria = true;
})

/* SITES ONE PAGE */

//inicia o efeito do menu para sites onepage
function initOnePage(){
	$('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
}
//caso o tipo de escolha do site seja o onepage, executa esta função
//Esta função carrega o conteúdo inicial do template freelancer e abre dentro da div #poc-page
function tipoOnePage(){
	$('#poc-page').load('onepage.html', function(){
		var home = {
			id: 			1,
			nome: 			"Home",
			isHome: 		true,
			isLink: 		false, 
			descricao: 		"Página Inicial do Seu Projeto",
			children: 		[],
			pai: 			0,
			url: 			"#home", 
			conteudo: 		'',
		};

		paginas.push(home);
		
		$('#lista-paginas').empty();
		$('.poc-nav-pages').empty();
		paginaAtual = home;

		redefinirMenu(paginas, 0);
		redefinirMenuHtml(paginas, 0, '.poc-nav-pages', onePage);
		abrirPaginasOnePage();
		
		//depois que for escolhido o tipo de layout, insere as funcionalidades para os componentes
		addDraggableToComponents();//capacidade de arrastar
		addSortableToComponents(".coluna, .poc-content"); //elementos que vão receber os conteúdos arrastaveis
		
		addBotaoPropriedade("#poc-page", "pagina");
		addBotaoPropriedade(".poc-content", "pagina");
		addBotaoPropriedade("#poc-menu", "menu");

		addSidrToComponents(); //exibição das propriedades ao clicar no componente

		initOnePage(); 
	});
}

//insere todas as páginas dentro do conteudo gerado
function abrirPaginasOnePage(){
	var site = $('#poc-page');
	site.find('section').remove();

	for(i in paginas){
		var page = $('<section />')
					.prop('id', removerAcentosEspacos(paginas[i].nome))
					.attr('data-content', 'Página - ' + paginas[i].nome)
					.addClass('poc-content')
					.append(paginas[i].conteudo)
					.appendTo(site);
	}

	addDraggableToComponents();//capacidade de arrastar
	addSortableToComponents(); //elementos que vão receber os conteúdos arrastaveis
}

/* FIM SITES ONE PAGE */

//pega o html de todas as section e insere na lista de páginas
function salvarAlteracoesOnePage(){
	$('#poc-page').find('section').each(function(){
		var id = $(this).prop('id');
		var html = $(this).html();
		for(i in paginas){
			if(paginas[i].url == '#'+id) paginas[i].conteudo = html;
		}
	});
}


//insere a pagina1 no lugar da pagina2
function trocarPagina(lista, pagina1, pagina2){
	for(i in lista){
		if(lista[i].id == pagina2.id) lista[i] = pagina1;
		else if(lista[i].children.length > 0) trocarPagina(lista[i].children, pagina1, pagina2);
	}
}

function salvarAlteracoesEstiloLivre(){
	paginaAtual.conteudo = $('#poc-content').html();
	salvarAlteracoes(paginas, paginaAtual);
}

//salva as alterações que são feitas no #poc-content, para sites estilo livre, e .poc-content para sites One Page
function salvarAlteracoesSite(){
	if(onePage) salvarAlteracoesOnePage();
	else salvarAlteracoesEstiloLivre();
}

$(document).on('click', '.remover-componente', function(e){
	e.preventDefault();

	if(confirm("Deseja realmente excluir esse componente?")){
		$(this).parent().parent().remove();
		salvarAlteracoesSite();
		
	}
})


$(document).on('click', '.btn-close-form', function(e){
	e.preventDefault();
	botaoAtual.click();
})

/*FUNCOES PARA EXPORTAR PARA O HTML */
//converte os dados das páginas para um formato a ser enviado para o arquivo php
function obterDadosPagina(lista){
	var modelos = []; //lista com as paginas

	for(i in lista){
		var obj = new Object();
		//se for um link, então não há a necessidade de criar arquivos
		if(!lista[i].isLink){

			var init = '<div id="poc-export-html"></div>';
			var page = $(init);
			
			//html com o head
			var cabecalhoDoc = 
					//tag meta
	'\t<meta charset="utf-8">\n \
	<meta http-equiv="cache-control" content="no-cache">\n \
	<meta http-equiv="expires" content="0">\n \
	<meta http-equiv="pragma" content="no-cache">\n \
	\n\
	<title>' + lista[i].nome+'</title>\n \
	\n \
	\n \
	<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">\n \
	<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">\n\
	<link rel="stylesheet" href="css/base.css">\n';
			
			page.append('<div id="poc-export-head">' + cabecalhoDoc + '</div>');

			//pega tudo que ta no atual #poc-page e insere como body
			page.append('<div id="poc-export-body">' + $('#poc-page').html() + '</div>');
			
			//troca o #poc-content pelo #poc-content da página
			page.find('#poc-content').html(lista[i].conteudo);
			
			//aqui deve-se remover as bodas e os botões de propriedades
			page.find('.poc-componente').removeClass('poc-componente');
			page.removeClass('poc-componente-fixo');
			page.find('.grupo-btn-propriedades, .poc-linha').remove();
			page.find('*[class*="oculta"]').remove(); //tudo que estiver oculto é removido
			page.find('*[class*="ui-sortable"]').removeClass('ui-sortable'); //tira a classe de arraste
			page.find('*[class*="previa"]').removeClass('previa');

			//verifica se o header e o footer estão vazio. Se sim, eles são removidos
			if(page.find('#poc-header')[0].innerHTML.trim()=='') page.find('#poc-header').remove();
			if(page.find('#poc-footer')[0].innerHTML.trim()=='') page.find('#poc-footer').remove();

			//pega os js que serão adicionados no fim do body
			var js = 
	'\t<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>\n \
	<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>\n \
	<script type="text/javascript" src="js/jquery.zaccordion.min.js"></script>\n \
	<script type="text/javascript" src="js/ekko-lightbox.min.js"></script>\n \
	<script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>\n';

			page.find('#poc-export-body').append(js);

			var htmlFinal = 

'<!DOCTYPE html>\n\
<html>\n\
<head>\n\n'+page.find('#poc-export-head').html()+
'\n\n</head>\n\n\
<body>\n\n'+page.find('#poc-export-body').html()+
'\n\n</body>\n\
</html>';
			var clean = $.htmlClean(htmlFinal, {
				format:true, 
				bodyOnly: false, 
				formatIndent: 2,
				allowedAttributes: [['id']],
				allowedTags: [['script','meta', 'title', 'link']]
			});

			

			//objeto que vai para o php
			obj.isLink = false;
			obj.html =htmlFinal; //conteúdo da página
			obj.nome = removerAcentosEspacos(lista[i].nome);//nome do futuro arquivo

			modelos.push(obj);
		}else if(lista[i].children.length > 0){
			obj.isLink = true;
			obj.nome = removerAcentosEspacos(lista[i].nome);
			obj.children = obterDadosPagina(lista[i].children);
			modelos.push(obj);
		}
	}

	return modelos;
}

//o que tem de dinâmico no css são as informações dos componentes fixos. Basicamente: Background e Border
//o ideal seria usar um template engine, mas o tempo para desenvolvimento se tornou inviável
function gerarCSS(){


	var page = $('#poc-page'), header = $('#poc-header'), content = $('#poc-content'),
		menu = $('#poc-menu'), footer = $('#footer');

	var bgPage = page.css('background'), bgHeader = header.css('background'), bgContent = content.css('background'), 
		bgMenu = menu.css('background'), bgFooter = footer.css('background')

	if(typeof(bgPage) == 'undefined' || bgPage == '') bgPage = '#fff';
	else if(bgPage.indexOf('url') > -1) bgPage.replace('biblioteca/', '');

	if(typeof(bgHeader) == 'undefined' || bgHeader == '') bgHeader = '#fff';
	else if(bgHeader.indexOf('url') > -1) bgHeader.replace('biblioteca/', '');

	if(typeof(bgContent) == 'undefined' || bgContent == '') bgContent = '#fff';
	else if(bgContent.indexOf('url') > -1) bgContent.replace('biblioteca/', '');
	
	if(typeof(bgFooter) == 'undefined' || bgFooter == '') bgFooter = '#fff';
	else if(bgFooter.indexOf('url') > -1) bgFooter.replace('biblioteca/', '');

	if(typeof(bgMenu) == 'undefined' || bgMenu == '') bgMenu = '#fff';

	var propriedadesPagina = {
		background: bgPage,
		font_family: $('#poc-form-propriedades-pagina #fonte').val(),
		font_size: $('#poc-form-propriedades-pagina #tamanho_fonte').val()
	};

	var bordaCabecalho;
	$('#poc-form-propriedades-header #poc-cabecalho-border-style').val() == 'none' ? bordaCabecalho = 'none' : bordaCabecalho = 
				$('#poc-form-propriedades-header #poc-header-border-size').val() + ' ' + $('#poc-form-propriedades-header #poc-cabecalho-border-style').val() +
				' ' + $('#poc-form-propriedades-header #poc-header-border-color').val();

	var propriedadesCabecalho = {
		background: bgHeader,
		min_height: $('#poc-form-propriedades-header #header-tamanho-minimo').val() + 'px',
		border: bordaCabecalho,
		border_radius: $('#poc-form-propriedades-header #poc-header-border-radius').val() + 'px'
	};

	var bordaConteudo;
	$('#poc-form-propriedades-content #poc-conteudo-border-style').val() == 'none' ? bordaConteudo = 'none' : bordaConteudo = 
				$('#poc-form-propriedades-content #poc-conteudo-border-size').val() + ' ' + $('#poc-form-propriedades-content #poc-conteudo-border-style').val() +
				' ' + $('#poc-form-propriedades-content #poc-conteudo-border-color').val();

	var propriedadesConteudo = {
		background: bgContent,
		min_height: $('#poc-form-propriedades-content #content-tamanho-minimo').val() + 'px',
		border: bordaConteudo,
		border_radius: $('#poc-form-propriedades-content #poc-conteudo-border-radius').val() + 'px'
	};

	var bordaRodape;
	$('#poc-form-propriedades-footer #poc-rodape-border-style').val() == 'none' ? bordaRodape = 'none' : bordaRodape = 
				$('#poc-form-propriedades-footer #poc-rodape-border-size').val() + ' ' + $('#poc-form-propriedades-footer #poc-rodape-border-style').val() +
				' ' + $('#poc-form-propriedades-footer #poc-rodape-border-color').val();

	var propriedadesRodape = {
		background: bgFooter,
		min_height: $('#poc-form-propriedades-header #header-tamanho-minimo').val() + 'px',
		border: bordaRodape,
		border_radius: $('#poc-form-propriedades-header #poc-header-border-radius').val() + 'px'
	};

	var bordaMenu;
	$('#poc-form-propriedades-menu #poc-border-menu').val() == 1 ? bordaMenu = '1px solid #e7e7e7' : bordaMenu = 'none';

	var propriedadesMenu = {
		background: $('#poc-form-propriedades-menu #menu-background-color').val() + 'px',
		font_color: $('#poc-form-propriedades-menu #menu-font-color').val(),
		border: bordaMenu,
		border_radius: $('#poc-form-propriedades-menu #poc-border-radius-menu').val() + 'px'
	};

	var cssComponentesFixos = 	
				//body
'#poc-page {\n\
	background: ' 	+	propriedadesPagina.background 	+ ';\n\
	font-family:' 	+	propriedadesPagina.font_family 	+ ';\n\
	font-size:' 	+	propriedadesPagina.font_size 	+ ';\n\
}\n \
\
\
\n#poc-header { \n \
	background: ' 	+ 	propriedadesCabecalho.background 	+ '; \n \
	min-height:' 	+ 	propriedadesCabecalho.min_height 	+ '; \n \
	border:' 		+ 	propriedadesCabecalho.border 		+ '; \n \
	border-radius:'	+	propriedadesCabecalho.border_radius + '; \n \
}\n \
\
\
\n#poc-content { \
	background: ' 	+ 	propriedadesConteudo.background 	+ '; \n \
	min-height:' 	+ 	propriedadesConteudo.min_height 	+ '; \n \
	border:' 		+ 	propriedadesConteudo.border 		+ '; \n \
	border-radius:'	+	propriedadesConteudo.border_radius	+ '; \n \
}\n\n \
\
\
#poc-menu {\n \
	background: ' 	+	propriedadesMenu.background 	+ ';\n \
	color:' 		+	propriedadesMenu.font_color 	+ ';\n \
	border:' 		+	propriedadesMenu.border 		+ ';\n \
	border-radius:' +	propriedadesMenu.border_radius 	+ ';\n \
}\n\n \
\
\
#poc-footer { \n \
	background: ' 	+ 	propriedadesRodape.background 		+ '; \n \
	min-height:' 	+ 	propriedadesRodape.min_height 		+ '; \n \
	border:' 		+ 	propriedadesRodape.border 			+ '; \n \
	border-radius:'	+	propriedadesRodape.border_radius 	+ '; \n \
}\n';

	return cssComponentesFixos;

}

function criarArquivosHtmlEstiloLivre(){
	var arquivos = obterDadosPagina(paginas);
	var css = gerarCSS();

	
	$.ajax({
		url: 'gerar_arquivos.php',
		type: 'POST',
		dataType: 'JSON', 
		cache: false,
		data: {css:css, arquivos:arquivos},

		success: function(data){
			alert(data);	
		}		
	})
}

function obterDadosPaginaOnePage(){
	var obj = new Object();
	//html com o head
	var cabecalhoDoc = 
			//tag meta
			'\t<meta charset="utf-8">\n \
			<meta http-equiv="cache-control" content="no-cache">\n \
			<meta http-equiv="expires" content="0">\n \
			<meta http-equiv="pragma" content="no-cache">\n \
			\
			<title>Título do site</title>\n \
			\
			<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">\n \
			<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">\n \
			<link rel="stylesheet" type="text/css" href="css/ekko-lightbox.min.css">\n \
			<link rel="stylesheet" href="css/base.css">\n';
				
	var head = $('<head />').append(cabecalhoDoc);

	//pega tudo que ta no atual #poc-page e insere como body
	var content = $('<body />').append($('#poc-page').html());

	//pega os js que serão adicionados no fim do body
	var js = 
				'\t<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>\n \
				<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>\n \
				<script type="text/javascript" src="js/jquery.zaccordion.min.js"></script>\n \
				<script type="text/javascript" src="js/ekko-lightbox.min.js"></script>\n \
				<script src="js/classie.js"></script>\n \
    			<script src="js/cbpAnimatedHeader.js"></script>\n\n \
    			<script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>\n \
    			<script type="text/javascript" src="js/base.js"></script>\n';

	content.append(js); //insere o js no final do body

	//cria a página e insere o head e content que repreentam o <head> e <body>
	var page = $('<html />').append(head).append(content);


	//aqui deve-se remover as bodas e os botões de propriedades
	page.find('.poc-componente').removeClass('poc-componente');
	page.removeClass('poc-componente-fixo');
	page.find('.poc-componente-fixo').removeClass('poc-componente-fixo');
	page.find('.grupo-btn-propriedades, .poc-linha').remove();
	page.find("*[style*='display:none']").remove();

	//objeto que vai para o php
	obj.html = '<!DOCTYPE html>\n<html>\n' + page.html() + '\n\n</html>'; //conteúdo da página
	//obj.html = $.htmlClean(obj.html, {format:true})

	return obj;
}

function gerarCSSOnePage(){
	var menu = $('#poc-menu');
	var bgMenu = menu.css('background');
	if(bg.length == 0) bg = '#fff'

	var css = 
		//menu
		'#poc-menu {'+
			'\nbackground: ' 	+	bgMenu + ';' + 
			'\ncolor:' 		+	menu.css('color') + ';' + 
		'}\n';

	//css das sections
	$('#poc-page').find('section').each(function(){
		//css de cada section
		var bg = $(this).css('background');
		if(bg.length == 0) bg = '#fff'
		css += '\n\n#' + $(this).prop('id') + '{\n'+
					'background: ' + bg + ';' + 
					'\ncolor: ' + $(this).css('color') + ';' + 
				'}\n\n';

	});

	return css;
}

function criarArquivosHtmlOnePage(){
	var pagina = obterDadosPaginaOnePage();
	var css = gerarCSSOnePage();

	
	$.ajax({
		url: 'gerar_arquivos_one_page.php',
		type: 'POST',
		dataType: 'JSON', 
		cache: false,
		data: {css:css, pagina:pagina},

		success: function(data){
			alert(data);	
		}		
	})
}

$(document).on('click', '#btn-exportar-html', function(e){
	e.preventDefault();

	if(onePage) criarArquivosHtmlOnePage();
	else criarArquivosHtmlEstiloLivre();
})
/*FIM DAS FUNÇÕES PARA EXPORTAR PARA HTML */

/*FUNCOES PARA EXPORTAR PARA O CRUX */
function converterImagemCrux(componente){
	var imagem = componente.find('img');
	var classes = imagem.attr('class');
	var url = imagem.attr('src');
	return '<crux:image url="'+url+'" styleName="'+classes+'" onSelect="" id="poc-imagem"/>';
}

function converterTabelaCrux(componente){
	var tabela = componente.find('table');
	var classes = tabela.attr('class');

	var retorno = '<crux:adaptativeGrid id="poc-tabela" styleName="'+classes+'">\n\
						<crux:largeColumns>\n';
	//pega os títulos das colunas e transforma em data column
	var label1, key1;
	tabela.find('thead td').each(function(i,e){
		var label = $(this).text();
		var key = removerAcentosEspacos(label);

		if(i == 0){
			label1 = label;
			key1 = key;
		}
		retorno += '<crux:dataColumn key="'+key+'" label="'+label+'" />\n';
	})


	retorno += 
			'</crux:largeColumns>\n\
			<crux:smallColumns>\n\
				<crux:dataColumn key="'+key1+'" label="'+label1+'"/>\n\
			</crux:smallColumns>\n\
		</crux:adaptativeGrid>';

	return retorno;

}



function converterTextoCrux(componente){
	
	var retorno = 
		'<gwt:HTMLPanel id="poc-texto">\n \
			\t'+$(componente).html() + '\n \
		</gwt:HTMLPanel>';

	return retorno;
}

//troca todos as tags <img> para o tag image do crux. Também servirá para componentes em miniatura
function converterMiniaturasCrux(componente){
	var miniatura = $(componente).clone();

	miniatura.find('img').each(function(i,e){
		var imagem = $(this);
		var src = imagem.attr('src'); //caminho da imagem
		var id = 'miniatura-'+i; //id da miniatura
		var style = imagem.attr('class'); //classe para verificar se o o item-gray aparecerá

		imagem.replaceWith('<crux:image id="'+id+'" url="'+src+'" style="'+style+'" />');
	})

	return $('<div />').append(miniatura.clone()).html();
}

//função que trará mais trabalho. Cada item do formulário deve ser convertido para o modelo crux
function converterFormularioCrux(componente){
	var form = $(componente).find('form').clone();

	form.find('input[type=text]').each(function(i,e){
		var input = $(this);

		var id = input.prop('id');
		var style = input.attr('class');
		input.replaceWith('<gwt:textBox id="'+id+'"styleName="'+style+'">');
	})

	form.find('input[type=password]').each(function(i,e){
		var input = $(this);

		var id = input.prop('id');
		var style = input.attr('class');
		input.replaceWith('<gwt:passwordTextBox id="'+id+'"styleName="'+style+'" />');
	})

	form.find('select').each(function(i,e){
		var select = $(this);
		var id = select.prop('id');
		var style = select.attr('class');
		listaSelect.push(objOption);
		input.replaceWith('<gwt:listBox id="'+id+'" styleName="'+style+'" />');
	});

	form.find('textarea').each(function(i,e){
		var textarea = $(this);
		var id = textarea.prop('id');
		var style = textarea.attr('class');

		textarea.replaceWith('<crux:textArea id="'+id+'" styleName="'+style+'" />');
	})

	form.find('input[type=checkbox]').each(function(i,e){
		var checkbox = $(this);

		var id = checkbox.prop('id');
		var valor = checkbox.val();
		var name = checkbox.attr('name');

		checkbox.replaceWith('<gwt:checkbox name="'+name+'" id="'+id+'" value="'+valor+'"/>');
	})

	form.find('input[type=radio]').each(function(i,e){
		var radio = $(this);

		var id = radio.prop('id');
		var valor = radio.val();
		var name = radio.attr('name');

		radio.replaceWith('<gwt:radioButton name="'+name+'" id="'+id+'" value="'+valor+'"/>');
	})

	form.find('input[type=file]').each(function(i,e){
		var file = $(this);
		var id = file.prop('id');

		file.replaceWith('<crux:fileUploader id="'+id+'" />');	
	})

	form.find('button').each(function(i,e){
		var botao = $(this);

		var texto = botao.text();
		var id = botao.prop('id');
		var style = botao.attr('class');

		botao.replaceWith('<crux:button id="'+id+'" text="'+texto+'" styleName="'+style+'" onSelect=""');
	});


	var html = '<crux:formDisplay id="poc-form" styleName="'+form.attr('class')+'">\n'+
					form.html() + '\n'+
				'</crux:formDisplay>';
	return html;
}

function converterPainelCrux(componente){
	var painel = $(componente).clone();
	var titulo = painel.find('.panel-heading');
	titulo.html('<gwt:label id="poc-title-panel" text="'+titulo.text()+'"');

	var texto = 
			'<gwt:HTMLPanel id="poc-texto">\n'+
				'\t' +painel.find('.poc-texto').html() + '\n';      
			'</gwt:HTMLPanel>';

	painel.find('.poc-texto').replaceWith(texto);

	return $('<div />').append(painel.clone()).html();
}



function converterComponenteToCrux(classe, componente){
	switch(classe){
		case 'componente-titulo'			: return converterTextoCrux(componente);
		case 'componente-texto'				: return converterTextoCrux(componente);
		case 'componente-miniatura'			: return converterMiniaturasCrux(componente); 
		case 'componente-formulario'		: return converterFormularioCrux(componente); 
		case 'componente-redes-sociais'		: return converterMiniaturasCrux(componente); 
		case 'componente-painel-estatico'	: return converterPainelCrux(componente); 
		case 'componente-tabela'			: return converterTabelaCrux(componente);
		default: return componente;
	}
}

function gerarMenuView(){
	var menu = $('#poc-menu').clone();

	
	menu.find('.grupo-btn-propriedades').remove(); //pega o grupo de botões de propriedades e os remove
	//pega todos os links que não são dropdown-toogle
	menu.find('.poc-nav-pages a[class!="dropdown-toggle"]').each(function(i,e){
		var link = $(this);
		var text = link.text();
		var nome = removerAcentosEspacos(text);
		link.replaceWith('<crux:anchor href="#" onSelect="menuController.'+nome+'">' + text + '</anchor>');
	})

	var menuHtml = $('<div />').append(menu.clone()).html();

	var view = 
		'<v:view \n\
			xmlns="http://www.w3.org/1999/xhtml" \n\
			xmlns:v="http://www.cruxframework.org/view" \n\
			xmlns:core="http://www.cruxframework.org/crux" \n\
			xmlns:crux="http://www.cruxframework.org/crux/widgets" \n\
			xmlns:gwt="http://www.cruxframework.org/crux/gwt" \n\
			xmlns:faces="http://www.cruxframework.org/crux/smart-faces" \n\
			useController="menuController" \n\
			onActivate="menuController.onActivate">\n' +
				menuHtml + 
		'</v:view>\n';

	return view;
}

/* gera o conteúdo do documento index.crux.xml. A parte dinâmica fica com relação à ordem das camadas na tela. Essas camadas são inseridas de acordo
	com a ordem em que elas aparecem NA TELA CORRENTE
*/
function gerarIndexCrux(){
	var header = 
				'\t<crux:simpleViewContainer id="headerView">\n \
					<crux:view name="header" />\n \
				</crux:simpleViewContainer>\n';

	var content = 
				'\t<crux:simpleViewContainer id="contentView">\n \
					<crux:view name="content" />\n \
				</crux:simpleViewContainer>\n';

	var menu = 
				'\t<crux:simpleViewContainer id="menuView">\n \
					<crux:view name="menu" />\n \
				</crux:simpleViewContainer>\n';

	var footer = 
				'\t<crux:simpleViewContainer id="footerView">\n \
					<crux:view name="footer" />\n \
				</crux:simpleViewContainer>\n';

	
	var index = 
		'<!DOCTYPE html>\n \
		<html\n \
			xmlns="http://www.w3.org/1999/xhtml"\n \
			xmlns:c="http://www.cruxframework.org/crux"\n \
			xmlns:crux="http://www.cruxframework.org/crux/widgets"\n \
			xmlns:faces="http://www.cruxframework.org/crux/smart-faces"\n \
			xmlns:gwt="http://www.cruxframework.org/crux/gwt">\n \
			\n\
			<head<name /> \n\
			<title>Nome do Projeto</title> \n\
			\n\
			<link href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,700|Clicker+Script" rel="stylesheet" type="text/css" /> \n\
			<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" /> \n\
			<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css" /> \n\
			\n\
		</head>\n\
			\n\
		<body>\n\
			<script type="text/javascript" src="../nomeprojeto/nomeprojeto.nocache.js"></script>\n \
			\n\
			<c:screen useView="**/views/*" \n\
				smallViewport="user-scalable=no, width=320" \n\
				largeViewport="user-scalable=no" \n\
				useResource="seuProjetoResources" \n\
				useController="rootController" \n\
				onActivate="rootController.onActivate" \n\
				height="100%"/>\n\n';

	$('#poc-page').find('#poc-header, #poc-menu, #poc-content, #poc-footer').each(function(i,e){
		switch($(this).prop('id')){
			case 'poc-header': index += header; break;
			case 'poc-menu': index += menu; break;
			case 'poc-content': index += content; break;
			case 'poc-footer': index += footer; break;
		}
	});

	index += 
					'\n\t<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>\n \
					<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>\n \
					<script type="text/javascript" src="js/jquery.zaccordion.min.js"></script>\n \
					<script type="text/javascript" src="js/ekko-lightbox.min.js"></script>\n \
				</body>\n \
			</html>';

	return index;
}

//Função capaz de gerar as view do projeto. Id será o nome da página
function gerarView(elemento, camada, title){
	
	var view = 
		'<v:view\n \
			xmlns="http://www.w3.org/1999/xhtml"\n \
			xmlns:v="http://www.cruxframework.org/view"\n \
			xmlns:core="http://www.cruxframework.org/crux"\n \
			xmlns:crux="http://www.cruxframework.org/crux/widgets"\n \
			xmlns:gwt="http://www.cruxframework.org/crux/gwt"\n \
			xmlns:faces="http://www.cruxframework.org/crux/smart-faces"\n \
			useController="'+camada+'Controller"\n \
			onActivate="'+camada+'Controller.onActivate"\n \
			dataObject="'+camada+'"\n';

		if(typeof(title) !== 'undefined') view += 'title="'+title+'"'; //caso seja um conteúdo, adiciona como título da página
		view += '>\n\n';

	var el = $(elemento).clone();
		//procura pelos componentes nesse conteúdo 
	$(el).find('.poc-componente').each(function(){
		var temp = $(this);
		var classe = temp.attr('class').split(' ')[0]; //pega a primeira classe do componente;

		temp.replaceWith(converterComponenteToCrux(classe, temp)); //troca o elemento original pelo convertido em formato crux
	})

	console.log(el.html());
	view += $('<div />').append(el.clone()).html();
	view += '</v:view>';

	return view;
}

function criarViewIniciais(){
	var modelos = [];
	//gerando o index.crux.xml
	var obj = new Object();
	obj.nome = 'index.crux.xml';
	obj.html = gerarIndexCrux();
	obj.isLink = false;
	modelos.push(obj);

	//gerando a view menu.view.xml
	obj = new Object();
	obj.nome = 'menu.view.xml';
	obj.html = gerarMenuView();
	obj.isLink = false;
	modelos.push(obj);

	//gerando a view header.view.xml
	obj = new Object();
	obj.nome = 'header.view.xml';
	obj.html = gerarView($('#poc-header'), 'header');
	obj.isLink = false;
	modelos.push(obj);

	//gerando a view footer.view.xml
	obj = new Object();
	obj.nome = 'footer.view.xml';
	obj.html = gerarView($('#poc-footer'), 'footer');
	obj.isLink = false;
	modelos.push(obj);

	return modelos;
}

//converte os dados das páginas para um formato a ser enviado para o arquivo php
function obterDadosPaginaCrux(lista){
	var modelos = []; //lista com as paginas. Cada página será uma view, mas apenas o seu #poc-content. Header, Footer e Menu são gerados separadamente
	var obj; 
	for(i in lista){
		
		//se for um link, então não há a necessidade de criar arquivos
		if(!lista[i].isLink){
			obj = new Object();
			obj.isLink = false;
			obj.nome = removerAcentosEspacos(lista[i].nome);
			obj.html = gerarView($(lista[i].conteudo), obj.nome, lista[i].nome);
			modelos.push(obj);
		}else if(lista[i].children.length > 0){
			obj.isLink = true;
			obj.nome = removerAcentosEspacos(lista[i].nome);
			obj.children = obterDadosPaginaCrux(lista[i].children);
			modelos.push(obj);
		}
	}

	return modelos;
}

function criarArquivosCrux(){
	var paginas = criarViewIniciais();
	paginas.join(obterDadosPaginaCrux(paginas));
	
	var css = gerarCSS();
	
	$.ajax({
		url: 'gerar_arquivos_crux.php',
		type: 'POST',
		dataType: 'JSON', 
		cache: false,
		data: {css:css, arquivos:paginas},

		success: function(data){
			alert(data);	
		}		
	})
}

$(document).on('click', '#btn-exportar-crux', function(e){
	e.preventDefault();

	if(onePage) alert('O estilo Página Única não pode ser gerado para Crux no momento.');
	else criarArquivosCrux()

})

$(document).ready(function(){
	
	carregarModalInicial();
	
	//faz a leitura dos componentes
	readXml();

	$('input[type=file]').bootstrapFileInput();
	//console.log($('input[type=file]')
});


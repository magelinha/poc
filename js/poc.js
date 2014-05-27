/** VARIAVEIS GLOBAIS **/ 
var componentes_basicos = []; //componentes da ferramenta
var layouts = []; //layout disponíveis, caso a escolha seja estilo livre
var paginas = []; //paginas criadas pelo usuário, incluindo a Home
var formularios = [];
var headerStyle = [];
var pageStyle = [];
var tipoAccount = [];

var lastId = 1;
var elementoAtual;
var objetoAtual;
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
	{nome: 'Glyphicons Halflings',	familia: "'Glyphicons Halflings', sans-serif"},
	{nome: 'Tahoma',				familia: "'Tahoma', sans-serif"},
	{nome: 'Verdana',				familia: "'Verdana', sans-serif"}
];

/** FIM VARIAVEIS GLOBAIS **/

/** CARREGAMENTOS OS XMLS **/

/** adiciona o eventos de arrastar à todos os compenentes **/ 
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
}
/** FIM CARREGAMENTO DOS XMLS **/


/** CONFIGURAÇÕES INICIAIS DA FERRAMENTA DE PROTOTIPAÇÃO **/

//remove a função de arrastar dos links de propriedades
$(document).on('dragstart', function(e){
	if(e.target.tagName.toLowerCase() === "a") return false;
})


/** pega todos os itens do menu que são arrastáveis e insere o efeito de arraste (drag)**/
function addDraggableToComponents(){
	$(".componente-arrastavel").each(function(index, value){
		var data = componentes_basicos[index].html;

		index < 4 ? classe = "#poc-header,#poc-content, #poc-footer" : classe = ".coluna";
		$(this).draggable({
			revert:"invalid",
			cursor: "move",
			iframeFix: true,
			connectToSortable: classe,
			cursorAt: {left: 40, top: 25},
			helper: function(event){
				return $(data).css('width', '800px');
			},			

		}).disableSelection();
	});
}

function addSortableToComponents(classe){
	$(classe).sortable({
		revert: true, 
		helper: "clone",
		cancel: ".link-propriedades, .link-propriedades span",
		items: ":not(.link-propriedades, .link-propriedades span)",

		start: function(e, ui){
			

			var item = ui.item[0].classList;

			for(var i=0; i<item.length; i++) {
				if(item[i] === 'link-propriedades') return;
			}

			//pega o nome da penultima classe do objeto
			var nome = item[item.length-2];
			
			elementoAtual = getComponent(nome);

			if(!elementoAtual) elementoAtual = ui.helper[0].outerHTML.toString();

		},

		stop: function(event, ui){
			ui.item.replaceWith(elementoAtual).removeAttr('style');
			removeStyle();

			addDraggableToComponents();
			addSortableToComponents(".coluna, #poc-header, #poc-content, #poc-footer"); //informa quais elementos podem receber outros elementos
			addSidrToComponents(); //adciona os formularios de propriedades
		}

	}).disableSelection();
}

function removeStyle(){
	$("*[style]").removeAttr('style');
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
		defaultValue: $(".poc-navbar").css('background-color'),
		position: 'bottom right',
		change: function(hex, opacity){
			$('.poc-navbar').css('background', hex);
			background.valor = hex;
		},

		theme: 'bootstrap'
	});

	$("#menu-font-color").minicolors({
		defaultValue: $(".poc-navbar").css('color'),
		position: 'bottom right',
		change: function(hex, opacity){
			$('.poc-navbar a').css('color', hex);
			background.valor = hex;
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

		if($("#sidr-propriedade-" + prop).length == 0){
			$(el).sidr({
				name: "sidr-propriedade" + "-" + prop,
				side: 'right',
				source: function(name){
					return "<h1>Propriedades</h1>" + getFormulario(prop);
				},
				renaming: false,

			});		
		}
	});

	addColorPicker();
	addFontsToSelect(); //adiciona as possíveis fontes ao formulario
	addBoxTexturas();
}


function addBotaoPropriedade(content, id){
	//#prop-'+id+'
	html = '<a id="prop-'+id+'" data-prop="'+id+'" href="#" class="btn btn-primary btn-xs link-propriedades link-propriedades-'+id+'">' +
	'<span class="glyphicon glyphicon-cog"></span></a>';

	$(content).prepend(html);

}

//sempre que clicar em um botão 
$(document).on('click', '.link-propriedades', function(el){
	el.preventDefault(); //como são todos links, tira o efeito de ir pra outra página
	objetoAtual = $(this).parent().parent(); //o objeto atual vai ser o pai do link clicado

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

$(document).on('change', '#background-image', function(e){
	var arquivo = e.target.files; 
	var url = 'upload.php?arquivo';

	objetoAtual.css('background-image', 'none'); //remove a imagem atual

	var valor = new FormData();
	$.each(arquivo, function(chave, item){
		valor.append(chave, item);
	});

	valor.append("nome", objetoAtual[0].id);
	
	
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
				var repeticao = $("#repeticao").val();
				objetoAtual.css('background', $("#background-color").val()); //remove a imagem atual
				var aux = 'url('+ data.imagem + ') no-repeat center center fixed';
				if(repeticao == 'no-repeat'){
					var opcoes = {
						'background' : 'url('+ data.imagem +'?'+ Math.random() + ') no-repeat center center fixed',
						'-webkit-background-size' : 'cover',
						'-moz-background-size' : 'cover',
						'-o-background-size' : 'cover',
						'background-size' : 'cover'
					}
					//background full size
					objetoAtual.css(opcoes);

					opcoes.background = aux; //remove a versão da imagem
					background.valor = opcoes;

				}else {
					objetoAtual.css('background', 'url('+ data.imagem +'?'+ Math.random() + ') ' + $("#repeticao").val());
					background.valor = 'background', 'url('+ data.imagem + ') ' + $("#repeticao").val();
				}


				
			}else{
				alert('ERRO: ' + data.mensagem);
			}
		}
	});
});

$(document).on('change', "#repeticao", function(){
	$.ajax({
		url: 'img/background-image/',
		cache: false,
		success: function(data){
			var contem = objetoAtual[0].id.split("-")[1];
			
			var arquivo="";
			$(data).find("a:contains("+contem+")").each(function(indice, valor){
				arquivo = 'img/background-image/' + $.trim(this.innerHTML);
			});

			if(arquivo.length > 0){
				var repeticao = $("#repeticao").val();
				if(repeticao == 'no-repeat'){
					//background full size
					objetoAtual.css({
						'background' : 'url('+ arquivo +') no-repeat center center fixed',
						'-webkit-background-size' : 'cover',
						'-moz-background-size' : 'cover',
						'-o-background-size' : 'cover',
						'background-size' : 'cover'
					});	
				}else {
					objetoAtual.css('background', 'url('+ arquivo +') ' + repeticao);
				}
			}else {
				alert("Selecione uma imagem!");
			}
		}

	})
});


$(document).on("hide.bs.modal", "#modalFundoSite", function(){
	var local = objetoAtual[0].id.split("-")[1];
	var backgroundObject = '#' + local + '-background';
	
	if(background.valor instanceof Object ){
		$(backgroundObject).val(background.valor.background);
	}else{
		$(backgroundObject).val(background.valor);
	}
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
		conteudo: 		$("#poc-content"),
	};

	paginas.push(home);
	openPage(home);

	$('#lista-paginas').empty();
	$('.poc-nav-pages').empty();
	paginaAtual = home;

	redefinirMenu(paginas, 0);
	redefinirMenuHtml(paginas, 0, '.poc-nav-pages');
	
	//depois que for escolhido o tipo de layout, insere as funcionalidades para os componentes
	addDraggableToComponents();//capacidade de arrastar
	addSortableToComponents(".coluna, #poc-header, #poc-content, #poc-footer"); //elementos que vão receber os conteúdos arrastaveis
	startCarousel();

	addBotaoPropriedade("#poc-page", "pagina");
	addBotaoPropriedade("#poc-header", "cabecalho");
	addBotaoPropriedade("#poc-menu", "menu");
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
$(document).on('change', '#poc-form-propriedades-pagina', function(){
	var dados = $("#poc-form-propriedades-pagina").serializeArray();
	
	var pagina = $("#poc-page");
	//se o valor de site centrazalido for "não", remove a div com class container
	if(dados[0].value == 1){
		//insere o conteúdo numa div centralizada
		var conteudo = pagina.html();
		pagina.html('<div class="container poc-pagina-centralizada">' + conteudo + '</div>');
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-pagina-centralizada').length > 0){
			var conteudo_centralizado = $('.poc-pagina-centralizada').html();
			$('.poc-pagina-centralizada').remove();
			pagina.html(conteudo_centralizado);
		}
	}

	pagina.css('font-family', dados[1].value); //adiciona a fonte que está selecionada
	pagina.css('font-size', dados[2].value);//tamanho da fonte
	
});


//quando tiver alguma alteração no campo tamanho. Servirá para campos de qualquer propriedade
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

/** FIM PROPRIEDADES DA PÁGINA **/

/** PROPRIEDADES DO CABEÇALHO **/
$(document).on('change', '#poc-header-centralizado', function(){
	var cabacalho = $('#poc-header');
	var valor = parseInt($(this).val());


	if(valor == 1){
		//insere o conteúdo numa div centralizada
		var conteudo = cabecalho.html();
		cabecalho.html('<div class="container poc-header-centralizado">' + conteudo + '</div>');
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-header-centralizado').length > 0){
			var conteudo_centralizado = $('.poc-header-centralizado').html();
			$('.poc-header-centralizado').remove();
			cabecalho.html(conteudo_centralizado);
		}
	}
});


//carrega o estilo informado pelo usuário. Caso o estilo seja livre, limpa-se o header
$(document).on('change', '#select-header-style', function(){
	var item = $(this).val();
	var cabecalho = $("#poc-header");
	
	//remove qualquer conteúdo já existente
	cabecalho.find("div").each(function(){
		$(this).remove();
	});
	
	if(item != '0') $(getHeaderStyle(item)).appendTo(cabecalho);
});
/** FIM PROPRIEDADES DO CABEÇALHO **/

/** PROPRIEDADE DO MENU **/
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
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-content-centralizado').length > 0){
			var conteudo_centralizado = $('.poc-content-centralizado').html();
			$('.poc-content-centralizado').remove();
			conteudo.html(conteudo_centralizado);
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
/** FIM PROPRIEDADE DO CONTEÚDO **/

/** PROPRIEDADES DO RODAPÉ **/
$(document).on('change', '#poc-footer-centralizado', function(){
	var rodape = $('#poc-footer');
	var valor = parseInt($(this).val());


	if(valor == 1){
		//insere o conteúdo numa div centralizada
		var conteudo = rodape.html();
		rodape.html('<div class="container poc-footer-centralizado">' + conteudo + '</div>');
	}else{
		//remove a div que centraliza o conteudo
		if($('.poc-footer-centralizado').length > 0){
			var conteudo_centralizado = $('.poc-footer-centralizado').html();
			$('.poc-footer-centralizado').remove();
			rodape.html(conteudo_centralizado);
		}
	}
})

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
});



//adiciona possíveis pais para serem escolhidos
function addPaiSelect(itens, nivel){
	//nível máximo é 3
	if(nivel > 2) return;

	var lista = $('#pai');
	for(var i=0; i<itens.length; i++){
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

function redefinirMenuHtml(lista, nivel, pai){
	var pai = $(pai);
	var id = pai.data('id');

	
	switch(nivel){
		case 0:
			for(i in lista){
				if(lista[i].children.length == 0) pai.append('<li data-id="'+lista[i].id+'" class="item-'+lista[i].id+'"><a href="#">'+lista[i].nome+'</a></li>');
				else{
					pai.append('<li data-id="'+lista[i].id+'" class="item-'+lista[i].id+'"><a class="dropdown-toggle" data-toggle="dropdown" href="#">'+lista[i].nome+'<b class="caret"></b></a></li>');	
					redefinirMenuHtml(lista[i].children, nivel+1, '.item-'+lista[i].id);
					
				}	
			}
			
			break;

		case 1:
			pai.append('<ul class="dropdown-menu multi-level submenu-item-'+id+'" ><ul/>');
			var filho =	$('.submenu-item-'+id);
			for(i in lista){
				if(lista[i].children.length == 0) filho.append('<li data-id="'+lista[i].id+'" class="item-'+lista[i].id+'"><a href="#">'+lista[i].nome+'</a></li>');
				else{
					filho.append('<li data-id="'+lista[i].id+'" class="dropdown-submenu item-'+lista[i].id+'"><a class="dropdown-toggle" data-toggle="dropdown" href="#">'+lista[i].nome+'</a></li>');	
					redefinirMenuHtml(lista[i].children, nivel+1, '.item-'+id);
				}
			}

			break;

		case 2:
			pai.append('<ul class="dropdown-menu submenu-item'+id+'"><ul/>');
			var filho =	$('.submenu-item-'+id);
			for(i in lista) filho.append('<li data-id="'+lista[i].id+'" class="item-'+lista[i].id+'"><a href="#">'+lista[i].nome+'</a></li>');

			break;

		default: return;

	}
	
}


function openPage(pagina){
	paginaAtual = pagina;

	$(".conteudo-gerado").attr('data-content', 'Página - ' + pagina.nome);
	$("#poc-header").replaceWith(componentes_fixos.cabecalho);
	$("#poc-menu").replaceWith(componentes_fixos.menuPrincipal);
	$("#poc-menu-left").replaceWith(componentes_fixos.menuEsquerdo);
	$("#poc-menu-right").replaceWith(componentes_fixos.menuDireito);
	$("#poc-content").replaceWith(pagina.conteudo);
	$("#poc-footer").replaceWith(componentes_fixos.rodape);	
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

	if(nome == '') alert('Dê um nome para o item!')
	else {

		if(dados[0].value == '0'){
			var conteudo = $('#poc-content');
			conteudo.empty(); //esvazia o conteudo
			addBotaoPropriedade("#poc-content", "conteudo"); //adiciona o botão de propriedade
			conteudo.append(getPageStyle(dados[4].value));

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
				url: 			"#", 
				conteudo: 		$("#poc-content")
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
			redefinirMenuHtml(paginas, 0, '.poc-nav-pages');

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


		if(dados[0].value == '0') openPage(pagina);
		redefinirMenu(paginas,0);
		redefinirMenuHtml(paginas, 0, '.poc-nav-pages');
		
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
	redefinirMenuHtml(paginas, 0, '.poc-nav-pages');
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
	redefinirMenuHtml(paginas, 0, '.poc-nav-pages');
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

/* PROPRIEDADES DAS MINIATURAS */
$(document).on('change', '#poc-form-propriedades-miniaturas #poc-upload-miniaturas', function(e){
	console.log('mudou');
	uploadMiniaturas(e);
})


//upload de imagens
function uploadMiniaturas(e){
	var arquivo = e.target.files; 
	var url = 'upload.php?arquivo';

	objetoAtual.css('background-image', 'none'); //remove a imagem atual

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
	console.log('clicou');
	var miniaturas = $("#poc-form-propriedades-miniaturas #poc-miniaturas-largura");
	var valor = parseInt(miniaturas.val());

	if(valor === NaN || valor > 6) valor = 6;
	else valor = valor+1;

	console.log(valor);
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


$(document).ready(function(){
	
	carregarModalInicial();

	//faz a leitura dos componentes
	readXml();
});


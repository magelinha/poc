var componentes_basicos = [];
var layouts = [];
var paginas = [];
var formularios = [];

var elementoAtual;
var objetoAtual;
var template = 0;
var tipoPagina = 0;

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
}


/** pega todos os itens do menu que são arrastáveis e insere o efeito de arraste (drag)**/
function addDraggableToComponents(){
	$(".componente-arrastavel").each(function(index, value){
		var data = componentes_basicos[index].html;

		index < 4 ? classe = "#poc-header,#poc-content, #poc-footer" : classe = ".coluna";
		$(this).draggable({
			revert:"invalid",
			cursor: "move",
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
		cancel: ".conteudo-editavel",

		start: function(e, ui){
			var item = ui.item[0].classList;
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
			startImageGallery(); //inicia o fancybox para galerias
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


function startImageGallery(){
	if($(".poc-componente-galeria-imagem a")) $(".poc-componente-galeria-imagem a").fancybox();
}

function addColorPicker(){
	$("#background-color").minicolors({
		defaultValue: '#fff',
		position: 'bottom right',
		change: function(hex, opacity){
			$('#poc-page').css('background', hex);
		},

		theme: 'bootstrap'

	});
}

function addSidrToComponents(){
	$(".link-propriedades").each(function(i, el){
		//se não existe uma div com o id "propriedade-idDoLink" então cria-se a div com o sidr
		var classes = $(this).prop('class').split(/\s/);
		var lastclass = classes[classes.length-1];

		if($("#sidr-propriedade-" + lastclass).length == 0){
			
			$(el).sidr({
				name: "sidr-propriedade" + "-" + lastclass,
				side: 'right',
				source: function(name){
					return "<h1>Propriedades</h1>" + getFormulario($(el).data('prop'));
				}
			});		
		}
		
	});

	addColorPicker();
	addFontsToSelect(); //adiciona as possíveis fontes ao formulario
	addBoxTexturas();
}


$(document).on('click','.radio-item-textura', function(){
	//caso a posicao da imagem seja menor que 10, deve-se inserir o 0 na frente. Ex.: 9 = 09
	var posicao = $(this)[0].id.split("-");
	if(parseInt(posicao[1]) < 10){
		posicao[1] = "0" + posicao[1].toString();
	}

	var imagem = posicao[0] + posicao[1] + ".png"; //o nome da imagem será textura-posicao[1].png
	var propriedade = 'url(img/texturas/'+imagem+') repeat';
	
	$("#poc-page").css('background', propriedade);
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

	var valor = new FormData();
	$.each(arquivo, function(chave, item){
		valor.append(chave, item);
	});
	
	
	$.ajax({
		url: 'upload.php?arquivo',
		type: 'POST',
		dataType: 'JSON',
		data: valor,
		processData: false,
		contentType: false,

		success: function(data){
			if(data.success){
				var repeticao = $("#repeticao").val();
				if(repeticao == 'no-repeat'){
					//background full size
					$("#poc-page").css({
						'background' : 'url('+ data.imagem +') no-repeat center center fixed',
						'-webkit-background-size' : 'cover',
						'-moz-background-size' : 'cover',
						'-o-background-size' : 'cover',
						'background-size' : 'cover'
					});	
				}else {
					$("#poc-page").css('background', 'url('+ data.imagem +') ' + $("#repeticao").val());
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
		success: function(data){
			var arquivo="";
			$(data).find("a:not(:contains(.html))").each(function(indice, valor){
				console.log(valor);
				arquivo = 'img/background-image/' + $.trim(this.innerHTML);
			});

			console.log(arquivo);
			if(arquivo.length > 0){
				var repeticao = $("#repeticao").val();
				if(repeticao == 'no-repeat'){
					//background full size
					$("#poc-page").css({
						'background' : 'url('+ arquivo +') no-repeat center center fixed',
						'-webkit-background-size' : 'cover',
						'-moz-background-size' : 'cover',
						'-o-background-size' : 'cover',
						'background-size' : 'cover'
					});	
				}else {
					$("#poc-page").css('background', 'url('+ arquivo +') ' + repeticao);
				}
			}else {
				alert("Selecione uma imagem!");
			}
		}

	})
})

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

$(document).on('hidden.bs.modal', '#selecionarLayout', function (e) {
	
	template = $('input[name=layout]:checked', '#formLayout').val();
	
	//se o layout escolhido for o 5, então há a necessidade da importação de um arquivo css específico
	if(template == 5){
		$('head').append('<link rel="stylesheet" type="text/css" href="css/layout5.css">');
	}
	$(".conteudo-gerado").append(layouts[template-1].html); //insere o layout escolhido na tela

	var home = {
		nome: 			"Home",
		isHome: 		true,
		descricao: 		"",
		propriedades: 	[],
		children: 		[],
		pai: 			"nenhum",
		conteudo: 		$("#poc-page").html()
	};

	paginas.push(home);

	componentes_fixos.cabecalho = $("#poc-header").html();
	componentes_fixos.menuPrincipal = $("#poc-menu").html();
	componentes_fixos.menuEsquerdo = $("#poc-menu-left").html();
	componentes_fixos.menuMenuDireito = $("#poc-menu-right").html();
	componentes_fixos.rodape = $("#poc-footer").html();

	
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

function addBotaoPropriedade(content, id){
	html = '<a id="prop-'+id+'" data-prop="'+id+'" href="#prop-'+id+'" class="btn btn-primary btn-xs link-propriedades link-propriedades-'+id+'">' +
	'<span class="glyphicon glyphicon-cog"></span></a>';

	$(content).prepend(html);
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



	//adiciona a cor de fundo 
	//se foi setada alguma cor, então altera o fundo da div
	if(dados[1].value){
		console.log('alterou aqui');
		$("#poc-page").css("background-color", dados[1].value);
	}else{
		//deixa com o branco
		$("#poc-page").css("background-color", "#fff");
	}
	
	//imagem de fundo
});


//sempre que clicar em um botão 
$(document).on('click', '.link-propriedades', function(el){
	el.preventDefault(); //como são todos links, tira o efeito de ir pra outra página
	objetoAtual = $(this).parent(); //o objeto atual vai ser o pai do link clicado
});

$(document).on('click', '.clear-input', function(){
	var campo = $($(this).data("input"));
	campo.prop("value", "");
	campo.change();
	//adiciona a cor de fundo 
});

$(document).on('hide.bs.modal', '#selecionarTipoSite', function(e){
	var selecionado = $('#select-tipo-site').val();

	switch(parseInt(selecionado)){
		case 1: abrirModalSelecionarLayout(); break;
	}

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

$(document).on('click', '#prop-pagina', function(){
	var retorno = definirElementosVisivies();
	if($(".grupo_visiveis").length > 0){
		for(var i=0; i<retorno.itens.length; i++){
			$("#v_"+retorno.itens[i].item).prop('checked', retorno.itens[i].marcado);
		}
	}else $("#poc-form-propriedades-pagina").append(retorno.html);
});



function createMenuNestable(){
	$("#lista-paginas").nestable('serialize');
}

function addPage(){

}


//quando o modal fundo site for aberto, paga-se o valor contido no campo texto
$(document).on('show.bs.modal', '#modalFundoSite', function(e){
	configurarModalFundoSite();
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
			$('#background-color').val(background.valor);
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

//quando o modal para adiocionar um nova página surgir
$('#add-page').on('show.bs.modal', function(e){
	addPaiSelect(paginas, 0);
	addPosicaoMenu();
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


//adiciona possíveis pais para serem escolhidos
function addPaiSelect(itens, nivel){
	//nível máximo é 3
	if(nivel > 2) return;

	var lista = $('#pai');
	for(var i=0; i<itens.length; i++){
		//adiciona o nome da página na lista
		lista.append("<option value='" + itens[i].nome + "'>" + addTabulacao(nivel) + " " + itens[i].nome + "</option>");

		//se essa página tem filhos, então faz a busca nesses filhos
		if(itens[i].children.length > 0) addPaiSelect(itens[i].children, nivel+1);
	}
}

//para facilitar a visualização dos níveis de menu, são colocados traços
function addTabulacao(nivel){
	if(nivel == 0) return "-";

	var retorno = "";
	for(var i=0; i<nivel; i++){
		retorno += "-";
	}

	return retorno;
}

//adiciona as opções de posição de acordo com o pai selecionado.
function addPosicaoMenu(){
	$("#pai").change(function(){
		var selecionado = $(this).val();

		if(selecionado == 'nenhum'){
			//selecionado == 0 indica que foi selecionado a opção Nenhum
			for(var i=0; i<paginas.length; i++){
				$("#posicao").append("<option value='" + paginas[i].nome + "'>" + paginas[i].nome + "</option>");
			}
		}else{
			//caso contrario, é necessário procurar 
			getPai(paginas, selecionado);
		}

	});
}


//percorre todos as páginas para verificar se algum deles é o item selecionado como pai
function getPai(itens, nome){

	for(var i=0; i<itens.length; i++){
		if(itens[i].nome == nome){
			for(var j=0; j<itens[i].children.length; j++){
				$("#posicao").append("<option value='" + itens[i].children[j].nome + "'>" + itens[i].children[j].nome + "</option>");
			}

			return false;

		} else if(itens[i].children.length > 0 && !getPai(itens[i].children, nome)) return;
	}
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


//define a ação de acordo com o item selecionado no select para tipo de site
function definarAcaoTipoSite(selecionado){

}

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
  					'<label><input type="checkbox" value="'+item+'" '+marcado+' id="v_'+item+'">'+nome+'</label>'+
  				'</div>';
	}

	html +='</div>';

	return {itens: itens, html: html};
}


$(document).ready(function(){
	
	carregarModalInicial();

	//faz a leitura dos componentes
	readXml();

	createMenuNestable();
});


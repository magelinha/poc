componentes_basicos = [];
layouts = [];
paginas = [];
formularios = [];

var elementoAtual;
var objetoAtual;
var template = 0;
var tipoPagina = 0;


/** adiciona o eventos de arrastar à todos os compenentes **/ 
function getComponent(nome){
	for(i=0; i<componentes_basicos.length; i++){
		if(componentes_basicos[i].nome === nome) return componentes_basicos[i].html;
	}

	return "";
}

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
			addSortableToComponents(".coluna, #poc-header, #poc-content, #poc-footer");
			startImageGallery();
			addSidrToComponents();
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
	$(".cor-de-fundo").minicolors({
		control: $(this).attr('data-control') || 'hue',
		defaultValue: $(this).attr('data-defaultValue') || '',
		inline: $(this).attr('data-inline') === 'true',
		letterCase: $(this).attr('data-letterCase') || 'lowercase',
		opacity: $(this).attr('data-opacity'),
		position: $(this).attr('data-position') || 'bottom right',
		change: function(hex, opacity) {
			if( !hex ) return;
			if( opacity ) hex += ', ' + opacity;
			try {
				//console.log(hex);
			} catch(e) {}
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

	
	//depois que for escolhido o tipo de layout, insere as funcionalidades para os componentes
	addDraggableToComponents();//capacidade de arrastar
	addSortableToComponents(".coluna, #poc-header, #poc-content, #poc-footer"); //elementos que vão receber os conteúdos arrastaveis
	addSidrToComponents(); //exibição das propriedades ao clicar no componente
	startCarousel();
});

//funções que serão chamadas quando alguma coisa mudar nos formularios
$(document).on('change', '#propriedades-pagina', function(){
	var dados = $("#propriedades-pagina").serializeArray();
	
	//se o valor de site centrazalido for "não", remove a div com class container
	if(dados[0].value == 1){
		$("#poc-page .content-center").removeClass('container');
	}else{
		//se não existe o container, então cria-se e insere o conteudo 
		$("#poc-page .content-center").addClass('container');
	}

	//adiciona a cor de fundo 
	//se foi setada alguma cor, então altera o fundo da div
	if(dados[3].value){
		$("#poc-page").css("background-color", dados[3].value);
	}else{
		//deixa com o branco
		$("#poc-page").css("background-color", "#fff");
	}
	
	//imagem de fundo
});

//sempre que clicar em um botão 
$(document).on('click', '.link-propriedades', function(el){
	console.log('clicou aqui!');
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



function createMenuNestable(){
	$("#lista-paginas").nestable('serialize');
}

function addPage(){

}

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


$(document).ready(function(){
	
	carregarModalInicial();

	//faz a leitura dos componentes
	readXml();

	createMenuNestable();
});


componentes_basicos = [];
layouts = [];
paginas = [];
formularios = [];

var elementoAtual;
var objetoAtual;
var template = 0;
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

$('#selecionarLayout').on('hidden.bs.modal', function (e) {
	template = $('input[name=layout]:checked', '#formLayout').val();
	
	//se o layout escolhido for o 5, então há a necessidade da importação de um arquivo css específico
	if(template == 5){
		$('head').append('<link rel="stylesheet" type="text/css" href="css/layout5.css">');
	}
	$(".conteudo-gerado").append(layouts[template-1].html); //insere o layout escolhido na tela

	//depois que for escolhido o tipo de layout, insere as funcionalidades para os componentes
	addDraggableToComponents();//capacidade de arrastar
	addSortableToComponents(".coluna, #poc-header, #poc-content, #poc-footer"); //elementos que vão receber os conteúdos arrastaveis
	addSidrToComponents(); //exibição das propriedades ao clicar no componente
	startCarousel();
});

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

		if(!$("#propriedade-" + lastclass).length){
			$(el).sidr({
				name: "propriedade" + "-" + lastclass,
				side: 'right',
				source: function(name){
					return getFormulario($(el).data('prop'));
				}
			});		
		}
		
	});

	addColorPicker();
}

//funções que serão chamadas quando alguma coisa mudar nos formularios
$(document).on('change', '#propriedades-pagina', function(){
	console.log("aqui");
	var dados = $("#propriedades-pagina").serializeArray();
	console.log(dados);

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
$(document).on('click', 'link-propriedades', function(el){
	el.preventDefault(); //como são todos links, tira o efeito de ir pra outra página
	objetoAtual = $(this).parent(); //o objeto atual vai ser o pai do link clicado
});

$(document).on('click', '.clear-input', function(){
	var campo = $($(this).data("input"));
	campo.prop("value", "");
	campo.change();
	//adiciona a cor de fundo 
});

$(document).ready(function(){
	//faz a leitura dos componentes
	readXml();
	//abre o modal para selecionar o layout
	$('#selecionarLayout').modal({
		keyboard: false,
		show: true,
		backdrop: 'static'
	});
});


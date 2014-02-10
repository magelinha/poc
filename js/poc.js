componentes_basicos = [];
layouts = [];
paginas = [];
formularios = [];

var elementoAtual;
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

			console.log(formularios.length);
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
		}

	}).disableSelection();
}

function removeStyle(){
	$("*[style]").removeAttr('style');
}

$('#selecionarLayout').on('hidden.bs.modal', function (e) {
	template = $('input[name=layout]:checked', '#formLayout').val();
	$(".conteudo-gerado").append(layouts[template-1].html); //insere o layout escolhido na tela

	//depois que for escolhido o tipo de layout, insere as funcionalidades para os componentes
	addDraggableToComponents();//capacidade de arrastar
	addSortableToComponents(".coluna, #poc-header, #poc-content, #poc-footer"); //elementos que vão receber os conteúdos arrastaveis
	addSidrToComponents(); //exibição das propriedades ao clicar no componente
	var teste = elementToObject(document.getElementById('poc-page'));
	console.log(teste);
});

//função recursiva que pega todos os elementos que estão dentro de um determinado elemento
function elementToObject(element, o) {
	var el = $(element);
	console.log(el);
	var o = {
		tagName: el.tagName
	};
	var i = 0;
	for (i ; i < el.attributes.length; i++) {
		o[el.attributes[i].name] = el.attributes[i].value;
	}

	var children = el.childElements();
	if (children.length) {
		o.children = [];
		i = 0;
		for (i ; i < children.length; i++) {
			child = $(children[i]);
			o.children[i] = elementToObject(child, o.children) ;
		}
	}
	return o;
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
	$('#link-prop-pagina').sidr({
		name: 'prop-pagina',
		side: 'right',
		source: function(name){
			return getFormulario("pagina");
		}
	});

	addColorPicker();
}

function inicializarPaginas(){



}

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


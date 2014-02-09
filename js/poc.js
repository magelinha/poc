componentes_basicos = [];
layouts = [];
var elementoAtual;
var template = 0;
/** adiciona o eventos de arrastar à todos os compenentes **/ 
function getComponent(nome){
	for(i=0; i<componentes_basicos.length; i++){
		if(componentes_basicos[i].nome === nome) return componentes_basicos[i].html;
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

			addDraggableToComponents();
			addSortableToComponents(".conteudo-ordenado");
			addSortableToComponents(".coluna");
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


}


/** pega todos os itens do menu que são arrastáveis e insere o efeito de arraste (drag)**/
function addDraggableToComponents(){
	$(".componente-arrastavel").each(function(index, value){
		var data = componentes_basicos[index].html;

		index < 4 ? classe = ".conteudo-ordenado" : classe = ".coluna";
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
			addSortableToComponents(".coluna");
		}

	}).disableSelection();
}

function removeStyle(){
	$("*[style]").removeAttr('style');
}

$('#selecionarLayout').on('hidden.bs.modal', function (e) {
	template = $('input[name=layout]:checked', '#formLayout').val();
	$(".conteudo-gerado").html(layouts[template-1].html); //insere o layout escolhido na tela
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


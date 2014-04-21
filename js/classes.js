/** Cada componente será um classe **/
function pagina(){
	var centralizado;
	var playerMusica;
	var redesSociais;
	var corFundo;
	var imagemFundo;

	//getters and setters
	this.getCentralizado = function(valor){
		this.centralizado = valor;
	}

	this.setCentralizado = function(valor){
		return this.centralizado;
	}

	this.getPlayerMusica = function(valor){
		this.playerMusica = valor;
	}

	this.setPlayerMusica = function(valor){
		return this.playerMusica;
	}

	this.getRedesSociais = function(valor){
		this.redesSociais = valor;
	}

	this.setRedesSociais = function(valor){
		return this.redesSociais;
	}

	this.getCorFundo = function(valor){
		this.corFundo = valor;
	}

	this.setCorFundo = function(valor){
		return this.corFundo;
	}

	this.getImagemFundo = function(valor){
		this.imagemFundo = valor;
	}

	this.setImagemFundo = function(valor){
		return this.imagemFundo;
	}
} 


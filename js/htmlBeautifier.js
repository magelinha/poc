(function($){

    var level=0,
        lSize=100,
        finishTabifier = function(code, targetElm) {
        
	        code=code.replace(/\n\s*\n/g, '\n');  //blank lines
	        code=code.replace(/^[\s\n]*/, ''); //leading space
	        code=code.replace(/[\s\n]*$/, ''); //trailing space

	        targetElm.val(code);

	        level=0;

        },
        cleanHTML = function(code, targetElm) {
        
	        var i=0;
	        function cleanAsync() {
		        var iStart=i;
		        for (; i!=code.charAt(point)) point++;
			        tag=code.substr(start, point-start);
			        i=point;

			        //if this is a special tag, deal with it!
			        if ('!--'==tag.substr(1,3)) {
				        if (!tag.match(/--$/)) {
					        while ('-->'!=code.substr(point, 3)) point++;
					        point+=2;
					        tag=code.substr(start, point-start);
					        i=point;
				        }
				        if ('\n'!=out.charAt(out.length-1)) out+='\n';
				        out+=tabs();
				        out+=tag+'>\n';
			        } else if ('!'==tag[1]) {
				        out=placeTag(tag+'>', out);
			        } else if ('?'==tag[1]) {
				        out+=tag+'>\n';
			        } else if (t=tag.match(/^<(script|style)/i)) {
				        t[1]=t[1].toLowerCase();
				        tag=cleanTag(tag);
				        out=placeTag(tag, out);
				        end=String(code.substr(i+1)).toLowerCase().indexOf('');
	        return tag;
        },
        ownLine=['area', 'body', 'head', 'hr', 'i?frame', 'link', 'meta', 'noscript', 'style', 'table', 'tbody', 'thead', 'tfoot'],
        contOwnLine=['li', 'dt', 'dt', 'h[1-6]', 'option', 'script'],
        lineBefore = new RegExp(
	        '^<(/?'+ownLine.join('|/?')+'|'+contOwnLine.join('|')+')[ >]'
        ),
        lineAfter=new RegExp('^<(br|/?'+ownLine.join('|/?')+'|/'+contOwnLine.join('|/')+')[ >]'),
        newLevel=['blockquote', 'div', 'dl', 'fieldset', 'form', 'frameset','map', 'ol', 'p', 'pre', 'select', 'td', 'th', 'tr', 'ul'],
        newLevel=new RegExp('^]'),
        placeTag = function(tag, out) {
	        var nl=tag.match(newLevel);
	        if (tag.match(lineBefore) || nl) {
		        out=out.replace(/\s*$/, '');
		        out+="\n";
	        }

	        if (nl && '/'==tag.charAt(1)) level--;
	        if ('\n'==out.charAt(out.length-1)) out+=tabs();
	        if (nl && '/'!=tag.charAt(1)) level++;

	        out+=tag;
	        if (tag.match(lineAfter) || tag.match(newLevel)) {
		        out=out.replace(/ *$/, '');
		        out+="\n";
	        }
	        return out;
        };


    // plugin definition
    $.fn.htmlBeautifier = function(code, settings) {

        // iterate and reformat each matched element
        return this.each(function() {
        
            cleanHTML(code, $(this));
            
        });
    };

})(jQuery);
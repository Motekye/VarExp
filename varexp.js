// Variable Explorer


VAREXP = {


	root_element: null,
	title_element: null,
	moving: false,
	button_close: null,
	open: false,
	button_shade: null,
	shaded: false,
	button_pin: null,
	pinned: true,
	inner_container: null,
	button_resize: null,
	resizing: false,
	footer_element: null,
	
	W: 244, MNW: 244,
	H: 232, MNH: 122,
	move_event: null,
	up_event: null,
	x: 0, lx: 0, vx: 0,
	y: 0, ly: 0, vy: 0,
	

	/*
	 *	Build the variable explorer layout
	*/
	built: false,
	build: function(){
	
		// main window:
		VAREXP.root_element = document.createElement('div');
		VAREXP.root_element.style = " position:fixed; left:100px; top:100px; z-index:10000; width:244px; height:232px; background-color:#CCC; border:1px solid #000; overflow:hidden; ";
		document.body.appendChild(VAREXP.root_element);
		
		// close button:
		VAREXP.button_close = document.createElement('b');
		VAREXP.button_close.style = " float:right; width:14px; height:14px; background-color:#CCC; border-left:1px solid #000; border:1px solid #FFF; border-bottom:1px solid #888; border-right:1px solid #888; ";
		VAREXP.button_close.style.backgroundImage = VAREXP.image.close;
		VAREXP.button_close.setAttribute('onclick','VAREXP.hide();');
		VAREXP.root_element.appendChild(VAREXP.button_close);
		
		// shade button:
		VAREXP.button_shade = document.createElement('b');
		VAREXP.button_shade.style = " float:left; width:14px; height:14px; background-color:#CCC; border-right:1px solid #000; border:1px solid #FFF; border-bottom:1px solid #888; border-right:1px solid #888; ";
		VAREXP.button_shade.style.backgroundImage = VAREXP.image.shade;
		VAREXP.button_shade.setAttribute('onclick','VAREXP.shade();');
		VAREXP.root_element.appendChild(VAREXP.button_shade);
		
		// pin button:
		VAREXP.button_pin = document.createElement('b');
		VAREXP.button_pin.style = " float:left; width:14px; height:14px; background-color:#CCC; border-right:1px solid #000; border:1px solid #FFF; border-bottom:1px solid #888; border-right:1px solid #888; ";
		VAREXP.button_pin.style.backgroundImage = VAREXP.image.pinned;
		VAREXP.button_pin.setAttribute('onclick','VAREXP.pin();');
		VAREXP.root_element.appendChild(VAREXP.button_pin);
		
		// title bar:
		VAREXP.title_element = document.createElement('div');
		VAREXP.title_element.style = " height:16px; background-color:#006; color:#FFF; font-weight:bold; text-align:center; font-size:12px; border-bottom:1px solid #000; cursor:default; ";
		VAREXP.title_element.setAttribute('onmousedown','VAREXP.moving = true;');
		VAREXP.title_element.innerHTML = "Variable Explorer";
		VAREXP.root_element.appendChild(VAREXP.title_element);
		
		// variable container:
		VAREXP.inner_container = document.createElement('ul');
		VAREXP.inner_container.style = " width:100%; margin-left:-4px; height:calc(100% - 38px ); background-color:#CCC; overflow-y:scroll; overflow-x:hidden;\n\t\t\tfont-size:9px; line-height:10px; color:#000; LSN; margin:0; padding:0; border-top:2px solid #888; border-bottom:2px solid #888; ";
		VAREXP.root_element.appendChild(VAREXP.inner_container);
		
		// resize toggle:
		VAREXP.button_resize = document.createElement('b');
		VAREXP.button_resize.style = " float:right; width:16px; height:16px; margin-top:1px; background-color:#888; cursor:se-resize; ";
		VAREXP.button_resize.style.backgroundImage = VAREXP.image.resize;
		VAREXP.button_resize.setAttribute('onmousedown','VAREXP.resizing = true;');
		VAREXP.root_element.appendChild(VAREXP.button_resize);
		
		// footer bar:
		VAREXP.footer_element = document.createElement('div');
		VAREXP.footer_element.style = " height:16px; color:#222; background-color:#CCC; text-indent:16px; font-size:9px; border-top:1px solid #000; line-height:16px; cursor:default; ";
		VAREXP.footer_element.setAttribute('onmousedown','VAREXP.moving = true;');
		VAREXP.footer_element.innerHTML = "window";
		VAREXP.root_element.appendChild(VAREXP.footer_element);
		
		var e = VAREXP.li(VAREXP.inner_container,'window',window);
		e.style.paddingLeft = 0;
		e.style.backgroundImage = 'none';
		
		VAREXP.inner_container.onscroll = VAREXP.scrollfn;
		
		// done.
		VAREXP.built = true;
	},


	/*
	 *	Open the variable explorer and display window
	*/
	show: function(){
		if(/Android|BB|BlackBerry|iP[hone|ad|od]/.test(navigator.userAgent)){
			alert("The Variable Explorer is not designed for mobile devices. Please try on a PC or Laptop.");
			return;
		}
		if(!VAREXP.built){ VAREXP.build(); }
		VAREXP.root_element.style.display = 'block';
		VAREXP.open = true;
		window.addEventListener('mousemove',VAREXP.movefn);
		window.addEventListener('mouseup',VAREXP.upfn);
	},


	/*
	 *	Hide the variable explorer and display window
	*/
	hide: function(){
		VAREXP.root_element.style.display = 'none';
		VAREXP.open = false;
		window.removeEventListener('mousemove',VAREXP.movefn);
		window.removeEventListener('mouseup',VAREXP.upfn);
	},


	/*
	 *	Display as a shade
	*/
	shade: function(){  
		if(VAREXP.shaded){ 
			VAREXP.root_element.style.height = VAREXP.H+'px';
			VAREXP.button_resize.style.display = 'block';
			VAREXP.shaded = false;
		}
		else { 
			VAREXP.root_element.style.height = 16+'px';
			VAREXP.button_resize.style.display = 'none';
			VAREXP.shaded = true; 
		}
	},


	/*
	 *	Pin the variable explorer to the screen
	*/
	pin: function(){  
		if(VAREXP.pinned){ 
			VAREXP.root_element.style.position = 'absolute'; 
			VAREXP.root_element.style.top = parseInt(VAREXP.root_element.style.top)+window.scrollY+'px';
			VAREXP.root_element.style.left = parseInt(VAREXP.root_element.style.left)+window.scrollX+'px';
			VAREXP.button_pin.style.backgroundImage = VAREXP.image.unpinned;
			VAREXP.pinned = false;
		}
		else { 
			VAREXP.root_element.style.position = 'fixed';
			VAREXP.root_element.style.top = parseInt(VAREXP.root_element.style.top)-window.scrollY+'px';
			VAREXP.root_element.style.left = parseInt(VAREXP.root_element.style.left)-window.scrollX+'px';
			VAREXP.button_pin.style.backgroundImage = VAREXP.image.pinned;
			VAREXP.pinned = true;
		}
	},
	
	
	/*
	 *	Moving the cursor to move or resize window
	*/
	movefn: function(e){
		VAREXP.x = e.clientX + window.scrollX;
		VAREXP.y = e.clientY + window.scrollY;
		VAREXP.vx = VAREXP.x - VAREXP.lx;
		VAREXP.vy = VAREXP.y - VAREXP.ly;
		if(VAREXP.moving){
			VAREXP.root_element.style.left = parseInt(VAREXP.root_element.style.left)+VAREXP.vx+'px';
			VAREXP.root_element.style.top = parseInt(VAREXP.root_element.style.top)+VAREXP.vy+'px';
		}
		if(VAREXP.resizing){
			VAREXP.W += VAREXP.vx;
			VAREXP.H += VAREXP.vy;
			if(VAREXP.W<VAREXP.MNW){ VAREXP.W = VAREXP.MNW; }
			if(VAREXP.H<VAREXP.MNH){ VAREXP.H = VAREXP.MNH; }
			VAREXP.root_element.style.width = VAREXP.W+'px';
			VAREXP.root_element.style.height = VAREXP.H+'px';
		}
		VAREXP.lx = VAREXP.x;
		VAREXP.ly = VAREXP.y;
	},
	
	
	/*
	 *	Releasing the cursor
	*/
	upfn: function(e){
		VAREXP.moving = false;
		VAREXP.resizing = false;
	},


	/*
	 *	Create new list element child for variable
	*/
	li: function(parent,name,val){
		var type = '', tcolor = '#888';
		if(name==''){
			type = '';
			name = '< Nothing >';
			val = '';
		} else {
			// get type information:
			switch(typeof(val)){
				case 'undefined': type = 'Un'; tcolor = '#D66'; break;
				case 'boolean': type = 'Bool'; tcolor = '#6A6'; break;
				case 'string': type = "Str"; tcolor = '#6AA'; break;
				case 'number': type = "Num"; tcolor = '#B96'; break;
				case 'bigint': type = "Big"; tcolor = '#B96'; break;
				case 'symbol': type = "Sym"; break;
				case 'function': type = "Fun"; tcolor = '#96B'; break;
				case 'object':
					if(val==null){ type = "Null"; tcolor = '#D66'; }
					else if(val.nodeType==1){ type = "Elm"; tcolor = '#A69'; }
					
					else { type = "Obj"; }
			}
		}
		// build elements for entry:
		var e=document.createElement('li'), ex=document.createElement('b'), ty=document.createElement('tt'), 
			nm=document.createElement('i'), vl=document.createElement('span'), ul=document.createElement('ul');
		e.style = " display:block; clear:both; height:10px; border-bottom:1px dotted #888; background-repeat:no-repeat; background-position:0 0; padding-left:4px; ";
		e.style.backgroundImage = VAREXP.image.tree_mid;
		parent.appendChild(e);
		ex.style = " display:block; float:left; height:10px; width:10px; padding-right:3px; background-repeat:no-repeat; background-position:2px 2px; ";
		ex.style.backgroundImage = VAREXP.image.noexpand;
		e.appendChild(ex);
		ty.style = " display:block; float:left; height:10px; width:24px; color:#555; font-family:inherit; ";
		ty.style.color = tcolor;
		ty.innerHTML = type;
		e.appendChild(ty);
		vl.style = " display:block; float:right; max-width:calc(100% - 200px ); width:45%; height:10px; color:#000; font-size:8px; line-height:11px; ";
		switch(type){
			case "Un": case "Null": case "Obj": case "Elm": case "Sym":
				break;
			case "Fun":
				vl.innerHTML = '( '+(val.length||'X')+' )';
				vl.style.color = '#666';
				break;
			case "Bool":
				vl.innerHTML = val;
				vl.style.color = (val?'#3A3':'#D44');
				vl.style.fontWeight = 'bold';
				break;
			case "Num": case "Big": 
				vl.innerHTML = val;
				break;
			case "Str":
				if(val.length>20){
					vl.innerHTML = '"'+val.substring(0,17)+'"...';
				} else {
				 	vl.innerHTML = '"'+val+'"';
				}
				vl.style.color = '#369';
				vl.style.fontStyle = 'italic';
		}
		e.appendChild(vl);
		nm.style = " display:block; height:10px; font-style:normal; font-weight:bold; overflow:hidden; ";
		if(type==''){ nm.style.color = '#888'; }
		nm.innerHTML = name;
		e.appendChild(nm);
		// check for descendants, add list:
		if(type=="Obj"){
			e.appendChild(ul);
			ul.style = " clear:both; padding-top:1px; margin-left:1px; padding-left:4px; background-repeat:repeat-y; background-position:04px; display:none; ";
			ul.style.backgroundImage = VAREXP.image.tree_bar;
			ex.style.backgroundImage = VAREXP.image.expand;
			ex.setAttribute('onclick','VAREXP.expand(this);');
		}
		return e;
	},
	
	
	/*
	 *	Click on an [+] expand button
	*/
	expand: function(e){
		var i = 0, b = e.parentNode, a = [], u = e.parentNode.children[4], o = window;
		while(true){
			a[i] = b.children[3].textContent;
			i++;
			b = b.parentNode||null; if(b==null||b.tagName.toLowerCase()!='ul'){ break; }
			b = b.parentNode||null; if(b==null||b.tagName.toLowerCase()!='li'){ break; }
		}
		for(i = a.length-2;i>-1;i--){ o = o[a[i]]; }
		u.style.display = 'block';
		VAREXP.list(u,o);
		e.style.backgroundImage = VAREXP.image.contract;
		e.setAttribute('onclick','VAREXP.contract(this);');
	},
	
	
	/*
	 *	Click on an [-] contract button
	*/
	contract: function(e){
		var p = e.parentNode.children[4];
		p.innerHTML = '';
		p.style.display = 'none';
		e.style.backgroundImage = VAREXP.image.expand;
		e.setAttribute('onclick','VAREXP.expand(this);');
	},
	
	
	/*
	 *	List the properties of an object in a ul list
	*/
	list: function(ul,v){
		var e, i, k = Object.getOwnPropertyNames(v);
		ul.innerHTML = '';
		for(i=0;i<k.length;i++){
			e = VAREXP.li(ul,k[i],v[k[i]]);
		}
		if(k.length==0){
			e = VAREXP.li(ul,'','');
		}
		e.style.backgroundImage = VAREXP.image.tree_end;
	},
	
	
	/*
	 *	Scrolling the view
	*/
	scrollfn: function(e){
		var i, s = '', e = null,  
			cy = VAREXP.inner_container.scrollTop + (VAREXP.inner_container.clientHeight / 2),
			lst = VAREXP.inner_container.getElementsByTagName('ul');
		for(i=lst.length-1;i>-1;i--){
			if(cy > (lst[i].offsetTop)
			&& cy < (lst[i].offsetTop + lst[i].offsetHeight) 
			){  
				e = lst[i].parentNode;
				break;
			}
		}
		if(e==null){
			s = 'window';
		} else {
			s = e.children[3].textContent;
			while(true){
				e = e.parentNode||null; if(e==null||e.tagName.toLowerCase()!='ul'){ break; }
				e = e.parentNode||null; if(e==null||e.tagName.toLowerCase()!='li'){ break; }
				s = e.children[3].textContent + '.<wbr/>' + s;
			}
		}
		VAREXP.footer_element.innerHTML = s;
	},
	
	
	/*
	 *	Store base64 encoded interface graphics
	*/
	image: {
		close:		'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqrrqYFgAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgUgEyS+IKQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAWUlEQVQoz72SQQoAMQgDtW/K/1+QP3VvRWwCiwvrqdgJ6LRJcsegVgzrBAEEAAv2+6WAN70TJCnBeq5Mdjlu3BqSo3bA9b5bHctRIpyw6x3VTi48lpO//9UHL5Ets1kIXw0AAAAASUVORK5CYII="+')',
		shade:		'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqrrqYFgAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgUgJJwDhasAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAQklEQVQoz2M8c+bMfwYyABMDmWAIaWRhYGBgMDExIUnTmTNnIBoZGBgY/v8nLnAZGRmp4FRkk0jSeObMmdEEgAUAABkgC+41r3TZAAAAAElFTkSuQmCC"+')',
		pinned:		'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqrrqYFgAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgUgNIG0lc8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAT0lEQVQoz2M8c+bMfwYyABMDmQCnRhMTEwYTExPSNCJrwKWZ+k6lmUYWXH7DJn7mzBlMG/GFIDY1cBuRTcNlC/X9iM3JuGzG0IjLaVRzKgCalxYvxORPDQAAAABJRU5ErkJggg=="+')',
		unpinned:	'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqrrqYFgAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgUgLJLYDZkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAVElEQVQoz2M8c+bMfwYyABMDmYCFGEUmJiZw9pkzZ4izEVkTXhtxKSToR5hTsAFkOSZCCnCJMZHiL7wasYUgQY3YNOHSTJQfsWlmITZEqZbkyNYIAABVIXnkjrFLAAAAAElFTkSuQmCC"+')',
		resize:		'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqrrqYFgAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgUPOnQQgKUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAWElEQVQ4y6XTsREAIAhD0eBM7D9BdtLKQg+VIP37Re4wkh0f16rQ3euBiUuBiUnqgR1LgR1LG5xwKnDCqQ1e+Bp44esGWRwGsjjcQMVLQMXLBlUMAPb7zgPeXVPFvWVR1wAAAABJRU5ErkJggg=="+')',
		expand:		'url('+"data:image/png;base64,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b20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjNlNmE5NjJjLTZjNmEtNDJkYi05ZWYyLWI0YjNkYzEzODFhYSIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4YzExZjc4OS1kODU0LTQ5OGMtOGJmMC00ODFjZWI5ODFhMzkiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0NmU1Zjc5OS03MjA2LTQ0MTYtOGRiMi0xYTk5M2UzMzBlNzIiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IkxpbnV4IgogICBHSU1QOlRpbWVTdGFtcD0iMTY1NjU4MTk2OTU4MjQ5MCIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjE4IgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiPgogICA8aXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgIDxpcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvblNob3duPgogICA8aXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgIDxpcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpSZWdpc3RyeUlkPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNDNhMGMzZS03ZTczLTQ3M2MtYWIwNC01Mjc5Y2RjZjJhN2QiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSItMDY6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogICA8cGx1czpJbWFnZVN1cHBsaWVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VTdXBwbGllcj4KICAgPHBsdXM6SW1hZ2VDcmVhdG9yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VDcmVhdG9yPgogICA8cGx1czpDb3B5cmlnaHRPd25lcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkNvcHlyaWdodE93bmVyPgogICA8cGx1czpMaWNlbnNvcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkxpY2Vuc29yPgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+K4EedwAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgknHYVdYgAAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAATElEQVQI112NQQ7AIBACZ03/7Bfw1dND1Wg5AMnCQhLZpFpJBGi9dwD2STWJD8AYg4XdAUB1io0Dd+z8uuJroQFUFVXF37c5wle8/Qv1GE7Q+8ZCkQAAAABJRU5ErkJggg=="+')',
		contract:	'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAAGzVWdFAAAIFHpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja1VlbliOpDvzXKmYJiXgIlsPznNnBXf6EALv8qnKX837M2F3GziQhFCEJQVP/39+D/sLLsYnkvMSQQjjwcsklzvgSj/XK89Mcbn6ul+zW3F+n6w3GJYvWrp8x7Osd1xn9eV+ve5yM6/5moNT3jXJ/I++BOO4JLoj2RNasCY62B8p7IMt7Zrd+lz1zSFFuTdjPqflmt/OP9MNZ4eCDEYdPx4dISPge+XAC3poCHZWTPufLGufxN126MjBxt8Ye8zMulFb/2Ga0AZ/War8DrX5P8zNOfg+CZKyEm7S57ceVzTtuLu03L/oTs7Y73LvB5dt2A3q68eAGoe/r9kG9cG3ndXq8YfxruaemN4jEXSfmR0Tjzuj49TdGi2P0ZV12ASaHbdTFEkNzhNGKOsF8LOAt+PP4LvOd8I4Ilwofa0c9Ct7VJMOQeBhnmslmkOnzSzUVGB13FrTMle28FqFF4grJjXX6NoMFwjcb4RYVrmJxlcegjcXMedOcr5qImZtBVzYYzExfevOmP+n003sMjSVjaMeMWQKzhiFgqHL6iW5QxIxNqp8EX973DrmFtZDQT5ojDMxHWUMUb758y06hLfp5tCu4jbT1vA7kMLcHGGMhwRGM9SaYQ5jFGBAZIVA2R2TruEAB4z03gGRnbYA2CAJMTXhGzOzLntd1ZEko4RGmAm0QmhDLOQ//ERfhQ9lb77z3wYuPPvkcbHCECAtBgqbbLFaceAkiEiVJjja66GOIEmNMMSdOFtnYJ4RjiimlnDFnxsg5UEb/jCuFiy2u+BKKlFhSyRXuU131NVSpsaaaGzfbEMctNGmxpZa76XCl7rqnHrr02FPPA7427HDDjzBkxJFGvqq2VX16/0I1s1XjqZT2k6tquCqyWpr+gkFUMyjGzkBxUQXg0KyaHdE4x6qcanYkRlR4Bkiv2jRzZBPYkXXdsB/mqt2Xcr/SjYL7UTf+U+VIpTup3NSNur/R7YVqTZftOhVbUaicHhbRV4zz+KdLIVq6fDnb/rcHCrHHBq+ooSSJI7RQh8EyXAMWRAQtO5CJlRFu3SCXHd343nMbQ0k1wY8hreivgbwt1c47Cav/vOZnV6QR9pI95pOU9Ubl0povA0pyRTOKYCXigPUoeikZP+uoPsloEHc+4RpGIKA+TA9zxiMP8WHON2JBOi59zj5iyjdAN0zMrUDRIhV2St5d4LwEg7JiwsGS9wKQljcTkKcvQBvOBgOHUzg6wB2cF7z5DjR0np1FDp1nZ5FD59lZ5NB5dhY5dJ6dRQ6dZ2eRQ9+yU+D9CRVPx2JZqiszwFJDsGETgKTEKLaQv0s0GLBXal6xGSwb3SFdAb1kzNCjG8Bdk58hi3r6dWtaGDP66Dn8dvQp4m8C9BqfN/mBzmcibf10yCe7wBEsUzJf273u31tOb0xfVuFRv33pyfLdg567fGYhvTH9O0Wf7KbPBb9Xkz4X/L6lzwW/t5o+F/y+pV8IHntHYDECsGCHIRUFQkbpIC1xC+RirJxH97amJKizUC+gaOsxy+DcI6AZ0TnqGjTOoGaHYEaSadgrSwYY1JDzxjhKEVSWMOWodtINGFr4hz6zEpLHgVzSYzAzHyUuuvOyum0DTsSapJU2GWko6g/scCYnKKbqnMSUmZgusBaoDQlZdIPCAukVlC4A96A2JMw+QWnmvoO1QWHKCYsmLkUyU+4F1tx6AfqG9QDqFVd0IessV3Qh6yxXdKPgKa7oQtZZrujRsT7lih4d61Ou6NGxVjJxfEkmmBBBV/QB23z+VjlSNL72jpha4eibVCzO2TSEY+4t2Bgd1xmNoodSWBX1vKxH2GxRzldsImImjqAMX160NlYs3NNU5qZLNXYNM5dqwsOeRpEaC2zOF1pLdB5lruzYMveCKb4f/buW3ncc3o8YlFDAqprqGmYHrHSFdVTlCLhUOYBCUQJIalSxb8Z/Mpt+svs3ZtNvePjJbPrJ7t+YfSu/9fBvBEeIDbvC0qUcTdSDmgTsi10I3g0UarbayKgok+NjuGBHaoI6W4tRV3ZclbU82jLjSji/XzJ3oFPFhvoa6YwVprveZqTXGVIuyTXSZZadLGEGevczzDVIZaaRnxDNSMdufsWW7yu22gp08BmN26BonbpuUHeQEOf3oBakDQhhfgeJ1gbiDtIGhLknJM2Jd6A2JE2JX6DokhPPMkWLqvNM0aLqPFO01TvNFF31O8kU3TrVGabo1qneMNVFNKBmLBpTukMsHh2xWFMoxM5xCDMYXS0JlZbVemugjBsJmzXztazsRWXWcmUZaHXpYf+uzhavC4/MctJq6s8z12CFuxSbX3fp4fb39fWbln7o8NNSea3LL/fpocPF5F9YjGwOo+hbo3eHP7WaPqDj1uqrknQr5Z3hP4r9bDF9Jvaz1vSZ2M8tfSb2s9b0mdi3Nuv/kSHWrBitqWyrrSDuem8mxRqTM6inXLQtxuFyqysjRb8OSkqbByXHCnQ/j330rMSvk5JylHVqI5dTG7NObfJMR8GEfWrTxzy1WWXqMH5uIfSk5HqmVXkdlLQ+D0riPLXJMxM9g9En5lqrWMhfTvw2HD21kXVqY9apzR2cDQZPKxzNUwoHaGjDeQlGT21yfMfOIofOs7PIofPsLHLoPDuLHDrPziKHzrOzyKET7PyYas07n0IlGMSnElFeDsM9dM/sxFNEkXk4d0QTsV/p3Y2MYEbfj9PI/y0f/dsGApkt0T8dCqAUAxUwOwAAAGV6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB42j1KMRKAMAza8wqfECFXm+f0Wgc3B/9/YgbhAhzErvuZthWiGXsgMpaH+APYp4OH4iDoOmDJm5T0WqfWUx05SGN+xl5vVTHtBfZiF21tphVhAAABhGlDQ1BJQ0MgcHJvZmlsZQAAeJx9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqEE1yWwAAD0RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6MzY1ZjQ3MzYtYTQ1MS00N2RkLWExNDYtZjJiYzI0Y2YzYTBlIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRkYWQzMjFlLThlMGYtNDUwOS1iYWRkLWVjZmE5Y2NlMDVhZCIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmJiMmI0NzllLWM4NDAtNDQ0NC1hZWUzLTJjMzVjNzZkZjdlNSIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iTGludXgiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjU2NTgxOTc4MDk1MDA5IgogICBHSU1QOlZlcnNpb249IjIuMTAuMTgiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCI+CiAgIDxpcHRjRXh0OkxvY2F0aW9uQ3JlYXRlZD4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OkxvY2F0aW9uQ3JlYXRlZD4KICAgPGlwdGNFeHQ6TG9jYXRpb25TaG93bj4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgIDxpcHRjRXh0OkFydHdvcmtPck9iamVjdD4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OkFydHdvcmtPck9iamVjdD4KICAgPGlwdGNFeHQ6UmVnaXN0cnlJZD4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNiYWEyMjZiLWZhODItNDA2NS1iOTRmLTQ1YjI2Yjg0ZTAwMCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49Ii0wNjowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgIDxwbHVzOkltYWdlU3VwcGxpZXI+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpJbWFnZVN1cHBsaWVyPgogICA8cGx1czpJbWFnZUNyZWF0b3I+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpJbWFnZUNyZWF0b3I+CiAgIDxwbHVzOkNvcHlyaWdodE93bmVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6Q29weXJpZ2h0T3duZXI+CiAgIDxwbHVzOkxpY2Vuc29yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6TGljZW5zb3I+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7KafMqAAAABmJLR0QA/wAAAAAzJ3zzAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5gYeCScmNFaLJAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABGSURBVAjXZYxRCkAhEAJnozt3BTv19PWWHg0oiChJpE21kggw1loAdKWaxAmw9+ajNwCldhhczHvze71J4gCoqkf9qT4COF35Ttp2Lr87AAAAAElFTkSuQmCC"+')',
		noexpand:	'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqrrqYFgAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgYOLnWX28AAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAO0lEQVQI132NwQkAMAgDr47i+M7iDFmlfRShCPV+RxKyImIDuDuFJACsB6+vzNx8MAbmsM47ku6yF8oPFXkUoQ0NAZEAAAAASUVORK5CYII="+')',
		tree_bar:	'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAALCAYAAAC3ZUeVAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqrrqYFgAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgYeGYfobJ4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAGUlEQVQI12Ps6Oj47+LiwoAMmBiwgCEtCAANYgN5qlwdnwAAAABJRU5ErkJggg=="+')',
		tree_mid:	'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAALCAYAAAC3ZUeVAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqrrqYFgAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgYlKgSK4rAAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAJUlEQVQI12Ps6Oj47+LiwoAMmBiwAAoFWRgYGBj27NmDKUgP2wFmgwZ96FIrkQAAAABJRU5ErkJggg=="+')',
		tree_end:	'url('+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAALCAYAAAC3ZUeVAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVBzuIiGSoThZERRy1CkWoEGqFVh1MLv2CJg1Jiouj4Fpw8GOx6uDirKuDqyAIfoA4OjkpukiJ/0sKLWI8OO7Hu3uPu3eAUC8zzeoYBzTdNlOJuJjJroqhV3RhGEGIiMrMMuYkKQnf8XWPAF/vYjzL/9yfo1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4z6YLEj1xXPH7jXHBZ4JkRM52aJ44Qi4U2VtqYFU2NeIo4qmo65QsZj1XOW5y1cpU178lfGM7pK8tcpzmEBBaxBIk6UlBFCWXYiNGqk2IhRftxH/+g65fIpZCrBEaOBVSgQXb94H/wu1srPznhJYXjQOeL43yMAKFdoFFznO9jx2mcAMFn4Epv+St1YOaT9FpLix4BfdvAxXVLU/aAyx1g4MmQTdmVgjSFfB54P6NvygL9t0DPmtdbcx+nD0CaukreAAeHwGiBstd93t3d3tu/Z5r9/QB6nHKqrrqYFgAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YGHgYlMhfmeuYAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAALUlEQVQI12Ps6Oj47+LiwoAMmBiwAAoFWRgYGBj27NmDIsh45syZ/1S2CKsgAHFKCRHh1lgFAAAAAElFTkSuQmCC"+')'
	}


};

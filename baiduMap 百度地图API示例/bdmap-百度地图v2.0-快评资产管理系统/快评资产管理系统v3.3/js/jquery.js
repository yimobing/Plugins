var js = document.scripts;
js = js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/")+1);
document.writeln('<!--[if lt IE 9]><script type="text/javascript" src="'+js+'html5shiv.min.js"></script><script type="text/javascript" src="'+js+'respond.min.js"></script><script type="text/javascript" src="'+js+'rem.min.js"></script><script type="text/javascript" src="'+js+'qq.js"></script><![endif]-->');
document.writeln('<!--[if !IE]><!--><script src="'+js+'jquery-2.1.4.min.js"></script><!--<![endif]-->');
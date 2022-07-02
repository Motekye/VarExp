# Variable Explorer

![Screenshot of variable explorer](https://github.com/Motekye/VarExp/blob/main/sample.png?raw=true)

The variable explorer is a single javascript file which you may include on your page to view the values of all descendant properties of the **window** object. Simply download the **varexp.js** or **varexp-min.js** file and include on your page with a script tag...

    <script type="text/javascript" src="path/to/varexp.js"></script>

The **varexp-min.js** file is the same program, with all white-space and line breaks removed to reduce file size.

You will also need to launch the variable explorer from inside your page. You can launch it when the page loads by using the attribute below on your body tag...

    <body onload="VAREXP.show();">
    
Or better yet, use an event listener in javascript...

    window.addEventListener("load",VAREXP.show);

Or you can elect to have the variable explorer load when you click on a link. This way you will be able to re-open it if you close it.

    <a href="javascript:VAREXP.show();">Launch Variable Explorer</a>

Whichever way, you'll need to execute the **VAREXP.show();** method to show the explorer the first time, or after any time you close it by clicking the [x] button.

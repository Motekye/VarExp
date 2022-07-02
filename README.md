# Variable Explorer



The variable explorer is a single javascript file which you may include on your page to view the values of all descendant properties of window. Simply download the **varexp.js** or **varexp-min.js** file and include on your page with a script tag...

    <script type="text/javascript" src="path/to/varexp.js"></script>

The **varexp-min.js** file is the same program, with all white-space and line breaks removed to reduce file size.

You will also need to launch the variable explorer from inside your page. You can launch it when the page loads by using the attribute below on your body tag...

    <body onload="VAREXP.show();">

Or you can elect to have the variable explorer load when you click on a link...

    <a href="javascript:VAREXP.show();">Launch Variable Explorer</a>

Either way, you'll need to execute the **VAREXP.show();** method to show the explorer the first time, or after any time you close it by clicking the [x] button.

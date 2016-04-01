# node-add-content-file-to-project

This node module will add a reference to a given content file to your Visual Studio project file. (.csproj / .vbproj)

The project file will only be changed if the file is not already referenced, if changed Visual Studio will prompt you to reload your project file.

To use this node module at a reference to your project package.json dependencies.

{
    "dependencies": {
        "add-content-file-to-project": "1.0.1"
    }
}

The script requires one parameter, the virtual path to the content file you want to add.

So, to use the module in for instance a gulp task:

var addContentFileReference = require('add-content-file-to-project');
    
addContentFileReference.execute('/app/images/some-image.png');

Voilá, a reference to '/app/images/some-image.png' is added to your Visual Studio project.




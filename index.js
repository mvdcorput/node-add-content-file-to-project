var fs = require('fs');
var path = require('path');
var etree = require("elementtree");

exports.execute = function(relativeContentFilename) {
    var content = '';
    
    // Setup relativeContentFilename      
    relativeContentFilename = relativeContentFilename.replace(/\//g, '\\');
    if (relativeContentFilename.charAt(0) === '\\')
    {
        relativeContentFilename = relativeContentFilename.substr(1);
    }
    
    addToProjectFile(relativeContentFilename);
    
    function addToProjectFile(relativeContentFilename) {
        var relativeRootFolder = path.resolve(__dirname).split('\\node_modules')[0];
        
        fs.readdir(relativeRootFolder, function (err, files) {
            if (err) {
                throw err;
            }
            
            var projectFile = '';
            
            files.map(function (file) {
                return path.join(relativeRootFolder, file);
            }).filter(function (file) {
                return fs.statSync(file).isFile();
            }).forEach(function (file) {
                var fileExtension = path.extname(file);
                
                if (projectFile === '' && (fileExtension === '.csproj' || fileExtension === '.vbproj'))
                {
                    projectFile = file;
                }
            });
            
            if (projectFile !== '') {
                addToProjectFileUpsertTypeScriptFile(projectFile, relativeContentFilename)
            }
        });    
    }   
    
    function addToProjectFileUpsertTypeScriptFile(projectFile, relativeContentFilename)
    {
        var data = fs.readFileSync(projectFile).toString();
        var xml = etree.parse(data.toString().replace(/\ufeff/g, ""));
        var projectElement = xml.findall('./Project')[0];
        var typeScriptFileExists = xml.findall('./ItemGroup/Content[@Include=\'' + relativeContentFilename + '\']').length === 1;
        var subElement = etree.SubElement;
        var newItemGroup = subElement(xml.getroot(), 'ItemGroup');
        var itemContent = subElement(newItemGroup, 'Content');
        
        itemContent.set('Include', relativeContentFilename);
        
        var formattor = require("formattor");
        var formattedXml = formattor(xml.write(), {method: 'xml'});
        
        if (!typeScriptFileExists) {
           fs.writeFileSync(projectFile, formattedXml, null);         
        }
    }
}



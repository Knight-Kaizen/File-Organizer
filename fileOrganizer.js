#!/usr/bin/env node     
let ip = process.argv.slice(2);
const { dir } = require("console");
// console.log(ip);
//shebang syntax for node to make it global. 

let fs = require("fs");
const { basename } = require("path");
let path = require("path");
//commands to implement
//  -> tree "dirPath"
//  -> organize "dirPath"
//  -> help


let cmnd = ip[0];

let utilityTypes = {
    media : ["mp4", "mkv"],
    documents : ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', 'xz'],
    archive : ['docx', 'doc', 'pdf', 'xlxs', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex', 'PDF', 'pptx'],
    app : ['deb', 'exe', 'dmg', 'pkg']
}

switch(cmnd){
    case "help":
        getHelp(ip[1]);
        break;
    case "tree":
        getTree(ip[1]);
        break;
    case "organize":
        getOrganize(ip[1]);
        break;
    default:
        console.log("Please give correct input or call help module ");
        break;
}

function getHelp(dirPath){
    console.log("In help Fxn!");
    console.log(`
        List of all commands: 
            node file_name.js help
            node file_name.js "organise dirPath"
            node file_name.js "tree dirPath"
    `);
}

function getTree(dirPath){
    console.log("In tree fxn");
    if(dirPath == undefined){
        console.log("Enter correct path");
        dirPath = process.cwd();
        getHelp();
    }
    else{
        let doesexist = fs.existsSync(dirPath);
        if(doesexist){
            treeHelper(dirPath, " ");
        }
        else{
            console.log("Enter correct path");
            getHelp();
        }
    }
}

function treeHelper(dirPath, indent){
    console.log("In tree Helper!");
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        let fileName = path.basename(dirPath);
        console.log(indent  + "|__" + fileName);
    }
    else{
        let dirName = path.basename(dirPath);
        console.log(indent + "--> " + dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i =0; i<childrens.length; i++){
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}


function getOrganize(dirPath){
    console.log("In organize fxn");
    //Steps to complete: 
    //1) create new direcory named organized dir
    // *) Check if no address is given by user it automatic takes undefined.
    if(dirPath == undefined){
        // console.log("Wrong address");
        // getHelp();
        dirPath = process.cwd();
        return;
    }
    else{
        let doesexist = fs.existsSync(dirPath);
        if(doesexist){
            //2) categorise all files based on their type
            let destPath = path.join(dirPath, "organized_files");
            if(fs.existsSync(destPath) == false){
                fs.mkdirSync(destPath);
            }
            organizeHelper(dirPath, destPath);
        }
        else{
            console.log("Wrong address");
            getHelp();
            return;
        }
        
    }
    
    //3) create directorise inside organized dir on the basis of their types
    
}

function organizeHelper(src, dest){
    //Categorize!!
    console.log("In organize Helper fxn");
    let childNames = fs.readdirSync(src);
    // console.log(childNames);
    for(let i =0; i<childNames.length; i++){
        let childAdd = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAdd).isFile();
        if(isFile){
            // console.log(childNames[i]);
            //4) move files in their desired directories.
            let cat = getCategory(childNames[i]);
            console.log(cat);
            sendFile(childAdd, dest, cat);
        }
        
    }
}

function getCategory(name){
    let ext = path.extname(name);
    ext = ext.slice(1);
    // console.log(ext);

    for(let type in utilityTypes){
        let currType = utilityTypes[type];
        for(let i = 0; i<currType.length; i++){
            if(ext == currType[i])
            return type;
        }
    }
    return "others";
}

function sendFile(file_name, file_dest, file_cat){
    //transfer file_name to destination dir inside file_cat category
    let catPath = path.join(file_dest, file_cat);
    if(fs.existsSync(catPath) == false){
        fs.mkdirSync(catPath);
    }
    let fileName = path.basename(file_name);
    let fileAdd = path.join(catPath, fileName);

    fs.copyFileSync(file_name, fileAdd);
    fs.unlinkSync(file_name);
}
// "C:\Users\aufer\Downloads";;
// call => organize "C:\Users\aufer\Downloads"


import "./style.css"
import ProjectManager from "./modules/projectManager.js"
import DOMcontroller from "./modules/dom.js";
import toDoStorage from "./modules/storageManager.js";


const projectManager = new ProjectManager();
const storageManager = new toDoStorage()
const domController = new DOMcontroller(projectManager, storageManager);


function initializeApp(){

    const savedData = storageManager.loadProjects();
    

    if(savedData){
        
        projectManager.loadFromData(savedData)

    }
    else{
        console.log('bitch it failed');
    }

    domController.init();
}

initializeApp();






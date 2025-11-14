import "./style.css"
import ProjectManager from "./modules/projectManager.js"
import DOMcontroller from "./modules/dom.js";


const manager = new ProjectManager();
manager.createProject("School");



const dom = new DOMcontroller(manager)

dom.init()

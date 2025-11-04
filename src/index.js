import "./style.css";
import Project from "./modules/project.js";
import ProjectManager from "./modules/projectManager.js";
import { renderTodo } from "./modules/dom.js";


const manager = new ProjectManager();
manager.addProject("School");
manager.addProject("Work");

manager.addTodoToProject("School","Jandel","Jandel","Jandel","mid")

console.log(manager.getAllProject())








